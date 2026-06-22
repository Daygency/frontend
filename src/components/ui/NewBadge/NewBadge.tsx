import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RED, WHITE } from "../../../color";

type NewBadgeProps = {
  style?: StyleProp<ViewStyle>;
};

const NewBadge = ({ style }: NewBadgeProps) => (
  <View style={[styles.badge, style]}>
    <Text style={styles.text}>N</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: RED.DEFAULT,
    flexShrink: 0,
  },
  text: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "700",
    color: WHITE,
  },
});

export default NewBadge;
