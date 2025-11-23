import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../Logo/Logo";
import { WHITE } from "../../color";
import styles from "./styles";

const MainHomeTopBar = () => {
  return (
    <View style={styles.container}>
      <Logo size={24} />
      <Pressable style={styles.portfolioButton}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="account" size={17} color={WHITE} />
        </View>
        <Text style={styles.portfolioTitle}>{"내 포트폴리오"}</Text>
      </Pressable>
    </View>
  );
};

export default MainHomeTopBar;

