import { View } from "react-native";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PortfolioHeader from "./components/PortfolioHeader/PortfolioHeader";
import Profile from "./components/Profile/Profile";
import { TabView } from "react-native-tab-view";

const PortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <PortfolioHeader />
      <Profile />
      {/* 탭바 컴포넌트 (프로필 | 사진 | 활동 통계) */}
    
    </View>
  );
};

export default PortfolioScreen;
