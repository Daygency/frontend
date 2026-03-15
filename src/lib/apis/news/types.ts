/** 공연소식 목록 조회 파라미터 */
export type NewsListParams = {
  cursor?: string;
  limit?: number;
};

/** 공연소식 목록 항목 (GET /news) */
export type NewsListItem = {
  newsId: string;
  title: string;
  place: string;
  startedAt: string;
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
  [key: string]: unknown;
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
  file?: NewsFileInfo;
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
