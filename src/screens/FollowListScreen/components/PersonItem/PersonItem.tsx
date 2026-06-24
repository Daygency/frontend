import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { GRAY } from "../../../../color";
import type { FollowListItemDto } from "../../../../lib/apis/follow/followListTypes";
import { RootRoutes } from "../../../../navigations/routes";
import UserProfileAvatar from "../../../../components/ui/UserProfileAvatar";

interface PersonItemProps {
  person: FollowListItemDto;
}

const PersonItem = ({ person }: PersonItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const displayName = person.name?.trim() || "이름 없음";
  const sub = person.activityName?.trim();

  const onPress = () => {
    navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
      userId: person.userId,
      activityName: sub ?? "",
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <UserProfileAvatar
        peerUserId={person.userId}
        profileImgUrl={person.profileImgUrl}
        size={56}
        style={styles.profileImage}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
        {sub ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={GRAY.MEDIUM_2}
      />
    </Pressable>
  );
};

export default PersonItem;
