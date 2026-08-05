import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  ChatFileItem,
  ChatMessagesPage,
  ChatRoomListItem,
  ChatRoomsPage,
  CreateAnnouncementRoomBody,
  CreateCoffeeRoomBody,
} from "./types";
import {
  mergePeerFromRoomRow,
  peerFromMembers,
  pickProfileImageUrlDeep,
} from "../../chat/peerImageFields";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function normalizeFileName(value: string): string {
  return typeof value.normalize === "function" ? value.normalize("NFC") : value;
}

function decodeFileName(value: string): string {
  let decoded = value;
  for (let i = 0; i < 5; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  const withoutQuery = decoded.split("?")[0]?.split("#")[0] ?? decoded;
  const fileName =
    withoutQuery.split(/[\\/]/).filter(Boolean).pop() ?? withoutQuery;
  return normalizeFileName(fileName).trim();
}

function cleanFileName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/^\[파일\]\s*/, "").trim();
  return cleaned ? decodeFileName(cleaned) : null;
}

function fileNameFromUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const withoutQuery = value.split("?")[0]?.split("#")[0] ?? "";
  const lastSegment = withoutQuery.split("/").filter(Boolean).pop();
  if (!lastSegment) return null;
  return decodeFileName(lastSegment);
}

function pickFileName(raw: Record<string, unknown>): string | null {
  return (
    cleanFileName(raw.fileName) ??
    cleanFileName(raw.file_name) ??
    cleanFileName(raw.originalName) ??
    cleanFileName(raw.original_name) ??
    cleanFileName(raw.name) ??
    fileNameFromUrl(raw.fileUrl) ??
    fileNameFromUrl(raw.file_url)
  );
}

function pickFileUrl(raw: Record<string, unknown>): string | null {
  return typeof raw.fileUrl === "string"
    ? raw.fileUrl
    : typeof raw.file_url === "string"
      ? raw.file_url
      : null;
}

function pickFileMime(raw: Record<string, unknown>): string | null {
  return typeof raw.fileMime === "string"
    ? raw.fileMime
    : typeof raw.file_mime === "string"
      ? raw.file_mime
      : typeof raw.mimeType === "string"
        ? raw.mimeType
        : typeof raw.mime_type === "string"
          ? raw.mime_type
          : null;
}

function normalizeFileItem(raw: unknown): ChatFileItem | null {
  const p = asRecord(raw);
  const fileUrl = pickFileUrl(p);
  if (!fileUrl) return null;
  return {
    fileUrl,
    fileName: pickFileName(p) ?? fileNameFromUrl(fileUrl) ?? "파일",
    fileMime: pickFileMime(p),
  };
}

function pickFileItems(raw: Record<string, unknown>): ChatFileItem[] | null {
  const value = raw.fileItems ?? raw.file_items;
  if (!Array.isArray(value)) return null;
  const items = value.map(normalizeFileItem).filter(Boolean) as ChatFileItem[];
  return items.length > 0 ? items : null;
}

function pickUnreadMemberIds(
  raw: Record<string, unknown>,
): string[] | undefined {
  const value = raw.unreadMemberIds ?? raw.unread_member_ids;
  if (!Array.isArray(value)) return undefined;
  return value.map(String);
}

function normalizePost(raw: unknown): ChatRoomListItem["post"] {
  const p = asRecord(raw);
  if (!Object.keys(p).length) return null;
  const postId = String(p.postId ?? p.post_id ?? "");
  const title = typeof p.title === "string" ? p.title : undefined;
  if (!postId && !title) return null;
  return { postId: postId || undefined, title };
}

function normalizeLastMessage(raw: unknown): ChatRoomListItem["lastMessage"] {
  const p = asRecord(raw);
  if (!Object.keys(p).length) return null;
  const fileUrl = pickFileUrl(p);
  const fileName = pickFileName(p);
  const fileMime = pickFileMime(p);
  const fileItems = pickFileItems(p);
  const content =
    typeof p.content === "string" && p.content.trim()
      ? p.content
      : p.content === null
        ? null
        : fileName;
  const createdAt =
    typeof p.createdAt === "string"
      ? p.createdAt
      : typeof p.created_at === "string"
        ? p.created_at
        : undefined;
  return {
    content: content ?? fileName ?? (fileUrl ? "파일" : null),
    fileUrl,
    fileName,
    fileMime,
    fileItems,
    createdAt,
  };
}

