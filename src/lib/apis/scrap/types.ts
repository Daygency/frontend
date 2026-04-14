export type ScrapTargetType = "NEWS" | "COMMUNITY" | "ANNOUNCEMENT";

export type ScrapUser = {
  userId?: string;
  [key: string]: unknown;
};

export type ScrapItem = {
  id: string;
  createdAt: string;
  targetType: ScrapTargetType;
  targetId: string;
  user?: ScrapUser;
};

export type GetScrapsParams = {
  targetType: ScrapTargetType;
  targetId: string;
};

export type GetScrapsResponse = {
  count: number;
  items: ScrapItem[];
};

export type CreateScrapDto = {
  targetType: ScrapTargetType;
  targetId: string;
};

export type MyScrappedAnnouncementItem = {
  scrapId: string;
  scrappedAt: string;
  postId: string;
  title: string;
  type: string;
  isRecruiting: boolean;
  dDay: string;
  majorIds?: string[];
  majors?: { majorId: string; name: string }[];
};

export type MyScrappedAnnouncementsResponse = {
  items: MyScrappedAnnouncementItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type GetMyScrappedAnnouncementsParams = {
  cursor?: string;
  limit?: number;
};

export type MyScrappedCommunityItem = {
  scrapId: string;
  scrappedAt: string;
  communityId: string;
  title: string;
  category?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  thumbnailUrl?: string | null;
};

export type MyScrappedNewsItem = {
  scrapId: string;
  scrappedAt: string;
  newsId: string;
  title: string;
  place?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  thumbnailUrl?: string | null;
};

export type MyScrappedCommunityResponse = {
  items: MyScrappedCommunityItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type MyScrappedNewsResponse = {
  items: MyScrappedNewsItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type GetMyScrappedCommunityParams = {
  cursor?: string;
  limit?: number;
};

export type GetMyScrappedNewsParams = {
  cursor?: string;
  limit?: number;
};

export type MyScrappedHighlightsResponse = {
  latestScrappedCommunity: MyScrappedCommunityItem | null;
  latestScrappedNews: MyScrappedNewsItem[];
};
