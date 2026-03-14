import { Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import ArtistCard from "../../../components/ArtistCard/ArtistCard";
import MajorTagFilter from "../../../components/MajorTagFilter/MajorTagFilter";
import MajorTagSelectModal from "../../../components/MajorTagSelectModal/MajorTagSelectModal";
import styles from "./artistStyles";

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

const ArtistScene = () => {
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
              musicNoteCount={47}
              bookmarkCount={20}
            />
          </View>
          <View style={styles.cardWrapper}>
            <ArtistCard
              name="김연주"
              category="현악"
              musicNoteCount={0}
              bookmarkCount={0}
            />
          </View>
          <View style={styles.cardWrapper}>
            <ArtistCard
              name="김연주"
              category="현악"
              musicNoteCount={47}
              bookmarkCount={20}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ArtistScene;

