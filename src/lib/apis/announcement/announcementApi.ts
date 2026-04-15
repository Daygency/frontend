import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import type { LocalImageAsset } from "../fileApi";
import { postBoardMultipart } from "../multipartPost";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  CreateAnnouncementDto,
  CreateAnnouncementResponse,
  UpdateAnnouncementDto,
  AnnouncementListParams,
  AnnouncementListResponse,
  AnnouncementListItem,
} from "./types";
import {
  pickAddressFromAnnouncementRaw,
  pickDeadlineAtFromAnnouncementRaw,
  pickMajorsFromAnnouncementRaw,
} from "../../announcement/recruitmentMajors";

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

/** 공고 작성 — 텍스트만 (README: `POST /announcement/json`) */
export async function createAnnouncement(
  dto: CreateAnnouncementDto
): Promise<CreateAnnouncementResponse | null> {
  const headers = await getAuthHeadersRequired();
  const res = await fetchWithAuth(`${API_BASE}/announcement/json`, {
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

/**
 * 모집공고 작성 — 이미지 포함 (README: `POST /announcement` + multipart)
 */
export async function createAnnouncementWithFiles(
  dto: CreateAnnouncementDto,
  files: LocalImageAsset[],
): Promise<CreateAnnouncementResponse | null> {
  if (files.length === 0) return createAnnouncement(dto);
  try {
    const res = await postBoardMultipart(
      "/announcement",
      dto as unknown as Record<string, unknown>,
      files,
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createAnnouncementWithFiles] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<CreateAnnouncementResponse>;
  } catch (e) {
    console.warn("[createAnnouncementWithFiles] 에러:", e);
    return null;
  }
}

/** 내가 작성한 모집공고 목록 (`GET /announcement/my`) */
export async function getMyAnnouncementList(
  params?: AnnouncementListParams,
): Promise<AnnouncementListResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    if (params?.categoryId) q.set("categoryId", params.categoryId);
    if (params?.majorIds) q.set("majorIds", params.majorIds);
    if (params?.priceType) q.set("priceType", params.priceType);

    const query = q.toString();
    const url = `${API_BASE}/announcement/my${query ? `?${query}` : ""}`;

    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getMyAnnouncementList] 실패:", res.status, url, errText);
      return null;
    }

    const data = (await res.json()) as AnnouncementListResponse;
    const items = Array.isArray(data?.items) ? data.items : [];
    return {
      items: items.map((item) => {
        const address = pickAddressFromAnnouncementRaw(item);
        const deadlineAt = pickDeadlineAtFromAnnouncementRaw(item);
        return {
          ...(item as AnnouncementListItem),
          ...pickMajorsFromAnnouncementRaw(item),
          ...(address ? { address } : {}),
          ...(deadlineAt ? { deadlineAt } : {}),
        };
      }),
      nextCursor: data?.nextCursor ?? null,
      hasMore: Boolean(data?.hasMore),
    };
  } catch (e) {
    console.warn("[getMyAnnouncementList] 네트워크 에러:", e);
    return null;
  }
}

/** 공고 목록 일괄 조회 — `GET /announcement` (cursor·limit·필터, 메인 홈 미리보기 등) */
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
    if (params?.priceType) q.set("priceType", params.priceType);

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
      items: items.map((item) => {
        const address = pickAddressFromAnnouncementRaw(item);
        const deadlineAt = pickDeadlineAtFromAnnouncementRaw(item);
        return {
          ...(item as AnnouncementListItem),
          ...pickMajorsFromAnnouncementRaw(item),
          ...(address ? { address } : {}),
          ...(deadlineAt ? { deadlineAt } : {}),
        };
      }),
      nextCursor: data?.nextCursor ?? null,
      hasMore: Boolean(data?.hasMore),
    };
  } catch (e) {
    console.warn("[getAnnouncementList] 네트워크 에러:", e);
    return null;
  }
}

/** 공고 상세 조회 (isMine 판별을 위해 Authorization 헤더 포함, 401 시 refresh 후 재시도) */
export async function getAnnouncementDetail(
  id: string
): Promise<Record<string, unknown> | null> {
  const headers = await getAuthHeaders();
  const res = await fetchWithAuth(`${API_BASE}/announcement/${id}`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    console.warn("[getAnnouncementDetail] 실패:", res.status);
    return null;
  }
  return res.json() as Promise<Record<string, unknown>>;
}

function parseAnnouncementPatchErrorMessage(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t) return "";
  try {
    const o = JSON.parse(t) as { message?: unknown };
    if (typeof o.message === "string") return o.message;
  } catch {
    /* plain text */
  }
  return t.length > 500 ? `${t.slice(0, 500)}…` : t;
}

/** 공고 수정 — 403 시 본문에 거절 사유(문자열 등) */
export async function updateAnnouncement(
  id: string,
  dto: UpdateAnnouncementDto,
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; message: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/announcement/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      const message =
        parseAnnouncementPatchErrorMessage(text) || "요청에 실패했습니다.";
      console.warn("[updateAnnouncement] 실패:", res.status, text);
      return { ok: false, status: res.status, message };
    }
    if (!text.trim()) return { ok: true, data: {} };
    try {
      return { ok: true, data: JSON.parse(text) as Record<string, unknown> };
    } catch {
      return { ok: true, data: {} };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/** 공고 삭제 (api-readme: DELETE /announcement/:id) */
export async function deleteAnnouncement(
  id: string
): Promise<{ ok: boolean; status?: number }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetch(`${API_BASE}/announcement/${id}`, {
      method: "DELETE",
      headers,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.warn("[deleteAnnouncement] 에러:", e);
    return { ok: false };
  }
}
