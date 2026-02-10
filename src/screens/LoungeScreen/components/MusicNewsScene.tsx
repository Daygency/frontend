import { useState } from "react";
import { ScrollView, View } from "react-native";
import styles from "../styles";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";

type SortOption = "최신순" | "스크랩순" | "좋아요 순";

const SORT_OPTIONS: SortOption[] = ["최신순", "스크랩순", "좋아요 순"];

const MusicNewsScene = () => {
  const [sortBy, setSortBy] = useState<SortOption>("최신순");

  return (
    <View style={styles.newsSceneContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortFilterContainer}
        nestedScrollEnabled
        directionalLockEnabled
        scrollEventThrottle={16}
        bounces={false}
      >
        {SORT_OPTIONS.map((option) => (
          <SelectableTag
            key={option}
            label={option}
            selected={sortBy === option}
            onPress={() => setSortBy(option)}
          />
        ))}
      </ScrollView>
      {/* TODO: 정렬 기준에 따라 리스트를 정렬할 영역 */}
    </View>
  );
};

export default MusicNewsScene;

