import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  InboxListResponse,
  InboxRecipientItem,
  MarkAllReadResponse,
} from "./inboxTypes";

export type PushDevicePlatform = "IOS" | "ANDROID" | "WEB";

async function authJsonHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("로그인이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return "";
    const data = JSON.parse(text) as { message?: string; error?: string };
    return data.message ?? data.error ?? text;
  } catch {
    return "";
  }
}

/** Swagger 전역 prefix `/api` 와 생략 호스트 모두 지원 (`majorApi.candidateApiBases` 와 동일) */
function candidateApiBases(): string[] {
  const b = API_BASE.replace(/\/$/, "");
  if (b.endsWith("/api")) return [b];
  return [b, `${b}/api`];
}

/**
 * `GET|PATCH|POST|DELETE …/notifications/…` — 첫 베이스가 404면 `/api` 붙인 베이스로 재시도
 */
async function fetchNotificationPath(
  path: string,
  options: RequestInit & { headers: Record<string, string> },
): Promise<Response> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const bases = candidateApiBases();
  let last!: Response;
  for (let i = 0; i < bases.length; i++) {
    const base = bases[i].replace(/\/$/, "");
    const url = `${base}${normalized}`;
    const res = await fetchWithAuth(url, options);
    last = res;
    if (res.ok) return res;
    if (res.status === 404 && i < bases.length - 1) continue;
    if (__DEV__ && !res.ok) {
      console.warn(
        `[notifications] ${options.method ?? "GET"} ${url} → ${res.status}`,
      );
    }
    return res;
  }
  return last;
}

export type RegisterPushDeviceResult =
  | { ok: true }
  | { ok: false; status: number; message?: string };

/**
 * POST /notifications/devices — FCM 등록 토큰 등록/갱신
 * @see README.md (알림 · 푸시)
 */
export async function registerPushDevice(params: {
  fcmToken: string;
  platform?: PushDevicePlatform;
}): Promise<RegisterPushDeviceResult> {
  try {
    const headers = await authJsonHeaders();
    const body: { fcmToken: string; platform?: PushDevicePlatform } = {
      fcmToken: params.fcmToken,
    };
    if (params.platform) body.platform = params.platform;
    const res = await fetchNotificationPath("/notifications/devices", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

export type UnregisterPushDeviceResult =
  | { ok: true }
  | { ok: false; status: number; message?: string };

/**
 * DELETE /notifications/devices — body: { fcmToken }
 */
export async function unregisterPushDevice(params: {
  fcmToken: string;
}): Promise<UnregisterPushDeviceResult> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath("/notifications/devices", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ fcmToken: params.fcmToken }),
    });
    if (res.ok) return { ok: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

function pickStr(
  o: Record<string, unknown>,
  camel: string,
  snake: string,
): string {
  const a = o[camel];
  const b = o[snake];
  if (typeof a === "string" && a) return a;
  if (typeof b === "string" && b) return b;
  return "";
}

function parseInboxItem(raw: unknown): InboxRecipientItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const recipientId = pickStr(o, "recipientId", "recipient_id");
  const readRaw = o.readAt ?? o.read_at;
  const readAt =
    readRaw === null || typeof readRaw === "string" ? readRaw : null;
  const notice = o.notice;
  if (!notice || typeof notice !== "object") return null;
  const n = notice as Record<string, unknown>;
  const id = pickStr(n, "id", "notice_id");
  const targetType = pickStr(
    n,
    "targetType",
    "target_type",
  ) as InboxRecipientItem["notice"]["targetType"];
  const targetId = pickStr(n, "targetId", "target_id");
  const lk = n.likeKind ?? n.like_kind;
  const likeKind =
    lk === null || typeof lk === "string"
      ? (lk as InboxRecipientItem["notice"]["likeKind"])
      : null;
  const content =
    n.content === null || typeof n.content === "string" ? n.content : null;
  const createdAt = pickStr(n, "createdAt", "created_at");
  let actor: InboxRecipientItem["notice"]["actor"] = null;
  if (n.actor !== null && typeof n.actor === "object") {
    const a = n.actor as Record<string, unknown>;
    const userId = pickStr(a, "userId", "user_id");
    if (userId) {
      const pImg = a.profileImgUrl ?? a.profile_img_url;
      actor = {
        userId,
        name: pickStr(a, "name", "name"),
        activityName: pickStr(a, "activityName", "activity_name"),
        profileImgUrl:
          pImg === null || typeof pImg === "string" ? pImg : null,
      };
    }
  }
  if (!recipientId || !id || !targetType || !targetId) return null;
  return {
    recipientId,
    readAt,
    notice: {
      id,
      targetType,
      targetId,
      likeKind,
      content,
      createdAt,
      actor,
    },
  };
}

function parseInboxListResponse(raw: unknown): InboxListResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const rawItems = Array.isArray(o.items) ? o.items : [];
  const items: InboxRecipientItem[] = [];
  for (const row of rawItems) {
    const parsed = parseInboxItem(row);
    if (parsed) items.push(parsed);
  }
  const nc = o.nextCursor ?? o.next_cursor;
  const nextCursor =
    nc === null || typeof nc === "string" ? nc : null;
  const hm = o.hasMore ?? o.has_more;
  const hasMore = typeof hm === "boolean" ? hm : false;
  return { items, nextCursor, hasMore };
}

