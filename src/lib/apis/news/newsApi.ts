import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type { LocalImageAsset } from "../fileApi";
import { postBoardMultipart } from "../multipartPost";
import { pickReportedUserIdFromUnknown } from "../../report/pickReportedUserId";
import type {
  CreateNewsDto,
  CreateNewsResponse,
  NewsListParams,
  NewsListResponse,
  NewsDetailResponse,
  NewsListItem,
  NewsAttachmentItem,
  NewsUserInfo,
  NewsFileInfo,
  UpdateNewsDto,
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

/** README: `thumbnailUrl` — snake_case 병합 + 목록에 `attachments`/`file` 폴백 */
function normalizeNewsListItem(raw: unknown): NewsListItem {
  const r = raw as Record<string, unknown>;
  const fileVal = r.file;
  const file =
    fileVal === null || fileVal === undefined
      ? null
      : typeof fileVal === "object"
        ? (fileVal as Record<string, unknown>)
        : null;
  return {
    newsId: String(r.newsId ?? r.news_id ?? ""),
    title: String(r.title ?? ""),
    place: String(r.place ?? ""),
    startedAt: String(r.startedAt ?? r.started_at ?? ""),
    viewCount: pickNumber(r.viewCount, r.view_count),
    likeCount: pickNumber(r.likeCount, r.like_count),
    commentCount: pickNumber(r.commentCount, r.comment_count),
    thumbnailUrl: pickOptionalString(r.thumbnailUrl, r.thumbnail_url),
    imageUrl: pickOptionalString(r.imageUrl, r.image_url),
    attachments: r.attachments,
    file,
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
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

/** `user` / `author` / `writer` 또는 글 최상위 작성자 id 필드 병합 */
function coalesceNewsDetailUser(r: Record<string, unknown>): NewsUserInfo | undefined {
  for (const key of ["user", "author", "writer"] as const) {
    const v = r[key];
    if (!v || typeof v !== "object") continue;
    const id = pickReportedUserIdFromUnknown(v);
    if (id) {
      return { ...(v as object), userId: id } as NewsUserInfo;
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
  return undefined;
}

/** GET /news/:id — snake_case·attachments 병합 */
function normalizeNewsDetail(raw: unknown): NewsDetailResponse {
  const r = raw as Record<string, unknown>;
  const attachmentsRaw = r.attachments;
  const attachments: NewsAttachmentItem[] | undefined = Array.isArray(
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
        .filter(Boolean) as NewsAttachmentItem[])
    : undefined;

  const fileRaw = r.file;
  let file: NewsFileInfo | null | undefined;
  if (fileRaw === undefined) file = undefined;
  else if (fileRaw === null) file = null;
  else if (typeof fileRaw === "object") file = fileRaw as NewsFileInfo;
  else file = undefined;

  const tp = r.ticketPrice ?? r.ticket_price;
  let ticketPrice: number | null = null;
  if (tp !== null && tp !== undefined && tp !== "") {
    const n = typeof tp === "number" ? tp : Number(tp);
    ticketPrice = Number.isFinite(n) ? n : null;
  }

  return {
    newsId: String(r.newsId ?? r.news_id ?? ""),
    title: String(r.title ?? ""),
    content: String(r.content ?? ""),
    place: String(r.place ?? ""),
    ticketPrice,
    startedAt: String(r.startedAt ?? r.started_at ?? ""),
    endedAt:
      r.endedAt != null || r.ended_at != null
        ? String(r.endedAt ?? r.ended_at)
        : null,
    contact: String(r.contact ?? ""),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    user: coalesceNewsDetailUser(r),
    file: file === undefined ? undefined : file,
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

/** 공연소식 목록 조회 (GET /news) - 인증 불필요 */
export async function getNewsList(
  params?: NewsListParams
): Promise<NewsListResponse | null> {
  try {
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.q?.trim()) q.set("q", params.q.trim());
    const query = q.toString();
    const url = `${API_BASE}/news${query ? `?${query}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getNewsList] 실패:", res.status, url, errText);
      return null;
    }
    const raw = await res.json();

    // README 기준: 목록은 배열 또는 { items, nextCursor, hasMore } 형식 모두 호환
    if (Array.isArray(raw)) {
      return {
        items: raw.map(normalizeNewsListItem),
        nextCursor: null,
        hasMore: false,
      };
    }

    if (Array.isArray((raw as NewsListResponse)?.items)) {
      const o = raw as NewsListResponse;
      return {
        ...o,
        items: o.items.map(normalizeNewsListItem),
      };
    }

    console.warn("[getNewsList] 알 수 없는 응답 형식:", raw);
    return {
      items: [],
      nextCursor: null,
      hasMore: false,
    };
  } catch (e) {
    console.warn("[getNewsList] 네트워크 에러:", e);
    return null;
  }
}

/** 공연소식 상세 조회 (GET /news/:id) - 인증 시 isMine 정확히 반환 */
export async function getNewsDetail(
  id: string
): Promise<NewsDetailResponse | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetchWithAuth(`${API_BASE}/news/${id}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      console.warn("[getNewsDetail] 실패:", res.status);
      return null;
    }
    const raw = await res.json();
    return normalizeNewsDetail(raw);
  } catch (e) {
    console.warn("[getNewsDetail] 에러:", e);
    return null;
  }
}

/**
 * 공연소식 작성 — 텍스트만 (README: `POST /news/json` + JSON)
 * 401 시 토큰 갱신 후 재시도
 */
export async function createNews(
  dto: CreateNewsDto
): Promise<CreateNewsResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/news/json`, {
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
  } catch (e) {
    console.warn("[createNews] 에러:", e);
    return null;
  }
}

/**
 * 공연소식 작성 — 이미지 포함 (README: `POST /news` + `multipart/form-data`)
 * `payload` + `files` 필드
 */
export async function createNewsWithFiles(
  dto: CreateNewsDto,
  files: LocalImageAsset[],
): Promise<CreateNewsResponse | null> {
  if (files.length === 0) return createNews(dto);
  try {
    const res = await postBoardMultipart(
      "/news",
      dto as unknown as Record<string, unknown>,
      files,
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[createNewsWithFiles] 실패:", res.status, errText);
      return null;
    }
    return res.json() as Promise<CreateNewsResponse>;
  } catch (e) {
    console.warn("[createNewsWithFiles] 에러:", e);
    return null;
  }
}

/** 공연소식 수정 (PATCH /news/:id) */
export async function updateNews(
  id: string,
  dto: UpdateNewsDto,
): Promise<NewsDetailResponse | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/news/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[updateNews] 실패:", res.status, errText);
      return null;
    }
    const raw = await res.json();
    return normalizeNewsDetail(raw);
  } catch (e) {
    console.warn("[updateNews] 에러:", e);
    return null;
  }
}

/** 공연소식 삭제 (DELETE /news/:id) */
export async function deleteNews(
  id: string,
): Promise<{ ok: boolean; status?: number }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/news/${id}`, {
      method: "DELETE",
      headers,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.warn("[deleteNews] 에러:", e);
    return { ok: false };
  }
}
