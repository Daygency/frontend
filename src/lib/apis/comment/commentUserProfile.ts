import type { CommentUser } from "./types";

export function pickCommentUserProfileImgUrl(
  user?: CommentUser | null,
): string | undefined {
  const raw = user?.profileImgUrl ?? user?.profile_img_url;
  return typeof raw === "string" && raw.trim() ? raw.trim() : undefined;
}