/**
 * GET /notifications/push-enabled — 실제 알림(댓글/팔로우 등) 수신 여부
 */
export async function getPushEnabled(): Promise<boolean | null> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath("/notifications/push-enabled", {
      method: "GET",
      headers,
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    const v = raw.isPushEnabled ?? raw.is_push_enabled;
    return typeof v === "boolean" ? v : null;
  } catch (e) {
    if (__DEV__) console.warn("[getPushEnabled]", e);
    return null;
  }
}

/**
 * PATCH /notifications/push-enabled — 실제 알림(댓글/팔로우 등) 수신 여부 설정
 */
export async function setPushEnabled(isPushEnabled: boolean): Promise<boolean> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath("/notifications/push-enabled", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isPushEnabled }),
    });
    return res.ok;
  } catch (e) {
    if (__DEV__) console.warn("[setPushEnabled]", e);
    return false;
  }
}

export type PushCategoryPreferences = {
  follow: boolean;
  application: boolean;
  review: boolean;
  inquiry: boolean;
  comment: boolean;
  like: boolean;
  announcementMatch: boolean;
};

function parsePushCategoryPreferences(
  raw: unknown,
): PushCategoryPreferences | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.follow !== "boolean" ||
    typeof o.application !== "boolean" ||
    typeof o.review !== "boolean" ||
    typeof o.inquiry !== "boolean" ||
    typeof o.comment !== "boolean" ||
    typeof o.like !== "boolean"
  ) {
    return null;
  }
  return {
    follow: o.follow,
    application: o.application,
    review: o.review,
    inquiry: o.inquiry,
    comment: o.comment,
    like: o.like,
    // 이 필드가 없는 이전 서버에서도 설정 화면이 깨지지 않도록 기본값 true
    announcementMatch:
      typeof o.announcementMatch === "boolean" ? o.announcementMatch : true,
  };
}

/**
 * GET /notifications/push-category-preferences — 케이스별(팔로우/지원/후기/문의/댓글/좋아요) 푸시 수신 여부
 */
export async function getPushCategoryPreferences(): Promise<PushCategoryPreferences | null> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath(
      "/notifications/push-category-preferences",
      { method: "GET", headers },
    );
    if (!res.ok) return null;
    return parsePushCategoryPreferences(await res.json());
  } catch (e) {
    if (__DEV__) console.warn("[getPushCategoryPreferences]", e);
    return null;
  }
}

/**
 * PATCH /notifications/push-category-preferences — 케이스별 푸시 수신 여부 설정(부분 업데이트)
 */
export async function setPushCategoryPreferences(
  patch: Partial<PushCategoryPreferences>,
): Promise<PushCategoryPreferences | null> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath(
      "/notifications/push-category-preferences",
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(patch),
      },
    );
    if (!res.ok) return null;
    return parsePushCategoryPreferences(await res.json());
  } catch (e) {
    if (__DEV__) console.warn("[setPushCategoryPreferences]", e);
    return null;
  }
}

/**
 * GET /notifications — 인박스 (커서 페이지네이션)
 * @see README.md (알림 API)
 */
export async function getNotificationInbox(params?: {
  cursor?: string | null;
  limit?: number;
}): Promise<InboxListResponse | null> {
  try {
    const headers = await authJsonHeaders();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const path = `/notifications${qs ? `?${qs}` : ""}`;
    const res = await fetchNotificationPath(path, { method: "GET", headers });
    if (!res.ok) return null;
    const raw = await res.json();
    return parseInboxListResponse(raw);
  } catch (e) {
    if (__DEV__) console.warn("[getNotificationInbox]", e);
    return null;
  }
}

/**
 * GET /notifications/unread-count
 */
export async function getNotificationUnreadCount(): Promise<number | null> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath("/notifications/unread-count", {
      method: "GET",
      headers,
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    const n =
      typeof raw.unreadCount === "number"
        ? raw.unreadCount
        : typeof raw.unread_count === "number"
          ? raw.unread_count
          : undefined;
    return typeof n === "number" ? n : 0;
  } catch (e) {
    if (__DEV__) console.warn("[getNotificationUnreadCount]", e);
    return null;
  }
}

/**
 * PATCH /notifications/read-all
 */
export async function markAllNotificationsRead(): Promise<
  MarkAllReadResponse | null
> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath("/notifications/read-all", {
      method: "PATCH",
      headers,
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    const u =
      typeof raw.updated === "number"
        ? raw.updated
        : typeof raw.updated_count === "number"
          ? raw.updated_count
          : 0;
    return { updated: u };
  } catch (e) {
    if (__DEV__) console.warn("[markAllNotificationsRead]", e);
    return null;
  }
}

/**
 * PATCH /notifications/recipients/:recipientId/read
 */
export async function markNotificationRecipientRead(
  recipientId: string,
): Promise<boolean> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchNotificationPath(
      `/notifications/recipients/${encodeURIComponent(recipientId)}/read`,
      { method: "PATCH", headers },
    );
    return res.ok;
  } catch {
    return false;
  }
}
