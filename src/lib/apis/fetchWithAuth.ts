import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./api";
import { emitAuthExpired } from "../authEvents";
import { refreshAccessToken } from "./auth/refreshApi";

const USER_INFO_KEY = "@daygency_user_info";

async function clearAuthStorage(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    AsyncStorage.removeItem(USER_INFO_KEY),
  ]);
}

/**
 * auth-api.md: 401 시 refresh 후 재시도
 * - 401 → POST /auth/refresh → 성공 시 재요청, 실패 시 토큰 삭제 + emitAuthExpired
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit & { headers?: Record<string, string> }
): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status !== 401) {
    return res;
  }

  const refreshed = await refreshAccessToken();
  if (refreshed.ok) {
    const newHeaders = {
      ...options.headers,
      Authorization: `Bearer ${refreshed.accessToken}`,
    };
    return fetch(url, { ...options, headers: newHeaders });
  }

  await clearAuthStorage();
  emitAuthExpired();
  return res;
}
