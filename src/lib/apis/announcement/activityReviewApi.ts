import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import {
  POSITIVE_REASON_CODES,
  type ActivityReviewCursorListResponse,
  type ActivityReviewEntity,
  type ActivityReviewListItem,
  type ActivityReviewRating,
  type ActivityReviewTagSummaryItem,
  type ActivityReviewUserSummary,
  type PositiveReasonCode,
} from "./activityReviewTypes";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function pickString(
  o: Record<string, unknown>,
  camel: string,
  snake?: string,
): string {
  const a = o[camel];
  if (typeof a === "string" && a) return a;
  if (snake) {
    const b = o[snake];
    if (typeof b === "string" && b) return b;
  }
  return "";
}

function candidateApiBases(): string[] {
  const b = API_BASE.replace(/\/$/, "");
  if (b.endsWith("/api")) return [b];
  return [b, `${b}/api`];
}

async function fetchReviewPath(
  path: string,
  options: RequestInit & { headers: Record<string, string> },
): Promise<Response> {
  const p = path.startsWith("/") ? path : `/${path}`;
  const bases = candidateApiBases();
  let last!: Response;
  for (let i = 0; i < bases.length; i++) {
    const base = bases[i].replace(/\/$/, "");
    const url = `${base}${p}`;
    const res = await fetchWithAuth(url, options);
    last = res;
    if (res.ok) return res;
    if (res.status === 404 && i < bases.length - 1) continue;
    return res;
  }
  return last;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function parseReview(raw: Record<string, unknown>): ActivityReviewEntity | null {
  const id = pickString(raw, "id");
  const postId = pickString(raw, "postId", "post_id");
  const reviewerUserId =
    pickString(raw, "reviewerUserId", "reviewer_user_id") ||
    pickString(asRecord(raw.reviewer), "userId", "user_id");
  const revieweeUserId =
    pickString(raw, "revieweeUserId", "reviewee_user_id") ||
    pickString(asRecord(raw.reviewee), "userId", "user_id");
  const rating = raw.rating as ActivityReviewRating;
  const createdAt = pickString(raw, "createdAt", "created_at");
  if (!id || !postId || !reviewerUserId || !revieweeUserId || !createdAt)
    return null;
  const codesRaw = raw.disappointmentReasonCodes ?? raw.disappointment_reason_codes;
  let disappointmentReasonCodes: ActivityReviewEntity["disappointmentReasonCodes"] =
    null;
  if (Array.isArray(codesRaw)) {
    disappointmentReasonCodes = codesRaw.filter(
      (c): c is NonNullable<ActivityReviewEntity["disappointmentReasonCodes"]>[number] =>
        typeof c === "string",
    );
  }
  const positiveCodesRaw = raw.positiveReasonCodes ?? raw.positive_reason_codes;
  let positiveReasonCodes: ActivityReviewEntity["positiveReasonCodes"] = null;
  if (Array.isArray(positiveCodesRaw)) {
    positiveReasonCodes = positiveCodesRaw.filter(
      (c): c is NonNullable<ActivityReviewEntity["positiveReasonCodes"]>[number] =>
        typeof c === "string",
    );
  }
  const commentRaw = raw.comment;
  const comment = commentRaw === null || typeof commentRaw === "string" ? commentRaw : null;
  return {
    id,
    postId,
    reviewerUserId,
    revieweeUserId,
    rating,
    disappointmentReasonCodes,
    positiveReasonCodes,
    comment,
    createdAt,
  };
}

function parseUserSummary(raw: unknown): ActivityReviewUserSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const userId = pickString(o, "userId", "user_id");
  if (!userId) return null;
  const profileImgRaw = o.profileImgUrl ?? o.profile_img_url;
  return {
    userId,
    name: pickString(o, "name"),
    activityName: pickString(o, "activityName", "activity_name"),
    profileImgUrl:
      profileImgRaw === null || typeof profileImgRaw === "string"
        ? profileImgRaw
        : null,
  };
}

