import type { ApplicationReviewStatus } from "../apis/application/types";

/** 지원 심사 상태 — 모집자(받은 지원) 목록·상세 UI 라벨 */
export function applicationStatusLabel(
  s: ApplicationReviewStatus | undefined,
): string {
  if (!s) return "—";
  const map: Record<ApplicationReviewStatus, string> = {
    SUBMITTED: "검토 대기",
    DOCUMENT_REVIEW: "서류 검토 중",
    ACCEPTED: "수락",
    REJECTED: "거절",
  };
  return map[s] ?? s;
}
