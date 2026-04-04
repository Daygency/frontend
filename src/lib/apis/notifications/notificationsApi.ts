import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";

export type PushDevicePlatform = "IOS" | "ANDROID" | "WEB";

async function authJsonHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("로그인이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return "";
    const data = JSON.parse(text) as { message?: string; error?: string };
    return data.message ?? data.error ?? text;
  } catch {
    return "";
  }
}

export type RegisterPushDeviceResult =
  | { ok: true }
  | { ok: false; status: number; message?: string };

/**
 * POST /notifications/devices — FCM 등록 토큰 등록/갱신
 * @see README.md (알림 · 푸시)
 */
export async function registerPushDevice(params: {
  fcmToken: string;
  platform?: PushDevicePlatform;
}): Promise<RegisterPushDeviceResult> {
  try {
    const headers = await authJsonHeaders();
    const body: { fcmToken: string; platform?: PushDevicePlatform } = {
      fcmToken: params.fcmToken,
    };
    if (params.platform) body.platform = params.platform;
    const res = await fetchWithAuth(`${API_BASE}/notifications/devices`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

export type UnregisterPushDeviceResult =
  | { ok: true }
  | { ok: false; status: number; message?: string };

/**
 * DELETE /notifications/devices — body: { fcmToken }
 */
export async function unregisterPushDevice(params: {
  fcmToken: string;
}): Promise<UnregisterPushDeviceResult> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(`${API_BASE}/notifications/devices`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ fcmToken: params.fcmToken }),
    });
    if (res.ok) return { ok: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}
