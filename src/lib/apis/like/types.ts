export type MyLikedCommunityItem = {
  likeId: string;
  likedAt: string;
  communityId: string;
  title: string;
  category?: string | null;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  thumbnailUrl?: string | null;
};

export type MyLikedNewsItem = {
  likeId: string;
  likedAt: string;
  newsId: string;
  title: string;
  place?: string;
  createdAt: string;
  likeCount?: number;
  viewCount?: number;
  commentCount?: number;
  thumbnailUrl?: string | null;
};

export type MyLikedCommentItem = {
  likeId: string;
  likedAt: string;
  commentId: string;
  content: string;
  targetType: "NEWS" | "COMMUNITY";
  targetId: string;
  createdAt: string;
  postTitle?: string | null;
};

export type MyLikedCommunityResponse = {
  items: MyLikedCommunityItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type MyLikedNewsResponse = {
  items: MyLikedNewsItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type MyLikedCommentsResponse = {
  items: MyLikedCommentItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type MyLikedHighlightsResponse = {
  latestLikedCommunity: MyLikedCommunityItem | null;
  latestLikedNews: MyLikedNewsItem[];
};

export type GetMyLikedListParams = {
  cursor?: string;
  limit?: number;
};
