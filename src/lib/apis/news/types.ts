/** 공연소식 목록 조회 파라미터 */
export type NewsListParams = {
  cursor?: string;
  limit?: number;
};

/** 공연소식 목록 항목 (GET /news) — README: `thumbnailUrl` 우선 */
export type NewsListItem = {
  newsId: string;
  title: string;
  place: string;
  startedAt: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  /** README 목록 썸네일 (order 최소 1장) */
  thumbnailUrl?: string | null;
  /** 레거시·호환 */
  imageUrl?: string | null;
  /** 목록에 내려올 수 있는 첨부/대표 file (썸네일 폴백) */
  attachments?: unknown;
  file?: Record<string, unknown> | null;
};

/** 공연소식 목록 응답 */
export type NewsListResponse = {
  items: NewsListItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

/** 공연소식 상세 - file, user 객체 */
export type NewsFileInfo = {
  fileId?: string;
  url?: string;
  imgUrl?: string;
  [key: string]: unknown;
};

/** README 응답 `attachments` */
export type NewsAttachmentItem = {
  fileId: string;
  imgUrl: string;
  sortOrder: number;
};

export type NewsUserInfo = {
  userId?: string;
  nickname?: string;
  [key: string]: unknown;
};

/** 공연소식 상세 응답 (GET /news/:id) */
export type NewsDetailResponse = {
  newsId: string;
  title: string;
  content: string;
  place: string;
  ticketPrice: number | null;
  startedAt: string;
  endedAt: string | null;
  contact: string;
  createdAt: string;
  user?: NewsUserInfo;
  file?: NewsFileInfo | null;
  /** README: 업로드 이미지 배열 */
  attachments?: NewsAttachmentItem[];
  isMine?: boolean;
};

/** 공연소식 작성 API Request (POST /news) */
export type CreateNewsDto = {
  title: string;
  content: string;
  place: string;
  ticketPrice?: number | null;
  startedAt: string;
  endedAt?: string | null;
  contact: string;
  fileId?: string | null;
};

/** 공연소식 작성 응답 */
export type CreateNewsResponse = {
  newsId: string;
  title: string;
  place: string;
  startedAt: string;
};
