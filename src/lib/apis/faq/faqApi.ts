import { API_BASE } from "../api";
import type { PaginatedResponse } from "../pagination";

export type FaqItem = {
  faqId: string;
  question: string;
  answer: string;
};

const EMPTY_FAQS: PaginatedResponse<FaqItem> = {
  items: [],
  nextCursor: null,
  hasMore: false,
};

export async function getFaqs(
  params?: { cursor?: string; limit?: number },
): Promise<PaginatedResponse<FaqItem> | null> {
  try {
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetch(`${API_BASE}/faqs${query ? `?${query}` : ""}`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getFaqs] 실패:", res.status, errText);
      return null;
    }
    const data = (await res.json()) as Partial<PaginatedResponse<FaqItem>>;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      nextCursor: data.nextCursor ?? null,
      hasMore: Boolean(data.hasMore),
    };
  } catch (e) {
    console.warn("[getFaqs] 네트워크 에러:", e);
    return null;
  }
}
