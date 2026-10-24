import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
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
import { MAIN, WHITE, FIXED_WHITE } from "../../../color";
import styles, { MENU_ICON_SIZE, MENU_SLIDE_DISTANCE } from "./styles";

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
  utilityMenuItems?: FabMenuItem[];
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const FAB_SIZE = 56;
const FAB_BOTTOM = 24;
const FAB_RIGHT = 20;
const MENU_GAP = 12;
const ANIM_MS = 200;
/** ContentTab 하단 탭 바 높이 — FAB 위치·전체 딤드 계산용 */
const TAB_BAR_HEIGHT = 90;

const FabButton = ({
  onPress,
  menuItems,
  utilityMenuItems = [],
  icon = "plus",
  size = 28,
  containerStyle,
}: FabButtonProps) => {
  const [open, setOpen] = useState(false);
  const closingRef = useRef(false);
  const menuSlideAnim = useRef(new Animated.Value(MENU_SLIDE_DISTANCE)).current;
  const menuOpacityAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const hasMenu = menuItems != null && menuItems.length > 0;
  const hasUtilityMenu = hasMenu && utilityMenuItems.length > 0;
  /** 탭 화면 안(닫힘) — 부모가 탭 바 위 영역 */
  const fabBottomClosed = FAB_BOTTOM;
  /** Modal(열림) — 화면 하단 기준, 탭 바 높이 포함 */
  const fabBottomOpen = TAB_BAR_HEIGHT + FAB_BOTTOM;
  const menuBottom = fabBottomOpen + FAB_SIZE + MENU_GAP;

  const runOpenAnimation = useCallback(() => {
    menuSlideAnim.setValue(MENU_SLIDE_DISTANCE);
    menuOpacityAnim.setValue(0);
    overlayOpacityAnim.setValue(0);
    rotateAnim.setValue(0);

    Animated.parallel([
      Animated.timing(menuSlideAnim, {
        toValue: 0,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacityAnim, {
        toValue: 1,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacityAnim, {
        toValue: 1,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [menuOpacityAnim, menuSlideAnim, overlayOpacityAnim, rotateAnim]);

  const runCloseAnimation = useCallback(
    (onDone?: () => void) => {
      Animated.parallel([
        Animated.timing(menuSlideAnim, {
          toValue: MENU_SLIDE_DISTANCE,
          duration: ANIM_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacityAnim, {
          toValue: 0,
          duration: ANIM_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 0,
          duration: ANIM_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: ANIM_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        closingRef.current = false;
        setOpen(false);
        onDone?.();
      });
    },
    [menuOpacityAnim, menuSlideAnim, overlayOpacityAnim, rotateAnim],
  );

  const openMenu = useCallback(() => {
    if (closingRef.current) return;
    setOpen(true);
    requestAnimationFrame(runOpenAnimation);
  }, [runOpenAnimation]);

  const closeMenu = useCallback(() => {
    if (!open || closingRef.current) return;
    closingRef.current = true;
    runCloseAnimation();
  }, [open, runCloseAnimation]);

  const handleFabPress = () => {
    if (hasMenu) {
      if (open) closeMenu();
      else openMenu();
      return;
    }
    onPress?.();
  };

  const handleMenuItemPress = (item: FabMenuItem) => {
    if (closingRef.current) return;
    closingRef.current = true;
    const action = item.onPress;
    runCloseAnimation(action);
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

  const renderMenuBox = (items: FabMenuItem[]) => (
    <View style={styles.menuContainer}>
      {items.map((item, index) => (
        <Pressable
          key={item.label}
          style={[
            styles.menuItem,
            index < items.length - 1 && styles.menuItemBorder,
          ]}
          onPress={() => handleMenuItemPress(item)}
        >
          <View style={styles.menuIconSlot}>
            {renderMenuIcon(item.label)}
          </View>
          <Text style={styles.menuItemText}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderFab = (inModal: boolean) => (
    <Pressable
      style={[
        styles.fab,
        open && styles.fabOpen,
        {
          right: FAB_RIGHT,
          bottom: inModal ? fabBottomOpen : fabBottomClosed,
        },
        !inModal ? containerStyle : undefined,
      ]}
      onPress={handleFabPress}
    >
      {open ? (
        <Animated.View style={styles.fabIconRotate}>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <MaterialCommunityIcons
              name={icon}
              size={size}
              color={MAIN.DEFAULT}
            />
          </Animated.View>
        </Animated.View>
      ) : (
        <MaterialCommunityIcons name={icon} size={size} color={FIXED_WHITE} />
      )}
    </Pressable>
  );

  return (
    <>
      {hasMenu ? (
        <Modal
          visible={open}
          transparent
          animationType="none"
          onRequestClose={closeMenu}
          statusBarTranslucent
        >
          <View style={styles.modalRoot} pointerEvents="box-none">
            <Animated.View
              style={[styles.overlay, { opacity: overlayOpacityAnim }]}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
            </Animated.View>

            <Animated.View
              style={[
                styles.menuStack,
                {
                  bottom: menuBottom,
                  opacity: menuOpacityAnim,
                  transform: [{ translateY: menuSlideAnim }],
                },
              ]}
            >
              {hasUtilityMenu ? renderMenuBox(utilityMenuItems) : null}
              {renderMenuBox(menuItems!)}
            </Animated.View>

            {renderFab(true)}
          </View>
        </Modal>
      ) : null}

      {hasMenu && !open ? renderFab(false) : null}
      {!hasMenu ? renderFab(false) : null}
    </>
  );
};

export default FabButton;
