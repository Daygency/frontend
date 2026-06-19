/** README: Report API — `POST /reports` */

export type ReportCategory =
  | "HATE_OR_SLUR"
  | "SPAM"
  | "HARMFUL_TO_YOUTH"
  | "ILLEGAL"
  | "OBSCENE"
  | "OFFENSIVE";

export type ReportTargetType =
  | "COMMUNITY"
  | "NEWS"
  | "COMMENT"
  | "ANNOUNCEMENT"
  | "CHAT";

export type CreateReportBody = {
  reportedUserId: string;
  category: ReportCategory;
  targetType: ReportTargetType;
  targetId: string;
};

export type CreateReportResponse = {
  ok: true;
  reportedUserId: string;
  totalReportsAgainstUser: number;
};

/** GET /reports/categories */
export type ReportCategoryItemDto = {
  value: ReportCategory;
  labelKo: string;
};

export type ReportCategoriesResponse = {
  categories: ReportCategoryItemDto[];
};
