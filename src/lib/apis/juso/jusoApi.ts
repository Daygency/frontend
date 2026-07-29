import { API_BASE } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_KEY } from "../api";

export type JusoAddressItem = {
  roadAddr: string;
};

export async function searchJusoAddress(
  keyword: string,
): Promise<{ ok: true; items: JusoAddressItem[] } | { ok: false; message: string }> {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return { ok: false, message: "검색할 주소를 입력해주세요." };
  }

  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return { ok: false, message: "로그인이 필요합니다." };
    }

    const url = `${API_BASE}/juso/search?keyword=${encodeURIComponent(trimmed)}`;
    const res = await fetchWithAuth(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      let message = "주소 검색에 실패했습니다.";
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
      ? (JSON.parse(text) as JusoAddressItem[])
      : [];
    return { ok: true, items };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "주소 검색에 실패했습니다.";
    return { ok: false, message: msg };
  }
}
