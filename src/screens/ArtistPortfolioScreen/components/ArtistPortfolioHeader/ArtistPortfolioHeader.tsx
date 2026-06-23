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
import { MAIN, WHITE } from "../../../../color";
import { useAuth } from "../../../../contexts/AuthContext";
import { blockUser } from "../../../../lib/apis/block/blockApi";
import { getUserPublicProfile } from "../../../../lib/apis/portfolio/profileApi";
import { useHeaderScrollFade } from "../../../../hooks/useHeaderScrollFade";
import FadeDualLayer from "../../../../components/portfolio/FadeDualLayer";
import { portfolioHeaderStyles } from "../../../../components/portfolio/portfolioHeaderStyles";
import {
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  MAIN_HOME_TOP_BAR_PADDING_TOP,
} from "../../../../components/layout/MainHomeTopBar/styles";

type ArtistPortfolioHeaderProps = {
  activityName: string;
  targetUserId?: string;
  scrollY?: Animated.Value;
  fadeStart?: number;
  fadeEnd?: number;
};

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
  const { useScrollFade, solidOpacity, overlayOpacity } = useHeaderScrollFade({
    scrollY,
    fadeStart,
    fadeEnd,
  });

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
    !!targetUserId && isLoggedIn && !!myUserId && targetUserId !== myUserId;

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

  const openOverflowMenu = () => {
    if (blockLoading) return;
    Alert.alert("더보기", undefined, [
      { text: "차단", style: "destructive", onPress: onPressBlock },
      {
        text: "신고",
        onPress: () =>
          Alert.alert(
            "신고",
            "신고 접수 기능은 준비 중입니다. 고객센터로 문의해 주세요.",
          ),
      },
      { text: "취소", style: "cancel" },
    ]);
  };

  return (
    <View
      style={[
        portfolioHeaderStyles.headerContainer,
        {
          paddingTop: top + MAIN_HOME_TOP_BAR_PADDING_TOP,
          paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
          paddingHorizontal: 8,
        },
      ]}
    >
      {useScrollFade ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            portfolioHeaderStyles.headerContainerSolid,
            { opacity: solidOpacity },
          ]}
        />
      ) : null}
      <View style={styles.topRow}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
            <FadeDualLayer
              overlayOpacity={overlayOpacity}
              solidOpacity={solidOpacity}
              overlay={
                <MaterialCommunityIcons name="chevron-left" size={28} color={WHITE} />
              }
              solid={
                <MaterialCommunityIcons name="chevron-left" size={28} color={MAIN.DEFAULT} />
              }
            />
          </Pressable>
          {handleLabel ? (
            <View style={portfolioHeaderStyles.titleStack}>
              <Animated.Text
                style={[
                  portfolioHeaderStyles.handleText,
                  portfolioHeaderStyles.handleTextOverlay,
                  { color: WHITE, opacity: overlayOpacity },
                ]}
                numberOfLines={1}
              >
                {handleLabel}
              </Animated.Text>
              <Animated.Text
                style={[
                  portfolioHeaderStyles.handleText,
                  portfolioHeaderStyles.titleSolid,
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
              <FadeDualLayer
                overlayOpacity={overlayOpacity}
                solidOpacity={solidOpacity}
                overlay={
                  <MaterialCommunityIcons name="dots-vertical" size={26} color={WHITE} />
                }
                solid={
                  <MaterialCommunityIcons name="dots-vertical" size={26} color={MAIN.DEFAULT} />
                }
              />
            )}
          </Pressable>
        ) : (
          <View style={styles.menuPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  backButton: {
    minWidth: 40,
    minHeight: 40,
    padding: 4,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    minWidth: 44,
    minHeight: 44,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  menuPlaceholder: {
    width: 44,
  },
});

export default ArtistPortfolioHeader;
