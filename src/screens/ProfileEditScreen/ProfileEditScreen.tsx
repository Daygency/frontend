import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
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
import {
  getProfileCache,
  saveProfileCache,
} from "../../lib/profileCache";
import { useAuth } from "../../contexts/AuthContext";
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

/** 상단소개 탭 - 이름, 활동 아이디, 전공, 한 줄 소개 */
const TopIntroductionTab = ({
  nickname,
  setNickname,
  activityId,
  setActivityId,
  aboutMe,
  setAboutMe,
}: {
  nickname: string;
  setNickname: (v: string) => void;
  activityId: string;
  setActivityId: (v: string) => void;
  aboutMe: string;
  setAboutMe: (v: string) => void;
}) => (
  <ScrollView
    style={styles.tabContent}
    contentContainerStyle={styles.tabContentContainer}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.field}>
      <Text style={styles.label}>이름 *</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="이름을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>활동 아이디 *</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={activityId}
          onChangeText={setActivityId}
          placeholder="활동 아이디를 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
          autoCapitalize="none"
        />
        <MaterialCommunityIcons
          name="check-circle"
          size={24}
          color={activityId ? "#4CAF50" : GRAY.DARK_2}
          style={styles.checkIcon}
        />
      </View>
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>전공/세부전공</Text>
      <Pressable style={[styles.input, styles.selectInput]}>
        <Text style={styles.placeholder}>전공을 선택하세요</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={GRAY.DARK_2}
        />
      </Pressable>
      <TextInput
        style={styles.input}
        value=""
        placeholder="세부 전공을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>한 줄 소개</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={aboutMe}
        onChangeText={setAboutMe}
        placeholder="한 줄 소개를 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={3}
      />
    </View>
  </ScrollView>
);

/** 프로필 탭 - 소개, 학력, 경력 등 */
const ProfileTab = ({
  aboutMe,
  setAboutMe,
  education,
  setEducation,
  career,
  setCareer,
  awards,
  setAwards,
}: {
  aboutMe: string;
  setAboutMe: (v: string) => void;
  education: string;
  setEducation: (v: string) => void;
  career: string;
  setCareer: (v: string) => void;
  awards: string;
  setAwards: (v: string) => void;
}) => (
  <ScrollView
    style={styles.tabContent}
    contentContainerStyle={styles.tabContentContainer}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.field}>
      <Text style={styles.label}>소개</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={aboutMe}
        onChangeText={setAboutMe}
        placeholder="소개를 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={5}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>학력</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={education}
        onChangeText={setEducation}
        placeholder="학력을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={4}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>경력</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={career}
        onChangeText={setCareer}
        placeholder="경력을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={4}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>수상 경력</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={awards}
        onChangeText={setAwards}
        placeholder="수상 경력을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={3}
      />
    </View>
  </ScrollView>
);

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
  const [education, setEducation] = useState("");
  const [career, setCareer] = useState("");
  const [awards, setAwards] = useState("");

  useEffect(() => {
    let cancelled = false;
    const apiResponded = { current: false };

    getProfileCache().then((cached) => {
      if (!cancelled && cached && !apiResponded.current) {
        setProfile(cached);
        setFormFromProfile(cached);
        setIsLoading(false);
      }
    });

    getMyProfile().then((data) => {
      if (!cancelled) {
        apiResponded.current = true;
        if (data) saveProfileCache(data);
        setProfile(data);
        setFormFromProfile(data);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setFormFromProfile = (p: Awaited<ReturnType<typeof getMyProfile>>) => {
    if (!p) return;
    setNickname(p.nickname || user?.nickname || "");
    setActivityId(""); // API에 활동 아이디 없음 - 추후 추가 시 매핑
    setAboutMe(p.aboutMe || "");
    setEducation(p.education || "");
    setCareer(p.career || "");
    setAwards(p.awards || "");
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
              i === tabIndex ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
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
          education={education}
          setEducation={setEducation}
          career={career}
          setCareer={setCareer}
          awards={awards}
          setAwards={setAwards}
        />
      );
    }
    return null;
  };

  const handleComplete = () => {
    // TODO: 저장 API 연동
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

      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        swipeEnabled={false}
      />

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>수정 완료</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileEditScreen;
