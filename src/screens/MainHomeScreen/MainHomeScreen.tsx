import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader, {
  type MainHomeTab,
} from "../../components/MainHomeHeader/MainHomeHeader";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import AllContentScene from "../../components/AllContentScene/AllContentScene";
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

const MainHomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<MainHomeTab>("홈");
  const [curationTheme, setCurationTheme] = useState<CurationThemeState | null>(
    null,
  );
  const activeTabRef = useRef<MainHomeTab>("홈");
  activeTabRef.current = activeTab;

  const isCuration = activeTab === "큐레이션";
  const isCurationLoading = isCuration && (curationTheme?.loading ?? true);

  const animatedBackgroundStyle = useCurationBackgroundTransition(
    isCuration,
    curationTheme,
  );

  const handleTabChange = useCallback((tab: MainHomeTab) => {
    setActiveTab(tab);
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
        onTabChange={handleTabChange}
        variant={isCuration ? "dark" : "light"}
      />
      <View style={styles.content}>
        {isCurationLoading ? (
          <View style={styles.curationLoading}>
            <ActivityIndicator size="small" color={WHITE} />
          </View>
        ) : null}
        <AllContentScene
          tab={activeTab}
          onCurationThemeChange={handleCurationThemeChange}
          hideWhileCurationLoading={isCurationLoading}
        />
      </View>
      {isCuration ? <CurationBottomGradient /> : null}
    </Animated.View>
  );
};

export default MainHomeScreen;
