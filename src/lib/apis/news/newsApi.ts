import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  CreateNewsDto,
  CreateNewsResponse,
  NewsListParams,
  NewsListResponse,
  NewsDetailResponse,
} from "./types";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/** 공연소식 목록 조회 (GET /news) - 인증 불필요 */
export async function getNewsList(
  params?: NewsListParams
): Promise<NewsListResponse | null> {
  try {
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const url = `${API_BASE}/news${query ? `?${query}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getNewsList] 실패:", res.status, url, errText);
      return null;
    }
    return res.json() as Promise<NewsListResponse>;
  } catch (e) {
    console.warn("[getNewsList] 네트워크 에러:", e);
    return null;
  }
}

/** 공연소식 상세 조회 (GET /news/:id) - 인증 시 isMine 정확히 반환 */
export async function getNewsDetail(
  id: string
): Promise<NewsDetailResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchWithAuth(`${API_BASE}/news/${id}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      console.warn("[getNewsDetail] 실패:", res.status);
      return null;
    }
    return res.json() as Promise<NewsDetailResponse>;
  } catch (e) {
    console.warn("[getNewsDetail] 에러:", e);
    return null;
  }
}

/** 공연소식 작성 (POST /news) - 401 시 토큰 갱신 후 재시도 */
export async function createNews(
  dto: CreateNewsDto
): Promise<CreateNewsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/news`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createNews] 실패:", res.status, errText);
      return null;
    }

    return res.json() as Promise<CreateNewsResponse>;
  } catch (e) {
    console.warn("[createNews] 에러:", e);
    return null;
  }
}