function parseReviewListItem(raw: unknown): ActivityReviewListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const base = parseReview(o);
  if (!base) return null;

  const annRaw = o.announcement;
  let announcement: ActivityReviewListItem["announcement"] = null;
  if (annRaw && typeof annRaw === "object") {
    const a = annRaw as Record<string, unknown>;
    const postId = pickString(a, "postId", "post_id");
    if (postId) {
      announcement = {
        postId,
        title: pickString(a, "title"),
        scheduledAt:
          a.scheduledAt === null ||
          a.scheduled_at === null ||
          typeof a.scheduledAt === "string" ||
          typeof a.scheduled_at === "string"
            ? ((a.scheduledAt ?? a.scheduled_at) as string | null)
            : null,
      };
    }
  }

  return {
    ...base,
    announcement,
    reviewer: parseUserSummary(o.reviewer),
    reviewee: parseUserSummary(o.reviewee),
    hiddenFromProfileAt: parseOptionalIsoDate(
      o.hiddenFromProfileAt ?? o.hidden_from_profile_at,
    ),
  };
}

function parseOptionalIsoDate(raw: unknown): string | null {
  if (raw === null) return null;
  if (typeof raw === "string" && raw.trim()) return raw;
  return null;
}

function parseCursorList(raw: unknown): ActivityReviewCursorListResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const arr = Array.isArray(o.items) ? o.items : [];
  const items = arr
    .map((x) => parseReviewListItem(x))
    .filter((x): x is ActivityReviewListItem => x !== null);
  const cursorRaw = o.nextCursor ?? o.next_cursor;
  const nextCursor =
    cursorRaw === null || typeof cursorRaw === "string"
      ? cursorRaw
      : null;
  const hasMoreRaw = o.hasMore ?? o.has_more;
  const hasMore = typeof hasMoreRaw === "boolean" ? hasMoreRaw : false;
  return { items, nextCursor, hasMore };
}

export type SubmitActivityReviewBody = {
  revieweeUserId: string;
  rating: ActivityReviewRating;
  disappointmentReasonCodes?: string[] | null;
  positiveReasonCodes?: string[] | null;
  comment?: string | null;
};

export async function submitActivityReview(
  postId: string,
  body: SubmitActivityReviewBody,
): Promise<
  | { ok: true; data: ActivityReviewEntity }
  | { ok: false; status: number; message?: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(
      `/announcement/${encodeURIComponent(postId)}/reviews`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      let message = text;
      try {
        const j = JSON.parse(text) as { message?: unknown };
        if (typeof j.message === "string") message = j.message;
      } catch {
        /* plain */
      }
      return { ok: false, status: res.status, message };
    }
    const raw = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    const data = parseReview(raw);
    if (!data) return { ok: false, status: res.status, message: "응답 파싱 실패" };
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/** GET /announcement/:postId/reviews/me — 없으면 null */
export async function getMyActivityReview(
  postId: string,
): Promise<ActivityReviewEntity | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(
      `/announcement/${encodeURIComponent(postId)}/reviews/me`,
      { method: "GET", headers },
    );
    if (res.status === 404) return null;
    const text = await res.text().catch(() => "");
    if (!res.ok) return null;
    if (!text || text === "null") return null;
    const raw = JSON.parse(text) as Record<string, unknown>;
    if (!raw || typeof raw !== "object") return null;
    return parseReview(raw);
  } catch {
    return null;
  }
}

export async function getMyActivityReviewList(params?: {
  cursor?: string | null;
  limit?: number;
}): Promise<ActivityReviewCursorListResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await fetchReviewPath(
      `/reviews/me${qs ? `?${qs}` : ""}`,
      { method: "GET", headers },
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    return parseCursorList(raw);
  } catch {
    return null;
  }
}

export async function getReceivedActivityReviewList(params?: {
  cursor?: string | null;
  limit?: number;
  hiddenOnly?: boolean;
}): Promise<ActivityReviewCursorListResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.hiddenOnly) q.set("hiddenOnly", "true");
    const qs = q.toString();
    const res = await fetchReviewPath(
      `/reviews/received${qs ? `?${qs}` : ""}`,
      { method: "GET", headers },
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    return parseCursorList(raw);
  } catch {
    return null;
  }
}

