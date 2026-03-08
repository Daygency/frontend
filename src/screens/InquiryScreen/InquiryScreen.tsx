import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MAIN, WHITE } from "../../color";

const InquiryScreen = () => {
  const [inquiryText, setInquiryText] = useState("");

  const handleSubmit = () => {
    // TODO: 제출 로직 구현
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 상단: 로고 + 데이전시 고객센터 + 운영시간 */}
        <View style={styles.headerSection}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../../../assets/daygency-logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.serviceTitle}>데이전시 고객센터</Text>
          <Text style={styles.hours}>평일 09시~18시 (점심시간 12~13시)</Text>
        </View>

        {/* 회색 선 (두께 5) */}
        <View style={styles.divider} />

        {/* TextArea */}
        <TextInput
          style={styles.textArea}
          placeholder="문의 내용을 입력해 주세요."
          placeholderTextColor="#A0A0A0"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          value={inquiryText}
          onChangeText={setInquiryText}
        />

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>제출하기</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 80,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  hours: {
    fontSize: 12,
    color: "#888",
  },
  divider: {
    height: 5,
    backgroundColor: "#EDEBEB",
    marginHorizontal: -20,
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#EDEBEB",
    borderRadius: 10,
    padding: 16,
    minHeight: 180,
    fontSize: 14,
    color: "#000",
  },
  submitButton: {
    backgroundColor: MAIN.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: WHITE,
  },
});

export default InquiryScreen;
