import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Logo from "../../components/Logo/Logo";
import { MAIN } from "../../color";
import styles from "./styles";

const ChatScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Logo size={24} logoName="채팅" />
        <View style={styles.iconContainer}>
          <Pressable style={styles.iconButton}>
            <Feather name="search" size={23} color={MAIN.DEFAULT} />
          </Pressable>
        </View>
      </View>
      <View style={styles.content}>
        <Text>Chat</Text>
      </View>
    </View>
  );
};

export default ChatScreen;
