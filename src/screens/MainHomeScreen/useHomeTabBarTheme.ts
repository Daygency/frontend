import { useCallback, useLayoutEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { ContentTabParamList } from "../../navigations/types";
import {
  CURATION_LOADING_BACKGROUND,
  DEFAULT_HOME_TAB_BAR_STYLE,
  type CurationThemeState,
} from "./curationTheme";

export const useHomeTabBarTheme = (
  isCuration: boolean,
  curationTheme: CurationThemeState | null,
) => {
  const navigation = useNavigation<BottomTabNavigationProp<ContentTabParamList>>();

  const applyDefaultTabBar = useCallback(() => {
    navigation.setOptions({
      tabBarStyle: DEFAULT_HOME_TAB_BAR_STYLE,
      tabBarActiveTintColor: "black",
      tabBarInactiveTintColor: "gray",
    });
  }, [navigation]);

  const applyCurationTabBar = useCallback(
    (backgroundColor: string) => {
      navigation.setOptions({
        tabBarStyle: {
          ...DEFAULT_HOME_TAB_BAR_STYLE,
          backgroundColor,
          borderTopColor: backgroundColor,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.45)",
      });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    if (!isCuration) {
      applyDefaultTabBar();
      return;
    }

    applyCurationTabBar(
      curationTheme?.backgroundColor ?? CURATION_LOADING_BACKGROUND,
    );
  }, [applyCurationTabBar, applyDefaultTabBar, curationTheme?.backgroundColor, isCuration]);

  useFocusEffect(
    useCallback(() => {
      if (isCuration) {
        applyCurationTabBar(
          curationTheme?.backgroundColor ?? CURATION_LOADING_BACKGROUND,
        );
      } else {
        applyDefaultTabBar();
      }

      return applyDefaultTabBar;
    }, [
      applyCurationTabBar,
      applyDefaultTabBar,
      curationTheme?.backgroundColor,
      isCuration,
    ]),
  );
};
