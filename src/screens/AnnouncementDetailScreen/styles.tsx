import { StyleSheet, Platform } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
  },
  dividerThick: {
    height: 8,
    backgroundColor: "#F2F2F2",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  producerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  producerName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: BLACK,
  },
  infoContainer: {
    marginTop: 10,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.28,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  infoValue: {
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.28,
    fontWeight: "400",
    color: BLACK,
  },
  statusBadge: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0.28,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: BLACK,
  },
  contentImage: {
    width: "100%",
    marginTop: 16,
    borderRadius: 8,
  },
  attachmentTitle: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: -0.32,
    color: MAIN.DEFAULT,
    marginBottom: 12,
  },
  attachmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentFileName: {
    fontSize: 14,
    fontWeight: "500",
    color: BLACK,
    marginBottom: 4,
  },
  attachmentFileSize: {
    fontSize: 12,
    color: GRAY.DARK_2,
    fontWeight: "400",
  },
  applyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: WHITE,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 2,
        backgroundColor: "#fff",
      },
    }),
  },
  btnApply: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnApplyText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: WHITE,
  },
  /** 하단 고정 박스(그림자·흰 배경) 없이 버튼만 둘 때 */
  earlyCloseBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
});

export default styles;
