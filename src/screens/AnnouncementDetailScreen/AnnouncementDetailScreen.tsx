import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnnouncementBox from "../../components/AnnouncementBox/AnnouncementBox";
import AnnouncementDetailOptionsMenu from "./AnnouncementDetailOptionsMenu";
import AcceptedPerformersSection from "./AcceptedPerformersSection";
import { GRAY, MAIN, WHITE } from "../../color";
import ApplicantAvatar from "../../lib/chat/ApplicantAvatar";
import {
  mapAttachmentsToImageUrls,
  pickUrlFromFileLike,
} from "../../lib/media/attachmentImageUrl";
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
import type { ApplicationConfig } from "../../lib/apis/announcement/types";
import {
  extractApplicationConfigRaw,
  parseApplicationConfig,
} from "../../lib/application/parseApplicationConfig";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles";

export type AnnouncementDetailParams = {
  title: string;
  type: string;
  status: string;
  daysLeft: number;
  postId?: string;
  postedDate?: string;
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
  const { isLoggedIn, user } = useAuth();
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
    deadlineAt?: string;
    scheduledAt?: string;
    imageUrls?: string[];
    attachments?: { name: string; size: string }[];
  } | null>(null);
  const [author, setAuthor] = useState<AnnouncementAuthor | null>(null);
  const [closingEarly, setClosingEarly] = useState(false);
  const authorDisplayLabel = useAnnouncementAuthorLabel(author);

  const fetchDetail = useCallback(() => {
    if (!params.postId) return;
    console.log("[AnnouncementDetail] 인증 상태:", {
      isLoggedIn,
      userId: user?.socialId ?? "(없음)",
      nickname: user?.nickname ?? "(없음)",
    });
    getAnnouncementDetail(params.postId).then((res) => {
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
          nickname: user.nickname?.trim() || undefined,
          profileImgUrl: user.profileImgUrl?.trim() || undefined,
        });
      } else {
        setAuthor(null);
      }

      const title = get("title") ?? params.title ?? "";
      const type = get("type") ?? params.type ?? "";
      const isRecruiting = d.isRecruiting ?? d.is_recruiting;
      const status =
        typeof isRecruiting === "boolean"
          ? isRecruiting
            ? "모집중"
            : "모집마감"
          : (params.status ?? "모집중");
      const dDay = get("dDay") ?? get("d_day") ?? `D-${params.daysLeft ?? 0}`;
      const daysLeft =
        parseInt(dDay.replace(/\D/g, ""), 10) || params.daysLeft || 0;
      const applicationConfig = parseApplicationConfig(
        extractApplicationConfigRaw(d),
      );

      const rawContent = get("content");
      const rawAddress = get("address");
      const deadlineAt =
        get("deadlineAt") ?? get("deadline_at") ?? undefined;
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

      setDetailData({
        title: String(title),
        type: String(type),
        status,
        daysLeft,
        applicationConfig,
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

  useFocusEffect(
    useCallback(() => {
      if (params.postId) fetchDetail();
      return () => {};
    }, [params.postId, fetchDetail]),
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

  const canEarlyClose =
    isMine &&
    Boolean(params.postId) &&
    displayStatus === "모집중";

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
              const res = await updateAnnouncement(params.postId, {
                status: "CLOSED",
              });
              if (res.ok) {
                fetchDetail();
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
          onReport={() => {
            Alert.alert("알림", "신고 기능은 준비 중입니다.");
          }}
        />
      ),
    });
  }, [navigation, isMine, params.postId, hasApplicants]);

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
        contentContainerStyle={{
          paddingBottom: canEarlyClose || !isMine ? 100 : 32,
        }}
      >
        <View style={styles.dividerThick} />
        <AnnouncementBox
          title={displayTitle}
          type={displayType}
          status={displayStatus}
          daysLeft={displayDaysLeft}
        />
        {isMine && params.postId ? (
          <>
            <View style={styles.dividerThick} />
            <AcceptedPerformersSection
              postId={params.postId}
              announcementTitle={displayTitle}
              typeTag={displayType}
              statusTag={displayStatus}
              dDay={`D-${displayDaysLeft}`}
            />
          </>
        ) : null}
        <View style={styles.dividerThick} />
        <View style={styles.section}>
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
                  nickname: author.nickname,
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
          <View style={styles.divider} />
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={16}
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
                size={16}
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
                size={16}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>예정 시간 : </Text>
              <Text style={styles.infoValue}>
                {scheduledTimeLabel || "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color={MAIN.DEFAULT}
              />
              <Text style={styles.infoLabel}>장소 : </Text>
              <Text style={styles.infoValue}>
                {addressLabel || "-"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.statusBadge}>
                <MaterialCommunityIcons name="check" size={10} color={WHITE} />
              </View>
              <Text style={styles.statusText}>{displayStatus}</Text>
            </View>
          </View>
        </View>
        <View style={styles.dividerThick} />
        <View style={styles.section}>
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
          <>
            <View style={styles.dividerThick} />
            <View style={styles.section}>
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
          </>
        ) : null}
      </ScrollView>
      {!isMine ? (
        <View style={styles.applyContainer}>
          <Pressable
            style={styles.btnApply}
            onPress={() => {
              if (!isLoggedIn) {
                Alert.alert("알림", "로그인 후 지원서를 작성할 수 있습니다.");
                return;
              }
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
      ) : canEarlyClose ? (
        <View style={styles.earlyCloseBar}>
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
      ) : null}
    </View>
  );
};

export default AnnouncementDetailScreen;