function normalizeMemberSummary(raw: unknown) {
  const p = asRecord(raw);
  const userId = String(p.userId ?? p.user_id ?? "").trim();
  if (!userId) return null;
  const name =
    typeof p.name === "string" && p.name.trim() ? p.name.trim() : undefined;
  const activityNameRaw =
    typeof p.activityName === "string"
      ? p.activityName
      : typeof p.activity_name === "string"
        ? p.activity_name
        : undefined;
  return {
    userId,
    name,
    activityName: activityNameRaw?.trim() || undefined,
    profileImageUrl: pickProfileImageUrlDeep(p),
  };
}

/** 목록/메시지 응답의 `members[]`(플랫 요약) 파싱 — GROUP 방 발신자 이름/아바타 표시용 */
function normalizeMemberSummaries(raw: unknown) {
  if (!Array.isArray(raw)) return null;
  const items = raw
    .map(normalizeMemberSummary)
    .filter(Boolean) as NonNullable<ReturnType<typeof normalizeMemberSummary>>[];
  return items.length > 0 ? items : null;
}

function normalizeRoomItem(
  raw: unknown,
  opts?: { myUserId?: string },
): ChatRoomListItem | null {
  const r = asRecord(raw);
  const id = String(r.id ?? "");
  if (!id) return null;
  const kindRaw = String(r.kind ?? "").toUpperCase();
  const kind: ChatRoomListItem["kind"] = kindRaw === "GROUP" ? "GROUP" : "COFFEE";

  let peer = mergePeerFromRoomRow(r);
  if (!peer?.userId?.trim() && opts?.myUserId?.trim()) {
    peer = peerFromMembers(r.members, opts.myUserId) ?? peer;
  }
  const members = normalizeMemberSummaries(r.members);
  if (kind === "GROUP") {
    peer = null;
  }

  const unreadRaw = r.unreadCount ?? r.unread_count;
  const unreadCount = typeof unreadRaw === "number" ? unreadRaw : Number(unreadRaw ?? 0);

  return {
    id,
    kind,
    post: normalizePost(r.post),
    peer,
    members,
    lastMessage: normalizeLastMessage(r.lastMessage ?? r.last_message),
    unreadCount: Number.isFinite(unreadCount) ? Math.max(0, unreadCount) : 0,
    createdAt:
      typeof r.createdAt === "string"
        ? r.createdAt
        : typeof r.created_at === "string"
          ? r.created_at
          : undefined,
  };
}

function parseRoomsPage(data: unknown): ChatRoomsPage {
  const d = asRecord(data);
  const rawItems = Array.isArray(d.items) ? d.items : [];
  const items = rawItems
    .map((row) => normalizeRoomItem(row))
    .filter(Boolean) as ChatRoomListItem[];
  return {
    items,
    nextCursor:
      typeof d.nextCursor === "string"
        ? d.nextCursor
        : typeof d.next_cursor === "string"
          ? d.next_cursor
          : null,
    hasMore: Boolean(d.hasMore ?? d.has_more),
  };
}

export async function getAllRooms(params?: {
  cursor?: string;
  limit?: number;
}): Promise<ChatRoomsPage | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const url = `${API_BASE}/chat/rooms/all${qs ? `?${qs}` : ""}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      console.warn("[getAllRooms]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return parseRoomsPage(data);
  } catch (e) {
    console.warn("[getAllRooms]", e);
    return null;
  }
}

export async function getCoffeeRooms(params?: {
  cursor?: string;
  limit?: number;
}): Promise<ChatRoomsPage | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const url = `${API_BASE}/chat/rooms/coffee${qs ? `?${qs}` : ""}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      console.warn("[getCoffeeRooms]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return parseRoomsPage(data);
  } catch (e) {
    console.warn("[getCoffeeRooms]", e);
    return null;
  }
}

export async function getAppliedRooms(params?: {
  cursor?: string;
  limit?: number;
}): Promise<ChatRoomsPage | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const url = `${API_BASE}/chat/rooms/applied${qs ? `?${qs}` : ""}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      console.warn("[getAppliedRooms]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return parseRoomsPage(data);
  } catch (e) {
    console.warn("[getAppliedRooms]", e);
    return null;
  }
}

export async function getRoomsByPost(
  postId: string,
  params?: { cursor?: string; limit?: number },
): Promise<ChatRoomsPage | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const url = `${API_BASE}/chat/rooms/by-post/${encodeURIComponent(postId)}${qs ? `?${qs}` : ""}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      console.warn("[getRoomsByPost]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return parseRoomsPage(data);
  } catch (e) {
    console.warn("[getRoomsByPost]", e);
    return null;
  }
}

