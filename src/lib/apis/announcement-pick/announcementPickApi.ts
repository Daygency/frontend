import { API_BASE } from "../api";

export type AnnouncementPickItem = {
  pickId: string;
  organizerName: string;
  title: string;
  keywords: string[];
  deadlineAt: string;
  imageUrl: string;
  linkUrl: string;
};

export async function getAnnouncementPicks(
  params?: { limit?: number },
): Promise<AnnouncementPickItem[] | null> {
  try {
    const q = new URLSearchParams();
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetch(`${API_BASE}/announcement-picks${query ? `?${query}` : ""}`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getAnnouncementPicks] 실패:", res.status, errText);
      return null;
    }
    const data = (await res.json()) as { items?: AnnouncementPickItem[] };
    return Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.warn("[getAnnouncementPicks] 네트워크 에러:", e);
    return null;
  }
}
