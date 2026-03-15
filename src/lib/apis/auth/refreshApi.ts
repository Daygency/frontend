import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../api";

export type RefreshResponse = {
  accessToken: string;
  user?: {
    userId?: string;
    nickname?: string;
    email?: string;
    profileImgUrl?: string;
  };
};

/**
 * Access Token 갱신 (auth-api.md: POST /auth/refresh)
 * - refreshToken으로 새 accessToken 발급
 * - 성공 시 새 accessToken 저장
 * - 401 시 refreshToken 만료 → 호출 측에서 로그아웃 처리
 */
export async function refreshAccessToken(): Promise<{ ok: true; accessToken: string } | { ok: false; status: number }> {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return { ok: false, status: 401 };
    }

    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return { ok: false, status: res.status };
    }

    const data = (await res.json()) as RefreshResponse;
    if (data?.accessToken) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      return { ok: true, accessToken: data.accessToken };
    }

    return { ok: false, status: 500 };
  } catch {
    return { ok: false, status: 0 };
  }
}
