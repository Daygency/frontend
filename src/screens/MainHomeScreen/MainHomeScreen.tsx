import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader, {
  type MainHomeTab,
} from "../../components/MainHomeHeader/MainHomeHeader";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import AllContentScene from "../../components/AllContentScene/AllContentScene";
import styles from "./styles";

const MainHomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<MainHomeTab>("홈");

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar
        logoImage={require("../../../assets/daygency_logo_main.png")}
        initialTag={null}
      />
      <MainHomeHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.content}>
        <AllContentScene tab={activeTab} />
      </View>
    </View>
  );
};

export default MainHomeScreen;
