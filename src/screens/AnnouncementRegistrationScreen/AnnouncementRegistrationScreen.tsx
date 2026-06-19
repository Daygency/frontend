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
  Switch,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import Form from "../../components/Form/Form";
import FormTextInput from "../../components/FormTextInput/FormTextInput";
import FormDropdownInput from "../../components/FormDropdownInput/FormDropdownInput";
import SelectableTag from "../../components/SelectableTag/SelectableTag";
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
  AnnouncementPriceType,
  ApplicationConfig,
} from "../../lib/apis/announcement/types";
import {
  PRICE_TYPE_DROPDOWN_ITEMS,
  normalizeAnnouncementPriceType,
  parseAnnouncementPrice,
} from "../../lib/announcement/announcementPrice";
import { getAnnouncementCategories } from "../../lib/apis/announcement/categoryApi";
import { getMajors } from "../../lib/apis/announcement/majorApi";
import { buildMajorIdsForSubmit } from "../../lib/announcement/recruitmentMajors";
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
  deliveryAddress: "includeAddress",
  photoVideoFile: "includeFile",
  link: "includeLink",
  affiliatedDepartment: "includeDepartment",
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
  includeAddress: "deliveryAddress",
  includeFile: "photoVideoFile",
  includeLink: "link",
  includeDepartment: "affiliatedDepartment",
  includeCareer: "experience",
  includeIntroduce: "selfIntroduction",
};

