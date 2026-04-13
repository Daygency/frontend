import {
  View,
  Text,
  Switch,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../../color";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../../navigations/routes";
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
import { useAuth } from "../../../../contexts/AuthContext";
import {
  followUser,
  unfollowUser,
  checkIsUserInMyFollowingList,
} from "../../../../lib/apis/follow/followApi";
import { createCoffeeRoom } from "../../../../lib/apis/chat/chatApi";
import { chatRoomItemToParams } from "../../../../lib/chat/chatRoomNavigation";
import { resolveProfileImageUrlForDisplay } from "../../../../lib/chat/resolveProfileImageUrl";
import type { ChatRoomParams } from "../../../ChatScreens/ChatRoomScreen/ChatRoomScreen";

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

type LoadedProfile = ProfileResponseDto | PublicProfileResponseDto;

function safeFollowCount(n: unknown): number {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x) || x < 0) return 0;
  return Math.floor(x);
}

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const isArtistPortfolio =
    route.name === RootRoutes.ARTIST_PORTFOLIO;
  const isOtherProfile = Boolean(viewingUserId);
  /** 아티스트 포트폴리오로 열렸는데 userId 없음 */
  const isInvalidOtherRoute = isArtistPortfolio && !viewingUserId;

  const { user, isLoggedIn } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";
  const [profile, setProfile] = useState<LoadedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const displayNickname =
    profile?.nickname || (!isOtherProfile ? user?.nickname : "") || "이름 없음";
  const rawProfileImgUrl =
    profile?.profileImgUrl ||
    (!isOtherProfile ? user?.profileImgUrl : undefined);
  const displayProfileImgUrl =
    isValidImageSource(rawProfileImgUrl) && !imageError
      ? toDisplayImageUri(rawProfileImgUrl)
      : null;

  const followerCount = safeFollowCount(
    (profile as ProfileResponseDto)?.followerCount ??
      (profile as PublicProfileResponseDto)?.followerCount,
  );
  const followingCount = safeFollowCount(
    (profile as ProfileResponseDto)?.followingCount ??
      (profile as PublicProfileResponseDto)?.followingCount,
  );

  const publicProf = profile as PublicProfileResponseDto | null;
  const activityNameForChat =
    publicProf?.activityName?.trim() ||
    (profile as ProfileResponseDto)?.activityName?.trim() ||
    "";

  /** 타인 프로필에서 팔로우/채팅 (본인 제외) */
  const canSocialActions =
    isOtherProfile &&
    !!viewingUserId &&
    isLoggedIn &&
    !!myUserId &&
    viewingUserId !== myUserId;

  const onPressFollow = async () => {
    if (!canSocialActions || !viewingUserId || followLoading) {
      if (!isLoggedIn) {
        Alert.alert("로그인", "팔로우하려면 로그인해 주세요.");
      }
      return;
    }
    setFollowLoading(true);
    const res = await followUser(viewingUserId);
    setFollowLoading(false);
    if (res.ok) {
      setFollowing(true);
      if (!res.alreadyFollowing) {
        setProfile((prev) => {
          if (!prev) return prev;
          const p = prev as PublicProfileResponseDto;
          if (p.userId !== viewingUserId) return prev;
          return {
            ...p,
            followerCount: Math.max(0, safeFollowCount(p.followerCount) + 1),
          };
        });
      }
      const fresh = await getUserPublicProfile(viewingUserId);
      if (fresh) {
        setProfile(fresh);
        if (typeof fresh.isFollowing === "boolean") {
          setFollowing(fresh.isFollowing);
        } else if (canSocialActions) {
          const inferred = await checkIsUserInMyFollowingList(
            myUserId,
            viewingUserId,
          );
          if (typeof inferred === "boolean") setFollowing(inferred);
        }
      }
      return;
    }
    Alert.alert(
      "팔로우",
      res.message ?? `요청에 실패했습니다. (${res.status})`,
    );
  };

  const onPressUnfollow = () => {
    if (!canSocialActions || !viewingUserId || followLoading) return;
    Alert.alert("언팔로우", "이 사용자를 언팔로우할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "언팔로우",
        style: "destructive",
        onPress: async () => {
          setFollowLoading(true);
          const res = await unfollowUser(viewingUserId);
          setFollowLoading(false);
          if (res.ok) {
            setFollowing(false);
            if (res.status !== 404) {
              setProfile((prev) => {
                if (!prev) return prev;
                const p = prev as PublicProfileResponseDto;
                if (p.userId !== viewingUserId) return prev;
                return {
                  ...p,
                  followerCount: Math.max(
                    0,
                    safeFollowCount(p.followerCount) - 1,
                  ),
                };
              });
            }
            const fresh = await getUserPublicProfile(viewingUserId);
            if (fresh) {
              setProfile(fresh);
              if (typeof fresh.isFollowing === "boolean") {
                setFollowing(fresh.isFollowing);
              } else if (canSocialActions) {
                const inferred = await checkIsUserInMyFollowingList(
                  myUserId,
                  viewingUserId,
                );
                if (typeof inferred === "boolean") setFollowing(inferred);
              }
            }
            return;
          }
          Alert.alert(
            "언팔로우",
            res.message ?? `요청에 실패했습니다. (${res.status})`,
          );
        },
      },
    ]);
  };

  const navigateToFollowList = (tab: "following" | "followers") => {
    const uid = isOtherProfile ? viewingUserId : myUserId;
    if (!uid) {
      Alert.alert("알림", "사용자 정보를 찾을 수 없습니다.");
      return;
    }
    if (!isOtherProfile && (!isLoggedIn || !myUserId)) {
      Alert.alert("로그인", "내 팔로우 목록을 보려면 로그인해 주세요.");
      return;
    }
    navigation.navigate(RootRoutes.FOLLOW_LIST, {
      userId: uid,
      initialTab: tab,
      titleName: displayNickname,
    });
  };

  const onPressChat = async () => {
    if (!viewingUserId) return;
    if (!isLoggedIn) {
      Alert.alert("로그인", "채팅하려면 로그인해 주세요.");
      return;
    }
    if (viewingUserId === myUserId) {
      Alert.alert("채팅", "본인과는 채팅할 수 없습니다.");
      return;
    }
    if (chatLoading) return;
    setChatLoading(true);
    try {
      const room = await createCoffeeRoom(
        { peerUserId: viewingUserId },
        { myUserId },
      );
      setChatLoading(false);
      if (!room?.id) {
        Alert.alert(
          "채팅",
          "채팅방을 열 수 없습니다. 네트워크 또는 서버 응답을 확인해 주세요.",
        );
        return;
      }
      let params: ChatRoomParams = chatRoomItemToParams(room);
      if (!params.peerUserId) {
        params = {
          chatRoomId: room.id,
          peerUserId: viewingUserId,
          name: displayNickname,
          handle: activityNameForChat || viewingUserId.slice(0, 8),
          isOnline: false,
        };
      }
      const av = resolveProfileImageUrlForDisplay(rawProfileImgUrl);
      if (av) params = { ...params, peerAvatarUrl: av };
      navigation.navigate(RootRoutes.CHAT_ROOM, params);
    } catch {
      setChatLoading(false);
      Alert.alert("채팅", "채팅방을 열 수 없습니다.");
    }
  };

  /** 같은 화면에서 재포커스 시 전체 스피너 없이 새로고침 (팔로우 버튼이 안 바뀐 것처럼 보이는 문제 방지) */
  const profileFocusRef = useRef<{ scope: string; n: number }>({
    scope: "",
    n: 0,
  });

  const loadProfile = useCallback((opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    let cancelled = false;
    const apiResponded = { current: false };
    if (!silent) {
      setIsLoading(true);
    }
    setImageError(false);

    if (isInvalidOtherRoute) {
      setProfile(null);
      if (!silent) setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    if (isOtherProfile && viewingUserId) {
      getUserPublicProfile(viewingUserId).then(async (data) => {
        if (cancelled) return;
        apiResponded.current = true;
        setProfile(data);
        if (!silent) setIsLoading(false);

        const pub = data as PublicProfileResponseDto | null;
        if (pub && typeof pub.isFollowing === "boolean") {
          setFollowing(pub.isFollowing);
        } else if (
          data &&
          isLoggedIn &&
          myUserId &&
          viewingUserId &&
          myUserId !== viewingUserId
        ) {
          try {
            const inferred = await checkIsUserInMyFollowingList(
              myUserId,
              viewingUserId,
            );
            if (!cancelled && typeof inferred === "boolean") {
              setFollowing(inferred);
            }
          } catch {
            /* ignore */
          }
        }
      });
      return () => {
        cancelled = true;
      };
    }

    getProfileCache().then((cached) => {
      if (!cancelled && cached && !apiResponded.current) {
        setProfile(cached);
        if (!silent) setIsLoading(false);
      }
    });

    getMyProfile().then((data) => {
      if (!cancelled) {
        apiResponded.current = true;
        if (data) saveProfileCache(data);
        setProfile(data);
        if (!silent) setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    isOtherProfile,
    viewingUserId,
    isInvalidOtherRoute,
    isLoggedIn,
    myUserId,
  ]);

  useEffect(() => {
    if (!isOtherProfile) return;
    setProfile(null);
    setFollowing(false);
  }, [viewingUserId, isOtherProfile]);

  useFocusEffect(
    useCallback(() => {
      const scope = isOtherProfile ? viewingUserId : "__me__";
      if (profileFocusRef.current.scope !== scope) {
        profileFocusRef.current = { scope, n: 0 };
      }
      profileFocusRef.current.n += 1;
      const silent = profileFocusRef.current.n > 1;
      loadProfile({ silent });
      return () => {};
    }, [loadProfile, isOtherProfile, viewingUserId]),
  );

  useEffect(() => {
    setImageError(false);
  }, [rawProfileImgUrl]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingVertical: 0,
            paddingHorizontal: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: WHITE,
            zIndex: 999,
          },
        ]}
      >
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  if (isInvalidOtherRoute) {
    return (
      <View style={[styles.container, { paddingVertical: 16 }]}>
        <Text style={{ color: GRAY.DARK, textAlign: "center" }}>
          프로필을 불러올 수 없습니다. (userId 없음)
        </Text>
      </View>
    );
  }

  const roleLabel =
    profile?.role && profile.role !== "user"
      ? ROLE_LABEL[profile.role] ?? profile.role
      : "";

  const followerRow = (
    <View style={styles.profileFollowerRow}>
      <Pressable
        onPress={() => navigateToFollowList("followers")}
        style={styles.followStatHit}
        hitSlop={6}
      >
        <Text style={styles.followStatText}>팔로워 {followerCount}</Text>
      </Pressable>
      <Pressable
        onPress={() => navigateToFollowList("following")}
        style={styles.followStatHit}
        hitSlop={6}
      >
        <Text style={styles.followStatText}>팔로잉 {followingCount}</Text>
      </Pressable>
    </View>
  );

  const otherProfileFollowChat =
    isOtherProfile && !isInvalidOtherRoute ? (
      <View style={{ marginTop: 4 }}>
        {followerRow}
        <View style={styles.otherProfileActionsRow}>
          {followLoading ? (
            <View style={[styles.otherFollowBtn, { minWidth: 100 }]}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : following ? (
            <Pressable
              style={[styles.otherFollowBtn, styles.otherFollowBtnOutline]}
              onPress={onPressUnfollow}
            >
              <Text
                style={[
                  styles.otherFollowBtnText,
                  styles.otherFollowBtnTextOutline,
                ]}
              >
                팔로잉
              </Text>
            </Pressable>
          ) : (
            <Pressable style={styles.otherFollowBtn} onPress={onPressFollow}>
              <Text style={styles.otherFollowBtnText}>팔로우</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.otherChatBtn}
            onPress={onPressChat}
            disabled={chatLoading}
          >
            {chatLoading ? (
              <ActivityIndicator size="small" color="#111" />
            ) : (
              <Text style={styles.otherChatBtnText}>채팅</Text>
            )}
          </Pressable>
        </View>
      </View>
    ) : null;

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
            <View>
              <Text style={styles.profileName}>{displayNickname}</Text>
            </View>
            {roleLabel ? (
              <View style={styles.profileTagContainer}>
                <Text style={styles.profileTag}>{roleLabel}</Text>
              </View>
            ) : null}
          </View>
          {isOtherProfile ? (
            otherProfileFollowChat
          ) : (
            followerRow
          )}
        </View>
      </View>

      <Text style={styles.profileIntroduction}>
        {profile?.aboutMe ? profile.aboutMe : "소개가 없습니다."}
      </Text>

      {!isOtherProfile ? (
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
      ) : null}
    </View>
  );
};

export default Profile;
