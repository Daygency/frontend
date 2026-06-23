import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect as useNavFocusEffect,
} from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { getMyActivityReview } from "../../lib/apis/announcement/activityReviewApi";
import { getMyApplicationForPost } from "../../lib/apis/application/applicationApi";
import type { ApplicationEntity } from "../../lib/apis/application/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnnouncementCard from "../../components/cards/AnnouncementCard";
import AnnouncementDetailOptionsMenu from "./AnnouncementDetailOptionsMenu";
import AcceptedPerformersSection from "./AcceptedPerformersSection";
import { GRAY, MAIN, WHITE } from "../../color";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../../lib/media/attachmentImageUrl";
import KakaoMapView from "../../components/kakao/KakaoMapView/KakaoMapView";
import { hasMapCoords, parseCoord } from "../../lib/kakao/location";
import { extractAnnouncementAuthorFromDetail } from "../../lib/announcement/extractAnnouncementAuthor";
import type { AnnouncementAuthor } from "../../lib/announcement/extractAnnouncementAuthor";
import { useAnnouncementAuthorLabel } from "../../lib/announcement/useAnnouncementAuthorLabel";
import { RootRoutes } from "../../navigations/routes";
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
  formatAnnouncementPriceLine,
  normalizeAnnouncementPriceType,
  parseAnnouncementPrice,
} from "../../lib/announcement/announcementPrice";
import {
  effectiveAnnouncementDaysLeft,
  formatAnnouncementDDayLabel,
  isRecruitmentDeadlineDatePassed,
} from "../../lib/announcement/announcementDeadline";
import { parseAnnouncementDaysLeft } from "../../lib/announcement/parseAnnouncementDaysLeft";
import { pickMajorsFromAnnouncementRaw } from "../../lib/announcement/recruitmentMajors";
import {
  extractApplicationConfigRaw,
  parseApplicationConfig,
} from "../../lib/application/parseApplicationConfig";
import { useAuth } from "../../contexts/AuthContext";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import ReportCategoryModal from "../../components/modals/ReportCategoryModal";
import { createReport } from "../../lib/apis/report/reportApi";
import type { ReportCategory } from "../../lib/apis/report/types";
import { messageForReportHttpStatus } from "../../lib/report/reportErrorMessage";
import { confirmReportSubmission } from "../../lib/report/confirmReportSubmission";
import { pickReportedUserIdFromUnknown } from "../../lib/report/pickReportedUserId";
import { isContentNew } from "../../lib/content/newBadge";
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

