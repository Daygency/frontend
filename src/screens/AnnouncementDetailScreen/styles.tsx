import { StyleSheet } from "react-native";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";

/** 본문 스크롤 영역 배경 — 흰색 시트 사이 마진으로 이 색이 “띠”로 보임 */
export const ANNOUNCEMENT_BODY_BG = "#F2F2F2";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  /** 스크롤 뷰 자체 배경 = 본문 회색 (끝까지 스크롤해도 이어짐) */
  scroll: {
    flex: 1,
    backgroundColor: ANNOUNCEMENT_BODY_BG,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: ANNOUNCEMENT_BODY_BG,
    paddingTop: 8,
  },
  /**
   * 흰색 콘텐츠 시트. 아래 margin으로 회색 배경이 드러남 (디바이더 대신).
   */
  contentSheet: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 8,
  },
  /** 상단 공고 카드(AnnouncementCard)와 본문 사이 회색 띠 */
  contentSheetFlush: {
    marginBottom: 8,
  },
  producerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  producerName: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: BLACK,
  },
  infoContainer: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.28,
    fontWeight: "500",
    color: GRAY.DARK_100,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.28,
    fontWeight: "400",
    color: BLACK,
  },
  majorsBlock: {
    gap: 10,
    marginTop: 6,
  },
  majorsLabel: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.28,
    fontWeight: "600",
    color: GRAY.DARK_100,
  },
  majorsChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  majorChip: {
    backgroundColor: GRAY.DEFAULT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: GRAY.MEDIUM_2,
  },
  majorChipText: {
    fontSize: 15,
    lineHeight: 20,
    color: BLACK,
    fontWeight: "500",
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
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.28,
    fontWeight: "600",
    color: MAIN.DEFAULT,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: 0.3,
    color: BLACK,
  },
  mapSectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: MAIN.DEFAULT,
    marginBottom: 10,
  },
  contentImage: {
    width: "100%",
    marginTop: 16,
    borderRadius: 8,
  },
  attachmentTitle: {
    fontSize: 16,
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
    fontSize: 15,
    fontWeight: "500",
    color: BLACK,
    marginBottom: 4,
  },
  attachmentFileSize: {
    fontSize: 13,
    color: GRAY.DARK_2,
    fontWeight: "400",
  },
  /** 하단 플로팅 버튼만 — 배경·그림자 없음 */
  floatingBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
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
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0.3,
    fontWeight: "600",
    color: WHITE,
  },
});

export default styles;
