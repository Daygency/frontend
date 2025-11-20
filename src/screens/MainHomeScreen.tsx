import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { TabView } from "react-native-tab-view";
import MainHomeHeader from "../components/MainHomeHeader/MainHomeHeader";
import MainHomeTopBar from "../components/MainHomeTopBar/MainHomeTopBar";
import CategoryTabBar from "../components/CategoryTabBar/CategoryTabBar";
import AllContentScene from "../components/AllContentScene/AllContentScene";
import { WHITE } from "../color";
import { CategoryList } from "../constants/categories";
import AnnouncementScreen from "./AnnouncementScreen";
import ArtistScreen from "./ArtistScreen";
import VenueScreen from "./VenueScreen";
import AgencyScreen from "./AgencyScreen";
import AcademyScreen from "./AcademyScreen";

const MainHomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    CategoryList.map((category) => ({ key: category, title: category }))
  );

  const handleRouteChange = (key: string) => {
    const targetIndex = routes.findIndex((route) => route.key === key);
    if (targetIndex !== -1) {
      setIndex(targetIndex);
    }
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "전체":
        return (
          <AllContentScene
            onPressAnnouncementMore={() => handleRouteChange("모집공고")}
          />
        );
      case "모집공고":
        return <AnnouncementScreen />;
      case "예술가":
        return <ArtistScreen />;
      case "공연장":
        return <VenueScreen />;
      case "기획사":
        return <AgencyScreen />;
      case "학원":
        return <AcademyScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top + 20 }]}>
      <MainHomeTopBar />
      <MainHomeHeader />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => <CategoryTabBar {...props} />}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabView: {
    flex: 1,
  },
});

export default MainHomeScreen;
