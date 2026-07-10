import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UserProfileAvatar from "../../../../components/ui/UserProfileAvatar/UserProfileAvatar";
import { useAuth } from "../../../../contexts/AuthContext";
import { getMyProfile } from "../../../../lib/apis/portfolio/profileApi";
import { getProfileCache, saveProfileCache } from "../../../../lib/profileCache";
import { RootRoutes } from "../../../../navigations/routes";
import { BLACK } from "../../../../color";
import styles from "./styles";

const ProfileHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuth();
  const [activityName, setActivityName] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    getProfileCache().then((cached) => {
      if (!cancelled && cached?.activityName) {
        setActivityName(cached.activityName);
      }
    });
    getMyProfile()
      .then((data) => {
        if (!cancelled && data) {
          setActivityName(data.activityName);
          void saveProfileCache(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const hasName = !!user?.name;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.avatarWrap}
        onPress={() => navigation.navigate(RootRoutes.PROFILE_EDIT)}
        hitSlop={4}
      >
        <UserProfileAvatar
          profileImgUrl={user?.profileImgUrl}
          size={64}
          style={styles.avatar}
        />
        <View style={styles.editBadge}>
          <MaterialCommunityIcons name="pencil" size={12} color={BLACK} />
        </View>
      </Pressable>

      <View style={styles.textWrap}>
        {hasName ? (
          <>
            <Text style={styles.name} numberOfLines={1}>
              {user.name}
            </Text>
            {!!activityName && (
              <Text style={styles.email} numberOfLines={1}>
                {activityName}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.name} numberOfLines={1}>
            {activityName || "활동아이디 없음"}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
