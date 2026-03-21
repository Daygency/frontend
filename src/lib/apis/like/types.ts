export type LikeType = "NEWS" | "COMMUNITY" | "ANNOUNCEMENT" | "COMMENT";

export type LikeUser = {
  userId?: string;
  [key: string]: unknown;
};

export type LikeItem = {
  id: string;
  createdAt: string;
  likeType: LikeType;
  targetId: string;
  user?: LikeUser;
};

export type GetLikesParams = {
  likeType: LikeType;
  targetId: string;
};

export type GetLikesResponse = {
  count: number;
  items: LikeItem[];
};

export type CreateLikeDto = {
  likeType: LikeType;
  targetId: string;
};
