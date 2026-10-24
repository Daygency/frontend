import {
  Alert,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect as useNavFocusEffect,
} from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMyActivityReview } from "../../lib/apis/announcement/activityReviewApi";
import { getMyApplicationForPost } from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { LinearTransition } from "react-native-reanimated";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AnnouncementDetailOptionsMenu from "./AnnouncementDetailOptionsMenu";
import {
  AnnouncementStatusSheet,
  AnnouncementStatusTrigger,
  AnnouncementStatusValue,
} from "./AnnouncementStatusMenu";
import AcceptedPerformersSection from "./AcceptedPerformersSection";
import { GRAY, MAIN, WHITE, FIXED_WHITE } from "../../color";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../../lib/media/attachmentImageUrl";
import KakaoMapView from "../../components/kakao/KakaoMapView/KakaoMapView";
import { useImageViewerOptional } from "../../contexts/ImageViewerContext";
import { formatAnnouncementDistrictLabel } from "../../lib/announcement/announcementAddress";
import { extractAnnouncementAuthorFromDetail } from "../../lib/announcement/extractAnnouncementAuthor";
import type { AnnouncementAuthor } from "../../lib/announcement/extractAnnouncementAuthor";
import { mergeAnnouncementDetailAuthor } from "../../lib/announcement/mergeAnnouncementDetailAuthor";
import { useAnnouncementAuthorLabel } from "../../lib/announcement/useAnnouncementAuthorLabel";
import { getMyProfile } from "../../lib/apis/portfolio/profileApi";
import { getProfileCache } from "../../lib/profileCache";
import { ContentRoutes, RootRoutes } from "../../navigations/routes";
import { localDateTimeToISO } from "../../lib/date/localDateTimeToISO";
import {
  deleteAnnouncement,
  getAnnouncementDetail,
  updateAnnouncement,
} from "../../lib/apis/announcement/announcementApi";
import { getApplicationsForPost } from "../../lib/apis/application/applicationApi";
import type {
  AnnouncementPriceType,
  ApplicationConfig,
} from "../../lib/apis/announcement/types";
import {
  normalizeAnnouncementPriceType,
  parseAnnouncementPrice,
  formatAnnouncementPriceLine,
} from "../../lib/announcement/announcementPrice";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isAnnouncementRecruitingOpen,
  resolveAnnouncementRecruitmentStatus,
} from "../../lib/announcement/announcementDeadline";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { pickMajorsFromAnnouncementRaw, resolveRecruitmentMajorDisplayNames } from "../../lib/announcement/recruitmentMajors";
import { getMajors } from "../../lib/apis/announcement/majorApi";
import {
  extractApplicationConfigRaw,
  parseApplicationConfig,
} from "../../lib/application/parseApplicationConfig";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import ReportCategoryModal from "../../components/modals/ReportCategoryModal";
import WheelDateTimePickerModal from "../../components/modals/WheelDateTimePickerModal";
import { createReport } from "../../lib/apis/report/reportApi";
import type { ReportCategory } from "../../lib/apis/report/types";
import { messageForReportHttpStatus } from "../../lib/report/reportErrorMessage";
import { confirmReportSubmission } from "../../lib/report/confirmReportSubmission";
import { pickReportedUserIdFromUnknown } from "../../lib/report/pickReportedUserId";
import {
  createScrap,
  deleteScrapByTarget,
  getScraps,
} from "../../lib/apis/scrap/scrapApi";
import RecruitmentMajorChip from "../../components/shared/RecruitmentMajorChip";
import { createAnnouncementRoom, createCoffeeRoom } from "../../lib/apis/chat/chatApi";
import { chatRoomItemToParams } from "../../lib/chat/chatRoomNavigation";
import {
  AnnouncementDetailBodySkeleton,
  AnnouncementDetailBottomBarSkeleton,
} from "./components/AnnouncementDetailSkeleton";
import styles from "./styles";

export type AnnouncementDetailParams = {
  title: string;
  type: string;
  status: string;
  daysLeft: number;
  postId?: string;
  postedDate?: string;
  /** 목록 등에서 넘긴 조회수(상세 진입 후 API 값으로 덮어씀) */
  viewCount?: number;
  /** 공고 상세에서 받은 지원 양식 설정 (지원서 화면으로 전달) */
  applicationConfig?: ApplicationConfig | null;
};

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  AnnouncementRegistration: { postId?: string };
  Application: AnnouncementDetailParams;
};

type AnnouncementDetailRouteProp = RouteProp<
  RootStackParamList,
  typeof RootRoutes.ANNOUNCEMENT_DETAIL
>;

/** 마감일 연장 선택값을 등록 폼과 동일하게 그 날짜의 23:59(현지 시각)로 변환 */
function deadlineDateToISO(d: Date): string {
  return localDateTimeToISO(d, "23:59");
}

