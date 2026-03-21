import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  CreateLikeDto,
  GetLikesParams,
  GetLikesResponse,
  LikeItem,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getLikes(
  params: GetLikesParams,
): Promise<GetLikesResponse | null> {
  try {
    const q = new URLSearchParams();
    q.set("likeType", params.likeType);
    q.set("targetId", params.targetId);
    const url = `${API_BASE}/like?${q.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getLikes] 실패:", res.status, url, errText);
      return null;
    }
    const raw = (await res.json()) as Partial<GetLikesResponse>;
    return {
      count: Number(raw.count ?? 0),
      items: Array.isArray(raw.items) ? (raw.items as LikeItem[]) : [],
    };
  } catch (e) {
    console.warn("[getLikes] 네트워크 에러:", e);
    return null;
  }
}

export async function createLike(dto: CreateLikeDto): Promise<LikeItem | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/like`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createLike] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<LikeItem>;
  } catch (e) {
    console.warn("[createLike] 에러:", e);
    return null;
  }
}

export async function deleteLikeByTarget(
  params: GetLikesParams,
): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    q.set("likeType", params.likeType);
    q.set("targetId", params.targetId);
    const url = `${API_BASE}/like?${q.toString()}`;
    const res = await fetchWithAuth(url, {
      method: "DELETE",
      headers,
    });
    return { success: res.ok };
  } catch (e) {
    console.warn("[deleteLikeByTarget] 에러:", e);
    return { success: false };
  }
}
