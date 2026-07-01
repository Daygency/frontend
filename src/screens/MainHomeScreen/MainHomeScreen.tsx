import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader, {
  MAIN_HOME_TABS,
  type MainHomeTab,
} from "../../components/layout/MainHomeHeader";
import MainHomeTopBar from "../../components/layout/MainHomeTopBar";
import AllContentScene, {
  type AllContentSceneHandle,
} from "../../components/layout/AllContentScene";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
import {
  type CurationThemeState,
} from "./curationTheme";
import { useCurationBackgroundTransition } from "./useCurationBackgroundTransition";
import { useCurationContentFade } from "./useCurationContentFade";
import CurationBottomGradient from "./CurationBottomGradient";
import ContentRegistrationFabButton from "../../components/ui/FabButton/ContentRegistrationFabButton";
import styles from "./styles";
import { ContentRoutes } from "../../navigations/routes";
import {
  createSubTabRetapHandler,
  registerTabRetapHandler,
  TAB_RESCROLL_THRESHOLD,
} from "../../lib/navigation/tabRetap";

const MAIN_LOGO = require("../../../assets/daygency_logo_main.png");
const WHITE_LOGO = require("../../../assets/daygency_logo_white.png");
const WHITE_LOGO_ASPECT_RATIO = 660 / 595;

const DEFAULT_TAB_BAR_STYLE = {
  paddingTop: 8,
  paddingBottom: 10,
  height: 90,
  backgroundColor: WHITE,
  borderTopWidth: 1,
  borderTopColor: GRAY.MEDIUM,
} as const;

const CURATION_TAB_BAR_STYLE = {
  paddingTop: 8,
  paddingBottom: 10,
  height: 90,
  backgroundColor: BLACK,
  borderTopWidth: 0,
} as const;

function tabToIndex(tab: MainHomeTab): number {
  const idx = MAIN_HOME_TABS.indexOf(tab);
  return idx >= 0 ? idx : 0;
}

const MainHomeScreen = () => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [curationTheme, setCurationTheme] = useState<CurationThemeState | null>(
    null,
  );
  const activeTabRef = useRef<MainHomeTab>("홈");
  const homeSceneRef = useRef<AllContentSceneHandle>(null);
  const curationSceneRef = useRef<AllContentSceneHandle>(null);

  const activeTab = useMemo(
    () => MAIN_HOME_TABS[index] ?? "홈",
    [index],
  );
  activeTabRef.current = activeTab;

  const isCuration = activeTab === "매거진";

  const animatedBackgroundStyle = useCurationBackgroundTransition(
    isCuration,
    curationTheme,
  );
  const { homeContentStyle, curationContentStyle } =
    useCurationContentFade(isCuration);

  const handleIndexChange = useCallback((newIndex: number) => {
    setIndex(newIndex);
    const tab = MAIN_HOME_TABS[newIndex];
    if (tab !== "매거진") {
      setCurationTheme(null);
    }
  }, []);

  const handleCurationThemeChange = useCallback((theme: CurationThemeState | null) => {
    if (activeTabRef.current !== "매거진") return;
    setCurationTheme(theme);
  }, []);

  const toggleSubTabRef = useRef(() => {});
  toggleSubTabRef.current = () => {
    handleIndexChange(index === 0 ? 1 : 0);
  };

  useEffect(() => {
    return registerTabRetapHandler(
      ContentRoutes.HOME,
      createSubTabRetapHandler({
        isScrolledDown: () => {
          const sceneRef =
            activeTabRef.current === "매거진"
              ? curationSceneRef
              : homeSceneRef;
          return (sceneRef.current?.getScrollOffset() ?? 0) > TAB_RESCROLL_THRESHOLD;
        },
        scrollToTop: () => {
          const sceneRef =
            activeTabRef.current === "매거진"
              ? curationSceneRef
              : homeSceneRef;
          sceneRef.current?.scrollToTop();
        },
        toggleSubTab: () => {
          toggleSubTabRef.current();
        },
      }),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const applyTabBarStyle = (curation: boolean) => {
        navigation.setOptions({
          tabBarStyle: curation ? CURATION_TAB_BAR_STYLE : DEFAULT_TAB_BAR_STYLE,
          tabBarActiveTintColor: curation ? WHITE : MAIN.DEFAULT,
          tabBarInactiveTintColor: curation
            ? "rgba(255,255,255,0.45)"
            : GRAY.MEDIUM_100,
        });
      };

      applyTabBarStyle(isCuration);
    }, [isCuration, navigation]),
  );

  return (
    <Animated.View
      style={[styles.container, { paddingTop: top }, animatedBackgroundStyle]}
    >
      {isCuration ? <StatusBar style="light" /> : null}
      <MainHomeTopBar
        logoImage={isCuration ? WHITE_LOGO : MAIN_LOGO}
        logoAspectRatio={isCuration ? WHITE_LOGO_ASPECT_RATIO : 1396 / 179}
        variant={isCuration ? "dark" : "light"}
        initialTag={null}
      />
      <MainHomeHeader
        activeTab={activeTab}
        onTabChange={(tab) => handleIndexChange(tabToIndex(tab as MainHomeTab))}
        variant={isCuration ? "dark" : "light"}
      />
      <View style={styles.sceneStack}>
        <Animated.View
          style={[styles.sceneLayer, homeContentStyle]}
          pointerEvents={isCuration ? "none" : "auto"}
        >
          <View style={styles.content}>
            <AllContentScene ref={homeSceneRef} tab="홈" />
          </View>
        </Animated.View>
        <Animated.View
          style={[styles.sceneLayer, curationContentStyle]}
          pointerEvents={isCuration ? "auto" : "none"}
        >
          <View style={styles.content}>
            <AllContentScene
              ref={curationSceneRef}
              tab="매거진"
              onCurationThemeChange={handleCurationThemeChange}
            />
          </View>
        </Animated.View>
      </View>
      {isCuration ? <CurationBottomGradient /> : null}
      {!isCuration ? (
        <ContentRegistrationFabButton containerStyle={styles.fab} />
      ) : null}
    </Animated.View>
  );
};

export default MainHomeScreen;
