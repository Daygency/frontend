import { ScrollView, View } from "react-native";
import { useState } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import styles from "./styles";

const ArtistScreen = () => {
  const [major, setMajor] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>("추천수순");

  const majorOptions = [
    "건반악기",
    "현악",
    "관악",
    "성악",
    "타악",
    "작곡",
    "지휘",
    "음악학",
    "국악",
    "무용",
    "실용",
    "뮤지컬·크로스오버",
    "기타",
  ];
  const sortOptions = ["추천수순", "협업지수순", "활동횟수순", "스크랩수순"];

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
          label="전공"
          options={majorOptions}
          selectedValue={major}
          onSelect={setMajor}
        />
        <FilterDropdown
          label="정렬"
          options={sortOptions}
          selectedValue={sortBy}
          onSelect={setSortBy}
        />
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          <ArtistCard name="김연주" category="현악" bookmarkCount={20} />
        </View>
        <View style={styles.cardWrapper}>
          <ArtistCard name="김연주" category="현악" bookmarkCount={20} />
        </View>
        <View style={styles.cardWrapper}>
          <ArtistCard name="김연주" category="현악" bookmarkCount={20} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ArtistScreen;

