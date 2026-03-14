import { Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ArtistCard from "../../../components/ArtistCard/ArtistCard";
import MajorTagFilter from "../../../components/MajorTagFilter/MajorTagFilter";
import MajorTagSelectModal from "../../../components/MajorTagSelectModal/MajorTagSelectModal";
import styles from "./artistStyles";
import { RootRoutes } from "../../../navigations/routes";

const MAJOR_OPTIONS = [
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

const ARTIST_LIST = [
  { name: "김연주", category: "현악", activityName: "kimyeonju", musicNoteCount: 47, bookmarkCount: 20 },
  { name: "김연주", category: "현악", activityName: "kimyeonju2", musicNoteCount: 0, bookmarkCount: 0 },
  { name: "김연주", category: "현악", activityName: "kimyeonju", musicNoteCount: 47, bookmarkCount: 20 },
] as const;

const ArtistScene = () => {
  const navigation = useNavigation();
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>("예술템포순");
  const sortOptions = ["예술템포순", "스크랩수순"] as const;

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <View style={styles.filterRow}>
          <MajorTagFilter
            selectedValues={selectedMajors}
            onPress={() => setIsMajorModalVisible(true)}
          />
          {sortOptions.map((option) => (
            <Pressable
              key={option}
              style={[styles.sortTab, sortBy === option && styles.sortTabActive]}
              onPress={() => setSortBy(option)}
            >
              <Text
                style={[
                  styles.sortTabText,
                  sortBy === option && styles.sortTabTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <MajorTagSelectModal
        visible={isMajorModalVisible}
        options={MAJOR_OPTIONS}
        selectedValues={selectedMajors}
        onToggle={(value) => {
          setSelectedMajors((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value]
          );
        }}
        onComplete={() => setIsMajorModalVisible(false)}
      />
      <View style={styles.scrollContentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardWrapper}>
            <ArtistCard
              name="김연주"
              category="현악"
              activityName="kimyeonju"
              musicNoteCount={47}
              bookmarkCount={20}
              onPress={() =>
                navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
                  activityName: "kimyeonju",
                })
              }
            />
          </View>
          <View style={styles.cardWrapper}>
            <ArtistCard
              name="김연주"
              category="현악"
              activityName="kimyeonju2"
              musicNoteCount={0}
              bookmarkCount={0}
              onPress={() =>
                navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
                  activityName: "kimyeonju2",
                })
              }
            />
          </View>
          <View style={styles.cardWrapper}>
            <ArtistCard
              name="김연주"
              category="현악"
              activityName="kimyeonju"
              musicNoteCount={47}
              bookmarkCount={20}
              onPress={() =>
                navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
                  activityName: "kimyeonju",
                })
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ArtistScene;

