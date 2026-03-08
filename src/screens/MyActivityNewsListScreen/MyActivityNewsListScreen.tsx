import { FlatList, Text, View, useWindowDimensions } from "react-native";
import EventNewsCard from "../../components/EventNewsCard/EventNewsCard";
import styles from "./styles";

const IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s";

const MOCK_NEWS = [
  { id: "1", title: "교향악단 바이올린 객원단원 채용 공연", place: "예술의전당", dateRange: "2025.11.20 ~ 2025.12.15", imageUrl: IMAGE_URL },
  { id: "2", title: "봄 정기연주회", place: "세종문화회관", dateRange: "2025.03.10 ~ 2025.03.12", imageUrl: IMAGE_URL },
  { id: "3", title: "청소년 콩쿠르 본선", place: "토끼마을 콘서트홀", dateRange: "2000.05.16 ~ 2003.07.15", imageUrl: IMAGE_URL },
  { id: "4", title: "첼로 독주회", place: "롯데콘서트홀", dateRange: "2025.04.01 ~ 2025.04.03", imageUrl: IMAGE_URL },
  { id: "5", title: "오케스트라 정기공연", place: "예술의전당", dateRange: "2025.05.20 ~ 2025.05.22", imageUrl: IMAGE_URL },
  { id: "6", title: "앙상블 페스티벌", place: "세종문화회관", dateRange: "2025.06.15 ~ 2025.06.17", imageUrl: IMAGE_URL },
  { id: "7", title: "여름 음악축제", place: "잠실 체조경기장", dateRange: "2025.07.25 ~ 2025.07.27", imageUrl: IMAGE_URL },
  { id: "8", title: "오페라 갈라 콘서트", place: "국립오페라극장", dateRange: "2025.08.10 ~ 2025.08.12", imageUrl: IMAGE_URL },
  { id: "9", title: "가을 실내악 축제", place: "예술의전당", dateRange: "2025.09.20 ~ 2025.09.22", imageUrl: IMAGE_URL },
  { id: "10", title: "겨울 송년 연주회", place: "롯데콘서트홀", dateRange: "2025.12.28 ~ 2025.12.29", imageUrl: IMAGE_URL },
];

const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;

const MyActivityNewsListScreen = () => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_NEWS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EventNewsCard
              title={item.title}
              place={item.place}
              dateRange={item.dateRange}
              imageUrl={item.imageUrl}
              width={cardWidth}
              height={138}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>공연 소식이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

export default MyActivityNewsListScreen;
