import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform, Share } from "react-native";
import { resolveProfileImageUrlForDisplay } from "../chat/resolveProfileImageUrl";

function resolveUrl(url: string): string {
  return resolveProfileImageUrlForDisplay(url) ?? url;
}

function guessExtension(url: string): string {
  const match = url.split("?")[0]?.match(/\.(jpe?g|png|gif|webp|heic)$/i);
  return match?.[1]?.toLowerCase() ?? "jpg";
}

async function downloadToCache(url: string): Promise<string> {
  const resolved = resolveUrl(url);
  const ext = guessExtension(resolved);
  const dest = `${FileSystem.cacheDirectory ?? ""}daygency_image_${Date.now()}.${ext}`;
  const result = await FileSystem.downloadAsync(resolved, dest);
  return result.uri;
}

export async function downloadImageToDevice(url: string): Promise<void> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "권한 필요",
        "사진을 저장하려면 사진 보관함 접근 권한이 필요합니다.",
      );
      return;
    }
    const localUri = await downloadToCache(url);
    await MediaLibrary.saveToLibraryAsync(localUri);
    Alert.alert("저장 완료", "사진이 앨범에 저장되었습니다.");
  } catch {
    Alert.alert("저장 실패", "사진을 저장하지 못했습니다.");
  }
}

export async function shareImage(url: string): Promise<void> {
  try {
    const localUri = await downloadToCache(url);
    if (Platform.OS === "ios") {
      await Share.share({ url: localUri });
      return;
    }
    await Share.share({ message: localUri, url: localUri });
  } catch {
    Alert.alert("공유 실패", "사진을 공유하지 못했습니다.");
  }
}
