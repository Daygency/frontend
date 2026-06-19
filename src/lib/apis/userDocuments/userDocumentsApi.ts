import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type { UserDocumentItem } from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyDocuments(): Promise<UserDocumentItem[] | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/users/me/documents`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      console.warn("[getMyDocuments] 실패:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const raw = await res.json();
    return Array.isArray(raw) ? (raw as UserDocumentItem[]) : [];
  } catch (e) {
    console.warn("[getMyDocuments] 에러:", e);
    return null;
  }
}

export async function uploadMyDocument(
  uri: string,
  options?: { name?: string; type?: string },
): Promise<UserDocumentItem | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: options?.name ?? "document",
      type: options?.type ?? "application/octet-stream",
    } as unknown as Blob);

    const res = await fetchWithAuth(`${API_BASE}/users/me/documents`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      console.warn("[uploadMyDocument] 실패:", res.status, await res.text().catch(() => ""));
      return null;
    }
    return (await res.json()) as UserDocumentItem;
  } catch (e) {
    console.warn("[uploadMyDocument] 에러:", e);
    return null;
  }
}

export async function deleteMyDocument(fileId: string): Promise<boolean> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/users/me/documents/${encodeURIComponent(fileId)}`,
      {
        method: "DELETE",
        headers,
      },
    );
    return res.ok || res.status === 204;
  } catch (e) {
    console.warn("[deleteMyDocument] 에러:", e);
    return false;
  }
}
