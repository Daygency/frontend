import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import type { CreateNewsDto, CreateNewsResponse } from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/** 공연소식 작성 (POST /news) */
export async function createNews(
  dto: CreateNewsDto
): Promise<CreateNewsResponse | null> {
  const headers = await getAuthHeadersRequired();
  const res = await fetch(`${API_BASE}/news`, {
    method: "POST",
    headers,
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn("[createNews] 실패:", res.status, errText);
    return null;
  }

  return res.json() as Promise<CreateNewsResponse>;
}
