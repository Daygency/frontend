import { useState } from "react";
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
import { BLUE, GRAY, MAIN, WHITE } from "../../../color";
import { SMOOTH_CORNERS } from "../../../cornerSmoothing";
import { ANNOUNCEMENT_FILTER_SHEET_TITLES } from "./announcementFilterOptions";

export type AnnouncementFilterTabType = "status" | "type" | "major" | "price";

const FILTER_TAB_TYPES: AnnouncementFilterTabType[] = [
  "status",
  "type",
  "major",
  "price",
];

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

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onApply}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

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

          <ScrollView
            style={styles.optionsScroll}
            contentContainerStyle={styles.tagContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
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
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={onReset} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={20} color={MAIN.DEFAULT} />
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>{totalSelected}개 적용</Text>
            </Pressable>
          </View>
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
    height: "50%",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAY.DARK_1,
    marginTop: 10,
    marginBottom: 8,
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
    backgroundColor: MAIN.DEFAULT,
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
    color: WHITE,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AnnouncementFilterTabSheet;
