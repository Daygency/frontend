/** api-readme.md 모집공고 API 스펙 기준 */

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
  /** 생략 시 서버에서 FREE */
  priceType?: AnnouncementPriceType;
  /** 생략 시 0 */
  price?: number;
};

export type UpdateAnnouncementDto = Partial<CreateAnnouncementDto>;

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
  /** 콤마 구분: FREE,EXPENSE,INCOME,PENDING */
  priceTypes?: string;
};

export type CreateAnnouncementResponse = {
  postId: string;
  title: string;
  type: string;
  isRecruiting: boolean;
  dDay: string;
};
