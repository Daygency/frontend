import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles, { PROFILE_BANNER_RATIO } from "./styles";
import { Ionicons, Octicons, FontAwesome } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../color";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../navigations/routes";
import {
  getMyProfile,
  getUserPublicProfile,
  PortfolioPrivateError,
} from "../../../lib/apis/portfolio/profileApi";
import { updateProfile, clearProfileImage, clearCoverImage } from "../../../lib/apis/portfolio/profileUpdate";
import type {
  ProfileResponseDto,
  PublicProfileResponseDto,
} from "../../../lib/apis/portfolio/types";
import {
  getProfileCache,
  saveProfileCache,
} from "../../../lib/profileCache";
import { useAuth } from "../../../contexts/AuthContext";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import {
  followUser,
  unfollowUser,
  checkIsUserInMyFollowingList,
} from "../../../lib/apis/follow/followApi";
import { createCoffeeRoom } from "../../../lib/apis/chat/chatApi";
import { chatRoomItemToParams } from "../../../lib/chat/chatRoomNavigation";
import { resolveProfileImageUrlForDisplay } from "../../../lib/chat/resolveProfileImageUrl";
import { DEFAULT_USER_PROFILE_IMAGE } from "../../../lib/media/defaultUserProfileImage";
import { showPhotoActionSheet } from "../../../lib/ui/showPhotoActionSheet";
import RecruitmentMajorChip from "../../shared/RecruitmentMajorChip";
import { getProfileMajorTagLabels } from "../../../lib/profile/profileMajorTags";
import * as ImagePicker from "expo-image-picker";
import type { ChatRoomParams } from "../../../screens/ChatScreens/ChatRoomScreen/ChatRoomScreen";

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

