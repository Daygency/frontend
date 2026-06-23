import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN, WHITE } from "../../../../color";
import { useAuth } from "../../../../contexts/AuthContext";
import { getMyProfile } from "../../../../lib/apis/portfolio/profileApi";
import { getProfileCache, saveProfileCache } from "../../../../lib/profileCache";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootRoutes } from "../../../../navigations/routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const [activityName, setActivityName] = useState<string>("");
  const useScrollFade = scrollY != null;

  const solidOpacity = useScrollFade
    ? scrollY.interpolate({
        inputRange: [fadeStart, fadeEnd],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : overlay
      ? 0
      : 1;

  const overlayOpacity = useScrollFade
    ? scrollY.interpolate({
        inputRange: [fadeStart, fadeEnd],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : overlay
      ? 1
      : 0;

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

  useEffect(() => {
    const cleanup = loadActivityName();
    return cleanup;
  }, [loadActivityName]);

  useFocusEffect(
    useCallback(() => {
      const cleanup = loadActivityName();
      return () => {
        cleanup();
      };
    }, [loadActivityName]),
  );

  const handleLabel = activityName ? `@${activityName}` : "";

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: top + 6, paddingBottom: 10 },
        !useScrollFade && (overlay ? styles.headerContainerOverlay : styles.headerContainerSolid),
      ]}
    >
      {useScrollFade ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.headerContainerSolid,
            { opacity: solidOpacity },
          ]}
        />
      ) : null}
      <View style={styles.leftContainer}>
        {handleLabel ? (
          <View style={styles.titleStack}>
            <Animated.Text
              style={[
                styles.handleText,
                styles.handleTextOverlay,
                { color: WHITE, opacity: overlayOpacity },
              ]}
              numberOfLines={1}
            >
              {handleLabel}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.handleText,
                styles.titleSolid,
                { color: MAIN.DEFAULT, opacity: solidOpacity },
              ]}
              numberOfLines={1}
            >
              {handleLabel}
            </Animated.Text>
          </View>
        ) : null}
      </View>
      <View style={styles.iconContainer}>
        <Pressable
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 6, left: 10, right: 10 }}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
          <Animated.View style={{ opacity: overlayOpacity }}>
            <MaterialCommunityIcons name="cog-outline" size={23} color={WHITE} />
          </Animated.View>
          <Animated.View style={[styles.iconSolid, { opacity: solidOpacity }]}>
            <MaterialCommunityIcons name="cog-outline" size={23} color={MAIN.DEFAULT} />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export default PortfolioHeader;
