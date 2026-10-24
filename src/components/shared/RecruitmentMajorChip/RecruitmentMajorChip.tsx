import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { BLACK, GRAY, WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

type RecruitmentMajorChipProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};

const RecruitmentMajorChip = ({ label, style }: RecruitmentMajorChipProps) => {
  const text = label.trim();
  if (!text) return null;

  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
};

const styles = themedStyles(() => ({
  chip: {
    backgroundColor: WHITE,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  chipText: {
    fontSize: 11,
    lineHeight: 15,
    color: BLACK,
    fontWeight: "500",
  },
}));

export default RecruitmentMajorChip;
