import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  const listOptions =
    type === "sort"
      ? PERFORMANCE_NEWS_SORT_OPTIONS.map((option) => ({
          id: option.id,
          label: option.label,
        }))
      : [
          {
            id: PERFORMANCE_NEWS_REGION_ALL,
            label: PERFORMANCE_NEWS_REGION_ALL,
          },
          ...PERFORMANCE_NEWS_REGION_OPTIONS.map((option) => ({
            id: option,
            label: option,
          })),
        ];

  const listSelected = type === "sort" ? sortMode : selectedRegion;

  const handleListSelect = (id: string) => {
    if (type === "sort") {
      onSelectSort(id as PerformanceNewsSortMode);
      return;
    }
    if (id === PERFORMANCE_NEWS_REGION_ALL) {
      onSelectRegion(null);
      return;
    }
    onSelectRegion(selectedRegion === id ? null : id);
  };

  const isListOptionSelected = (optionId: string) => {
    if (type === "sort") return listSelected === optionId;
    if (optionId === PERFORMANCE_NEWS_REGION_ALL) return selectedRegion == null;
    return selectedRegion === optionId;
  };

  const handleGenreSelect = (genre: string) => {
    if (genre === PERFORMANCE_NEWS_GENRE_ALL) {
      onSelectGenre(null);
      return;
    }
    onSelectGenre(selectedGenre === genre ? null : genre);
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

          {type === "genre" ? (
            <ScrollView
              style={styles.optionsScroll}
              contentContainerStyle={styles.tagContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.tagContainer}>
                {[PERFORMANCE_NEWS_GENRE_ALL, ...PERFORMANCE_NEWS_GENRE_OPTIONS].map(
                  (genre) => {
                    const isAll = genre === PERFORMANCE_NEWS_GENRE_ALL;
                    const isSelected = isAll
                      ? selectedGenre == null
                      : selectedGenre === genre;
                    return (
                      <Pressable
                        key={genre}
                        style={[styles.tag, isSelected && styles.tagSelected]}
                        onPress={() => handleGenreSelect(genre)}
                      >
                        <Text
                          style={[styles.tagText, isSelected && styles.tagTextSelected]}
                        >
                          {genre}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.optionsScroll}
              contentContainerStyle={styles.optionsContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {listOptions.map((option, index) => {
                const isSelected = isListOptionSelected(option.id);
                const isLast = index === listOptions.length - 1;
                return (
                  <Pressable
                    key={option.id}
                    style={[styles.optionRow, isLast && styles.optionRowLast]}
                    onPress={() => handleListSelect(option.id)}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                    {isSelected ? (
                      <MaterialCommunityIcons name="check" size={22} color={MAIN.DEFAULT} />
                    ) : (
                      <View style={styles.checkPlaceholder} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
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
  optionsContent: {
    paddingBottom: 20,
  },
  tagContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tag: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  tagSelected: {
    backgroundColor: MAIN.DEFAULT,
    borderColor: MAIN.DEFAULT,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "400",
    color: MAIN.DEFAULT,
  },
  tagTextSelected: {
    color: WHITE,
    fontWeight: "500",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: MAIN.DEFAULT,
  },
  checkPlaceholder: {
    width: 22,
  },
});

export default PerformanceNewsFilterSheet;
