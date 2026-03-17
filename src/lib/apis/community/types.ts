export type CommunityCategory = {
  categoryId: string;
  name: string;
};

export type CommunityListItem = {
  communityId: string;
  title: string;
  content: string;
  createdAt: string;
  user: Record<string, unknown>;
  category: Record<string, unknown>;
  file: Record<string, unknown> | null;
};

export type CommunityListParams = {
  categoryId?: string;
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

