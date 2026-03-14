import { ProfileUpdateRequestDto } from "./dto/update-profile.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";

export async function updateProfile(
  profile: ProfileUpdateRequestDto,
): Promise<any | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  console.log(
    "[updateProfile] 요청 payload:",
    JSON.stringify(profile, null, 2),
  );

  const response = await fetch(`${API_BASE}/users/profile/my`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  }).catch((error) => {
    console.log("[updateProfile] fetch 에러:", error);
    throw error;
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.log(
      "[updateProfile] 실패 status:",
      response.status,
      "body:",
      errorText,
    );
    return null;
  }

  // 일부 서버는 200/204에 body 없이 응답할 수 있음 → 성공으로 처리
  const rawText = await response.text().catch(() => "");
  if (!rawText) {
    console.log("[updateProfile] 성공 (empty body), status:", response.status);
    return {};
  }

  const data = (() => {
    try {
      return JSON.parse(rawText);
    } catch {
      return null;
    }
  })();
  if (!data) {
    console.log(
      "[updateProfile] 성공 but non-JSON body:",
      rawText.slice(0, 300),
    );
    return {};
  }

  console.log("[updateProfile] API 응답:", JSON.stringify(data, null, 2));
  return data;
}
