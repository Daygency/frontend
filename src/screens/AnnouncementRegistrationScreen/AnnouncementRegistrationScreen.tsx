import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Switch,
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
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
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

const APPLICATION_FORM_FIELDS = [
  { id: "name", label: "이름" },
  { id: "birthYear", label: "출생연도" },
  { id: "gender", label: "성별" },
  { id: "major", label: "전공" },
  { id: "detailMajor", label: "세부전공" },
  { id: "education", label: "학력(소속학교/학년)" },
  { id: "participationSection", label: "참가 부문" },
  { id: "academyOrAdvisor", label: "학원명 또는 지도교수" },
  { id: "participatingSong", label: "참가곡" },
  { id: "deliveryAddress", label: "상장/트로피 배송 주소" },
  { id: "photoVideoFile", label: "사진/영상/파일 제출" },
  { id: "link", label: "링크 첨부" },
  { id: "affiliatedDepartment", label: "소속 학부" },
  { id: "experience", label: "경력" },
  { id: "selfIntroduction", label: "자기소개/지원동기" },
] as const;

const DEFAULT_FORM_FIELDS = {
  name: { included: true, required: true },
  major: { included: true, required: true },
  detailMajor: { included: true, required: true },
  participationSection: { included: true, required: true },
  selfIntroduction: { included: true, required: true },
};

type TabType = "announcement" | "applicationForm";

