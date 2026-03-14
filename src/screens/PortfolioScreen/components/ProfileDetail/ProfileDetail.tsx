import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import { GRAY, BLACK, MAIN } from "../../../../color";
import ShadowCardButton from "../../../../components/ShadowCardButton/ShadowCardButton";
import { getMyProfile } from "../../../../lib/apis/portfolio/profileApi";
import {
  getProfileCache,
  saveProfileCache,
} from "../../../../lib/profileCache";
import { useAuth } from "../../../../contexts/AuthContext";

const ProfileDetail = () => {
  const { user } = useAuth();
  const [profile, setProfile] =
    useState<Awaited<ReturnType<typeof getMyProfile>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback((skipCache = false) => {
    let cancelled = false;
    const apiResponded = { current: false };
    setIsLoading(true);

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
  }, []);

  useEffect(() => {
    loadProfile(false);
  }, [loadProfile]);

  // 포커스 시 캐시 건너뛰고 API에서 바로 조회 → 프로필 수정 후 최신 selfIntroduction 반영
  useFocusEffect(
    useCallback(() => {
      loadProfile(true);
      return () => {};
    }, [loadProfile])
  );

  const getSectionText = (value: unknown, fallback: string) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || fallback;
    }
    if (Array.isArray(value)) {
      const joined = value
        .map((item: any) => {
          const text = item?.description ?? item?.desc ?? item?.content ?? "";
          return typeof text === "string" ? text.trim() : "";
        })
        .filter((text) => text.length > 0)
        .join("\n");
      return joined || fallback;
    }
    return fallback;
  };

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

  /** 학력/경력: description + (년.월 ~ 년.월) - API의 startedAt/endedAt 그대로 사용 */
  const formatEntriesWithPeriod = (
    arr: any[] | null | undefined,
    fallback: string,
  ) => {
    if (!Array.isArray(arr) || arr.length === 0) return fallback;
    const lines = arr
      .map((item: any) => {
        const desc = (item?.description ?? "").trim();
        const period = formatPeriod(item);
        if (!desc && !period) return "";
        return period ? `${desc} (${period})` : desc;
      })
      .filter((s) => s.length > 0);
    return lines.join("\n") || fallback;
  };

  /** 수료증/자격증: description + (취득 년.월) - API의 year/month 사용 */
  const formatCertificatesWithDate = (
    arr: any[] | null | undefined,
    fallback: string,
  ) => {
    if (!Array.isArray(arr) || arr.length === 0) return fallback;
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
    return lines.join("\n") || fallback;
  };

  /** 수상: description + (년.월) - API의 awardedAt 또는 year/month 사용 */
  const formatAwardsWithDate = (
    arr: any[] | null | undefined,
    fallback: string,
  ) => {
    if (!Array.isArray(arr) || arr.length === 0) return fallback;
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
    return lines.join("\n") || fallback;
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

  const aboutMe =
    getSectionText((profile as any)?.selfIntroduction, "") ||
    getSectionText((profile as any)?.aboutMe, "소개가 없습니다.");
  const email = profile?.contact?.email ?? user?.email ?? "";
  const phoneNumber = profile?.contact?.phoneNumber ?? "";
  const hasContact = email || phoneNumber;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>소개</Text>
        <Text style={styles.sectionContent}>{aboutMe}</Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>학력</Text>
        <Text style={styles.sectionContent}>
          {formatEntriesWithPeriod(
            (profile as any)?.educationEntries ?? (profile as any)?.educations ?? [],
            "정보가 없습니다.",
          )}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>경력</Text>
        <Text style={styles.sectionContent}>
          {formatEntriesWithPeriod(
            (profile as any)?.careerEntries ?? (profile as any)?.careers ?? [],
            "정보가 없습니다.",
          )}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>수상 경력</Text>
        <Text style={styles.sectionContent}>
          {formatAwardsWithDate(
            (profile as any)?.awardEntries ?? (profile as any)?.awards ?? [],
            "정보가 없습니다.",
          )}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>수료증 / 자격증</Text>
        <Text style={styles.sectionContent}>
          {formatCertificatesWithDate(
            (profile as any)?.certificateEntries ??
              (profile as any)?.certificates ??
              [],
            "정보가 없습니다.",
          )}
        </Text>
      </ShadowCardButton>

      <ShadowCardButton
        styles={{
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        }}
      >
        <Text style={styles.sectionTitle}>연락처</Text>
        {hasContact ? (
          <>
            {email ? (
              <Text style={styles.sectionContent}>Email: {email}</Text>
            ) : null}
            {phoneNumber ? (
              <Text style={styles.sectionContent}>Phone: {phoneNumber}</Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.sectionContent}>연락처 정보가 없습니다.</Text>
        )}
      </ShadowCardButton>
    </ScrollView>
  );
};

export default ProfileDetail;
