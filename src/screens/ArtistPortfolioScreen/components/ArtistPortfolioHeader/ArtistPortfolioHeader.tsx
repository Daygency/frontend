import { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { MAIN, WHITE } from "../../../../color";
import { useAuth } from "../../../../contexts/AuthContext";
import { blockUser } from "../../../../lib/apis/block/blockApi";
import { getUserPublicProfile } from "../../../../lib/apis/portfolio/profileApi";

interface ArtistPortfolioHeaderProps {
  activityName: string;
  targetUserId?: string;
  scrollY?: Animated.Value;
  fadeStart?: number;
  fadeEnd?: number;
}

const ArtistPortfolioHeader = ({
  activityName,
  targetUserId,
  scrollY,
  fadeStart = 0,
  fadeEnd = 1,
}: ArtistPortfolioHeaderProps) => {
  const navigation = useNavigation<any>();
  const { top } = useSafeAreaInsets();
  const { user, isLoggedIn } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";
  const useScrollFade = scrollY != null;

  const solidOpacity = useScrollFade
    ? scrollY.interpolate({
        inputRange: [fadeStart, fadeEnd],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : 1;

  const overlayOpacity = useScrollFade
    ? scrollY.interpolate({
        inputRange: [fadeStart, fadeEnd],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 0;

  const [resolvedHandle, setResolvedHandle] = useState(activityName.trim());
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    const fromRoute = activityName.trim();
    if (fromRoute) {
      setResolvedHandle(fromRoute);
      return;
    }

    const uid = targetUserId?.trim();
    if (!uid) {
      setResolvedHandle("");
      return;
    }

    let cancelled = false;
    void getUserPublicProfile(uid).then((profile) => {
      if (cancelled) return;
      setResolvedHandle(
        profile?.activityName?.trim() || profile?.name?.trim() || "",
      );
    });

    return () => {
      cancelled = true;
    };
  }, [activityName, targetUserId]);

  const handleLabel = resolvedHandle ? `@${resolvedHandle}` : null;

  const showMenu =
    !!targetUserId &&
    isLoggedIn &&
    !!myUserId &&
    targetUserId !== myUserId;

  const onPressBlock = () => {
    if (!targetUserId || blockLoading) return;
    Alert.alert(
      "차단",
      "이 사용자를 차단하면 서로 팔로우가 해제됩니다. 계속할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "차단",
          style: "destructive",
          onPress: async () => {
            setBlockLoading(true);
            const res = await blockUser(targetUserId);
            setBlockLoading(false);
            if (res.ok) {
              Alert.alert("알림", "차단되었습니다.", [
                { text: "확인", onPress: () => navigation.goBack() },
              ]);
              return;
            }
            Alert.alert(
              "차단",
              res.message ?? `요청에 실패했습니다. (${res.status})`,
            );
          },
        },
      ],
    );
  };

  const onPressReport = () => {
    Alert.alert(
      "신고",
      "신고 접수 기능은 준비 중입니다. 고객센터로 문의해 주세요.",
    );
  };

  const openOverflowMenu = () => {
    if (blockLoading) return;
    Alert.alert("더보기", undefined, [
      {
        text: "차단",
        style: "destructive",
        onPress: onPressBlock,
      },
      {
        text: "신고",
        onPress: onPressReport,
      },
      { text: "취소", style: "cancel" },
    ]);
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: top + 6, paddingBottom: 10 },
      ]}
    >
      {useScrollFade ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.headerContainerSolid,
            { opacity: solidOpacity },
          ]}
        />
      ) : null}
      <View style={styles.topRow}>
        <View style={styles.leftContainer}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.backButton}
          >
            <Animated.View style={{ opacity: overlayOpacity }}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color={WHITE}
              />
            </Animated.View>
            <Animated.View style={[styles.iconSolid, { opacity: solidOpacity }]}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color={MAIN.DEFAULT}
              />
            </Animated.View>
          </Pressable>
          {handleLabel ? (
            <View style={styles.titleStack}>
              <Animated.Text
                style={[
                  styles.activityName,
                  styles.handleTextOverlay,
                  { color: WHITE, opacity: overlayOpacity },
                ]}
                numberOfLines={1}
              >
                {handleLabel}
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.activityName,
                  styles.titleSolid,
                  { color: MAIN.DEFAULT, opacity: solidOpacity },
                ]}
                numberOfLines={1}
              >
                {handleLabel}
              </Animated.Text>
            </View>
          ) : null}
        </View>

        {showMenu ? (
          <Pressable
            onPress={openOverflowMenu}
            hitSlop={12}
            style={styles.menuButton}
            disabled={blockLoading}
          >
            {blockLoading ? (
              <ActivityIndicator size="small" color={MAIN.DEFAULT} />
            ) : (
              <>
                <Animated.View style={{ opacity: overlayOpacity }}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={26}
                    color={WHITE}
                  />
                </Animated.View>
                <Animated.View style={[styles.iconSolid, { opacity: solidOpacity }]}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={26}
                    color={MAIN.DEFAULT}
                  />
                </Animated.View>
              </>
            )}
          </Pressable>
        ) : (
          <View style={styles.menuPlaceholder} />
        )}
      </View>
    </View>
  );
};

export default ArtistPortfolioHeader;
