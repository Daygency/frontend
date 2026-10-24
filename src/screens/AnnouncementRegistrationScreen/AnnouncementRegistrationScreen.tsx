import { useNavigation, useRoute } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../contexts/ToastContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  FormDateTimeRow,
  FormImagePreviewList,
  FormInputRow,
  FormPickerRow,
  FormRow,
  FormRowHelper,
  FormSection,
  FormSegmentedControl,
  FormTextAreaRow,
  FormTitleInput,
  FormToggleRow,
} from "../../components/forms/FormRow";
import JusoAddressField from "../../components/juso/JusoAddressField/JusoAddressField";
import WheelDateTimePickerModal from "../../components/modals/WheelDateTimePickerModal";
import AnnouncementTypeSelectModal from "../../components/modals/AnnouncementTypeSelectModal";
import SelectableTag from "../../components/ui/SelectableTag";
import { GRAY, MAIN, RED, WHITE } from "../../color";
import styles from "./styles";
import {
  createAnnouncement,
  createAnnouncementWithFiles,
  deleteAnnouncementAttachment,
  getAnnouncementDetail,
  updateAnnouncement,
} from "../../lib/apis/announcement/announcementApi";
import { getApplicationsForPost } from "../../lib/apis/application/applicationApi";
import { MAX_MULTIPART_FILES } from "../../lib/apis/multipartPost";
import type {
  AnnouncementAttachmentItem,
  ApplicationConfig,
} from "../../lib/apis/announcement/types";
import {
  compensationModeFromPriceType,
  isAnnouncementPayAmountInvalid,
  normalizeAnnouncementPriceType,
  parseAnnouncementPrice,
  resolveAnnouncementPriceSubmit,
  type AnnouncementCompensationMode,
} from "../../lib/announcement/announcementPrice";
import { getAnnouncementCategories } from "../../lib/apis/announcement/categoryApi";
import { getMajors } from "../../lib/apis/announcement/majorApi";
import {
  buildMajorIdsForSubmit,
  isMajorOptionSelected,
  majorOptionKey,
  normalizeMajorSelectionKeys,
} from "../../lib/announcement/recruitmentMajors";
import { API_BASE } from "../../lib/apis/api";
import { attachFilesToPost, type LocalImageAsset } from "../../lib/apis/fileApi";
import { RootRoutes, ContentRoutes } from "../../navigations/routes";

const FALLBACK_CATEGORY_OPTIONS = [
  { label: "오디션(연주자모집)", value: "" },
  { label: "콩쿨(경연)", value: "" },
  { label: "입시평가회", value: "" },
  { label: "마스터클래스", value: "" },
  { label: "행사", value: "" },
  { label: "스탭구인", value: "" },
  { label: "기타", value: "" },
];

const FALLBACK_MAJOR_OPTIONS = [
  { label: "전공무관", value: "" },
  { label: "건반악기", value: "" },
  { label: "현악", value: "" },
  { label: "관악", value: "" },
  { label: "성악", value: "" },
  { label: "타악", value: "" },
  { label: "작곡", value: "" },
  { label: "지휘", value: "" },
  { label: "음악학", value: "" },
  { label: "국악", value: "" },
  { label: "무용", value: "" },
  { label: "실용", value: "" },
  { label: "뮤지컬·크로스오버", value: "" },
  { label: "기타", value: "" },
];

/** UI form field id -> API applicationConfig key */
const FORM_TO_APPLICATION_CONFIG: Record<
  string,
  keyof ApplicationConfig | null
> = {
  name: "includeName",
  birthYear: "includeBirth",
  gender: "includeGender",
  major: "includeMajor",
  detailMajor: "includeMajorDetail",
  education: "includeEducation",
  participationSection: "includeCategory",
  participatingSong: "includeMusic",
  photoVideoFile: "includeFile",
  link: "includeLink",
  experience: "includeCareer",
  selfIntroduction: "includeIntroduce",
  academyOrAdvisor: null,
};

