/** README.md 모집공고 API 스펙 기준 */

export type AnnouncementPriceType = "EXPENSE" | "INCOME" | "FREE" | "PENDING";

export type AnnouncementStatus = "OPEN" | "CLOSED";

export type ApplicationConfig = {
  includeName: boolean;
  includeBirth: boolean;
  includeGender: boolean;
  includeMajor: boolean;
  includeMajorDetail: boolean;
  includeEducation: boolean;
  includeCategory: boolean;
  includeMusic: boolean;
  includeAddress: boolean;
  includeFile: boolean;
  includeLink: boolean;
  includeDepartment: boolean;
  includeCareer: boolean;
  includeIntroduce: boolean;
};

export type CreateAnnouncementDto = {
  title: string;
  content: string;
  deadlineAt: string; // ISO 8601
  scheduledAt: string; // ISO 8601
  address: string;
  fileId?: string; // UUID (선택)
  categoryId: string; // UUID
  majorIds?: string[];
  status?: AnnouncementStatus;
  applicationConfig: ApplicationConfig;
  /** 생략 시 서버에서 PENDING(협의) */
  priceType?: AnnouncementPriceType;
  /** 생략 시 0 */
  price?: number;
};

export type UpdateAnnouncementDto = Partial<CreateAnnouncementDto> & {
  /** 수동 완료 표시 — PATCH 전용 (README: completed_manually) */
  completed?: boolean;
};

export type AnnouncementListItem = {
  postId: string;
  title: string;
  type: string;
  isRecruiting: boolean;
  dDay: string;
  /** 목록 썸네일 (백엔드가 내려줄 때) */
  thumbnailUrl?: string | null;
  priceType?: AnnouncementPriceType;
  price?: number;
  /** 모집 전공 UUID 목록 */
  majorIds?: string[];
  /** 목록 API가 전공 객체까지 줄 때 */
  majors?: { majorId: string; name: string }[];
  /** 누적 조회수(목록·내 공고 목록 등 DB 저장값) */
  viewCount?: number;
  /** 공연·모집 장소 (목록 API가 내려줄 때) */
  address?: string;
  /** 마감일 ISO 8601 — 목록 API가 `deadlineAt`으로 반환 (D-day 표시 보정·카드에 사용) */
  deadlineAt?: string;
};

export type AnnouncementListResponse = {
  items: AnnouncementListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type AnnouncementListParams = {
  cursor?: string;
  limit?: number; // 1~50, 기본 20
  status?: AnnouncementStatus;
  categoryId?: string;
  majorIds?: string; // 콤마 구분: uuid1,uuid2
  /** 금액 구분 단일 값 — ListAnnouncementQueryDto */
  priceType?: AnnouncementPriceType;
};

/** README: 작성·수정 성공 응답 — majors·priceType·price 포함 */
export type CreateAnnouncementResponse = {
  postId: string;
  title: string;
  type: string;
  isRecruiting: boolean;
  dDay: string;
  priceType?: AnnouncementPriceType;
  price?: number;
  majors?: { majorId: string; name: string }[];
  /** multipart 작성 시 업로드 파일 메타 */
  attachments?: {
    fileId: string;
    imgUrl: string;
    sortOrder: number;
  }[];
};
