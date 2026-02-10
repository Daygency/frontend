import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import styles from "../styles";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";
import EventNewsCard from "../../../components/EventNewsCard/EventNewsCard";

type SortOption = "최신순" | "스크랩순" | "좋아요 순";

const SORT_OPTIONS: SortOption[] = ["최신순", "스크랩순", "좋아요 순"];

type MusicNewsItem = {
  id: string;
  title: string;
  place: string;
  dateRange: string;
  imageUrl?: string;
};

// TODO: API 연동 시 실제 데이터로 대체
const MOCK_NEWS: MusicNewsItem[] = [
  {
    id: "1",
    title: "2025 봄 정기 연주회 (전체 연초 공연)",
    place: "수원실내체육관",
    dateRange: "2025.11.22 ~ 2025.11.23",
  },
  {
    id: "2",
    title: "실내악 페스티벌 2025",
    place: "예술의전당 콘서트홀",
    dateRange: "2025.05.01 ~ 2025.05.02",
  },
  {
    id: "3",
    title: "영 아티스트 클래식 콘서트",
    place: "세종문화회관 체임버홀",
    dateRange: "2025.06.10 ~ 2025.06.10",
  },
  {
    id: "4",
    title: "피아노 리사이틀 시리즈",
    place: "롯데콘서트홀",
    dateRange: "2025.07.03 ~ 2025.07.03",
  },
];

const MusicNewsScene = () => {
  const [sortBy, setSortBy] = useState<SortOption>("최신순");

  const renderItem = ({ item }: { item: MusicNewsItem }) => {
    return (
      <EventNewsCard
        title={item.title}
        place={item.place}
        dateRange={item.dateRange}
        imageUrl={item.imageUrl}
        containerStyle={localStyles.card}
      />
    );
  };

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
      <FlatList
        data={MOCK_NEWS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={localStyles.columnWrapper}
        contentContainerStyle={localStyles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: "48%",
  },
});

export default MusicNewsScene;

