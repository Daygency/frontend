import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import ShadowCardButton from "../../../../components/cards/ShadowCardButton";
import {
  getMyProfile,
  getUserPublicProfile,
  PortfolioPrivateError,
} from "../../../../lib/apis/portfolio/profileApi";
import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../../../../lib/apis/portfolio/types";
import {
  getProfileCache,
  saveProfileCache,
} from "../../../../lib/profileCache";
import {
  formatPeriodFromApiItem,
  formatYearMonth,
  formatYearMonthFromApiDate,
  getAwardEntrySortKey,
  getCertificateEntrySortKey,
  getPeriodEntrySortKey,
  sortByRecentDesc,
} from "../../../../lib/profile/profileEntryDates";
import { RootRoutes } from "../../../../navigations/routes";

type LoadedProfile = ProfileResponseDto | PublicProfileResponseDto | null;

type ProfileEntryItem = {
  description: string;
  period?: string | null;
};

type ProfileDetailProps = {
  embedded?: boolean;
};

const ProfileDetail = ({ embedded = false }: ProfileDetailProps) => {
  const route = useRoute();
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const isArtistPortfolio =
    route.name === RootRoutes.ARTIST_PORTFOLIO;
  const isOtherProfile = Boolean(viewingUserId);
  const isInvalidOtherRoute = isArtistPortfolio && !viewingUserId;

  const [profile, setProfile] = useState<LoadedProfile>(null);
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
          if (data) saveProfileCache(data);
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
    loadProfile(false);
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile(true);
      return () => {};
    }, [loadProfile]),
  );

  const legacyStringEntries = (value: unknown): ProfileEntryItem[] => {
    if (typeof value !== "string") return [];
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((description) => ({ description }));
  };

  const parseEntriesWithPeriod = (
    arr: any[] | null | undefined,
    ongoingLabel?: string,
  ): ProfileEntryItem[] => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr
      .map((item: any) => {
        const description = (item?.description ?? "").trim();
        const period =
          formatPeriodFromApiItem(item, { ongoingLabel }) || null;
        if (!description && !period) return null;
        return {
          description: description || period || "",
          period: description && period ? period : null,
        };
      })
      .filter((item): item is ProfileEntryItem => item != null);
  };

  const parseCertificates = (
    arr: any[] | null | undefined,
  ): ProfileEntryItem[] => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr
      .map((item: any) => {
        const description = (item?.description ?? "").trim();
        const date =
          formatYearMonthFromApiDate(item?.obtainedAt) ||
          formatYearMonth(String(item?.year ?? ""), String(item?.month ?? ""));
        const period = date ? `취득 ${date}` : null;
        if (!description && !period) return null;
        return {
          description: description || period || "",
          period: description && period ? period : null,
        };
      })
      .filter((item): item is ProfileEntryItem => item != null);
  };

  const parseAwards = (arr: any[] | null | undefined): ProfileEntryItem[] => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr
      .map((item: any) => {
        const description = (item?.description ?? "").trim();
        const period =
          formatYearMonthFromApiDate(item?.awardedAt) ||
          formatYearMonth(String(item?.year ?? ""), String(item?.month ?? "")) ||
          null;
        if (!period) {
          if (!description) return null;
          return { description, period: null };
        }
        if (!description && !period) return null;
        return {
          description: description || period || "",
          period: description && period ? period : null,
        };
      })
      .filter((item): item is ProfileEntryItem => item != null);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.contentContainer,
          { justifyContent: "center", alignItems: "center", minHeight: 200 },
        ]}
      >
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  if (isInvalidOtherRoute) {
    return (
      <View
        style={[
          styles.container,
          styles.contentContainer,
          { padding: 24, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: GRAY.DARK, textAlign: "center" }}>
          프로필 상세를 불러올 수 없습니다.
        </Text>
      </View>
    );
  }

  if (isOtherProfile && isPortfolioPrivateBlocked) {
    return (
      <View
        style={[
          embedded ? styles.embeddedRoot : styles.container,
          embedded ? undefined : styles.contentContainer,
          { padding: 24, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: GRAY.DARK_100, textAlign: "center", fontWeight: "600" }}>
          비공개 프로필입니다
        </Text>
      </View>
    );
  }

  const p = profile as any;
  const educationList =
    p?.educationEntries ?? p?.educations ?? [];
  const careerList = p?.careerEntries ?? p?.careers ?? [];
  const awardList = p?.awardEntries ?? p?.awards ?? [];
  const certList =
    p?.certificateEntries ?? p?.certificates ?? [];

  const mergeEntries = (
    parsed: ProfileEntryItem[],
    legacy: unknown,
  ): ProfileEntryItem[] =>
    parsed.length > 0 ? parsed : legacyStringEntries(legacy);

  const educationEntries = mergeEntries(
    parseEntriesWithPeriod(
      sortByRecentDesc(educationList, getPeriodEntrySortKey),
      "재학 중",
    ),
    p?.education,
  );
  const careerEntries = mergeEntries(
    parseEntriesWithPeriod(
      sortByRecentDesc(careerList, getPeriodEntrySortKey),
      "재직 중",
    ),
    p?.career,
  );
  const awardEntries = mergeEntries(
    parseAwards(sortByRecentDesc(awardList, getAwardEntrySortKey)),
    p?.awards,
  );
  const certificateEntries = parseCertificates(
    sortByRecentDesc(certList, getCertificateEntrySortKey),
  );

  const Sheet = embedded ? View : ShadowCardButton;
  const sheetProps = embedded
    ? { style: styles.embeddedSheet }
    : {
        styles: {
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        },
      };

  const renderEntrySection = (
    title: string,
    items: ProfileEntryItem[],
  ) => {
    if (items.length === 0) return null;
    return (
      <Sheet {...sheetProps}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.entryList}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <View
                key={`${title}-${index}-${item.description}`}
                style={styles.entryRow}
              >
                <View style={styles.timelineTrack}>
                  <View style={styles.timelineDot} />
                  {!isLast ? <View style={styles.timelineLine} /> : null}
                </View>
                <View
                  style={[
                    styles.entryBody,
                    isLast ? styles.entryBodyLast : null,
                  ]}
                >
                  <Text style={styles.entryTitle}>{item.description}</Text>
                  {item.period ? (
                    <Text style={styles.entryPeriod}>{item.period}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </Sheet>
    );
  };

  const body = (
    <>
      {renderEntrySection("학력", educationEntries)}
      {renderEntrySection("경력", careerEntries)}
      {renderEntrySection("수상 경력", awardEntries)}
      {renderEntrySection("수료증 / 자격증", certificateEntries)}
    </>
  );

  if (embedded) {
    return <View style={styles.embeddedRoot}>{body}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {body}
    </ScrollView>
  );
};

export default ProfileDetail;
