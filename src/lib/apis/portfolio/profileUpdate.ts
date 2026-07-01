import { ProfileUpdateRequestDto } from "./dto/update-profile.dto";
import { API_BASE } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";

export type UpdateProfileOptions = {
  profileImageUri?: string;
  profileImageName?: string;
  profileImageType?: string;
  coverImageUri?: string;
  coverImageName?: string;
  coverImageType?: string;
};

async function parseUpdateProfileResponse(
  response: Response,
): Promise<Record<string, unknown> | null> {
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

  const rawText = await response.text().catch(() => "");
  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    console.log(
      "[updateProfile] 성공 but non-JSON body:",
      rawText.slice(0, 300),
    );
    return {};
  }
}

export async function clearCoverImage(): Promise<Record<string, unknown> | null> {
  return updateProfile({ coverImgUrl: "" });
}

export async function clearProfileImage(): Promise<Record<string, unknown> | null> {
  return updateProfile({ profileImgUrl: "" });
}

export async function updateProfile(
  profile: ProfileUpdateRequestDto,
  options?: UpdateProfileOptions,
): Promise<Record<string, unknown> | null> {
  const profileImageUri = options?.profileImageUri?.trim();
  const coverImageUri = options?.coverImageUri?.trim();
  const hasMultipart = Boolean(profileImageUri || coverImageUri);

  console.log(
    "[updateProfile] 요청 payload:",
    JSON.stringify(profile, null, 2),
  );

  try {
    if (hasMultipart) {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(profile));
      if (profileImageUri) {
        formData.append("profileImage", {
          uri: profileImageUri,
          name: options?.profileImageName ?? "profile.jpg",
          type: options?.profileImageType ?? "image/jpeg",
        } as unknown as Blob);
      }
      if (coverImageUri) {
        formData.append("coverImage", {
          uri: coverImageUri,
          name: options?.coverImageName ?? "cover.jpg",
          type: options?.coverImageType ?? "image/jpeg",
        } as unknown as Blob);
      }

      const response = await fetchWithAuth(`${API_BASE}/users/profile/my`, {
        method: "PATCH",
        body: formData,
      });
      return parseUpdateProfileResponse(response);
    }

    const response = await fetchWithAuth(`${API_BASE}/users/profile/my`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    return parseUpdateProfileResponse(response);
  } catch (error) {
    console.log("[updateProfile] fetch 에러:", error);
    throw error;
  }
}
