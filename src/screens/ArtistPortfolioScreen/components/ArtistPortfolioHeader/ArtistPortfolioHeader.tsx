import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { useAuth } from "../../../../contexts/AuthContext";
import { blockUser } from "../../../../lib/apis/block/blockApi";
import { getUserPublicProfile } from "../../../../lib/apis/portfolio/profileApi";

interface ArtistPortfolioHeaderProps {
  activityName: string;
  /** 다른 유저 포트폴리오일 때만 전달 */
  targetUserId?: string;
}

const ArtistPortfolioHeader = ({
  activityName,
  targetUserId,
}: ArtistPortfolioHeaderProps) => {
  const navigation = useNavigation<any>();
  const { user, isLoggedIn } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";

  const [resolvedHandle, setResolvedHandle] = useState(
    activityName.trim(),
  );
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
        profile?.activityName?.trim() || profile?.nickname?.trim() || "",
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
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.leftContainer}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#000"
            />
          </Pressable>
          {handleLabel ? (
            <Text style={styles.activityName} numberOfLines={1}>
              {handleLabel}
            </Text>
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
              <ActivityIndicator size="small" color="#1F2A44" />
            ) : (
              <MaterialCommunityIcons
                name="dots-vertical"
                size={26}
                color="#000"
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

export default ArtistPortfolioHeader;
