import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  GetMyLikedListParams,
  MyLikedCommentsResponse,
  MyLikedCommunityResponse,
  MyLikedHighlightsResponse,
  MyLikedNewsResponse,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function buildQuery(params?: GetMyLikedListParams): string {
  const q = new URLSearchParams();
  if (params?.cursor) q.set("cursor", params.cursor);
  if (params?.limit != null) q.set("limit", String(params.limit));
  const query = q.toString();
  return query ? `?${query}` : "";
}

export async function getMyLikedCommunity(
  params?: GetMyLikedListParams,
): Promise<MyLikedCommunityResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const url = `${API_BASE}/users/posts/my/likes/community${buildQuery(params)}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) return null;
    const raw = (await res.json()) as Partial<MyLikedCommunityResponse>;
    return {
      items: Array.isArray(raw.items) ? raw.items : [],
      nextCursor: raw.nextCursor ?? null,
      hasMore: Boolean(raw.hasMore),
    };
  } catch {
    return null;
  }
}

export async function getMyLikedNews(
  params?: GetMyLikedListParams,
): Promise<MyLikedNewsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const url = `${API_BASE}/users/posts/my/likes/news${buildQuery(params)}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) return null;
    const raw = (await res.json()) as Partial<MyLikedNewsResponse>;
    return {
      items: Array.isArray(raw.items) ? raw.items : [],
      nextCursor: raw.nextCursor ?? null,
      hasMore: Boolean(raw.hasMore),
    };
  } catch {
    return null;
  }
}

export async function getMyLikedComments(
  params?: GetMyLikedListParams,
): Promise<MyLikedCommentsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const url = `${API_BASE}/users/posts/my/likes/comments${buildQuery(params)}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) return null;
    const raw = (await res.json()) as Partial<MyLikedCommentsResponse>;
    return {
      items: Array.isArray(raw.items) ? raw.items : [],
      nextCursor: raw.nextCursor ?? null,
      hasMore: Boolean(raw.hasMore),
    };
  } catch {
    return null;
  }
}

export async function getMyLikedHighlights(): Promise<MyLikedHighlightsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/users/posts/my/likes/highlights`, {
      method: "GET",
      headers,
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as Partial<MyLikedHighlightsResponse>;
    return {
      latestLikedCommunity:
        (raw.latestLikedCommunity as MyLikedHighlightsResponse["latestLikedCommunity"]) ??
        null,
      latestLikedNews: Array.isArray(raw.latestLikedNews) ? raw.latestLikedNews : [],
    };
  } catch {
    return null;
  }
}