function parseTagSummary(raw: unknown): ActivityReviewTagSummaryItem[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set<string>(POSITIVE_REASON_CODES);
  const out: ActivityReviewTagSummaryItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    const code = o.code;
    const count = o.count;
    if (typeof code === "string" && allowed.has(code) && typeof count === "number") {
      out.push({ code: code as PositiveReasonCode, count });
    }
  }
  return out;
}

/** 내가 받은 후기의 긍정 사유 태그 집계 — GET /reviews/received/tag-summary */
export async function getReceivedActivityReviewTagSummary(): Promise<
  ActivityReviewTagSummaryItem[] | null
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(`/reviews/received/tag-summary`, {
      method: "GET",
      headers,
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as unknown;
    return parseTagSummary(raw);
  } catch {
    return null;
  }
}

/** 특정 유저가 받은 후기의 긍정 사유 태그 집계 — GET /users/:userId/reviews/received/tag-summary */
export async function getUserReceivedActivityReviewTagSummary(
  userId: string,
): Promise<ActivityReviewTagSummaryItem[] | null> {
  if (!userId?.trim()) return null;
  try {
    const res = await fetchReviewPath(
      `/users/${encodeURIComponent(userId)}/reviews/received/tag-summary`,
      { method: "GET", headers: { "Content-Type": "application/json" } },
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as unknown;
    return parseTagSummary(raw);
  } catch {
    return null;
  }
}

export async function hasHiddenReceivedActivityReviews(): Promise<boolean> {
  const res = await getReceivedActivityReviewList({ limit: 1, hiddenOnly: true });
  return (res?.items.length ?? 0) > 0;
}

/** 특정 유저가 받은 활동 후기 — GET /users/:userId/reviews/received */
export async function getUserReceivedActivityReviewList(
  userId: string,
  params?: { cursor?: string | null; limit?: number },
): Promise<ActivityReviewCursorListResponse | null> {
  if (!userId?.trim()) return null;
  try {
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await fetchReviewPath(
      `/users/${encodeURIComponent(userId)}/reviews/received${qs ? `?${qs}` : ""}`,
      { method: "GET", headers: { "Content-Type": "application/json" } },
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    return parseCursorList(raw);
  } catch {
    return null;
  }
}

export type UpdateActivityReviewBody = {
  rating?: ActivityReviewRating;
  disappointmentReasonCodes?: string[] | null;
  positiveReasonCodes?: string[] | null;
  comment?: string | null;
};

export async function updateMyActivityReview(
  reviewId: string,
  body: UpdateActivityReviewBody,
): Promise<
  | { ok: true; data: ActivityReviewEntity }
  | { ok: false; status: number; message?: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(
      `/reviews/${encodeURIComponent(reviewId)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) return { ok: false, status: res.status, message: text };
    const raw = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    const data = parseReview(raw);
    if (!data) return { ok: false, status: res.status, message: "응답 파싱 실패" };
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

export async function hideActivityReviewFromProfile(
  reviewId: string,
): Promise<{ ok: true } | { ok: false; status: number; message?: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(
      `/reviews/${encodeURIComponent(reviewId)}/hide-from-profile`,
      { method: "PATCH", headers },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: parseErrorMessage(text) || "숨김 처리에 실패했습니다.",
      };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

export async function unhideActivityReviewFromProfile(
  reviewId: string,
): Promise<{ ok: true } | { ok: false; status: number; message?: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(
      `/reviews/${encodeURIComponent(reviewId)}/unhide-from-profile`,
      { method: "PATCH", headers },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: parseErrorMessage(text) || "다시 표시에 실패했습니다.",
      };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

function parseErrorMessage(text: string): string {
  const t = text?.trim() ?? "";
  if (!t) return "";
  try {
    const o = JSON.parse(t) as { message?: unknown };
    if (typeof o.message === "string") return o.message;
  } catch {
    /* plain */
  }
  return t.length > 400 ? `${t.slice(0, 400)}...` : t;
}

export async function deleteMyActivityReview(
  reviewId: string,
): Promise<{ ok: true } | { ok: false; status: number; message?: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchReviewPath(
      `/reviews/${encodeURIComponent(reviewId)}`,
      { method: "DELETE", headers },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) return { ok: false, status: res.status, message: text };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}
