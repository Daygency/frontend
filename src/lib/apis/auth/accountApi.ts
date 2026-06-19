import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";

/** DELETE /users/me — 본문 없음(README.md). Bearer만 전송. */
async function authBearerHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("로그인이 필요합니다.");
  return {
    Authorization: `Bearer ${token}`,
  };
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

export async function withdrawAccount(): Promise<{
  ok: boolean;
  status: number;
  message?: string;
}> {
  try {
    const headers = await authBearerHeaders();
    const res = await fetchWithAuth(`${API_BASE}/users/me`, {
      method: "DELETE",
      headers,
    });

    if (res.status === 204 || res.ok) {
      return { ok: true, status: res.status };
    }

    const fromBody = await readErrorMessage(res);

    if (res.status === 401) {
      return {
        ok: false,
        status: 401,
        message:
          fromBody ??
          "인증에 실패했습니다. 이미 탈퇴 처리되었거나 로그인이 필요합니다.",
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        status: 404,
        message:
          fromBody ?? "회원 정보를 찾을 수 없습니다. 잠시 후 다시 시도해 주세요.",
      };
    }

    return {
      ok: false,
      status: res.status,
      message: fromBody,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}
