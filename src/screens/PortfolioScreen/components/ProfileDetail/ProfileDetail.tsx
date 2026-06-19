import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
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
  ): ProfileEntryItem[] => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return arr
      .map((item: any) => {
        const description = (item?.description ?? "").trim();
        const period = formatPeriod(item) || null;
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
    const toYmFromDate = (d: string | undefined) => {
      if (!d?.trim()) return "";
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return "";
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
    };
    const toYm = (y: string, m: string) =>
      y && m ? `${y}.${String(m).padStart(2, "0")}` : "";
    return arr
      .map((item: any) => {
        const description = (item?.description ?? "").trim();
        const date =
          toYmFromDate(item?.obtainedAt) ||
          toYm(item?.year ?? "", item?.month ?? "");
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
    const toYm = (d: string | undefined) => {
      if (!d) return "";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "";
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
    };
    return arr
      .map((item: any) => {
        const description = (item?.description ?? "").trim();
        const period = item?.awardedAt
          ? toYm(item.awardedAt)
          : item?.year && item?.month
            ? `${item.year}.${String(item.month).padStart(2, "0")}`
            : null;
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
    parseEntriesWithPeriod(educationList),
    p?.education,
  );
  const careerEntries = mergeEntries(
    parseEntriesWithPeriod(careerList),
    p?.career,
  );
  const awardEntries = mergeEntries(parseAwards(awardList), p?.awards);
  const certificateEntries = parseCertificates(certList);

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
    iconName: ComponentProps<typeof Ionicons>["name"],
  ) => {
    if (items.length === 0) return null;
    return (
      <Sheet {...sheetProps}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.entryList}>
          {items.map((item, index) => (
            <View
              key={`${title}-${index}-${item.description}`}
              style={styles.entryRow}
            >
              <View style={styles.entryIconBox}>
                <Ionicons name={iconName} size={20} color={MAIN.DEFAULT} />
              </View>
              <View style={styles.entryTextWrap}>
                <Text style={styles.entryTitle}>{item.description}</Text>
                {item.period ? (
                  <Text style={styles.entryPeriod}>{item.period}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </Sheet>
    );
  };

  const body = (
    <>
      {renderEntrySection("학력", educationEntries, "school-outline")}
      {renderEntrySection("경력", careerEntries, "briefcase-outline")}
      {renderEntrySection("수상 경력", awardEntries, "trophy-outline")}
      {renderEntrySection(
        "수료증 / 자격증",
        certificateEntries,
        "ribbon-outline",
      )}
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
