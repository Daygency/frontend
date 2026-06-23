import { useCallback, useState } from "react";
import { Animated, StyleSheet, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MAIN, WHITE } from "../../../../color";
import { useAuth } from "../../../../contexts/AuthContext";
import { getMyProfile } from "../../../../lib/apis/portfolio/profileApi";
import { getProfileCache, saveProfileCache } from "../../../../lib/profileCache";
import { RootRoutes } from "../../../../navigations/routes";
import { useHeaderScrollFade } from "../../../../hooks/useHeaderScrollFade";
import FadeDualLayer from "../../../../components/portfolio/FadeDualLayer";
import { portfolioHeaderStyles } from "../../../../components/portfolio/portfolioHeaderStyles";
import {
  MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
  MAIN_HOME_TOP_BAR_PADDING_TOP,
  MAIN_HOME_TOP_BAR_HORIZONTAL_PADDING,
} from "../../../../components/layout/MainHomeTopBar/styles";

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
          paddingTop: top + MAIN_HOME_TOP_BAR_PADDING_TOP,
          paddingBottom: MAIN_HOME_TOP_BAR_PADDING_BOTTOM,
          paddingHorizontal: MAIN_HOME_TOP_BAR_HORIZONTAL_PADDING,
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
              <Animated.Text
                style={[
                  portfolioHeaderStyles.handleText,
                  portfolioHeaderStyles.handleTextOverlay,
                  { color: WHITE, opacity: overlayOpacity },
                ]}
                numberOfLines={1}
              >
                {handleLabel}
              </Animated.Text>
              <Animated.Text
                style={[
                  portfolioHeaderStyles.handleText,
                  portfolioHeaderStyles.titleSolid,
                  { color: MAIN.DEFAULT, opacity: solidOpacity },
                ]}
                numberOfLines={1}
              >
                {handleLabel}
              </Animated.Text>
            </View>
          ) : null}
        </View>
        <Pressable
          style={styles.settingsButton}
          hitSlop={{ top: 10, bottom: 6, left: 10, right: 10 }}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
          <FadeDualLayer
            overlayOpacity={overlayOpacity}
            solidOpacity={solidOpacity}
            overlay={
              <MaterialCommunityIcons name="cog-outline" size={23} color={WHITE} />
            }
            solid={
              <MaterialCommunityIcons name="cog-outline" size={23} color={MAIN.DEFAULT} />
            }
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});

export default PortfolioHeader;
