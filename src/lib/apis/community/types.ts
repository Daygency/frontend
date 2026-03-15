export type CommunityCategory = {
  categoryId: string;
  name: string;
};

export type CommunityListParams = {
  cursor?: string;
  limit?: number;
  categoryId?: string;
};

export type CommunityListItem = {
  communityId: string;
  title: string;
  category: string;
  createdAt: string;
};

export type CommunityListResponse = {
  items: CommunityListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type CommunityDetailResponse = {
  communityId: string;
  title: string;
  content: string;
  createdAt: string;
  user: Record<string, unknown>;
  category: CommunityCategory;
  file: Record<string, unknown> | null;
  isMine?: boolean;
};

export type CreateCommunityDto = {
  title: string;
  content: string;
  categoryId: string;
  fileId?: string | null;
};

export type UpdateCommunityDto = Partial<CreateCommunityDto>;

