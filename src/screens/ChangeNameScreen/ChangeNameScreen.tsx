import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { GRAY, MAIN, WHITE } from "../../color";
import styles from "./styles";

type ChangeNameParams = {
  originalName?: string;
};

const ChangeNameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ ChangeName: ChangeNameParams }, "ChangeName">>();
  const originalName = route.params?.originalName ?? "김연주";

  const [name, setName] = useState(originalName);

  const trimmedName = name.trim();
  const isChanged = trimmedName !== originalName && trimmedName.length > 0;
  const isButtonEnabled = isChanged;

  const handleComplete = () => {
    if (!isButtonEnabled) return;
    // TODO: 저장 로직
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
            placeholderTextColor={GRAY.DARK_2}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            !isButtonEnabled && styles.buttonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!isButtonEnabled}
        >
          <Text
            style={[
              styles.buttonText,
              !isButtonEnabled && styles.buttonTextDisabled,
            ]}
          >
            수정 완료
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangeNameScreen;
