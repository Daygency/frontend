import React from "react";
import { ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles";
import SettingItem from "./components/SettingItem/SettingItem";
import { RED } from "../../color";
import { RootRoutes } from "../../navigations/routes";

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <SettingItem
        icon="account-outline"
        label="내 정보"
        onPress={() => navigation.navigate(RootRoutes.MY_INFO)}
      />
      <SettingItem
        icon="pulse"
        label="내 활동"
        onPress={() => navigation.navigate(RootRoutes.MY_ACTIVITY)}
      />
      <SettingItem
        icon="bell-outline"
        label="알림 설정"
        onPress={() => navigation.navigate(RootRoutes.NOTIFICATION_SETTINGS)}
      />
      <SettingItem
        icon="file-document-outline"
        label="내 자료 보관함"
        onPress={() => navigation.navigate(RootRoutes.MY_DATA_ARCHIVE)}
      />
      <SettingItem
        icon="help-circle-outline"
        label="고객센터"
        onPress={() => navigation.navigate(RootRoutes.CUSTOMER_SERVICE)}
      />
      <SettingItem
        icon="account-outline"
        label="계정"
        color={RED.DEFAULT}
        onPress={() => navigation.navigate(RootRoutes.ACCOUNT)}
        isLast
      />
    </ScrollView>
  );
};

export default SettingsScreen;
