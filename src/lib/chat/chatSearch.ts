import type { ChatRoomListItem } from "../apis/chat/types";
import type { AnnouncementListItem } from "../apis/announcement/types";

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesChatRoom(
  item: ChatRoomListItem,
  query: string,
): boolean {
  const q = normalizeSearchQuery(query);
  if (!q) return true;

  const peer = item.peer;
  const titleFromPost = item.post?.title;
  const displayName =
    item.kind === "ANNOUNCEMENT" && titleFromPost
      ? titleFromPost
      : peer?.name ?? peer?.activityName ?? "";

  const haystacks = [
    displayName,
    peer?.name,
    peer?.activityName,
    item.post?.title,
    item.lastMessage?.content,
  ]
    .filter((v): v is string => Boolean(v?.trim()))
    .map((v) => v.toLowerCase());

  return haystacks.some((h) => h.includes(q));
}

export function matchesAnnouncement(
  item: AnnouncementListItem,
  query: string,
): boolean {
  const q = normalizeSearchQuery(query);
  if (!q) return true;
  return (
    item.title.toLowerCase().includes(q) ||
    item.type.toLowerCase().includes(q)
  );
}

export function findMessageMatchIndices(
  messages: { id: string; text: string }[],
  query: string,
): number[] {
  const q = normalizeSearchQuery(query);
  if (!q) return [];
  return messages.reduce<number[]>((acc, msg, index) => {
    if (msg.text.toLowerCase().includes(q)) acc.push(index);
    return acc;
  }, []);
}
