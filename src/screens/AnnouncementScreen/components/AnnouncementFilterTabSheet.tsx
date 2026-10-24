import { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import SelectableTag from "../../../components/ui/SelectableTag";
import { BLUE, GRAY, MAIN, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";
import { ANNOUNCEMENT_FILTER_SHEET_TITLES } from "./announcementFilterOptions";

export type AnnouncementFilterTabType = "status" | "type" | "major" | "price";

const FILTER_TAB_TYPES: AnnouncementFilterTabType[] = [
  "status",
  "type",
  "major",
  "price",
];

const SNAP_POINTS = ["50%"];

type AnnouncementFilterTabSheetProps = {
  initialType: AnnouncementFilterTabType;
  configs: Record<
    AnnouncementFilterTabType,
    { options: string[]; selectedValues: string[]; onToggle: (value: string) => void }
  >;
  onReset: () => void;
  onApply: () => void;
};

const AnnouncementFilterTabSheet = ({
  initialType,
  configs,
  onReset,
  onApply,
}: AnnouncementFilterTabSheetProps) => {
  const [activeTab, setActiveTab] = useState<AnnouncementFilterTabType>(initialType);
  const active = configs[activeTab];
  const totalSelected = FILTER_TAB_TYPES.reduce(
    (sum, type) => sum + configs[type].selectedValues.length,
    0,
  );

  const snapPoints = useMemo(() => SNAP_POINTS, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        style={[props.style, styles.backdropZIndex]}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onClose={onApply}
      backdropComponent={renderBackdrop}
      containerStyle={styles.containerZIndex}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.tabRow}>
        {FILTER_TAB_TYPES.map((type) => {
          const isActive = type === activeTab;
          return (
            <Pressable
              key={type}
              style={styles.tabItem}
              onPress={() => setActiveTab(type)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {ANNOUNCEMENT_FILTER_SHEET_TITLES[type]}
              </Text>
              {isActive && <View style={styles.tabUnderline} />}
            </Pressable>
          );
        })}
      </View>

      <BottomSheetScrollView
        style={styles.optionsScroll}
        contentContainerStyle={styles.tagContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tagContainer}>
          {active.options.map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={active.selectedValues.includes(option)}
              onPress={() => active.onToggle(option)}
            />
          ))}
        </View>
      </BottomSheetScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.resetButton} onPress={onReset} hitSlop={8}>
          <MaterialCommunityIcons name="close" size={20} color={MAIN.DEFAULT} />
        </Pressable>
        <Pressable style={styles.applyButton} onPress={onApply}>
          <Text style={styles.applyButtonText}>{totalSelected}개 적용</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

const styles = themedStyles(() => ({
  backdropZIndex: {
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 100 },
    }),
  },
  containerZIndex: {
    zIndex: 100,
    ...Platform.select({
      android: { elevation: 100 },
    }),
  },
  sheetBackground: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY.DARK_1,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: GRAY.DARK_2,
  },
  tabLabelActive: {
    fontWeight: "700",
    color: MAIN.DEFAULT,
  },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    height: 2,
    width: "60%",
    backgroundColor: MAIN.FILL,
  },
  optionsScroll: {
    flex: 1,
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
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: GRAY.MEDIUM,
  },
  resetButton: {
    ...SMOOTH_CORNERS,
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButton: {
    ...SMOOTH_CORNERS,
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: BLUE.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: FIXED_WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
}));

export default AnnouncementFilterTabSheet;
