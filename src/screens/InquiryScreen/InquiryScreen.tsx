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
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIN, WHITE } from "../../color";

const MAX_IMAGES = 3;

const InquiryScreen = () => {
  const [inquiryText, setInquiryText] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "사진을 선택하려면 갤러리 접근 권한이 필요합니다.");
      return;
    }

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // TODO: 제출 로직 구현 (inquiryText, images 포함)
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

        {/* 사진 첨부 */}
        <Text style={styles.photoLabel}>사진 첨부 (최대 {MAX_IMAGES}개)</Text>
        <View style={styles.photoSection}>
          {images.map((uri, index) => (
            <View key={uri + index} style={styles.photoItem}>
              <Image source={{ uri }} style={styles.photoImage} />
              <Pressable
                style={styles.photoRemove}
                onPress={() => removeImage(index)}
                hitSlop={8}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color="#575757"
                />
              </Pressable>
            </View>
          ))}
          {images.length < MAX_IMAGES && (
            <Pressable style={styles.photoAdd} onPress={pickImages}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={32}
                color="#888"
              />
              <Text style={styles.photoAddText}>추가</Text>
            </Pressable>
          )}
        </View>

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
  photoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#575757",
    marginTop: 20,
    marginBottom: 8,
  },
  photoSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  photoAdd: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDEBEB",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAddText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
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
