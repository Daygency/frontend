import { useEffect } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ArtistPortfolioHeader from "./components/ArtistPortfolioHeader/ArtistPortfolioHeader";
import PortfolioScrollLayout from "../../components/portfolio/PortfolioScrollLayout/PortfolioScrollLayout";
import portfolioStyles from "../../components/portfolio/styles";
import { useAuth } from "../../contexts/AuthContext";
import { ContentRoutes, RootRoutes } from "../../navigations/routes";

const ArtistPortfolioScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { user } = useAuth();
  const activityName = (route.params as { activityName?: string } | undefined)?.activityName ?? "";
  const targetUserId = (route.params as { userId?: string } | undefined)?.userId?.trim() ?? "";
  const myUserId = user?.socialId?.trim() ?? "";

  useEffect(() => {
    if (!targetUserId || !myUserId || targetUserId !== myUserId) return;
    navigation.replace(RootRoutes.CONTENT_TAB, {
      screen: ContentRoutes.LOUNGE,
    });
  }, [targetUserId, myUserId, navigation]);

  if (targetUserId && myUserId && targetUserId === myUserId) {
    return null;
  }

  return (
    <View style={[portfolioStyles.container, portfolioStyles.containerImmersive]}>
      <PortfolioScrollLayout
        immersiveCover
        portfolioUserId={targetUserId || undefined}
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
