import { API_BASE } from "../api";

export type CompleteGoogleSignupRequest = {
  accessToken: string;
  role: string;
  name?: string;
  activityName?: string;
};

export type CompleteGoogleSignupResponse = {
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

export const completeGoogleSignup = async (
  payload: CompleteGoogleSignupRequest,
): Promise<CompleteGoogleSignupResponse> => {
  const res = await fetch(`${API_BASE}/auth/signup/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: CompleteGoogleSignupResponse = await res
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
