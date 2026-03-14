import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Form from "../../components/Form/Form";
import FormTextInput from "../../components/FormTextInput/FormTextInput";
import FormDropdownInput from "../../components/FormDropdownInput/FormDropdownInput";
import { BLACK, GRAY, WHITE } from "../../color";
import styles from "./styles";

const announcementTypeOptions = [
  { label: "오디션(연주자모집)", value: "오디션(연주자모집)" },
  { label: "콩쿨(경연)", value: "콩쿨(경연)" },
  { label: "입시평가회", value: "입시평가회" },
  { label: "마스터클래스", value: "마스터클래스" },
  { label: "행사", value: "행사" },
  { label: "스탭구인", value: "스탭구인" },
  { label: "기타", value: "기타" },
];

const majorOptions = [
  { label: "전공무관", value: "전공무관" },
  { label: "건반악기", value: "건반악기" },
  { label: "현악", value: "현악" },
  { label: "관악", value: "관악" },
  { label: "성악", value: "성악" },
  { label: "타악", value: "타악" },
  { label: "작곡", value: "작곡" },
  { label: "지휘", value: "지휘" },
  { label: "음악학", value: "음악학" },
  { label: "국악", value: "국악" },
  { label: "무용", value: "무용" },
  { label: "실용", value: "실용" },
  { label: "뮤지컬·크로스오버", value: "뮤지컬·크로스오버" },
  { label: "기타", value: "기타" },
];

const AnnouncementRegistrationScreen = () => {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const [announcementType, setAnnouncementType] = useState("오디션(연주자모집)");
  const [major, setMajor] = useState("전공무관");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleRegister = () => {
    // TODO: 모집공고 등록 로직
  };

  const isFormValid = title && content && announcementType && major;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (bottom || 0) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Form title="공고 유형" isRequired>
            <FormDropdownInput
              placeholder="공고 유형을 선택하세요"
              data={announcementTypeOptions}
              value={announcementType}
              onChange={(item) => setAnnouncementType(item.value)}
            />
          </Form>

          <Form title="모집 전공" isRequired>
            <FormDropdownInput
              placeholder="모집 전공을 선택하세요"
              data={majorOptions}
              value={major}
              onChange={(item) => setMajor(item.value)}
            />
          </Form>

          <View style={styles.formField}>
            <Form title="제목" isRequired>
              <FormTextInput
                placeholder="공고 제목을 입력하세요"
                value={title}
                onChangeText={setTitle}
              />
            </Form>
          </View>

          <View style={styles.formField}>
            <Form title="마감일" isRequired>
              <FormTextInput
                placeholder="YYYY-MM-DD (예: 2025-04-15)"
                value={deadline}
                onChangeText={setDeadline}
              />
            </Form>
          </View>

          <View style={styles.formField}>
            <Form title="상세 내용" isRequired>
              <View style={styles.contentInputWrapper}>
                <TextInput
                  style={styles.contentInput}
                  placeholder="모집 조건, 일정, 지원 방법 등을 상세히 작성해주세요."
                  placeholderTextColor={GRAY.DARK_2}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  textAlignVertical="top"
                />
                <Pressable style={styles.imageAttachButton} hitSlop={10}>
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={24}
                    color={GRAY.DARK_2}
                  />
                </Pressable>
              </View>
            </Form>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: (bottom || 0) + 16,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              },
              android: {
                elevation: 4,
              },
            }),
          },
        ]}
      >
        <View style={styles.footerSpacer} />
        <Pressable
          style={[
            styles.registerButton,
            !isFormValid && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!isFormValid}
        >
          <Text style={styles.registerButtonText}>등록하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AnnouncementRegistrationScreen;
