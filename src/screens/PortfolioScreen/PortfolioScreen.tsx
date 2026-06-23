import { View } from "react-native";
import PortfolioHeader from "./components/PortfolioHeader/PortfolioHeader";
import PortfolioScrollLayout from "../../components/portfolio/PortfolioScrollLayout/PortfolioScrollLayout";
import portfolioStyles from "../../components/portfolio/styles";

const PortfolioScreen = () => (
  <View style={[portfolioStyles.container, portfolioStyles.containerImmersive]}>
    <PortfolioScrollLayout immersiveCover header={<PortfolioHeader />} />
  </View>
);

export default PortfolioScreen;
