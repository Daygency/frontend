import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { MAIN, WHITE } from "../../../color";
import styles, {
  MENU_CLOSE_SLIDE_DISTANCE,
  MENU_ICON_SIZE,
  MENU_SLIDE_DISTANCE,
} from "./styles";

export type FabMenuItem = {
  label: string;
  onPress: () => void;
};

const COMMUNITY_MENU_ICON_COLOR = "#F64A5B";
const MEGAPHONE_ICON = require("../../../../assets/megaphone.png");
const MUSIC_ICON = require("../../../../assets/music.png");

type FabButtonProps = {
  onPress?: () => void;
  menuItems?: FabMenuItem[];
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const FAB_SIZE = 56;
const FAB_BOTTOM = 24;
const FAB_RIGHT = 20;
const MENU_GAP = 12;
const CLOSE_ANIMATION_MS = 160;
/** ContentTab 하단 탭 바 높이 — FAB 위치·전체 딤드 계산용 */
const TAB_BAR_HEIGHT = 90;

const FabButton = ({
  onPress,
  menuItems,
  icon = "plus",
  size = 28,
  containerStyle,
}: FabButtonProps) => {
  const [open, setOpen] = useState(false);
  const isClosingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const menuSlideAnim = useRef(new Animated.Value(MENU_SLIDE_DISTANCE)).current;
  const menuOpacityAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;

  const hasMenu = menuItems != null && menuItems.length > 0;
  const fabBottomFromWindow = TAB_BAR_HEIGHT + FAB_BOTTOM;
  const menuBottom = fabBottomFromWindow + FAB_SIZE + MENU_GAP;

  const resetMenuAnimation = useCallback(() => {
    menuSlideAnim.setValue(MENU_SLIDE_DISTANCE);
    menuOpacityAnim.setValue(1);
    overlayOpacityAnim.setValue(0);
    rotateAnim.setValue(0);
    isClosingRef.current = false;
  }, [menuOpacityAnim, menuSlideAnim, overlayOpacityAnim, rotateAnim]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const runOpenAnimation = useCallback(() => {
    menuSlideAnim.setValue(MENU_SLIDE_DISTANCE);
    menuOpacityAnim.setValue(1);
    overlayOpacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(menuSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 110,
      }),
      Animated.timing(overlayOpacityAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }),
    ]).start();
  }, [menuOpacityAnim, menuSlideAnim, overlayOpacityAnim, rotateAnim]);

  const runCloseAnimation = useCallback(
    (onDone?: () => void) => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      Animated.parallel([
        Animated.timing(menuSlideAnim, {
          toValue: MENU_CLOSE_SLIDE_DISTANCE,
          duration: CLOSE_ANIMATION_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacityAnim, {
          toValue: 0,
          duration: CLOSE_ANIMATION_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 0,
          duration: CLOSE_ANIMATION_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: CLOSE_ANIMATION_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        rotateAnim.stopAnimation();
        rotateAnim.setValue(0);
        onDone?.();
      }, CLOSE_ANIMATION_MS);
    },
    [menuOpacityAnim, menuSlideAnim, overlayOpacityAnim, rotateAnim],
  );

  const openMenu = useCallback(() => {
    if (isClosingRef.current) return;
    setOpen(true);
    requestAnimationFrame(() => {
      runOpenAnimation();
    });
  }, [runOpenAnimation]);

  const closeMenu = useCallback(() => {
    if (!open || isClosingRef.current) return;
    isClosingRef.current = true;
    runCloseAnimation(() => {
      setOpen(false);
      resetMenuAnimation();
    });
  }, [open, resetMenuAnimation, runCloseAnimation]);

  const handleFabPress = () => {
    if (hasMenu) {
      if (open) {
        closeMenu();
      } else {
        openMenu();
      }
      return;
    }
    onPress?.();
  };

  const handleMenuItemPress = (item: FabMenuItem) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    const action = item.onPress;
    runCloseAnimation(() => {
      setOpen(false);
      resetMenuAnimation();
      action();
    });
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const renderMenuImage = (source: number) => (
    <Image
      source={source}
      style={styles.menuIcon}
      width={MENU_ICON_SIZE}
      height={MENU_ICON_SIZE}
    />
  );

  const renderMenuIcon = (label: string) => {
    switch (label) {
      case "모집공고":
        return renderMenuImage(MEGAPHONE_ICON);
      case "음악계 소식":
      case "공연 소식":
        return renderMenuImage(MUSIC_ICON);
      case "커뮤니티":
        return (
          <Octicons
            name="people"
            size={MENU_ICON_SIZE}
            color={COMMUNITY_MENU_ICON_COLOR}
          />
        );
      default:
        return null;
    }
  };

  const renderFabIcon = (isOpen: boolean) => {
    if (!isOpen) {
      return (
        <MaterialCommunityIcons name={icon} size={size} color={WHITE} />
      );
    }

    return (
      <Animated.View style={styles.fabIconRotate}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialCommunityIcons name={icon} size={size} color={MAIN.DEFAULT} />
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <>
      {!open ? (
        <Pressable
          style={[
            styles.fab,
            { right: FAB_RIGHT, bottom: FAB_BOTTOM },
            containerStyle,
          ]}
          onPress={handleFabPress}
        >
          {renderFabIcon(false)}
        </Pressable>
      ) : null}

      {hasMenu ? (
        <Modal
          visible={open}
          transparent
          animationType="none"
          onRequestClose={closeMenu}
          statusBarTranslucent
        >
          <View style={styles.modalRoot}>
            <Animated.View
              style={[styles.overlay, { opacity: overlayOpacityAnim }]}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
            </Animated.View>

            <Animated.View
              style={[
                styles.menuContainer,
                {
                  bottom: menuBottom,
                  opacity: menuOpacityAnim,
                  transform: [{ translateY: menuSlideAnim }],
                },
              ]}
            >
              {menuItems.map((item, index) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuItem,
                    index < menuItems.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <View style={styles.menuIconSlot}>
                    {renderMenuIcon(item.label)}
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </Animated.View>

            <Pressable
              style={[
                styles.fab,
                styles.fabOpen,
                { right: FAB_RIGHT, bottom: fabBottomFromWindow },
              ]}
              onPress={handleFabPress}
            >
              {renderFabIcon(true)}
            </Pressable>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

export default FabButton;
