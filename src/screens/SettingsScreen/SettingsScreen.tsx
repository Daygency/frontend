import React from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles";
import SettingItem from "./components/SettingItem/SettingItem";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import { RED } from "../../color";
import { ThemePreference, useAppTheme } from "../../contexts/ThemeContext";
import { RootRoutes } from "../../navigations/routes";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "시스템 설정" },
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
];

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { preference, setPreference } = useAppTheme();

  const openThemePicker = () => {
    const labels = THEME_OPTIONS.map((option) => option.label);
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "화면 모드",
          options: [...labels, "취소"],
          cancelButtonIndex: labels.length,
        },
        (index) => {
          if (index < labels.length) setPreference(THEME_OPTIONS[index].value);
        },
      );
      return;
    }
    Alert.alert("화면 모드", undefined, [
      ...THEME_OPTIONS.map((option) => ({
        text: option.label,
        onPress: () => setPreference(option.value),
      })),
      { text: "취소", style: "cancel" as const },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader />
      <View style={styles.listSection}>
        <SettingItem
          icon="bell-outline"
          label="알림 설정"
          onPress={() => navigation.navigate(RootRoutes.NOTIFICATION_SETTINGS)}
        />
        <SettingItem
          icon="theme-light-dark"
          label="화면 모드"
          value={
            THEME_OPTIONS.find((option) => option.value === preference)?.label
          }
          onPress={openThemePicker}
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
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
