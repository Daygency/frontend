import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Keyboard,
  KeyboardEvent,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DEFAULT_USER_PROFILE_IMAGE } from "../../lib/media/defaultUserProfileImage";
import { MAIN, WHITE } from "../../color";
import {
  getMyProfile,
  pickFollowCountsFromApiJson,
} from "../../lib/apis/portfolio/profileApi";
import type {
  EducationEntry,
  CareerEntry,
  AwardEntry,
  CertificateEntry,
} from "../../lib/apis/portfolio/types";
import { getProfileCache, saveProfileCache } from "../../lib/profileCache";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../lib/apis/portfolio/profileUpdate";
import {
  toOptionalIsoDate,
  yearMonthFromApiDate,
} from "../../lib/profile/profileEntryDates";
import type { ProfileUpdateRequestDto } from "../../lib/apis/portfolio/dto/update-profile.dto";
import { isDupActivityName } from "../../lib/apis/portfolio/IsDupActivityName";
import { getMajors, type Major } from "../../lib/apis/announcement/majorApi";
import { resolveProfileMajorUuid } from "../../lib/profile/resolveProfileMajorUuid";
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
  const { user } = useAuth();
  const scrollRef = useRef<KeyboardAwareScrollView | null>(null);

  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "top", title: "상단소개" },
    { key: "profile", title: "프로필" },
  ]);

  const [profile, setProfile] =
    useState<Awaited<ReturnType<typeof getMyProfile>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [activityName, setActivityName] = useState("");
  const [originalActivityName, setOriginalActivityName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [majorId, setMajorId] = useState<number | null>(null);
  const [major, setMajor] = useState<string>("");
  const [majorDetail, setMajorDetail] = useState<string>("");
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [careerList, setCareerList] = useState<CareerEntry[]>([]);
  const [awardList, setAwardList] = useState<AwardEntry[]>([]);
  const [certificateList, setCertificateList] = useState<CertificateEntry[]>(
    [],
  );
  const [isPortfolioPrivate, setIsPortfolioPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pickedProfileImageUri, setPickedProfileImageUri] = useState<string | null>(
    null,
  );
  const [profileImageClearRequested, setProfileImageClearRequested] =
    useState(false);
  const [isProfileEntryEditingFocused, setIsProfileEntryEditingFocused] =
    useState(false);
  const [isTopCustomMajorFocused, setIsTopCustomMajorFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [majorCatalog, setMajorCatalog] = useState<Major[]>([]);

  useEffect(() => {
    void getMajors().then(setMajorCatalog);
  }, []);

  const handleProfileEntryFocusChange = (
    focused: boolean,
    inputNode?: number | null,
    actionRowNode?: number | null,
  ) => {
    setIsProfileEntryEditingFocused(focused);
    if (!focused || !inputNode) return;
    setTimeout(() => {
      scrollRef.current?.scrollToFocusedInput(inputNode);
      if (actionRowNode) {
        setTimeout(() => {
          scrollRef.current?.scrollToFocusedInput(actionRowNode);
        }, 90);
      }
    }, 60);
  };

  const handleTopCustomMajorFocusChange = (
    focused: boolean,
    inputNode?: number | null,
  ) => {
    setIsTopCustomMajorFocused(focused);
    if (!focused || !inputNode) return;
    setTimeout(() => {
      scrollRef.current?.scrollToFocusedInput(inputNode);
    }, 60);
  };

  useEffect(() => {
    const onShow = (e: KeyboardEvent) =>
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    const onHide = () => setKeyboardHeight(0);
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
    setName(p.name || user?.name || "");
    const initialActivityName = p.activityName || "";
    setActivityName(initialActivityName);
    setOriginalActivityName(initialActivityName);
    setAboutMe(p.aboutMe || "");
    setIsPortfolioPrivate(Boolean((p as { isPortfolioPrivate?: boolean }).isPortfolioPrivate));

    const majorObj = (p as { major?: { majorId?: string; name?: string } | null })
      .major;
    if (majorObj && typeof majorObj === "object" && majorObj.name) {
      const majorName = String(majorObj.name).trim();
      setMajor(majorName);
      const matchedOption = MAJOR_OPTIONS.find(
        (option) => option.label === majorName,
      );
      setMajorId(matchedOption?.id ?? null);
    } else if (typeof (p as { major?: string }).major === "string") {
      const majorName = String((p as { major?: string }).major).trim();
      setMajor(majorName);
      const matchedOption = MAJOR_OPTIONS.find(
        (option) => option.label === majorName,
      );
      setMajorId(matchedOption?.id ?? null);
    } else {
      setMajor("");
      setMajorId(null);
    }
    setMajorDetail(
      String(
        (p as { majorDetail?: string | null }).majorDetail ??
          (p as { major_detail?: string | null }).major_detail ??
          "",
      ),
    );
    const rawEducations =
      (p as any).educations ?? (p as any).educationEntries ?? [];
    setEducationList(
      rawEducations.map((e: any) => {
        const start = yearMonthFromApiDate(e.startedAt);
        const end = yearMonthFromApiDate(e.endedAt);
        return {
          id:
            e.educationId ??
            `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          educationId: e.educationId,
          description: e.description ?? "",
          startYear: start.year,
          startMonth: start.month,
          endYear: end.year,
          endMonth: end.month,
          isOngoing: Boolean(e.isOngoing),
        };
      }),
    );
    const rawCareers = (p as any).careers ?? (p as any).careerEntries ?? [];
    setCareerList(
      rawCareers.map((c: any) => {
        const start = yearMonthFromApiDate(c.startedAt);
        const end = yearMonthFromApiDate(c.endedAt);
        return {
          id:
            c.careerId ??
            `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          careerId: c.careerId,
          description: c.description ?? "",
          startYear: start.year,
          startMonth: start.month,
          endYear: end.year,
          endMonth: end.month,
          isOngoing: Boolean(c.isOngoing),
        };
      }),
    );
    const rawAwards = (p as any).awards ?? (p as any).awardEntries ?? [];
    setAwardList(
      rawAwards.map((a: any) => {
        const d = yearMonthFromApiDate(a.awardedAt);
        return {
          id: a.awardId ?? newTempId(),
          awardId: a.awardId,
          description: a.description ?? "",
          year: d.year,
          month: d.month,
        };
      }),
    );
    setCertificateList(mapCertificatesFromApi(p));
  };

  function mapCertificatesFromApi(
    p: NonNullable<Awaited<ReturnType<typeof getMyProfile>>>,
  ): CertificateEntry[] {
    const raw = (p as any).certificates ?? p.certificateEntries ?? [];
    if (!Array.isArray(raw)) return [];
    return raw.map((c: any) => {
      const d = yearMonthFromApiDate(c.obtainedAt);
      return {
        id: c.certificateId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        certificateId: c.certificateId,
        description: c.description ?? "",
        year: c.year ?? d.year,
        month: c.month ?? d.month,
      };
    });
  }

  const rawProfileImgUrl = profile?.profileImgUrl || user?.profileImgUrl;
  const displayProfileImgUrl = profileImageClearRequested
    ? null
    : pickedProfileImageUri
      ? pickedProfileImageUri
      : isValidImageSource(rawProfileImgUrl)
        ? toDisplayImageUri(rawProfileImgUrl)
        : null;
  const hasCustomProfileImage =
    !profileImageClearRequested &&
    Boolean(
      pickedProfileImageUri ||
        isValidImageSource(rawProfileImgUrl),
    );

  const pickProfileImageFromLibrary = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "앨범 접근 권한이 필요합니다.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]?.uri) return;
      setProfileImageClearRequested(false);
      setPickedProfileImageUri(result.assets[0].uri);
    } catch (e) {
      console.warn("[pickProfileImageFromLibrary]", e);
      Alert.alert("알림", "이미지 선택에 실패했습니다.");
    }
  };

  const handleProfileImagePress = () => {
    Alert.alert(
      "프로필 사진",
      undefined,
      [
        {
          text: "사진 변경",
          onPress: () => void pickProfileImageFromLibrary(),
        },
        ...(hasCustomProfileImage
          ? [
              {
                text: "기본 이미지로 변경",
                style: "destructive" as const,
                onPress: () => {
                  setPickedProfileImageUri(null);
                  setProfileImageClearRequested(true);
                },
              },
            ]
          : []),
        { text: "취소", style: "cancel" },
      ],
    );
  };

  const renderTabBar = () => (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarRow}>
        {routes.map((route, i) => (
          <Pressable
            key={route.key}
            style={[
              styles.tabButton,
              i === 0 ? styles.tabButtonLeft : styles.tabButtonRight,
              i === tabIndex
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
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
    </View>
  );

  const renderScene = ({ route }: { route: { key: string } }) => {
    if (route.key === "top") {
      return (
        <TopIntroductionTab
          name={name}
          setName={setName}
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
          isPortfolioPrivate={isPortfolioPrivate}
          setIsPortfolioPrivate={setIsPortfolioPrivate}
          onCustomMajorFocusChange={handleTopCustomMajorFocusChange}
        />
      );
    }
    if (route.key === "profile") {
      return (
        <ProfileTab
          educationList={educationList}
          setEducationList={setEducationList}
          careerList={careerList}
          setCareerList={setCareerList}
          awardList={awardList}
          setAwardList={setAwardList}
          certificateList={certificateList}
          setCertificateList={setCertificateList}
          onEditingFocusChange={handleProfileEntryFocusChange}
        />
      );
    }
    return null;
  };

  const persistToCache = async () => {
    if (!profile) return;
    await saveProfileCache({
      ...profile,
      name,
      activityName,
      aboutMe,
      major,
      majorDetail,
      isPortfolioPrivate,
      educationEntries: educationList,
      careerEntries: careerList,
      awardEntries: awardList,
      certificateEntries: certificateList,
    });
  };

  const newTempId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const mapEducationPayload = (e: EducationEntry) => ({
    ...(e.educationId ? { educationId: e.educationId } : {}),
    description: e.description,
    startedAt: toOptionalIsoDate(e.startYear, e.startMonth),
    endedAt: e.isOngoing
      ? null
      : toOptionalIsoDate(e.endYear, e.endMonth),
    isOngoing: e.isOngoing ?? false,
  });

  const mapCareerPayload = (c: CareerEntry) => ({
    ...(c.careerId ? { careerId: c.careerId } : {}),
    description: c.description,
    startedAt: toOptionalIsoDate(c.startYear, c.startMonth),
    endedAt: c.isOngoing
      ? null
      : toOptionalIsoDate(c.endYear, c.endMonth),
    isOngoing: c.isOngoing ?? false,
  });

  const mapAwardPayload = (a: AwardEntry) => ({
    description: a.description,
    awardedAt: toOptionalIsoDate(a.year, a.month),
  });

  const mapCertificatePayload = (c: CertificateEntry) => ({
    ...(c.certificateId ? { certificateId: c.certificateId } : {}),
    description: c.description,
    obtainedAt: toOptionalIsoDate(c.year, c.month),
  });

  const buildUpdatePayload = (): ProfileUpdateRequestDto | null => {
    if (!profile) return null;

    const current: any = profile;

    const basePayload: ProfileUpdateRequestDto = {
      name: current.name,
      activityName: current.activityName,
      aboutMe: current.aboutMe,
      role: current.role,
      email: current.contact?.email,
      phoneNumber: current.contact?.phoneNumber,
      artTempo: current.artTempo,
      profileImgUrl: current.profileImgUrl,
      isEmailSubscribed: current.isEmailSubscribed,
      isPushEnabled: current.isPushEnabled,
      isPortfolioPrivate: Boolean(current.isPortfolioPrivate),
      socialId: current.socialId,
      educations: (current.educationEntries ?? []).map((e: any) =>
        mapEducationPayload(e),
      ),
      careers: (current.careerEntries ?? []).map((c: any) =>
        mapCareerPayload(c),
      ),
      awards: (current.awardEntries ?? []).map((a: any) =>
        mapAwardPayload(a),
      ),
      majorId:
        (typeof current.major === "object" && current.major?.majorId
          ? String(current.major.majorId)
          : null) ?? null,
      majorDetail: String(current.majorDetail ?? current.major_detail ?? ""),
      certificates: (current.certificateEntries ?? []).map((c: any) =>
        mapCertificatePayload(c),
      ),
    };

    const fullPayload: ProfileUpdateRequestDto = {
      name,
      activityName,
      aboutMe,
      role: current.role ?? "user",
      email: current.contact?.email ?? (user as any)?.email ?? "",
      phoneNumber:
        current.contact?.phoneNumber ?? (user as any)?.phoneNumber ?? "",
      artTempo: current.artTempo ?? 0,
      profileImgUrl:
        current.profileImgUrl ?? (user as any)?.profileImgUrl ?? "",
      isEmailSubscribed: current.isEmailSubscribed ?? false,
      isPushEnabled: current.isPushEnabled ?? false,
      isPortfolioPrivate,
      socialId: current.socialId ?? "",
      educations: educationList.map(mapEducationPayload),
      careers: careerList.map(mapCareerPayload),
      awards: awardList.map(mapAwardPayload),
      majorId: resolveProfileMajorUuid(major, majorCatalog) ?? null,
      majorDetail: majorDetail.trim() || undefined,
      certificates: certificateList.map(mapCertificatePayload),
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
    const hasProfileImage = Boolean(pickedProfileImageUri);
    const shouldClearProfileImage = profileImageClearRequested;

    if (submitting) {
      return;
    }

    if (!payload && !hasProfileImage && !shouldClearProfileImage) {
      console.log(
        "[ProfileEditScreen] early return (no payload or profile image)",
      );
      await persistToCache();
      navigation.goBack();
      return;
    }

    try {
      setSubmitting(true);
      console.log(
        "[ProfileEditScreen] update payload:",
        JSON.stringify(payload ?? {}),
      );
      const imageOptions = hasProfileImage
        ? {
            profileImageUri: pickedProfileImageUri!,
            profileImageName: "profile.jpg",
            profileImageType: "image/jpeg",
          }
        : undefined;
      const updateBody: ProfileUpdateRequestDto = {
        ...(payload ?? {}),
        ...(shouldClearProfileImage ? { profileImgUrl: "" } : {}),
      };
      const updated = await updateProfile(updateBody, imageOptions);
      if (!updated) {
        await persistToCache();
        return;
      }

      // 성공 후 서버에서 최신 프로필을 다시 받아 캐시 동기화 (DB 반영/조회까지 확실히)
      const fresh = await getMyProfile().catch(() => null);
      if (fresh) {
        await saveProfileCache(fresh as any);
      } else {
        const patchCounts = pickFollowCountsFromApiJson(
          updated as Record<string, unknown>,
        );
        const updatedProfileForCache: any = {
          ...(profile as any),
          ...(updated as any),
          ...patchCounts,
          name,
          activityName,
          aboutMe,
          majorId,
          major,
          majorDetail,
          isPortfolioPrivate,
          educationEntries: educationList,
          careerEntries: careerList,
          awardEntries: awardList,
          certificateEntries: certificateList,
        };
        await saveProfileCache(updatedProfileForCache);
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
    <View style={styles.container}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={styles.tabView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraHeight={
          tabIndex === 1 && isProfileEntryEditingFocused
            ? Math.max(110, Math.floor(keyboardHeight * 0.34))
            : tabIndex === 0 && isTopCustomMajorFocused
              ? Math.max(90, Math.floor(keyboardHeight * 0.24))
              : Platform.OS === "ios"
                ? 36
                : 56
        }
        extraScrollHeight={
          tabIndex === 1 && isProfileEntryEditingFocused
            ? Math.max(100, Math.floor(keyboardHeight * 0.28))
            : tabIndex === 0 && isTopCustomMajorFocused
              ? Math.max(80, Math.floor(keyboardHeight * 0.2))
              : Platform.OS === "ios"
                ? 24
                : 36
        }
        keyboardOpeningTime={250}
        enableResetScrollToCoords
        stickyHeaderIndices={[1]}
      >
        {/* 프로필 이미지 */}
        <Pressable style={styles.profileImageSection} onPress={handleProfileImagePress}>
          <View style={styles.profileImageWrapper}>
            {displayProfileImgUrl ? (
              <Image
                source={{ uri: displayProfileImgUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={DEFAULT_USER_PROFILE_IMAGE}
                style={styles.profileImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.profileImageEditButton}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={18}
                color={WHITE}
              />
            </View>
          </View>
          <Text style={styles.profileImageChangeText}>
            {profileImageClearRequested ? "기본 이미지로 변경됨" : "사진 변경"}
          </Text>
        </Pressable>

        {/* 탭 */}
        {renderTabBar()}

        {renderScene({ route: routes[tabIndex] })}
      </KeyboardAwareScrollView>

      {/* 수정 완료 버튼 */}
      <View style={styles.buttonContainer}>
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
  );
};

export default ProfileEditScreen;
