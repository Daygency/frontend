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

const COMMUNITY_GUIDELINES = [
  "서로를 존중해주세요. 비방·명예훼손 내용은 제한될 수 있어요.",
  "불법 콘텐츠는 허용되지 않아요.",
  "분쟁을 유도하거나 혐오를 조장하는 표현은 지양해주세요.",
  "타인의 계정을 모방하거나 사칭하는 활동은 허용되지 않아요.",
  "외부 플랫폼 콘텐츠는 정확한 출처를 남겨주세요.",
  "도배, 스팸, 신고 악용 등 비정상적인 활동은 제재됩니다.",
  "규정을 어기면 게시물 삭제 또는 이용 제한이 적용될 수 있어요.",
];

const categoryOptions = [
  { label: "학원·연습실 매매", value: "학원·연습실 매매" },
  { label: "음악 뉴스", value: "음악 뉴스" },
  { label: "자유게시판", value: "자유게시판" },
];

const CommunityRegistrationScreen = () => {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const [category, setCategory] = useState("학원·연습실 매매");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleRegister = () => {
    // TODO: 등록 로직
  };

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
          <Form title="카테고리" isRequired>
            <FormDropdownInput
              placeholder="카테고리를 선택하세요"
              data={categoryOptions}
              value={category}
              onChange={(item) => setCategory(item.value)}
            />
          </Form>

          <View style={styles.formField}>
            <Form title="제목" isRequired>
              <FormTextInput
                placeholder="제목을 입력하세요"
                value={title}
                onChangeText={setTitle}
              />
            </Form>
          </View>

          <View style={styles.formField}>
            <Form title="내용" isRequired>
              <View style={styles.contentInputWrapper}>
                <TextInput
                  style={styles.contentInput}
                  placeholder="학원·연습실 매매와, 임대 정보를 주고받는 공간이에요!"
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

        <View style={styles.guidelinesSection}>
          {COMMUNITY_GUIDELINES.map((text, index) => (
            <View key={index} style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>{text}</Text>
            </View>
          ))}
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
        <Pressable
          style={styles.anonymousToggle}
          onPress={() => setIsAnonymous(!isAnonymous)}
        >
          <View
            style={[
              styles.checkbox,
              isAnonymous && styles.checkboxChecked,
            ]}
          >
            {isAnonymous && (
              <MaterialCommunityIcons
                name="check"
                size={14}
                color={WHITE}
              />
            )}
          </View>
          <Text style={styles.anonymousText}>익명</Text>
        </Pressable>
        <Pressable
          style={[styles.registerButton, !(title && content && category) && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={!(title && content && category)}
        >
          <Text style={styles.registerButtonText}>등록하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CommunityRegistrationScreen;
