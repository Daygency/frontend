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

export type ActivityReviewEntity = {
  id: string;
  postId: string;
  reviewerUserId: string;
  revieweeUserId: string;
  rating: ActivityReviewRating;
  disappointmentReasonCodes: DisappointmentReasonCode[] | null;
  privateNoteToOps: string | null;
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

export type ActivityReviewListItem = ActivityReviewEntity & {
  announcement: ActivityReviewAnnouncementSummary | null;
  reviewer: ActivityReviewUserSummary | null;
  reviewee: ActivityReviewUserSummary | null;
};

export type ActivityReviewCursorListResponse = {
  items: ActivityReviewListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
