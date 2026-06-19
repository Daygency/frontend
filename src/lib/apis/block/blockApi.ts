import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";

async function authJsonHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("로그인이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * POST /block — Body: { blockedId }
 * 409: 이미 차단됨 → ok로 간주 가능
 */
export async function blockUser(
  blockedId: string,
): Promise<{ ok: boolean; status: number; alreadyBlocked?: boolean; message?: string }> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(`${API_BASE}/block`, {
      method: "POST",
      headers,
      body: JSON.stringify({ blockedId }),
    });
    if (res.ok) return { ok: true, status: res.status };
    if (res.status === 409) return { ok: true, status: res.status, alreadyBlocked: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/**
 * DELETE /block/:blockedId
 */
export async function unblockUser(
  blockedId: string,
): Promise<{ ok: boolean; status: number; message?: string }> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(
      `${API_BASE}/block/${encodeURIComponent(blockedId)}`,
      {
        method: "DELETE",
        headers,
      },
    );
    if (res.ok) return { ok: true, status: res.status };
    if (res.status === 404) return { ok: true, status: res.status };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

async function readErrorMessage(res: Response): Promise<string | undefined> {
  const text = await res.text().catch(() => "");
  if (!text) return undefined;
  try {
    const j = JSON.parse(text) as { message?: string };
    return typeof j.message === "string" ? j.message : text;
  } catch {
    return text;
  }
}
