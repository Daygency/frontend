import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SelectableTag from "../../../components/ui/SelectableTag";
import { GRAY, MAIN, WHITE } from "../../../color";
import {
  PERFORMANCE_NEWS_GENRE_ALL,
  PERFORMANCE_NEWS_GENRE_OPTIONS,
  PERFORMANCE_NEWS_REGION_ALL,
  PERFORMANCE_NEWS_REGION_OPTIONS,
  PERFORMANCE_NEWS_SORT_OPTIONS,
  type PerformanceNewsFilterSheetType,
  type PerformanceNewsSortMode,
} from "./performanceNewsFilterOptions";

type PerformanceNewsFilterSheetProps = {
  type: PerformanceNewsFilterSheetType;
  sortMode: PerformanceNewsSortMode;
  selectedGenre: string | null;
  selectedRegion: string | null;
  onSelectSort: (mode: PerformanceNewsSortMode) => void;
  onSelectGenre: (genre: string | null) => void;
  onSelectRegion: (region: string | null) => void;
  onClose: () => void;
};

const SHEET_CONFIG = {
  sort: { title: "정렬" },
  genre: { title: "장르" },
  region: { title: "지역" },
} as const;

const PerformanceNewsFilterSheet = ({
  type,
  sortMode,
  selectedGenre,
  selectedRegion,
  onSelectSort,
  onSelectGenre,
  onSelectRegion,
  onClose,
}: PerformanceNewsFilterSheetProps) => {
  const config = SHEET_CONFIG[type];

  const tagOptions =
    type === "sort"
      ? PERFORMANCE_NEWS_SORT_OPTIONS.map((option) => ({
          id: option.id,
          label: option.label,
        }))
      : type === "genre"
        ? [PERFORMANCE_NEWS_GENRE_ALL, ...PERFORMANCE_NEWS_GENRE_OPTIONS].map(
            (option) => ({
              id: option,
              label: option,
            }),
          )
        : [PERFORMANCE_NEWS_REGION_ALL, ...PERFORMANCE_NEWS_REGION_OPTIONS].map(
            (option) => ({
              id: option,
              label: option,
            }),
          );

  const isTagSelected = (id: string) => {
    if (type === "sort") return sortMode === id;
    if (type === "genre") {
      return id === PERFORMANCE_NEWS_GENRE_ALL
        ? selectedGenre == null
        : selectedGenre === id;
    }
    return id === PERFORMANCE_NEWS_REGION_ALL
      ? selectedRegion == null
      : selectedRegion === id;
  };

  const handleTagPress = (id: string) => {
    if (type === "sort") {
      onSelectSort(id as PerformanceNewsSortMode);
      return;
    }
    if (type === "genre") {
      if (id === PERFORMANCE_NEWS_GENRE_ALL) {
        onSelectGenre(null);
        return;
      }
      onSelectGenre(selectedGenre === id ? null : id);
      return;
    }
    if (id === PERFORMANCE_NEWS_REGION_ALL) {
      onSelectRegion(null);
      return;
    }
    onSelectRegion(selectedRegion === id ? null : id);
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{config.title}</Text>
            <Pressable hitSlop={10} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={MAIN.DEFAULT} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.optionsScroll}
            contentContainerStyle={styles.tagContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.tagContainer}>
              {tagOptions.map((option) => (
                <SelectableTag
                  key={option.id}
                  label={option.label}
                  selected={isTagSelected(option.id)}
                  onPress={() => handleTagPress(option.id)}
                />
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 100 },
    }),
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  optionsScroll: {
    flexGrow: 0,
  },
  tagContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default PerformanceNewsFilterSheet;
