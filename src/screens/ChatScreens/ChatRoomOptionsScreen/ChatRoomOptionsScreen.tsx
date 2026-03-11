import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, WHITE } from "../../../color";
import styles from "./styles";

const ChatRoomOptionsScreen = () => {
  const navigation = useNavigation<any>();
  const { top } = useSafeAreaInsets();

  const handleLeaveChat = () => {
    navigation.pop(2); // Close options screen + chat room
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#000" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.optionItem}>
          <Text style={styles.optionText}>알림 해제</Text>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={22}
            color="#000"
          />
        </Pressable>
        <View style={styles.optionDivider} />
        <Pressable style={styles.optionItem}>
          <Text style={styles.optionText}>신고</Text>
          <MaterialCommunityIcons name="flag-outline" size={22} color="#000" />
        </Pressable>
        <View style={styles.optionDivider} />
        <Pressable style={styles.optionItem} onPress={handleLeaveChat}>
          <Text style={styles.optionText}>채팅방 나가기</Text>
          <MaterialCommunityIcons name="door-open" size={22} color="#EC1313" />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatRoomOptionsScreen;
