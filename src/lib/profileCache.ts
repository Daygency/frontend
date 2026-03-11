import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import type { ProfileResponseDto } from "./profileApi";

const PROFILE_CACHE_KEY = "@daygency_profile_cache";
const PROFILE_IMAGE_CACHE_DIR = `${FileSystem.cacheDirectory}profile/`;

const isValidImageUrl = (url: string | undefined): boolean =>
  !!url?.trim() &&
  (url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("file://"));

/** 프로필 캐시 조회 (로컬 저장 데이터 + 이미지) */
export async function getProfileCache(): Promise<ProfileResponseDto | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw) as ProfileResponseDto;
    if (!profile || typeof profile !== "object") return null;

    // 로컬 이미지 경로 유효성 확인 (파일이 삭제되었을 수 있음)
    if (profile.profileImgUrl?.startsWith("file://")) {
      try {
        const info = await FileSystem.getInfoAsync(profile.profileImgUrl, {
          type: "file",
        });
        if (!info.exists) profile.profileImgUrl = "";
      } catch {
        profile.profileImgUrl = "";
      }
    }
    return profile;
  } catch {
    return null;
  }
}

/** 프로필 이미지 다운로드 후 로컬 경로 반환 */
async function downloadProfileImage(
  imageUrl: string
): Promise<string | undefined> {
  if (!imageUrl?.trim() || !imageUrl.startsWith("http")) return undefined;
  try {
    const httpsUrl =
      imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")
        ? imageUrl.replace("http://", "https://")
        : imageUrl;

    await FileSystem.makeDirectoryAsync(PROFILE_IMAGE_CACHE_DIR, {
      intermediates: true,
    });
    const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const filename = `profile_${Date.now()}.${ext}`;
    const localPath = `${PROFILE_IMAGE_CACHE_DIR}${filename}`;
    const result = await FileSystem.downloadAsync(httpsUrl, localPath);
    if (result.status === 200) return result.uri;
  } catch {
    // 다운로드 실패 시 원본 URL 유지
  }
  return undefined;
}

/** 프로필 캐시 저장 (JSON + 이미지 다운로드) */
export async function saveProfileCache(
  profile: ProfileResponseDto
): Promise<void> {
  try {
    const toSave = { ...profile };
    if (isValidImageUrl(profile.profileImgUrl)) {
      const localUri = await downloadProfileImage(profile.profileImgUrl);
      if (localUri) toSave.profileImgUrl = localUri;
    }
    await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(toSave));
  } catch {
    // 캐시 저장 실패 시 무시
  }
}

/** 프로필 캐시 삭제 (로그아웃 시 호출 권장) */
export async function clearProfileCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // ignore
  }
}
