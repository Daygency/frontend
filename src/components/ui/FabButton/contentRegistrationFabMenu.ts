import { useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import { RootRoutes } from "../../../navigations/routes";
import type { FabMenuItem } from "./FabButton";

export const CONTENT_REGISTRATION_FAB_MENU_LABELS = {
  announcement: "모집공고",
  musicNews: "공연 소식",
  community: "커뮤니티",
} as const;

export function useContentRegistrationFabMenu(): FabMenuItem[] {
  const navigation = useNavigation<any>();
  const { ensureLoggedIn } = useRequireLogin();

  const go = useCallback(
    (route: string) => {
      if (!ensureLoggedIn()) return;
      navigation.navigate(route);
    },
    [ensureLoggedIn, navigation],
  );

  return useMemo(
    () => [
      {
        label: CONTENT_REGISTRATION_FAB_MENU_LABELS.announcement,
        onPress: () => go(RootRoutes.ANNOUNCEMENT_REGISTRATION),
      },
      {
        label: CONTENT_REGISTRATION_FAB_MENU_LABELS.musicNews,
        onPress: () => go(RootRoutes.MUSIC_NEWS_REGISTRATION),
      },
      {
        label: CONTENT_REGISTRATION_FAB_MENU_LABELS.community,
        onPress: () => go(RootRoutes.COMMUNITY_REGISTRATION),
      },
    ],
    [go],
  );
}
