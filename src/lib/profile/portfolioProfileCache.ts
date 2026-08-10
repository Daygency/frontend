import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../apis/portfolio/types";

export type PortfolioProfile =
  | ProfileResponseDto
  | PublicProfileResponseDto
  | null;

/** 내 프로필 캐시 키. 타인 프로필은 userId를 키로 사용 */
export const MY_PROFILE_CACHE_KEY = "me";

/**
 * 학력/경력/수상경력/수료증 등은 프로필을 직접 수정해야만 바뀌므로,
 * 세션 동안(앱 재시작 전까지) 메모리에 캐시해 포커스마다 재조회하지 않는다.
 * ProfileEditScreen 저장 성공 시에만 해당 키를 갱신/무효화한다.
 */
const memoryCache = new Map<string, PortfolioProfile>();

export function getCachedPortfolioProfile(
  key: string,
): PortfolioProfile | undefined {
  return memoryCache.has(key) ? memoryCache.get(key) : undefined;
}

export function setCachedPortfolioProfile(
  key: string,
  profile: PortfolioProfile,
): void {
  memoryCache.set(key, profile);
}

export function invalidateCachedPortfolioProfile(
  key: string = MY_PROFILE_CACHE_KEY,
): void {
  memoryCache.delete(key);
}
