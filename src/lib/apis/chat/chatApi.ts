import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  ChatMessagesPage,
  ChatRoomListItem,
  ChatRoomsPage,
  CreateAnnouncementRoomBody,
  CreateCoffeeRoomBody,
} from "./types";
import { mergePeerFromRoomRow, peerFromMembers } from "../../chat/peerImageFields";

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
  const content =
    typeof p.content === "string" || p.content === null ? p.content : null;
  const createdAt =
    typeof p.createdAt === "string"
      ? p.createdAt
      : typeof p.created_at === "string"
        ? p.created_at
        : undefined;
  return { content, createdAt };
}

function normalizeRoomItem(
  raw: unknown,
  opts?: { myUserId?: string },
): ChatRoomListItem | null {
  const r = asRecord(raw);
  const id = String(r.id ?? "");
  if (!id) return null;
  const kind = (r.kind === "ANNOUNCEMENT" || r.kind === "COFFEE"
    ? r.kind
    : String(r.kind).toUpperCase() === "ANNOUNCEMENT"
      ? "ANNOUNCEMENT"
      : "COFFEE") as ChatRoomListItem["kind"];

  let peer = mergePeerFromRoomRow(r);
  if (!peer?.userId?.trim() && opts?.myUserId?.trim()) {
    peer = peerFromMembers(r.members, opts.myUserId) ?? peer;
  }

  return {
    id,
    kind,
    post: normalizePost(r.post),
    peer,
    lastMessage: normalizeLastMessage(r.lastMessage ?? r.last_message),
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
      return {
        id: String(m.id ?? ""),
        chatRoomId: String(m.chatRoomId ?? m.chat_room_id ?? ""),
        userId: String(m.userId ?? m.user_id ?? ""),
        content:
          typeof m.content === "string" || m.content === null
            ? (m.content as string | null)
            : null,
        fileUrl:
          typeof m.fileUrl === "string"
            ? m.fileUrl
            : typeof m.file_url === "string"
              ? m.file_url
              : null,
        fileName:
          typeof m.fileName === "string"
            ? m.fileName
            : typeof m.file_name === "string"
              ? m.file_name
              : null,
        fileMime:
          typeof m.fileMime === "string"
            ? m.fileMime
            : typeof m.file_mime === "string"
              ? m.file_mime
              : null,
        createdAt:
          typeof m.createdAt === "string"
            ? m.createdAt
            : typeof m.created_at === "string"
              ? m.created_at
              : "",
      };
    });
    return {
      items,
      total: Number(data.total ?? 0),
      page: Number(data.page ?? 1),
      limit: Number(data.limit ?? 50),
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
    return {
      id: String(m.id ?? ""),
      chatRoomId: String(m.chatRoomId ?? m.chat_room_id ?? roomId),
      userId: String(m.userId ?? m.user_id ?? ""),
      content:
        typeof m.content === "string" || m.content === null
          ? (m.content as string | null)
          : null,
      fileUrl:
        typeof m.fileUrl === "string"
          ? m.fileUrl
          : typeof m.file_url === "string"
            ? m.file_url
            : null,
      fileName:
        typeof m.fileName === "string"
          ? m.fileName
          : typeof m.file_name === "string"
            ? m.file_name
            : null,
      fileMime:
        typeof m.fileMime === "string"
          ? m.fileMime
          : typeof m.file_mime === "string"
            ? m.file_mime
            : null,
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
