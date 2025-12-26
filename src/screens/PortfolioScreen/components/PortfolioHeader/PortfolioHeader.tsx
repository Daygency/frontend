import { Text, View } from "react-native";
import { Pressable } from "react-native";
import styles from "./styles";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { MAIN } from "../../../../color";
import Logo from "../../../../components/Logo/Logo";

const PortfolioHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Logo size={24} logoName="내 포트폴리오" />
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
  );
};

export default PortfolioHeader;
