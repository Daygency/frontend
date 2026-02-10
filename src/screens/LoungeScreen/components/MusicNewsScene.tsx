import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import styles from "../styles";

type SortOption = "최신순" | "스크랩순" | "좋아요 순";

const SORT_OPTIONS: SortOption[] = ["최신순", "스크랩순", "좋아요 순"];

const MusicNewsScene = () => {
  const [sortBy, setSortBy] = useState<SortOption>("최신순");

  return (
    <View style={styles.newsSceneContainer}>
      <View style={styles.sortFilterContainer}>
        {SORT_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.sortButton,
              sortBy === option && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy(option)}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === option && styles.sortButtonTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      {/* TODO: 정렬 기준에 따라 리스트를 정렬할 영역 */}
    </View>
  );
};

export default MusicNewsScene;

