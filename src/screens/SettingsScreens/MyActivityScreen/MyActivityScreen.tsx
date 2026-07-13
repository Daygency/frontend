import { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import CategoryTabBar from "../../../components/layout/CategoryTabBar";
import EmptyState from "../../../components/ui/EmptyState";
import { useAuth } from "../../../contexts/AuthContext";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import PostsCommentsScene from "./components/PostsCommentsScene";
import ScrapScene from "./components/ScrapScene";
import LikesScene from "./components/LikesScene";
import MyReviewsScene from "./components/MyReviewsScene";
import styles from "./styles";

const MyActivityScreen = () => {
  const { isLoggedIn } = useAuth();
  const { requireLogin } = useRequireLogin();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "postsComments", title: "작성글/댓글" },
    { key: "scrap", title: "스크랩" },
    { key: "likes", title: "내 좋아요" },
    { key: "myReviews", title: "내가 쓴 후기" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "postsComments":
        return <PostsCommentsScene />;
      case "scrap":
        return <ScrapScene />;
      case "likes":
        return <LikesScene />;
      case "myReviews":
        return <MyReviewsScene />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.centerFill}>
        <EmptyState message="로그인이 필요합니다" />
        <Pressable style={styles.loginBtn} onPress={requireLogin}>
          <Text style={styles.loginBtnText}>로그인하기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

export default MyActivityScreen;
