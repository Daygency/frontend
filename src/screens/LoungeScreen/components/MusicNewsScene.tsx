import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";
import EventNewsCard from "../../../components/EventNewsCard/EventNewsCard";
import type { MusicNewsDetailItem } from "../../../MusicNewsDetailScreen/MusicNewsDetailScreen";
import { RootRoutes } from "../../../navigations/routes";

type SortOption = "최신순" | "스크랩순" | "좋아요 순";

const SORT_OPTIONS: SortOption[] = ["최신순", "스크랩순", "좋아요 순"];

type MusicNewsItem = {
  id: string;
  title: string;
  place: string;
  dateRange: string;
  imageUrl?: string;
  createdAt: number;
  likes: number;
  scraps: number;
};

// TODO: API 연동 시 실제 데이터로 대체
const MOCK_NEWS: MusicNewsItem[] = [
  {
    id: "1",
    title: "2025 봄 정기 연주회 (전체 연초 공연)",
    place: "수원실내체육관",
    dateRange: "2025.11.22 ~ 2025.11.23",
    createdAt: 20251122,
    likes: 22,
    scraps: 15,
  },
  {
    id: "2",
    title: "실내악 페스티벌 2025",
    place: "예술의전당 콘서트홀",
    dateRange: "2025.05.01 ~ 2025.05.02",
    createdAt: 20250501,
    likes: 45,
    scraps: 61,
  },
  {
    id: "3",
    title: "영 아티스트 클래식 콘서트",
    place: "세종문화회관 체임버홀",
    dateRange: "2025.06.10 ~ 2025.06.10",
    createdAt: 20250610,
    likes: 77,
    scraps: 12,
  },
  {
    id: "4",
    title: "피아노 리사이틀 시리즈",
    place: "롯데콘서트홀",
    dateRange: "2025.07.03 ~ 2025.07.03",
    createdAt: 20250703,
    likes: 10,
    scraps: 34,
  },
];

const toDetailItem = (item: MusicNewsItem): MusicNewsDetailItem => {
  const [startDate] = item.dateRange.split(" ~ ");
  return {
    id: item.id,
    title: item.title,
    place: item.place,
    date: startDate,
    time: "19:00",
    contact: "02-0000-0000",
    uploadedAt: String(item.createdAt).replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3"),
    description:
      "봄 정기 연주회, 따뜻한 선율로 여러분을 초대합니다! 봄의 빛처럼 피어나는 음악을 무대에서 만나보세요",
    imageUrl: item.imageUrl,
    likes: item.likes,
    comments: 0,
    attachments: [
      { name: "모집공고_상세안내.pdf", size: "2.4 MB" },
      { name: "오디션_곡목.pdf", size: "1.1 MB" },
    ],
  };
};

const MusicNewsScene = () => {
  const navigation = useNavigation<any>();
  const [sortBy, setSortBy] = useState<SortOption>("최신순");
  const [loading, setLoading] = useState(false);

  const sortedNews = useMemo(() => {
    const list = [...MOCK_NEWS];
    switch (sortBy) {
      case "최신순":
        return list.sort((a, b) => b.createdAt - a.createdAt);
      case "스크랩순":
        return list.sort((a, b) => b.scraps - a.scraps);
      case "좋아요 순":
        return list.sort((a, b) => b.likes - a.likes);
      default:
        return list;
    }
  }, [sortBy]);

  // 정렬 옵션 변경 시 로딩 스피너를 잠깐 보여줌
  // 추후 실제 API 연동 시 이 부분에 fetch 로직을 넣고
  // 응답 받은 후 setLoading(false)를 호출하면 됨.
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [sortBy]);

  const renderItem = ({ item }: { item: MusicNewsItem }) => {
    return (
      <EventNewsCard
        title={item.title}
        place={item.place}
        dateRange={item.dateRange}
        imageUrl={item.imageUrl}
        containerStyle={localStyles.card}
        onPress={() =>
          navigation.navigate(RootRoutes.MUSIC_NEWS_DETAIL, {
            news: toDetailItem(item),
          })
        }
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
      {loading ? (
        <View style={localStyles.loaderContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <FlatList
          data={sortedNews}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={localStyles.columnWrapper}
          contentContainerStyle={localStyles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        />
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
});

export default MusicNewsScene;

