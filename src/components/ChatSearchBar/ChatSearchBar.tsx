import React from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { GRAY, MAIN, WHITE } from "../../color";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

const ChatSearchBar = ({
  value,
  onChangeText,
  onClose,
  placeholder = "검색",
  autoFocus = true,
}: Props) => (
  <View style={styles.container}>
    <View style={styles.inputWrap}>
      <Feather name="search" size={18} color={GRAY.DARK_2} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={GRAY.DARK_2}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Feather name="x-circle" size={18} color={GRAY.DARK_2} />
        </Pressable>
      ) : null}
    </View>
    <Pressable onPress={onClose} hitSlop={8} style={styles.cancelBtn}>
      <Feather name="x" size={22} color={GRAY.DARK_100} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY.MEDIUM,
    backgroundColor: WHITE,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GRAY.DEFAULT_1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: GRAY.DARK_100,
    paddingVertical: 0,
  },
  cancelBtn: {
    padding: 4,
  },
});

export default ChatSearchBar;
