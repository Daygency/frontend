export type MyCommunityPostItem = {
  communityId: string;
  title: string;
  category?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
};

export type MyNewsPostItem = {
  newsId: string;
  title: string;
  place?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
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
  community: MyCommunityPostItem[];
  news: MyNewsPostItem[];
  announcements: MyAnnouncementPostItem[];
};

export type MyPostHighlightsResponse = {
  latestCommunity: MyCommunityPostItem | null;
  recentNews: MyNewsPostItem[];
  latestAnnouncement: MyAnnouncementPostItem | null;
};