function parseIsoToDate(iso: string | undefined): Date | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function buildApplicationConfig(
  formFields: Record<string, { included: boolean; required: boolean }>,
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
    includeAddress: false,
    includeFile: false,
    includeLink: false,
    includeDepartment: false,
    includeCareer: false,
    includeIntroduce: false,
  };
  Object.entries(FORM_TO_APPLICATION_CONFIG).forEach(([fieldId, configKey]) => {
    if (configKey && formFields[fieldId]?.included) {
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
  const [showScheduledDatePicker, setShowScheduledDatePicker] = useState(false);
  const [showScheduledTimePicker, setShowScheduledTimePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [announcementType, setAnnouncementType] = useState(
    FALLBACK_CATEGORY_OPTIONS[0]?.value ?? "",
  );
  const [recruitmentMajors, setRecruitmentMajors] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [priceType, setPriceType] = useState<AnnouncementPriceType>("PENDING");
  const [priceInput, setPriceInput] = useState("");

  // 지원서 양식 구성
  const [formFields, setFormFields] = useState<
    Record<string, { included: boolean; required: boolean }>
  >(() => {
    const initial: Record<string, { included: boolean; required: boolean }> =
      {};
    APPLICATION_FORM_FIELDS.forEach(({ id }) => {
      initial[id] = DEFAULT_FORM_FIELDS[
        id as keyof typeof DEFAULT_FORM_FIELDS
      ] ?? {
        included: false,
        required: false,
      };
    });
    return initial;
  });
  const [formConfigConfirmed, setFormConfigConfirmed] = useState(true);
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
        if (get("address")) setLocation(String(get("address") ?? ""));
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
          if (!isNaN(dt.getTime())) setDeadline(dt);
        }
        const pt = get("priceType") ?? get("price_type");
        if (pt != null && String(pt).trim()) {
          setPriceType(normalizeAnnouncementPriceType(pt));
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
          setFormFields((prev) => {
            const next = { ...prev };
            (
              Object.entries(APPLICATION_CONFIG_TO_FIELD) as [
                keyof ApplicationConfig,
                string,
              ][]
            ).forEach(([configKey, fieldId]) => {
              const val = ac[configKey];
              if (typeof val === "boolean" && next[fieldId]) {
                next[fieldId] = { ...next[fieldId], included: val };
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

  const buildApplicationConfig = (): ApplicationConfig => {
    const defaults: ApplicationConfig = {
      includeName: false,
      includeBirth: false,
      includeGender: false,
      includeMajor: false,
      includeMajorDetail: false,
      includeEducation: false,
      includeCategory: false,
      includeMusic: false,
      includeAddress: false,
      includeFile: false,
      includeLink: false,
      includeDepartment: false,
      includeCareer: false,
      includeIntroduce: false,
    };
    (
      Object.entries(FORM_TO_APPLICATION_CONFIG) as [
        string,
        keyof ApplicationConfig | null,
      ][]
    ).forEach(([fieldId, configKey]) => {
      if (configKey && formFields[fieldId]?.included) {
        defaults[configKey] = true;
      }
    });
    return defaults;
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

    if (
      !title.trim() ||
      hasTypeError ||
      !content.trim() ||
      !formConfigConfirmed
    ) {
      const missing: string[] = [];
      if (!title.trim()) missing.push("공고명");
      if (hasTypeError) missing.push("공고 유형");
      if (!content.trim()) missing.push("내용");
      if (!formConfigConfirmed) missing.push("지원서 양식 확인");
      Alert.alert(
        "입력 확인",
        `다음 항목을 확인해주세요:\n\n${missing.join("\n")}`,
      );
      return;
    }

    let resolvedPrice = 0;
    if (priceType === "EXPENSE" || priceType === "INCOME") {
      const trimmed = priceInput.trim().replace(/,/g, "");
      if (!trimmed) {
        Alert.alert("입력 확인", "참가비·수입 유형일 때는 금액(원)을 입력해주세요.");
        return;
      }
      const n = parseInt(trimmed, 10);
      if (!Number.isFinite(n) || n < 0) {
        Alert.alert("입력 확인", "금액을 0 이상의 숫자로 입력해주세요.");
        return;
      }
      resolvedPrice = n;
    }

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
      deadlineAt: resolvedDeadline,
      scheduledAt: resolvedSched,
      address: location.trim() || "",
      categoryId: announcementType,
      status: "OPEN" as const,
      applicationConfig: buildApplicationConfig(),
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
        if (res) {
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
          Alert.alert(
            "등록 실패",
            "모집공고 등록에 실패했습니다. 다시 시도해주세요.",
          );
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

  const updateFormField = (
    id: string,
    field: "included" | "required",
    value: boolean,
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
                  <Form title="일정/장소" isRequired>
                    <View style={styles.scheduleLocationBox}>
                      <View style={styles.scheduleField}>
                        <Form title="예정일" isRequired hasError={err.scheduledDate}>
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
                            {showScheduledDatePicker && (
                              <>
                                <DateTimePicker
                                  value={scheduledDate}
                                  mode="date"
                                  display={Platform.OS === "ios" ? "spinner" : "default"}
                                  onChange={(_, selected) => {
                                    if (selected) setScheduledDate(selected);
                                    if (Platform.OS === "android")
                                      setShowScheduledDatePicker(false);
                                  }}
                                />
                                {Platform.OS === "ios" && (
                                  <Pressable
                                    style={styles.datePickerConfirmButton}
                                    onPress={() => setShowScheduledDatePicker(false)}
                                  >
                                    <Text style={styles.datePickerConfirmText}>
                                      확인
                                    </Text>
                                  </Pressable>
                                )}
                              </>
                            )}
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
                          {showScheduledTimePicker && (
                            <>
                              <DateTimePicker
                                value={scheduledTime}
                                mode="time"
                                display={
                                  Platform.OS === "ios" ? "spinner" : "default"
                                }
                                onChange={(_, selected) => {
                                  if (selected) setScheduledTime(selected);
                                  if (Platform.OS === "android")
                                    setShowScheduledTimePicker(false);
                                }}
                              />
                              {Platform.OS === "ios" && (
                                <Pressable
                                  style={styles.datePickerConfirmButton}
                                  onPress={() => setShowScheduledTimePicker(false)}
                                >
                                  <Text style={styles.datePickerConfirmText}>
                                    확인
                                  </Text>
                                </Pressable>
                              )}
                            </>
                          )}
                        </Form>
                      </View>
                      <View style={styles.scheduleField}>
                        <Form title="공고 마감일" isRequired hasError={err.deadline}>
                          <View>
                            <Pressable
                              style={[
                                styles.datePickerField,
                                err.deadline && styles.inputErrorBorder,
                              ]}
                              onPress={() => setShowDeadlinePicker(true)}
                            >
                              <Text style={styles.datePickerText}>
                                {formatDateDisplay(deadline)}
                              </Text>
                              <MaterialCommunityIcons
                                name="calendar"
                                size={20}
                                color={GRAY.DARK_1}
                              />
                            </Pressable>
                            {showDeadlinePicker && (
                              <View>
                                <DateTimePicker
                                  value={deadline}
                                  mode="date"
                                  display={
                                    Platform.OS === "ios" ? "spinner" : "default"
                                  }
                                  onChange={(_, selected) => {
                                    if (selected) setDeadline(selected);
                                    if (Platform.OS === "android")
                                      setShowDeadlinePicker(false);
                                  }}
                                />
                                {Platform.OS === "ios" && (
                                  <Pressable
                                    style={styles.datePickerConfirmButton}
                                    onPress={() => setShowDeadlinePicker(false)}
                                  >
                                    <Text style={styles.datePickerConfirmText}>
                                      확인
                                    </Text>
                                  </Pressable>
                                )}
                              </View>
                            )}
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
                        const optKey = opt.value || opt.label;
                        return (
                          <SelectableTag
                            key={optKey}
                            label={opt.label}
                            selected={recruitmentMajors.includes(optKey)}
                            onPress={() =>
                              setRecruitmentMajors((prev) =>
                                prev.includes(optKey)
                                  ? prev.filter((v) => v !== optKey)
                                  : [...prev, optKey],
                              )
                            }
                          />
                        );
                      })}
                    </View>
                  </Form>
                </View>

                <View style={styles.formField}>
                  <Form title="금액 유형 · 금액" isRequired={false}>
                    <FormDropdownInput
                      placeholder="금액 유형을 선택하세요"
                      data={PRICE_TYPE_DROPDOWN_ITEMS}
                      value={priceType}
                      onChange={(item) =>
                        setPriceType(item.value as AnnouncementPriceType)
                      }
                    />
                    {(priceType === "EXPENSE" || priceType === "INCOME") ? (
                      <View style={{ marginTop: 12 }}>
                        <FormTextInput
                          placeholder="금액(원)을 입력하세요"
                          value={priceInput}
                          onChangeText={setPriceInput}
                          keyboardType="number-pad"
                        />
                      </View>
                    ) : null}
                  </Form>
                </View>

                <View style={styles.formField}>
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
                지원자가 작성해야 할 정보를 선택해 주세요.
              </Text>

              <View style={styles.formFieldHeaderRow}>
                <Text style={styles.formFieldHeader}>지원서에 포함</Text>
                <Text style={styles.formFieldHeader}>지원자가 필수 작성</Text>
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
                style={[styles.confirmRow, err.formConfig && styles.confirmRowError]}
                onPress={() => setFormConfigConfirmed(!formConfigConfirmed)}
              >
                <View
                  style={[
                    styles.radio,
                    formConfigConfirmed && styles.radioChecked,
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
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 16 }]}>
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
    </View>
  );
};

export default AnnouncementRegistrationScreen;
