import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import { WHITE } from "../color";
import AgencyCard from "../components/AgencyCard/AgencyCard";
import FilterDropdown from "../components/FilterDropdown/FilterDropdown";

const AgencyScreen = () => {
  const [sortBy, setSortBy] = useState<string>("추천수순");

  const sortOptions = ["추천수순", "협업자순", "활동자순", "스크랩수순"];
  // Sample data with images
  const agencyWithImages = {
    title: "MY아트기획",
    likes: 24,
    rating: 4.8,
    calendarCount: 15,
    bookmarkCount: 54,
    tags: ["클래식", "기획공연", "신인연주회"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    ],
  };

  // Sample data without images
  const agencyWithoutImages = {
    title: "MY아트기획",
    likes: 24,
    rating: 4.8,
    calendarCount: 15,
    bookmarkCount: 54,
    tags: ["클래식", "기획공연", "신인연주회"],
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
        scrollEventThrottle={16}
        bounces={false}
      >
        <FilterDropdown
          label="정렬"
          options={sortOptions}
          selectedValue={sortBy}
          onSelect={setSortBy}
        />
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <AgencyCard
            title={agencyWithImages.title}
            likes={agencyWithImages.likes}
            rating={agencyWithImages.rating}
            calendarCount={agencyWithImages.calendarCount}
            bookmarkCount={agencyWithImages.bookmarkCount}
            tags={agencyWithImages.tags}
            images={agencyWithImages.images}
          />
        </View>
        <View style={styles.cardWrapper}>
          <AgencyCard
            title={agencyWithoutImages.title}
            likes={agencyWithoutImages.likes}
            rating={agencyWithoutImages.rating}
            calendarCount={agencyWithoutImages.calendarCount}
            bookmarkCount={agencyWithoutImages.bookmarkCount}
            tags={agencyWithoutImages.tags}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: WHITE,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
  cardWrapper: {
    marginBottom: 5,
  },
});

export default AgencyScreen;

