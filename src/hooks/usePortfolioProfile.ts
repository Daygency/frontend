import { useCallback, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import {
  getMyProfile,
  getUserPublicProfile,
  PortfolioPrivateError,
} from "../lib/apis/portfolio/profileApi";
import { getProfileCache, saveProfileCache } from "../lib/profileCache";
import {
  getCachedPortfolioProfile,
  setCachedPortfolioProfile,
  MY_PROFILE_CACHE_KEY,
  type PortfolioProfile,
} from "../lib/profile/portfolioProfileCache";
import { RootRoutes } from "../navigations/routes";

export type { PortfolioProfile };

/**
 * 내 프로필 / 타인 공개 프로필 로드 (Profile, ProfileDetail 공통)
 *
 * 학력·경력·수상경력·수료증 등은 프로필을 직접 수정해야만 바뀌므로,
 * 최초 1회 조회 후에는 세션 내 메모리 캐시를 사용하고 포커스마다 재조회하지 않는다.
 * ProfileEditScreen에서 저장에 성공하면 캐시가 갱신되어 다음 포커스 때 반영된다.
 */
export function usePortfolioProfile() {
  const route = useRoute();
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const isArtistPortfolio = route.name === RootRoutes.ARTIST_PORTFOLIO;
  const isOtherProfile = Boolean(viewingUserId);
  const isInvalidOtherRoute = isArtistPortfolio && !viewingUserId;

  const [profile, setProfile] = useState<PortfolioProfile>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortfolioPrivateBlocked, setIsPortfolioPrivateBlocked] =
    useState(false);

  const cacheKey = isOtherProfile ? viewingUserId : MY_PROFILE_CACHE_KEY;

  const loadProfile = useCallback(
    (skipCache = false) => {
      let cancelled = false;
      const apiResponded = { current: false };

      if (isInvalidOtherRoute) {
        setProfile(null);
        setIsLoading(false);
        return () => {
          cancelled = true;
        };
      }

      // 학력·경력·수상경력·수료증 등은 직접 프로필을 수정해야만 바뀌므로,
      // 세션 메모리 캐시가 있으면 네트워크 재조회 없이 그대로 사용
      if (!skipCache) {
        const memoryCached = getCachedPortfolioProfile(cacheKey);
        if (memoryCached !== undefined) {
          setIsPortfolioPrivateBlocked(false);
          setProfile(memoryCached);
          setIsLoading(false);
          return () => {
            cancelled = true;
          };
        }
      }

      setIsLoading(true);

      if (isOtherProfile && viewingUserId) {
        setIsPortfolioPrivateBlocked(false);
        getUserPublicProfile(viewingUserId)
          .then((data) => {
            if (!cancelled) {
              setCachedPortfolioProfile(cacheKey, data);
              setProfile(data);
              setIsLoading(false);
            }
          })
          .catch((e) => {
            if (!cancelled && e instanceof PortfolioPrivateError) {
              setIsPortfolioPrivateBlocked(true);
              setProfile(null);
            }
            if (!cancelled) setIsLoading(false);
          });
        return () => {
          cancelled = true;
        };
      }

      getProfileCache().then((cached) => {
        if (!cancelled && cached && !apiResponded.current) {
          setProfile(cached);
          setIsLoading(false);
        }
      });

      getMyProfile()
        .then((data) => {
          if (!cancelled) {
            apiResponded.current = true;
            if (data) {
              void saveProfileCache(data);
              setCachedPortfolioProfile(cacheKey, data);
            }
            setProfile(data);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            apiResponded.current = true;
            setIsLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    },
    [isOtherProfile, viewingUserId, isInvalidOtherRoute, cacheKey],
  );

  // 포커스마다 실행되지만, 캐시가 있으면 loadProfile 내부에서 네트워크 조회 없이 반환한다
  // (ProfileEditScreen 저장 성공 시 캐시가 갱신/무효화되므로 최신 상태가 반영됨)
  useFocusEffect(
    useCallback(() => {
      const cleanup = loadProfile(false);
      return cleanup;
    }, [loadProfile]),
  );

  return {
    profile,
    isLoading,
    isOtherProfile,
    isInvalidOtherRoute,
    isPortfolioPrivateBlocked,
    viewingUserId,
    reload: () => loadProfile(true),
  };
}
