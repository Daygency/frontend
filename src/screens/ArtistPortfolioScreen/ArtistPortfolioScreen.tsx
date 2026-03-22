import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { TabView } from "react-native-tab-view";
import { useRoute } from "@react-navigation/native";
import ArtistPortfolioHeader from "./components/ArtistPortfolioHeader/ArtistPortfolioHeader";
import Profile from "../PortfolioScreen/components/Profile/Profile";
import ProfileDetail from "../PortfolioScreen/components/ProfileDetail/ProfileDetail";
import Photo from "../PortfolioScreen/components/Photo/Photo";
import Activity from "../PortfolioScreen/components/Activity/Activity";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import styles from "../PortfolioScreen/styles";

const ArtistPortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const route = useRoute<{
    params?: { activityName?: string; userId?: string };
  }>();
  const activityName = route.params?.activityName ?? "";
  const targetUserId = route.params?.userId?.trim() ?? "";

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "프로필" },
    { key: "photo", title: "사진" },
    { key: "activity", title: "활동" },
  ]);

  const renderScene = ({ route: sceneRoute }: { route: { key: string } }) => {
    switch (sceneRoute.key) {
      case "profile":
        return <ProfileDetail />;
      case "photo":
        return <Photo />;
      case "activity":
        return <Activity />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ArtistPortfolioHeader
        activityName={activityName}
        targetUserId={targetUserId || undefined}
      />
      <Profile />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <CategoryTabBar {...props} evenlyDistributed />
        )}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
    </View>
  );
};

export default ArtistPortfolioScreen;
