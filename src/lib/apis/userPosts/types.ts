import type { PaginatedResponse } from "../pagination";

export type MyCommunityPostItem = {
  communityId: string;
  title: string;
  category?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  thumbnailUrl?: string | null;
};

export type MyNewsPostItem = {
  newsId: string;
  title: string;
  place?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  thumbnailUrl?: string | null;
};

export type MyAnnouncementPostItem = {
  postId: string;
  title: string;
  category?: string;
  scheduledAt?: string;
  deadlineAt?: string;
  status?: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
};

export type MyPostsResponse = {
  community: PaginatedResponse<MyCommunityPostItem>;
  news: PaginatedResponse<MyNewsPostItem>;
  announcements: PaginatedResponse<MyAnnouncementPostItem>;
};

export type MyPostHighlightsResponse = {
  latestCommunity: MyCommunityPostItem | null;
  recentNews: MyNewsPostItem[];
  latestAnnouncement: MyAnnouncementPostItem | null;
};

export type MyCommentPostItem = {
  commentId: string;
  content: string;
  createdAt: string;
  targetType: "NEWS" | "COMMUNITY";
  targetId: string;
  postTitle?: string | null;
};
