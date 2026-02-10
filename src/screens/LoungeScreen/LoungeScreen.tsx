import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import styles from "./styles";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import { TabView } from "react-native-tab-view";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import MusicNewsScene from "./components/MusicNewsScene";

const LoungeScreen = () => {
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "음악계 소식", title: "음악계 소식" },
    { key: "커뮤니티", title: "커뮤니티" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "음악계 소식":
        return <MusicNewsScene />;
      case "커뮤니티":
        return <Text>커뮤니티</Text>;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar logoName="라운지" />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <CategoryTabBar {...props} evenlyDistributed />
        )}
        style={styles.tabView}
      />
    </View>
  );
};

export default LoungeScreen;
