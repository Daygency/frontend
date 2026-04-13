/** README: `reportedUserId` — 사용자 UUID (API에 따라 `userId` 또는 `socialId`) */

export function pickReportedUserIdFromUnknown(user: unknown): string | null {
  if (!user || typeof user !== "object") return null;
  const u = user as Record<string, unknown>;
  const id = String(
    u.userId ??
      u.user_id ??
      u.socialId ??
      u.social_id ??
      u.id ??
      u.uuid ??
      u.authorId ??
      u.author_id ??
      "",
  ).trim();
  return id || null;
}
