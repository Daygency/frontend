import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { GRAY } from "../../color";
import styles from "./styles";

const SearchInput = ({ placeholder }: { placeholder: string }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={GRAY.DARK}
      />
      <View style={styles.icon}>
        <MaterialCommunityIcons name={"magnify"} size={20} color={GRAY.DARK} />
      </View>
    </View>
  );
};

export default SearchInput;
