import { resolveAnnouncementRecruitmentStatus } from "./announcementDeadline";

/** 목록·카드용 모집 상태 라벨 */
export function announcementListRecruitmentStatus(item: {
  isRecruiting: boolean;
  completed?: boolean;
  deadlineAt?: string | null;
}): "모집중" | "모집마감" {
  return resolveAnnouncementRecruitmentStatus(item.isRecruiting, {
    completed: item.completed,
    deadlineAt: item.deadlineAt,
  });
}