const AnnouncementRegistrationScreen = () => {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("announcement");
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const handleTabPress = (tab: TabType) => {
    if (tab === activeTab) return;
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // 공고 작성 필드
  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [announcementType, setAnnouncementType] = useState("");
  const [content, setContent] = useState("");

  // 지원서 양식 구성
  const [formFields, setFormFields] = useState<
    Record<string, { included: boolean; required: boolean }>
  >(() => {
    const initial: Record<string, { included: boolean; required: boolean }> =
      {};
    APPLICATION_FORM_FIELDS.forEach(({ id }) => {
      initial[id] =
        DEFAULT_FORM_FIELDS[id as keyof typeof DEFAULT_FORM_FIELDS] ?? {
          included: false,
          required: false,
        };
    });
    return initial;
  });
  const [formConfigConfirmed, setFormConfigConfirmed] = useState(false);

  const handleRegister = () => {
    // TODO: 모집공고 등록 로직
  };

  const updateFormField = (
    id: string,
    field: "included" | "required",
    value: boolean
  ) => {
    setFormFields((prev) => {
      const next = { ...prev };
      if (!next[id]) next[id] = { included: false, required: false };
      next[id] = { ...next[id], [field]: value };
      if (field === "included" && !value) {
        next[id].required = false;
      }
      return next;
    });
  };

  const isFormValid =
    title &&
    scheduledDate &&
    deadline &&
    announcementType &&
    content &&
    formConfigConfirmed;

  return (
    <View style={styles.container}>
      {/* 탭 스위처 */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "announcement" && styles.tabActive]}
          onPress={() => handleTabPress("announcement")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "announcement" && styles.tabTextActive,
            ]}
          >
            공고 작성
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "applicationForm" && styles.tabActive]}
          onPress={() => handleTabPress("applicationForm")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "applicationForm" && styles.tabTextActive,
            ]}
          >
            지원서 양식 구성
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (bottom || 0) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
        {activeTab === "announcement" ? (
          <>
            <View style={styles.formSection}>
              <View style={styles.formField}>
                <Form title="공고명" isRequired>
                  <FormTextInput
                    placeholder="공고명을 입력하세요"
                    value={title}
                    onChangeText={setTitle}
                  />
                </Form>
              </View>

              <View style={styles.formField}>
                <Form title="일정/장소" isRequired>
                  <View style={styles.scheduleLocationBox}>
                    <View style={styles.scheduleField}>
                      <Form title="예정일" isRequired>
                        <View>
                          <FormTextInput
                            placeholder="YYYY.MM.DD"
                            value={scheduledDate}
                            onChangeText={setScheduledDate}
                          />
                          <View style={styles.quickButtonRow}>
                            <Pressable
                              style={styles.quickButton}
                              onPress={() => setScheduledDate("모집시 마감")}
                            >
                              <Text style={styles.quickButtonText}>
                                모집시 마감
                              </Text>
                            </Pressable>
                            <Pressable
                              style={styles.quickButton}
                              onPress={() => setScheduledDate("마감됨")}
                            >
                              <Text style={styles.quickButtonText}>마감됨</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Form>
                    </View>
                    <View style={styles.scheduleField}>
                      <Form title="예정 시간" isRequired={false}>
                        <FormTextInput
                          placeholder="00:00"
                          value={scheduledTime}
                          onChangeText={setScheduledTime}
                        />
                      </Form>
                    </View>
                    <View style={styles.scheduleField}>
                      <Form title="공고 마감일" isRequired>
                        <View>
                          <FormTextInput
                            placeholder="YYYY.MM.DD"
                            value={deadline}
                            onChangeText={setDeadline}
                          />
                          <View style={styles.quickButtonRow}>
                            <Pressable
                              style={styles.quickButton}
                              onPress={() => setDeadline("모집시 마감")}
                            >
                              <Text style={styles.quickButtonText}>
                                모집시 마감
                              </Text>
                            </Pressable>
                            <Pressable
                              style={styles.quickButton}
                              onPress={() => setDeadline("마감됨")}
                            >
                              <Text style={styles.quickButtonText}>마감됨</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Form>
                    </View>
                    <View style={styles.scheduleField}>
                      <Form title="장소" isRequired={false}>
                        <FormTextInput
                          placeholder="장소를 입력하세요"
                          value={location}
                          onChangeText={setLocation}
                        />
                      </Form>
                    </View>
                  </View>
                </Form>
              </View>

              <View style={styles.formField}>
                <Form title="공고 유형" isRequired>
                  <FormDropdownInput
                    placeholder="공고 유형을 선택하세요"
                    data={announcementTypeOptions}
                    value={announcementType}
                    onChange={(item) => setAnnouncementType(item.value)}
                  />
                </Form>
              </View>

              <View style={styles.formField}>
                <Form title="내용" isRequired>
                  <View style={styles.contentInputWrapper}>
                    <TextInput
                      style={styles.contentInput}
                      placeholder="연주자 모집, 대타 구인, 콩쿨, 입시평가회, 행사, 웨딩 오브리 등 모집 공고를 등록할 수 있어요."
                      placeholderTextColor={GRAY.DARK_2}
                      multiline
                      value={content}
                      onChangeText={setContent}
                      textAlignVertical="top"
                    />
                    <Text style={styles.contentNote}>
                      ▲ 공연 소식 및 홍보는 '라운지'를 이용해주세요
                    </Text>
                  </View>
                </Form>
              </View>

              <View style={styles.formField}>
                <Form title="사진/영상/파일" isRequired={false}>
                  <View style={styles.fileOptions}>
                    <Pressable style={styles.fileOptionItem} hitSlop={10}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={24}
                        color={BLACK}
                      />
                      <Text style={styles.fileOptionText}>파일에서 선택</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={GRAY.DARK_1}
                      />
                    </Pressable>
                    <Pressable style={styles.fileOptionItem} hitSlop={10}>
                      <MaterialCommunityIcons
                        name="image-multiple-outline"
                        size={24}
                        color={BLACK}
                      />
                      <Text style={styles.fileOptionText}>앨범에서 선택</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={GRAY.DARK_1}
                      />
                    </Pressable>
                  </View>
                </Form>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.formSection}>
            <Text style={styles.applicationFormTitle}>
              지원서 양식 구성
              <Text style={styles.requiredMark}> *</Text>
            </Text>
            <Text style={styles.applicationFormDescription}>
              지원자가 작성해야 할 정보를 선택해 주세요.
            </Text>

            <View style={styles.formFieldHeaderRow}>
              <Text style={styles.formFieldHeader}>
                지원서에 포함
              </Text>
              <Text style={styles.formFieldHeader}>
                지원자가 필수 작성
              </Text>
            </View>

            {APPLICATION_FORM_FIELDS.map(({ id, label }) => (
              <View key={id} style={styles.applicationFormItem}>
                <Pressable
                  style={[
                    styles.checkbox,
                    formFields[id]?.included && styles.checkboxChecked,
                  ]}
                  onPress={() =>
                    updateFormField(id, "included", !formFields[id]?.included)
                  }
                >
                  {formFields[id]?.included && (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color={WHITE}
                    />
                  )}
                </Pressable>
                <Text style={styles.applicationFormLabel}>{label}</Text>
                <Switch
                  value={formFields[id]?.required ?? false}
                  onValueChange={(value) =>
                    updateFormField(id, "required", value)
                  }
                  disabled={!formFields[id]?.included}
                  trackColor={{
                    true: MAIN.DEFAULT,
                    false: GRAY.MEDIUM,
                  }}
                  thumbColor={WHITE}
                  style={styles.formToggle}
                />
              </View>
            ))}

            <Pressable
              style={styles.confirmRow}
              onPress={() => setFormConfigConfirmed(!formConfigConfirmed)}
            >
              <View
                style={[
                  styles.radio,
                  formConfigConfirmed && styles.radioChecked,
                ]}
              >
                {formConfigConfirmed && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.confirmText}>
                지원서 양식을 위와 같이 구성합니다. *
              </Text>
            </Pressable>
          </View>
        )}
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: (bottom || 0) + 16,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        ]}
      >
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
