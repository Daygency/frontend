import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type { LocalImageAsset } from "../fileApi";
import { postBoardMultipart } from "../multipartPost";
import { pickReportedUserIdFromUnknown } from "../../report/pickReportedUserId";
import type {
  CommunityCategory,
  CommunityDetailResponse,
  CommunityListParams,
  CommunityListItem,
  CreateCommunityDto,
  UpdateCommunityDto,
  CommunityAttachmentItem,
} from "./types";

function pickNumber(...vals: unknown[]): number | undefined {
  for (const v of vals) {
    if (v == null || v === "") continue;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function pickOptionalString(...vals: unknown[]): string | null | undefined {
  for (const v of vals) {
    if (v === null) return null;
    if (typeof v === "string") return v;
  }
  return undefined;
}

/** 목록 썸네일: null/빈 문자열은 건너뛰고 첫 유효 URL (thumbnailUrl·imageUrl 등 별칭) */
function pickFirstThumbnailUrlString(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

function normalizeCommunityListItem(raw: unknown): CommunityListItem {
  const r = raw as Record<string, unknown>;
  const fileVal = r.file;
  const file =
    fileVal === null || fileVal === undefined
      ? null
      : typeof fileVal === "object"
        ? (fileVal as Record<string, unknown>)
        : null;

  return {
    communityId: String(r.communityId ?? r.community_id ?? ""),
    title: String(r.title ?? ""),
    content: String(r.content ?? ""),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    viewCount: pickNumber(r.viewCount, r.view_count),
    likeCount: pickNumber(r.likeCount, r.like_count),
    commentCount: pickNumber(r.commentCount, r.comment_count),
    thumbnailUrl: pickFirstThumbnailUrlString(
      r.thumbnailUrl,
      r.thumbnail_url,
      r.imageUrl,
      r.image_url,
    ),
    attachments: r.attachments,
    user:
      r.user && typeof r.user === "object"
        ? (r.user as Record<string, unknown>)
        : {},
    category: (r.category ?? "") as CommunityListItem["category"],
    file,
  };
}

function pickFirstNonEmptyString(...vals: unknown[]): string | undefined {
  for (const v of vals) {
    if (v == null || v === "") continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return undefined;
}

/** `user` / `author` / `writer` 또는 글 최상위 작성자 id (신고용 reportedUserId) */
function coalesceCommunityDetailUser(
  r: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of ["user", "author", "writer"] as const) {
    const v = r[key];
    if (!v || typeof v !== "object") continue;
    const id = pickReportedUserIdFromUnknown(v);
    if (id) {
      return { ...(v as object), userId: id };
    }
  }
  const topId = pickFirstNonEmptyString(
    r.userId,
    r.user_id,
    r.authorId,
    r.author_id,
    r.authorUserId,
    r.author_user_id,
  );
  if (topId) return { userId: topId };
  return {};
}

function normalizeCommunityDetail(raw: unknown): CommunityDetailResponse {
  const r = raw as Record<string, unknown>;
  const fileVal = r.file;
  const file =
    fileVal === null || fileVal === undefined
      ? null
      : typeof fileVal === "object"
        ? (fileVal as Record<string, unknown>)
        : null;

  const attachmentsRaw = r.attachments;
  const attachments: CommunityAttachmentItem[] | undefined = Array.isArray(
    attachmentsRaw,
  )
    ? (attachmentsRaw
        .map((a, i) => {
          if (!a || typeof a !== "object") return null;
          const o = a as Record<string, unknown>;
          const img = o.imgUrl ?? o.img_url;
          const fid = o.fileId ?? o.file_id;
          if (typeof img !== "string" || !img.trim()) return null;
          return {
            fileId: String(fid ?? ""),
            imgUrl: img,
            sortOrder: Number(o.sortOrder ?? o.sort_order ?? i) || i,
          };
        })
        .filter(Boolean) as CommunityAttachmentItem[])
    : undefined;

  const cat = r.category;
  let category: CommunityCategory;
  if (typeof cat === "string") {
    category = { categoryId: "", name: cat };
  } else if (cat && typeof cat === "object") {
    category = cat as CommunityCategory;
  } else {
    category = { categoryId: "", name: "" };
  }

  return {
    communityId: String(r.communityId ?? r.community_id ?? ""),
    title: String(r.title ?? ""),
    content: String(r.content ?? ""),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    user: coalesceCommunityDetailUser(r),
    category,
    file,
    attachments,
    isMine: Boolean(r.isMine ?? r.is_mine),
  };
}

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

function normalizeCommunityCategory(raw: unknown): CommunityCategory | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const categoryId = String(
    row.categoryId ?? row.id ?? row.category_id ?? "",
  ).trim();
  const name = String(row.name ?? "").trim();
  if (!categoryId || !name) return null;
  return { categoryId, name };
}

/** 커뮤니티 카테고리 목록 조회 (GET /community/categories) */
export async function getCommunityCategories(): Promise<CommunityCategory[] | null> {
  try {
    const res = await fetch(`${API_BASE}/community/categories`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getCommunityCategories] 실패:", res.status, errText);
      return null;
    }
    const raw = await res.json();
    if (!Array.isArray(raw)) return null;
    const categories = raw
      .map(normalizeCommunityCategory)
      .filter((c): c is CommunityCategory => c != null);
    return categories.length > 0 ? categories : null;
  } catch (e) {
    console.warn("[getCommunityCategories] 네트워크 에러:", e);
    return null;
  }
}

/** 커뮤니티 목록 조회 (GET /community) - 인증 불필요 */
export async function getCommunityList(
  params?: CommunityListParams
): Promise<CommunityListItem[] | null> {
  try {
    const q = new URLSearchParams();
    if (params?.categoryId) q.set("categoryId", params.categoryId);
    if (params?.q?.trim()) q.set("q", params.q.trim());

    const query = q.toString();
    const url = `${API_BASE}/community${query ? `?${query}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getCommunityList] 실패:", res.status, url, errText);
      return null;
    }

    const raw = await res.json();

    // README 기준: Community 엔티티 배열 또는 호환 구조
    if (Array.isArray(raw)) {
      console.log("[getCommunityList] 배열 응답 사용:", raw.length);
      return raw.map(normalizeCommunityListItem);
    }

    if (Array.isArray((raw as { items?: unknown })?.items)) {
      const items = (raw as { items: unknown[] }).items;
      console.log("[getCommunityList] items 배열 응답 사용:", items.length);
      return items.map(normalizeCommunityListItem);
    }

    console.warn("[getCommunityList] 알 수 없는 응답 형식:", raw);
    return [];
  } catch (e) {
    console.warn("[getCommunityList] 네트워크 에러:", e);
    return null;
  }
}

