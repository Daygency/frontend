/**
 * README 부록 B — `POST/PATCH /applications` 본문은 `CreateApplicationDto` / `UpdateApplicationDto` 필드명
 * (`name`, `birth`, `major` …). 공고 `applicationConfig`의 `include*`는 **어떤 항목을 켤지**만 정하고,
 * 요청 JSON에는 README 표의 필드명으로 값을 보냅니다.
 */

import type {
  ApplicationSnapshotAward,
  ApplicationSnapshotCareer,
  ApplicationSnapshotCertificate,
  ApplicationSnapshotEducation,
  ApplicationSnapshotFile,
} from "./snapshot.types";

export type { ApplicationSnapshotAward, ApplicationSnapshotCareer, ApplicationSnapshotCertificate, ApplicationSnapshotEducation, ApplicationSnapshotFile } from "./snapshot.types";

export type ApplicationGender = "FEMALE" | "MALE" | "NONE";

/** README: `PATCH /applications/:id/status` — 공고 작성자만 */
export type ApplicationReviewStatus =
  | "SUBMITTED"
  | "DOCUMENT_REVIEW"
  | "ACCEPTED"
  | "REJECTED";

export type CreateApplicationDto = {
  postId: string;
  name?: string;
  /** README: datetime 저장, 요청은 ISO 8601 문자열 */
  birth?: string;
  gender?: ApplicationGender;
  major?: string;
  majorDetail?: string;
  category?: string;
  music?: string;
  address?: string;
  link?: string;
  department?: string;
  introduce?: string;
  /** README 스냅샷 — 프로필 id 없이 항목만 */
  file?: ApplicationSnapshotFile[];
  education?: ApplicationSnapshotEducation[];
  career?: ApplicationSnapshotCareer[];
  award?: ApplicationSnapshotAward[];
  certificate?: ApplicationSnapshotCertificate[];
};

export type UpdateApplicationDto = Partial<
  Omit<CreateApplicationDto, "postId">
>;

export type UpdateApplicationStatusDto = {
  status: ApplicationReviewStatus;
};

export type ApplicationApplicantSummary = {
  userId: string;
  name?: string | null;
  activityName?: string;
  profileImgUrl?: string;
};

/** GET 응답 등 — README 부록 B 엔티티 표 (`name`~`introduce`, 스냅샷 배열, `status`, 타임스탬프) */
export type ApplicationEntity = Partial<Omit<CreateApplicationDto, "postId">> & {
  id: string;
  postId?: string;
  userId?: string;
  /** GET /applications/:id — 지원자 공개 프로필 요약 */
  applicant?: ApplicationApplicantSummary;
  /** GET /applications/post/:postId — nested `user` 프로필 이미지 (구 응답 호환) */
  profileImgUrl?: string;
  activityName?: string;
  status?: ApplicationReviewStatus;
  createdAt?: string;
  canceledAt?: string | null;
  deletedAt?: string | null;
};
