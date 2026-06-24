import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Form from "../../components/forms/Form";
import FormTextInput from "../../components/forms/FormTextInput";
import KakaoLocationField from "../../components/kakao/KakaoLocationField/KakaoLocationField";
import { parseCoord } from "../../lib/kakao/location";
import { GRAY, MAIN, WHITE } from "../../color";
import styles from "./styles";
import { createNewsWithFiles, getNewsDetail, updateNews, MAX_NEWS_IMAGE_FILES } from "../../lib/apis/news/newsApi";
import type { LocalImageAsset } from "../../lib/apis/fileApi";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../../lib/media/attachmentImageUrl";
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

const MusicNewsRegistrationScreen = () => {
  const navigation = useNavigation<any>();
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
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [ticketPrice, setTicketPrice] = useState("");
  const [isFreeTicket, setIsFreeTicket] = useState(false);
  const [startedAt, setStartedAt] = useState<Date>(defaultStart);
  const [endedAt, setEndedAt] = useState<Date | null>(null);
  const [useEndDate, setUseEndDate] = useState(false);
  const [contact, setContact] = useState("");
  /** README: multipart 한 번에 `payload` + `files` */
  const [pendingImages, setPendingImages] = useState<LocalImageAsset[]>([]);
  const [hasExistingImages, setHasExistingImages] = useState(false);
  const MAX_NEWS_IMAGES = MAX_NEWS_IMAGE_FILES;

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editNewsId));

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
      setPlaceValue({
        address: detail.place ?? "",
        latitude: parseCoord(detail.latitude),
        longitude: parseCoord(detail.longitude),
      });
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
      }
      const existingUrls = mapAttachmentsToImageUrls(detail.attachments);
      const fromFile = pickUrlFromFileLike(
        detail.file ? (detail.file as Record<string, unknown>) : null,
      );
      setHasExistingImages(existingUrls.length > 0 || Boolean(fromFile));
      setLoadingEdit(false);
    })();
  }, [editNewsId, navigation]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "앨범 접근 권한이 필요합니다.");
        return;
      }
      const remaining = MAX_NEWS_IMAGES - pendingImages.length;
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

  const handleRegister = async () => {
    setSubmitAttempted(true);

    const hasRequiredImages = isEditMode
      ? hasExistingImages || pendingImages.length > 0
      : pendingImages.length > 0;

    if (
      !title.trim() ||
      !content.trim() ||
      !placeValue.address.trim() ||
      !hasRequiredImages
    ) {
      const missing: string[] = [];
      if (!title.trim()) missing.push("제목");
      if (!content.trim()) missing.push("내용");
      if (!placeValue.address.trim()) missing.push("장소");
      if (!hasRequiredImages) missing.push("이미지 (최소 1장)");
      Alert.alert("입력 확인", `다음 항목을 확인해주세요:\n\n${missing.join("\n")}`);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const dto = {
      title: title.trim(),
      content: content.trim().slice(0, 255),
      place: placeValue.address.trim().slice(0, 100),
      ...(placeValue.latitude != null && placeValue.longitude != null
        ? {
            latitude: placeValue.latitude,
            longitude: placeValue.longitude,
          }
        : {}),
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
        setIsSubmitting(false);
        if (updated) {
          navigation.goBack();
        } else {
          Alert.alert("수정 실패", "공연소식 수정에 실패했습니다. 다시 시도해주세요.");
        }
        return;
      }

      const res = await createNewsWithFiles(dto, pendingImages);
      setIsSubmitting(false);
      if (res) {
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

  const hasRequiredImages = isEditMode
    ? hasExistingImages || pendingImages.length > 0
    : pendingImages.length > 0;

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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (bottom || 0) + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <View style={styles.formField}>
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

          <View style={styles.formField}>
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

          <View style={styles.formField}>
            <Form title="장소" isRequired hasError={err.place}>
              <KakaoLocationField
                placeholder="공연 장소를 입력하세요"
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
              {showStartDatePicker && (
                <DateTimePicker
                  value={startedAt}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selected) => {
                    if (selected) setStartedAt(selected);
                    if (Platform.OS === "android") setShowStartDatePicker(false);
                  }}
                />
              )}
              {showStartTimePicker && (
                <DateTimePicker
                  value={startedAt}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selected) => {
                    if (selected) setStartedAt(selected);
                    if (Platform.OS === "android") setShowStartTimePicker(false);
                  }}
                />
              )}
            </Form>
          </View>

          <View style={styles.formField}>
            <View style={styles.endDateToggleRow}>
              <Form title="공연 종료일시" isRequired={false} />
              <Pressable
                style={styles.toggleButton}
                onPress={() => {
                  setUseEndDate(!useEndDate);
                  if (!useEndDate && !endedAt) setEndedAt(startedAt);
                }}
              >
                <Text style={styles.toggleText}>{useEndDate ? "사용함" : "사용 안 함"}</Text>
                <MaterialCommunityIcons
                  name={useEndDate ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={20}
                  color={MAIN.DEFAULT}
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
            {useEndDate && showEndDatePicker && endedAt && (
              <DateTimePicker
                value={endedAt}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  if (selected) setEndedAt(selected);
                  if (Platform.OS === "android") setShowEndDatePicker(false);
                }}
              />
            )}
            {useEndDate && showEndTimePicker && endedAt && (
              <DateTimePicker
                value={endedAt}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  if (selected) setEndedAt(selected);
                  if (Platform.OS === "android") setShowEndTimePicker(false);
                }}
              />
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

          <View style={styles.formField}>
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
                {isEditMode && hasExistingImages && pendingImages.length === 0
                  ? "기존 이미지가 있습니다. 새 이미지를 추가하지 않아도 됩니다."
                  : "등록 후 업로드됩니다"}
              </Text>
              {pendingImages.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagePreviewRow}
                >
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
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 16 }]}>
        <Pressable
          style={[styles.registerButton, (!isValid || isSubmitting) && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={!isValid || isSubmitting}
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
    </View>
  );
};

export default MusicNewsRegistrationScreen;
