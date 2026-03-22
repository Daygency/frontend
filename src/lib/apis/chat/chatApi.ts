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
import { mergePeerFromRoomRow } from "../../chat/peerImageFields";

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

function normalizeRoomItem(raw: unknown): ChatRoomListItem | null {
  const r = asRecord(raw);
  const id = String(r.id ?? "");
  if (!id) return null;
  const kind = (r.kind === "ANNOUNCEMENT" || r.kind === "COFFEE"
    ? r.kind
    : String(r.kind).toUpperCase() === "ANNOUNCEMENT"
      ? "ANNOUNCEMENT"
      : "COFFEE") as ChatRoomListItem["kind"];

  return {
    id,
    kind,
    post: normalizePost(r.post),
    peer: mergePeerFromRoomRow(r),
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
    .map(normalizeRoomItem)
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
    return normalizeRoomItem(data);
  } catch (e) {
    console.warn("[createCoffeeRoom]", e);
    return null;
  }
}

export async function createAnnouncementRoom(
  body: CreateAnnouncementRoomBody,
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
    return normalizeRoomItem(data);
  } catch (e) {
    console.warn("[createAnnouncementRoom]", e);
    return null;
  }
}
