import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type { PaginatedResponse } from "../pagination";
import type {
  MyAnnouncementPostItem,
  MyCommentPostItem,
  MyPostHighlightsResponse,
  MyPostsResponse,
  MyNewsPostItem,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function normalizePage<T>(raw: unknown): PaginatedResponse<T> {
  const r = (raw ?? {}) as Partial<PaginatedResponse<T>>;
  return {
    items: Array.isArray(r.items) ? r.items : [],
    nextCursor: r.nextCursor ?? null,
    hasMore: Boolean(r.hasMore),
  };
}

export type GetMyPostsParams = {
  communityCursor?: string;
  newsCursor?: string;
  announcementCursor?: string;
  limit?: number;
};

export async function getMyPosts(
  params?: GetMyPostsParams,
): Promise<MyPostsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.communityCursor) q.set("communityCursor", params.communityCursor);
    if (params?.newsCursor) q.set("newsCursor", params.newsCursor);
    if (params?.announcementCursor) {
      q.set("announcementCursor", params.announcementCursor);
    }
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/users/posts/my${query ? `?${query}` : ""}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyPosts] 실패:", res.status, errText);
      return null;
    }

    const raw = (await res.json()) as Partial<MyPostsResponse>;
    return {
      community: normalizePage(raw.community),
      news: normalizePage(raw.news),
      announcements: normalizePage(raw.announcements),
    };
  } catch (e) {
    console.warn("[getMyPosts] 에러:", e);
    return null;
  }
}

export async function getMyPostHighlights(): Promise<MyPostHighlightsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/users/posts/my/highlights`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyPostHighlights] 실패:", res.status, errText);
      return null;
    }

    const raw = (await res.json()) as Partial<MyPostHighlightsResponse>;
    return {
      latestCommunity: (raw.latestCommunity as MyPostHighlightsResponse["latestCommunity"]) ?? null,
      recentNews: Array.isArray(raw.recentNews) ? raw.recentNews : [],
      latestAnnouncement:
        (raw.latestAnnouncement as MyPostHighlightsResponse["latestAnnouncement"]) ?? null,
    };
  } catch (e) {
    console.warn("[getMyPostHighlights] 에러:", e);
    return null;
  }
}

export type MyPostsListParams = { cursor?: string; limit?: number };

export async function getMyAnnouncements(
  params?: MyPostsListParams,
): Promise<PaginatedResponse<MyAnnouncementPostItem> | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/users/posts/my/announcements${query ? `?${query}` : ""}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyAnnouncements] 실패:", res.status, errText);
      return null;
    }

    const raw = await res.json();
    return normalizePage<MyAnnouncementPostItem>(raw);
  } catch (e) {
    console.warn("[getMyAnnouncements] 에러:", e);
    return null;
  }
}

export async function getMyNewsPosts(
  params?: MyPostsListParams,
): Promise<PaginatedResponse<MyNewsPostItem> | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/users/posts/my/news${query ? `?${query}` : ""}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyNewsPosts] 실패:", res.status, errText);
      return null;
    }

    const raw = await res.json();
    return normalizePage<MyNewsPostItem>(raw);
  } catch (e) {
    console.warn("[getMyNewsPosts] 에러:", e);
    return null;
  }
}

export async function getMyComments(
  params?: MyPostsListParams,
): Promise<PaginatedResponse<MyCommentPostItem> | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/users/posts/my/comments${query ? `?${query}` : ""}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyComments] 실패:", res.status, errText);
      return null;
    }

    const raw = await res.json();
    return normalizePage<MyCommentPostItem>(raw);
  } catch (e) {
    console.warn("[getMyComments] 에러:", e);
    return null;
  }
}
