import type { AnnouncementPriceType } from "../announcement/types";

export type HomeAnnouncementItem = {
  postId: string;
  title: string;
  type: string;
  isRecruiting: boolean;
  dDay: string;
  priceType?: AnnouncementPriceType;
  price?: number;
  majorIds?: string[];
  majors?: { majorId: string; name: string }[];
  /** 홈 최신 공고 — DB 저장 누적 조회수 */
  viewCount?: number;
  /** 공연·모집 장소 */
  address?: string;
  /** 마감일 ISO 8601 — API `deadlineAt` (D-day 표시 보정용) */
  deadlineAt?: string;
};

export type HomeNewsItem = {
  newsId: string;
  title: string;
  place: string;
  startedAt: string;
  thumbnailUrl: string | null;
};

export type HomeCommunityLatestPost = {
  communityId: string;
  title: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
};

export type HomeCommunityCategoryItem = {
  categoryId: string;
  categoryName: string;
  latestPost: HomeCommunityLatestPost | null;
};

export type HomeResponse = {
  latestAnnouncements: HomeAnnouncementItem[];
  recentNews: HomeNewsItem[];
  latestCommunityByCategory: HomeCommunityCategoryItem[];
};
