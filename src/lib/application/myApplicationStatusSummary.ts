import { getMyAppliedAnnouncementList } from "../apis/announcement/announcementApi";
import { getMyApplicationForPost } from "../apis/application/applicationApi";
import type { AnnouncementListItem } from "../apis/announcement/types";

export type MyApplicationStatusSummary = {
  submitted: number;
  accepted: number;
  rejected: number;
};

export type MyApplicationStatusGroups = {
  SUBMITTED: AnnouncementListItem[];
  ACCEPTED: AnnouncementListItem[];
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
    SUBMITTED: [],
    ACCEPTED: [],
    REJECTED: [],
  };

  appliedItems.forEach((item, index) => {
    const result = statusResults[index];
    if (!result.ok) return;
    const status = result.data.status;
    if (status === "SUBMITTED" || status === "ACCEPTED" || status === "REJECTED") {
      groups[status].push(item);
    }
  });

  return {
    groups,
    summary: {
      submitted: groups.SUBMITTED.length,
      accepted: groups.ACCEPTED.length,
      rejected: groups.REJECTED.length,
    },
  };
}
