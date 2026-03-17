import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
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
import { getCommunityCategories, createCommunity } from "../../lib/apis/community/communityApi";
import type { CommunityCategory } from "../../lib/apis/community/types";

const COMMUNITY_GUIDELINES = [
  "서로를 존중해주세요. 비방·명예훼손 내용은 제한될 수 있어요.",
  "불법 콘텐츠는 허용되지 않아요.",
  "분쟁을 유도하거나 혐오를 조장하는 표현은 지양해주세요.",
  "타인의 계정을 모방하거나 사칭하는 활동은 허용되지 않아요.",
  "외부 플랫폼 콘텐츠는 정확한 출처를 남겨주세요.",
  "도배, 스팸, 신고 악용 등 비정상적인 활동은 제재됩니다.",
  "규정을 어기면 게시물 삭제 또는 이용 제한이 적용될 수 있어요.",
];

const PLACEHOLDER_BY_CATEGORY: Record<string, string> = {
  "학원/연습실 매매": "학원·연습실 매매와, 임대 정보를 주고받는 공간이에요!",
  자유게시판: "자유롭게 이야기를 나눠보세요.",
  구인: "구인/모집 관련 정보를 공유해주세요.",
  입시정보: "입시 관련 정보를 공유해주세요.",
  학원운용: "학원 운영과 관련된 정보를 공유해주세요.",
};

type CommunityRegistrationParams = { initialCategory?: string };

const CommunityRegistrationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ CommunityRegistration: CommunityRegistrationParams }, "CommunityRegistration">>();
  const { bottom } = useSafeAreaInsets();
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        label: c.name,
        value: c.categoryId,
      })),
    [categories]
  );

  useEffect(() => {
    (async () => {
      const cats = await getCommunityCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
        const fromRoute = route.params?.initialCategory;
        if (fromRoute) {
          const match = cats.find((c) => c.name === fromRoute);
          if (match) {
            setCategoryId(match.categoryId);
            return;
          }
        }
        setCategoryId(cats[0].categoryId);
      }
    })();
  }, [route.params?.initialCategory]);

  const selectedCategoryName =
    categories.find((c) => c.categoryId === categoryId)?.name ?? "";

  const handleRegister = async () => {
    if (!categoryId || !title || !content || submitting) return;
    try {
      setSubmitting(true);
      const res = await createCommunity({
        title,
        content,
        categoryId,
        fileId: null,
      });
      if (!res) {
        console.warn("커뮤니티 게시글 등록 실패");
        return;
      }
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
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
              value={categoryId}
              onChange={(item) => setCategoryId(item.value)}
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
                  placeholder={
                    PLACEHOLDER_BY_CATEGORY[selectedCategoryName] ??
                    PLACEHOLDER_BY_CATEGORY["학원/연습실 매매"]
                  }
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
          style={[
            styles.registerButton,
            !(title && content && categoryId) && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!(title && content && categoryId) || submitting}
        >
          <Text style={styles.registerButtonText}>등록하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CommunityRegistrationScreen;
