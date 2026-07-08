import { API_BASE } from "../api";

export type FaqItem = {
  faqId: string;
  question: string;
  answer: string;
};

export async function getFaqs(): Promise<FaqItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/faqs`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getFaqs] 실패:", res.status, errText);
      return null;
    }
    const data = (await res.json()) as FaqItem[];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("[getFaqs] 네트워크 에러:", e);
    return null;
  }
}
