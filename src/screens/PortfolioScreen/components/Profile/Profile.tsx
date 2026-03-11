import { View, Text, Switch, Pressable, Image, ActivityIndicator } from "react-native";
import styles from "./styles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../../color";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../../navigations/routes";
import { getMyProfile } from "../../../../lib/profileApi";

const ROLE_LABEL: Record<string, string> = {
  artist: "예술가",
  planner: "플래너",
};

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getMyProfile>>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);

  const followerCount = 100;
  const followingCount = 100;

  useEffect(() => {
    let cancelled = false;
    getMyProfile().then((data) => {
      if (!cancelled) {
        setProfile(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingVertical: 24, alignItems: "center" }]}>
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  const roleLabel = profile?.role ? ROLE_LABEL[profile.role] ?? profile.role : "";

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {profile?.profileImgUrl ? (
            <Image
              source={{ uri: profile.profileImgUrl }}
              style={{ width: 95, height: 95, borderRadius: 50 }}
              resizeMode="cover"
            />
          ) : (
            <Text>사진</Text>
          )}
        </View>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>{profile?.nickname ?? "이름 없음"}</Text>
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
      <View style={styles.profileFollowingContainer}>
        <FontAwesome name="user-circle" size={15} color="black" />
        <Text>은정님이 팔로우 중</Text>
      </View>
      <Text style={styles.profileIntroduction}>
        {profile?.aboutMe ? profile.aboutMe : "소개가 없습니다."}
      </Text>
      <View style={styles.profileSettingContainer}>
        <View style={styles.profileEditContainer}>
          <Ionicons name="settings-outline" size={20} color="white" />
          <Text style={styles.profileEditText}>프로필 수정</Text>
        </View>
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
    </View>
  );
};

export default Profile;
