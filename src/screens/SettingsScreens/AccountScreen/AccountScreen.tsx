import React from "react";
import { ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SettingItem from "../../SettingsScreen/components/SettingItem/SettingItem";
import { useAuth } from "../../../contexts/AuthContext";
import { RED } from "../../../color";
import { RootRoutes } from "../../../navigations/routes";
import styles from "./styles";

const AccountScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleWithdraw = () => {
    navigation.navigate(RootRoutes.WITHDRAW_CONFIRM);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <SettingItem
        icon="logout"
        label="로그아웃"
        onPress={handleLogout}
      />
      <SettingItem
        icon="account-off-outline"
        label="회원 탈퇴"
        color={RED.DEFAULT}
        onPress={handleWithdraw}
        isLast
      />
    </ScrollView>
  );
};

export default AccountScreen;
