import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import { RootRoutes } from "../../navigations/routes";
import Form from "../../components/forms/Form";
import FormTextInput from "../../components/forms/FormTextInput";
import FormDropdownInput from "../../components/forms/FormDropdownInput";
import { MAIN, WHITE } from "../../color";
import styles from "./styles";
import { getMyProfile } from "../../lib/apis/portfolio/profileApi";
import { getAnnouncementDetail } from "../../lib/apis/announcement/announcementApi";
import {
  createApplication,
  deleteApplication,
  getMyApplicationForPost,
  updateApplication,
} from "../../lib/apis/application/applicationApi";
import { getAppliedRooms, getRoomsByPost } from "../../lib/apis/chat/chatApi";
import type { ChatRoomListItem } from "../../lib/apis/chat/types";
import { chatRoomItemToParams } from "../../lib/chat/chatRoomNavigation";
import { emitChatAppliedRoomsRefresh } from "../../lib/chat/chatRoomsEvents";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import type { ApplicationGender } from "../../lib/apis/application/types";
import type { ApplicationConfig } from "../../lib/apis/announcement/types";
import { deriveApplicationPrefillFromProfile } from "../../lib/application/profileApplicationPrefill";
import {
  detailHasExplicitNullApplicationConfig,
  extractApplicationConfigRaw,
  hasAnyApplicationField,
  parseApplicationConfig,
} from "../../lib/application/parseApplicationConfig";

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  Application: AnnouncementDetailParams;
};

type ApplicationRouteProp = RouteProp<
  RootStackParamList,
  typeof RootRoutes.APPLICATION
>;

const GENDER_OPTIONS: { label: string; value: ApplicationGender }[] = [
  { label: "여성", value: "FEMALE" },
  { label: "남성", value: "MALE" },
  { label: "선택없음", value: "NONE" },
];

function parseEducationToSchoolGrade(raw: string): { school: string; grade: string } {
  const t = raw.trim();
  const sep = " / ";
  const i = t.indexOf(sep);
  if (i === -1) return { school: t, grade: "" };
  return {
    school: t.slice(0, i).trim(),
    grade: t.slice(i + sep.length).trim(),
  };
}

function formatEducation(school: string, grade: string): string {
  const s = school.trim();
  const g = grade.trim();
  if (!g) return s;
  if (!s) return g;
  return `${s} / ${g}`;
}

/** README: `birth` 요청은 ISO 8601 — 입력은 연도(YYYY) 위주 */
function birthYearToIso8601(year: string): string {
  const digits = year.trim().replace(/\D/g, "").slice(0, 4);
  if (digits.length === 4) return `${digits}-01-01T00:00:00.000Z`;
  const t = year.trim();
  return t ? `${t}-01-01T00:00:00.000Z` : "2000-01-01T00:00:00.000Z";
}

function birthApiToYearDisplay(birth: string): string {
  const m = /^(\d{4})/.exec(birth.trim());
  return m ? m[1] : birth.trim().slice(0, 4);
}

/**
 * README: `POST /applications` 성공 시 서버가 공고 전용 채팅방을 만들고 첫 메시지를 보냄.
 * `GET /chat/rooms/by-post/:postId` 로 방이 잡힐 때까지 짧게 재시도.
 */
async function fetchAnnouncementRoomAfterApply(
  pid: string,
): Promise<ChatRoomListItem | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const byPost = await getRoomsByPost(pid);
    let room =
      byPost?.items?.find((r) => r.kind === "ANNOUNCEMENT") ??
      byPost?.items?.[0] ??
      null;
    if (room?.peer?.userId) return room;

    const applied = await getAppliedRooms({ limit: 50 });
    const fromApplied = applied?.items.find(
      (r) =>
        r.kind === "ANNOUNCEMENT" &&
        (r.post?.postId === pid || String(r.post?.postId) === String(pid)),
    );
    if (fromApplied?.peer?.userId) return fromApplied;
    if (fromApplied?.id) room = fromApplied;
    if (room?.peer?.userId) return room;
    if (room?.id) return room;

    if (attempt < 4) await new Promise((r) => setTimeout(r, 450));
  }
  return null;
}

function httpErrorMessage(status: number): string {
  if (status === 400) return "입력값을 확인해 주세요. (마감·필수 항목 등)";
  if (status === 401) return "로그인이 필요합니다.";
  if (status === 403) return "수정 권한이 없습니다.";
  if (status === 404) return "공고 또는 지원서를 찾을 수 없습니다.";
  if (status === 409) return "이미 이 공고에 지원하셨습니다.";
  return "요청에 실패했습니다.";
}

