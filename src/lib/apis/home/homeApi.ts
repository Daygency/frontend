import { API_BASE } from "../api";
import type { HomeResponse } from "./types";
import {
  pickAddressFromAnnouncementRaw,
  pickMajorsFromAnnouncementRaw,
} from "../../announcement/recruitmentMajors";

function normalizeHomeResponse(raw: unknown): HomeResponse {
  const data = (raw ?? {}) as Record<string, unknown>;
  return {
    latestAnnouncements: Array.isArray(data.latestAnnouncements)
      ? data.latestAnnouncements.map((item) => {
          const address = pickAddressFromAnnouncementRaw(item);
          return {
            ...(item as HomeResponse["latestAnnouncements"][number]),
            ...pickMajorsFromAnnouncementRaw(item),
            ...(address ? { address } : {}),
          };
        })
      : [],
    recentNews: Array.isArray(data.recentNews)
      ? (data.recentNews as HomeResponse["recentNews"])
      : [],
    latestCommunityByCategory: Array.isArray(data.latestCommunityByCategory)
      ? (data.latestCommunityByCategory as HomeResponse["latestCommunityByCategory"])
      : [],
  };
}

/** 홈 화면 통합 조회 (GET /home) */
export async function getHome(): Promise<HomeResponse | null> {
  try {
    const url = `${API_BASE}/home`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn("[getHome] 실패:", res.status, url, errText);
      return null;
    }
    const raw = await res.json();
    return normalizeHomeResponse(raw);
  } catch (e) {
    console.warn("[getHome] 네트워크 에러:", e);
    return null;
  }
}
