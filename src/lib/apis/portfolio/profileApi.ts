import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { ProfileResponseDto } from "./types";

export async function getMyProfile(): Promise<ProfileResponseDto | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  const res = await fetch(`${API_BASE}/users/profile/my`, {
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
