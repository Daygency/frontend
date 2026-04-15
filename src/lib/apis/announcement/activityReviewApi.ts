import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  ActivityReviewCursorListResponse,
  ActivityReviewEntity,
  ActivityReviewListItem,
  ActivityReviewRating,
  ActivityReviewUserSummary,
} from "./activityReviewTypes";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function parseReview(raw: Record<string, unknown>): ActivityReviewEntity | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  const postId = typeof raw.postId === "string" ? raw.postId : "";
  const reviewerUserId =
    typeof raw.reviewerUserId === "string" ? raw.reviewerUserId : "";
  const revieweeUserId =
    typeof raw.revieweeUserId === "string" ? raw.revieweeUserId : "";
  const rating = raw.rating as ActivityReviewRating;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : "";
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
  const note = raw.privateNoteToOps ?? raw.private_note_to_ops;
  const privateNoteToOps =
    note === null || typeof note === "string" ? note : null;
  return {
    id,
    postId,
    reviewerUserId,
    revieweeUserId,
    rating,
    disappointmentReasonCodes,
    privateNoteToOps,
    createdAt,
  };
}

function parseUserSummary(raw: unknown): ActivityReviewUserSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const userId = typeof o.userId === "string" ? o.userId : "";
  if (!userId) return null;
  return {
    userId,
    nickname: typeof o.nickname === "string" ? o.nickname : "",
    activityName: typeof o.activityName === "string" ? o.activityName : "",
    profileImgUrl:
      o.profileImgUrl === null || typeof o.profileImgUrl === "string"
        ? o.profileImgUrl
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
    const postId = typeof a.postId === "string" ? a.postId : "";
    if (postId) {
      announcement = {
        postId,
        title: typeof a.title === "string" ? a.title : "",
        scheduledAt:
          a.scheduledAt === null || typeof a.scheduledAt === "string"
            ? a.scheduledAt
            : null,
      };
    }
  }

  return {
    ...base,
    announcement,
    reviewer: parseUserSummary(o.reviewer),
    reviewee: parseUserSummary(o.reviewee),
  };
}

function parseCursorList(raw: unknown): ActivityReviewCursorListResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const arr = Array.isArray(o.items) ? o.items : [];
  const items = arr
    .map((x) => parseReviewListItem(x))
    .filter((x): x is ActivityReviewListItem => x !== null);
  const nextCursor =
    o.nextCursor === null || typeof o.nextCursor === "string"
      ? o.nextCursor
      : null;
  const hasMore = typeof o.hasMore === "boolean" ? o.hasMore : false;
  return { items, nextCursor, hasMore };
}

export type SubmitActivityReviewBody = {
  revieweeUserId: string;
  rating: ActivityReviewRating;
  disappointmentReasonCodes?: string[] | null;
  privateNoteToOps?: string | null;
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
    const res = await fetchWithAuth(
      `${API_BASE}/announcement/${encodeURIComponent(postId)}/reviews`,
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
    const res = await fetchWithAuth(
      `${API_BASE}/announcement/${encodeURIComponent(postId)}/reviews/me`,
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
    const res = await fetchWithAuth(
      `${API_BASE}/reviews/me${qs ? `?${qs}` : ""}`,
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
}): Promise<ActivityReviewCursorListResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/reviews/received${qs ? `?${qs}` : ""}`,
      { method: "GET", headers },
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
  privateNoteToOps?: string | null;
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
    const res = await fetchWithAuth(
      `${API_BASE}/reviews/${encodeURIComponent(reviewId)}`,
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

export async function deleteMyActivityReview(
  reviewId: string,
): Promise<{ ok: true } | { ok: false; status: number; message?: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/reviews/${encodeURIComponent(reviewId)}`,
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
