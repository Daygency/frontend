import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import type {
  CreateAnnouncementDto,
  CreateAnnouncementResponse,
  UpdateAnnouncementDto,
  AnnouncementListParams,
  AnnouncementListResponse,
} from "./types";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/** 공고 작성 */
export async function createAnnouncement(
  dto: CreateAnnouncementDto
): Promise<CreateAnnouncementResponse | null> {
  const headers = await getAuthHeadersRequired();
  const res = await fetch(`${API_BASE}/announcement`, {
    method: "POST",
    headers,
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn("[createAnnouncement] 실패:", res.status, errText);
    return null;
  }

  return res.json() as Promise<CreateAnnouncementResponse>;
}

/** 공고 목록 조회 */
export async function getAnnouncementList(
  params?: AnnouncementListParams
): Promise<AnnouncementListResponse | null> {
  try {
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    if (params?.categoryId) q.set("categoryId", params.categoryId);
    if (params?.majorIds) q.set("majorIds", params.majorIds);

    const query = q.toString();
    const url = `${API_BASE}/announcement${query ? `?${query}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getAnnouncementList] 실패:", res.status, url, errText);
      return null;
    }

    const data = (await res.json()) as AnnouncementListResponse;
    const items = Array.isArray(data?.items) ? data.items : [];
    const itemCount = items.length;
    console.log("[getAnnouncementList] 성공:", url, "items:", itemCount);
    return {
      items,
      nextCursor: data?.nextCursor ?? null,
      hasMore: Boolean(data?.hasMore),
    };
  } catch (e) {
    console.warn("[getAnnouncementList] 네트워크 에러:", e);
    return null;
  }
}

/** 공고 상세 조회 */
export async function getAnnouncementDetail(
  id: string
): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${API_BASE}/announcement/${id}`);
  if (!res.ok) {
    console.warn("[getAnnouncementDetail] 실패:", res.status);
    return null;
  }
  return res.json() as Promise<Record<string, unknown>>;
}

/** 공고 수정 */
export async function updateAnnouncement(
  id: string,
  dto: UpdateAnnouncementDto
): Promise<Record<string, unknown> | null> {
  const headers = await getAuthHeadersRequired();
  const res = await fetch(`${API_BASE}/announcement/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.warn("[updateAnnouncement] 실패:", res.status, errText);
    return null;
  }

  const text = await res.text();
  if (!text) return {};
  return JSON.parse(text) as Record<string, unknown>;
}

/** 공고 삭제 */
export async function deleteAnnouncement(id: string): Promise<boolean> {
  const headers = await getAuthHeadersRequired();
  const res = await fetch(`${API_BASE}/announcement/${id}`, {
    method: "DELETE",
    headers,
  });
  return res.ok;
}
