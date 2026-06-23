import { View } from "react-native";
import { useRoute } from "@react-navigation/native";
import ArtistPortfolioHeader from "./components/ArtistPortfolioHeader/ArtistPortfolioHeader";
import PortfolioScrollTabsLayout from "../PortfolioScreen/components/PortfolioScrollTabsLayout/PortfolioScrollTabsLayout";
import styles from "../PortfolioScreen/styles";

const ArtistPortfolioScreen = () => {
  const route = useRoute<{
    params?: { activityName?: string; userId?: string };
  }>();
  const activityName = route.params?.activityName ?? "";
  const targetUserId = route.params?.userId?.trim() ?? "";

  return (
    <View style={[styles.container, styles.containerImmersive]}>
      <PortfolioScrollTabsLayout
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
