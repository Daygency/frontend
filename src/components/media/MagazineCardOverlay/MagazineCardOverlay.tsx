import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WHITE } from "../../../color";

const WHITE_LOGO = require("../../../../assets/daygency_logo_white.png");
const LOGO_ASPECT_RATIO = 660 / 595;

type MagazineCardOverlayProps = {
  title: string;
  variant?: "large" | "compact";
  /** null이면 줄 수 제한 없음 (상세 등) */
  titleLines?: number | null;
};

const MagazineCardOverlay = ({
  title,
  variant = "large",
  titleLines,
}: MagazineCardOverlayProps) => {
  const isLarge = variant === "large";
  const logoHeight = isLarge ? 11 : 8;
  const resolvedTitleLines =
    titleLines === null
      ? undefined
      : titleLines ?? (isLarge ? 3 : 2);

  return (
    <>
      <LinearGradient
        colors={["rgba(0,0,0,0.04)", "rgba(0,0,0,0.32)", "rgba(0,0,0,0.84)"]}
        locations={[0, 0.45, 1]}
        style={styles.overlay}
        pointerEvents="none"
      />
      <View
        style={[styles.textWrap, isLarge ? styles.textWrapLarge : styles.textWrapCompact]}
        pointerEvents="none"
      >
        <View style={styles.badgeRow}>
          <Image
            source={WHITE_LOGO}
            style={{
              height: logoHeight,
              width: logoHeight * LOGO_ASPECT_RATIO,
            }}
            resizeMode="contain"
          />
          <Text style={[styles.badge, isLarge ? styles.badgeLarge : styles.badgeCompact]}>
            DAYGENCY MAGAZINE
          </Text>
        </View>
        <Text
          style={[styles.title, isLarge ? styles.titleLarge : styles.titleCompact]}
          numberOfLines={resolvedTitleLines}
        >
          {title}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textWrap: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
  },
  textWrapLarge: {
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  textWrapCompact: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    letterSpacing: 1,
  },
  badgeLarge: {
    fontSize: 11,
  },
  badgeCompact: {
    fontSize: 7,
    letterSpacing: 0.6,
  },
  title: {
    color: WHITE,
    fontWeight: "800",
  },
  titleLarge: {
    fontSize: 26,
    lineHeight: 32,
  },
  titleCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default MagazineCardOverlay;
