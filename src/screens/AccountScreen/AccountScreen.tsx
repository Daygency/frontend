import React from "react";
import { ScrollView, Alert } from "react-native";
import SettingItem from "../SettingsScreen/components/SettingItem/SettingItem";
import { RED } from "../../color";
import styles from "./styles";

const AccountScreen = () => {
  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: () => {
            // TODO: 로그아웃 로직
          },
        },
      ]
    );
  };

  const handleWithdraw = () => {
    // TODO: 회원 탈퇴 로직
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
