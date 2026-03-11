import { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import CategoryTabBar from "../../../components/CategoryTabBar/CategoryTabBar";
import PostsCommentsScene from "./components/PostsCommentsScene";
import ScrapScene from "./components/ScrapScene";
import MyReviewsScene from "./components/MyReviewsScene";
import styles from "./styles";

const MyActivityScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "postsComments", title: "작성글/댓글" },
    { key: "scrap", title: "스크랩" },
    { key: "myReviews", title: "내가 쓴 후기" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "postsComments":
        return <PostsCommentsScene />;
      case "scrap":
        return <ScrapScene />;
      case "myReviews":
        return <MyReviewsScene />;
      default:
        return null;
    }
  };

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
