import { Pressable, StyleSheet, Text, View } from "react-native";
import SquircleView from "react-native-fast-squircle";
import { BLACK, GRAY, WHITE } from "../../../color";

const PILL_HEIGHT = 36;

type ShortcutPillProps = {
  label: string;
  onPress: () => void;
};

const ShortcutPill = ({ label, onPress }: ShortcutPillProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <SquircleView
        cornerSmoothing={0.6}
        style={[styles.pill, pressed && styles.pillPressed]}
      >
        <Text style={styles.label}>{label}</Text>
      </SquircleView>
    )}
  </Pressable>
);

type HomeShortcutSectionProps = {
  onPressApplied: () => void;
  onPressPosted: () => void;
};

const HomeShortcutSection = ({
  onPressApplied,
  onPressPosted,
}: HomeShortcutSectionProps) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <ShortcutPill label="지원한 공고" onPress={onPressApplied} />
      <ShortcutPill label="내가 만든 공고" onPress={onPressPosted} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: PILL_HEIGHT,
    paddingHorizontal: 12,
    borderRadius: PILL_HEIGHT / 2,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    backgroundColor: WHITE,
  },
  pillPressed: {
    opacity: 0.5,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    color: BLACK,
    includeFontPadding: false,
  },
});

export default HomeShortcutSection;
