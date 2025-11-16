import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { WHITE, GRAY, MAIN } from "../color";
import VenueCard from "../components/VenueCard/VenueCard";
import RentalNewsCard from "../components/RentalNewsCard/RentalNewsCard";

type TabType = "info" | "news";

const VenueScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("info");

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
      {/* Sub Tab Navigation */}
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: GRAY.DEFAULT,
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  tabActive: {
    backgroundColor: GRAY.DEFAULT,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: GRAY.DARK,
  },
  tabTextActive: {
    fontWeight: "600",
    color: MAIN.DEFAULT,
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

export default VenueScreen;

