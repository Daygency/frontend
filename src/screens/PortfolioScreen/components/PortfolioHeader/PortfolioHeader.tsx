import { useCallback, useState } from "react";
import { Text, Animated, StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MAIN, WHITE, FIXED_WHITE } from "../../../../color";
import { themedStyles } from "../../../../theme/themedStyles";
import { useAuth } from "../../../../contexts/AuthContext";
import { getMyProfile } from "../../../../lib/apis/portfolio/profileApi";
import { getProfileCache, saveProfileCache } from "../../../../lib/profileCache";
import { RootRoutes } from "../../../../navigations/routes";
import { useHeaderScrollFade } from "../../../../hooks/useHeaderScrollFade";
import { useRequireLogin } from "../../../../hooks/useRequireLogin";
import FadeDualLayer from "../../../../components/portfolio/FadeDualLayer";
import { portfolioHeaderStyles } from "../../../../components/portfolio/portfolioHeaderStyles";

type PortfolioHeaderProps = {
  overlay?: boolean;
  scrollY?: Animated.Value;
  fadeStart?: number;
  fadeEnd?: number;
};

const PortfolioHeader = ({
  overlay = false,
  scrollY,
  fadeStart = 0,
  fadeEnd = 1,
}: PortfolioHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const [activityName, setActivityName] = useState("");
  const { useScrollFade, solidOpacity, overlayOpacity } = useHeaderScrollFade({
    scrollY,
    fadeStart,
    fadeEnd,
    overlay,
  });

  const loadActivityName = useCallback(() => {
    let cancelled = false;

    const apply = (name: string) => {
      if (!cancelled) setActivityName(name.trim());
    };

    getProfileCache().then(async (cached) => {
      if (cancelled) return;
      const fromCache = cached?.activityName?.trim();
      if (fromCache) {
        apply(fromCache);
        return;
      }
      const fromUser = String((user as { activityName?: string })?.activityName ?? "").trim();
      if (fromUser) {
        apply(fromUser);
        return;
      }
      const profile = await getMyProfile();
      if (!cancelled && profile?.activityName?.trim()) {
        apply(profile.activityName);
        saveProfileCache(profile);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useFocusEffect(loadActivityName);

  const handleLabel = activityName ? `@${activityName}` : "";

  return (
    <View
      style={[
        portfolioHeaderStyles.headerContainer,
        {
          paddingTop: top,
          paddingHorizontal: 17,
        },
        !useScrollFade &&
          (overlay
            ? portfolioHeaderStyles.headerContainerOverlay
            : portfolioHeaderStyles.headerContainerSolid),
      ]}
    >
      {useScrollFade ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            portfolioHeaderStyles.headerContainerSolid,
            { opacity: solidOpacity },
          ]}
        />
      ) : null}
      <View style={portfolioHeaderStyles.topRow}>
        <View style={portfolioHeaderStyles.leftContainer}>
          {handleLabel ? (
            <View style={portfolioHeaderStyles.titleStack}>
              <Animated.View
                style={[portfolioHeaderStyles.titleLayer, { opacity: overlayOpacity }]}
                pointerEvents="none"
              >
                <Animated.Text
                  style={[
                    portfolioHeaderStyles.handleText,
                    portfolioHeaderStyles.handleTextOverlay,
                    { color: FIXED_WHITE },
                  ]}
                  numberOfLines={1}
                >
                  {handleLabel}
                </Animated.Text>
              </Animated.View>
              <Animated.View
                style={[portfolioHeaderStyles.titleLayer, { opacity: solidOpacity }]}
                pointerEvents="none"
              >
                <Animated.Text
                  style={[portfolioHeaderStyles.handleText, { color: MAIN.DEFAULT }]}
                  numberOfLines={1}
                >
                  {handleLabel}
                </Animated.Text>
              </Animated.View>
            </View>
          ) : null}
        </View>
        <View style={styles.rightActions}>
          <Pressable
            style={styles.headerIconButton}
            hitSlop={{ top: 10, bottom: 6, left: 10, right: 6 }}
            onPress={() => {
              if (!ensureLoggedIn()) return;
              navigation.navigate(RootRoutes.PROFILE_EDIT);
            }}
          >
            <FadeDualLayer
              overlayOpacity={overlayOpacity}
              solidOpacity={solidOpacity}
              overlay={
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={23}
                  color={FIXED_WHITE}
                  style={portfolioHeaderStyles.iconOverlay}
                />
              }
              solid={
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={23}
                  color={MAIN.DEFAULT}
                />
              }
            />
          </Pressable>
          <Pressable
            style={styles.headerIconButton}
            hitSlop={{ top: 10, bottom: 6, left: 6, right: 10 }}
            onPress={() => {
              if (!ensureLoggedIn()) return;
              navigation.navigate(RootRoutes.SETTINGS);
            }}
          >
            <FadeDualLayer
              overlayOpacity={overlayOpacity}
              solidOpacity={solidOpacity}
              overlay={
                <Feather
                  name="settings"
                  size={23}
                  color={FIXED_WHITE}
                  style={portfolioHeaderStyles.iconOverlay}
                />
              }
              solid={<Feather name="settings" size={23} color={MAIN.DEFAULT} />}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = themedStyles(() => ({
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default PortfolioHeader;
