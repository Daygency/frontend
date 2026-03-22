export type FollowListInitialTab = "following" | "followers";

/** Root stack — FollowList 화면 params */
export type FollowListParams = {
  /** 조회 대상 유저 (생략 시 로그인한 본인) */
  userId?: string;
  /** 처음 열 탭 */
  initialTab?: FollowListInitialTab;
  /** 헤더 등에 표시할 이름 */
  titleName?: string;
};
