export type ScrapTargetType = "NEWS" | "COMMUNITY" | "ANNOUNCEMENT";

export type ScrapUser = {
  userId?: string;
  [key: string]: unknown;
};

export type ScrapItem = {
  id: string;
  createdAt: string;
  targetType: ScrapTargetType;
  targetId: string;
  user?: ScrapUser;
};

export type GetScrapsParams = {
  targetType: ScrapTargetType;
  targetId: string;
};

export type GetScrapsResponse = {
  count: number;
  items: ScrapItem[];
};

export type CreateScrapDto = {
  targetType: ScrapTargetType;
  targetId: string;
};
