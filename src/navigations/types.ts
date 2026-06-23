import { ContentRoutes, RootRoutes } from "./routes";

export type ContentTabParamList = {
  [ContentRoutes.HOME]: undefined;
  [ContentRoutes.ACTIVITY]: undefined;
  [ContentRoutes.PAYMENT]: undefined;
  [ContentRoutes.CHAT]: { initialTab?: "공연 소식" | "커뮤니티" | "음악계 소식" } | undefined;
  [ContentRoutes.LOUNGE]: undefined;
};

export type RootStackParamList = {
  [RootRoutes.CONTENT_TAB]: undefined;
  [RootRoutes.SEARCH]: { initialTag?: string } | undefined;
  [RootRoutes.NOTIFICATIONS]: undefined;
  [RootRoutes.SETTINGS]: undefined;
};
