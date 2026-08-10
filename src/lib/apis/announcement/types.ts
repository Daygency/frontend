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
  includeFile: boolean;
  includeLink: boolean;
  includeCareer: boolean;
  includeIntroduce: boolean;
};

export type CreateAnnouncementDto = {
  title: string;
  content: string;
  deadlineAt?: string | null; // ISO 8601, null = 상시 모집
  scheduledAt?: string | null; // ISO 8601, null = 미정
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
  /** 공연·일정 종료 여부 */
  completed?: boolean;
  createdAt?: string;
  user?: {
    activityName?: string | null;
    profileImgUrl?: string | null;
    name?: string | null;
  } | null;
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
  /** 제목·본문·주소 키워드 검색 */
  q?: string;
  /** created: 등록순, imminent: 임박순 */
  sort?: "created" | "imminent";
  /** 완료(활동종료) 여부 필터 — `/announcement/my`, `/announcement/applied` 전용 */
  completed?: boolean;
  /** 지원 심사 상태 필터 — `/announcement/applied` 전용 */
  applicationStatus?: "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
};

export type AnnouncementAttachmentItem = {
  fileId: string;
  imgUrl: string;
  sortOrder: number;
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
