export type CommunityCategory = {
  categoryId: string;
  name: string;
};

export type CommunityListItem = {
  communityId: string;
  title: string;
  content: string;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  scrapCount?: number;
  /** README 목록 썸네일 */
  thumbnailUrl?: string | null;
  /** README: 업로드 이미지 (목록 썸네일 폴백) */
  attachments?: unknown;
  user: Record<string, unknown>;
  category: { categoryId?: string; name?: string } | string;
  /** 레거시 대표 file — `thumbnailUrl` 없을 때 폴백 */
  file: Record<string, unknown> | null;
};

export type CommunityListParams = {
  categoryId?: string;
  q?: string;
  cursor?: string;
  limit?: number;
};

export type CommunityAttachmentItem = {
  fileId: string;
  imgUrl: string;
  sortOrder: number;
};

export type CommunityDetailResponse = {
  communityId: string;
  title: string;
  content: string;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  user: Record<string, unknown>;
  category: CommunityCategory;
  file: Record<string, unknown> | null;
  /** README: 업로드 이미지 */
  attachments?: CommunityAttachmentItem[];
  isMine?: boolean;
};

export type CreateCommunityDto = {
  title: string;
  content: string;
  categoryId: string;
  fileId?: string | null;
};

export type UpdateCommunityDto = Partial<CreateCommunityDto>;

