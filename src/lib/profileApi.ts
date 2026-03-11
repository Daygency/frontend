import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "./api";

export type UserRole = "artist" | "planner";

export type EducationEntry = {
  id: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
};

export type CareerEntry = {
  id: string;
  description: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
};

export type AwardEntry = {
  id: string;
  description: string;
  year: string;
  month: string;
};

export type CertificateEntry = {
  id: string;
  description: string;
  year: string;
  month: string;
  fileUri?: string;
  fileName?: string;
};

export type ProfileResponseDto = {
  profileImgUrl: string;
  nickname: string;
  role: UserRole;
  aboutMe: string;
  education: string | null;
  career: string | null;
  awards: string | null;
  educationEntries?: EducationEntry[];
  careerEntries?: CareerEntry[];
  awardEntries?: AwardEntry[];
  certificateEntries?: CertificateEntry[];
  contact: {
    email: string;
    phoneNumber: string;
  };
};

export async function getMyProfile(): Promise<ProfileResponseDto | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  const res = await fetch(`${API_BASE}/profile/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  if (!data) return null;

  console.log("[getMyProfile] API 응답:", JSON.stringify(data, null, 2));

  const profile = data as ProfileResponseDto;
  // 상대 경로인 경우 API base URL 붙이기 (예: /uploads/profile/xxx.jpg)
  if (profile.profileImgUrl?.startsWith("/")) {
    profile.profileImgUrl = `${API_BASE}${profile.profileImgUrl}`;
  }
  return profile;
}
