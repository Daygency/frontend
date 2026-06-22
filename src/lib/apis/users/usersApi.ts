import { API_BASE } from "../api";
import type { UserListItem, UserListResponse } from "./types";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function normalizeMajor(raw: unknown): UserListItem["major"] {
  if (raw == null) return null;
  const m = asRecord(raw);
  const majorId = String(m.majorId ?? m.major_id ?? "");
  const name = typeof m.name === "string" ? m.name : "";
  if (!majorId && !name) return null;
  return { majorId: majorId || "", name: name || "" };
}

function normalizeUserItem(raw: unknown): UserListItem | null {
  const r = asRecord(raw);
  const userId = String(r.userId ?? r.user_id ?? "");
  if (!userId) return null;
  return {
    userId,
    name: typeof r.name === "string" ? r.name : "",
    activityName:
      typeof r.activityName === "string"
        ? r.activityName
        : typeof r.activity_name === "string"
          ? r.activity_name
          : "",
    profileImgUrl:
      typeof r.profileImgUrl === "string"
        ? r.profileImgUrl
        : typeof r.profile_img_url === "string"
          ? r.profile_img_url
          : "",
    aboutMe:
      typeof r.aboutMe === "string" || r.aboutMe === null
        ? (r.aboutMe as string | null)
        : typeof r.about_me === "string" || r.about_me === null
          ? (r.about_me as string | null)
          : null,
    createdAt:
      typeof r.createdAt === "string"
        ? r.createdAt
        : typeof r.created_at === "string"
          ? r.created_at
          : "",
    major: normalizeMajor(r.major),
  };
}

export type GetUsersParams = {
  limit?: number;
  cursor?: string;
  /** 콤마로 구분된 전공 UUID */
  majorIds?: string;
  q?: string;
};

/**
 * 유저 목록 (가입일 최신순, 커서 페이지네이션). 인증 불필요.
 * GET /users
 */
export async function getUsers(
  params?: GetUsersParams,
): Promise<UserListResponse | null> {
  try {
    const q = new URLSearchParams();
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.majorIds) q.set("majorIds", params.majorIds);
    if (params?.q?.trim()) q.set("q", params.q.trim());

    const qs = q.toString();
    const url = `${API_BASE}/users${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      console.warn("[getUsers] 실패:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    const d = asRecord(data);
    const rawItems = Array.isArray(d.items) ? d.items : [];
    const items = rawItems
      .map(normalizeUserItem)
      .filter(Boolean) as UserListItem[];
    return {
      items,
      nextCursor:
        typeof d.nextCursor === "string"
          ? d.nextCursor
          : typeof d.next_cursor === "string"
            ? d.next_cursor
            : null,
      hasMore: Boolean(d.hasMore ?? d.has_more),
    };
  } catch (e) {
    console.warn("[getUsers] 네트워크 에러:", e);
    return null;
  }
}
