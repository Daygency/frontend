import { View } from "react-native";
import styles from "./styles";

import PortfolioHeader from "./components/PortfolioHeader/PortfolioHeader";
import PortfolioScrollTabsLayout from "./components/PortfolioScrollTabsLayout/PortfolioScrollTabsLayout";

const PortfolioScreen = () => {
  return (
    <View style={[styles.container, styles.containerImmersive]}>
      <PortfolioScrollTabsLayout
        immersiveCover
        header={<PortfolioHeader />}
      />
    </View>
  );
};

export default PortfolioScreen;
