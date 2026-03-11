import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "./api";

export type UserRole = "artist" | "planner";

export type ProfileResponseDto = {
  profileImgUrl: string;
  nickname: string;
  role: UserRole;
  aboutMe: string;
  education: string | null;
  career: string | null;
  awards: string | null;
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
  return data as ProfileResponseDto;
}