/** API applicationConfig key -> form field id */
const APPLICATION_CONFIG_TO_FIELD: Record<
  keyof ApplicationConfig,
  string
> = {
  includeName: "name",
  includeBirth: "birthYear",
  includeGender: "gender",
  includeMajor: "major",
  includeMajorDetail: "detailMajor",
  includeEducation: "education",
  includeCategory: "participationSection",
  includeMusic: "participatingSong",
  includeFile: "photoVideoFile",
  includeLink: "link",
  includeCareer: "experience",
  includeIntroduce: "selfIntroduction",
};

function parseIsoToDate(iso: string | undefined): Date | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function buildApplicationConfig(
  formFields: Record<string, boolean>,
): ApplicationConfig {
  const config: ApplicationConfig = {
    includeName: false,
    includeBirth: false,
    includeGender: false,
    includeMajor: false,
    includeMajorDetail: false,
    includeEducation: false,
    includeCategory: false,
    includeMusic: false,
    includeFile: false,
    includeLink: false,
    includeCareer: false,
    includeIntroduce: false,
  };
  Object.entries(FORM_TO_APPLICATION_CONFIG).forEach(([fieldId, configKey]) => {
    if (configKey && formFields[fieldId]) {
      config[configKey] = true;
    }
  });
  return config;
}

function formatTimeDisplay(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function isPastSchedule(date: Date, time: Date): boolean {
  const combined = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    0,
    0,
  );
  return combined.getTime() < Date.now();
}

function dateToISO(d: Date, timeOverride?: string): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const [hh = "00", mm = "00"] = (timeOverride ?? formatTimeDisplay(d)).split(":");
  return `${y}-${m}-${day}T${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00.000Z`;
}

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
  { id: "photoVideoFile", label: "사진/영상/파일 제출" },
  { id: "link", label: "링크 첨부" },
  { id: "experience", label: "경력" },
  { id: "selfIntroduction", label: "자기소개/지원동기" },
] as const;

const DEFAULT_INCLUDED_FIELDS: Record<string, boolean> = {
  name: true,
  major: true,
  detailMajor: true,
  participationSection: true,
  selfIntroduction: true,
};

type TabType = "announcement" | "applicationForm";

type ValidationField =
  | "title"
  | "scheduledDate"
  | "announcementType"
  | "content"
  | "price"
  | "formConfig";

type AnnouncementRegistrationParams = { postId?: string };

