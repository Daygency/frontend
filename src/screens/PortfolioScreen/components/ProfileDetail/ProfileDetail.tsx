import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import ShadowCardButton from "../../../../components/ShadowCardButton/ShadowCardButton";
import {
  getMyProfile,
  getUserPublicProfile,
} from "../../../../lib/apis/portfolio/profileApi";
import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../../../../lib/apis/portfolio/types";
import {
  getProfileCache,
  saveProfileCache,
} from "../../../../lib/profileCache";
import { RootRoutes } from "../../../../navigations/routes";

type LoadedProfile = ProfileResponseDto | PublicProfileResponseDto | null;

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
        getUserPublicProfile(viewingUserId).then((data) => {
          if (!cancelled) {
            setProfile(data);
            setIsLoading(false);
          }
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

  /** API의 startedAt/endedAt → "2025.12 ~ 2026.07" */
  const formatPeriod = (item: any) => {
    const toYm = (d: string | undefined) => {
      if (!d) return "";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "";
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
    };
    const start = toYm(item?.startedAt);
    const end = toYm(item?.endedAt);
    if (!start && !end) return "";
    if (!end) return start;
    return `${start} ~ ${end}`;
  };

  const legacyStringContent = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed || null;
  };

  /** 학력/경력: description + (년.월 ~ 년.월) - API의 startedAt/endedAt 그대로 사용 */
  const formatEntriesWithPeriod = (
    arr: any[] | null | undefined,
  ): string | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const lines = arr
      .map((item: any) => {
        const desc = (item?.description ?? "").trim();
        const period = formatPeriod(item);
        if (!desc && !period) return "";
        return period ? `${desc} (${period})` : desc;
      })
      .filter((s) => s.length > 0);
    return lines.length > 0 ? lines.join("\n") : null;
  };

  /** 수료증/자격증: description + (취득 년.월) - API의 year/month 사용 */
  const formatCertificatesWithDate = (
    arr: any[] | null | undefined,
  ): string | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const toYm = (y: string, m: string) =>
      y && m ? `${y}.${String(m).padStart(2, "0")}` : "";
    const lines = arr
      .map((item: any) => {
        const desc = (item?.description ?? "").trim();
        const date = toYm(item?.year ?? "", item?.month ?? "");
        if (!desc && !date) return "";
        return date ? `${desc} (취득 ${date})` : desc;
      })
      .filter((s) => s.length > 0);
    return lines.length > 0 ? lines.join("\n") : null;
  };

  /** 수상: description + (년.월) - API의 awardedAt 또는 year/month 사용 */
  const formatAwardsWithDate = (
    arr: any[] | null | undefined,
  ): string | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const toYm = (d: string | undefined) => {
      if (!d) return "";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "";
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
    };
    const lines = arr
      .map((item: any) => {
        const desc = (item?.description ?? "").trim();
        const date = item?.awardedAt
          ? toYm(item.awardedAt)
          : item?.year && item?.month
            ? `${item.year}.${String(item.month).padStart(2, "0")}`
            : "";
        if (!desc && !date) return "";
        return date ? `${desc} (${date})` : desc;
      })
      .filter((s) => s.length > 0);
    return lines.length > 0 ? lines.join("\n") : null;
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

  const p = profile as any;
  const educationList =
    p?.educationEntries ?? p?.educations ?? [];
  const careerList = p?.careerEntries ?? p?.careers ?? [];
  const awardList = p?.awardEntries ?? p?.awards ?? [];
  const certList =
    p?.certificateEntries ?? p?.certificates ?? [];

  const educationContent =
    formatEntriesWithPeriod(educationList) ?? legacyStringContent(p?.education);
  const careerContent =
    formatEntriesWithPeriod(careerList) ?? legacyStringContent(p?.career);
  const awardContent =
    formatAwardsWithDate(awardList) ?? legacyStringContent(p?.awards);
  const certificateContent = formatCertificatesWithDate(certList);

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

  const body = (
    <>
      {educationContent ? (
        <Sheet {...sheetProps}>
          <Text style={styles.sectionTitle}>학력</Text>
          <Text style={styles.sectionContent}>{educationContent}</Text>
        </Sheet>
      ) : null}

      {careerContent ? (
        <Sheet {...sheetProps}>
          <Text style={styles.sectionTitle}>경력</Text>
          <Text style={styles.sectionContent}>{careerContent}</Text>
        </Sheet>
      ) : null}

      {awardContent ? (
        <Sheet {...sheetProps}>
          <Text style={styles.sectionTitle}>수상 경력</Text>
          <Text style={styles.sectionContent}>{awardContent}</Text>
        </Sheet>
      ) : null}

      {certificateContent ? (
        <Sheet {...sheetProps}>
          <Text style={styles.sectionTitle}>수료증 / 자격증</Text>
          <Text style={styles.sectionContent}>{certificateContent}</Text>
        </Sheet>
      ) : null}
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
