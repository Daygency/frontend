import { API_BASE } from "../api";
import type { HomeResponse } from "./types";
import {
  pickAddressFromAnnouncementRaw,
  pickDeadlineAtFromAnnouncementRaw,
  pickMajorsFromAnnouncementRaw,
} from "../../announcement/recruitmentMajors";

function normalizeHomeBanners(raw: unknown): HomeResponse["banners"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const bannerId = String(row.bannerId ?? row.banner_id ?? "").trim();
      const imageUrl = String(row.imageUrl ?? row.image_url ?? "").trim();
      const title = String(row.title ?? "").trim();
      if (!bannerId || !imageUrl) return null;
      return { bannerId, title, imageUrl };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);
}

function normalizeHomeCommunity(
  raw: unknown,
): HomeResponse["latestCommunityByCategory"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const latestRaw = row.latestPost ?? row.latest_post;
    let latestPost: HomeResponse["latestCommunityByCategory"][number]["latestPost"] =
      null;

    if (latestRaw && typeof latestRaw === "object") {
      const post = latestRaw as Record<string, unknown>;
      const communityId = String(
        post.communityId ?? post.community_id ?? "",
      ).trim();
      if (communityId) {
        const createdAtRaw = post.createdAt ?? post.created_at;
        latestPost = {
          communityId,
          title: String(post.title ?? ""),
          likeCount: Number(post.likeCount ?? post.like_count ?? 0),
          commentCount: Number(post.commentCount ?? post.comment_count ?? 0),
          viewCount: Number(post.viewCount ?? post.view_count ?? 0),
          ...(createdAtRaw
            ? { createdAt: String(createdAtRaw) }
            : {}),
        };
      }
    }

    return {
      categoryId: String(row.categoryId ?? row.category_id ?? ""),
      categoryName: String(row.categoryName ?? row.category_name ?? ""),
      latestPost,
    };
  });
}

function normalizeHomeAnnouncements(
  raw: unknown,
): HomeResponse["latestAnnouncements"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const address = pickAddressFromAnnouncementRaw(row);
    const deadlineAt = pickDeadlineAtFromAnnouncementRaw(row);
    const createdAtRaw = row.createdAt ?? row.created_at;
    return {
      ...(row as HomeResponse["latestAnnouncements"][number]),
      ...pickMajorsFromAnnouncementRaw(row),
      ...(address ? { address } : {}),
      ...(deadlineAt ? { deadlineAt } : {}),
      ...(createdAtRaw ? { createdAt: String(createdAtRaw) } : {}),
    };
  });
}

function normalizeHomeResponse(raw: unknown): HomeResponse {
  const data = (raw ?? {}) as Record<string, unknown>;
  return {
    banners: normalizeHomeBanners(data.banners),
    latestAnnouncements: normalizeHomeAnnouncements(data.latestAnnouncements),
    recentNews: Array.isArray(data.recentNews)
      ? (data.recentNews as HomeResponse["recentNews"])
      : [],
    latestCommunityByCategory: normalizeHomeCommunity(
      data.latestCommunityByCategory,
    ),
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
