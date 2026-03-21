import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type { CommentItem, CreateCommentDto, GetCommentsParams } from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getComments(
  params: GetCommentsParams,
): Promise<CommentItem[] | null> {
  try {
    const q = new URLSearchParams();
    q.set("targetType", params.targetType);
    q.set("targetId", params.targetId);
    const url = `${API_BASE}/comment?${q.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getComments] 실패:", res.status, url, errText);
      return null;
    }
    const raw = await res.json();
    return Array.isArray(raw) ? (raw as CommentItem[]) : [];
  } catch (e) {
    console.warn("[getComments] 네트워크 에러:", e);
    return null;
  }
}

export async function createComment(
  dto: CreateCommentDto,
): Promise<CommentItem | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/comment`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createComment] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<CommentItem>;
  } catch (e) {
    console.warn("[createComment] 에러:", e);
    return null;
  }
}
