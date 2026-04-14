import { View } from "react-native";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PortfolioHeader from "./components/PortfolioHeader/PortfolioHeader";
import PortfolioScrollTabsLayout from "./components/PortfolioScrollTabsLayout/PortfolioScrollTabsLayout";

const PortfolioScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <PortfolioScrollTabsLayout header={<PortfolioHeader />} />
    </View>
  );
};

export default PortfolioScreen;
