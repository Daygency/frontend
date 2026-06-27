import { API_BASE } from "../api";

export type HomeBannerListItem = {
  bannerId: string;
  title: string;
  imageUrl: string;
  isCurrent?: boolean;
  createdAt?: string;
};

export type HomeBannerDetail = {
  bannerId: string;
  title: string;
  imageUrls: string[];
  createdAt?: string;
};

export type HomeBannerFeedResponse = {
  items: HomeBannerListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export async function getHomeBanners(): Promise<HomeBannerListItem[]> {
  try {
    const res = await fetch(`${API_BASE}/home-banners/all`);
    if (!res.ok) return [];
    const data = (await res.json()) as HomeBannerListItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getHomeBannerFeed(params?: {
  cursor?: string;
  limit?: number;
}): Promise<HomeBannerFeedResponse | null> {
  const limit = params?.limit ?? 20;

  try {
    const search = new URLSearchParams();
    if (params?.cursor) search.set("cursor", params.cursor);
    search.set("limit", String(limit));
    const qs = search.toString();
    const res = await fetch(`${API_BASE}/home-banners/feed?${qs}`);
    if (res.ok) {
      const data = (await res.json()) as HomeBannerFeedResponse;
      if (data && Array.isArray(data.items)) return data;
    }
  } catch {
    // feed 미배포·구버전 서버 — /all 폴백
  }

  return paginateHomeBannersFromAll(params?.cursor, limit);
}

async function paginateHomeBannersFromAll(
  cursor: string | undefined,
  limit: number,
): Promise<HomeBannerFeedResponse | null> {
  const all = await getHomeBanners();
  if (!all.length) {
    return { items: [], nextCursor: null, hasMore: false };
  }

  const start = cursor
    ? (() => {
        const index = all.findIndex((item) => item.bannerId === cursor);
        return index >= 0 ? index + 1 : all.length;
      })()
    : 0;

  if (start >= all.length) {
    return { items: [], nextCursor: null, hasMore: false };
  }

  const items = all.slice(start, start + limit);
  const hasMore = start + limit < all.length;
  const nextCursor = hasMore
    ? items[items.length - 1]?.bannerId ?? null
    : null;

  return { items, nextCursor, hasMore };
}

export async function getHomeBannerDetail(
  bannerId: string,
): Promise<HomeBannerDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE}/home-banners/${encodeURIComponent(bannerId)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as HomeBannerDetail & {
      imageUrl?: string;
      content?: string;
    };
    if (!data.imageUrls?.length && data.imageUrl) {
      return { ...data, imageUrls: [data.imageUrl] };
    }
    return data;
  } catch {
    return null;
  }
}
