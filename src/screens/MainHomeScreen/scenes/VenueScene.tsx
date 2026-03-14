import { Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import VenueCard from "../../../components/VenueCard/VenueCard";
import RentalNewsCard from "../../../components/RentalNewsCard/RentalNewsCard";
import FilterDropdown from "../../../components/FilterDropdown/FilterDropdown";
import styles from "./venueStyles";

type TabType = "info" | "news";

interface VenueSceneProps {
  initialTab?: TabType;
}

const VenueScene = ({ initialTab = "info" }: VenueSceneProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>(initialTab);
  const [sortBy, setSortBy] = useState<string>("추천수순");
  const sortOptions = ["스크랩수순", "가나다순"];

  const renderContent = () => {
    if (selectedTab === "info") {
      return (
        <>
          <View style={styles.cardWrapper}>
            <VenueCard
              title="거암 아트홀"
              address="서울 강남구 신사동"
              bookmarkCount={54}
              tags={[
                "주차가능",
                "강남역 도보1분",
                "스타인웨이 보유",
                "조명감독 상주",
              ]}
            />
          </View>
          <View style={styles.cardWrapper}>
            <VenueCard
              title="거암 아트홀"
              address="서울 강남구 신사동"
              bookmarkCount={54}
              tags={[
                "주차가능",
                "강남역 도보1분",
                "스타인웨이 보유",
                "조명감독 상주",
                "주차가능",
              ]}
            />
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.cardWrapper}>
            <RentalNewsCard
              title="2026년 예술의 전당 수시대관 공고"
              venueName="예술의 전당"
              date="2025.11.20"
            />
          </View>
          <View style={styles.cardWrapper}>
            <RentalNewsCard
              title="2026년 예술의 전당 수시대관 공고"
              venueName="예술의 전당"
              date="2025.11.20"
            />
          </View>
          <View style={styles.cardWrapper}>
            <RentalNewsCard
              title="2026년 예술의 전당 수시대관 공고"
              venueName="예술의 전당"
              date="2025.11.20"
            />
          </View>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, selectedTab === "info" && styles.tabActive]}
          onPress={() => setSelectedTab("info")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "info" && styles.tabTextActive,
            ]}
          >
            공연장 정보
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === "news" && styles.tabActive]}
          onPress={() => setSelectedTab("news")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "news" && styles.tabTextActive,
            ]}
          >
            대관 소식
          </Text>
        </Pressable>
      </View>
      <View>
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
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default VenueScene;

