import React, { useState } from "react";
import { View, Text, Image, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WHITE, FIXED_WHITE, GRAY, BLACK } from "../../color";
import { themedStyles } from "../../theme/themedStyles";
import { createInquiry } from "../../lib/apis/inquiry/inquiryApi";

const MAX_IMAGES = 3;

const InquiryScreen = () => {
  const navigation = useNavigation<any>();
  const { bottom } = useSafeAreaInsets();
  const [inquiryText, setInquiryText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    const trimmed = inquiryText.trim();
    if (!trimmed) {
      Alert.alert("알림", "문의 내용을 입력해 주세요.");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      const files = images.map((uri, index) => ({
        uri,
        name: `inquiry_${index}.jpg`,
        type: "image/jpeg",
      }));
      const created = await createInquiry(trimmed, files);
      if (!created) {
        Alert.alert("실패", "문의를 제출하지 못했습니다. 다시 시도해 주세요.");
        return;
      }
      Alert.alert("접수 완료", "문의가 접수되었습니다.", [
        {
          text: "확인",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch {
      Alert.alert("오류", "문의 제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: (bottom || 0) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={styles.divider} />

        <TextInput
          style={styles.textArea}
          placeholder="문의 내용을 입력해 주세요."
          placeholderTextColor={GRAY.MEDIUM_100}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          value={inquiryText}
          onChangeText={setInquiryText}
        />

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
                  color={GRAY.DARK_100}
                />
              </Pressable>
            </View>
          ))}
          {images.length < MAX_IMAGES && (
            <Pressable style={styles.photoAdd} onPress={pickImages}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={32}
                color={GRAY.DARK_2}
              />
              <Text style={styles.photoAddText}>추가</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 12 }]}>
        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={FIXED_WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>제출하기</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = themedStyles(() => ({
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
    color: BLACK,
    marginBottom: 6,
  },
  hours: {
    fontSize: 12,
    color: GRAY.DARK_2,
  },
  divider: {
    height: 5,
    backgroundColor: GRAY.MEDIUM,
    marginHorizontal: -20,
    marginBottom: 24,
  },
  textArea: {
    borderWidth: 1,
    borderColor: GRAY.MEDIUM,
    borderRadius: 10,
    padding: 16,
    minHeight: 180,
    fontSize: 14,
    color: BLACK,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: GRAY.DARK_100,
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
    borderColor: GRAY.MEDIUM,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAddText: {
    fontSize: 12,
    color: GRAY.DARK_2,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: WHITE,
  },
  submitButton: {
    backgroundColor: "#0069FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: FIXED_WHITE,
  },
}));

export default InquiryScreen;
