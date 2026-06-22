import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  FollowListItemDto,
  FollowListPageDto,
} from "./followListTypes";

async function authJsonHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("로그인이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export type FollowMutationResult =
  | { ok: true; alreadyFollowing?: boolean }
  | { ok: false; status: number; message?: string };

/**
 * POST /follow — Body: { receiverId }
 * 409: 이미 팔로우 중 (클라이언트는 팔로잉 상태로 처리 가능)
 */
export async function followUser(
  receiverId: string,
): Promise<FollowMutationResult> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(`${API_BASE}/follow`, {
      method: "POST",
      headers,
      body: JSON.stringify({ receiverId }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 409) return { ok: true, alreadyFollowing: true };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/**
 * DELETE /follow/:receiverId — 팔로우 관계 없으면 404
 */
export async function unfollowUser(
  receiverId: string,
): Promise<{ ok: boolean; status: number; message?: string }> {
  try {
    const headers = await authJsonHeaders();
    const res = await fetchWithAuth(
      `${API_BASE}/follow/${encodeURIComponent(receiverId)}`,
      {
        method: "DELETE",
        headers,
      },
    );
    if (res.ok) return { ok: true, status: res.status };
    if (res.status === 404) return { ok: true, status: res.status };
    const message = await readErrorMessage(res);
    return { ok: false, status: res.status, message };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

async function readErrorMessage(res: Response): Promise<string | undefined> {
  const text = await res.text().catch(() => "");
  if (!text) return undefined;
  try {
    const j = JSON.parse(text) as { message?: string };
    return typeof j.message === "string" ? j.message : text;
  } catch {
    return text;
  }
}

function parseFollowListItem(raw: Record<string, unknown>): FollowListItemDto {
  const userId = String(
    raw.userId ?? raw.user_id ?? "",
  ).trim();
  return {
    userId,
    name: String(raw.name ?? ""),
    activityName: String(
      raw.activityName ?? raw.activity_name ?? "",
    ),
    profileImgUrl: String(
      raw.profileImgUrl ?? raw.profile_img_url ?? "",
    ),
    followedAt: String(
      raw.followedAt ?? raw.followed_at ?? "",
    ),
  };
}

function parseFollowListPage(json: Record<string, unknown>): FollowListPageDto {
  const itemsRaw = json.items;
  const items: FollowListItemDto[] = Array.isArray(itemsRaw)
    ? itemsRaw.map((x) =>
        parseFollowListItem(
          typeof x === "object" && x !== null
            ? (x as Record<string, unknown>)
            : {},
        ),
      )
    : [];
  const nextCursor =
    typeof json.nextCursor === "string"
      ? json.nextCursor
      : typeof json.next_cursor === "string"
        ? json.next_cursor
        : null;
  const hasMore =
    typeof json.hasMore === "boolean"
      ? json.hasMore
      : typeof json.has_more === "boolean"
        ? json.has_more
        : false;
  return { items, nextCursor, hasMore };
}

/**
 * GET /follow/users/:userId/following — 인증 불필요
 */
export async function getUserFollowingList(
  userId: string,
  opts?: { cursor?: string | null; limit?: number },
): Promise<FollowListPageDto | null> {
  const id = userId?.trim();
  if (!id) return null;
  try {
    const q = new URLSearchParams();
    if (opts?.cursor) q.set("cursor", opts.cursor);
    if (opts?.limit != null) q.set("limit", String(opts.limit));
    const qs = q.toString();
    const url = `${API_BASE}/follow/users/${encodeURIComponent(id)}/following${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return parseFollowListPage(data);
  } catch {
    return null;
  }
}

/**
 * GET /follow/users/:userId/followers — 인증 불필요
 */
/**
 * 공개 프로필에 isFollowing 이 없을 때, 내 팔로잉 목록에서 상대 userId 포함 여부로 판별
 */
export async function checkIsUserInMyFollowingList(
  myUserId: string,
  targetUserId: string,
): Promise<boolean | null> {
  const me = myUserId?.trim();
  const target = targetUserId?.trim();
  if (!me || !target) return null;

  let cursor: string | null = null;
  const maxPages = 20;

  for (let i = 0; i < maxPages; i++) {
    const page = await getUserFollowingList(me, {
      cursor: cursor ?? undefined,
      limit: 50,
    });
    if (!page) return null;
    if (page.items.some((item) => item.userId === target)) return true;
    if (!page.hasMore || !page.nextCursor) return false;
    cursor = page.nextCursor;
  }

  return false;
}

export async function getUserFollowersList(
  userId: string,
  opts?: { cursor?: string | null; limit?: number },
): Promise<FollowListPageDto | null> {
  const id = userId?.trim();
  if (!id) return null;
  try {
    const q = new URLSearchParams();
    if (opts?.cursor) q.set("cursor", opts.cursor);
    if (opts?.limit != null) q.set("limit", String(opts.limit));
    const qs = q.toString();
    const url = `${API_BASE}/follow/users/${encodeURIComponent(id)}/followers${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return parseFollowListPage(data);
  } catch {
    return null;
  }
}
