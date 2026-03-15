import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  CommunityCategory,
  CommunityDetailResponse,
  CommunityListParams,
  CommunityListItem,
  CreateCommunityDto,
  UpdateCommunityDto,
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

/** 커뮤니티 카테고리 목록 조회 (GET /community/categories) */
export async function getCommunityCategories(): Promise<CommunityCategory[] | null> {
  try {
    const res = await fetch(`${API_BASE}/community/categories`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getCommunityCategories] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<CommunityCategory[]>;
  } catch (e) {
    console.warn("[getCommunityCategories] 네트워크 에러:", e);
    return null;
  }
}

/** 커뮤니티 목록 조회 (GET /community) - 인증 불필요 */
export async function getCommunityList(
  params?: CommunityListParams
): Promise<CommunityListItem[] | null> {
  try {
    const q = new URLSearchParams();
    if (params?.categoryId) q.set("categoryId", params.categoryId);

    const query = q.toString();
    const url = `${API_BASE}/community${query ? `?${query}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getCommunityList] 실패:", res.status, url, errText);
      return null;
    }

    const raw = await res.json();

    // README 기준: Community 엔티티 배열 또는 호환 구조
    if (Array.isArray(raw)) {
      console.log("[getCommunityList] 배열 응답 사용:", raw.length);
      return raw as CommunityListItem[];
    }

    if (Array.isArray((raw as any)?.items)) {
      const items = (raw as any).items as CommunityListItem[];
      console.log("[getCommunityList] items 배열 응답 사용:", items.length);
      return items;
    }

    console.warn("[getCommunityList] 알 수 없는 응답 형식:", raw);
    return [];
  } catch (e) {
    console.warn("[getCommunityList] 네트워크 에러:", e);
    return null;
  }
}

/** 커뮤니티 상세 조회 (GET /community/:id) */
export async function getCommunityDetail(
  id: string
): Promise<CommunityDetailResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchWithAuth(`${API_BASE}/community/${id}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      console.warn("[getCommunityDetail] 실패:", res.status);
      return null;
    }
    return res.json() as Promise<CommunityDetailResponse>;
  } catch (e) {
    console.warn("[getCommunityDetail] 에러:", e);
    return null;
  }
}

/** 커뮤니티 작성 (POST /community) */
export async function createCommunity(
  dto: CreateCommunityDto
): Promise<CommunityDetailResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/community`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createCommunity] 실패:", res.status, errText);
      return null;
    }

    return res.json() as Promise<CommunityDetailResponse>;
  } catch (e) {
    console.warn("[createCommunity] 에러:", e);
    return null;
  }
}

/** 커뮤니티 수정 (PATCH /community/:id) */
export async function updateCommunity(
  id: string,
  dto: UpdateCommunityDto
): Promise<CommunityDetailResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetch(`${API_BASE}/community/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[updateCommunity] 실패:", res.status, errText);
      return null;
    }

    return res.json() as Promise<CommunityDetailResponse>;
  } catch (e) {
    console.warn("[updateCommunity] 에러:", e);
    return null;
  }
}

/** 커뮤니티 삭제 (DELETE /community/:id) */
export async function deleteCommunity(
  id: string
): Promise<{ ok: boolean; status?: number }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetch(`${API_BASE}/community/${id}`, {
      method: "DELETE",
      headers,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.warn("[deleteCommunity] 에러:", e);
    return { ok: false };
  }
}

