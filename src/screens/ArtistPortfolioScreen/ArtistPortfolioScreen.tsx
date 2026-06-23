import { View } from "react-native";
import { useRoute } from "@react-navigation/native";
import ArtistPortfolioHeader from "./components/ArtistPortfolioHeader/ArtistPortfolioHeader";
import PortfolioScrollLayout from "../../components/portfolio/PortfolioScrollLayout/PortfolioScrollLayout";
import portfolioStyles from "../../components/portfolio/styles";

const ArtistPortfolioScreen = () => {
  const route = useRoute();
  const activityName = (route.params as { activityName?: string } | undefined)?.activityName ?? "";
  const targetUserId = (route.params as { userId?: string } | undefined)?.userId?.trim() ?? "";

  return (
    <View style={[portfolioStyles.container, portfolioStyles.containerImmersive]}>
      <PortfolioScrollLayout
        immersiveCover
        header={
          <ArtistPortfolioHeader
            activityName={activityName}
            targetUserId={targetUserId || undefined}
          />
        }
      />
    </View>
  );
};

export default ArtistPortfolioScreen;
