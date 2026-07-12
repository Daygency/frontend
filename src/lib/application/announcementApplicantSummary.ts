import { getApplicationsForPost } from "../apis/application/applicationApi";

export type AnnouncementApplicantSummary = {
  total: number;
  submitted: number;
  accepted: number;
  rejected: number;
};

const PAGE_LIMIT = 50;
const MAX_PAGES = 20;

/** 내가 작성한 공고 1건의 지원자 현황(전체/지원완료/수락/거절) 집계 */
export async function getAnnouncementApplicantSummary(
  postId: string,
): Promise<AnnouncementApplicantSummary | null> {
  const summary: AnnouncementApplicantSummary = {
    total: 0,
    submitted: 0,
    accepted: 0,
    rejected: 0,
  };

  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await getApplicationsForPost(postId, { cursor, limit: PAGE_LIMIT });
    if (!res.ok) {
      return page === 0 ? null : summary;
    }
    for (const application of res.data) {
      summary.total += 1;
      if (application.status === "SUBMITTED") summary.submitted += 1;
      else if (application.status === "ACCEPTED") summary.accepted += 1;
      else if (application.status === "REJECTED") summary.rejected += 1;
    }
    if (!res.hasMore || !res.nextCursor) break;
    cursor = res.nextCursor;
  }

  return summary;
}
