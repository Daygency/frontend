import { ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import { WHITE } from "../color";
import AcademyCard from "../components/AcademyCard/AcademyCard";
import FilterDropdown from "../components/FilterDropdown/FilterDropdown";

const AcademyScreen = () => {
  const [sortBy, setSortBy] = useState<string>("스크랩수순");

  const sortOptions = ["스크랩수순", "추천수순", "가나다순"];
  // Sample data with images
  const academyWithImages = {
    title: "반포음악학원",
    likes: 24,
    bookmarkCount: 54,
    operatingHours: "10:00 ~ 20:00",
    tags: ["클래식", "기획공연", "신인연주회"],
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    ],
  };

  // Sample data without images
  const academyWithoutImages = {
    title: "반포음악학원",
    likes: 24,
    bookmarkCount: 54,
    operatingHours: "10:00 ~ 20:00",
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
          <AcademyCard
            title={academyWithImages.title}
            likes={academyWithImages.likes}
            bookmarkCount={academyWithImages.bookmarkCount}
            operatingHours={academyWithImages.operatingHours}
            tags={academyWithImages.tags}
            images={academyWithImages.images}
          />
        </View>
        <View style={styles.cardWrapper}>
          <AcademyCard
            title={academyWithoutImages.title}
            likes={academyWithoutImages.likes}
            bookmarkCount={academyWithoutImages.bookmarkCount}
            operatingHours={academyWithoutImages.operatingHours}
            tags={academyWithoutImages.tags}
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

export default AcademyScreen;

