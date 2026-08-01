/** README: 활동 후기 API (`POST /announcement/:postId/reviews`) */

export type ActivityReviewRating = "DISAPPOINTING" | "GOOD" | "IMPRESSED";

export const DISAPPOINTMENT_REASON_CODES = [
  "TIME_NOT_KEPT",
  "COMMUNICATION",
  "RESPONSE_LATE_OR_UNCLEAR",
  "INSUFFICIENT_PREP",
  "UNCOMFORTABLE_PROCESS",
  "REQUESTS_NOT_REFLECTED",
  "PROBLEM_RESPONSE_WEAK",
] as const;

export type DisappointmentReasonCode = (typeof DISAPPOINTMENT_REASON_CODES)[number];

export const DISAPPOINTMENT_REASON_LABELS: Record<
  DisappointmentReasonCode,
  string
> = {
  TIME_NOT_KEPT: "시간 약속이 지켜지지 않았어요",
  COMMUNICATION: "소통이 원활하지 않았어요",
  RESPONSE_LATE_OR_UNCLEAR: "응답이 늦거나 불분명했어요",
  INSUFFICIENT_PREP: "준비가 충분하지 않다고 느껴졌어요",
  UNCOMFORTABLE_PROCESS: "함께 일하는 과정이 다소 불편했어요",
  REQUESTS_NOT_REFLECTED: "요청 사항이 잘 반영되지 않았어요",
  PROBLEM_RESPONSE_WEAK: "문제 상황에 대한 대응이 아쉬웠어요",
};

/** `GOOD`/`IMPRESSED` 공통 체크리스트 (긍정 사유) */
export const POSITIVE_REASON_CODES = [
  "TIME_WELL_KEPT",
  "FLEXIBLE_ON_SCHEDULE_CHANGE",
  "SMOOTH_COMMUNICATION",
  "FAST_AND_CLEAR_RESPONSE",
  "WELL_PREPARED",
  "COMFORTABLE_COLLABORATION",
  "POLITE_AND_CONSIDERATE",
  "CALM_PROBLEM_SOLVING",
] as const;

export type PositiveReasonCode = (typeof POSITIVE_REASON_CODES)[number];

export const POSITIVE_REASON_LABELS: Record<PositiveReasonCode, string> = {
  TIME_WELL_KEPT: "시간 약속을 잘 지켜주셨어요",
  FLEXIBLE_ON_SCHEDULE_CHANGE: "일정 변경에도 유연하게 대응해주셨어요",
  SMOOTH_COMMUNICATION: "소통이 원활했어요",
  FAST_AND_CLEAR_RESPONSE: "응답이 빠르고 명확했어요",
  WELL_PREPARED: "준비가 충분히 되어 있었어요",
  COMFORTABLE_COLLABORATION: "함께 일하는 과정이 편안했어요",
  POLITE_AND_CONSIDERATE: "정중하고 배려심이 느껴졌어요",
  CALM_PROBLEM_SOLVING: "문제 상황에 침착하게 대응해주셨어요",
};

export type ActivityReviewEntity = {
  id: string;
  postId: string;
  reviewerUserId: string;
  revieweeUserId: string;
  rating: ActivityReviewRating;
  disappointmentReasonCodes: DisappointmentReasonCode[] | null;
  positiveReasonCodes?: PositiveReasonCode[] | null;
  comment: string | null;
  createdAt: string;
};

export type ActivityReviewUserSummary = {
  userId: string;
  name: string;
  activityName: string;
  profileImgUrl: string | null;
};

export type ActivityReviewAnnouncementSummary = {
  postId: string;
  title: string;
  scheduledAt: string | null;
};

/** 공고 작성자(owner)인지, 수락된 지원자(accepted)인지 */
export type ActivityReviewerRole = "owner" | "accepted";

export type ActivityReviewListItem = ActivityReviewEntity & {
  announcement: ActivityReviewAnnouncementSummary | null;
  reviewer: ActivityReviewUserSummary | null;
  reviewee: ActivityReviewUserSummary | null;
  reviewerRole?: ActivityReviewerRole;
  hiddenFromProfileAt?: string | null;
};

export type ActivityReviewCursorListResponse = {
  items: ActivityReviewListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

/** `GET /reviews/received/tag-summary` 응답 항목 (개수 내림차순) */
export type ActivityReviewTagSummaryItem = {
  code: PositiveReasonCode;
  count: number;
};
