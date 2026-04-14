import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import ArtistPortfolioHeader from "./components/ArtistPortfolioHeader/ArtistPortfolioHeader";
import Profile from "../PortfolioScreen/components/Profile/Profile";
import ProfileDetail from "../PortfolioScreen/components/ProfileDetail/ProfileDetail";
import Photo from "../PortfolioScreen/components/Photo/Photo";
import Activity from "../PortfolioScreen/components/Activity/Activity";
import PortfolioInlineTabBar from "../../components/PortfolioInlineTabBar/PortfolioInlineTabBar";
import styles from "../PortfolioScreen/styles";

const ArtistPortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
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

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <ArtistPortfolioHeader
          activityName={activityName}
          targetUserId={targetUserId || undefined}
        />
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

export default ArtistPortfolioScreen;
