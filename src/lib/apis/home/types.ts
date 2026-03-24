export type HomeAnnouncementItem = {
  postId: string;
  title: string;
  type: string;
  isRecruiting: boolean;
  dDay: string;
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
