import { Text, View } from "react-native";
import { Pressable } from "react-native";
import styles from "./styles";
import Feather from "@expo/vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../../../../color";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootRoutes } from "../../../../../navigations/routes";
import { useRequireLogin } from "../../../../../hooks/useRequireLogin";

const ChatHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { ensureLoggedIn } = useRequireLogin();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>채팅</Text>
      <View style={styles.iconContainer}>
        <Pressable style={styles.iconButton}>
          <Feather name="search" size={23} color={MAIN.DEFAULT} />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            if (!ensureLoggedIn()) return;
            navigation.navigate(RootRoutes.SETTINGS);
          }}
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

export default ChatHeader;

