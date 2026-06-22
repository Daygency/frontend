export type CommentTargetType = "NEWS" | "COMMUNITY";

export type CommentUser = {
  userId?: string;
  name?: string;
  profileImgUrl?: string;
  profile_img_url?: string;
  [key: string]: unknown;
};

export type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  deletedAt?: string | null;
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string | null;
  user?: CommentUser;
  [key: string]: unknown;
};

export type GetCommentsParams = {
  targetType: CommentTargetType;
  targetId: string;
};

export type CreateCommentDto = {
  content: string;
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string;
};

export type UpdateCommentDto = {
  content: string;
};
