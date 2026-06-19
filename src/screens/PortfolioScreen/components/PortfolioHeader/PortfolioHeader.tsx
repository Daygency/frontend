import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../../../color";
import { useAuth } from "../../../../contexts/AuthContext";
import { getMyProfile } from "../../../../lib/apis/portfolio/profileApi";
import { getProfileCache, saveProfileCache } from "../../../../lib/profileCache";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootRoutes } from "../../../../navigations/routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const PortfolioHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuth();
  const [activityName, setActivityName] = useState<string>("");

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
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {handleLabel ? (
          <Text style={styles.handleText} numberOfLines={1}>
            {handleLabel}
          </Text>
        ) : null}
      </View>
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton}>
          <MaterialCommunityIcons name="share-variant" size={23} color={MAIN.DEFAULT} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
          <MaterialCommunityIcons name="cog-outline" size={23} color={MAIN.DEFAULT} />
        </Pressable>
      </View>
    </View>
  );
};

export default PortfolioHeader;
