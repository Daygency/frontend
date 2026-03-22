/**
 * README § 모집 지원서 API — Body·응답 필드는 Swagger `applications` 태그와 동일.
 * 공고 상세 `GET /announcement/:id` 의 `applicationConfig` 와 동일한 include* 키를 보냅니다.
 * `POST /applications` 성공 시 서버가 공고 전용 채팅방·첫 메시지를 처리하므로, 프론트는 채팅 목록 새로고침을 맞추면 됩니다.
 */

export type ApplicationGender = "FEMALE" | "MALE" | "NONE";

export type CreateApplicationDto = {
  postId: string;
  includeName?: string;
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
};

export type UpdateApplicationDto = Partial<
  Omit<CreateApplicationDto, "postId">
>;

/** GET 응답 등 — postId 는 응답에 없을 수 있음 */
export type ApplicationEntity = Partial<CreateApplicationDto> & {
  id: string;
  postId?: string;
  userId?: string;
};
