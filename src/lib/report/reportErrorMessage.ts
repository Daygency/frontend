/** README 에러 HTTP 상태 → 사용자 메시지 */

export function messageForReportHttpStatus(status: number, serverMessage: string): string {
  const m = serverMessage?.trim();
  if (m) return m;
  switch (status) {
    case 400:
      return "신고할 수 없습니다. 본인 글·댓글이거나 대상이 올바르지 않습니다.";
    case 401:
      return "로그인이 필요합니다.";
    case 403:
      return "차단 관계에서는 신고할 수 없습니다.";
    case 404:
      return "대상 사용자 또는 콘텐츠를 찾을 수 없습니다.";
    case 409:
      return "이미 해당 사용자를 신고하셨습니다.";
    default:
      return "신고 접수에 실패했습니다.";
  }
}
