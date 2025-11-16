import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { TabView, SceneMap } from "react-native-tab-view";
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
 
  const renderScene = SceneMap({
    전체: AllContentScene,
    모집공고: AnnouncementScreen,
    예술가: ArtistScreen,
    공연장: VenueScreen,
    기획사: AgencyScreen,
    학원: AcademyScreen,
  });

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
