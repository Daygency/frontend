import { useCallback, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import Logo from "../../ui/Logo";
import { MAIN, WHITE } from "../../../color";
import styles, {
  MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
  MAIN_HOME_TOP_BAR_TITLE_SIZE,
} from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { CompositeNavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../navigations/routes";
import type { ContentTabParamList, RootStackParamList } from "../../../navigations/types";
import { useRequireLogin } from "../../../hooks/useRequireLogin";
import { useAuth } from "../../../contexts/AuthContext";
import { getNotificationUnreadCount } from "../../../lib/apis/notifications/notificationsApi";

type MainHomeTopBarNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<ContentTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface MainHomeTopBarProps {
  logoName?: string;
  logoImage?: ImageSourcePropType;
  logoAspectRatio?: number;
  initialTag?: string | null;
  variant?: "light" | "dark";
  titleMenuOptions?: readonly string[];
  selectedTitleMenuOption?: string;
  onTitleMenuOptionChange?: (option: string) => void;
}

const MainHomeTopBar = ({
  logoName,
  logoImage,
  logoAspectRatio = 1396 / 179,
  initialTag,
  variant = "light",
  titleMenuOptions,
  selectedTitleMenuOption,
  onTitleMenuOptionChange,
}: MainHomeTopBarProps) => {
  const navigation = useNavigation<MainHomeTopBarNavigationProp>();
  const { isLoggedIn } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const iconColor = variant === "dark" ? WHITE : MAIN.DEFAULT;
  const titleColor = variant === "dark" ? WHITE : MAIN.DEFAULT;
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [titleMenuVisible, setTitleMenuVisible] = useState(false);
  const [titleMenuPosition, setTitleMenuPosition] = useState({ x: 0, y: 0 });
  const titleMenuRef = useRef<View>(null);

  const refreshUnreadNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setHasUnreadNotifications(false);
      return;
    }
    const count = await getNotificationUnreadCount();
    setHasUnreadNotifications(count != null && count > 0);
  }, [isLoggedIn]);

  useFocusEffect(
    useCallback(() => {
      void refreshUnreadNotifications();
    }, [refreshUnreadNotifications]),
  );

  const hasTitleMenu =
    titleMenuOptions != null &&
    titleMenuOptions.length > 0 &&
    selectedTitleMenuOption != null &&
    onTitleMenuOptionChange != null;
  const displayedTitle = hasTitleMenu
    ? selectedTitleMenuOption
    : (logoName ?? "");

  const handleSearchPress = () => {
    if (initialTag) {
      navigation.navigate(RootRoutes.SEARCH, { initialTag });
      return;
    }
    navigation.navigate(RootRoutes.SEARCH);
  };

  const logoHeight =
    variant === "dark"
      ? MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT
      : MAIN_HOME_TOP_BAR_TITLE_SIZE;
  const logoMaxWidth = 110;
  const logoWidth = Math.min(logoHeight * logoAspectRatio, logoMaxWidth);

  const openTitleMenu = () => {
    titleMenuRef.current?.measureInWindow((x, y, _width, height) => {
      setTitleMenuPosition({ x, y: y + height + 4 });
      setTitleMenuVisible(true);
    });
  };

  const renderTitle = () => {
    if (hasTitleMenu) {
      return (
        <>
          <View ref={titleMenuRef} collapsable={false}>
            <Pressable
              style={styles.titleMenuButton}
              onPress={openTitleMenu}
              accessibilityRole="button"
              accessibilityLabel={`${displayedTitle} 보기 선택`}
            >
              <Text
                style={[
                  styles.titleMenuText,
                  {
                    fontSize: MAIN_HOME_TOP_BAR_TITLE_SIZE,
                    lineHeight: MAIN_HOME_TOP_BAR_TITLE_LINE_HEIGHT,
                    color: titleColor,
                  },
                ]}
                numberOfLines={1}
              >
                {displayedTitle}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={22}
                color={titleColor}
              />
            </Pressable>
          </View>
          <Modal
            visible={titleMenuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setTitleMenuVisible(false)}
          >
            <View style={styles.titleMenuModalRoot} pointerEvents="box-none">
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setTitleMenuVisible(false)}
              />
              <View
                style={[
                  styles.titleMenuDropdown,
                  {
                    top: titleMenuPosition.y,
                    left: titleMenuPosition.x,
                  },
                ]}
              >
                {titleMenuOptions.map((option) => {
                  const selected = option === selectedTitleMenuOption;
                  return (
                    <Pressable
                      key={option}
                      style={({ pressed }) => [
                        styles.titleMenuItem,
                        pressed && styles.titleMenuItemPressed,
                      ]}
                      onPress={() => {
                        setTitleMenuVisible(false);
                        if (option !== selectedTitleMenuOption) {
                          onTitleMenuOptionChange(option);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.titleMenuItemText,
                          selected && styles.titleMenuItemTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Modal>
        </>
      );
    }

    if (logoImage) {
      return (
        <View
          style={{
            width: logoWidth,
            height: logoHeight,
            flexShrink: 1,
          }}
        >
          <Image
            source={logoImage}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="contain"
            accessibilityLabel="daygency"
          />
        </View>
      );
    }

    return <Logo logoName={logoName ?? ""} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleArea}>{renderTitle()}</View>
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton} onPress={handleSearchPress}>
          <Feather name="search" size={24} color={iconColor} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            if (!ensureLoggedIn()) return;
            navigation.navigate(RootRoutes.NOTIFICATIONS);
          }}
        >
          <Octicons name="bell" size={21} color={iconColor} />
          {hasUnreadNotifications ? <View style={styles.dotNew} /> : null}
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            if (!ensureLoggedIn()) return;
            navigation.navigate(RootRoutes.SETTINGS);
          }}
        >
          <Feather name="settings" size={22} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default MainHomeTopBar;
