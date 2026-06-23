import { CommonActions } from "@react-navigation/native";
import { ContentRoutes, RootRoutes } from "../../navigations/routes";

type NavigationLike = {
  dispatch: (action: ReturnType<typeof CommonActions.reset>) => void;
};

/** 로그아웃·둘러보기 전환 시 메인 홈 탭으로 스택 초기화 */
export function resetNavigationToBrowseHome(navigation: NavigationLike) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: RootRoutes.CONTENT_TAB,
          state: {
            routes: [{ name: ContentRoutes.HOME }],
            index: 0,
          },
        },
      ],
    }),
  );
}
