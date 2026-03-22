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

export type FollowMutationResult =
  | { ok: true; alreadyFollowing?: boolean }
  | { ok: false; status: number; message?: string };

/**
 * POST /follow — Body: { receiverId }
 * 409: 이미 팔로우 중 (클라이언트는 팔로잉 상태로 처리 가능)
 */
export async function followUser(
  receiverId: string,
): Promise<FollowMutationResult> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(`${API_BASE}/follow`, {
      method: "POST",
      headers,
      body: JSON.stringify({ receiverId }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 409) return { ok: true, alreadyFollowing: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/**
 * DELETE /follow/:receiverId — 팔로우 관계 없으면 404
 */
export async function unfollowUser(
  receiverId: string,
): Promise<{ ok: boolean; status: number; message?: string }> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(
      `${API_BASE}/follow/${encodeURIComponent(receiverId)}`,
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
