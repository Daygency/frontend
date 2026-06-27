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
  try {
    const search = new URLSearchParams();
    if (params?.cursor) search.set("cursor", params.cursor);
    if (params?.limit) search.set("limit", String(params.limit));
    const qs = search.toString();
    const res = await fetch(
      `${API_BASE}/home-banners/feed${qs ? `?${qs}` : ""}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as HomeBannerFeedResponse;
    if (!data || !Array.isArray(data.items)) return null;
    return data;
  } catch {
    return null;
  }
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
