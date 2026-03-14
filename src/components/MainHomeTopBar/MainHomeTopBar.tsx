import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Logo from "../Logo/Logo";
import { WHITE, MAIN } from "../../color";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../navigations/routes";

interface MainHomeTopBarProps {
  logoName: string;
  initialTag?: string | null;
}

const MainHomeTopBar = ({ logoName, initialTag }: MainHomeTopBarProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSearchPress = () => {
    navigation.getParent()?.navigate(RootRoutes.SEARCH as never, {
      initialTag: initialTag ?? undefined,
    } as never);
  };

  return (
    <View style={styles.container}>
      <Logo size={24} logoName={logoName} />
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton} onPress={handleSearchPress}>
          <Feather name="search" size={23} color={MAIN.DEFAULT} />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color={MAIN.DEFAULT}
          />
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
