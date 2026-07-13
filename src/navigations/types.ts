import { ContentRoutes, RootRoutes } from "./routes";

export type ContentTabParamList = {
  [ContentRoutes.HOME]: undefined;
  [ContentRoutes.ACTIVITY]:
    | {
        initialFeedView?: "전체" | "내가 올린 공고" | "지원한 공고";
      }
    | undefined;
  [ContentRoutes.PAYMENT]: undefined;
  [ContentRoutes.CHAT]: { initialTab?: "공연소식" | "커뮤니티" | "음악계 소식" } | undefined;
  [ContentRoutes.LOUNGE]: undefined;
};

export type RootStackParamList = {
  [RootRoutes.CONTENT_TAB]: undefined;
  [RootRoutes.SEARCH]: { initialTag?: string } | undefined;
  [RootRoutes.NOTIFICATIONS]: undefined;
  [RootRoutes.SETTINGS]: undefined;
};
