import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE, FIXED_WHITE, BLACK } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { type PerformanceNewsFilterSheetType } from "./performanceNewsFilterOptions";

type Props = {
  selectedGenre: string | null;
  selectedRegion: string | null;
  onFilterSheetOpen: (sheet: PerformanceNewsFilterSheetType) => void;
};

const LoungePerformanceNewsFilterRow = ({
  selectedGenre,
  selectedRegion,
  onFilterSheetOpen,
}: Props) => {
  const genreLabel = selectedGenre ?? "장르";
  const regionLabel = selectedRegion ?? "지역";

  return (
    <View style={styles.filterRow}>
      <Pressable
        style={({ pressed }) => [styles.filterChip, pressed && styles.filterChipPressed]}
        onPress={() => onFilterSheetOpen("sort")}
      >
        <MaterialIcons name="sort" size={24} color={BLACK} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.filterChip,
          selectedGenre && styles.filterChipActive,
          pressed && styles.filterChipPressed,
        ]}
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
          color={selectedGenre ? FIXED_WHITE : MAIN.DEFAULT}
        />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.filterChip,
          selectedRegion && styles.filterChipActive,
          pressed && styles.filterChipPressed,
        ]}
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
          color={selectedRegion ? FIXED_WHITE : MAIN.DEFAULT}
        />
      </Pressable>
    </View>
  );
};

const styles = themedStyles(() => ({
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
    backgroundColor: MAIN.FILL,
  },
  filterChipPressed: {
    opacity: 0.5,
  },
  filterChipText: {
    color: MAIN.DEFAULT,
    fontSize: 13,
    fontWeight: "400",
  },
  filterChipTextActive: {
    color: FIXED_WHITE,
  },
}));

export default LoungePerformanceNewsFilterRow;
