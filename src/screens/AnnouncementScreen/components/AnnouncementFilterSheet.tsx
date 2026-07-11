import { useCallback, useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import SelectableTag from "../../../components/ui/SelectableTag";
import { GRAY, MAIN, WHITE } from "../../../color";
import {
  ANNOUNCEMENT_FILTER_SHEET_TITLES,
  type AnnouncementFilterSheetType,
} from "./announcementFilterOptions";

const SNAP_POINTS = ["50%"];

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
      onClose={onClose}
      backdropComponent={renderBackdrop}
      containerStyle={styles.containerZIndex}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <Text style={styles.title}>
        {ANNOUNCEMENT_FILTER_SHEET_TITLES[type]}
      </Text>

      <BottomSheetScrollView
        style={styles.optionsScroll}
        contentContainerStyle={styles.tagContent}
        showsVerticalScrollIndicator={false}
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
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
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
