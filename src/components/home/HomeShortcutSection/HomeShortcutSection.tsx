import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BLACK, BLUE, GRAY, WHITE } from "../../../color";

const LETTER_ICON = require("../../../../assets/letter.png");
const PENCIL_ICON = require("../../../../assets/pencil.png");

const PILL_HEIGHT = 44;
const PILL_PADDING = 4;
const ICON_SIZE = PILL_HEIGHT - PILL_PADDING * 2;

type ShortcutPillProps = {
  icon: number;
  label: string;
  onPress: () => void;
};

const ShortcutPill = ({ icon, label, onPress }: ShortcutPillProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
  >
    <View style={styles.iconCircle}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
    </View>
    <Text style={styles.label}>{label}</Text>
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
      <ShortcutPill
        icon={LETTER_ICON}
        label="지원한 공고"
        onPress={onPressApplied}
      />
      <ShortcutPill
        icon={PENCIL_ICON}
        label="내가 만든 공고"
        onPress={onPressPosted}
      />
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
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: PILL_HEIGHT,
    paddingLeft: PILL_PADDING,
    paddingRight: 14,
    gap: 8,
    borderRadius: PILL_HEIGHT / 2,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
    backgroundColor: WHITE,
  },
  pillPressed: {
    opacity: 0.88,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderCurve: "continuous",
    borderColor: BLUE.DEFAULT,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    width: ICON_SIZE * 0.62,
    height: ICON_SIZE * 0.62,
  },
  label: {
    fontSize: 15,
    lineHeight: ICON_SIZE,
    fontWeight: "700",
    color: BLACK,
    includeFontPadding: false,
  },
});

export default HomeShortcutSection;
