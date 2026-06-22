/** GET /follow/users/:userId/following | followers 응답의 각 항목 */
export type FollowListItemDto = {
  userId: string;
  name: string;
  activityName: string;
  profileImgUrl: string;
  followedAt: string;
};

export type FollowListPageDto = {
  items: FollowListItemDto[];
  nextCursor: string | null;
  hasMore: boolean;
};
