import { API_BASE } from "../api";

/**
 * 소셜 로그인 → 앱 JWT 교환 (POST /auth/kakao | /auth/naver)
 *
 * 탈퇴(소프트 삭제) 후 유예 기간 내 재로그인 시, 백엔드가 자동 복구 대신
 * `needsReactivation: true` 만 내려주고 JWT는 주지 않을 수 있다.
 * 그때 사용자가 동의하면 동일 엔드포인트에 `confirmReactivation: true` 로 재요청한다.
 *
 * 백엔드 계약(제안):
 * - 1차 요청(확인 없음): 탈퇴 직후 계정이면 200 + `{ needsReactivation: true, deletedAt?, reactivationDeadline?, profile? }` (accessToken 없음)
 * - 2차 요청: body에 `confirmReactivation: true` → 정상 로그인과 동일하게 accessToken, refreshToken, user
 */
export type SocialAuthProvider = "kakao" | "naver";

export type SocialAuthExchangeResult = {
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
  rawText: string;
};

export async function postSocialAuthExchange(
  provider: SocialAuthProvider,
  oauthAccessToken: string,
  options?: { confirmReactivation?: boolean },
): Promise<SocialAuthExchangeResult> {
  const path = provider === "kakao" ? "/auth/kakao" : "/auth/naver";
  const url = `${API_BASE}${path}`;
  const body: Record<string, unknown> = {
    accessToken: oauthAccessToken,
    access_token: oauthAccessToken,
  };
  if (options?.confirmReactivation) {
    body.confirmReactivation = true;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oauthAccessToken}`,
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text().catch(() => "");
  let data: Record<string, unknown> = {};
  try {
    data = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
  } catch {
    data = {};
  }

  return { ok: res.ok, status: res.status, data, rawText };
}

/** 서버가 내려준 profile / user 에서 표시용 닉네임 추출 */
export function pickNicknameFromSocialAuthData(
  data: Record<string, unknown>,
): string | undefined {
  const p = data.profile;
  if (p && typeof p === "object" && p !== null) {
    const n = (p as { nickname?: unknown }).nickname;
    if (typeof n === "string" && n.trim()) return n.trim();
  }
  const u = data.user;
  if (u && typeof u === "object" && u !== null) {
    const n = (u as { nickname?: unknown }).nickname;
    if (typeof n === "string" && n.trim()) return n.trim();
  }
  return undefined;
}
