import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeHeader from "../../components/MainHomeHeader/MainHomeHeader";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import AllContentScene from "../../components/AllContentScene/AllContentScene";
import styles from "./styles";

const MainHomeScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar logoName="DAYGENCY" initialTag={null} />
      <MainHomeHeader />
      <View style={styles.content}>
        <AllContentScene />
      </View>
    </View>
  );
};

export default MainHomeScreen;
