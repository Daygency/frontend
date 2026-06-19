import { View, Text, useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import List from "./components/List/List";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import { useCallback, useState } from "react";
import { useFocusEffect, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import type { FollowListParams } from "./types";
import styles from "./styles";

const FollowListScreen = () => {
  const layout = useWindowDimensions();
  const route = useRoute<RouteProp<{ FollowList: FollowListParams }, "FollowList">>();
  const params = route.params;
  const { user } = useAuth();

  const targetUserId =
    params?.userId?.trim() || user?.socialId?.trim() || "";

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "following", title: "팔로잉" },
    { key: "follower", title: "팔로워" },
  ]);

  useFocusEffect(
    useCallback(() => {
      const tab = params?.initialTab;
      if (tab === "followers") setIndex(1);
      else setIndex(0);
    }, [params?.initialTab]),
  );

  const renderScene = ({ route: scene }: { route: { key: string } }) => {
    if (!targetUserId) {
      return (
        <View style={[styles.container, styles.centerMessage]}>
          <Text style={styles.messageText}>
            로그인 후 내 팔로우 목록을 볼 수 있습니다.
          </Text>
        </View>
      );
    }
    switch (scene.key) {
      case "following":
        return <List type="following" userId={targetUserId} />;
      case "follower":
        return <List type="follower" userId={targetUserId} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container]}>
      <TabView
        lazy
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
