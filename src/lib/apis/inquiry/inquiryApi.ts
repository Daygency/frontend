import { postBoardMultipart } from "../multipartPost";
import { fetchWithAuth } from "../fetchWithAuth";
import { API_BASE } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_KEY } from "../api";
import type { LocalImageAsset } from "../fileApi";
import type { PaginatedResponse } from "../pagination";

export type GetMyInquiriesParams = {
  cursor?: string;
  limit?: number;
};

export type InquiryDto = {
  id: string;
  content: string;
  imageUrls: string[];
  isAnswered: boolean;
  answer: string | null;
  createdAt: string;
  answeredAt: string | null;
};

function formatInquiryDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function mapInquiryToItem(row: InquiryDto) {
  return {
    id: row.id,
    content: row.content,
    date: formatInquiryDate(row.createdAt),
    isAnswered: row.isAnswered,
    answer: row.answer ?? undefined,
    images: row.imageUrls ?? [],
  };
}

export async function createInquiry(
  content: string,
  images: LocalImageAsset[],
): Promise<InquiryDto | null> {
  try {
    const res = await postBoardMultipart(
      "/inquiries",
      { content },
      images.slice(0, 3),
    );
    if (!res.ok) {
      console.warn("[createInquiry]", res.status, await res.text().catch(() => ""));
      return null;
    }
    return (await res.json()) as InquiryDto;
  } catch (e) {
    console.warn("[createInquiry]", e);
    return null;
  }
}

const EMPTY_INQUIRIES: PaginatedResponse<InquiryDto> = {
  items: [],
  nextCursor: null,
  hasMore: false,
};

export async function getMyInquiries(
  params?: GetMyInquiriesParams,
): Promise<PaginatedResponse<InquiryDto>> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return EMPTY_INQUIRIES;
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/inquiries${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    if (!res.ok) {
      console.warn("[getMyInquiries]", res.status, await res.text().catch(() => ""));
      return EMPTY_INQUIRIES;
    }
    const data = (await res.json()) as Partial<PaginatedResponse<InquiryDto>>;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      nextCursor: data.nextCursor ?? null,
      hasMore: Boolean(data.hasMore),
    };
  } catch (e) {
    console.warn("[getMyInquiries]", e);
    return EMPTY_INQUIRIES;
  }
}

export async function getMyInquiry(inquiryId: string): Promise<InquiryDto | null> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;
    const res = await fetchWithAuth(
      `${API_BASE}/inquiries/${encodeURIComponent(inquiryId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    if (!res.ok) {
      console.warn("[getMyInquiry]", res.status, await res.text().catch(() => ""));
      return null;
    }
    return (await res.json()) as InquiryDto;
  } catch (e) {
    console.warn("[getMyInquiry]", e);
    return null;
  }
}
