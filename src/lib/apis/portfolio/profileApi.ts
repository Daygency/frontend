import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import type { ProfileResponseDto, PublicProfileResponseDto } from "./types";

function attachRelativeProfileUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  return url;
}

/** 0 이상 정수로 정규화 (문자열 "12" 등 지원) */
function toNonNegativeInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) {
    const t = Math.trunc(v);
    return t >= 0 ? t : undefined;
  }
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.trim());
    if (Number.isFinite(n)) {
      const t = Math.trunc(n);
      return t >= 0 ? t : undefined;
    }
  }
  return undefined;
}

function collectNestedObjects(data: Record<string, unknown>): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [data];
  const nestKeys = ["stats", "social", "counts", "follow", "meta", "_count", "profile"];
  for (const k of nestKeys) {
    const v = data[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(v as Record<string, unknown>);
    }
  }
  return out;
}

/**
 * Daygency API (NestJS): `GET /users/profile/my`, `GET /users/:id/profile`, `PATCH /users/profile/my`
 * 응답 루트에 **`followerCount`**, **`followingCount`** (number) 우선 반영 후, 보조 키·중첩은 `parseFollowCounts`로 보강.
 */
function mergeFollowCountsFromApiResponse(
  raw: Record<string, unknown>,
): { followerCount?: number; followingCount?: number } {
  const directFc = toNonNegativeInt(raw.followerCount);
  const directFg = toNonNegativeInt(raw.followingCount);
  const parsed = parseFollowCounts(raw);
  return {
    followerCount: directFc ?? parsed.followerCount,
    followingCount: directFg ?? parsed.followingCount,
  };
}

/**
 * 백엔드 필드명/형식 차이 흡수 (camelCase, snake_case, 문자열 숫자, 중첩 객체)
 */
function parseFollowCounts(data: Record<string, unknown>): {
  followerCount?: number;
  followingCount?: number;
} {
  const followerKeys = [
    "followerCount",
    "follower_count",
    "followersCount",
    "followers_count",
    "followerTotal",
    "follower_total",
  ];
  const followingKeys = [
    "followingCount",
    "following_count",
    "followingsCount",
    "followings_count",
    "followingTotal",
    "following_total",
  ];

  let followerCount: number | undefined;
  let followingCount: number | undefined;

  for (const obj of collectNestedObjects(data)) {
    if (followerCount === undefined) {
      for (const k of followerKeys) {
        const n = toNonNegativeInt(obj[k]);
        if (n !== undefined) {
          followerCount = n;
          break;
        }
      }
    }
    if (followingCount === undefined) {
      for (const k of followingKeys) {
        const n = toNonNegativeInt(obj[k]);
        if (n !== undefined) {
          followingCount = n;
          break;
        }
      }
    }
    if (followerCount !== undefined && followingCount !== undefined) break;
  }

  const out: { followerCount?: number; followingCount?: number } = {};
  if (followerCount !== undefined) out.followerCount = followerCount;
  if (followingCount !== undefined) out.followingCount = followingCount;
  return out;
}

/**
 * PATCH `/users/profile/my` 응답 등 임의 JSON에서 팔로우 수 추출 (캐시 병합용).
 */
export function pickFollowCountsFromApiJson(
  raw: Record<string, unknown> | null | undefined,
): { followerCount?: number; followingCount?: number } {
  if (!raw || typeof raw !== "object") return {};
  return mergeFollowCountsFromApiResponse(raw);
}

function parseIsFollowing(data: Record<string, unknown>): boolean | undefined {
  const raw =
    data.isFollowing ??
    data.is_following ??
    data.viewerFollows ??
    data.viewer_follows;
  if (typeof raw === "boolean") return raw;
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return undefined;
}

/** GET /users/:id/profile — 비공개(403) 시 throw */
export class PortfolioPrivateError extends Error {
  constructor() {
    super("PORTFOLIO_PRIVATE");
    this.name = "PortfolioPrivateError";
  }
}

/**
 * GET /users/:id/profile — 공개 프로필 (연락처 없음).
 * 인증 토큰이 있으면 전달(팔로우 여부 등). 응답에 followerCount / followingCount 포함.
 */
