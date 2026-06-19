/** README.md — GET /users */

export type UserMajorSummary = {
  majorId: string;
  name: string;
};

export type UserListItem = {
  userId: string;
  nickname: string;
  activityName: string;
  profileImgUrl: string;
  aboutMe: string | null;
  createdAt: string;
  major: UserMajorSummary | null;
};

export type UserListResponse = {
  items: UserListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
