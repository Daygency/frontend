import { Text, View } from "react-native";
import styles from "./styles";
import MainHomeHeader from "../../components/MainHomeHeader/MainHomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";

const PortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { marginTop: top }]}>
      {/* {/* <MainHomeTopBar />
      <MainHomeHeader /> */}
      <Text>Portfolio</Text>
    </View>
  );
};

export default PortfolioScreen;

