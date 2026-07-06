import { useNavigation, useRoute } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import Form from "../../components/forms/Form";
import FormTextInput from "../../components/forms/FormTextInput";
import FormDropdownInput from "../../components/forms/FormDropdownInput";
import KakaoLocationField from "../../components/kakao/KakaoLocationField/KakaoLocationField";
import WheelDateTimePickerModal from "../../components/modals/WheelDateTimePickerModal";
import { parseCoord } from "../../lib/kakao/location";
import SelectableTag from "../../components/ui/SelectableTag";
import { BLACK, GRAY, MAIN, WHITE } from "../../color";
import styles from "./styles";
import {
  createAnnouncement,
  createAnnouncementWithFiles,
  getAnnouncementDetail,
  updateAnnouncement,
} from "../../lib/apis/announcement/announcementApi";
import { getApplicationsForPost } from "../../lib/apis/application/applicationApi";
import { MAX_MULTIPART_FILES } from "../../lib/apis/multipartPost";
import type {
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
import { getFileId, uploadFile, type LocalImageAsset } from "../../lib/apis/fileApi";
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
  | "announcementType"
  | "content"
  | "price"
  | "formConfig";

type AnnouncementRegistrationParams = { postId?: string };

const AnnouncementRegistrationScreen = () => {
  const navigation = useNavigation();
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
  const [showScheduledDatePicker, setShowScheduledDatePicker] = useState(false);
  const [showScheduledTimePicker, setShowScheduledTimePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [locationValue, setLocationValue] = useState({
    address: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [announcementType, setAnnouncementType] = useState(
    FALLBACK_CATEGORY_OPTIONS[0]?.value ?? "",
  );
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
  /** 신규 등록: README `POST /announcement` multipart (`payload` + `files`) */
  const [createPostImages, setCreatePostImages] = useState<LocalImageAsset[]>(
    [],
  );
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
          const dRecord = d;
          setLocationValue({
            address: String(get("address") ?? ""),
            latitude: parseCoord(dRecord.latitude),
            longitude: parseCoord(dRecord.longitude),
          });
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
          }
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
        if (fid) {
          setFileId(fid);
          setFileName("(기존 파일)");
        }
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
      if (isEditMode) {
        setFileName(name);
        const up = await uploadFile(uri, { name, type: mimeType });
        setFileId(getFileId(up));
        if (!getFileId(up)) {
          Alert.alert("알림", "파일 업로드에 실패했습니다.");
        }
      } else {
        if (createPostImages.length >= MAX_POST_FILES) {
          Alert.alert("알림", `첨부는 최대 ${MAX_POST_FILES}개까지입니다.`);
          return;
        }
        setCreatePostImages((prev) => {
          const next = [...prev, { uri, name, type: mimeType }];
          setFileName(`${next.length}개 파일 선택됨`);
          return next;
        });
      }
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        allowsMultipleSelection: !isEditMode,
        selectionLimit: isEditMode ? 1 : MAX_POST_FILES,
      });
      if (result.canceled) return;

      if (isEditMode) {
        const asset = result.assets[0];
        setFileName(asset.fileName ?? "image.jpg");
        const up = await uploadFile(asset.uri, {
          name: asset.fileName ?? "image.jpg",
          type: asset.mimeType ?? "image/jpeg",
        });
        setFileId(getFileId(up));
        if (!getFileId(up)) {
          Alert.alert("알림", "이미지 업로드에 실패했습니다.");
        }
        return;
      }

      const remaining = MAX_POST_FILES - createPostImages.length;
      if (remaining <= 0) {
        Alert.alert("알림", `첨부는 최대 ${MAX_POST_FILES}개까지입니다.`);
        return;
      }
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

    const resolvedSched = dateToISO(
      scheduledDate,
      formatTimeDisplay(scheduledTime),
    );
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
      ...(locationValue.latitude != null && locationValue.longitude != null
        ? {
            latitude: locationValue.latitude,
            longitude: locationValue.longitude,
          }
        : {}),
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
        setIsSubmitting(false);
        if (res.ok) {
          navigation.goBack();
        } else {
          const fallback =
            res.status === 403
              ? "지원자가 있는 공고는 수정할 수 없습니다."
              : "모집공고 수정에 실패했습니다. 다시 시도해주세요.";
          Alert.alert("수정 실패", res.message?.trim() || fallback);
        }
      } else {
        const res =
          createPostImages.length > 0
            ? await createAnnouncementWithFiles(dto, createPostImages)
            : await createAnnouncement(dto);
        setIsSubmitting(false);
        if (res.ok) {
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

  const isFormValid =
    !!title.trim() &&
    categoryOptions.some((o) => o.value === announcementType) &&
    !!content.trim() &&
    formConfigConfirmed;

  const err = {
    title: submitAttempted && !title.trim(),
    scheduledDate: false,
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
              <View style={styles.formSection}>
                <View
                  ref={setFieldRef("title")}
                  collapsable={false}
                  style={styles.formField}
                >
                  <Form title="공고명" isRequired hasError={err.title}>
                    <FormTextInput
                      placeholder="공고명을 입력하세요"
                      value={title}
                      onChangeText={setTitle}
                      hasError={err.title}
                    />
                  </Form>
                </View>

                <View style={styles.formField}>
                  <View style={styles.scheduleLocationBox}>
                    <View style={styles.scheduleField}>
                      <Form
                        title="예정일"
                        isRequired
                        hasError={err.scheduledDate}
                      >
                        <View>
                          <Pressable
                            style={[
                              styles.datePickerField,
                              err.scheduledDate && styles.inputErrorBorder,
                            ]}
                            onPress={() => setShowScheduledDatePicker(true)}
                          >
                            <Text style={styles.datePickerText}>
                              {formatDateDisplay(scheduledDate)}
                            </Text>
                            <MaterialCommunityIcons
                              name="calendar"
                              size={20}
                              color={GRAY.DARK_1}
                            />
                          </Pressable>
                        </View>
                      </Form>
                    </View>
                    <View style={styles.scheduleField}>
                      <Form title="예정 시간" isRequired={false}>
                        <Pressable
                          style={styles.datePickerField}
                          onPress={() => setShowScheduledTimePicker(true)}
                        >
                          <Text style={styles.datePickerText}>
                            {formatTimeDisplay(scheduledTime)}
                          </Text>
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={20}
                            color={GRAY.DARK_1}
                          />
                        </Pressable>
                      </Form>
                    </View>
                    <View style={styles.scheduleField}>
                      <View style={styles.deadlineHeaderRow}>
                        <Form
                          title="공고 마감일"
                          isRequired={!isOngoingRecruitment}
                          hasError={err.deadline}
                        />
                        <Pressable
                          style={styles.toggleButton}
                          onPress={() =>
                            setIsOngoingRecruitment((prev) => !prev)
                          }
                        >
                          <Text style={styles.toggleText}>상시 모집</Text>
                          <MaterialCommunityIcons
                            name={
                              isOngoingRecruitment
                                ? "checkbox-marked"
                                : "checkbox-blank-outline"
                            }
                            size={20}
                            color={MAIN.DEFAULT}
                          />
                        </Pressable>
                      </View>
                      <Pressable
                        style={[
                          styles.datePickerField,
                          isOngoingRecruitment && styles.datePickerFieldDisabled,
                          err.deadline && styles.inputErrorBorder,
                        ]}
                        onPress={() => {
                          if (!isOngoingRecruitment) {
                            setShowDeadlinePicker(true);
                          }
                        }}
                        disabled={isOngoingRecruitment}
                      >
                        <Text
                          style={[
                            styles.datePickerText,
                            isOngoingRecruitment &&
                              styles.datePickerTextDisabled,
                          ]}
                        >
                          {isOngoingRecruitment
                            ? "상시 모집"
                            : formatDateDisplay(deadline)}
                        </Text>
                        <MaterialCommunityIcons
                          name="calendar"
                          size={20}
                          color={
                            isOngoingRecruitment ? GRAY.DARK_2 : GRAY.DARK_1
                          }
                        />
                      </Pressable>
                    </View>
                    <View style={styles.scheduleField}>
                      <Form title="장소" isRequired={false}>
                        <KakaoLocationField
                          placeholder="장소를 입력하세요"
                          value={locationValue}
                          onChange={setLocationValue}
                        />
                      </Form>
                    </View>
                  </View>
                </View>

                <View
                  ref={setFieldRef("announcementType")}
                  collapsable={false}
                  style={styles.formField}
                >
                  <Form title="공고 유형" isRequired hasError={err.announcementType}>
                    <FormDropdownInput
                      placeholder="공고 유형을 선택하세요"
                      data={categoryOptions}
                      value={announcementType}
                      onChange={(item) => setAnnouncementType(item.value)}
                      hasError={err.announcementType}
                    />
                  </Form>
                </View>

                <View style={styles.formField}>
                  <Form title="모집 전공" isRequired={false}>
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
                  </Form>
                </View>

                <View
                  ref={setFieldRef("price")}
                  collapsable={false}
                  style={styles.formField}
                >
                  <Form title="비용" isRequired={false} hasError={err.price}>
                    <View style={styles.chipRow}>
                      <SelectableTag
                        label="선택안함"
                        selected={compensationMode === "none"}
                        onPress={() => {
                          setCompensationMode("none");
                          setPriceInput("");
                        }}
                      />
                      <SelectableTag
                        label="페이"
                        selected={compensationMode === "pay"}
                        onPress={() => setCompensationMode("pay")}
                      />
                      <SelectableTag
                        label="비용협의"
                        selected={compensationMode === "negotiable"}
                        onPress={() => {
                          setCompensationMode("negotiable");
                          setPriceInput("");
                        }}
                      />
                    </View>
                    {compensationMode === "pay" ? (
                      <View style={{ marginTop: 12 }}>
                        <FormTextInput
                          placeholder="금액(원)을 입력하세요"
                          value={priceInput}
                          onChangeText={setPriceInput}
                          keyboardType="number-pad"
                          hasError={err.price}
                        />
                      </View>
                    ) : null}
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
                      <Pressable
                        style={styles.fileOptionItem}
                        hitSlop={10}
                        onPress={pickFileFromDocument}
                      >
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
                      <Pressable
                        style={styles.fileOptionItem}
                        hitSlop={10}
                        onPress={pickImageFromAlbum}
                      >
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
                    {isEditMode ? (
                      fileName ? (
                        <Text style={styles.fileHelperNote}>
                          선택됨: {fileName}
                        </Text>
                      ) : null
                    ) : (
                      <>
                        {fileName ? (
                          <Text style={styles.fileHelperNote}>{fileName}</Text>
                        ) : null}
                        {createPostImages.length > 0 ? (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8 }}
                          >
                            {createPostImages.map((img, idx) => (
                              <View
                                key={`${img.uri}-${idx}`}
                                style={{
                                  marginRight: 8,
                                  position: "relative",
                                }}
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
                                    setCreatePostImages((prev) => {
                                      const next = prev.filter((_, i) => i !== idx);
                                      setFileName(
                                        next.length > 0
                                          ? `${next.length}개 첨부`
                                          : "",
                                      );
                                      return next;
                                    })
                                  }
                                  style={{
                                    position: "absolute",
                                    top: -6,
                                    right: -6,
                                    backgroundColor: "#fff",
                                    borderRadius: 12,
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
                        <Text style={styles.fileHelperNote}>
                          등록 시 게시글이 저장된 뒤 이미지가 순서대로 업로드됩니다. (최대{" "}
                          {MAX_POST_FILES}장)
                        </Text>
                      </>
                    )}
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
                지원서에 포함할 항목을 선택해 주세요. 선택한 항목은 모두 필수
                입력입니다.
              </Text>

              <Text style={styles.formFieldHeader}>지원서에 포함</Text>

              {APPLICATION_FORM_FIELDS.map(({ id, label }) => (
                <View key={id} style={styles.applicationFormItem}>
                  <Pressable
                    style={[
                      styles.checkbox,
                      formFields[id] && styles.checkboxChecked,
                    ]}
                    onPress={() => toggleFormFieldIncluded(id)}
                  >
                    {formFields[id] && (
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color={WHITE}
                      />
                    )}
                  </Pressable>
                  <Text style={styles.applicationFormLabel}>{label}</Text>
                </View>
              ))}

              <Pressable
                ref={setFieldRef("formConfig")}
                collapsable={false}
                style={styles.confirmRow}
                onPress={() => setFormConfigConfirmed(!formConfigConfirmed)}
              >
                <View
                  style={[
                    styles.radio,
                    formConfigConfirmed && styles.radioChecked,
                    err.formConfig && styles.radioError,
                  ]}
                >
                  {formConfigConfirmed && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.confirmText}>
                  지원서 양식을 위와 같이 구성합니다. *
                </Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 4 }]}>
        <Pressable
          style={[
            styles.registerButton,
            !isFormValid && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>
            {isEditMode ? "수정확인" : "등록하기"}
          </Text>
        </Pressable>
      </View>

      <WheelDateTimePickerModal
        visible={showScheduledDatePicker}
        value={scheduledDate}
        pickerMode="date"
        title="예정일 선택"
        description="공고 예정일을 선택하세요."
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
