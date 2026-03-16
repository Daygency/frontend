import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import styles from "./styles";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import FabButton from "../../components/FabButton/FabButton";
import { TabView } from "react-native-tab-view";
import CategoryTabBar from "../../components/CategoryTabBar/CategoryTabBar";
import MusicNewsScene from "./components/MusicNewsScene";
import CommunityScene from "./components/CommunityScene";
import { RootRoutes } from "../../navigations/routes";

type LoungeRouteParams = {
  initialTab?: "음악계 소식" | "커뮤니티";
};

const LoungeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ Lounge: LoungeRouteParams }, "Lounge">>();
  const { top } = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: "음악계 소식", title: "음악계 소식" },
    { key: "커뮤니티", title: "커뮤니티" },
  ]);

  const initialIndex = useMemo(() => {
    const desired = route.params?.initialTab;
    if (!desired) return 0;
    const idx = routes.findIndex((r) => r.key === desired);
    return idx >= 0 ? idx : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.initialTab]);

  const [index, setIndex] = useState(initialIndex);

  const tabToSearchTag: Record<string, string> = {
    "음악계 소식": "공연소식",
    "커뮤니티": "커뮤니티",
  };
  const initialTag = tabToSearchTag[routes[index].key] ?? "커뮤니티";

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "음악계 소식":
        return <MusicNewsScene />;
      case "커뮤니티":
        return <CommunityScene />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <MainHomeTopBar logoName="라운지" initialTag="커뮤니티" />
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
      <FabButton
        onPress={() =>
          navigation.navigate(
            index === 0 ? RootRoutes.MUSIC_NEWS_REGISTRATION : RootRoutes.COMMUNITY_REGISTRATION
          )
        }
      />
    </View>
  );
};

export default LoungeScreen;