const AnnouncementRegistrationScreen = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const route = useRoute();
  const postId = (route.params as { postId?: string } | undefined)?.postId;
  const isEditMode = !!postId;
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditMode ? "모집 공고 수정" : "모집 공고 등록",
    } as { headerTitle?: string });
  }, [navigation, isEditMode]);
  const [activeTab, setActiveTab] = useState<TabType>("announcement");
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const fieldRefs = useRef<Partial<Record<ValidationField, View | null>>>({});

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
  const now = new Date();
  const defaultScheduled = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0);
  const defaultDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [scheduledDate, setScheduledDate] = useState<Date>(defaultScheduled);
  const [scheduledTime, setScheduledTime] = useState<Date>(defaultScheduled);
  const [deadline, setDeadline] = useState<Date>(defaultDeadline);
  const [isOngoingRecruitment, setIsOngoingRecruitment] = useState(false);
  const [isScheduleUndecided, setIsScheduleUndecided] = useState(false);
  const [showScheduledDatePicker, setShowScheduledDatePicker] = useState(false);
  const [showScheduledTimePicker, setShowScheduledTimePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [locationValue, setLocationValue] = useState({
    address: "",
  });
  const [announcementType, setAnnouncementType] = useState(
    FALLBACK_CATEGORY_OPTIONS[0]?.value ?? "",
  );
  const [showAnnouncementTypeSheet, setShowAnnouncementTypeSheet] =
    useState(false);
  const [recruitmentMajors, setRecruitmentMajors] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [compensationMode, setCompensationMode] =
    useState<AnnouncementCompensationMode>("none");
  const [priceInput, setPriceInput] = useState("");

  // 지원서 양식 구성
  const [formFields, setFormFields] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    APPLICATION_FORM_FIELDS.forEach(({ id }) => {
      initial[id] = DEFAULT_INCLUDED_FIELDS[id] ?? false;
    });
    return initial;
  });
  const [formConfigConfirmed, setFormConfigConfirmed] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(
    FALLBACK_CATEGORY_OPTIONS,
  );
  const [majorOptions, setMajorOptions] = useState(FALLBACK_MAJOR_OPTIONS);
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  /** 신규 등록: README `POST /announcement` multipart (`payload` + `files`) / 수정: 저장 시 일괄 첨부 */
  const [createPostImages, setCreatePostImages] = useState<LocalImageAsset[]>(
    [],
  );
  const [existingImages, setExistingImages] = useState<
    AnnouncementAttachmentItem[]
  >([]);
  const [removedExistingFileIds, setRemovedExistingFileIds] = useState<
    string[]
  >([]);
  const MAX_POST_FILES = MAX_MULTIPART_FILES;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    getAnnouncementCategories().then((list) => {
      if (list.length > 0) {
        const opts = list.map((c) => ({
          label: c.name,
          value:
            (c as { categoryId?: string }).categoryId ??
            (c as { id?: string }).id ??
            "",
        }));
        setCategoryOptions(opts);
        setAnnouncementType((prev) =>
          prev === "" ? opts[0]?.value ?? "" : prev,
        );
      }
    });
    getMajors().then((list) => {
      if (list.length > 0) {
        setMajorOptions(
          list.map((m) => ({
            label: m.name,
            value:
              (m as { majorId?: string }).majorId ??
              (m as { id?: string }).id ??
              "",
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    setRecruitmentMajors((prev) => normalizeMajorSelectionKeys(prev, majorOptions));
  }, [majorOptions]);

  useEffect(() => {
    if (!postId) return;
    setLoadingEdit(true);
    let cancelled = false;
    (async () => {
      const appsRes = await getApplicationsForPost(postId);
      if (cancelled) return;
      if (appsRes?.ok && appsRes.data.length > 0) {
        setLoadingEdit(false);
        Alert.alert("알림", "지원자가 있는 공고는 수정할 수 없습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
        return;
      }
      const res = await getAnnouncementDetail(postId);
      if (cancelled) return;
      try {
        if (!res || typeof res !== "object") {
          setLoadingEdit(false);
          return;
        }
        const d = res as Record<string, unknown>;
        const completedRaw = d.completed ?? d.completed_manually;
        const isCompleted =
          typeof completedRaw === "boolean" ? completedRaw : false;
        if (isCompleted) {
          setLoadingEdit(false);
          Alert.alert("알림", "종료된 공고는 수정할 수 없습니다.", [
            { text: "확인", onPress: () => navigation.goBack() },
          ]);
          return;
        }
        const get = (k: string, alt?: string) =>
          (d[k] ?? d[k.replace(/([A-Z])/g, "_$1").toLowerCase() ?? ""] ?? alt) as
            | string
            | undefined;
        const getArr = (k: string) => {
          const v = d[k] ?? d[k.replace(/([A-Z])/g, "_$1").toLowerCase()];
          return Array.isArray(v) ? v : [];
        };
        const getObj = (k: string) => {
          const v = d[k] ?? d[k.replace(/([A-Z])/g, "_$1").toLowerCase()];
          return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
        };
        if (get("title")) setTitle(String(get("title") ?? ""));
        if (get("content")) setContent(String(get("content") ?? ""));
        if (get("address")) {
          setLocationValue({ address: String(get("address") ?? "") });
        }
        if (get("categoryId")) setAnnouncementType(String(get("categoryId") ?? ""));
        const majorIdsRaw = getArr("majorIds");
        if (majorIdsRaw.length > 0) {
          setRecruitmentMajors(majorIdsRaw.map((id) => String(id)));
        } else {
          const majorsNested = getArr("majors");
          if (majorsNested.length > 0) {
            const ids = majorsNested
              .map((m) => {
                if (typeof m === "string" || typeof m === "number") {
                  return String(m);
                }
                if (m && typeof m === "object") {
                  const o = m as Record<string, unknown>;
                  return String(
                    o.majorId ?? o.major_id ?? o.id ?? "",
                  ).trim();
                }
                return "";
              })
              .filter(Boolean);
            if (ids.length > 0) setRecruitmentMajors(ids);
          }
        }
        const sched = get("scheduledAt");
        if (sched) {
          const dt = new Date(sched);
          if (!isNaN(dt.getTime())) {
            setScheduledDate(dt);
            setScheduledTime(dt);
            setIsScheduleUndecided(false);
          }
        } else {
          setIsScheduleUndecided(true);
        }
        const dl = get("deadlineAt");
        if (dl) {
          const dt = new Date(dl);
          if (!isNaN(dt.getTime())) {
            setDeadline(dt);
            setIsOngoingRecruitment(false);
          }
        } else {
          setIsOngoingRecruitment(true);
        }
        const pt = get("priceType") ?? get("price_type");
        if (pt != null && String(pt).trim()) {
          const normalized = normalizeAnnouncementPriceType(pt);
          setCompensationMode(compensationModeFromPriceType(normalized));
        }
        const pr = d.price;
        if (typeof pr === "number" && Number.isFinite(pr)) {
          setPriceInput(pr > 0 ? String(pr) : "");
        } else if (pr != null && String(pr).trim() !== "") {
          const n = parseAnnouncementPrice(pr);
          setPriceInput(n > 0 ? String(n) : "");
        }
        const fid = get("fileId");
        if (fid) setFileId(fid);
        const attachmentsRaw = getArr("attachments");
        const parsedAttachments = attachmentsRaw
          .map((a, i) => {
            if (!a || typeof a !== "object") return null;
            const o = a as Record<string, unknown>;
            const img = o.imgUrl ?? o.img_url;
            const attFileId = o.fileId ?? o.file_id;
            if (typeof img !== "string" || !img.trim()) return null;
            return {
              fileId: String(attFileId ?? ""),
              imgUrl: img,
              sortOrder: Number(o.sortOrder ?? o.sort_order ?? i) || i,
            };
          })
          .filter(Boolean) as AnnouncementAttachmentItem[];
        setExistingImages(parsedAttachments);
        const ac = getObj("applicationConfig");
        if (Object.keys(ac).length > 0) {
          setFormConfigConfirmed(true);
          setFormFields((prev) => {
            const next = { ...prev };
            (
              Object.entries(APPLICATION_CONFIG_TO_FIELD) as [
                keyof ApplicationConfig,
                string,
              ][]
            ).forEach(([configKey, fieldId]) => {
              const val = ac[configKey];
              if (typeof val === "boolean" && fieldId in next) {
                next[fieldId] = val;
              }
            });
            return next;
          });
        }
      } catch (e) {
        console.warn("[loadEditData]", e);
        Alert.alert("알림", "공고 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingEdit(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, navigation]);

  const pickFileFromDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const uri = asset.uri;
      const name = asset.name ?? "file.jpg";
      const mimeType = asset.mimeType ?? "image/jpeg";
      if (createPostImages.length + existingImages.length >= MAX_POST_FILES) {
        Alert.alert("알림", `첨부는 최대 ${MAX_POST_FILES}개까지입니다.`);
        return;
      }
      setCreatePostImages((prev) => {
        const next = [...prev, { uri, name, type: mimeType }];
        setFileName(`${next.length}개 파일 선택됨`);
        return next;
      });
    } catch (e) {
      console.warn("[pickFileFromDocument]", e);
      Alert.alert("알림", "파일 선택에 실패했습니다.");
    }
  };

  const pickImageFromAlbum = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("알림", "앨범 접근 권한이 필요합니다.");
        return;
      }
      const remaining =
        MAX_POST_FILES - createPostImages.length - existingImages.length;
      if (remaining <= 0) {
        Alert.alert("알림", `첨부는 최대 ${MAX_POST_FILES}개까지입니다.`);
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
      setCreatePostImages((prev) => {
        const next = [...prev, ...toAdd];
        setFileName(`${next.length}개 이미지 선택됨`);
        return next;
      });
    } catch (e) {
      console.warn("[pickImageFromAlbum]", e);
      Alert.alert("알림", "이미지 선택에 실패했습니다.");
    }
  };

  /** X 버튼은 화면에서만 즉시 제거 — 실제 삭제는 "수정확인" 시 일괄 반영 */
  const handleRemoveExistingImage = (removeFileId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.fileId !== removeFileId));
    setRemovedExistingFileIds((prev) => [...prev, removeFileId]);
    setFileId((prev) => (prev === removeFileId ? null : prev));
  };

  const buildApplicationConfigPayload = (): ApplicationConfig =>
    buildApplicationConfig(formFields);

  const setFieldRef =
    (field: ValidationField) => (node: View | null) => {
      fieldRefs.current[field] = node;
    };

  const isPriceInvalid = () =>
    isAnnouncementPayAmountInvalid(compensationMode, priceInput);

  const getFirstInvalidField = (
    hasTypeError: boolean,
  ): ValidationField | null => {
    if (!title.trim()) return "title";
    if (!isScheduleUndecided && isPastSchedule(scheduledDate, scheduledTime))
      return "scheduledDate";
    if (hasTypeError) return "announcementType";
    if (isPriceInvalid()) return "price";
    if (!content.trim()) return "content";
    if (!formConfigConfirmed) return "formConfig";
    return null;
  };

  const scrollToValidationField = (field: ValidationField) => {
    const targetTab: TabType =
      field === "formConfig" ? "applicationForm" : "announcement";

    const doScroll = () => {
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

    if (activeTab !== targetTab) {
      setActiveTab(targetTab);
      contentOpacity.setValue(1);
      setTimeout(doScroll, 80);
      return;
    }
    requestAnimationFrame(doScroll);
  };

  const handleRegister = async () => {
    setSubmitAttempted(true);

    const resolvedSched = isScheduleUndecided
      ? null
      : dateToISO(scheduledDate, formatTimeDisplay(scheduledTime));
    const resolvedDeadline = dateToISO(deadline, "23:59");
    const hasTypeError = !categoryOptions.some(
      (o) => o.value === announcementType,
    );

    const firstInvalid = getFirstInvalidField(hasTypeError);
    if (firstInvalid) {
      scrollToValidationField(firstInvalid);
      return;
    }

    const { priceType, price: resolvedPrice } = resolveAnnouncementPriceSubmit(
      compensationMode,
      priceInput,
    );

    if (isSubmitting) return;

    const majorIdsPayload = buildMajorIdsForSubmit(
      recruitmentMajors,
      majorOptions,
    );
    if (recruitmentMajors.length > 0 && majorIdsPayload.length === 0) {
      console.warn(
        "[모집 전공] 서버에서 전공 ID 목록을 받지 못했습니다. EXPO_PUBLIC_API_BASE(백엔드가 /api 쓰면 …/api까지), EXPO_PUBLIC_MAJOR_PATH, 현재 API_BASE:",
        API_BASE,
      );
      Alert.alert(
        "모집 전공",
        "전공 정보를 불러오지 못해 저장할 수 없습니다. 네트워크와 서버 설정을 확인한 뒤 다시 시도해 주세요.",
      );
      return;
    }

    setIsSubmitting(true);

    const dto = {
      title: title.trim(),
      content: content.trim(),
      ...(isOngoingRecruitment
        ? { deadlineAt: null }
        : { deadlineAt: resolvedDeadline }),
      scheduledAt: resolvedSched,
      address: locationValue.address.trim() || "",
      categoryId: announcementType,
      status: "OPEN" as const,
      applicationConfig: buildApplicationConfigPayload(),
      priceType,
      price: resolvedPrice,
      ...(fileId ? { fileId } : {}),
      ...(majorIdsPayload.length > 0 ? { majorIds: majorIdsPayload } : {}),
    };

    try {
      if (isEditMode && postId) {
        const res = await updateAnnouncement(postId, dto);
        if (!res.ok) {
          setIsSubmitting(false);
          const fallback =
            res.status === 403
              ? "지원자가 있는 공고는 수정할 수 없습니다."
              : "모집공고 수정에 실패했습니다. 다시 시도해주세요.";
          Alert.alert("수정 실패", res.message?.trim() || fallback);
          return;
        }
        if (removedExistingFileIds.length > 0) {
          await Promise.all(
            removedExistingFileIds.map((removeFileId) =>
              deleteAnnouncementAttachment(postId, removeFileId),
            ),
          );
        }
        if (createPostImages.length > 0) {
          await attachFilesToPost(
            "announcement",
            postId,
            createPostImages,
            existingImages.length,
          );
        }
        setIsSubmitting(false);
        navigation.goBack();
      } else {
        const res =
          createPostImages.length > 0
            ? await createAnnouncementWithFiles(dto, createPostImages)
            : await createAnnouncement(dto);
        setIsSubmitting(false);
        if (res.ok) {
          showToast("모집공고가 등록되었습니다");
          (navigation as { dispatch?: (action: object) => void }).dispatch?.(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: RootRoutes.CONTENT_TAB,
                  params: { screen: ContentRoutes.ACTIVITY },
                },
              ],
            }),
          );
        } else {
          Alert.alert("등록 실패", res.message);
        }
      }
    } catch (e) {
      setIsSubmitting(false);
      const msg =
        e instanceof Error
          ? e.message
          : isEditMode
            ? "모집공고 수정에 실패했습니다."
            : "모집공고 등록에 실패했습니다.";
      Alert.alert(isEditMode ? "수정 실패" : "등록 실패", msg);
    }
  };

  const toggleFormFieldIncluded = (id: string) => {
    setFormFields((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const err = {
    title: submitAttempted && !title.trim(),
    scheduledDate:
      submitAttempted &&
      !isScheduleUndecided &&
      isPastSchedule(scheduledDate, scheduledTime),
    deadline: false,
    announcementType:
      submitAttempted &&
      !categoryOptions.some((o) => o.value === announcementType),
    content: submitAttempted && !content.trim(),
    price: submitAttempted && isPriceInvalid(),
    formConfig: submitAttempted && !formConfigConfirmed,
  };

  if (loadingEdit) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1F2A44" />
        <Text style={{ marginTop: 12, fontSize: 14, color: GRAY.DARK_2 }}>
          공고 정보를 불러오는 중...
        </Text>
      </View>
    );
  }

  const selectedMajorCount = majorOptions.filter((opt) =>
    isMajorOptionSelected(recruitmentMajors, opt),
  ).length;

  return (
    <View style={styles.container}>
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
          style={[
            styles.tab,
            activeTab === "applicationForm" && styles.tabActive,
          ]}
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
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (bottom || 0) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={scrollContentRef} collapsable={false}>
        <Animated.View style={{ opacity: contentOpacity }}>
          {activeTab === "announcement" ? (
            <>
              <View ref={setFieldRef("title")} collapsable={false}>
                <FormTitleInput
                  placeholder="공고명을 입력하세요"
                  value={title}
                  onChangeText={setTitle}
                  hasError={err.title}
                />
              </View>

              <FormSection>
                <View ref={setFieldRef("scheduledDate")} collapsable={false}>
                  <FormToggleRow
                    label="예정일 미정"
                    value={isScheduleUndecided}
                    onValueChange={setIsScheduleUndecided}
                  />
                  {!isScheduleUndecided ? (
                    <FormDateTimeRow
                      label="예정일"
                      isRequired
                      date={scheduledDate}
                      time={scheduledTime}
                      onPressDate={() => setShowScheduledDatePicker(true)}
                      onPressTime={() => setShowScheduledTimePicker(true)}
                      error={
                        err.scheduledDate
                          ? "예정일은 과거로 설정할 수 없습니다."
                          : false
                      }
                    />
                  ) : null}
                </View>
                <FormToggleRow
                  label="상시 모집"
                  value={isOngoingRecruitment}
                  onValueChange={setIsOngoingRecruitment}
                />
                {!isOngoingRecruitment ? (
                  <FormDateTimeRow
                    label="공고 마감일"
                    isRequired
                    date={deadline}
                    showTime={false}
                    onPressDate={() => setShowDeadlinePicker(true)}
                    error={err.deadline}
                  />
                ) : null}
                <FormRow
                  label="장소"
                  below={
                    <JusoAddressField
                      placeholder="주소를 입력하세요"
                      value={locationValue}
                      onChange={setLocationValue}
                    />
                  }
                />
              </FormSection>

              <FormSection>
                <View ref={setFieldRef("announcementType")} collapsable={false}>
                  <FormPickerRow
                    label="공고 유형"
                    isRequired
                    error={err.announcementType}
                    value={
                      categoryOptions.find((o) => o.value === announcementType)
                        ?.label
                    }
                    placeholder="선택"
                    onPress={() => setShowAnnouncementTypeSheet(true)}
                  />
                </View>
                <FormRow
                  label="모집 전공"
                  below={
                    <View style={styles.chipRow}>
                      {majorOptions.map((opt) => {
                        const optKey = majorOptionKey(opt);
                        return (
                          <SelectableTag
                            key={optKey}
                            label={opt.label}
                            selected={isMajorOptionSelected(recruitmentMajors, opt)}
                            onPress={() =>
                              setRecruitmentMajors((prev) =>
                                isMajorOptionSelected(prev, opt)
                                  ? prev.filter(
                                      (v) => v !== optKey && v !== opt.label,
                                    )
                                  : [...prev, optKey],
                              )
                            }
                          />
                        );
                      })}
                    </View>
                  }
                >
                  <Text style={styles.rowValueText}>
                    {selectedMajorCount > 0
                      ? `${selectedMajorCount}개 선택`
                      : "선택 안 함"}
                  </Text>
                </FormRow>
                <View ref={setFieldRef("price")} collapsable={false}>
                  <FormRow label="비용">
                    <FormSegmentedControl
                      value={compensationMode}
                      options={[
                        { label: "선택안함", value: "none" },
                        { label: "페이", value: "pay" },
                        { label: "비용협의", value: "negotiable" },
                      ]}
                      onChange={(mode) => {
                        setCompensationMode(mode);
                        if (mode !== "pay") setPriceInput("");
                      }}
                    />
                  </FormRow>
                  {compensationMode === "pay" ? (
                    <FormInputRow
                      label="금액"
                      placeholder="금액 입력"
                      value={priceInput}
                      onChangeText={setPriceInput}
                      keyboardType="number-pad"
                      suffix="원"
                      error={err.price}
                    />
                  ) : null}
                </View>
              </FormSection>

              <FormSection>
                <View ref={setFieldRef("content")} collapsable={false}>
                  <FormTextAreaRow
                    label="내용"
                    isRequired
                    error={err.content}
                    placeholder="연주자 모집, 대타 구인, 콩쿨, 입시평가회, 행사, 웨딩 오브리 등 모집 공고를 등록할 수 있어요."
                    value={content}
                    onChangeText={setContent}
                    footer="▲ 공연 소식 및 홍보는 '라운지'를 이용해주세요"
                  />
                </View>
              </FormSection>

              <FormSection title="사진/영상/파일">
                <FormPickerRow
                  label="파일에서 선택"
                  variant="disclosure"
                  onPress={pickFileFromDocument}
                />
                <FormPickerRow
                  label="앨범에서 선택"
                  variant="disclosure"
                  value={fileName}
                  onPress={pickImageFromAlbum}
                  below={
                    <>
                      <FormImagePreviewList
                        items={[
                          ...existingImages.map((img) => ({
                            key: img.fileId,
                            uri: img.imgUrl,
                            onRemove: () => handleRemoveExistingImage(img.fileId),
                          })),
                          ...createPostImages.map((img, idx) => ({
                            key: `${img.uri}-${idx}`,
                            uri: img.uri,
                            onRemove: () =>
                              setCreatePostImages((prev) => {
                                const next = prev.filter((_, i) => i !== idx);
                                setFileName(
                                  next.length > 0 ? `${next.length}개 첨부` : "",
                                );
                                return next;
                              }),
                          })),
                        ]}
                      />
                      <FormRowHelper>
                        {isEditMode
                          ? `추가한 이미지는 "수정확인" 시 저장됩니다. (최대 ${MAX_POST_FILES}장)`
                          : `등록 시 게시글이 저장된 뒤 이미지가 순서대로 업로드됩니다. (최대 ${MAX_POST_FILES}장)`}
                      </FormRowHelper>
                    </>
                  }
                />
              </FormSection>
            </>
          ) : (
            <>
              <FormSection
                divider={false}
                title="지원서에 포함"
                description="지원서에 포함할 항목을 선택해 주세요. 선택한 항목은 모두 필수 입력입니다."
              >
                {APPLICATION_FORM_FIELDS.map(({ id, label }) => (
                  <FormToggleRow
                    key={id}
                    label={label}
                    value={!!formFields[id]}
                    onValueChange={() => toggleFormFieldIncluded(id)}
                  />
                ))}
              </FormSection>

              <FormSection>
                <View ref={setFieldRef("formConfig")} collapsable={false}>
                  <FormRow
                    label="지원서 양식을 위와 같이 구성합니다"
                    isRequired
                    error={err.formConfig}
                    onPress={() => setFormConfigConfirmed(!formConfigConfirmed)}
                  >
                    <MaterialCommunityIcons
                      name={
                        formConfigConfirmed
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      size={24}
                      color={
                        formConfigConfirmed
                          ? MAIN.DEFAULT
                          : err.formConfig
                            ? RED.DEFAULT
                            : GRAY.DARK_1
                      }
                    />
                  </FormRow>
                </View>
              </FormSection>
            </>
          )}
        </Animated.View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 4 }]}>
        <Pressable
          style={[
            styles.registerButton,
            isSubmitting && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Text style={styles.registerButtonText}>
              {isEditMode ? "수정확인" : "등록하기"}
            </Text>
          )}
        </Pressable>
      </View>

      <AnnouncementTypeSelectModal
        visible={showAnnouncementTypeSheet}
        options={categoryOptions}
        selectedValue={announcementType}
        onSelect={(option) => {
          setAnnouncementType(option.value);
          setShowAnnouncementTypeSheet(false);
        }}
        onClose={() => setShowAnnouncementTypeSheet(false)}
      />
      <WheelDateTimePickerModal
        visible={showScheduledDatePicker}
        value={scheduledDate}
        pickerMode="date"
        title="예정일 선택"
        description="공고 예정일을 선택하세요."
        minimumDate={new Date()}
        onConfirm={(selected) => {
          setScheduledDate(selected);
          setShowScheduledDatePicker(false);
        }}
        onCancel={() => setShowScheduledDatePicker(false)}
      />
      <WheelDateTimePickerModal
        visible={showScheduledTimePicker}
        value={scheduledTime}
        pickerMode="time"
        title="예정 시간 선택"
        description="공고 예정 시간을 선택하세요."
        minuteInterval={5}
        onConfirm={(selected) => {
          setScheduledTime(selected);
          setShowScheduledTimePicker(false);
        }}
        onCancel={() => setShowScheduledTimePicker(false)}
      />
      <WheelDateTimePickerModal
        visible={showDeadlinePicker}
        value={deadline}
        pickerMode="date"
        title="공고 마감일 선택"
        description="공고 마감일을 선택하세요."
        minimumDate={scheduledDate}
        onConfirm={(selected) => {
          setDeadline(selected);
          setShowDeadlinePicker(false);
        }}
        onCancel={() => setShowDeadlinePicker(false)}
      />
    </View>
  );
};

export default AnnouncementRegistrationScreen;
