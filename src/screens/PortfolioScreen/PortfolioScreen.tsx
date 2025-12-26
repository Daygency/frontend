import { View, useWindowDimensions } from "react-native";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { TabView } from "react-native-tab-view";

import PortfolioHeader from "./components/PortfolioHeader/PortfolioHeader";
import Profile from "./components/Profile/Profile";
import ProfileDetail from "./components/ProfileDetail/ProfileDetail";
import Photo from "./components/Photo/Photo";
import Activity from "./components/Activity/Activity";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";

const PortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "프로필" },
    { key: "photo", title: "사진" },
    { key: "activity", title: "활동" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
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
      <PortfolioHeader />
      <Profile />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => <CategoryTabBar {...props} evenlyDistributed />}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
    </View>
  );
};

export default PortfolioScreen;
