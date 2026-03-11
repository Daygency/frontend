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
import { MAJOR_OPTIONS } from "../../constants/majors";
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
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [majorId, setMajorId] = useState<number | null>(null);
  const [major, setMajor] = useState<string>("");
  const [majorDetail, setMajorDetail] = useState<string>("");
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
    setSelfIntroduction((p as any).selfIntroduction || "");

    const backendMajorId = (p as any).majorId as number | undefined;
    if (typeof backendMajorId === "number") {
      setMajorId(backendMajorId);
      const matchedOption = MAJOR_OPTIONS.find(
        (option) => option.id === backendMajorId,
      );
      setMajor(matchedOption?.label || ((p as any).major as string) || "");
    } else {
      const majorName = ((p as any).major as string) || "";
      setMajor(majorName);
      const matchedOption = MAJOR_OPTIONS.find(
        (option) => option.label === majorName,
      );
      setMajorId(matchedOption?.id ?? null);
    }
    setMajorDetail(((p as any).majorDetail as string) || "");
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
          majorId={majorId}
          setMajorId={setMajorId}
          major={major}
          setMajor={setMajor}
          majorDetail={majorDetail}
          setMajorDetail={setMajorDetail}
        />
      );
    }
    if (route.key === "profile") {
      return (
        <ProfileTab
          aboutMe={selfIntroduction}
          setAboutMe={setSelfIntroduction}
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
      selfIntroduction,
      majorId,
      major,
      majorDetail,
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

    const basePayload: ProfileUpdateRequestDto = {
      nickname: current.nickname,
      activityName: current.activityName,
      aboutMe: current.aboutMe,
      selfIntroduction: (current as any).selfIntroduction,
      role: current.role,
      email: current.contact?.email,
      phoneNumber: current.contact?.phoneNumber,
      artTempo: current.artTempo,
      profileImgUrl: current.profileImgUrl,
      isEmailSubscribed: current.isEmailSubscribed,
      isPushEnabled: current.isPushEnabled,
      socialId: current.socialId,
      educations: (current.educationEntries ?? []).map((e: any) => ({
        discription: e.description,
        startedAt: toDate(e.startYear, e.startMonth),
        endedAt: toDate(e.endYear, e.endMonth),
      })),
      careers: (current.careerEntries ?? []).map((c: any) => ({
        discription: c.description,
        startedAt: toDate(c.startYear, c.startMonth),
        endedAt: toDate(c.endYear, c.endMonth),
      })),
      awards: (current.awardEntries ?? []).map((a: any) => ({
        discription: a.description,
        awardedAt: toDate(a.year, a.month),
      })),
      majorId: (current as any).majorId ?? null,
      majorDetail: (current as any).majorDetail,
      certificates: (current.certificateEntries ?? []).map((c: any) => ({
        description: c.description,
        obtainedAt: toDate(c.year, c.month),
      })),
    };

    const fullPayload: ProfileUpdateRequestDto = {
      nickname,
      activityName,
      aboutMe,
      selfIntroduction,
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
        description: e.description,
        startedAt: toDate(e.startYear, e.startMonth),
        endedAt: toDate(e.endYear, e.endMonth),
      })),
      careers: careerList.map((c) => ({
        description: c.description,
        startedAt: toDate(c.startYear, c.startMonth),
        endedAt: toDate(c.endYear, c.endMonth),
      })),
      awards: awardList.map((a) => ({
        description: a.description,
        awardedAt: toDate(a.year, a.month),
      })),
      majorId: majorId ?? null,
      majorDetail,
      certificates: certificateList.map((c) => ({
        description: c.description,
        obtainedAt: toDate(c.year, c.month),
      })),
    };

    const diff: ProfileUpdateRequestDto = {};

    (Object.keys(fullPayload) as (keyof ProfileUpdateRequestDto)[]).forEach(
      (key) => {
        const nextValue = fullPayload[key];
        const prevValue = basePayload[key];

        const bothUndefined =
          typeof nextValue === "undefined" && typeof prevValue === "undefined";
        if (bothUndefined) return;

        const isComplex =
          nextValue instanceof Date ||
          prevValue instanceof Date ||
          Array.isArray(nextValue) ||
          Array.isArray(prevValue) ||
          (typeof nextValue === "object" && nextValue !== null) ||
          (typeof prevValue === "object" && prevValue !== null);

        const isEqual = isComplex
          ? JSON.stringify(nextValue) === JSON.stringify(prevValue)
          : nextValue === prevValue;

        if (!isEqual) {
          (diff as any)[key] = nextValue;
        }
      },
    );

    if (Object.keys(diff).length === 0) {
      return null;
    }

    return diff;
  };

  const handleComplete = async () => {
    console.log("[ProfileEditScreen] handleComplete pressed", {
      submitting,
      activityName,
      originalActivityName,
    });

    const trimmedActivityName = activityName.trim();
    const trimmedOriginalActivityName = originalActivityName.trim();

    // 활동 아이디를 변경했을 때만 중복 검사
    if (
      trimmedActivityName &&
      trimmedActivityName !== trimmedOriginalActivityName
    ) {
      const isDup = await isDupActivityName(trimmedActivityName);
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
      console.log(
        "[ProfileEditScreen] early return (no payload or submitting)",
        {
          hasPayload: !!payload,
          submitting,
        },
      );
      await persistToCache();
      navigation.goBack();
      return;
    }

    try {
      setSubmitting(true);
      console.log(
        "[ProfileEditScreen] update payload:",
        JSON.stringify(payload),
      );
      const updated = await updateProfile(payload);
      if (updated) {
        const updatedProfileForCache: any = {
          ...(profile as any),
          ...(updated as any),
          nickname,
          activityName,
          aboutMe,
          selfIntroduction,
          majorId,
          major,
          majorDetail,
          educationEntries: educationList,
          careerEntries: careerList,
          awardEntries: awardList,
          certificateEntries: certificateList,
        };
        await saveProfileCache(updatedProfileForCache);
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
