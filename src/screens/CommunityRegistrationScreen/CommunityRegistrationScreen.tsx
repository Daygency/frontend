import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../contexts/ToastContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Form from "../../components/forms/Form";
import FormTextInput from "../../components/forms/FormTextInput";
import CommunityCategorySelectModal from "../../components/modals/CommunityCategorySelectModal";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
import styles from "./styles";
import {
  getCommunityCategories,
  createCommunity,
  createCommunityWithFiles,
  getCommunityDetail,
  updateCommunity,
  deleteCommunityAttachment,
} from "../../lib/apis/community/communityApi";
import { MAX_MULTIPART_FILES } from "../../lib/apis/multipartPost";
import { attachFilesToPost, type LocalImageAsset } from "../../lib/apis/fileApi";
import type {
  CommunityAttachmentItem,
  CommunityCategory,
} from "../../lib/apis/community/types";
import { pickUrlFromFileLike } from "../../lib/media/attachmentImageUrl";

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
  유학정보: "유학 관련 정보를 공유해주세요.",
  학원운용: "학원 운영과 관련된 정보를 공유해주세요.",
};

type CommunityRegistrationParams = { initialCategory?: string; communityId?: string };

const CommunityRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const route = useRoute<RouteProp<{ CommunityRegistration: CommunityRegistrationParams }, "CommunityRegistration">>();
  const editCommunityId = route.params?.communityId?.trim();
  const isEditMode = Boolean(editCommunityId);
  const { bottom } = useSafeAreaInsets();
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editCommunityId));
  const [pendingImages, setPendingImages] = useState<LocalImageAsset[]>([]);
  const [existingImages, setExistingImages] = useState<CommunityAttachmentItem[]>([]);
  const [removedExistingFileIds, setRemovedExistingFileIds] = useState<string[]>([]);
  const MAX_IMAGES = MAX_MULTIPART_FILES;

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const cats = await getCommunityCategories();
      if (cats && cats.length > 0) {
        const freeIndex = cats.findIndex((c) => c.name === "자유게시판");
        const ordered =
          freeIndex > 0
            ? [
                cats[freeIndex],
                ...cats.slice(0, freeIndex),
                ...cats.slice(freeIndex + 1),
              ]
            : cats;
        setCategories(ordered);
        if (editCommunityId) return;
        const fromRoute = route.params?.initialCategory;
        if (fromRoute) {
          const match = ordered.find((c) => c.name === fromRoute);
          if (match) {
            setCategoryId(match.categoryId);
            return;
          }
        }
        setCategoryId(ordered[0].categoryId);
      }
    })();
  }, [route.params?.initialCategory, editCommunityId]);

  useEffect(() => {
    if (!editCommunityId) return;
    (async () => {
      const detail = await getCommunityDetail(editCommunityId);
      if (!detail) {
        Alert.alert("알림", "게시글을 불러오지 못했습니다.");
        navigation.goBack();
        return;
      }
      setTitle(detail.title ?? "");
      setContent(detail.content ?? "");
      if (detail.category?.categoryId) setCategoryId(detail.category.categoryId);
      if (detail.attachments && detail.attachments.length > 0) {
        setExistingImages(detail.attachments);
      } else {
        const fileRecord = detail.file;
        const legacyFileId =
          fileRecord && typeof fileRecord.fileId === "string"
            ? fileRecord.fileId
            : undefined;
        const legacyUrl = pickUrlFromFileLike(fileRecord);
        setExistingImages(
          legacyFileId && legacyUrl
            ? [{ fileId: legacyFileId, imgUrl: legacyUrl, sortOrder: 0 }]
            : [],
        );
      }
      setLoadingEdit(false);
    })();
  }, [editCommunityId, navigation]);

  /** X 버튼은 화면에서만 즉시 제거 — 실제 삭제는 "수정 완료" 시 일괄 반영 */
  const handleRemoveExistingImage = (fileId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.fileId !== fileId));
    setRemovedExistingFileIds((prev) => [...prev, fileId]);
  };

  const selectedCategoryName =
    categories.find((c) => c.categoryId === categoryId)?.name ?? "";

  if (loadingEdit) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "앨범 접근 권한이 필요합니다.");
        return;
      }
      const remaining = MAX_IMAGES - pendingImages.length - existingImages.length;
      if (remaining <= 0) {
        Alert.alert("알림", `이미지는 최대 ${MAX_IMAGES}장까지입니다.`);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: remaining,
      });
      if (result.canceled) return;
      const toAdd = result.assets.slice(0, remaining).map((a) => ({
        uri: a.uri,
        name: a.fileName ?? "image.jpg",
        type: a.mimeType ?? "image/jpeg",
      }));
      setPendingImages((prev) => [...prev, ...toAdd]);
    } catch (e) {
      console.warn("[pickImages]", e);
      Alert.alert("알림", "이미지 선택에 실패했습니다.");
    }
  };

  const handleRegister = async () => {
    if (!categoryId || !title || !content || submitting) return;
    try {
      setSubmitting(true);
      if (isEditMode && editCommunityId) {
        const res = await updateCommunity(editCommunityId, {
          title,
          content,
          categoryId,
        });
        if (!res?.communityId) {
          Alert.alert("수정 실패", "게시글을 수정하지 못했습니다.");
          return;
        }
        if (removedExistingFileIds.length > 0) {
          await Promise.all(
            removedExistingFileIds.map((fileId) =>
              deleteCommunityAttachment(editCommunityId, fileId),
            ),
          );
        }
        if (pendingImages.length > 0) {
          await attachFilesToPost(
            "community",
            editCommunityId,
            pendingImages,
            existingImages.length,
          );
        }
        navigation.goBack();
        return;
      }
      const res =
        pendingImages.length > 0
          ? await createCommunityWithFiles(
              { title, content, categoryId },
              pendingImages,
            )
          : await createCommunity({ title, content, categoryId });
      if (!res?.communityId) {
        Alert.alert("등록 실패", "게시글을 등록하지 못했습니다.");
        return;
      }
      showToast("게시글이 등록되었습니다");
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
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Form title="카테고리" isRequired>
            <Pressable
              style={styles.categoryTrigger}
              onPress={() => {
                if (categories.length > 0) setCategoryModalVisible(true);
              }}
            >
              <Text
                style={
                  selectedCategoryName
                    ? styles.categoryTriggerText
                    : styles.categoryTriggerPlaceholder
                }
              >
                {selectedCategoryName ||
                  (categories.length > 0
                    ? "카테고리를 선택하세요"
                    : "카테고리를 불러오는 중...")}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color={GRAY.MEDIUM_100}
              />
            </Pressable>
          </Form>
          <CommunityCategorySelectModal
            visible={categoryModalVisible}
            categories={categories}
            selectedCategoryId={categoryId}
            onSelect={(c) => {
              setCategoryId(c.categoryId);
              setCategoryModalVisible(false);
            }}
            onClose={() => setCategoryModalVisible(false)}
          />

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
                <Pressable
                  style={styles.imageAttachButton}
                  hitSlop={10}
                  onPress={pickImages}
                >
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={24}
                    color={GRAY.DARK_2}
                  />
                </Pressable>
              </View>
              {existingImages.length > 0 || pendingImages.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 10 }}
                  contentContainerStyle={{ paddingTop: 8 }}
                >
                  {existingImages.map((img) => (
                    <View
                      key={img.fileId}
                      style={{ marginRight: 8, position: "relative" }}
                    >
                      <Image
                        source={{ uri: img.imgUrl }}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 8,
                          backgroundColor: GRAY.MEDIUM,
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={() => handleRemoveExistingImage(img.fileId)}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          zIndex: 1,
                          elevation: 2,
                        }}
                        hitSlop={8}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={22}
                          color={MAIN.DEFAULT}
                        />
                      </Pressable>
                    </View>
                  ))}
                  {pendingImages.map((img, idx) => (
                    <View
                      key={`${img.uri}-${idx}`}
                      style={{ marginRight: 8, position: "relative" }}
                    >
                      <Image
                        source={{ uri: img.uri }}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 8,
                          backgroundColor: GRAY.MEDIUM,
                        }}
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={() =>
                          setPendingImages((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          zIndex: 1,
                          elevation: 2,
                        }}
                        hitSlop={8}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={22}
                          color={MAIN.DEFAULT}
                        />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              ) : null}
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: GRAY.DARK_2,
                }}
              >
                사진은 글 등록 후 업로드됩니다 (최대 {MAX_IMAGES}장).
              </Text>
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
            paddingBottom: (bottom || 0) + 4,
          },
        ]}
      >
        <Pressable
          style={[
            styles.registerButton,
            (!(title && content && categoryId) || submitting) &&
              styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!(title && content && categoryId) || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Text style={styles.registerButtonText}>
              {isEditMode ? "수정 완료" : "등록하기"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default CommunityRegistrationScreen;
