import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
          <View style={styles.handle} />

          <Text style={styles.title}>
            {ANNOUNCEMENT_FILTER_SHEET_TITLES[type]}
          </Text>

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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: MAIN.DEFAULT,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
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
});

export default AnnouncementFilterSheet;
