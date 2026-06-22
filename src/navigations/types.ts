import { ContentRoutes, RootRoutes } from "./routes";

export type ContentTabParamList = {
  [ContentRoutes.HOME]: undefined;
  [ContentRoutes.ACTIVITY]: undefined;
  [ContentRoutes.PAYMENT]: undefined;
  [ContentRoutes.CHAT]: undefined;
  [ContentRoutes.LOUNGE]: undefined;
};

export type RootStackParamList = {
  [RootRoutes.CONTENT_TAB]: undefined;
  [RootRoutes.SEARCH]: { initialTag?: string } | undefined;
  [RootRoutes.NOTIFICATIONS]: undefined;
  [RootRoutes.SETTINGS]: undefined;
};
