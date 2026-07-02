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

export async function getAnnouncementPicks(): Promise<AnnouncementPickItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/announcement-picks`);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getAnnouncementPicks] 실패:", res.status, errText);
      return null;
    }
    const data = (await res.json()) as AnnouncementPickItem[];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("[getAnnouncementPicks] 네트워크 에러:", e);
    return null;
  }
}