/** 커뮤니티 상세 조회 (GET /community/:id) */
export async function getCommunityDetail(
  id: string
): Promise<CommunityDetailResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchWithAuth(`${API_BASE}/community/${id}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      console.warn("[getCommunityDetail] 실패:", res.status);
      return null;
    }
    const raw = await res.json();
    return normalizeCommunityDetail(raw);
  } catch (e) {
    console.warn("[getCommunityDetail] 에러:", e);
    return null;
  }
}

/** 커뮤니티 작성 — 텍스트만 (README: `POST /community/json`) */
export async function createCommunity(
  dto: CreateCommunityDto
): Promise<CommunityDetailResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/community/json`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createCommunity] 실패:", res.status, errText);
      return null;
    }

    return res.json() as Promise<CommunityDetailResponse>;
  } catch (e) {
    console.warn("[createCommunity] 에러:", e);
    return null;
  }
}

/**
 * 커뮤니티 작성 — 이미지 포함 (README: `POST /community` + multipart)
 */
export async function createCommunityWithFiles(
  dto: CreateCommunityDto,
  files: LocalImageAsset[],
): Promise<CommunityDetailResponse | null> {
  if (files.length === 0) return createCommunity(dto);
  try {
    const res = await postBoardMultipart(
      "/community",
      dto as unknown as Record<string, unknown>,
      files,
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createCommunityWithFiles] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<CommunityDetailResponse>;
  } catch (e) {
    console.warn("[createCommunityWithFiles] 에러:", e);
    return null;
  }
}

/** 커뮤니티 수정 (PATCH /community/:id) */
export async function updateCommunity(
  id: string,
  dto: UpdateCommunityDto
): Promise<CommunityDetailResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/community/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[updateCommunity] 실패:", res.status, errText);
      return null;
    }

    return res.json() as Promise<CommunityDetailResponse>;
  } catch (e) {
    console.warn("[updateCommunity] 에러:", e);
    return null;
  }
}

/** 커뮤니티 삭제 (DELETE /community/:id) */
export async function deleteCommunity(
  id: string
): Promise<{ ok: boolean; status?: number }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/community/${id}`, {
      method: "DELETE",
      headers,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.warn("[deleteCommunity] 에러:", e);
    return { ok: false };
  }
}