function formatDateKorean(iso?: string): string {
  if (!iso?.trim()) return "";
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return "";
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

function formatTimeHHMM(iso?: string): string {
  if (!iso?.trim()) return "";
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return "";
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function parseAnnouncementAttachments(
  raw: unknown,
): { name: string; size: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { name: string; size: string }[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
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

const AnnouncementDetailScreen = () => {
  const route = useRoute<AnnouncementDetailRouteProp>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  /** 홈 인디케이터 등 안전 영역 + 아주 소량만 (박스 없이 버튼만 붙일 때) */
  const floatingBottomPad = insets.bottom + 4;
  const { isLoggedIn, user } = useAuth();
  const { ensureLoggedIn } = useRequireLogin();
  const params = route.params ?? {};
  const { width: screenWidth } = useWindowDimensions();
  const [isMine, setIsMine] = useState(false);
  const [hasApplicants, setHasApplicants] = useState(false);
  const [imageHeights, setImageHeights] = useState<{ [key: number]: number }>(
    {},
  );
  const [detailData, setDetailData] = useState<{
    title: string;
    type: string;
    status: string;
    daysLeft: number;
    applicationConfig: ApplicationConfig | null;
    content?: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
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
  const [closingEarly, setClosingEarly] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [myReviewExists, setMyReviewExists] = useState(false);
  const [myApplication, setMyApplication] = useState<ApplicationEntity | null>(
    null,
  );
  const authorDisplayLabel = useAnnouncementAuthorLabel(author);

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
    if (!params.postId) return Promise.resolve();
    console.log("[AnnouncementDetail] 인증 상태:", {
      isLoggedIn,
      userId: user?.socialId ?? "(없음)",
      name: user?.name ?? "(없음)",
    });
    return getAnnouncementDetail(params.postId).then((res) => {
      console.log(
        "[AnnouncementDetail] API 응답:",
        JSON.stringify(res, null, 2),
      );
      if (!res || typeof res !== "object") return;
      const d = res as Record<string, unknown>;
      const get = (k: string, alt?: string) =>
        (d[k] ?? d[k.replace(/([A-Z])/g, "_$1").toLowerCase() ?? ""] ?? alt) as
          | string
          | undefined;
      const mine =
        (d.isMine as boolean | undefined) ?? (d.is_mine as boolean | undefined);
      if (typeof mine === "boolean") setIsMine(mine);

      const extractedAuthor = extractAnnouncementAuthorFromDetail(d);
      if (extractedAuthor) {
        setAuthor(extractedAuthor);
      } else if (
        mine &&
        user?.socialId?.trim()
      ) {
        setAuthor({
          userId: user.socialId.trim(),
          name: user.name?.trim() || undefined,
          profileImgUrl: user.profileImgUrl?.trim() || undefined,
        });
      } else {
        setAuthor(null);
      }

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
      let status =
        typeof isRecruiting === "boolean"
          ? isRecruiting
            ? "모집중"
            : "모집마감"
          : (params.status ?? "모집중");
      if (daysLeft < 0) {
        status = "모집마감";
      }
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
        : [];

      const viewCountRaw = d.viewCount ?? d.view_count;
      const parsedViewCount =
        typeof viewCountRaw === "number" &&
        Number.isFinite(viewCountRaw) &&
        viewCountRaw >= 0
          ? Math.floor(viewCountRaw)
          : undefined;

      const completedRaw = d.completed ?? d.completed_manually;
      const completedFlag =
        typeof completedRaw === "boolean" ? completedRaw : false;
      const createdAt =
        get("createdAt") ?? get("created_at") ?? undefined;

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
        latitude: parseCoord(d.latitude),
        longitude: parseCoord(d.longitude),
        ...(deadlineAt ? { deadlineAt } : {}),
        ...(scheduledAt ? { scheduledAt } : {}),
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
        ...(attachmentRows.length > 0 ? { attachments: attachmentRows } : {}),
        ...(majorsList.length > 0 ? { majors: majorsList } : {}),
        ...(createdAt ? { createdAt: String(createdAt) } : {}),
      });
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

  useNavFocusEffect(
    useCallback(() => {
      const postId = params.postId;
      if (!postId || !isLoggedIn) {
        setMyReviewExists(false);
        setMyApplication(null);
        return;
      }
      let cancelled = false;
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
      })();
      return () => {
        cancelled = true;
      };
    }, [params.postId, isLoggedIn, isMine]),
  );

  useEffect(() => {
    if (!params.postId || !isMine) {
      setHasApplicants(false);
      return;
    }
    let cancelled = false;
    void getApplicationsForPost(params.postId).then((res) => {
      if (cancelled) return;
      if (res?.ok) {
        setHasApplicants(res.data.length > 0);
      } else {
        setHasApplicants(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.postId, isMine]);

  const displayTitle = detailData?.title ?? params.title ?? "";
  const displayType = detailData?.type ?? params.type ?? "";
  const displayStatus = detailData?.status ?? params.status ?? "모집중";
  const displayDaysLeft = detailData?.daysLeft ?? params.daysLeft ?? 0;
  const displayViewCount =
    detailData?.viewCount ?? params.viewCount;

  const deadlineAtForUi = detailData?.deadlineAt;
  const displayCompleted = detailData?.completed ?? false;

  const showApplicantReviewBar =
    !isMine &&
    displayCompleted &&
    isLoggedIn &&
    !myReviewExists &&
    myApplication?.status === "ACCEPTED";
  const showApplicantApplyBar = !isMine && !displayCompleted;
  const visitorBottomBar = showApplicantApplyBar || showApplicantReviewBar;

  /** 작성자·미완료일 때 하단 한 칸: 조기 마감 ↔ 공연 완료 둘 중 하나만 */
  const showOwnerActionBar =
    isMine && Boolean(params.postId) && !displayCompleted;

  const showEarlyCloseButton =
    showOwnerActionBar &&
    displayStatus === "모집중" &&
    !isRecruitmentDeadlineDatePassed(deadlineAtForUi);

  const onEarlyClose = useCallback(() => {
    if (!params.postId) return;
    Alert.alert(
      "조기 마감",
      "지금 모집을 마감하면 더 이상 새 지원을 받을 수 없습니다. 진행할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "마감하기",
          style: "destructive",
          onPress: async () => {
            setClosingEarly(true);
            try {
              const res = await updateAnnouncement(params.postId!, {
                status: "CLOSED",
              });
              if (res.ok) {
                setDetailData((prev) =>
                  prev
                    ? { ...prev, status: "모집마감" }
                    : prev,
                );
                // 조기 마감 직후에는 로컬 상태를 우선 반영해 버튼이 즉시 "공연 완료"로 전환되게 함.
                // (일부 응답에서 isRecruiting이 지연 갱신되어 바로 재조회하면 UI가 되돌아갈 수 있음)
                Alert.alert("알림", "모집이 마감되었습니다.");
              } else {
                Alert.alert(
                  "알림",
                  res.message?.trim() || "조기 마감에 실패했습니다.",
                );
              }
            } catch {
              Alert.alert("알림", "조기 마감에 실패했습니다.");
            } finally {
              setClosingEarly(false);
            }
          },
        },
      ],
    );
  }, [params.postId, fetchDetail]);

  const onMarkComplete = useCallback(() => {
    if (!params.postId) return;
    Alert.alert(
      "공연 완료",
      "공연·일정을 마친 것으로 표시합니다. 진행할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "완료하기",
          onPress: async () => {
            setCompleting(true);
            try {
              const res = await updateAnnouncement(params.postId!, {
                completed: true,
              });
              if (res.ok) {
                setDetailData((prev) =>
                  prev ? { ...prev, completed: true } : prev,
                );
                await fetchDetail();
                Alert.alert("알림", "완료 처리되었습니다.");
              } else {
                Alert.alert(
                  "알림",
                  res.message?.trim() || "완료 처리에 실패했습니다.",
                );
              }
            } catch {
              Alert.alert("알림", "완료 처리에 실패했습니다.");
            } finally {
              setCompleting(false);
            }
          },
        },
      ],
    );
  }, [params.postId, fetchDetail]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AnnouncementDetailOptionsMenu
          isMine={isMine}
          postId={params.postId}
          onEdit={() => {
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
      ),
    });
  }, [navigation, isMine, params.postId, hasApplicants, handleOpenReport]);

  const imageList = detailData?.imageUrls ?? [];
  const attachmentList = detailData?.attachments ?? [];

  const deadlineLabel = formatDateKorean(detailData?.deadlineAt);
  const scheduledLabel = formatDateKorean(detailData?.scheduledAt);
  const scheduledTimeLabel = formatTimeHHMM(detailData?.scheduledAt);
  const addressLabel = detailData?.address?.trim() || "";
  const descriptionText = detailData?.content?.trim() ?? "";

  const handleImageLoad = (index: number, event: any) => {
    const { width, height } = event.nativeEvent.source;
    const imageWidth = screenWidth - 40;
    const aspectRatio = height / width;
    const calculatedHeight = imageWidth * aspectRatio;
    setImageHeights((prev) => ({ ...prev, [index]: calculatedHeight }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: showOwnerActionBar ? 88 : visitorBottomBar ? 100 : 32,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MAIN.DEFAULT}
            colors={[MAIN.DEFAULT]}
          />
        }
      >
        <View style={styles.contentSheetFlush}>
          <View style={{ paddingHorizontal: 12 }}>
            <AnnouncementCard
              title={displayTitle}
              type={displayType}
              status={displayStatus}
              daysLeft={displayDaysLeft}
              deadlineAt={detailData?.deadlineAt}
              viewCount={displayViewCount}
              priceType={detailData?.priceType}
              price={detailData?.price}
              address={addressLabel}
              authorName={authorDisplayLabel}
              profileImgUrl={author?.profileImgUrl}
              showNew={isContentNew(detailData?.createdAt)}
            />
          </View>
        </View>
        {isMine && params.postId ? (
          <View style={[styles.contentSheet, { paddingVertical: 16 }]}>
            <AcceptedPerformersSection
              postId={params.postId}
              announcementTitle={displayTitle}
              typeTag={displayType}
              statusTag={displayStatus}
              dDay={formatAnnouncementDDayLabel(
                displayDaysLeft,
                displayStatus,
              )}
              displayCompleted={displayCompleted}
              showReviewEntry={displayCompleted && !myReviewExists}
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
          </View>
        ) : null}
        <View style={styles.contentSheet}>
          {author ? (
            <Pressable
              style={({ pressed }) => [
                styles.producerInfo,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() =>
                navigation.navigate(RootRoutes.ARTIST_PORTFOLIO, {
                  userId: author.userId,
                  activityName: author.activityName?.trim() ?? "",
                })
              }
            >
              <ApplicantAvatar
                peerUserId={author.userId}
                peer={{
                  userId: author.userId,
                  name: author.name,
                  activityName: author.activityName,
                  profileImageUrl: author.profileImgUrl,
                }}
                size={36}
              />
              <Text style={styles.producerName} numberOfLines={1}>
                {authorDisplayLabel}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.producerInfo}>
              <ApplicantAvatar peerUserId={undefined} peer={null} size={36} />
              <Text style={styles.producerName}>작성자</Text>
            </View>
          )}
        </View>
        <View style={styles.contentSheet}>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={17}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>마감일 : </Text>
              <Text style={styles.infoValue}>
                {deadlineLabel || "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={17}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>예정일 : </Text>
              <Text style={styles.infoValue}>
                {scheduledLabel || "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={17}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>예정 시간 : </Text>
              <Text style={styles.infoValue}>
                {scheduledTimeLabel || "-"}
              </Text>
            </View>
            {detailData != null ? (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={17}
                  color={MAIN.DEFAULT}
                />
                <Text style={styles.infoLabel}>금액 : </Text>
                <Text style={styles.infoValue}>
                  {formatAnnouncementPriceLine(
                    detailData.priceType ?? "PENDING",
                    detailData.price ?? 0,
                  )}
                </Text>
              </View>
            ) : null}
            {detailData?.majors && detailData.majors.length > 0 ? (
              <View style={styles.majorsBlock}>
                <Text style={styles.majorsLabel}>모집전공</Text>
                <View style={styles.majorsChips}>
                  {detailData.majors.map((m, i) => (
                    <View
                      key={`${m.majorId}-${i}`}
                      style={styles.majorChip}
                    >
                      <Text style={styles.majorChipText}>{m.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <View style={styles.statusBadge}>
                <MaterialCommunityIcons name="check" size={10} color={WHITE} />
              </View>
              <Text style={styles.statusText}>{displayStatus}</Text>
            </View>
          </View>
        </View>
        {detailData && hasMapCoords(detailData) ? (
          <View style={styles.contentSheet}>
            <Text style={styles.mapSectionLabel}>공연 위치</Text>
            <KakaoMapView
              latitude={detailData.latitude}
              longitude={detailData.longitude}
              height={200}
            />
          </View>
        ) : null}
        <View style={styles.contentSheet}>
          {descriptionText ? (
            <Text style={styles.descriptionText}>{descriptionText}</Text>
          ) : (
            <Text style={[styles.descriptionText, { color: GRAY.DARK_100 }]}>
              등록된 본문이 없습니다.
            </Text>
          )}
          {imageList.map((uri, index) => (
            <Image
              key={`${uri}-${index}`}
              source={{ uri }}
              resizeMode="cover"
              style={[
                styles.contentImage,
                { height: imageHeights[index] || 200 },
              ]}
              onLoad={(event) => handleImageLoad(index, event)}
            />
          ))}
        </View>
        {attachmentList.length > 0 ? (
          <View style={styles.contentSheet}>
            <Text style={styles.attachmentTitle}>첨부파일</Text>
            {attachmentList.map((file, index) => (
              <Pressable
                key={`${file.name}-${index}`}
                style={styles.attachmentCard}
                onPress={() => {}}
              >
                <MaterialCommunityIcons
                  name="paperclip"
                  size={20}
                  color={MAIN.DEFAULT}
                />
                <View style={styles.attachmentInfo}>
                  <Text style={styles.attachmentFileName}>{file.name}</Text>
                  {file.size ? (
                    <Text style={styles.attachmentFileSize}>{file.size}</Text>
                  ) : null}
                </View>
                <MaterialCommunityIcons
                  name="download"
                  size={22}
                  color={MAIN.DEFAULT}
                />
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
      {!isMine && showApplicantReviewBar ? (
        <View
          style={[
            styles.floatingBottomBar,
            { paddingBottom: floatingBottomPad },
          ]}
        >
          <Pressable
            style={[styles.btnApply, { bottom: 0 }]}
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
            <Text style={styles.btnApplyText}>활동 후기 작성</Text>
          </Pressable>
        </View>
      ) : !isMine && showApplicantApplyBar ? (
        <View
          style={[
            styles.floatingBottomBar,
            { paddingBottom: floatingBottomPad },
          ]}
        >
          <Pressable
            style={[styles.btnApply, { bottom: 0 }]}
            onPress={() => {
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
                  detailData?.applicationConfig ??
                  params.applicationConfig ??
                  null,
              });
            }}
          >
            <Text style={styles.btnApplyText}>지원서 작성하기</Text>
          </Pressable>
        </View>
      ) : showOwnerActionBar ? (
        showEarlyCloseButton ? (
          <View
            style={[
              styles.floatingBottomBar,
              { paddingBottom: floatingBottomPad },
            ]}
          >
            <Pressable
              style={[
                styles.btnApply,
                { bottom: 0 },
                closingEarly && { opacity: 0.65 },
              ]}
              disabled={closingEarly}
              onPress={onEarlyClose}
            >
              {closingEarly ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <Text style={styles.btnApplyText}>조기 마감</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.floatingBottomBar,
              { paddingBottom: floatingBottomPad },
            ]}
          >
            <Pressable
              style={[
                styles.btnApply,
                { bottom: 0 },
                completing && { opacity: 0.65 },
              ]}
              disabled={completing}
              onPress={onMarkComplete}
            >
              {completing ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <Text style={styles.btnApplyText}>공연 완료</Text>
              )}
            </Pressable>
          </View>
        )
      ) : null}
      <ReportCategoryModal
        visible={reportModalVisible}
        onClose={() => !reportSubmitting && setReportModalVisible(false)}
        onSelect={handlePickReportCategory}
        submitting={reportSubmitting}
      />
    </View>
  );
};

export default AnnouncementDetailScreen;
