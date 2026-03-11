import { ProfileUpdateRequestDto } from "./dto/update-profile.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";

export async function updateProfile(profile: ProfileUpdateRequestDto) {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  const response = await fetch(`${API_BASE}/users/profile/my`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) return null;

  const data = await response.json().catch(() => null);
  if (!data) return null;

  return data;
}