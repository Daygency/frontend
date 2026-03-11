import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../color";
import { getMyProfile } from "../../lib/apis/portfolio/profileApi";
import type {
  EducationEntry,
  CareerEntry,
  AwardEntry,
  CertificateEntry,
} from "../../lib/apis/portfolio/types";
import { getProfileCache, saveProfileCache } from "../../lib/profileCache";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../lib/apis/portfolio/profileUpdate";
import type { ProfileUpdateRequestDto } from "../../lib/apis/portfolio/dto/update-profile.dto";
import { isDupActivityName } from "../../lib/apis/portfolio/IsDupActivityName";
import TopIntroductionTab from "./components/TopIntroductionTab";
import ProfileTab from "./components/ProfileTab";
import styles from "./styles";

const isValidImageSource = (uri: string | undefined): boolean =>
  !!uri?.trim() &&
  (uri.startsWith("http://") ||
    uri.startsWith("https://") ||
    uri.startsWith("file://"));

const toDisplayImageUri = (uri: string | undefined): string | null => {
  const trimmed = uri?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://"))
    return trimmed.replace("http://", "https://");
  return trimmed;
};

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const { user } = useAuth();

  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "top", title: "상단소개" },
    { key: "profile", title: "프로필" },
  ]);

  const [profile, setProfile] =
    useState<Awaited<ReturnType<typeof getMyProfile>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [nickname, setNickname] = useState("");
  const [activityName, setActivityName] = useState("");
  const [originalActivityName, setOriginalActivityName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [careerList, setCareerList] = useState<CareerEntry[]>([]);
  const [awardList, setAwardList] = useState<AwardEntry[]>([]);
  const [certificateList, setCertificateList] = useState<CertificateEntry[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const apiResponded = { current: false };

    getProfileCache().then((cached) => {
      if (!cancelled && cached && !apiResponded.current) {
        setProfile(cached);
        populateForm(cached);
        setIsLoading(false);
      }
    });

    getMyProfile().then((data) => {
      if (!cancelled) {
        apiResponded.current = true;
        if (data) saveProfileCache(data);
        setProfile(data);
        populateForm(data);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const populateForm = (p: Awaited<ReturnType<typeof getMyProfile>>) => {
    if (!p) return;
    console.log(
      "[ProfileEditScreen] populateForm activityName:",
      p.activityName,
    );
    setNickname(p.nickname || user?.nickname || "");
    const initialActivityName = p.activityName || "";
    setActivityName(initialActivityName);
    setOriginalActivityName(initialActivityName);
    setAboutMe(p.aboutMe || "");
    setEducationList(p.educationEntries ?? []);
    setCareerList(p.careerEntries ?? []);
    setAwardList(p.awardEntries ?? []);
    setCertificateList(p.certificateEntries ?? []);
  };

  const rawProfileImgUrl = profile?.profileImgUrl || user?.profileImgUrl;
  const displayProfileImgUrl = isValidImageSource(rawProfileImgUrl)
    ? toDisplayImageUri(rawProfileImgUrl)
    : null;

  const renderTabBar = () => (
    <View style={styles.tabBarContainer}>
      {routes.map((route, i) => (
        <Pressable
          key={route.key}
          style={[
            styles.tabButton,
            i === tabIndex ? styles.tabButtonActive : styles.tabButtonInactive,
          ]}
          onPress={() => setTabIndex(i)}
        >
          <Text
            style={[
              styles.tabButtonText,
              i === tabIndex
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive,
            ]}
          >
            {route.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const renderScene = ({ route }: { route: { key: string } }) => {
    if (route.key === "top") {
      return (
        <TopIntroductionTab
          nickname={nickname}
          setNickname={setNickname}
          activityName={activityName}
          setActivityName={setActivityName}
          originalActivityName={originalActivityName}
          aboutMe={aboutMe}
          setAboutMe={setAboutMe}
        />
      );
    }
    if (route.key === "profile") {
      return (
        <ProfileTab
          aboutMe={aboutMe}
          setAboutMe={setAboutMe}
          educationList={educationList}
          setEducationList={setEducationList}
          careerList={careerList}
          setCareerList={setCareerList}
          awardList={awardList}
          setAwardList={setAwardList}
          certificateList={certificateList}
          setCertificateList={setCertificateList}
        />
      );
    }
    return null;
  };

  const persistToCache = async () => {
    if (!profile) return;
    await saveProfileCache({
      ...profile,
      nickname,
      activityName,
      aboutMe,
      educationEntries: educationList,
      careerEntries: careerList,
      awardEntries: awardList,
      certificateEntries: certificateList,
    });
  };

  const handlePreview = async () => {
    await persistToCache();
    navigation.goBack();
  };

  const toDate = (year: string, month: string): Date => {
    const y = Number(year || new Date().getFullYear());
    const m = Number(month || 1);
    return new Date(y, m - 1, 1);
  };

  const buildUpdatePayload = (): ProfileUpdateRequestDto | null => {
    if (!profile) return null;

    const current: any = profile;

    return {
      nickname,
      activityName,
      aboutMe,
      selfIntroduction: aboutMe,
      role: current.role ?? "user",
      email: current.contact?.email ?? (user as any)?.email ?? "",
      phoneNumber:
        current.contact?.phoneNumber ?? (user as any)?.phoneNumber ?? "",
      artTempo: current.artTempo ?? 0,
      profileImgUrl:
        current.profileImgUrl ?? (user as any)?.profileImgUrl ?? "",
      isEmailSubscribed: current.isEmailSubscribed ?? false,
      isPushEnabled: current.isPushEnabled ?? false,
      socialId: current.socialId ?? "",
      educations: educationList.map((e) => ({
        discription: e.description,
        startedAt: toDate(e.startYear, e.startMonth),
        endedAt: toDate(e.endYear, e.endMonth),
      })),
      careers: careerList.map((c) => ({
        discription: c.description,
        startedAt: toDate(c.startYear, c.startMonth),
        endedAt: toDate(c.endYear, c.endMonth),
      })),
      awards: awardList.map((a) => ({
        discription: a.description,
        awardedAt: toDate(a.year, a.month),
      })),
      certificates: certificateList.map((c) => ({
        description: c.description,
        obtainedAt: toDate(c.year, c.month),
      })),
    };
  };

  const handleComplete = async () => {
    if (activityName.trim()) {
      const isDup = await isDupActivityName(activityName.trim());
      if (isDup) {
        Alert.alert(
          "활동 아이디 중복",
          "이미 사용 중인 활동 아이디입니다. 다른 아이디를 입력해주세요.",
        );
        return;
      }
    }

    const payload = buildUpdatePayload();
    if (!payload || submitting) {
      await persistToCache();
      navigation.goBack();
      return;
    }

    try {
      setSubmitting(true);
      const updated = await updateProfile(payload);
      if (updated) {
        await saveProfileCache(updated);
      } else {
        await persistToCache();
      }
    } finally {
      setSubmitting(false);
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* 프로필 이미지 */}
      <View style={styles.profileImageSection}>
        <View style={styles.profileImageWrapper}>
          {displayProfileImgUrl ? (
            <Image
              source={{ uri: displayProfileImgUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <MaterialCommunityIcons
                name="account"
                size={48}
                color={GRAY.DARK_2}
              />
            </View>
          )}
          <Pressable style={styles.profileImageEditButton}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={20}
              color={WHITE}
            />
          </Pressable>
        </View>
      </View>

      {/* 탭 */}
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        swipeEnabled={false}
      />

      {/* 수정 완료 버튼 */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Pressable style={styles.previewButton} onPress={handlePreview}>
            <Text style={styles.previewButtonText}>미리보기</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={handleComplete}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? "저장 중..." : "수정 완료"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileEditScreen;
