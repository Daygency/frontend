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
  ANNOUNCEMENT_FILTER_SHEET_TITLES,
  type AnnouncementFilterSheetType,
} from "./announcementFilterOptions";

type AnnouncementFilterSheetProps = {
  type: AnnouncementFilterSheetType;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClose: () => void;
};

const AnnouncementFilterSheet = ({
  type,
  options,
  selectedValues,
  onToggle,
  onClose,
}: AnnouncementFilterSheetProps) => {
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {ANNOUNCEMENT_FILTER_SHEET_TITLES[type]}
            </Text>
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
              {options.map((option) => (
                <SelectableTag
                  key={option}
                  label={option}
                  selected={selectedValues.includes(option)}
                  onPress={() => onToggle(option)}
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

export default AnnouncementFilterSheet;