/** "내 공고" 탭 — 내가 작성한 공고들의 그룹채팅방 목록 */
export async function getMyAnnouncementGroupRooms(params?: {
  cursor?: string;
  limit?: number;
}): Promise<ChatRoomsPage | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const url = `${API_BASE}/chat/rooms/my-announcements${qs ? `?${qs}` : ""}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      console.warn(
        "[getMyAnnouncementGroupRooms]",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }
    const data = await res.json();
    return parseRoomsPage(data);
  } catch (e) {
    console.warn("[getMyAnnouncementGroupRooms]", e);
    return null;
  }
}

export async function getChatMessages(
  roomId: string,
  params?: { page?: number; limit?: number },
): Promise<ChatMessagesPage | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    const qs = q.toString();
    const url = `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/messages${qs ? `?${qs}` : ""}`;
    const res = await fetchWithAuth(url, { method: "GET", headers });
    if (!res.ok) {
      console.warn("[getChatMessages]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = (await res.json()) as Record<string, unknown>;
    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = rawItems.map((row) => {
      const m = asRecord(row);
      const fileUrl = pickFileUrl(m);
      const fileName = pickFileName(m);
      const fileItems = pickFileItems(m);
      return {
        id: String(m.id ?? ""),
        chatRoomId: String(m.chatRoomId ?? m.chat_room_id ?? ""),
        userId: String(m.userId ?? m.user_id ?? ""),
        content:
          typeof m.content === "string" || m.content === null
            ? (m.content as string | null)
            : null,
        fileUrl,
        fileName,
        fileMime: pickFileMime(m),
        fileItems,
        createdAt:
          typeof m.createdAt === "string"
            ? m.createdAt
            : typeof m.created_at === "string"
              ? m.created_at
              : "",
        readByPeer:
          m.readByPeer != null || m.read_by_peer != null
            ? Boolean(m.readByPeer ?? m.read_by_peer)
            : undefined,
        unreadMemberIds: pickUnreadMemberIds(m),
      };
    });
    const peerUserId =
      typeof data.peerUserId === "string" && data.peerUserId
        ? data.peerUserId
        : null;
    const members = normalizeMemberSummaries(data.members);
    return {
      items,
      total: Number(data.total ?? 0),
      page: Number(data.page ?? 1),
      limit: Number(data.limit ?? 50),
      peerUserId,
      members,
    };
  } catch (e) {
    console.warn("[getChatMessages]", e);
    return null;
  }
}

export async function createCoffeeRoom(
  body: CreateCoffeeRoomBody,
  opts?: { myUserId?: string },
): Promise<ChatRoomListItem | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/chat/rooms/coffee`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn("[createCoffeeRoom]", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return normalizeRoomItem(data, opts);
  } catch (e) {
    console.warn("[createCoffeeRoom]", e);
    return null;
  }
}

export async function createAnnouncementRoom(
  body: CreateAnnouncementRoomBody,
  opts?: { myUserId?: string },
): Promise<ChatRoomListItem | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/chat/rooms/announcement`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(
        "[createAnnouncementRoom]",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }
    const data = await res.json();
    return normalizeRoomItem(data, opts);
  } catch (e) {
    console.warn("[createAnnouncementRoom]", e);
    return null;
  }
}

export async function sendChatFileMessage(
  roomId: string,
  uri: string,
  options?: { name?: string; type?: string },
): Promise<ChatMessagesPage["items"][number] | null> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error("인증이 필요합니다.");

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: options?.name ?? "file",
      type: options?.type ?? "application/octet-stream",
    } as unknown as Blob);

    const res = await fetchWithAuth(
      `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/messages/file`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    if (!res.ok) {
      console.warn(
        "[sendChatFileMessage]",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }

    const m = asRecord(await res.json());
    const fileUrl = pickFileUrl(m);
    const fileName = pickFileName(m) ?? cleanFileName(options?.name);
    const fileItems = pickFileItems(m);
    return {
      id: String(m.id ?? ""),
      chatRoomId: String(m.chatRoomId ?? m.chat_room_id ?? roomId),
      userId: String(m.userId ?? m.user_id ?? ""),
      content:
        typeof m.content === "string" || m.content === null
          ? (m.content as string | null)
          : null,
      fileUrl,
      fileName,
      fileMime: pickFileMime(m) ?? options?.type ?? null,
      fileItems,
      createdAt:
        typeof m.createdAt === "string"
          ? m.createdAt
          : typeof m.created_at === "string"
            ? m.created_at
            : new Date().toISOString(),
    };
  } catch (e) {
    console.warn("[sendChatFileMessage]", e);
    return null;
  }
}

export async function sendChatFilesMessage(
  roomId: string,
  files: Array<{ uri: string; name?: string; type?: string }>,
): Promise<ChatMessagesPage["items"][number] | null> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error("인증이 필요합니다.");
    if (!files.length) return null;

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", {
        uri: file.uri,
        name: file.name ?? `image_${Date.now()}_${index + 1}.jpg`,
        type: file.type ?? "image/jpeg",
      } as unknown as Blob);
    });

    const res = await fetchWithAuth(
      `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/messages/files`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    if (!res.ok) {
      console.warn(
        "[sendChatFilesMessage]",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }

    const m = asRecord(await res.json());
    const fileUrl = pickFileUrl(m);
    const fileItems = pickFileItems(m);
    return {
      id: String(m.id ?? ""),
      chatRoomId: String(m.chatRoomId ?? m.chat_room_id ?? roomId),
      userId: String(m.userId ?? m.user_id ?? ""),
      content:
        typeof m.content === "string" || m.content === null
          ? (m.content as string | null)
          : null,
      fileUrl,
      fileName: pickFileName(m) ?? fileItems?.[0]?.fileName ?? fileNameFromUrl(fileUrl),
      fileMime: pickFileMime(m) ?? fileItems?.[0]?.fileMime ?? null,
      fileItems,
      createdAt:
        typeof m.createdAt === "string"
          ? m.createdAt
          : typeof m.created_at === "string"
            ? m.created_at
            : new Date().toISOString(),
    };
  } catch (e) {
    console.warn("[sendChatFilesMessage]", e);
    return null;
  }
}

export async function getChatRoomMemberSettings(
  roomId: string,
): Promise<{ notificationsMuted: boolean } | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/member-settings`,
      { method: "GET", headers },
    );
    if (!res.ok) {
      console.warn(
        "[getChatRoomMemberSettings]",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }
    const data = asRecord(await res.json());
    return {
      notificationsMuted: Boolean(
        data.notificationsMuted ?? data.notifications_muted,
      ),
    };
  } catch (e) {
    console.warn("[getChatRoomMemberSettings]", e);
    return null;
  }
}

