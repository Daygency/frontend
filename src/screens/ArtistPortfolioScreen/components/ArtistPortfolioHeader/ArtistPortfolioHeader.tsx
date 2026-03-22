import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { useAuth } from "../../../../contexts/AuthContext";
import { followUser, unfollowUser } from "../../../../lib/apis/follow/followApi";
import { blockUser } from "../../../../lib/apis/block/blockApi";

interface ArtistPortfolioHeaderProps {
  activityName: string;
  /** 다른 유저 포트폴리오일 때만 전달 (팔로우/차단 API용 UUID) */
  targetUserId?: string;
}

const ArtistPortfolioHeader = ({
  activityName,
  targetUserId,
}: ArtistPortfolioHeaderProps) => {
  const navigation = useNavigation<any>();
  const { user, isLoggedIn } = useAuth();
  const myUserId = user?.socialId?.trim() ?? "";

  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  const showSocial =
    !!targetUserId &&
    isLoggedIn &&
    !!myUserId &&
    targetUserId !== myUserId;

  const onPressFollow = async () => {
    if (!targetUserId || followLoading) return;
    setFollowLoading(true);
    const res = await followUser(targetUserId);
    setFollowLoading(false);
    if (res.ok) {
      setFollowing(true);
      return;
    }
    Alert.alert(
      "팔로우",
      res.message ?? `요청에 실패했습니다. (${res.status})`,
    );
  };

  const onPressUnfollow = () => {
    if (!targetUserId || followLoading) return;
    Alert.alert("언팔로우", "이 사용자를 언팔로우할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "언팔로우",
        style: "destructive",
        onPress: async () => {
          setFollowLoading(true);
          const res = await unfollowUser(targetUserId);
          setFollowLoading(false);
          if (res.ok) {
            setFollowing(false);
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
          <Text style={styles.activityName} numberOfLines={1}>
            @{activityName}
          </Text>
        </View>
      </View>

      {showSocial ? (
        <View style={styles.actionRow}>
          {followLoading ? (
            <View style={styles.actionBtn}>
              <ActivityIndicator size="small" color="#1F2A44" />
            </View>
          ) : following ? (
            <Pressable
              style={[styles.actionBtn, styles.actionBtnFollowing]}
              onPress={onPressUnfollow}
            >
              <Text style={styles.actionBtnTextFollowing}>팔로잉</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.actionBtn, styles.actionBtnFollow]}
              onPress={onPressFollow}
            >
              <Text style={styles.actionBtnTextFollow}>팔로우</Text>
            </Pressable>
          )}

          {blockLoading ? (
            <View style={styles.actionBtn}>
              <ActivityIndicator size="small" color="#991B1B" />
            </View>
          ) : (
            <Pressable
              style={[styles.actionBtn, styles.actionBtnBlock]}
              onPress={onPressBlock}
            >
              <Text style={styles.actionBtnTextBlock}>차단</Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default ArtistPortfolioHeader;
