import { Alert } from "react-native";

/**
 * 카테고리 선택 직후 — 즉시 접수하지 않고 안내(동일 문구) + 확인/취소 후에만 `onConfirm` 실행.
 * 커뮤니티 글·공연 소식·모집 공고·댓글 신고 공통.
 */
export function confirmReportSubmission(
  onConfirm: () => void | Promise<void>,
): void {
  Alert.alert(
    "신고",
    "신고 사유와 맞지 않을 시 신고처리되지 않을 수 있습니다.",
    [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: () => {
          void Promise.resolve(onConfirm());
        },
      },
    ],
  );
}