/** 공고 상세 기준 모집 진행 여부 — 마감 후에는 지원 취소·수정 불가 */
function deriveRecruitmentOpen(
  d: Record<string, unknown>,
  listStatusFallback: string | undefined,
): boolean {
  const isRecruiting = d.isRecruiting ?? d.is_recruiting;
  if (isRecruiting === false) return false;

  const deadlineRaw = d.deadlineAt ?? d.deadline_at;
  if (typeof deadlineRaw === "string" && deadlineRaw.trim()) {
    const t = Date.parse(deadlineRaw);
    if (!Number.isNaN(t) && Date.now() > t) return false;
  }

  const statusStr = String(d.status ?? d.postStatus ?? "").toUpperCase();
  if (statusStr === "CLOSED") return false;

  if (isRecruiting === true) return true;

  if (listStatusFallback === "모집마감") return false;
  return true;
}

const ApplicationScreen = () => {
  const route = useRoute<ApplicationRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const floatingBottomPad = insets.bottom + 4;
  const { status } = route.params;
  const postId = route.params.postId;

  const [config, setConfig] = useState<ApplicationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [recruitmentOpen, setRecruitmentOpen] = useState(true);

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState<ApplicationGender | "">("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [detailMajor, setDetailMajor] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [participationSection, setParticipationSection] = useState("");
  const [participatingSong, setParticipatingSong] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [link, setLink] = useState("");
  const [affiliatedDepartment, setAffiliatedDepartment] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [includeFile, setIncludeFile] = useState(false);
  const [includeCareer, setIncludeCareer] = useState(false);

  const prefilledRef = useRef(false);

  useEffect(() => {
    if (!postId) {
      Alert.alert("알림", "공고 정보가 없습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
      return;
    }

    let cancelled = false;

    function hydrateFromEntity(e: ApplicationEntity) {
      if (e.name) setName(e.name);
      if (e.birth) setBirthYear(birthApiToYearDisplay(e.birth));
      if (e.gender) setGender(e.gender);
      if (e.major) setSelectedMajor(e.major);
      if (e.majorDetail) setDetailMajor(e.majorDetail);
      if (e.education?.length) {
        const { school, grade } = parseEducationToSchoolGrade(e.education[0].description);
        setSchoolName(school);
        setSelectedGrade(grade);
      }
      if (e.category) setParticipationSection(e.category);
      if (e.music) setParticipatingSong(e.music);
      if (e.address) setDeliveryAddress(e.address);
      if (e.link) setLink(e.link);
      if (e.department) setAffiliatedDepartment(e.department);
      if (e.introduce) setSelfIntroduction(e.introduce);
      if (Array.isArray(e.file)) setIncludeFile(e.file.length > 0);
      if (Array.isArray(e.career)) setIncludeCareer(e.career.length > 0);
    }

    (async () => {
      setLoading(true);
      try {
        /** README: `GET /announcement/:id` 응답의 `applicationConfig` 기준 (항상 상세 재조회) */
        const detail = await getAnnouncementDetail(postId);
        if (cancelled) return;
        if (!detail || typeof detail !== "object") {
          Alert.alert("알림", "공고 정보를 불러오지 못했습니다.", [
            { text: "확인", onPress: () => navigation.goBack() },
          ]);
          return;
        }
        const d = detail as Record<string, unknown>;
        setRecruitmentOpen(deriveRecruitmentOpen(d, status));
        if (detailHasExplicitNullApplicationConfig(d)) {
          Alert.alert(
            "알림",
            "이 공고에는 지원서 양식이 설정되어 있지 않습니다.",
            [{ text: "확인", onPress: () => navigation.goBack() }],
          );
          return;
        }
        const nextConfig = parseApplicationConfig(extractApplicationConfigRaw(d));
        if (!hasAnyApplicationField(nextConfig)) {
          Alert.alert(
            "알림",
            "이 공고에는 지원서 양식이 설정되어 있지 않습니다.",
            [{ text: "확인", onPress: () => navigation.goBack() }],
          );
          return;
        }
        setConfig(nextConfig);

        const mine = await getMyApplicationForPost(postId);
        if (cancelled) return;
        if (mine.ok && mine.data.id) {
          setApplicationId(mine.data.id);
          hydrateFromEntity(mine.data);
          return;
        }

        if (!prefilledRef.current) {
          prefilledRef.current = true;
          const p = await getMyProfile();
          if (cancelled || !p) return;
          const d = deriveApplicationPrefillFromProfile(p);
          if (d.name) setName(d.name);
          if (d.birthYear) setBirthYear(d.birthYear);
          if (d.majorValue) setSelectedMajor(d.majorValue);
          if (d.schoolName) setSchoolName(d.schoolName);
          if (d.grade) setSelectedGrade(d.grade);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId, navigation, status]);

  const majorOptions = [
    { label: "건반악기", value: "건반악기" },
    { label: "현악", value: "현악" },
    { label: "성악", value: "성악" },
    { label: "작곡", value: "작곡" },
    { label: "무용", value: "무용" },
    { label: "실용", value: "실용" },
  ];

  const gradeOptions = [
    { label: "1학년", value: "1학년" },
    { label: "2학년", value: "2학년" },
    { label: "3학년", value: "3학년" },
    { label: "4학년", value: "4학년" },
    { label: "졸업", value: "졸업" },
  ];

  const validate = (): string | null => {
    if (!config) return "양식을 불러오는 중입니다.";
    if (config.includeName && !name.trim()) return "이름을 입력해 주세요.";
    if (config.includeBirth && !birthYear.trim()) return "생년을 입력해 주세요.";
    if (config.includeGender && !gender) return "성별을 선택해 주세요.";
    if (config.includeMajor && !selectedMajor.trim()) return "전공을 선택해 주세요.";
    if (config.includeMajorDetail && !detailMajor.trim()) return "세부 전공을 입력해 주세요.";
    if (config.includeEducation && (!schoolName.trim() || !selectedGrade.trim())) {
      return "소속 학교와 학년을 입력해 주세요.";
    }
    if (config.includeCategory && !participationSection.trim()) {
      return "참가 부문을 입력해 주세요.";
    }
    if (config.includeMusic && !participatingSong.trim()) return "참가곡을 입력해 주세요.";
    if (config.includeAddress && !deliveryAddress.trim()) {
      return "배송 주소를 입력해 주세요.";
    }
    if (config.includeLink && !link.trim()) return "링크를 입력해 주세요.";
    if (config.includeDepartment && !affiliatedDepartment.trim()) {
      return "소속 학부를 입력해 주세요.";
    }
    if (config.includeIntroduce && !selfIntroduction.trim()) {
      return "자기소개/지원동기를 입력해 주세요.";
    }
    return null;
  };

  const buildDtoBody = () => {
    if (!config || !postId) return null;
    const educationLine = formatEducation(schoolName, selectedGrade);
    const base: Omit<Parameters<typeof createApplication>[0], "postId"> = {};
    if (config.includeName) base.name = name.trim();
    if (config.includeBirth) base.birth = birthYearToIso8601(birthYear);
    if (config.includeGender) base.gender = gender as ApplicationGender;
    if (config.includeMajor) base.major = selectedMajor.trim();
    if (config.includeMajorDetail) base.majorDetail = detailMajor.trim();
    if (config.includeEducation && educationLine.trim()) {
      const startedAt =
        config.includeBirth && birthYear.trim()
          ? birthYearToIso8601(birthYear)
          : "2000-01-01T00:00:00.000Z";
      base.education = [
        { description: educationLine.trim(), startedAt, endedAt: null },
      ];
    }
    if (config.includeCategory) base.category = participationSection.trim();
    if (config.includeMusic) base.music = participatingSong.trim();
    if (config.includeAddress) base.address = deliveryAddress.trim();
    if (config.includeFile && includeFile) base.file = [];
    if (config.includeLink) base.link = link.trim();
    if (config.includeDepartment) base.department = affiliatedDepartment.trim();
    if (config.includeCareer && includeCareer) base.career = [];
    if (config.includeIntroduce) base.introduce = selfIntroduction.trim();
    return base;
  };

  const onOpenChatInquiry = async () => {
    if (!postId) return;
    setSubmitting(true);
    try {
      const room = await fetchAnnouncementRoomAfterApply(postId);
      if (room?.id) {
        const chatParams = chatRoomItemToParams(room);
        navigation.dispatch(StackActions.replace(RootRoutes.CHAT_ROOM, chatParams));
      } else {
        Alert.alert(
          "채팅",
          "채팅 탭의 지원 공고에서 해당 공고를 연 뒤 채팅으로 문의해 주세요.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onCancelApplication = () => {
    if (!applicationId) return;
    Alert.alert(
      "지원 취소",
      "이 공고에 대한 지원을 취소할까요? 취소 후에는 같은 공고에 다시 지원할 수 있습니다.",
      [
        { text: "닫기", style: "cancel" },
        {
          text: "지원 취소",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              const res = await deleteApplication(applicationId);
              if (res.ok) {
                emitChatAppliedRoomsRefresh();
                Alert.alert("완료", "지원이 취소되었습니다.", [
                  { text: "확인", onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert(
                  "오류",
                  res.message?.slice(0, 200) || httpErrorMessage(res.status),
                );
              }
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const onSubmit = async () => {
    if (!postId || !config) return;
    if (!recruitmentOpen) {
      Alert.alert("알림", "모집이 마감되어 지원서를 제출하거나 수정할 수 없습니다.");
      return;
    }
    const err = validate();
    if (err) {
      Alert.alert("알림", err);
      return;
    }
    const body = buildDtoBody();
    if (!body) return;

    setSubmitting(true);
    try {
      if (applicationId) {
        const res = await updateApplication(applicationId, body);
        if (res.ok) {
          Alert.alert("완료", "지원서가 수정되었습니다.", [
            { text: "확인", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert(
            "오류",
            res.message?.slice(0, 200) || httpErrorMessage(res.status),
          );
        }
      } else {
        const res = await createApplication({ postId, ...body });
        if (res.ok) {
          setApplicationId(res.data.id);
          emitChatAppliedRoomsRefresh();
          const room = await fetchAnnouncementRoomAfterApply(postId);
          if (room?.id) {
            const chatParams = chatRoomItemToParams(room);
            navigation.dispatch(
              StackActions.replace(RootRoutes.CHAT_ROOM, chatParams),
            );
          } else {
            Alert.alert(
              "지원 완료",
              "지원서가 제출되었습니다. 채팅 탭의 지원 공고에서 대화방을 확인해 주세요.",
              [{ text: "확인", onPress: () => navigation.goBack() }],
            );
          }
        } else {
          Alert.alert(
            "오류",
            res.message?.slice(0, 200) || httpErrorMessage(res.status),
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldGap = { marginTop: 15 as const };

  if (!postId) {
    return null;
  }

  if (loading || !config) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: WHITE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={MAIN.DEFAULT} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: applicationId ? 150 : 90,
        }}
      >
        <View style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
          {config.includeName && (
            <View>
              <Form title="이름" isRequired={true}>
                <FormTextInput
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChangeText={setName}
                />
              </Form>
            </View>
          )}
          {config.includeBirth && (
            <View style={fieldGap}>
              <Form title="생년" isRequired={true}>
                <FormTextInput
                  placeholder="YYYY"
                  value={birthYear}
                  onChangeText={setBirthYear}
                />
              </Form>
            </View>
          )}
          {config.includeGender && (
            <View style={fieldGap}>
              <Form title="성별" isRequired={true}>
                <FormDropdownInput
                  placeholder="성별을 선택하세요"
                  data={GENDER_OPTIONS}
                  value={gender}
                  onChange={(item) => setGender(item.value as ApplicationGender)}
                />
              </Form>
            </View>
          )}
          {config.includeMajor && (
            <View style={fieldGap}>
              <Form
                title="전공"
                isRequired={true}
                example="ex. 건반악기, 현악, 성악, 작곡, 무용, 실용"
              >
                <FormDropdownInput
                  placeholder="전공을 선택하세요"
                  data={majorOptions}
                  value={selectedMajor}
                  onChange={(item) => setSelectedMajor(item.value)}
                />
              </Form>
            </View>
          )}
          {config.includeMajorDetail && (
            <View style={fieldGap}>
              <Form title="세부 전공" isRequired={true}>
                <FormTextInput
                  placeholder="세부 전공을 입력하세요"
                  value={detailMajor}
                  onChangeText={setDetailMajor}
                />
              </Form>
            </View>
          )}
          {config.includeEducation && (
            <View style={fieldGap}>
              <Form title="학력(소속학교/학년)" isRequired={true}>
                <FormTextInput
                  placeholder="소속학교를 입력하세요"
                  value={schoolName}
                  onChangeText={setSchoolName}
                />
                <FormDropdownInput
                  placeholder="학년을 선택하세요"
                  data={gradeOptions}
                  value={selectedGrade}
                  onChange={(item) => setSelectedGrade(item.value)}
                />
              </Form>
            </View>
          )}
          {config.includeCategory && (
            <View style={fieldGap}>
              <Form title="참가 부문" isRequired={true}>
                <FormTextInput
                  placeholder="참가 부문을 입력하세요"
                  value={participationSection}
                  onChangeText={setParticipationSection}
                />
              </Form>
            </View>
          )}
          {config.includeMusic && (
            <View style={fieldGap}>
              <Form title="참가곡" isRequired={true}>
                <FormTextInput
                  placeholder="참가곡을 입력하세요"
                  value={participatingSong}
                  onChangeText={setParticipatingSong}
                />
              </Form>
            </View>
          )}
          {config.includeAddress && (
            <View style={fieldGap}>
              <Form title="상장/트로피 배송 주소" isRequired={true}>
                <FormTextInput
                  placeholder="주소를 입력하세요"
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                />
              </Form>
            </View>
          )}
          {config.includeFile && (
            <View style={fieldGap}>
              <Form title="사진/영상/파일 제출" isRequired={true}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ flex: 1, marginRight: 12 }}>
                    파일을 제출합니다 (제출 여부)
                  </Text>
                  <Switch
                    value={includeFile}
                    onValueChange={setIncludeFile}
                    trackColor={{ true: MAIN.DEFAULT, false: "#ccc" }}
                  />
                </View>
              </Form>
            </View>
          )}
          {config.includeLink && (
            <View style={fieldGap}>
              <Form title="링크 첨부" isRequired={true}>
                <FormTextInput
                  placeholder="https://"
                  value={link}
                  onChangeText={setLink}
                />
              </Form>
            </View>
          )}
          {config.includeDepartment && (
            <View style={fieldGap}>
              <Form title="소속 학부" isRequired={true}>
                <FormTextInput
                  placeholder="소속 학부를 입력하세요"
                  value={affiliatedDepartment}
                  onChangeText={setAffiliatedDepartment}
                />
              </Form>
            </View>
          )}
          {config.includeCareer && (
            <View style={fieldGap}>
              <Form title="경력" isRequired={true}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ flex: 1, marginRight: 12 }}>관련 경력이 있습니다</Text>
                  <Switch
                    value={includeCareer}
                    onValueChange={setIncludeCareer}
                    trackColor={{ true: MAIN.DEFAULT, false: "#ccc" }}
                  />
                </View>
              </Form>
            </View>
          )}
          {config.includeIntroduce && (
            <View style={fieldGap}>
              <Form title="자기소개/지원동기" isRequired={true}>
                <FormTextInput
                  placeholder="내용을 입력하세요"
                  value={selfIntroduction}
                  onChangeText={setSelfIntroduction}
                />
              </Form>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={[
          styles.floatingBottomBar,
          { paddingBottom: floatingBottomPad },
        ]}
      >
        {!recruitmentOpen && applicationId ? (
          <>
            <Text style={styles.closedHint}>
              모집이 마감되어 지원을 취소할 수 없습니다. 문의는 공고 채팅을 이용해 주세요.
            </Text>
            <Pressable
              style={[styles.chatInquiryButton, submitting && { opacity: 0.6 }]}
              disabled={submitting}
              onPress={onOpenChatInquiry}
            >
              <Text style={styles.chatInquiryText}>채팅으로 문의</Text>
            </Pressable>
          </>
        ) : null}
        <Pressable
          style={[
            styles.btnApply,
            { bottom: 0 },
            (submitting || !recruitmentOpen) && styles.btnApplyDisabled,
          ]}
          disabled={submitting || !recruitmentOpen}
          onPress={onSubmit}
        >
          <Text style={styles.btnApplyText}>
            {!recruitmentOpen
              ? "모집 마감"
              : applicationId
                ? "수정하기"
                : "제출하기"}
          </Text>
        </Pressable>
        {recruitmentOpen && applicationId ? (
          <Pressable
            style={[styles.btnCancel, submitting && { opacity: 0.6 }]}
            disabled={submitting}
            onPress={onCancelApplication}
          >
            <Text style={styles.btnCancelText}>지원 취소</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default ApplicationScreen;
