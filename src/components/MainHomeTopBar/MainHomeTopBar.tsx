import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../Logo/Logo";
import { WHITE, MAIN } from "../../color";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../navigations/routes";

const MainHomeTopBar = ({ logoName }: { logoName: string }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <Logo size={24} logoName={logoName} />
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
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate(RootRoutes.SETTINGS)}
        >
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
