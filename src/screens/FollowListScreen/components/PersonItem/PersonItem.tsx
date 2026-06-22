import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { GRAY } from "../../../../color";
import type { FollowListItemDto } from "../../../../lib/apis/follow/followListTypes";
import { resolveProfileImageUrlForDisplay } from "../../../../lib/chat/resolveProfileImageUrl";
import { RootRoutes } from "../../../../navigations/routes";
import { useState, useEffect } from "react";

interface PersonItemProps {
  person: FollowListItemDto;
}

const PersonItem = ({ person }: PersonItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [imgErr, setImgErr] = useState(false);
  const displayUri = resolveProfileImageUrlForDisplay(person.profileImgUrl);

  useEffect(() => {
    setImgErr(false);
  }, [person.userId, person.profileImgUrl]);

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
      {displayUri && !imgErr ? (
        <Image
          source={{ uri: displayUri }}
          style={styles.profileImage}
          resizeMode="cover"
          onError={() => setImgErr(true)}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <MaterialCommunityIcons name="account" size={36} color={GRAY.MEDIUM_2} />
        </View>
      )}

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
