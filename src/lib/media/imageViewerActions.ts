import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform, Share } from "react-native";
import { API_BASE, AUTH_TOKEN_KEY } from "../apis/api";
import { resolveProfileImageUrlForDisplay } from "../chat/resolveProfileImageUrl";

function resolveUrl(url: string): string {
  return resolveProfileImageUrlForDisplay(url) ?? url.trim();
}

function guessExtension(url: string): string {
  const match = url.split("?")[0]?.match(/\.(jpe?g|png|gif|webp|heic|heif)$/i);
  return match?.[1]?.toLowerCase().replace("jpeg", "jpg") ?? "jpg";
}

function extensionFromContentType(contentType?: string | null): string | null {
  if (!contentType) return null;
  const ct = contentType.split(";")[0]?.trim().toLowerCase();
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };
  return map[ct] ?? null;
}

function getWritableDirectory(): string {
  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!dir) {
    throw new Error("writable directory unavailable");
  }
  return dir;
}

function ensureFileUri(uri: string): string {
  if (uri.startsWith("file://")) return uri;
  return `file://${uri.startsWith("/") ? "" : "/"}${uri}`;
}

async function buildDownloadHeaders(url: string): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (url.startsWith(API_BASE)) {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
}

async function writeResponseToFile(
  response: Response,
  dest: string,
): Promise<string> {
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength <= 0) {
    throw new Error("empty response body");
  }
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const base64 = globalThis.btoa(binary);
  await FileSystem.writeAsStringAsync(dest, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return dest;
}

async function downloadToCache(url: string): Promise<string> {
  const resolved = resolveUrl(url);
  if (!resolved) {
    throw new Error("invalid image url");
  }

  const headers = await buildDownloadHeaders(resolved);
  const baseDir = getWritableDirectory();
  const initialExt = guessExtension(resolved);
  let dest = `${baseDir}daygency_image_${Date.now()}.${initialExt}`;

  let downloadedUri = "";
  let contentType: string | undefined;

  try {
    const result = await FileSystem.downloadAsync(resolved, dest, { headers });
    if (result.status >= 200 && result.status < 300) {
      downloadedUri = result.uri;
      const rawType = result.headers?.["Content-Type"] ?? result.headers?.["content-type"];
      contentType = typeof rawType === "string" ? rawType : undefined;
    }
  } catch {
    // fetch fallback below
  }

  if (!downloadedUri) {
    const response = await fetch(resolved, { headers });
    if (!response.ok) {
      throw new Error(`download failed: ${response.status}`);
    }
    contentType = response.headers.get("content-type") ?? undefined;
    const extFromType = extensionFromContentType(contentType) ?? initialExt;
    dest = `${baseDir}daygency_image_${Date.now()}.${extFromType}`;
    downloadedUri = await writeResponseToFile(response, dest);
  }

  const extFromType = extensionFromContentType(contentType);
  if (extFromType && extFromType !== initialExt && downloadedUri.endsWith(`.${initialExt}`)) {
    const renamed = `${baseDir}daygency_image_${Date.now()}.${extFromType}`;
    await FileSystem.moveAsync({ from: downloadedUri, to: renamed });
    downloadedUri = renamed;
  }

  const info = await FileSystem.getInfoAsync(downloadedUri);
  if (!info.exists || (info.size ?? 0) <= 0) {
    throw new Error("downloaded file missing");
  }

  return ensureFileUri(downloadedUri);
}

async function ensureSavePermission(): Promise<boolean> {
  const available = await MediaLibrary.isAvailableAsync();
  if (!available) return false;

  if (Platform.OS === "ios") {
    const current = await MediaLibrary.getPermissionsAsync(true);
    if (current.granted) return true;
    const requested = await MediaLibrary.requestPermissionsAsync(true);
    return requested.granted;
  }

  const current = await MediaLibrary.getPermissionsAsync(false, ["photo"]);
  if (current.granted) return true;
  const requested = await MediaLibrary.requestPermissionsAsync(false, ["photo"]);
  return requested.granted;
}

async function saveLocalImage(localUri: string): Promise<void> {
  const normalizedUri = ensureFileUri(localUri);
  try {
    await MediaLibrary.createAssetAsync(normalizedUri);
    return;
  } catch {
    await MediaLibrary.saveToLibraryAsync(normalizedUri);
  }
}

export async function downloadImageToDevice(url: string): Promise<void> {
  try {
    const permitted = await ensureSavePermission();
    if (!permitted) {
      Alert.alert(
        "권한 필요",
        "사진을 저장하려면 사진 보관함 접근 권한이 필요합니다.",
      );
      return;
    }

    const localUri = await downloadToCache(url);
    await saveLocalImage(localUri);
    Alert.alert("저장 완료", "사진이 앨범에 저장되었습니다.");
  } catch (error) {
    if (__DEV__) {
      console.warn("[downloadImageToDevice]", error);
    }
    Alert.alert("저장 실패", "사진을 저장하지 못했습니다.");
  }
}

export async function shareImage(url: string): Promise<void> {
  try {
    const localUri = ensureFileUri(await downloadToCache(url));
    if (Platform.OS === "ios") {
      await Share.share({ url: localUri });
      return;
    }
    await Share.share({ message: localUri, url: localUri });
  } catch (error) {
    if (__DEV__) {
      console.warn("[shareImage]", error);
    }
    Alert.alert("공유 실패", "사진을 공유하지 못했습니다.");
  }
}
