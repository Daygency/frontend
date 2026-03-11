import { ProfileUpdateRequestDto } from "./dto/update-profile.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";

export async function updateProfile(
  profile: ProfileUpdateRequestDto,
): Promise<any | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  const response = await fetch(`${API_BASE}/users/profile/my`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) return null;

  const data = await response.json().catch(() => null);
  if (!data) return null;
  console.log("[updateProfile] API 응답:", JSON.stringify(data, null, 2));

  return data;
}
