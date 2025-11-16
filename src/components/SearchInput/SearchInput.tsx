import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { GRAY } from "../../color";

const SearchInput = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="오늘, 어떤 무대를 찾고 계신가요?"
      />
      <View style={styles.icon}>
        <MaterialCommunityIcons name={"magnify"} size={20} color={GRAY.DARK} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    backgroundColor: GRAY.DEFAULT,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
  },
  input: {
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 8,
    paddingLeft: 40,
    fontSize: 14,
  },
  icon: {
    position: "absolute",
    left: 8,
    height: "100%",
    justifyContent: "center",
  },
});

export default SearchInput;
