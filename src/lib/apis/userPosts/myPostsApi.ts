import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  MyAnnouncementPostItem,
  MyPostHighlightsResponse,
  MyPostsResponse,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyPosts(): Promise<MyPostsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/users/posts/my`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyPosts] 실패:", res.status, errText);
      return null;
    }

    const raw = (await res.json()) as Partial<MyPostsResponse>;
    return {
      community: Array.isArray(raw.community) ? raw.community : [],
      news: Array.isArray(raw.news) ? raw.news : [],
      announcements: Array.isArray(raw.announcements) ? raw.announcements : [],
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

export async function getMyAnnouncements(): Promise<MyAnnouncementPostItem[] | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/users/posts/my/announcements`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyAnnouncements] 실패:", res.status, errText);
      return null;
    }

    const raw = await res.json();
    return Array.isArray(raw) ? (raw as MyAnnouncementPostItem[]) : [];
  } catch (e) {
    console.warn("[getMyAnnouncements] 에러:", e);
    return null;
  }
}
