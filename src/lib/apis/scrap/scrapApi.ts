import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  CreateScrapDto,
  GetMyScrappedAnnouncementsParams,
  GetScrapsParams,
  GetScrapsResponse,
  MyScrappedAnnouncementsResponse,
  ScrapItem,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getScraps(
  params: GetScrapsParams,
): Promise<GetScrapsResponse | null> {
  try {
    const q = new URLSearchParams();
    q.set("targetType", params.targetType);
    q.set("targetId", params.targetId);
    const url = `${API_BASE}/scrap?${q.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getScraps] 실패:", res.status, url, errText);
      return null;
    }
    const raw = (await res.json()) as Partial<GetScrapsResponse>;
    return {
      count: Number(raw.count ?? 0),
      items: Array.isArray(raw.items) ? (raw.items as ScrapItem[]) : [],
    };
  } catch (e) {
    console.warn("[getScraps] 네트워크 에러:", e);
    return null;
  }
}

export async function createScrap(
  dto: CreateScrapDto,
): Promise<ScrapItem | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/scrap`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createScrap] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<ScrapItem>;
  } catch (e) {
    console.warn("[createScrap] 에러:", e);
    return null;
  }
}

export async function deleteScrapByTarget(
  params: GetScrapsParams,
): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    q.set("targetType", params.targetType);
    q.set("targetId", params.targetId);
    const url = `${API_BASE}/scrap?${q.toString()}`;
    const res = await fetchWithAuth(url, {
      method: "DELETE",
      headers,
    });
    return { success: res.ok };
  } catch (e) {
    console.warn("[deleteScrapByTarget] 에러:", e);
    return { success: false };
  }
}

export async function getMyScrappedAnnouncements(
  params?: GetMyScrappedAnnouncementsParams,
): Promise<MyScrappedAnnouncementsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const url = `${API_BASE}/users/posts/my/scraps/announcements${query ? `?${query}` : ""}`;
    const res = await fetchWithAuth(url, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyScrappedAnnouncements] 실패:", res.status, errText);
      return null;
    }
    const raw = (await res.json()) as Partial<MyScrappedAnnouncementsResponse>;
    return {
      items: Array.isArray(raw.items) ? raw.items : [],
      nextCursor: raw.nextCursor ?? null,
      hasMore: Boolean(raw.hasMore),
    };
  } catch (e) {
    console.warn("[getMyScrappedAnnouncements] 에러:", e);
    return null;
  }
}
