import {
  View,
  Text,
  Switch,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import styles from "./styles";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../../color";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../../navigations/routes";
import { getMyProfile } from "../../../../lib/profileApi";
import type {
  EducationEntry,
  CareerEntry,
  AwardEntry,
  CertificateEntry,
} from "../../../../lib/profileApi";
import {
  getProfileCache,
  saveProfileCache,
} from "../../../../lib/profileCache";
import { useAuth } from "../../../../contexts/AuthContext";

const ROLE_LABEL: Record<string, string> = {
  artist: "예술가",
  planner: "플래너",
};

/** http/https URL 또는 로컬 file:// 경로 유효성 검사 */
const isValidImageSource = (uri: string | undefined): boolean =>
  !!uri?.trim() &&
  (uri.startsWith("http://") ||
    uri.startsWith("https://") ||
    uri.startsWith("file://"));

/** iOS ATS는 http 차단 → https로 변환 (file://는 그대로 반환) */
const toDisplayImageUri = (uri: string | undefined): string | null => {
  const trimmed = uri?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://"))
    return trimmed.replace("http://", "https://");
  return trimmed;
};

const formatYearMonth = (year: string, month: string) => {
  if (!year && !month) return "";
  if (!year) return `${month}월`;
  if (!month) return `${year}`;
  return `${year}.${month.padStart(2, "0")}`;
};

// ─────────────────────────────────────────────
// 프로필 섹션 컴포넌트들
// ─────────────────────────────────────────────
const SectionBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionBlock}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const EducationSection = ({ entries }: { entries: EducationEntry[] }) => {
  if (entries.length === 0) return null;
  return (
    <SectionBlock title="학력">
      {entries.map((e) => {
        const start = formatYearMonth(e.startYear, e.startMonth);
        const end = formatYearMonth(e.endYear, e.endMonth);
        const period = start || end ? `(${start}${start && end ? " ~ " : ""}${end})` : "";
        return (
          <View key={e.id} style={styles.entryRow}>
            <MaterialCommunityIcons
              name="school-outline"
              size={14}
              color={GRAY.DARK_2}
              style={styles.entryIcon}
            />
            <View style={styles.entryTextBlock}>
              <Text style={styles.entryDescription}>{e.description}</Text>
              {period ? (
                <Text style={styles.entryPeriod}>{period}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </SectionBlock>
  );
};

const CareerSection = ({ entries }: { entries: CareerEntry[] }) => {
  if (entries.length === 0) return null;
  return (
    <SectionBlock title="경력사항">
      {entries.map((e) => {
        const start = formatYearMonth(e.startYear, e.startMonth);
        const end = formatYearMonth(e.endYear, e.endMonth);
        const period = start || end ? `(${start}${start && end ? " ~ " : ""}${end})` : "";
        return (
          <View key={e.id} style={styles.entryRow}>
            <MaterialCommunityIcons
              name="briefcase-outline"
              size={14}
              color={GRAY.DARK_2}
              style={styles.entryIcon}
            />
            <View style={styles.entryTextBlock}>
              <Text style={styles.entryDescription}>{e.description}</Text>
              {period ? (
                <Text style={styles.entryPeriod}>{period}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </SectionBlock>
  );
};

const AwardSection = ({ entries }: { entries: AwardEntry[] }) => {
  if (entries.length === 0) return null;
  return (
    <SectionBlock title="수상경력">
      {entries.map((e) => {
        const date = formatYearMonth(e.year, e.month);
        return (
          <View key={e.id} style={styles.entryRow}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={14}
              color={GRAY.DARK_2}
              style={styles.entryIcon}
            />
            <View style={styles.entryTextBlock}>
              <Text style={styles.entryDescription}>{e.description}</Text>
              {date ? <Text style={styles.entryPeriod}>{date}</Text> : null}
            </View>
          </View>
        );
      })}
    </SectionBlock>
  );
};

const CertificateSection = ({ entries }: { entries: CertificateEntry[] }) => {
  if (entries.length === 0) return null;
  return (
    <SectionBlock title="수료증 / 자격증">
      {entries.map((e) => {
        const date = formatYearMonth(e.year, e.month);
        return (
          <View key={e.id} style={styles.entryRow}>
            <MaterialCommunityIcons
              name="certificate-outline"
              size={14}
              color={GRAY.DARK_2}
              style={styles.entryIcon}
            />
            <View style={styles.entryTextBlock}>
              <Text style={styles.entryDescription}>{e.description}</Text>
              {date ? (
                <Text style={styles.entryPeriod}>취득 {date}</Text>
              ) : null}
              {e.fileName ? (
                <View style={styles.fileChip}>
                  <MaterialCommunityIcons
                    name="paperclip"
                    size={11}
                    color={MAIN.DEFAULT}
                  />
                  <Text style={styles.fileChipText} numberOfLines={1}>
                    {e.fileName}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </SectionBlock>
  );
};

// ─────────────────────────────────────────────
// 메인 Profile 컴포넌트
// ─────────────────────────────────────────────
const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuth();
  const [profile, setProfile] =
    useState<Awaited<ReturnType<typeof getMyProfile>>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayNickname = profile?.nickname || user?.nickname || "이름 없음";
  const rawProfileImgUrl = profile?.profileImgUrl || user?.profileImgUrl;
  const displayProfileImgUrl =
    isValidImageSource(rawProfileImgUrl) && !imageError
      ? toDisplayImageUri(rawProfileImgUrl)
      : null;

  console.log("[Profile] profileImgUrl:", {
    fromProfile: profile?.profileImgUrl,
    fromUser: user?.profileImgUrl,
    raw: rawProfileImgUrl,
    display: displayProfileImgUrl,
    imageError,
  });

  const followerCount = 100;
  const followingCount = 100;

  useEffect(() => {
    let cancelled = false;
    const apiResponded = { current: false };
    setImageError(false);

    getProfileCache().then((cached) => {
      if (!cancelled && cached && !apiResponded.current) {
        setProfile(cached);
        setIsLoading(false);
      }
    });

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
    setImageError(false);
  }, [rawProfileImgUrl]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { paddingVertical: 24, alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  const roleLabel = profile?.role
    ? (ROLE_LABEL[profile.role] ?? profile.role)
    : "";

  const educationEntries = profile?.educationEntries ?? [];
  const careerEntries = profile?.careerEntries ?? [];
  const awardEntries = profile?.awardEntries ?? [];
  const certificateEntries = profile?.certificateEntries ?? [];

  const hasSections =
    educationEntries.length > 0 ||
    careerEntries.length > 0 ||
    awardEntries.length > 0 ||
    certificateEntries.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {displayProfileImgUrl ? (
            <Image
              source={{ uri: displayProfileImgUrl }}
              style={styles.profileImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Text>사진</Text>
          )}
        </View>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{displayNickname}</Text>
            {roleLabel ? (
              <View style={styles.profileTagContainer}>
                <Text style={styles.profileTag}>{roleLabel}</Text>
              </View>
            ) : null}
          </View>
          <Pressable
            style={styles.profileFollowerContainer}
            onPress={() => navigation.navigate(RootRoutes.FOLLOW_LIST)}
          >
            <Text>팔로워 {followerCount}</Text>
            <Text>팔로잉 {followingCount}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.profileIntroduction}>
        {profile?.aboutMe ? profile.aboutMe : "소개가 없습니다."}
      </Text>

      <View style={styles.profileSettingContainer}>
        <Pressable
          style={styles.profileEditContainer}
          onPress={() => navigation.navigate(RootRoutes.PROFILE_EDIT)}
        >
          <Ionicons name="settings-outline" size={20} color="white" />
          <Text style={styles.profileEditText}>프로필 수정</Text>
        </Pressable>
        <View style={styles.profilePrivateContainer}>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ true: GRAY.DEFAULT_1, false: GRAY.MEDIUM }}
            thumbColor={WHITE}
            style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
          />
          <Text style={styles.profilePrivateText}>프로필 비공개</Text>
        </View>
      </View>

      {hasSections && <View style={styles.sectionDivider} />}

      <EducationSection entries={educationEntries} />
      <CareerSection entries={careerEntries} />
      <AwardSection entries={awardEntries} />
      <CertificateSection entries={certificateEntries} />
    </View>
  );
};

export default Profile;
