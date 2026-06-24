import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import {
  getMyProfile,
  getUserPublicProfile,
  PortfolioPrivateError,
} from "../lib/apis/portfolio/profileApi";
import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../lib/apis/portfolio/types";
import { getProfileCache, saveProfileCache } from "../lib/profileCache";
import { RootRoutes } from "../navigations/routes";

export type PortfolioProfile =
  | ProfileResponseDto
  | PublicProfileResponseDto
  | null;

type Options = {
  /** 포커스 시 캐시 없이 API 재조회 */
  refreshOnFocus?: boolean;
};

/**
 * 내 프로필 / 타인 공개 프로필 로드 (Profile, ProfileDetail 공통)
 */
export function usePortfolioProfile(options: Options = {}) {
  const { refreshOnFocus = false } = options;
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

  const loadProfile = useCallback(
    (skipCache = false) => {
      let cancelled = false;
      const apiResponded = { current: false };
      setIsLoading(true);

      if (isInvalidOtherRoute) {
        setProfile(null);
        setIsLoading(false);
        return () => {
          cancelled = true;
        };
      }

      if (isOtherProfile && viewingUserId) {
        setIsPortfolioPrivateBlocked(false);
        getUserPublicProfile(viewingUserId)
          .then((data) => {
            if (!cancelled) {
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

      if (!skipCache) {
        getProfileCache().then((cached) => {
          if (!cancelled && cached && !apiResponded.current) {
            setProfile(cached);
            setIsLoading(false);
          }
        });
      }

      getMyProfile().then((data) => {
        if (!cancelled) {
          apiResponded.current = true;
          if (data) void saveProfileCache(data);
          setProfile(data);
          setIsLoading(false);
        }
      });

      return () => {
        cancelled = true;
      };
    },
    [isOtherProfile, viewingUserId, isInvalidOtherRoute],
  );

  useEffect(() => {
    const cleanup = loadProfile(false);
    return cleanup;
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      if (!refreshOnFocus) return () => {};
      const cleanup = loadProfile(true);
      return cleanup;
    }, [loadProfile, refreshOnFocus]),
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
