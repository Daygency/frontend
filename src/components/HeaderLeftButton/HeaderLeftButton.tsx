import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackHeaderBackProps } from "@react-navigation/native-stack";
import { Pressable } from "react-native";

const HeaderLeftButton = (props: NativeStackHeaderBackProps) => {
  const navigation = useNavigation();
  const { canGoBack, tintColor } = props;

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  if (!canGoBack) return null;
  return (
    <Pressable onPress={handlePress} hitSlop={10}>
      <MaterialCommunityIcons name="chevron-left" size={30} color={tintColor || "#000"} />
    </Pressable>
  );
};

export default HeaderLeftButton;
