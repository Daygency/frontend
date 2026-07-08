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

export async function getHomeBanners(
  params?: { cursor?: string; limit?: number },
): Promise<HomeBannerFeedResponse> {
  try {
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetch(`${API_BASE}/home-banners/all${query ? `?${query}` : ""}`);
    if (!res.ok) return { items: [], nextCursor: null, hasMore: false };
    const data = (await res.json()) as Partial<HomeBannerFeedResponse>;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      nextCursor: data.nextCursor ?? null,
      hasMore: Boolean(data.hasMore),
    };
  } catch {
    return { items: [], nextCursor: null, hasMore: false };
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

  // /feed 미배포·구버전 서버 — 이제 /all 도 자체적으로 커서 페이지네이션을 지원하므로 그대로 위임
  return getHomeBanners({ cursor: params?.cursor, limit });
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
