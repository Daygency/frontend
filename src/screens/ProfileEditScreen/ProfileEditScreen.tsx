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
} from "react-native";
import { TabView } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../color";
import { getMyProfile } from "../../lib/profileApi";
import type {
  EducationEntry,
  CareerEntry,
  AwardEntry,
  CertificateEntry,
} from "../../lib/profileApi";
import { getProfileCache, saveProfileCache } from "../../lib/profileCache";
import { useAuth } from "../../contexts/AuthContext";
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
  const [activityId, setActivityId] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [careerList, setCareerList] = useState<CareerEntry[]>([]);
  const [awardList, setAwardList] = useState<AwardEntry[]>([]);
  const [certificateList, setCertificateList] = useState<CertificateEntry[]>([]);

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

    return () => { cancelled = true; };
  }, []);

  const populateForm = (p: Awaited<ReturnType<typeof getMyProfile>>) => {
    if (!p) return;
    setNickname(p.nickname || user?.nickname || "");
    setActivityId("");
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
          activityId={activityId}
          setActivityId={setActivityId}
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

  const handleComplete = async () => {
    await persistToCache();
    navigation.goBack();
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
          <Pressable style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>수정 완료</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileEditScreen;
