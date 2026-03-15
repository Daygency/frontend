/** 공연소식 작성 API Request (POST /news) */
export type CreateNewsDto = {
  title: string;
  content: string;
  place: string;
  ticketPrice?: number | null;
  startedAt: string;
  endedAt?: string | null;
  contact: string;
  fileId: string;
};

/** 공연소식 작성 응답 */
export type CreateNewsResponse = {
  newsId: string;
  title: string;
  place: string;
  startedAt: string;
};