export async function setChatRoomNotificationsMuted(
  roomId: string,
  muted: boolean,
): Promise<{ notificationsMuted: boolean } | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/notifications-muted`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ muted }),
      },
    );
    if (!res.ok) {
      console.warn(
        "[setChatRoomNotificationsMuted]",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }
    const data = asRecord(await res.json());
    return {
      notificationsMuted: Boolean(
        data.notificationsMuted ?? data.notifications_muted,
      ),
    };
  } catch (e) {
    console.warn("[setChatRoomNotificationsMuted]", e);
    return null;
  }
}

/** PATCH /chat/rooms/:roomId/read — lastMessageId 생략 시 방의 최신 메시지 기준 */
export async function markChatRoomRead(
  roomId: string,
  lastMessageId?: string,
): Promise<boolean> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/read`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(lastMessageId ? { lastMessageId } : {}),
      },
    );
    if (!res.ok) {
      console.warn("[markChatRoomRead] failed", res.status, await res.text().catch(() => ""));
    }
    return res.ok;
  } catch (e) {
    console.warn("[markChatRoomRead]", e);
    return false;
  }
}

/** GET /chat/unread-count — 하단 탭바 배지용, 내가 속한 모든 방의 안읽음 총합 */
export async function getChatUnreadCount(): Promise<number | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/chat/unread-count`, {
      method: "GET",
      headers,
    });
    if (!res.ok) return null;
    const data = asRecord(await res.json());
    const raw = data.unreadCount ?? data.unread_count;
    const n = typeof raw === "number" ? raw : Number(raw ?? 0);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  } catch (e) {
    console.warn("[getChatUnreadCount]", e);
    return null;
  }
}

/** GET /chat/unread-count/by-tab — 채팅 탭(DM/지원 공고/내 공고)별 안읽음 합산 배지용 */
export async function getChatUnreadCountByTab(): Promise<{
  dm: number;
  appliedAnnouncement: number;
  myAnnouncement: number;
} | null> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/chat/unread-count/by-tab`, {
      method: "GET",
      headers,
    });
    if (!res.ok) return null;
    const data = asRecord(await res.json());
    const toCount = (raw: unknown) => {
      const n = typeof raw === "number" ? raw : Number(raw ?? 0);
      return Number.isFinite(n) ? Math.max(0, n) : 0;
    };
    return {
      dm: toCount(data.dm),
      appliedAnnouncement: toCount(data.appliedAnnouncement),
      myAnnouncement: toCount(data.myAnnouncement),
    };
  } catch (e) {
    console.warn("[getChatUnreadCountByTab]", e);
    return null;
  }
}

export async function leaveChatRoom(roomId: string): Promise<boolean> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/chat/rooms/${encodeURIComponent(roomId)}/leave`,
      { method: "POST", headers },
    );
    if (!res.ok) {
      console.warn(
        "[leaveChatRoom]",
        res.status,
        await res.text().catch(() => ""),
      );
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[leaveChatRoom]", e);
    return false;
  }
}
