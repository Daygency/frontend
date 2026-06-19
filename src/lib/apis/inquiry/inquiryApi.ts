import { postBoardMultipart } from "../multipartPost";
import { fetchWithAuth } from "../fetchWithAuth";
import { API_BASE } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_KEY } from "../api";
import type { LocalImageAsset } from "../fileApi";

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

export async function getMyInquiries(): Promise<InquiryDto[]> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return [];
    const res = await fetchWithAuth(`${API_BASE}/inquiries`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      console.warn("[getMyInquiries]", res.status, await res.text().catch(() => ""));
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? (data as InquiryDto[]) : [];
  } catch (e) {
    console.warn("[getMyInquiries]", e);
    return [];
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
