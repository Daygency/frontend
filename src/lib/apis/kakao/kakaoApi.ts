import { API_BASE } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_KEY } from "../api";

export type KakaoPlaceItem = {
  placeId: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
};

export async function searchKakaoPlaces(
  query: string,
): Promise<{ ok: true; items: KakaoPlaceItem[] } | { ok: false; message: string }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { ok: false, message: "검색어를 입력해주세요." };
  }

  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return { ok: false, message: "로그인이 필요합니다." };
    }

    const url = `${API_BASE}/kakao/places/search?query=${encodeURIComponent(trimmed)}`;
    const res = await fetchWithAuth(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      let message = "장소 검색에 실패했습니다.";
      try {
        const parsed = JSON.parse(text) as { message?: string | string[] };
        const raw = parsed.message;
        if (typeof raw === "string" && raw.trim()) message = raw;
        else if (Array.isArray(raw) && raw[0]) message = String(raw[0]);
      } catch {
        /* ignore */
      }
      return { ok: false, message };
    }

    const items = text.trim()
      ? (JSON.parse(text) as KakaoPlaceItem[])
      : [];
    return { ok: true, items };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "장소 검색에 실패했습니다.";
    return { ok: false, message: msg };
  }
}
