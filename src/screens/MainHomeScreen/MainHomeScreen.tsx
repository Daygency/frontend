import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { TabView } from "react-native-tab-view";
import MainHomeHeader from "../../components/MainHomeHeader/MainHomeHeader";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import AllContentScene from "../../components/AllContentScene/AllContentScene";
import { CategoryList } from "../../constants/categories";
import styles from "./styles";
import ArtistScene from "./scenes/ArtistScene";
import VenueScene from "./scenes/VenueScene";
import AgencyScene from "./scenes/AgencyScene";
import { useNavigation } from "@react-navigation/native";

const MainHomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    CategoryList.map((category) => ({ key: category, title: category }))
  );
  const navigation = useNavigation();

  const handleRouteChange = (key: string) => {
    const targetIndex = routes.findIndex((route) => route.key === key);
    if (targetIndex !== -1) {
      setIndex(targetIndex);
    }
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "전체":
        return <AllContentScene />;
      case "예술가":
        return <ArtistScene />;
      case "공연장":
        return <VenueScene />;
      case "기획사":
        return <AgencyScene />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar logoName="DAYGENCY" />
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

export default MainHomeScreen;
