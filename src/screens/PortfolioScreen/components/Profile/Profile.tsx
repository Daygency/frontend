import { View, Text, Switch, Pressable } from "react-native";
import styles from "./styles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../../../color";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../../navigations/routes";

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const followerCount = 100;
  const followingCount = 100;
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Text>사진</Text>
        </View>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileNameContainer}>
            <Text style={styles.profileName}>예술가 이름</Text>
            <View style={styles.profileTagContainer}>
              <Text style={styles.profileTag}>예술가</Text>
            </View>
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
        안녕하세요, 저는 연주자입니다 !
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
