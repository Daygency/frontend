import { Pressable, Text, View } from "react-native";
import styles from "./styles";
import MainHomeHeader from "../../components/MainHomeHeader/MainHomeHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MainHomeTopBar from "../../components/MainHomeTopBar/MainHomeTopBar";
import { MAIN } from "../../color";
import {
  EvilIcons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";

const PortfolioScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>내 포트폴리오</Text>
        <View style={styles.iconContainer}>
          <Pressable style={styles.iconButton}>
            <View style={styles.iconTextContainer}>
              <Text style={styles.iconText}>TO DO</Text>
            </View>
          </Pressable>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="bookmark-add" size={24} color="black" />
            <View style={styles.dotNew} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Octicons name="share-android" size={23} color={MAIN.DEFAULT} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PortfolioScreen;
