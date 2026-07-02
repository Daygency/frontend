import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../color";
import {
  PERFORMANCE_NEWS_SORT_LABEL,
  type PerformanceNewsFilterSheetType,
  type PerformanceNewsSortMode,
} from "./performanceNewsFilterOptions";

type Props = {
  sortMode: PerformanceNewsSortMode;
  selectedGenre: string | null;
  selectedRegion: string | null;
  onFilterSheetOpen: (sheet: PerformanceNewsFilterSheetType) => void;
};

const LoungePerformanceNewsFilterRow = ({
  sortMode,
  selectedGenre,
  selectedRegion,
  onFilterSheetOpen,
}: Props) => {
  const genreLabel = selectedGenre ?? "장르";
  const regionLabel = selectedRegion ?? "지역";

  return (
    <View style={styles.filterRow}>
      <Pressable
        style={styles.filterChip}
        onPress={() => onFilterSheetOpen("sort")}
      >
        <MaterialCommunityIcons
          name="swap-vertical"
          size={16}
          color={MAIN.DEFAULT}
        />
        <Text style={styles.filterChipText}>
          {PERFORMANCE_NEWS_SORT_LABEL[sortMode]}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.filterChip, selectedGenre && styles.filterChipActive]}
        onPress={() => onFilterSheetOpen("genre")}
      >
        <Text
          style={[
            styles.filterChipText,
            selectedGenre && styles.filterChipTextActive,
          ]}
        >
          {genreLabel}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={selectedGenre ? WHITE : MAIN.DEFAULT}
        />
      </Pressable>

      <Pressable
        style={[styles.filterChip, selectedRegion && styles.filterChipActive]}
        onPress={() => onFilterSheetOpen("region")}
      >
        <Text
          style={[
            styles.filterChipText,
            selectedRegion && styles.filterChipTextActive,
          ]}
        >
          {regionLabel}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={selectedRegion ? WHITE : MAIN.DEFAULT}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 9,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    paddingHorizontal: 12,
    height: 36,
    gap: 4,
  },
  filterChipActive: {
    borderColor: MAIN.DEFAULT,
    backgroundColor: MAIN.DEFAULT,
  },
  filterChipText: {
    color: MAIN.DEFAULT,
    fontSize: 13,
    fontWeight: "400",
  },
  filterChipTextActive: {
    color: WHITE,
  },
});

export default LoungePerformanceNewsFilterRow;
