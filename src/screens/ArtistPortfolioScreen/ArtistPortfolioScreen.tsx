import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import ArtistPortfolioHeader from "./components/ArtistPortfolioHeader/ArtistPortfolioHeader";
import PortfolioScrollTabsLayout from "../PortfolioScreen/components/PortfolioScrollTabsLayout/PortfolioScrollTabsLayout";
import styles from "../PortfolioScreen/styles";

const ArtistPortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  const route = useRoute<{
    params?: { activityName?: string; userId?: string };
  }>();
  const activityName = route.params?.activityName ?? "";
  const targetUserId = route.params?.userId?.trim() ?? "";

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <PortfolioScrollTabsLayout
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
