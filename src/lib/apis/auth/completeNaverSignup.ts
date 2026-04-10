import { API_BASE } from "../api";

export type CompleteNaverSignupRequest = {
  accessToken: string;
  activityName: string;
  nickname?: string;
  role?: "user" | "admin";
};

export type CompleteNaverSignupResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    userId?: string | number;
    socialId?: string;
    nickname?: string;
    activityName?: string;
    email?: string;
    profileImgUrl?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const completeNaverSignup = async (
  payload: CompleteNaverSignupRequest,
): Promise<CompleteNaverSignupResponse> => {
  const res = await fetch(`${API_BASE}/auth/signup/naver`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: CompleteNaverSignupResponse = await res
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