const Profile = ({ coverExtendTop = 0 }: { coverExtendTop?: number }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { height: windowHeight } = useWindowDimensions();
  const bannerHeight = Math.round(windowHeight * PROFILE_BANNER_RATIO) + coverExtendTop;
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const isArtistPortfolio =
    route.name === RootRoutes.ARTIST_PORTFOLIO;
  const isOtherProfile = Boolean(viewingUserId);
  /** 아티스트 포트폴리오로 열렸는데 userId 없음 */
  const isInvalidOtherRoute = isArtistPortfolio && !viewingUserId;

  const { user, isLoggedIn } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const myUserId = user?.socialId?.trim() ?? "";
  const [profile, setProfile] = useState<LoadedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortfolioPrivateBlocked, setIsPortfolioPrivateBlocked] =
    useState(false);
  const [imageError, setImageError] = useState(false);
  const [coverImageError, setCoverImageError] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const legalName =
    profile?.name?.trim() ||
    (!isOtherProfile ? user?.name?.trim() : "") ||
    "";
  const activityLabel = profile?.activityName?.trim() || "";
  const displayName = legalName || activityLabel;
  const rawProfileImgUrl =
    profile?.profileImgUrl ||
    (!isOtherProfile ? user?.profileImgUrl : undefined);
  const displayProfileImgUrl =
    isValidImageSource(rawProfileImgUrl) && !imageError
      ? toDisplayImageUri(rawProfileImgUrl)
      : null;

  const rawCoverImgUrl = (profile as ProfileResponseDto | PublicProfileResponseDto | null)
    ?.coverImgUrl;
  const displayCoverImgUrl =
    isValidImageSource(rawCoverImgUrl) && !coverImageError
      ? toDisplayImageUri(rawCoverImgUrl)
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
      if (!isLoggedIn) ensureLoggedIn();
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
      if (!ensureLoggedIn()) return;
    }
    navigation.navigate(RootRoutes.FOLLOW_LIST, {
      userId: uid,
      initialTab: tab,
      titleName: displayName || headline || undefined,
    });
  };

  const onPressChat = async () => {
    if (!viewingUserId) return;
    if (!ensureLoggedIn()) return;
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
          name: displayName || activityNameForChat || viewingUserId.slice(0, 8),
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

  const pickCoverImageFromLibrary = async () => {
    if (isOtherProfile || coverUploading) return;
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
        aspect: [16, 9],
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]?.uri) return;

      setCoverUploading(true);
      const updated = await updateProfile({}, {
        coverImageUri: result.assets[0].uri,
        coverImageName: "cover.jpg",
        coverImageType: "image/jpeg",
      });
      if (!updated) {
        Alert.alert("알림", "배경 사진 변경에 실패했습니다.");
        return;
      }
      const fresh = await getMyProfile();
      if (fresh) {
        setProfile(fresh);
        await saveProfileCache(fresh);
      }
      setCoverImageError(false);
    } catch (e) {
      console.warn("[pickCoverImageFromLibrary]", e);
      Alert.alert("알림", "배경 사진 변경에 실패했습니다.");
    } finally {
      setCoverUploading(false);
    }
  };

  const removeCoverImage = async () => {
    if (isOtherProfile || coverUploading) return;
    if (!isValidImageSource(rawCoverImgUrl)) return;

    setCoverUploading(true);
    try {
      const updated = await clearCoverImage();
      if (!updated) {
        Alert.alert("알림", "배경 사진 삭제에 실패했습니다.");
        return;
      }
      const fresh = await getMyProfile();
      if (fresh) {
        setProfile(fresh);
        await saveProfileCache(fresh);
      }
      setCoverImageError(false);
    } catch (e) {
      console.warn("[removeCoverImage]", e);
      Alert.alert("알림", "배경 사진 삭제에 실패했습니다.");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleCoverImagePress = () => {
    if (isOtherProfile || coverUploading) return;

    const hasCustomCover = isValidImageSource(rawCoverImgUrl);
    if (!hasCustomCover) {
      void pickCoverImageFromLibrary();
      return;
    }
    showPhotoActionSheet({
      title: "배경 사진",
      changeLabel: "사진 변경",
      resetLabel: "기본 배경으로 변경",
      onChange: () => void pickCoverImageFromLibrary(),
      onReset: () => void removeCoverImage(),
    });
  };

  const pickProfileImageFromLibrary = async () => {
    if (isOtherProfile || profileUploading) return;
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

      setProfileUploading(true);
      const updated = await updateProfile({}, {
        profileImageUri: result.assets[0].uri,
        profileImageName: "profile.jpg",
        profileImageType: "image/jpeg",
      });
      if (!updated) {
        Alert.alert("알림", "프로필 사진 변경에 실패했습니다.");
        return;
      }
      const fresh = await getMyProfile();
      if (fresh) {
        setProfile(fresh);
        await saveProfileCache(fresh);
      }
      setImageError(false);
    } catch (e) {
      console.warn("[pickProfileImageFromLibrary]", e);
      Alert.alert("알림", "프로필 사진 변경에 실패했습니다.");
    } finally {
      setProfileUploading(false);
    }
  };

  const removeProfileImage = async () => {
    if (isOtherProfile || profileUploading) return;
    if (!isValidImageSource(rawProfileImgUrl)) return;

    setProfileUploading(true);
    try {
      const updated = await clearProfileImage();
      if (!updated) {
        Alert.alert("알림", "프로필 사진 삭제에 실패했습니다.");
        return;
      }
      const fresh = await getMyProfile();
      if (fresh) {
        setProfile(fresh);
        await saveProfileCache(fresh);
      }
      setImageError(false);
    } catch (e) {
      console.warn("[removeProfileImage]", e);
      Alert.alert("알림", "프로필 사진 삭제에 실패했습니다.");
    } finally {
      setProfileUploading(false);
    }
  };

  const handleProfileImagePress = () => {
    if (isOtherProfile || profileUploading) return;

    const hasCustomPhoto = isValidImageSource(rawProfileImgUrl);
    if (!hasCustomPhoto) {
      void pickProfileImageFromLibrary();
      return;
    }
    showPhotoActionSheet({
      title: "프로필 사진",
      changeLabel: "사진 변경",
      resetLabel: "기본 이미지로 변경",
      onChange: () => void pickProfileImageFromLibrary(),
      onReset: () => void removeProfileImage(),
    });
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
    setCoverImageError(false);

    if (isInvalidOtherRoute) {
      setProfile(null);
      if (!silent) setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    if (isOtherProfile && viewingUserId) {
      setIsPortfolioPrivateBlocked(false);
      getUserPublicProfile(viewingUserId)
        .then(async (data) => {
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
      })
        .catch((e) => {
          if (cancelled) return;
          if (e instanceof PortfolioPrivateError) {
            setIsPortfolioPrivateBlocked(true);
            setProfile(null);
          }
          if (!silent) setIsLoading(false);
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

    getMyProfile()
      .then((data) => {
        if (!cancelled) {
          apiResponded.current = true;
          if (data) saveProfileCache(data);
          setProfile(data);
          if (!silent) setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          apiResponded.current = true;
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
    setIsPortfolioPrivateBlocked(false);
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

  if (isOtherProfile && isPortfolioPrivateBlocked) {
    return null;
  }

  const roleLabel =
    profile?.role && profile.role !== "user"
      ? ROLE_LABEL[profile.role] ?? profile.role
      : "";

  const headline =
    legalName && activityLabel ? activityLabel : "";

  const majorTagLabels = getProfileMajorTagLabels(profile);
  const hasMajorTags = Boolean(majorTagLabels.major || majorTagLabels.detail);
  const aboutMeText = profile?.aboutMe?.trim() ?? "";

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

  const otherProfileActionsRow =
    isOtherProfile && !isInvalidOtherRoute ? (
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
    ) : null;

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={[styles.banner, { height: bannerHeight }]}>
          {displayCoverImgUrl ? (
            <>
              <Image
                source={{ uri: displayCoverImgUrl }}
                style={styles.bannerImage}
                resizeMode="cover"
                onError={() => setCoverImageError(true)}
              />
              <View style={styles.bannerDimOverlay} pointerEvents="none" />
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.3)"]}
                style={styles.bannerBottomGradient}
                pointerEvents="none"
              />
            </>
          ) : null}
          {!isOtherProfile ? (
            <View style={styles.bannerActionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.bannerActionBtn,
                  pressed && styles.bannerActionBtnPressed,
                ]}
                onPress={() => navigation.navigate(RootRoutes.MY_ACTIVITY)}
                hitSlop={6}
              >
                <Octicons name="graph" size={16} color={WHITE} />
                <Text style={styles.bannerActionText}>내활동</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.bannerActionBtn,
                  pressed && styles.bannerActionBtnPressed,
                ]}
                onPress={handleCoverImagePress}
                disabled={coverUploading}
                hitSlop={6}
              >
                {coverUploading ? (
                  <ActivityIndicator size="small" color={WHITE} />
                ) : (
                  <>
                    <FontAwesome name="photo" size={16} color={WHITE} />
                    <Text style={styles.bannerActionText}>배경사진</Text>
                  </>
                )}
              </Pressable>
            </View>
          ) : null}
        </View>
        <View style={styles.profileBody}>
          <Pressable
            style={styles.avatarWrapper}
            onPress={!isOtherProfile ? handleProfileImagePress : undefined}
            disabled={isOtherProfile || profileUploading}
          >
            <View style={styles.profileImageContainer}>
              {profileUploading ? (
                <ActivityIndicator size="small" color={MAIN.DEFAULT} />
              ) : displayProfileImgUrl ? (
                <Image
                  source={{ uri: displayProfileImgUrl }}
                  style={styles.profileImage}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Image
                  source={DEFAULT_USER_PROFILE_IMAGE}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              )}
            </View>
            {!isOtherProfile ? (
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera-outline" size={14} color={WHITE} />
              </View>
            ) : null}
          </Pressable>

          {(displayName || roleLabel) ? (
          <View style={styles.profileNameRow}>
            {displayName ? (
              <Text style={styles.profileName}>{displayName}</Text>
            ) : null}
            {roleLabel ? (
              <View style={styles.profileTagContainer}>
                <Text style={styles.profileTag}>{roleLabel}</Text>
              </View>
            ) : null}
          </View>
          ) : null}

          {headline ? (
            <Text style={styles.profileHeadline}>{headline}</Text>
          ) : null}

          {followerRow}

          {hasMajorTags || aboutMeText ? (
            <View style={styles.profileIntroSection}>
              {hasMajorTags ? (
                <View style={styles.profileMajorTagRow}>
                  {majorTagLabels.major ? (
                    <RecruitmentMajorChip label={majorTagLabels.major} />
                  ) : null}
                  {majorTagLabels.detail ? (
                    <RecruitmentMajorChip label={majorTagLabels.detail} />
                  ) : null}
                </View>
              ) : null}
              {aboutMeText ? (
                <Text style={styles.profileIntroduction}>{aboutMeText}</Text>
              ) : null}
            </View>
          ) : null}

          {otherProfileActionsRow}
        </View>
      </View>
    </View>
  );
};

export default Profile;
