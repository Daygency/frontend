/**
 * README § 모집 지원서 API — Body·응답 필드는 Swagger `applications` 태그와 동일.
 * 공고 상세 `GET /announcement/:id` 의 `applicationConfig` 와 동일한 include* 키를 보냅니다.
 * `POST /applications` 성공 시 서버가 공고 전용 채팅방·첫 메시지를 처리하므로, 프론트는 채팅 목록 새로고침을 맞추면 됩니다.
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
  includeName?: string;
  /** README: datetime 저장, 요청은 ISO 8601 문자열 */
  includeBirth?: string;
  includeGender?: ApplicationGender;
  includeMajor?: string;
  includeMajorDetail?: string;
  includeEducation?: string;
  includeCategory?: string;
  includeMusic?: string;
  includeAddress?: string;
  includeFile?: boolean;
  includeLink?: string;
  includeDepartment?: string;
  includeCareer?: boolean;
  includeIntroduce?: string;
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

/** GET 응답 등 — postId 는 응답에 없을 수 있음 */
export type ApplicationEntity = Partial<Omit<CreateApplicationDto, "postId">> & {
  id: string;
  postId?: string;
  userId?: string;
  status?: ApplicationReviewStatus;
};
