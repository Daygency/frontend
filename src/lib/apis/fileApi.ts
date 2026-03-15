import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "./api";

/**
 * 파일 업로드 (썸네일/대표 이미지 등)
 * API 엔드포인트 및 응답 형식은 백엔드 스펙에 맞게 조정 필요
 * 예상 응답: { fileId: string } 또는 { id: string }
 */
export async function uploadFile(
  uri: string,
  options?: { name?: string; type?: string }
): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const formData = new FormData();

    // React Native FormData: { uri, name, type } 객체 전달
    formData.append("file", {
      uri,
      name: options?.name ?? "image.jpg",
      type: options?.type ?? "image/jpeg",
    } as unknown as Blob);

    const headers: HeadersInit = {};
    if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/files`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.fileId ?? data?.id ?? null;
  } catch (e) {
    console.warn("[uploadFile] 에러:", e);
    return null;
  }
}
