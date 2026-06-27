/**
 * 공개 화면에 보여줄 작성자 표시명.
 * 사용자가 직접 정한 활동 아이디(activityName) 우선, 없으면 프로필 이름(name).
 * UUID 등 userId는 노출하지 않음.
 */
export function pickUserNickname(
  user?: Record<string, unknown> | null,
): string {
  if (!user || typeof user !== "object") return "작성자";

  const activity =
    typeof user.activityName === "string"
      ? user.activityName.trim()
      : typeof user.activity_name === "string"
        ? user.activity_name.trim()
        : "";
  const name = typeof user.name === "string" ? user.name.trim() : "";

  return activity || name || "작성자";
}
