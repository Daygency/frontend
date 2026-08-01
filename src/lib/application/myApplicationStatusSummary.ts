import { getMyAppliedAnnouncementList } from "../apis/announcement/announcementApi";
import { getMyApplicationForPost } from "../apis/application/applicationApi";
import type { AnnouncementListItem } from "../apis/announcement/types";

export type MyApplicationStatusSummary = {
  underReview: number;
  accepted: number;
  activityEnded: number;
  rejected: number;
};

export type MyApplicationStatusGroups = {
  /** 심사 대기(`SUBMITTED`) + 서류 검토 중(`DOCUMENT_REVIEW`) — "검토중" 탭 */
  UNDER_REVIEW: AnnouncementListItem[];
  /** 합격(`ACCEPTED`) + 공고 활동 진행 중(`completed`=false) — "수락됨" 탭 */
  ACCEPTED: AnnouncementListItem[];
  /** 합격(`ACCEPTED`) + 공고 활동 종료(`completed`=true) — "활동종료" 탭 */
  ACTIVITY_ENDED: AnnouncementListItem[];
  REJECTED: AnnouncementListItem[];
};

export type MyApplicationStatusResult = {
  summary: MyApplicationStatusSummary;
  groups: MyApplicationStatusGroups;
};

const PAGE_LIMIT = 50;
const MAX_PAGES = 20;

async function collectAppliedItems(): Promise<AnnouncementListItem[] | null> {
  const items: AnnouncementListItem[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await getMyAppliedAnnouncementList({ cursor, limit: PAGE_LIMIT });
    if (!res) {
      return page === 0 ? null : items;
    }
    items.push(...res.items);
    if (!res.hasMore || !res.nextCursor) break;
    cursor = res.nextCursor;
  }

  return items;
}

/**
 * 지원한 모든 공고를 순회해 심사 상태별로 묶는다.
 * (지원 목록 API는 공고별 응답이라 공고당 지원 상태 조회를 함께 호출)
 */
export async function getMyApplicationsByStatus(): Promise<MyApplicationStatusResult | null> {
  const appliedItems = await collectAppliedItems();
  if (!appliedItems) return null;

  const statusResults = await Promise.all(
    appliedItems.map((item) => getMyApplicationForPost(item.postId)),
  );

  const groups: MyApplicationStatusGroups = {
    UNDER_REVIEW: [],
    ACCEPTED: [],
    ACTIVITY_ENDED: [],
    REJECTED: [],
  };

  appliedItems.forEach((item, index) => {
    const result = statusResults[index];
    if (!result.ok) return;
    const status = result.data.status;
    if (status === "SUBMITTED" || status === "DOCUMENT_REVIEW") {
      groups.UNDER_REVIEW.push(item);
    } else if (status === "ACCEPTED") {
      (item.completed ? groups.ACTIVITY_ENDED : groups.ACCEPTED).push(item);
    } else if (status === "REJECTED") {
      groups.REJECTED.push(item);
    }
  });

  return {
    groups,
    summary: {
      underReview: groups.UNDER_REVIEW.length,
      accepted: groups.ACCEPTED.length,
      activityEnded: groups.ACTIVITY_ENDED.length,
      rejected: groups.REJECTED.length,
    },
  };
}
