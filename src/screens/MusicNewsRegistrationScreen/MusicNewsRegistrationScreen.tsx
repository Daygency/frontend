import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import JusoAddressField from "../../components/juso/JusoAddressField/JusoAddressField";
import WheelDateTimePickerModal from "../../components/modals/WheelDateTimePickerModal";
import { GRAY, MAIN, WHITE } from "../../color";
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

function formatDateDisplay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function formatTimeDisplay(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function dateToISO(d: Date, timeOverride?: string): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const [hh = "00", mm = "00"] = (timeOverride ?? formatTimeDisplay(d)).split(":");
  return `${y}-${m}-${day}T${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00.000Z`;
}

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
    if (!content.trim()) return "content";
    if (!placeValue.address.trim()) return "place";
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
      startedAt: dateToISO(startedAt),
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
      ...(useEndDate && endedAt ? { endedAt: dateToISO(endedAt) } : {}),
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
        <View style={styles.formSection}>
          <View
            ref={setFieldRef("title")}
            collapsable={false}
            style={styles.formField}
          >
            <Form title="제목" isRequired hasError={err.title}>
              <FormTextInput
                placeholder="공연 제목을 입력하세요 (최대 100자)"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                hasError={err.title}
              />
            </Form>
          </View>

          <View
            ref={setFieldRef("content")}
            collapsable={false}
            style={styles.formField}
          >
            <Form title="내용" isRequired hasError={err.content}>
              <View style={[styles.contentInputWrapper, err.content && styles.inputErrorBorder]}>
                <TextInput
                  style={styles.contentInput}
                  placeholder="공연 소개, 일정 안내 등 내용을 입력하세요 (최대 255자)"
                  placeholderTextColor={GRAY.DARK_2}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  maxLength={255}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{content.length}/255</Text>
              </View>
            </Form>
          </View>

          <View
            ref={setFieldRef("place")}
            collapsable={false}
            style={styles.formField}
          >
            <Form title="장소" isRequired hasError={err.place}>
              <JusoAddressField
                placeholder="공연 장소의 주소를 입력하세요"
                value={placeValue}
                onChange={setPlaceValue}
                hasError={err.place}
              />
            </Form>
          </View>

          <View style={styles.formField}>
            <View style={styles.endDateToggleRow}>
              <Form title="티켓 가격" isRequired={false} />
              <Pressable
                style={styles.toggleButton}
                onPress={() => {
                  setIsFreeTicket((prev) => {
                    const next = !prev;
                    if (next) setTicketPrice("");
                    return next;
                  });
                }}
              >
                <Text style={styles.toggleText}>무료</Text>
                <MaterialCommunityIcons
                  name={isFreeTicket ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={20}
                  color={MAIN.DEFAULT}
                />
              </Pressable>
            </View>
            {!isFreeTicket ? (
              <FormTextInput
                placeholder="금액만 입력 (선택, 예: 30000)"
                value={ticketPrice}
                onChangeText={(text) => setTicketPrice(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
              />
            ) : (
              <View style={styles.freeTicketField}>
                <Text style={styles.freeTicketText}>무료 공연 (0원)</Text>
              </View>
            )}
          </View>

          <View style={styles.formField}>
            <Form title="공연 시작일시" isRequired>
              <View style={styles.datetimeRow}>
                <Pressable
                  style={styles.datePickerField}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>{formatDateDisplay(startedAt)}</Text>
                  <MaterialCommunityIcons name="calendar" size={20} color={GRAY.DARK_1} />
                </Pressable>
                <Pressable style={styles.datePickerField} onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.datePickerText}>{formatTimeDisplay(startedAt)}</Text>
                  <MaterialCommunityIcons name="clock-outline" size={20} color={GRAY.DARK_1} />
                </Pressable>
              </View>
            </Form>
          </View>

          <View style={styles.formField}>
            <View style={styles.endDateToggleRow}>
              <Form title="공연 종료일시" isRequired={false} />
              <Pressable
                style={styles.toggleButton}
                onPress={() => {
                  if (!useEndDate) return;
                  setUseEndDate(false);
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !useEndDate && { color: GRAY.DARK_2 },
                  ]}
                >
                  {useEndDate ? "사용함" : "사용 안 함"}
                </Text>
                <MaterialCommunityIcons
                  name={useEndDate ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={20}
                  color={useEndDate ? MAIN.DEFAULT : GRAY.DARK_2}
                />
              </Pressable>
            </View>
            {useEndDate && endedAt && (
              <View style={styles.datetimeRow}>
                <Pressable style={styles.datePickerField} onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.datePickerText}>{formatDateDisplay(endedAt)}</Text>
                  <MaterialCommunityIcons name="calendar" size={20} color={GRAY.DARK_1} />
                </Pressable>
                <Pressable style={styles.datePickerField} onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.datePickerText}>{formatTimeDisplay(endedAt)}</Text>
                  <MaterialCommunityIcons name="clock-outline" size={20} color={GRAY.DARK_1} />
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.formField}>
            <Form title="문의처">
              <FormTextInput
                placeholder="연락처를 입력하세요 (최대 30자)"
                value={contact}
                onChangeText={setContact}
                maxLength={30}
                keyboardType="phone-pad"
              />
            </Form>
          </View>

          <View
            ref={setFieldRef("images")}
            collapsable={false}
            style={styles.formField}
          >
            <Form title="이미지" isRequired hasError={err.images}>
              <Pressable
                style={[styles.imageAddRow, err.images && styles.inputErrorBorder]}
                onPress={pickImage}
              >
                <MaterialCommunityIcons
                  name="image-plus"
                  size={20}
                  color={GRAY.DARK_2}
                />
                <Text style={styles.imageAddText}>
                  이미지 추가 (필수, 최소 1장 · 최대 {MAX_NEWS_IMAGES}장)
                </Text>
              </Pressable>
              <Text style={styles.imageAddHint}>
                {isEditMode && existingImages.length > 0 && pendingImages.length === 0
                  ? "기존 이미지가 있습니다. 새 이미지를 추가하지 않아도 됩니다."
                  : "등록 후 업로드됩니다"}
              </Text>
              {existingImages.length > 0 || pendingImages.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagePreviewRow}
                  contentContainerStyle={{ paddingTop: 8 }}
                >
                  {existingImages.map((img) => (
                    <View key={img.fileId} style={styles.imagePreviewItem}>
                      <Image
                        source={{ uri: img.imgUrl }}
                        style={styles.imagePreviewThumb}
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={() => handleRemoveExistingImage(img.fileId)}
                        style={styles.imagePreviewRemove}
                        hitSlop={8}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={MAIN.DEFAULT}
                        />
                      </Pressable>
                    </View>
                  ))}
                  {pendingImages.map((img, idx) => (
                    <View
                      key={`${img.uri}-${idx}`}
                      style={styles.imagePreviewItem}
                    >
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.imagePreviewThumb}
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={() =>
                          setPendingImages((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        style={styles.imagePreviewRemove}
                        hitSlop={8}
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={MAIN.DEFAULT}
                        />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              ) : null}
            </Form>
          </View>
        </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 4 }]}>
        <Pressable
          style={[styles.registerButton, (!isValid || isSubmitting) && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={WHITE} />
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
