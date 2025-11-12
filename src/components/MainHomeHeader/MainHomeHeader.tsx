import { Pressable, StyleSheet, View } from "react-native";
import SearchInput from "../SearchInput/SearchInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN } from "../../color";

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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconButton: {
    flexShrink: 0,
  },
});

export default MainHomeHeader;
