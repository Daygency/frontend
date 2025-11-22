import { Pressable, View } from "react-native";
import SearchInput from "../SearchInput/SearchInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../color";
import styles from "./styles";

const MainHomeHeader = () => {
  return (
    <View style={styles.container}>
      <SearchInput />
      <Pressable style={styles.iconButton}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={23}
          color={MAIN.DEFAULT}
        />
      </Pressable>
      <Pressable style={styles.iconButton}>
        <MaterialCommunityIcons
          name="cog-outline"
          size={23}
          color={MAIN.DEFAULT}
        />
      </Pressable>
    </View>
  );
};

export default MainHomeHeader;