export async function getUserPublicProfile(
  userId: string,
): Promise<PublicProfileResponseDto | null> {
  if (!userId?.trim()) return null;
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const url = `${API_BASE}/users/${encodeURIComponent(userId)}/profile?t=${Date.now()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          }
        : undefined,
    });
    if (!res.ok) {
      if (res.status === 403) {
        throw new PortfolioPrivateError();
      }
      console.warn("[getUserPublicProfile] 실패:", res.status);
      return null;
    }
    const data = (await res.json()) as Record<string, unknown>;
    const counts = mergeFollowCountsFromApiResponse(data);
    const isFollowing = parseIsFollowing(data);
    const majorRaw = data.major;
    const major =
      majorRaw &&
      typeof majorRaw === "object" &&
      majorRaw !== null &&
      "name" in majorRaw
        ? {
            majorId: String(
              (majorRaw as Record<string, unknown>).majorId ??
                (majorRaw as Record<string, unknown>).major_id ??
                "",
            ),
            name: String((majorRaw as Record<string, unknown>).name ?? ""),
          }
        : null;

    const dto: PublicProfileResponseDto = {
      userId: String(data.userId ?? data.user_id ?? userId),
      profileImgUrl: attachRelativeProfileUrl(
        typeof data.profileImgUrl === "string"
          ? data.profileImgUrl
          : typeof data.profile_img_url === "string"
            ? data.profile_img_url
            : undefined,
      ) as string,
      coverImgUrl: attachRelativeProfileUrl(
        typeof data.coverImgUrl === "string"
          ? data.coverImgUrl
          : typeof data.cover_img_url === "string"
            ? data.cover_img_url
            : undefined,
      ),
      name: String(data.name ?? ""),
      activityName: String(
        data.activityName ?? data.activity_name ?? "",
      ),
      role: String(data.role ?? "user"),
      aboutMe: String(data.aboutMe ?? data.about_me ?? ""),
      selfIntroduction: String(
        data.selfIntroduction ?? data.self_introduction ?? "",
      ),
      educations: Array.isArray(data.educations) ? data.educations : null,
      careers: Array.isArray(data.careers) ? data.careers : null,
      awards: Array.isArray(data.awards) ? data.awards : null,
      certificates: Array.isArray(data.certificates)
        ? data.certificates
        : Array.isArray(data.certificateEntries)
          ? data.certificateEntries
          : null,
      major,
      ...(counts.followerCount !== undefined
        ? { followerCount: counts.followerCount }
        : {}),
      ...(counts.followingCount !== undefined
        ? { followingCount: counts.followingCount }
        : {}),
      ...(typeof isFollowing === "boolean" ? { isFollowing } : {}),
    };
    return dto;
  } catch (e) {
    if (e instanceof PortfolioPrivateError) {
      throw e;
    }
    console.warn("[getUserPublicProfile] 에러:", e);
    return null;
  }
}

/**
 * GET /users/profile/my — 인증 필요.
 * 응답: followerCount(나를 팔로우한 수), followingCount(내가 팔로우한 수) 등.
 */
export async function getMyProfile(): Promise<ProfileResponseDto | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  const res = await fetch(
    `${API_BASE}/users/profile/my?t=${Date.now()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    },
  );

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  if (!data) return null;

  const raw = data as Record<string, unknown>;
  const profile = data as ProfileResponseDto;
  const counts = mergeFollowCountsFromApiResponse(raw);
  if (counts.followerCount !== undefined) {
    profile.followerCount = counts.followerCount;
  }
  if (counts.followingCount !== undefined) {
    profile.followingCount = counts.followingCount;
  }
  // 상대 경로인 경우 API base URL 붙이기 (예: /uploads/profile/xxx.jpg)
  if (profile.profileImgUrl?.startsWith("/")) {
    profile.profileImgUrl = `${API_BASE}${profile.profileImgUrl}`;
  }
  if (profile.coverImgUrl?.startsWith("/")) {
    profile.coverImgUrl = `${API_BASE}${profile.coverImgUrl}`;
  }
  if (typeof raw.isPortfolioPrivate === "boolean") {
    profile.isPortfolioPrivate = raw.isPortfolioPrivate;
  } else if (typeof raw.is_portfolio_private === "boolean") {
    profile.isPortfolioPrivate = raw.is_portfolio_private;
  }
  return profile;
}
