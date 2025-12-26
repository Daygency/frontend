import { View, useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import List from "./components/List/List";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import { useState } from "react";
import styles from "./styles";

const FollowListScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "following", title: "팔로잉" },
    { key: "follower", title: "팔로워" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "following":
        return <List type="following" />;
      case "follower":
        return <List type="follower" />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container]}>
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

export default FollowListScreen;
