import { View, ScrollView } from "react-native";
import styles from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import PortfolioHeader from "./components/PortfolioHeader/PortfolioHeader";
import Profile from "./components/Profile/Profile";
import ProfileDetail from "./components/ProfileDetail/ProfileDetail";
import Photo from "./components/Photo/Photo";
import Activity from "./components/Activity/Activity";
import PortfolioInlineTabBar from "../../components/PortfolioInlineTabBar/PortfolioInlineTabBar";
import { getProfileCache } from "../../lib/profileCache";

const PortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "프로필" },
    { key: "photo", title: "사진" },
    { key: "activity", title: "활동" },
  ]);
  const [activityName, setActivityName] = useState<string | null>(null);

  useEffect(() => {
    getProfileCache().then((p) => {
      setActivityName(p?.activityName ?? null);
    });
  }, []);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <PortfolioHeader />
        <Profile />
        <PortfolioInlineTabBar
          routes={routes}
          index={index}
          onIndexChange={setIndex}
        />
        {index === 0 ? <ProfileDetail embedded /> : null}
        {index === 1 ? <Photo embedded /> : null}
        {index === 2 ? <Activity embedded /> : null}
      </ScrollView>
    </View>
  );
};

export default PortfolioScreen;
