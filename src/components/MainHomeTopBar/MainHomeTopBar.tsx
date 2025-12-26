import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../Logo/Logo";
import { WHITE, MAIN } from "../../color";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";

const MainHomeTopBar = () => {
  return (
    <View style={styles.container}>
      <Logo size={24} logoName="DAYGENCY" />
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton}>
          <Feather name="search" size={23} color={MAIN.DEFAULT} />
          <View style={styles.dotNew} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color={MAIN.DEFAULT}
          />
          <View style={styles.dotNew} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <MaterialCommunityIcons
            name="cog-outline"
            size={23}
            color={MAIN.DEFAULT}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default MainHomeTopBar;
