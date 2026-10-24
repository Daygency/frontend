import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../contexts/ToastContext";
import * as ImagePicker from "expo-image-picker";
import {
  FormDateTimeRow,
  FormGroupDivider,
  FormPillButton,
  FormImagePreviewList,
  FormInputRow,
  FormPickerRow,
  FormRow,
  FormRowHelper,
  FormSection,
  FormTextAreaRow,
  FormTitleInput,
  FormToggleRow,
} from "../../components/forms/FormRow";
import JusoAddressField from "../../components/juso/JusoAddressField/JusoAddressField";
import WheelDateTimePickerModal from "../../components/modals/WheelDateTimePickerModal";
import { MAIN, WHITE, FIXED_WHITE } from "../../color";
import styles from "./styles";
import {
  createNewsWithFiles,
  getNewsDetail,
  updateNews,
  deleteNewsAttachment,
  MAX_NEWS_IMAGE_FILES,
} from "../../lib/apis/news/newsApi";
import type { NewsAttachmentItem } from "../../lib/apis/news/types";
import { attachFilesToPost, type LocalImageAsset } from "../../lib/apis/fileApi";
import { pickUrlFromFileLike } from "../../lib/media/attachmentImageUrl";
import { RootRoutes, ContentRoutes } from "../../navigations/routes";
import { localDateTimeToISO } from "../../lib/date/localDateTimeToISO";

type ValidationField = "title" | "content" | "place" | "images";

const MusicNewsRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const route = useRoute<RouteProp<{ MusicNewsRegistration: { newsId?: string } }, "MusicNewsRegistration">>();
  const editNewsId = route.params?.newsId?.trim();
  const isEditMode = Boolean(editNewsId);
  const { bottom } = useSafeAreaInsets();

  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [placeValue, setPlaceValue] = useState({
    address: "",
  });
  const [ticketPrice, setTicketPrice] = useState("");
  const [isFreeTicket, setIsFreeTicket] = useState(false);
  const [startedAt, setStartedAt] = useState<Date>(defaultStart);
  const [endedAt, setEndedAt] = useState<Date | null>(defaultStart);
  const [useEndDate, setUseEndDate] = useState(true);
  const [contact, setContact] = useState("");
  /** README: multipart 한 번에 `payload` + `files` */
  const [pendingImages, setPendingImages] = useState<LocalImageAsset[]>([]);
  const [existingImages, setExistingImages] = useState<NewsAttachmentItem[]>([]);
  const [removedExistingFileIds, setRemovedExistingFileIds] = useState<string[]>([]);
  const MAX_NEWS_IMAGES = MAX_NEWS_IMAGE_FILES;

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editNewsId));
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const fieldRefs = useRef<Partial<Record<ValidationField, View | null>>>({});

  useEffect(() => {
    if (!editNewsId) return;
    (async () => {
      const detail = await getNewsDetail(editNewsId);
      if (!detail) {
        Alert.alert("알림", "공연소식을 불러오지 못했습니다.");
        navigation.goBack();
        return;
      }
      setTitle(detail.title ?? "");
      setContent(detail.content ?? "");
      setPlaceValue({ address: detail.place ?? "" });
      setContact(detail.contact ?? "");
      if (detail.ticketPrice === 0) {
        setIsFreeTicket(true);
        setTicketPrice("");
      } else if (detail.ticketPrice != null) {
        setIsFreeTicket(false);
        setTicketPrice(String(detail.ticketPrice));
      }
      if (detail.startedAt) {
        const start = new Date(detail.startedAt);
        if (!isNaN(start.getTime())) setStartedAt(start);
      }
      if (detail.endedAt) {
        const end = new Date(detail.endedAt);
        if (!isNaN(end.getTime())) {
          setEndedAt(end);
          setUseEndDate(true);
        }
      } else {
        setUseEndDate(false);
      }
      if (detail.attachments && detail.attachments.length > 0) {
        setExistingImages(detail.attachments);
      } else {
        const fileRecord = detail.file
          ? (detail.file as Record<string, unknown>)
          : null;
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
  }, [editNewsId, navigation]);

  /** X 버튼은 화면에서만 즉시 제거 — 실제 삭제는 "수정 완료" 시 일괄 반영 */
  const handleRemoveExistingImage = (fileId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.fileId !== fileId));
    setRemovedExistingFileIds((prev) => [...prev, fileId]);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "앨범 접근 권한이 필요합니다.");
        return;
      }
      const remaining = MAX_NEWS_IMAGES - pendingImages.length - existingImages.length;
      if (remaining <= 0) {
        Alert.alert("알림", `이미지는 최대 ${MAX_NEWS_IMAGES}장까지입니다.`);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: remaining,
      });
      if (result.canceled) return;
      const toAdd = result.assets.slice(0, remaining).map((asset) => ({
        uri: asset.uri,
        name: asset.fileName ?? "image.jpg",
        type: asset.mimeType ?? "image/jpeg",
      }));
      setPendingImages((prev) => [...prev, ...toAdd]);
    } catch (e) {
      console.warn("[pickImage]", e);
      Alert.alert("알림", "이미지 선택에 실패했습니다.");
    }
  };

  const hasRequiredImages = isEditMode
    ? existingImages.length > 0 || pendingImages.length > 0
    : pendingImages.length > 0;

  const setFieldRef =
    (field: ValidationField) => (node: View | null) => {
      fieldRefs.current[field] = node;
    };

  const getFirstInvalidField = (): ValidationField | null => {
    if (!title.trim()) return "title";
    if (!placeValue.address.trim()) return "place";
    if (!content.trim()) return "content";
    if (!hasRequiredImages) return "images";
    return null;
  };

  const scrollToValidationField = (field: ValidationField) => {
    const fieldNode = fieldRefs.current[field];
    const contentNode = scrollContentRef.current;
    if (!fieldNode || !contentNode) return;
    fieldNode.measureLayout(
      contentNode,
      (_x, y) => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, y - 16),
          animated: true,
        });
      },
      () => {},
    );
  };

  const handleRegister = async () => {
    setSubmitAttempted(true);

    const firstInvalid = getFirstInvalidField();
    if (firstInvalid) {
      requestAnimationFrame(() => scrollToValidationField(firstInvalid));
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const dto = {
      title: title.trim(),
      content: content.trim().slice(0, 255),
      place: placeValue.address.trim().slice(0, 100),
      startedAt: localDateTimeToISO(startedAt),
      ...(contact.trim()
        ? { contact: contact.trim().slice(0, 30) }
        : isEditMode
          ? { contact: null }
          : {}),
      ...(isFreeTicket
        ? { ticketPrice: 0 }
        : ticketPrice.trim()
          ? { ticketPrice: parseInt(ticketPrice, 10) || undefined }
          : isEditMode
            ? { ticketPrice: null }
            : {}),
      ...(useEndDate && endedAt ? { endedAt: localDateTimeToISO(endedAt) } : {}),
    };

    try {
      if (isEditMode && editNewsId) {
        const updated = await updateNews(editNewsId, dto);
        if (!updated) {
          setIsSubmitting(false);
          Alert.alert("수정 실패", "공연소식 수정에 실패했습니다. 다시 시도해주세요.");
          return;
        }
        if (removedExistingFileIds.length > 0) {
          await Promise.all(
            removedExistingFileIds.map((fileId) =>
              deleteNewsAttachment(editNewsId, fileId),
            ),
          );
        }
        if (pendingImages.length > 0) {
          await attachFilesToPost(
            "news",
            editNewsId,
            pendingImages,
            existingImages.length,
          );
        }
        setIsSubmitting(false);
        navigation.goBack();
        return;
      }

      const res = await createNewsWithFiles(dto, pendingImages);
      setIsSubmitting(false);
      if (res) {
        showToast("공연소식이 등록되었습니다");
        navigation.dispatch?.(
          CommonActions.reset({
            index: 0,
            routes: [{ name: RootRoutes.CONTENT_TAB, params: { screen: ContentRoutes.CHAT } }],
          })
        );
      } else {
        Alert.alert("등록 실패", "공연소식 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      setIsSubmitting(false);
      Alert.alert("등록 실패", "공연소식 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const err = {
    title: submitAttempted && !title.trim(),
    content: submitAttempted && !content.trim(),
    place: submitAttempted && !placeValue.address.trim(),
    images: submitAttempted && !hasRequiredImages,
  };

  const isValid =
    !!title.trim() &&
    !!content.trim() &&
    !!placeValue.address.trim() &&
    hasRequiredImages;

  if (loadingEdit) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (bottom || 0) + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={scrollContentRef} collapsable={false}>
          <View ref={setFieldRef("title")} collapsable={false}>
            <FormTitleInput
              placeholder="공연 제목 (최대 100자)"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              hasError={err.title}
            />
          </View>

          {/* 1번 묶음: 제목 ~ 장소 */}
          <FormSection>
            <FormDateTimeRow
              label="시작"
              isRequired
              date={startedAt}
              onPressDate={() => setShowStartDatePicker(true)}
              onPressTime={() => setShowStartTimePicker(true)}
            />
            {/* '미정' 켜짐 = 종료일시 사용 안 함 (useEndDate false) */}
            <FormDateTimeRow
              label="종료"
              date={endedAt ?? startedAt}
              onPressDate={() => setShowEndDatePicker(true)}
              onPressTime={() => setShowEndTimePicker(true)}
              chipsDisabled={!useEndDate}
              trailing={
                <FormPillButton
                  label="미정"
                  selected={!useEndDate}
                  onPress={() => {
                    const next = !useEndDate;
                    setUseEndDate(next);
                    if (next && !endedAt) setEndedAt(startedAt);
                  }}
                />
              }
            />
            <View ref={setFieldRef("place")} collapsable={false}>
              <FormRow
                label="장소"
                isRequired
                error={err.place}
                below={
                  <JusoAddressField
                    placeholder="공연 장소의 주소를 입력하세요"
                    value={placeValue}
                    onChange={setPlaceValue}
                    hasError={err.place}
                  />
                }
              />
            </View>
          </FormSection>

          {/* 2번 묶음: 티켓 · 문의처 */}
          <FormGroupDivider />
          <FormSection divider={false}>
            <FormToggleRow
              label="무료 공연"
              value={isFreeTicket}
              onValueChange={(next) => {
                setIsFreeTicket(next);
                if (next) setTicketPrice("");
              }}
            />
            <FormInputRow
              label="티켓 가격"
              placeholder={isFreeTicket ? "무료 공연" : "선택 입력"}
              value={ticketPrice}
              onChangeText={(text) => setTicketPrice(text.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              suffix="원"
              disabled={isFreeTicket}
            />
            <FormInputRow
              label="문의처"
              placeholder="연락처 (최대 30자)"
              value={contact}
              onChangeText={setContact}
              maxLength={30}
              keyboardType="phone-pad"
            />
          </FormSection>

          {/* 3번 묶음: 내용 ~ 이미지 */}
          <FormGroupDivider />
          <FormSection divider={false}>
            <View ref={setFieldRef("content")} collapsable={false}>
              <FormTextAreaRow
                label="내용"
                isRequired
                error={err.content}
                placeholder="공연 소개, 일정 안내 등 내용을 입력하세요"
                value={content}
                onChangeText={setContent}
                maxLength={255}
                showCounter
              />
            </View>
          </FormSection>

          <FormSection divider={false}>
            <View ref={setFieldRef("images")} collapsable={false}>
              <FormPickerRow
                label="이미지"
                isRequired
                error={err.images}
                variant="disclosure"
                value={
                  existingImages.length + pendingImages.length > 0
                    ? `${existingImages.length + pendingImages.length}/${MAX_NEWS_IMAGES}`
                    : undefined
                }
                placeholder={`최소 1장 · 최대 ${MAX_NEWS_IMAGES}장`}
                onPress={pickImage}
                below={
                  <>
                    <FormImagePreviewList
                      items={[
                        ...existingImages.map((img) => ({
                          key: img.fileId,
                          uri: img.imgUrl,
                          onRemove: () => handleRemoveExistingImage(img.fileId),
                        })),
                        ...pendingImages.map((img, idx) => ({
                          key: `${img.uri}-${idx}`,
                          uri: img.uri,
                          onRemove: () =>
                            setPendingImages((prev) =>
                              prev.filter((_, i) => i !== idx),
                            ),
                        })),
                      ]}
                    />
                    <FormRowHelper>
                      {isEditMode && existingImages.length > 0 && pendingImages.length === 0
                        ? "기존 이미지가 있습니다. 새 이미지를 추가하지 않아도 됩니다."
                        : "등록 후 업로드됩니다"}
                    </FormRowHelper>
                  </>
                }
              />
            </View>
          </FormSection>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 4 }]}>
        <Pressable
          style={[styles.registerButton, (!isValid || isSubmitting) && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={FIXED_WHITE} />
          ) : (
            <Text style={styles.registerButtonText}>
              {isEditMode ? "수정 완료" : "등록하기"}
            </Text>
          )}
        </Pressable>
      </View>

      <WheelDateTimePickerModal
        visible={showStartDatePicker}
        value={startedAt}
        pickerMode="date"
        title="공연 시작일 선택"
        description="공연 시작 날짜를 선택하세요."
        onConfirm={(selected) => {
          setStartedAt((prev) => {
            const next = new Date(selected);
            next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
            return next;
          });
          setShowStartDatePicker(false);
        }}
        onCancel={() => setShowStartDatePicker(false)}
      />
      <WheelDateTimePickerModal
        visible={showStartTimePicker}
        value={startedAt}
        pickerMode="time"
        title="공연 시작 시간 선택"
        description="공연 시작 시간을 선택하세요."
        minuteInterval={5}
        onConfirm={(selected) => {
          setStartedAt((prev) => {
            const next = new Date(prev);
            next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
            return next;
          });
          setShowStartTimePicker(false);
        }}
        onCancel={() => setShowStartTimePicker(false)}
      />
      <WheelDateTimePickerModal
        visible={useEndDate && showEndDatePicker && !!endedAt}
        value={endedAt ?? startedAt}
        pickerMode="date"
        title="공연 종료일 선택"
        description="공연 종료 날짜를 선택하세요."
        minimumDate={startedAt}
        onConfirm={(selected) => {
          setEndedAt((prev) => {
            const base = prev ?? startedAt;
            const next = new Date(selected);
            next.setHours(base.getHours(), base.getMinutes(), 0, 0);
            return next;
          });
          setShowEndDatePicker(false);
        }}
        onCancel={() => setShowEndDatePicker(false)}
      />
      <WheelDateTimePickerModal
        visible={useEndDate && showEndTimePicker && !!endedAt}
        value={endedAt ?? startedAt}
        pickerMode="time"
        title="공연 종료 시간 선택"
        description="공연 종료 시간을 선택하세요."
        minuteInterval={5}
        onConfirm={(selected) => {
          setEndedAt((prev) => {
            const base = prev ?? startedAt;
            const next = new Date(base);
            next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
            return next;
          });
          setShowEndTimePicker(false);
        }}
        onCancel={() => setShowEndTimePicker(false)}
      />
    </View>
  );
};

export default MusicNewsRegistrationScreen;
