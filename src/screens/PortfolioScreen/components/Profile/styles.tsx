import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 9,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  profileTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileTag: {
    fontSize: 12,
    letterSpacing: 0.24,
    fontWeight: "400",
    color: WHITE,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  profileImageContainer: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: GRAY.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 50,
  },
  profileInfoContainer: {
    flex: 1,
    gap: 10,
  },
  profileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileFollowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileFollowingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  profileIntroduction: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: "400",
    color: GRAY.DARK,
    marginTop: 13,
  },
  profileSettingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 13,
    justifyContent: "space-between",
  },
  profileEditContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 4,
    height: 37,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 6,
  },
  profilePrivateContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 4,
    height: 37,
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 10,
    justifyContent: "center",
  },
  profileEditText: {
    fontSize: 14,
    letterSpacing: 0.24,
    fontWeight: "400",
    color: WHITE,
  },
  profilePrivateText: {
    fontSize: 14,
    letterSpacing: 0.24,
    fontWeight: "400",
    color: WHITE,
  },

  // ── 섹션 구분선 ──
  sectionDivider: {
    height: 1,
    backgroundColor: GRAY.MEDIUM,
    marginTop: 16,
    marginBottom: 4,
  },

  // ── 학력/경력/수상/자격증 섹션 ──
  sectionBlock: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: GRAY.DARK_100,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 6,
  },
  entryIcon: {
    marginTop: 2,
  },
  entryTextBlock: {
    flex: 1,
    gap: 2,
  },
  entryDescription: {
    fontSize: 13,
    color: GRAY.DARK_100,
    lineHeight: 18,
  },
  entryPeriod: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  fileChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  fileChipText: {
    fontSize: 11,
    color: MAIN.DEFAULT,
    flex: 1,
  },
});

export default styles;