function formatDateKorean(iso?: string): string {
  if (!iso?.trim()) return "";
  const raw = iso.trim();
  const numeric = Number(raw);
  const dt =
    Number.isFinite(numeric) && raw.length >= 10
      ? new Date(raw.length <= 10 ? numeric * 1000 : numeric)
      : new Date(raw);
  if (isNaN(dt.getTime())) return "";
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

function parseAnnouncementAttachments(
  raw: unknown,
): { name: string; size: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { name: string; size: string }[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (pickUrlFromFileLike(r)) continue;
    const name = String(
      r.originalName ?? r.original_name ?? r.name ?? r.fileName ?? "",
    ).trim();
    if (!name) continue;
    const sz = r.size ?? r.file_size;
    let sizeStr = "";
    if (typeof sz === "number" && Number.isFinite(sz)) {
      sizeStr =
        sz >= 1024 * 1024
          ? `${(sz / 1024 / 1024).toFixed(1)} MB`
          : sz >= 1024
            ? `${(sz / 1024).toFixed(1)} KB`
            : `${sz} B`;
    }
    out.push({ name, size: sizeStr });
  }
  return out;
}

const screenWidth = Dimensions.get("window").width;

const AnnouncementDetailScreen = () => {
  const route = useRoute<AnnouncementDetailRouteProp>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  /** 홈 인디케이터 등 안전 영역 + 아주 소량만 (박스 없이 버튼만 붙일 때) */
  const floatingBottomPad = insets.bottom + 4;
  const { isLoggedIn, user } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const params = route.params ?? {};
  /** fetchDetail 응답이 도착했을 때 그 사이 다른 공고로 이동해 postId가
   * 바뀌었는지 확인하기 위한 최신값 ref. 렌더마다 즉시 갱신되어야
   * 네트워크 지연으로 이전 공고의 응답이 늦게 도착해도 최신 postId와
   * 비교해 걸러낼 수 있다. */
  const postIdRef = useRef(params.postId);
  postIdRef.current = params.postId;
  const [isMine, setIsMine] = useState(false);
  /** 첫 상세 조회 완료 여부. false인 동안은 isMine 등이 기본값이라
   * 하단 바에 방문자/작성자 여부를 잘못 추측해 보여주지 않도록 막는다. */
  const [detailLoaded, setDetailLoaded] = useState(false);
  const [hasApplicants, setHasApplicants] = useState(false);
  /** 수락된 지원자 수 — 공고 그룹채팅방 멤버 수와 동일(수락 시 방에 합류). 0명이면 방이 없어
   * "채팅 바로가기"를 눌러도 열 수 없으므로 버튼 활성화 여부 판단에 사용. */
  const [acceptedApplicantCount, setAcceptedApplicantCount] = useState(0);
  const [detailData, setDetailData] = useState<{
    title: string;
    type: string;
    status: string;
    daysLeft: number;
    applicationConfig: ApplicationConfig | null;
    content?: string;
    address?: string;
    deadlineAt?: string;
    scheduledAt?: string;
    imageUrls?: string[];
    attachments?: { name: string; size: string }[];
    priceType?: AnnouncementPriceType;
    price?: number;
    majors?: { majorId: string; name: string }[];
    viewCount?: number;
    /** 공연·일정 종료 처리 여부(API `completed`) */
    completed?: boolean;
    createdAt?: string;
  } | null>(null);
  const [author, setAuthor] = useState<AnnouncementAuthor | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSheetVisible, setStatusSheetVisible] = useState(false);
  /** 마감일이 지난 공고를 "모집중"으로 되돌릴 때 새 마감일을 먼저 받기 위한 피커 */
  const [deadlineExtendPickerVisible, setDeadlineExtendPickerVisible] =
    useState(false);
  const [pendingReopenDeadline, setPendingReopenDeadline] = useState<Date>(
    () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [myReviewExists, setMyReviewExists] = useState(false);
  const [myApplication, setMyApplication] = useState<ApplicationEntity | null>(
    null,
  );
  /** 내 지원 여부 조회 완료 여부. false인 동안은 myApplication이 기본값(null)이라
   * "지원하기"를 잘못 보여줄 수 있으므로 로딩 완료 전엔 스켈레톤만 그린다. */
  const [applicationStatusLoaded, setApplicationStatusLoaded] =
    useState(false);
  const [scraped, setScraped] = useState(false);
  const [chatInquiryLoading, setChatInquiryLoading] = useState(false);
  const [ownerChatOpening, setOwnerChatOpening] = useState(false);
  const [majorsCatalog, setMajorsCatalog] = useState<
    { name: string; majorId: string }[]
  >([]);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [performersPanelHeight, setPerformersPanelHeight] = useState(0);
  const [performersExpanded, setPerformersExpanded] = useState(false);
  const imageViewer = useImageViewerOptional();
  const authorDisplayLabel = useAnnouncementAuthorLabel(author, {
    isViewerAuthor: isMine,
  });

  useEffect(() => {
    void getMajors().then((list) => {
      setMajorsCatalog(
        list.map((m) => ({
          name: m.name,
          majorId: m.majorId,
        })),
      );
    });
  }, []);

  const handleOpenChatInquiry = useCallback(async () => {
    if (!ensureLoggedIn()) return;
    const authorUserId =
      pickReportedUserIdFromUnknown(author) ?? author?.userId?.trim();
    const myUserId = user?.socialId?.trim();
    if (!authorUserId || chatInquiryLoading) return;
    if (authorUserId === myUserId) {
      Alert.alert("채팅", "본인과는 채팅할 수 없습니다.");
      return;
    }
    setChatInquiryLoading(true);
    try {
      const room = await createCoffeeRoom(
        { peerUserId: authorUserId },
        myUserId ? { myUserId } : undefined,
      );
      if (room?.id) {
        navigation.navigate(RootRoutes.CHAT_ROOM, chatRoomItemToParams(room));
      } else {
        Alert.alert(
          "채팅",
          "채팅방을 열 수 없습니다. 네트워크 또는 서버 응답을 확인해 주세요.",
        );
      }
    } finally {
      setChatInquiryLoading(false);
    }
  }, [ensureLoggedIn, author, chatInquiryLoading, user?.socialId, navigation]);

  /** 작성자 — 공고당 그룹채팅방 1개를 열고(없으면 생성) 바로 이동 */
  const openOwnerGroupChat = useCallback(async () => {
    if (!params.postId || ownerChatOpening || acceptedApplicantCount === 0)
      return;
    setOwnerChatOpening(true);
    try {
      const myUserId = user?.socialId?.trim();
      const room = await createAnnouncementRoom(
        { postId: params.postId },
        myUserId ? { myUserId } : undefined,
      );
      if (room?.id) {
        navigation.navigate(RootRoutes.CHAT_ROOM, chatRoomItemToParams(room));
      } else {
        Alert.alert("채팅", "채팅방을 열지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setOwnerChatOpening(false);
    }
  }, [
    params.postId,
    ownerChatOpening,
    acceptedApplicantCount,
    user?.socialId,
    navigation,
  ]);

  const handleOpenReport = useCallback(() => {
    if (!ensureLoggedIn()) return;
    if (isMine) {
      Alert.alert("알림", "본인이 작성한 글은 신고할 수 없습니다.");
      return;
    }
    const reportedUserId =
      pickReportedUserIdFromUnknown(author) ?? author?.userId?.trim();
    if (!reportedUserId || !params.postId) {
      Alert.alert(
        "알림",
        "신고할 수 없습니다. 작성자 정보를 불러오지 못했습니다.",
      );
      return;
    }
    if (reportedUserId === user?.socialId?.trim()) {
      Alert.alert("알림", "본인을 신고할 수 없습니다.");
      return;
    }
    setReportModalVisible(true);
  }, [isLoggedIn, isMine, author, params.postId, user?.socialId]);

  const handlePickReportCategory = useCallback(
    (category: ReportCategory) => {
      const reportedUserId =
        pickReportedUserIdFromUnknown(author) ?? author?.userId?.trim();
      const targetId = params.postId;
      if (!reportedUserId || !targetId) return;
      confirmReportSubmission(async () => {
        setReportSubmitting(true);
        try {
          const res = await createReport({
            reportedUserId,
            category,
            targetType: "ANNOUNCEMENT",
            targetId,
          });
          if (res.ok) {
            setReportModalVisible(false);
            Alert.alert("접수 완료", "신고가 접수되었습니다.");
          } else {
            Alert.alert(
              "알림",
              messageForReportHttpStatus(res.status, res.message),
            );
          }
        } finally {
          setReportSubmitting(false);
        }
      });
    },
    [author, params.postId],
  );

  const fetchDetail = useCallback((): Promise<void> => {
    const requestedPostId = params.postId;
    if (!requestedPostId) return Promise.resolve();
    console.log("[AnnouncementDetail] 인증 상태:", {
      isLoggedIn,
      userId: user?.socialId ?? "(없음)",
      name: user?.name ?? "(없음)",
    });
    return getAnnouncementDetail(requestedPostId).then(async (res) => {
      console.log(
        "[AnnouncementDetail] API 응답:",
        JSON.stringify(res, null, 2),
      );
      // 응답을 기다리는 사이 다른 공고로 이동해 postId가 바뀌었다면 이
      // 응답은 이전 화면 것이므로 무시한다. 그렇지 않으면 나중에 도착한
      // 이전 공고의 응답이 새 공고의 내용을 덮어써 버린다.
      if (postIdRef.current !== requestedPostId) return;
      if (!res || typeof res !== "object") return;
      const d = res as Record<string, unknown>;
      const get = (k: string, alt?: string) =>
        (d[k] ?? d[k.replace(/([A-Z])/g, "_$1").toLowerCase() ?? ""] ?? alt) as
          | string
          | undefined;
      const mine =
        (d.isMine as boolean | undefined) ?? (d.is_mine as boolean | undefined);
      const extractedAuthor = extractAnnouncementAuthorFromDetail(d);
      const mineFlag =
        typeof mine === "boolean"
          ? mine
          : Boolean(
              user?.socialId?.trim() &&
                extractedAuthor?.userId?.trim() === user.socialId.trim(),
            );
      let resolvedAuthor = extractedAuthor;
      if (mineFlag && user?.socialId?.trim()) {
        const myProfile =
          (await getMyProfile().catch(() => null)) ??
          (await getProfileCache());
        resolvedAuthor = mergeAnnouncementDetailAuthor(extractedAuthor, {
          userId: user.socialId.trim(),
          activityName: myProfile?.activityName,
          name: myProfile?.name ?? user.name,
          profileImgUrl: myProfile?.profileImgUrl ?? user.profileImgUrl,
        });
      }
      // getMyProfile await 도중에도 다른 공고로 이동할 수 있으므로 한 번 더 확인.
      if (postIdRef.current !== requestedPostId) return;
      // isMine/author를 completed 등 detailData와 같은 동기 구간에서 함께 커밋해야
      // "isMine=true, completed=false(기본값)"인 중간 상태가 잠깐 렌더되어
      // 완료된 공연에서 "공연 완료" 버튼이 잠깐 떴다 사라지는 현상을 막을 수 있음.
      setIsMine(mineFlag);
      setAuthor(resolvedAuthor);

      const title = get("title") ?? params.title ?? "";
      const type = get("type") ?? params.type ?? "";
      const isRecruiting = d.isRecruiting ?? d.is_recruiting;
      const rawContent = get("content");
      const rawAddress = get("address");
      const deadlineAt =
        get("deadlineAt") ?? get("deadline_at") ?? undefined;
      const dDay =
        get("dDay") ?? get("d_day") ?? `D-${params.daysLeft ?? 0}`;
      const parsedDays = parseAnnouncementDaysLeft(String(dDay));
      const daysLeft = effectiveAnnouncementDaysLeft(
        typeof deadlineAt === "string" ? deadlineAt : undefined,
        parsedDays,
      );
      const completedRaw = d.completed ?? d.completed_manually;
      const completedFlag =
        typeof completedRaw === "boolean" ? completedRaw : false;
      const recruitingOpen =
        typeof isRecruiting === "boolean" ? isRecruiting : true;
      const status = resolveAnnouncementRecruitmentStatus(recruitingOpen, {
        completed: completedFlag,
        deadlineAt: typeof deadlineAt === "string" ? deadlineAt : undefined,
      });
      const applicationConfig = parseApplicationConfig(
        extractApplicationConfigRaw(d),
      );
      const scheduledAt =
        get("scheduledAt") ?? get("scheduled_at") ?? undefined;

      const fileObj = d.file;
      const fileLike =
        fileObj && typeof fileObj === "object"
          ? (fileObj as Record<string, unknown>)
          : null;
      const fromAttachments = mapAttachmentsToImageUrls(
        d.files ?? d.attachments ?? [],
      );
      const fromSingleFile = pickUrlFromFileLike(fileLike);
      const imageUrls: string[] =
        fromAttachments.length > 0
          ? fromAttachments
          : fromSingleFile
            ? [fromSingleFile]
            : [];

      const attachmentRows = parseAnnouncementAttachments(d.attachments ?? []);

      const priceType = normalizeAnnouncementPriceType(
        get("priceType") ?? get("price_type"),
      );
      const price = parseAnnouncementPrice(d.price);
      const majorsPick = pickMajorsFromAnnouncementRaw(d);
      const majorsList = majorsPick.majors?.length
        ? majorsPick.majors
        : (majorsPick.majorIds ?? []).map((majorId) => ({
            majorId,
            name: "",
          }));

      const viewCountRaw = d.viewCount ?? d.view_count;
      const parsedViewCount =
        typeof viewCountRaw === "number" &&
        Number.isFinite(viewCountRaw) &&
        viewCountRaw >= 0
          ? Math.floor(viewCountRaw)
          : undefined;

      const createdAt =
        get("createdAt") ??
        get("created_at") ??
        get("createdDate") ??
        get("created_date") ??
        get("postedAt") ??
        get("posted_at") ??
        (d.post && typeof d.post === "object"
          ? ((d.post as Record<string, unknown>).createdAt ??
            (d.post as Record<string, unknown>).created_at)
          : undefined) ??
        (d.announcement && typeof d.announcement === "object"
          ? ((d.announcement as Record<string, unknown>).createdAt ??
            (d.announcement as Record<string, unknown>).created_at)
          : undefined) ??
        undefined;

      setDetailData({
        title: String(title),
        type: String(type),
        status,
        daysLeft,
        completed: completedFlag,
        applicationConfig,
        priceType,
        price,
        ...(parsedViewCount !== undefined ? { viewCount: parsedViewCount } : {}),
        ...(typeof rawContent === "string" && rawContent.trim()
          ? { content: rawContent }
          : {}),
        ...(typeof rawAddress === "string" && rawAddress.trim()
          ? { address: rawAddress }
          : {}),
        ...(deadlineAt ? { deadlineAt } : {}),
        ...(scheduledAt ? { scheduledAt } : {}),
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
        ...(attachmentRows.length > 0 ? { attachments: attachmentRows } : {}),
        ...(majorsList.length > 0 ? { majors: majorsList } : {}),
        ...(createdAt ? { createdAt: String(createdAt) } : {}),
      });
      setDetailLoaded(true);
    });
  }, [
    params.postId,
    params.title,
    params.type,
    params.status,
    params.daysLeft,
    isLoggedIn,
    user,
  ]);

  const onRefresh = useCallback(async () => {
    if (!params.postId) return;
    setRefreshing(true);
    try {
      await fetchDetail();
    } finally {
      setRefreshing(false);
    }
  }, [params.postId, fetchDetail]);

  useNavFocusEffect(
    useCallback(() => {
      if (params.postId) fetchDetail();
      return () => {};
    }, [params.postId, fetchDetail]),
  );

  // postId가 바뀌면(같은 화면 인스턴스가 재사용되는 경우 포함) 이전 공고의
  // 본문/태그/스크랩 등 postId 종속 상태를 전부 리셋한다. 리셋하지 않으면
  // 새 fetch가 끝나기 전까지 예전 공고 내용이 그대로 보이다가 갑자기 바뀐다.
  useEffect(() => {
    setIsMine(false);
    setDetailLoaded(false);
    setDetailData(null);
    setAuthor(null);
    setHasApplicants(false);
    setMyReviewExists(false);
    setMyApplication(null);
    setApplicationStatusLoaded(false);
    setScraped(false);
    setHeroImageIndex(0);
  }, [params.postId]);

  useNavFocusEffect(
    useCallback(() => {
      const postId = params.postId;
      if (!postId || !isLoggedIn) {
        setMyReviewExists(false);
        setMyApplication(null);
        setApplicationStatusLoaded(true);
        return;
      }
      let cancelled = false;
      setApplicationStatusLoaded(false);
      (async () => {
        const review = await getMyActivityReview(postId);
        if (cancelled) return;
        setMyReviewExists(!!review);
        if (!isMine) {
          const res = await getMyApplicationForPost(postId);
          if (cancelled) return;
          if (res.ok) setMyApplication(res.data);
          else setMyApplication(null);
        } else {
          setMyApplication(null);
        }
        if (!cancelled) setApplicationStatusLoaded(true);
      })();
      return () => {
        cancelled = true;
      };
    }, [params.postId, isLoggedIn, isMine]),
  );

  useNavFocusEffect(
    useCallback(() => {
      if (!params.postId || !isMine) {
        setHasApplicants(false);
        setAcceptedApplicantCount(0);
        return;
      }
      let cancelled = false;
      void getApplicationsForPost(params.postId).then((res) => {
        if (cancelled) return;
        if (res?.ok) {
          setHasApplicants(res.data.length > 0);
          const accepted = res.data.filter(
            (a) => !a.deletedAt && a.status === "ACCEPTED" && Boolean(a.id),
          );
          setAcceptedApplicantCount(accepted.length);
        } else {
          setHasApplicants(false);
          setAcceptedApplicantCount(0);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [params.postId, isMine]),
  );

  const targetPostId = params.postId;

  useEffect(() => {
    if (!targetPostId) return;
    (async () => {
      const res = await getScraps({
        targetType: "ANNOUNCEMENT",
        targetId: targetPostId,
      });
      if (!res) return;
      const myId = user?.socialId;
      setScraped(
        !!myId &&
          res.items.some((item) => String(item.user?.userId ?? "") === myId),
      );
    })();
  }, [targetPostId, user?.socialId]);

  const handleToggleScrap = useCallback(async () => {
    if (!ensureLoggedIn()) return;
    if (!targetPostId) return;
    if (scraped) {
      const res = await deleteScrapByTarget({
        targetType: "ANNOUNCEMENT",
        targetId: targetPostId,
      });
      if (!res.success) {
        Alert.alert("알림", "스크랩 취소에 실패했습니다.");
        return;
      }
      setScraped(false);
      return;
    }
    const created = await createScrap({
      targetType: "ANNOUNCEMENT",
      targetId: targetPostId,
    });
    if (!created) {
      Alert.alert("알림", "스크랩에 실패했습니다.");
      return;
    }
    setScraped(true);
  }, [ensureLoggedIn, scraped, targetPostId]);

  const displayTitle = detailData?.title ?? params.title ?? "";
  const displayType = detailData?.type ?? params.type ?? "";
  const displayStatus = detailData?.status ?? params.status ?? "모집중";
  const displayDaysLeft = detailData?.daysLeft ?? params.daysLeft ?? 0;
  const displayViewCount =
    detailData?.viewCount ?? params.viewCount;
  const displayCompleted = detailData?.completed ?? false;
  const currentAnnouncementStatus: AnnouncementStatusValue = displayCompleted
    ? "종료"
    : displayStatus === "모집중"
      ? "모집중"
      : "모집마감";

  const isRecruitingOpen =
    isAnnouncementRecruitingOpen(
      displayStatus === "모집중",
      displayCompleted,
    );
  /** 모집 마감 또는 완료 상태면 활동 후기 작성 가능 */
  const isReviewable = displayCompleted || displayStatus === "모집마감";
  const showApplicantReviewBar =
    !isMine &&
    isReviewable &&
    isLoggedIn &&
    !myReviewExists &&
    myApplication?.status === "ACCEPTED";
  /** 타인 공고 + 모집중 — 지원하기 노출 (예정일 경과로 completed여도 모집 중이면 지원 가능) */
  const showApplicantApplyBar =
    !isMine &&
    Boolean(params.postId) &&
    isRecruitingOpen &&
    !myApplication;
  const showApplicantClosedBar =
    !isMine &&
    Boolean(params.postId) &&
    !isRecruitingOpen &&
    !showApplicantReviewBar &&
    !showApplicantApplyBar;
  const showApplicantAlreadyAppliedBar =
    !isMine &&
    Boolean(params.postId) &&
    isLoggedIn &&
    Boolean(myApplication) &&
    isRecruitingOpen &&
    !showApplicantReviewBar &&
    !showApplicantApplyBar;
  const visitorBottomBar =
    !isMine &&
    Boolean(params.postId) &&
    (showApplicantApplyBar ||
      showApplicantReviewBar ||
      showApplicantAlreadyAppliedBar ||
      showApplicantClosedBar);

  /** 작성자 + 공연 완료 후 — 종료 안내 */
  /** 작성자 — 상태와 무관하게 항상 책갈피 + 채팅 바로가기 노출 */
  const showOwnerBar = isMine && Boolean(params.postId);

  const performStatusChange = useCallback(
    async (next: AnnouncementStatusValue, newDeadline?: Date) => {
      if (!params.postId || statusUpdating) return;
      setStatusUpdating(true);
      try {
        const newDeadlineIso = newDeadline
          ? deadlineDateToISO(newDeadline)
          : undefined;
        const dto =
          next === "종료"
            ? { completed: true }
            : next === "모집마감"
              ? { status: "CLOSED" as const }
              : {
                  status: "OPEN" as const,
                  completed: false,
                  ...(newDeadlineIso ? { deadlineAt: newDeadlineIso } : {}),
                };
        const res = await updateAnnouncement(params.postId!, dto);
        if (res.ok) {
          setDetailData((prev) =>
            prev
              ? {
                  ...prev,
                  status: next === "모집중" ? "모집중" : "모집마감",
                  completed: next === "종료",
                  ...(newDeadlineIso ? { deadlineAt: newDeadlineIso } : {}),
                }
              : prev,
          );
          await fetchDetail();
          Alert.alert("알림", "상태가 변경되었습니다.");
        } else {
          Alert.alert(
            "알림",
            res.message?.trim() || "상태 변경에 실패했습니다.",
          );
        }
      } catch {
        Alert.alert("알림", "상태 변경에 실패했습니다.");
      } finally {
        setStatusUpdating(false);
      }
    },
    [params.postId, statusUpdating, fetchDetail],
  );

  const handleChangeStatus = useCallback(
    (next: AnnouncementStatusValue) => {
      if (!params.postId || statusUpdating) return;
      const CONFIRM: Record<
        AnnouncementStatusValue,
        { title: string; message: string; confirmText: string }
      > = {
        모집중: {
          title: "모집중으로 변경",
          message: "다시 지원을 받을 수 있도록 모집 상태로 되돌릴까요?",
          confirmText: "변경",
        },
        모집마감: {
          title: "모집마감으로 변경",
          message: "더 이상 새 지원을 받지 않도록 모집을 마감할까요?",
          confirmText: "변경",
        },
        종료: {
          title: "공고 종료",
          message: "공고를 종료 처리합니다. 진행할까요?",
          confirmText: "종료하기",
        },
      };
      const { title, message, confirmText } = CONFIRM[next];
      Alert.alert(title, message, [
        { text: "취소", style: "cancel" },
        {
          text: confirmText,
          style: next === "종료" ? "destructive" : "default",
          onPress: () => performStatusChange(next),
        },
      ]);
    },
    [params.postId, statusUpdating, performStatusChange],
  );

  /** 모집중 선택 시 진입점 — 서버가 지난 마감일을 기준으로 다시 마감 처리할 수 있으므로,
   * 곧바로 상태만 바꾸지 않고 마감일을 어떻게 할지 먼저 물어본다. */
  const handleSelectAnnouncementStatus = useCallback(
    (next: AnnouncementStatusValue) => {
      setStatusSheetVisible(false);
      if (next === "모집중") {
        Alert.alert(
          "모집중으로 변경",
          "다시 지원을 받으려면 새 마감일이 필요해요. 어떻게 할까요?",
          [
            { text: "취소", style: "cancel" },
            {
              text: "7일 연장",
              onPress: () => {
                void performStatusChange(
                  "모집중",
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                );
              },
            },
            {
              text: "모집마감일 선택",
              onPress: () => {
                setPendingReopenDeadline(
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                );
                setDeadlineExtendPickerVisible(true);
              },
            },
          ],
        );
        return;
      }
      handleChangeStatus(next);
    },
    [handleChangeStatus, performStatusChange],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightWrap}>
          {detailLoaded && isMine && params.postId ? (
            <AnnouncementStatusTrigger
              value={currentAnnouncementStatus}
              disabled={statusUpdating}
              onPress={() => setStatusSheetVisible(true)}
            />
          ) : null}
          {detailLoaded && !isMine ? (
            <Pressable
              style={[
                styles.chatInquiryButton,
                chatInquiryLoading && styles.chatInquiryButtonPending,
              ]}
              onPress={handleOpenChatInquiry}
              disabled={chatInquiryLoading}
              hitSlop={6}
            >
              <Text style={styles.chatInquiryButtonText}>문의하기</Text>
            </Pressable>
          ) : null}
          <AnnouncementDetailOptionsMenu
            isMine={isMine}
            postId={params.postId}
            canEdit={!displayCompleted && !hasApplicants}
            onEdit={() => {
              if (displayCompleted) {
                Alert.alert("알림", "종료된 공고는 수정할 수 없습니다.");
                return;
              }
              if (hasApplicants) {
                Alert.alert(
                  "알림",
                  "지원자가 있는 공고는 수정할 수 없습니다.",
                );
                return;
              }
              if (params.postId) {
                navigation.navigate(RootRoutes.ANNOUNCEMENT_REGISTRATION, {
                  postId: params.postId,
                });
              }
            }}
            onDelete={() => {
              if (!params.postId) return;
              Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                {
                  text: "삭제",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const { ok, status } = await deleteAnnouncement(
                        params.postId!,
                      );
                      if (ok) {
                        navigation.goBack();
                      } else {
                        const msg =
                          status === 401
                            ? "인증이 필요합니다. 다시 로그인해주세요."
                            : status === 403
                              ? "삭제 권한이 없습니다."
                              : status === 404
                                ? "공고를 찾을 수 없습니다."
                                : "삭제에 실패했습니다.";
                        Alert.alert("알림", msg);
                      }
                    } catch (e) {
                      Alert.alert("알림", "삭제에 실패했습니다.");
                    }
                  },
                },
              ]);
            }}
            onReport={handleOpenReport}
          />
        </View>
      ),
    });
  }, [
    navigation,
    isMine,
    detailLoaded,
    params.postId,
    hasApplicants,
    displayCompleted,
    handleOpenReport,
    handleOpenChatInquiry,
    chatInquiryLoading,
    currentAnnouncementStatus,
    statusUpdating,
  ]);

  const imageList = detailData?.imageUrls ?? [];
  const attachmentList = detailData?.attachments ?? [];

  const deadlineLabel = detailData?.deadlineAt?.trim()
    ? formatDateKorean(detailData.deadlineAt)
    : "상시 모집";
  const addressLabel = detailData?.address?.trim() || "";
  const descriptionText = detailData?.content?.trim() ?? "";
  const dDayLabel = formatAnnouncementDDayLabel(
    displayDaysLeft,
    displayStatus,
    displayCompleted,
    detailData?.deadlineAt,
  );
  const postedDateLabel = formatDateKorean(
    detailData?.createdAt ?? params.postedDate,
  );
  const venueLabel = formatAnnouncementDistrictLabel(addressLabel);
  const recruitmentMajorNames = useMemo(
    () =>
      resolveRecruitmentMajorDisplayNames(
        {
          majors: detailData?.majors,
          majorIds: detailData?.majors?.map((m) => m.majorId),
        },
        majorsCatalog,
      ),
    [detailData?.majors, majorsCatalog],
  );
  const priceLabel = useMemo(() => {
    if (!detailData) return null;
    return formatAnnouncementPriceLine(
      detailData.priceType ?? "PENDING",
      detailData.price ?? 0,
    );
  }, [detailData]);

  const showBottomBar =
    !detailLoaded || showOwnerBar || visitorBottomBar;
  const performersPanelGap = 12;
  const bottomBarOffset = 66 + floatingBottomPad + performersPanelGap;
  const showPerformersPanel = detailLoaded && isMine && Boolean(params.postId);
  const scrollBottomPad =
    (showBottomBar ? 88 + floatingBottomPad : 32) +
    (showPerformersPanel ? performersPanelHeight + performersPanelGap * 2 : 0);

  const navigateToAuthorPortfolio = () => {
    if (!author) return;
    if (isMine) {
      navigation.navigate(RootRoutes.CONTENT_TAB, {
        screen: ContentRoutes.LOUNGE,
      });
      return;
    }
    navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
      userId: author.userId,
      activityName: author.activityName?.trim() ?? "",
    });
  };

  const navigateToApplication = () => {
    if (!ensureLoggedIn()) return;
    if (!params.postId) {
      Alert.alert("알림", "공고 정보가 없습니다.");
      return;
    }
    navigation.navigate(RootRoutes.APPLICATION, {
      title: displayTitle,
      type: displayType,
      status: displayStatus,
      daysLeft: displayDaysLeft,
      postId: params.postId,
      viewCount: displayViewCount,
      applicationConfig:
        detailData?.applicationConfig ?? params.applicationConfig ?? null,
    });
  };

  const renderVisitorBottomWithScrap = (message: string) => (
    <View
      style={[styles.floatingBottomBar, { paddingBottom: floatingBottomPad }]}
    >
      <Pressable style={styles.btnBookmark} onPress={handleToggleScrap}>
        <Ionicons
          name={scraped ? "bookmark" : "bookmark-outline"}
          size={22}
          color={FIXED_WHITE}
        />
      </Pressable>
      <View style={[styles.btnApply, styles.visitorInfoBar]}>
        <Text style={styles.visitorInfoText}>{message}</Text>
      </View>
    </View>
  );

  const renderBottomBar = () => {
    // 첫 조회가 끝나기 전엔 isMine/completed가 기본값이라 방문자/작성자용
    // 문구를 잘못 추측해 보여줄 수 있고, 방문자의 경우 내 지원 여부 조회가
    // 끝나기 전엔 지원했는지 알 수 없어 "지원하기"를 잘못 보여줄 수 있으므로
    // 두 조회가 모두 끝나기 전엔 스켈레톤만 그린다.
    if (!detailLoaded || (!isMine && !applicationStatusLoaded)) {
      return (
        <AnnouncementDetailBottomBarSkeleton
          paddingBottom={floatingBottomPad}
        />
      );
    }
    if (!isMine && params.postId && showApplicantReviewBar) {
      return (
        <View
          style={[
            styles.floatingBottomBar,
            { paddingBottom: floatingBottomPad },
          ]}
        >
          <Pressable style={styles.btnBookmark} onPress={handleToggleScrap}>
            <Ionicons
              name={scraped ? "bookmark" : "bookmark-outline"}
              size={22}
              color={FIXED_WHITE}
            />
          </Pressable>
          <Pressable
            style={styles.btnApply}
            onPress={() => {
              if (!params.postId) {
                Alert.alert("알림", "공고 정보가 없습니다.");
                return;
              }
              const uid = author?.userId?.trim();
              if (!uid) {
                Alert.alert("알림", "작성자 정보를 불러오지 못했습니다.");
                return;
              }
              navigation.navigate(RootRoutes.ACTIVITY_REVIEW, {
                postId: params.postId,
                revieweeUserId: uid,
                revieweeActivityName:
                  author?.activityName?.trim() ||
                  author?.name?.trim() ||
                  "모집자",
                announcementTitle: displayTitle,
                revieweeHandle: author?.name?.trim(),
              });
            }}
          >
            <Text style={styles.btnApplyText}>후기 작성하기</Text>
          </Pressable>
        </View>
      );
    }

    if (!isMine && params.postId && showApplicantApplyBar) {
      return (
        <View
          style={[
            styles.floatingBottomBar,
            { paddingBottom: floatingBottomPad },
          ]}
        >
          <Pressable style={styles.btnBookmark} onPress={handleToggleScrap}>
            <Ionicons
              name={scraped ? "bookmark" : "bookmark-outline"}
              size={22}
              color={FIXED_WHITE}
            />
          </Pressable>
          <Pressable style={styles.btnApply} onPress={navigateToApplication}>
            <Text style={styles.btnApplyText}>지원하기</Text>
          </Pressable>
        </View>
      );
    }

    if (!isMine && params.postId && showApplicantClosedBar) {
      return renderVisitorBottomWithScrap("마감된 공고입니다.");
    }

    if (!isMine && params.postId && showApplicantAlreadyAppliedBar) {
      return (
        <View
          style={[
            styles.floatingBottomBar,
            { paddingBottom: floatingBottomPad },
          ]}
        >
          <Pressable style={styles.btnBookmark} onPress={handleToggleScrap}>
            <Ionicons
              name={scraped ? "bookmark" : "bookmark-outline"}
              size={22}
              color={FIXED_WHITE}
            />
          </Pressable>
          <Pressable style={styles.btnApply} onPress={navigateToApplication}>
            <Text style={styles.btnApplyText}>지원서 수정하기</Text>
          </Pressable>
        </View>
      );
    }

    if (showOwnerBar) {
      return (
        <View
          style={[
            styles.floatingBottomBar,
            { paddingBottom: floatingBottomPad },
          ]}
        >
          <Pressable style={styles.btnBookmark} onPress={handleToggleScrap}>
            <Ionicons
              name={scraped ? "bookmark" : "bookmark-outline"}
              size={22}
              color={FIXED_WHITE}
            />
          </Pressable>
          <Pressable
            style={[
              styles.btnApply,
              (ownerChatOpening || acceptedApplicantCount === 0) &&
                styles.btnApplyDisabled,
            ]}
            onPress={openOwnerGroupChat}
            disabled={ownerChatOpening || acceptedApplicantCount === 0}
          >
            <View style={styles.btnApplyContentRow}>
              <Text style={styles.btnApplyText}>채팅 바로가기</Text>
              <Ionicons name="person" size={15} color={FIXED_WHITE} />
              <Text style={styles.btnApplyText}>{acceptedApplicantCount}</Text>
            </View>
          </Pressable>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailInner}>
        <ScrollView
          style={styles.detailScroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: scrollBottomPad },
          ]}
          bounces={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={MAIN.DEFAULT}
              colors={[MAIN.DEFAULT]}
            />
          }
        >
          {!detailLoaded ? (
            <AnnouncementDetailBodySkeleton />
          ) : (
          <>
            {imageList.length > 0 ? (
              <View style={styles.heroImageWrap}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(
                    e: NativeSyntheticEvent<NativeScrollEvent>,
                  ) => {
                    const idx = Math.round(
                      e.nativeEvent.contentOffset.x / screenWidth,
                    );
                    setHeroImageIndex(idx);
                  }}
                >
                  {imageList.map((uri, index) => (
                    <Pressable
                      key={`${uri}-${index}`}
                      style={styles.heroImageSlide}
                      onPress={() =>
                        imageViewer?.openImageViewer(imageList, index)
                      }
                    >
                      <Image
                        source={{ uri }}
                        style={styles.heroImage}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </ScrollView>
                {imageList.length > 1 ? (
                  <View style={styles.heroImageDots}>
                    {imageList.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.heroImageDot,
                          index === heroImageIndex &&
                            styles.heroImageDotActive,
                        ]}
                      />
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{displayTitle}</Text>
            </View>

            <View style={styles.badgeRow}>
              {author ? (
                <Pressable onPress={navigateToAuthorPortfolio}>
                  <Text style={styles.authorName} numberOfLines={1}>
                    {authorDisplayLabel}
                  </Text>
                </Pressable>
              ) : null}
              {author && displayType ? (
                <Text style={styles.metaDot}>·</Text>
              ) : null}
              {displayType ? (
                <Text style={styles.metaText} numberOfLines={1}>
                  {displayType}
                </Text>
              ) : null}
              {(author || displayType) && venueLabel ? (
                <Text style={styles.metaDot}>·</Text>
              ) : null}
              {venueLabel ? (
                <Text style={styles.locationText} numberOfLines={1}>
                  {venueLabel}
                </Text>
              ) : null}
            </View>

            {postedDateLabel ? (
              <>
                <Text style={styles.postedDateText} numberOfLines={1}>
                  게시일 {postedDateLabel}
                </Text>
                <View style={styles.postedDateDivider} />
              </>
            ) : null}

            <View style={styles.detailInfoCard}>
              <View style={styles.sectionInlineRow}>
                <Text style={styles.sectionHeadingInline}>마감일</Text>
                <Text style={styles.deadlineText}>
                  {deadlineLabel || "-"}
                </Text>
              </View>

              {recruitmentMajorNames.length > 0 ? (
                <View style={styles.sectionInlineRowTop}>
                  <Text style={styles.sectionHeadingInline}>모집 전공</Text>
                  <View style={styles.recruitmentMajorsChips}>
                    {recruitmentMajorNames.map((name, i) => (
                      <RecruitmentMajorChip key={`${name}-${i}`} label={name} />
                    ))}
                  </View>
                </View>
              ) : null}

              {priceLabel ? (
                <View style={styles.sectionInlineRow}>
                  <Text style={styles.sectionHeadingInline}>비용</Text>
                  <Text style={styles.priceText}>{priceLabel}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.bodySectionBlock}>
              <Text style={styles.sectionHeading}>내용</Text>
              {descriptionText ? (
                <Text style={styles.description}>{descriptionText}</Text>
              ) : (
                <Text style={[styles.description, { color: GRAY.DARK_100 }]}>
                  등록된 내용이 없습니다.
                </Text>
              )}
            </View>

            {addressLabel ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>지역</Text>
                <KakaoMapView place={addressLabel} variant="plain" />
              </View>
            ) : null}

            {attachmentList.length > 0 ? (
              <View style={styles.attachmentsCard}>
                <Text style={styles.sectionHeading}>첨부파일</Text>
                {attachmentList.map((file, index) => (
                  <Pressable key={`${file.name}-${index}`} style={styles.fileRow}>
                    <MaterialCommunityIcons
                      name="paperclip"
                      size={18}
                      color={GRAY.DARK}
                    />
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    {file.size ? (
                      <Text style={styles.fileSize}>{file.size}</Text>
                    ) : null}
                    <MaterialCommunityIcons
                      name="download"
                      size={20}
                      color={GRAY.DARK}
                    />
                  </Pressable>
                ))}
              </View>
            ) : null}

          </View>
          </>
          )}
        </ScrollView>
      </View>
      {showPerformersPanel ? (
        <Animated.View
          layout={LinearTransition.duration(220)}
          style={[
            styles.performersFixedPanel,
            { bottom: bottomBarOffset },
            !performersExpanded && styles.performersFixedPanelCollapsed,
          ]}
          onLayout={(e) =>
            setPerformersPanelHeight(e.nativeEvent.layout.height)
          }
        >
          <AcceptedPerformersSection
            postId={params.postId!}
            announcementTitle={displayTitle}
            typeTag={displayType}
            statusTag={displayStatus}
            dDay={dDayLabel}
            showReviewEntry={isReviewable && !myReviewExists}
            expanded={performersExpanded}
            onToggleExpanded={() => setPerformersExpanded((prev) => !prev)}
            onWriteReview={(p) => {
              navigation.navigate(RootRoutes.ACTIVITY_REVIEW, {
                postId: params.postId,
                revieweeUserId: p.userId,
                revieweeActivityName: p.activityName,
                announcementTitle: displayTitle,
                revieweeHandle: p.handle,
              });
            }}
          />
        </Animated.View>
      ) : null}
      {renderBottomBar()}
      <ReportCategoryModal
        visible={reportModalVisible}
        onClose={() => !reportSubmitting && setReportModalVisible(false)}
        onSelect={handlePickReportCategory}
        submitting={reportSubmitting}
      />
      <AnnouncementStatusSheet
        visible={statusSheetVisible}
        value={currentAnnouncementStatus}
        onClose={() => setStatusSheetVisible(false)}
        onSelect={handleSelectAnnouncementStatus}
      />
      <WheelDateTimePickerModal
        visible={deadlineExtendPickerVisible}
        value={pendingReopenDeadline}
        pickerMode="date"
        title="모집 마감일 연장"
        description="마감일이 지나 모집중으로 되돌리려면 새 마감일을 선택하세요."
        minimumDate={new Date()}
        onConfirm={(selected) => {
          setDeadlineExtendPickerVisible(false);
          void performStatusChange("모집중", selected);
        }}
        onCancel={() => setDeadlineExtendPickerVisible(false)}
      />
    </View>
  );
};

export default AnnouncementDetailScreen;
