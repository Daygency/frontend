import { StyleProp, Text, View, ViewStyle } from "react-native";
import { RED, WHITE, FIXED_WHITE } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

type NewBadgeProps = {
  style?: StyleProp<ViewStyle>;
};

const NewBadge = ({ style }: NewBadgeProps) => (
  <View style={[styles.badge, style]}>
    <Text style={styles.text}>N</Text>
  </View>
);

const styles = themedStyles(() => ({
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 100,
    backgroundColor: RED.DEFAULT,
    flexShrink: 0,
  },
  text: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "700",
    color: FIXED_WHITE,
  },
}));

export default NewBadge;
