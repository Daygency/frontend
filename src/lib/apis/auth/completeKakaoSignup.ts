import { API_BASE } from "../api";

export type CompleteKakaoSignupRequest = {
  accessToken: string;
  role: string;
  name?: string;
  activityName?: string;
};

export type CompleteKakaoSignupResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    userId?: string | number;
    socialId?: string;
    name?: string;
    activityName?: string;
    email?: string;
    profileImgUrl?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const completeKakaoSignup = async (
  payload: CompleteKakaoSignupRequest,
): Promise<CompleteKakaoSignupResponse> => {
  const res = await fetch(`${API_BASE}/auth/signup/kakao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: CompleteKakaoSignupResponse = await res
    .json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch(() => ({}) as any);

  if (!res.ok) {
    const anyData = data as { message?: string; error?: string } | string;
    const message =
      typeof anyData === "string"
        ? anyData
        : (anyData?.message ?? anyData?.error ?? "");
    throw new Error(message || `가입에 실패했습니다 (${res.status})`);
  }

  return data;
};
