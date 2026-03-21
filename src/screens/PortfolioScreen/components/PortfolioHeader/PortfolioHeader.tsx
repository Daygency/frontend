import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Pressable } from "react-native";
import styles from "./styles";
import { MaterialIcons, Octicons, Ionicons } from "@expo/vector-icons";
import { MAIN } from "../../../../color";
import Logo from "../../../../components/Logo/Logo";
import { useAuth } from "../../../../contexts/AuthContext";
import { getProfileCache } from "../../../../lib/profileCache";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootRoutes } from "../../../../navigations/routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const PortfolioHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuth();
  const [activityName, setActivityName] = useState<string>("");

  const loadActivityName = useCallback(() => {
    let cancelled = false;
    getProfileCache().then((cached) => {
      if (!cancelled && cached?.activityName) {
        setActivityName(cached.activityName);
      } else if (!cancelled && (user as any)?.activityName) {
        setActivityName(String((user as any).activityName));
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

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <Logo size={24} logoName="내 포트폴리오" />
        {activityName ? (
          <View style={styles.activityBar}>
            <Text style={styles.activityBarText}>@{activityName}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.iconContainer}>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
          <Ionicons name="settings-outline" size={24} color="black" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="bookmark-outline" size={24} color="black" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Octicons name="share-android" size={23} color={MAIN.DEFAULT} />
        </Pressable>
      </View>
    </View>
  );
};

export default PortfolioHeader;
