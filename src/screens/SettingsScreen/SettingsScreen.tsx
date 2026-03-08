import React from "react";
import { ScrollView, View } from "react-native";
import styles from "./styles";
import SettingItem from "./components/SettingItem/SettingItem";
import { RED } from "../../color";

const SettingsScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <SettingItem icon="account-outline" label="내 정보" />
      <SettingItem icon="pulse" label="내 활동" />
      <SettingItem icon="bell-outline" label="알림 설정" />
      <SettingItem icon="file-document-outline" label="내 자료 보관함" />
      <SettingItem icon="help-circle-outline" label="고객센터" />
      <SettingItem
        icon="account-outline"
        label="계정"
        color={RED.DEFAULT}
        isLast
      />
    </ScrollView>
  );
};

export default SettingsScreen;
