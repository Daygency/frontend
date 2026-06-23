import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import MainHomeHeader, {
  MAIN_HOME_TABS,
  type MainHomeTab,
} from "../../components/layout/MainHomeHeader";
import MainHomeTopBar from "../../components/layout/MainHomeTopBar";
import AllContentScene from "../../components/layout/AllContentScene";
import { WHITE } from "../../color";
import {
  CURATION_LOADING_BACKGROUND,
  type CurationThemeState,
} from "./curationTheme";
import { useCurationBackgroundTransition } from "./useCurationBackgroundTransition";
import CurationBottomGradient from "./CurationBottomGradient";
import styles from "./styles";

const MAIN_LOGO = require("../../../assets/daygency_logo_main.png");
const WHITE_LOGO = require("../../../assets/daygency_logo_white.png");
const WHITE_LOGO_ASPECT_RATIO = 660 / 595;

const HOME_ROUTES = MAIN_HOME_TABS.map((key) => ({ key, title: key }));

function tabToIndex(tab: MainHomeTab): number {
  const idx = MAIN_HOME_TABS.indexOf(tab);
  return idx >= 0 ? idx : 0;
}

const MainHomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [curationTheme, setCurationTheme] = useState<CurationThemeState | null>(
    null,
  );
  const activeTabRef = useRef<MainHomeTab>("홈");

  const activeTab = useMemo(
    () => MAIN_HOME_TABS[index] ?? "홈",
    [index],
  );
  activeTabRef.current = activeTab;

  const isCuration = activeTab === "큐레이션";
  const isCurationLoading = isCuration && (curationTheme?.loading ?? true);

  const animatedBackgroundStyle = useCurationBackgroundTransition(
    isCuration,
    curationTheme,
  );

  const handleIndexChange = useCallback((newIndex: number) => {
    setIndex(newIndex);
    const tab = MAIN_HOME_TABS[newIndex];
    if (tab === "큐레이션") {
      setCurationTheme({
        loading: true,
        backgroundColor: CURATION_LOADING_BACKGROUND,
      });
    } else {
      setCurationTheme(null);
    }
  }, []);

  const handleCurationThemeChange = useCallback((theme: CurationThemeState | null) => {
    if (activeTabRef.current !== "큐레이션") return;
    setCurationTheme(theme);
  }, []);

  const renderScene = ({ route }: { route: { key: string } }) => {
    if (route.key === "큐레이션") {
      return (
        <View style={styles.content}>
          {isCurationLoading ? (
            <View style={styles.curationLoading}>
              <ActivityIndicator size="small" color={WHITE} />
            </View>
          ) : null}
          <AllContentScene
            tab="큐레이션"
            onCurationThemeChange={handleCurationThemeChange}
            hideWhileCurationLoading={isCurationLoading}
          />
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <AllContentScene tab="홈" />
      </View>
    );
  };

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
      <TabView
        navigationState={{ index, routes: HOME_ROUTES }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => (
          <MainHomeHeader
            activeTab={activeTab}
            onTabChange={(tab) => handleIndexChange(tabToIndex(tab as MainHomeTab))}
            variant={isCuration ? "dark" : "light"}
          />
        )}
        style={styles.tabView}
      />
      {isCuration ? <CurationBottomGradient /> : null}
    </Animated.View>
  );
};

export default MainHomeScreen;
