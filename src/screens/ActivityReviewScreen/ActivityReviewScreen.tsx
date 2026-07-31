import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  DISAPPOINTMENT_REASON_CODES,
  DISAPPOINTMENT_REASON_LABELS,
  POSITIVE_REASON_CODES,
  POSITIVE_REASON_LABELS,
  type ActivityReviewRating,
  type DisappointmentReasonCode,
  type PositiveReasonCode,
} from "../../lib/apis/announcement/activityReviewTypes";
import {
  getMyActivityReview,
  submitActivityReview,
} from "../../lib/apis/announcement/activityReviewApi";
import styles, { REVIEW_COLORS } from "./styles";

export type ActivityReviewParams = {
  postId: string;
  revieweeUserId: string;
  revieweeActivityName: string;
  announcementTitle: string;
  revieweeHandle?: string;
};

type Step = "rating" | "reasons" | "note" | "complete";

const RATING_META: Record<
  ActivityReviewRating,
  { label: string; icon: "face-frown" | "face-smile" | "face-grin-squint"; color: string }
> = {
  DISAPPOINTING: {
    label: "아쉬웠어요",
    icon: "face-frown",
    color: REVIEW_COLORS.disappointing,
  },
  GOOD: { label: "좋았어요", icon: "face-smile", color: REVIEW_COLORS.good },
  IMPRESSED: {
    label: "감동했어요",
    icon: "face-grin-squint",
    color: REVIEW_COLORS.impressed,
  },
};

const MAX_NOTE = 2000;

const ActivityReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const params = route.params as ActivityReviewParams;

  const [step, setStep] = useState<Step>("rating");
  const [existingReview, setExistingReview] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState<ActivityReviewRating | null>(null);
  const [reasons, setReasons] = useState<DisappointmentReasonCode[]>([]);
  const [positiveReasons, setPositiveReasons] = useState<PositiveReasonCode[]>([]);
  const [comment, setComment] = useState("");
  const [completeNotePreview, setCompleteNotePreview] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await getMyActivityReview(params.postId);
      if (cancelled) return;
      if (existing) {
        setExistingReview(true);
        Alert.alert("알림", "이미 이 공고에 활동 후기를 작성하셨습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
        return;
      }
      setExistingReview(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [params.postId, navigation]);

  const handleBack = useCallback(() => {
    if (step === "complete") {
      navigation.goBack();
      return;
    }
    if (step === "note") {
      setStep("reasons");
      return;
    }
    if (step === "reasons") {
      setStep("rating");
      return;
    }
    navigation.goBack();
  }, [navigation, step]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const toggleReason = (code: DisappointmentReasonCode) => {
    setReasons((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const togglePositiveReason = (code: PositiveReasonCode) => {
    setPositiveReasons((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const submit = async (
    r: ActivityReviewRating,
    opts?: {
      comment?: string;
      codes?: DisappointmentReasonCode[];
      positiveCodes?: PositiveReasonCode[];
    },
  ) => {
    setSubmitting(true);
    const body: Parameters<typeof submitActivityReview>[1] = {
      revieweeUserId: params.revieweeUserId,
      rating: r,
    };
    if (r === "DISAPPOINTING") {
      const pickedCodes = opts?.codes ?? reasons;
      body.disappointmentReasonCodes = pickedCodes.length > 0 ? pickedCodes : null;
    } else {
      const pickedPositiveCodes = opts?.positiveCodes ?? positiveReasons;
      body.positiveReasonCodes =
        pickedPositiveCodes.length > 0 ? pickedPositiveCodes : null;
    }
    const trimmedComment = (opts?.comment ?? comment).trim();
    body.comment = trimmedComment ? trimmedComment.slice(0, MAX_NOTE) : null;
    const res = await submitActivityReview(params.postId, body);
    setSubmitting(false);
    if (!res.ok) {
      const msg =
        res.status === 409
          ? "이미 이 공고에 후기를 제출하셨습니다."
          : res.message?.trim() || "후기 제출에 실패했습니다.";
      Alert.alert("알림", msg);
      return;
    }
    setCompleteNotePreview(trimmedComment || null);
    setStep("complete");
  };

  const onPressNextFromRating = () => {
    if (!rating) return;
    setStep("reasons");
  };

  const onPressNextFromReasons = () => {
    if (!rating) return;
    setStep("note");
  };

  const onPressSubmitNote = () => {
    if (!rating) return;
    if (rating === "DISAPPOINTING") {
      void submit("DISAPPOINTING", { codes: reasons, comment });
      return;
    }
    void submit(rating, { positiveCodes: positiveReasons, comment });
  };

  const partnerLine = params.revieweeHandle?.trim()
    ? `@${params.revieweeHandle.trim()} [${params.revieweeActivityName}] 님과의`
    : `${params.revieweeActivityName} 님과의`;

  if (existingReview === null) {
    return (
      <View style={[styles.flex, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={REVIEW_COLORS.buttonActive} />
      </View>
    );
  }

  if (existingReview) {
    return <View style={styles.flex} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={12}
          disabled={submitting}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === "complete" ? "" : "활동 후기 작성"}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === "rating" ? (
          <>
            <Text style={styles.headline}>{partnerLine}</Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText} numberOfLines={2}>
                {params.announcementTitle}
              </Text>
            </View>
            <Text style={styles.headlineMuted}>활동은 어떠셨나요?</Text>
            <View style={styles.ratingBox}>
              <View style={styles.ratingRow}>
                {(
                  ["DISAPPOINTING", "GOOD", "IMPRESSED"] as ActivityReviewRating[]
                ).map((key) => {
                  const meta = RATING_META[key];
                  const selected = rating === key;
                  const dim = rating != null && !selected;
                  const color = selected
                    ? meta.color
                    : dim
                      ? "#D1D5DB"
                      : REVIEW_COLORS.disabled;
                  return (
                    <Pressable
                      key={key}
                      style={styles.ratingOption}
                      onPress={() => setRating(key)}
                    >
                      <FontAwesome6
                        name={meta.icon}
                        size={44}
                        color={color}
                        solid
                      />
                      <Text
                        style={[
                          styles.ratingLabel,
                          { color: selected ? meta.color : color },
                        ]}
                      >
                        {meta.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        ) : null}

        {step === "reasons" ? (
          <>
            <Text style={styles.subline}>{partnerLine}</Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText} numberOfLines={2}>
                {params.announcementTitle}
              </Text>
            </View>
            <Text style={styles.question}>
              {rating === "DISAPPOINTING" ? "어떤 점이 아쉬웠나요?" : "어떤 점이 좋았나요?"}
            </Text>
            <View style={{ marginTop: 16 }}>
              {(rating === "DISAPPOINTING"
                ? DISAPPOINTMENT_REASON_CODES
                : POSITIVE_REASON_CODES
              ).map((code) => {
                const on =
                  rating === "DISAPPOINTING"
                    ? reasons.includes(code as DisappointmentReasonCode)
                    : positiveReasons.includes(code as PositiveReasonCode);
                return (
                  <Pressable
                    key={code}
                    style={styles.reasonRow}
                    onPress={() =>
                      rating === "DISAPPOINTING"
                        ? toggleReason(code as DisappointmentReasonCode)
                        : togglePositiveReason(code as PositiveReasonCode)
                    }
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: on ? REVIEW_COLORS.good : "#9CA3AF",
                          backgroundColor: on ? REVIEW_COLORS.good : "transparent",
                        },
                      ]}
                    >
                      {on ? (
                        <MaterialCommunityIcons
                          name="check"
                          size={16}
                          color="#fff"
                        />
                      ) : null}
                    </View>
                    <Text style={styles.reasonText}>
                      {rating === "DISAPPOINTING"
                        ? DISAPPOINTMENT_REASON_LABELS[code as DisappointmentReasonCode]
                        : POSITIVE_REASON_LABELS[code as PositiveReasonCode]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {step === "note" && rating ? (
          <>
            <Text style={styles.question}>
              {rating === "DISAPPOINTING"
                ? "아쉬운 부분을 남겨주세요."
                : "상대방에게 남기고 싶은 말이 있나요?"}
            </Text>
            <TextInput
              style={styles.noteInput}
              placeholder={
                rating === "DISAPPOINTING"
                  ? "다음에 더 나아질 수 있도록 아쉬웠던 점을 남겨주세요 (선택)"
                  : "함께해서 좋았던 점을 자유롭게 남겨주세요 (선택)"
              }
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={MAX_NOTE}
              value={comment}
              onChangeText={setComment}
            />
            <Text style={styles.noteHint}>
              *작성한 내용은 상대방 프로필의 후기에 공개됩니다.*
            </Text>
          </>
        ) : null}

        {step === "complete" && rating ? (
          <>
            <Text style={styles.completeTitle}>후기 작성이 완료되었습니다.</Text>
            <View style={styles.summaryCard}>
              <FontAwesome6
                name={RATING_META[rating].icon}
                size={48}
                color="#fff"
                solid
              />
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 17,
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                {RATING_META[rating].label}
              </Text>
            </View>
            {completeNotePreview ? (
              <Text style={styles.summaryNote}>{completeNotePreview}</Text>
            ) : null}
            {rating === "DISAPPOINTING" && reasons.length > 0 ? (
              <View style={{ marginTop: 16 }}>
                {reasons.map((code) => (
                  <View key={code} style={styles.reasonChip}>
                    <Text style={styles.reasonChipText}>
                      {DISAPPOINTMENT_REASON_LABELS[code]}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {rating !== "DISAPPOINTING" && positiveReasons.length > 0 ? (
              <View style={{ marginTop: 16 }}>
                {positiveReasons.map((code) => (
                  <View key={code} style={styles.reasonChip}>
                    <Text style={styles.reasonChipText}>
                      {POSITIVE_REASON_LABELS[code]}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            <Pressable
              style={[
                styles.nextBtn,
                {
                  marginTop: 32,
                  backgroundColor: REVIEW_COLORS.buttonActive,
                },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.nextBtnText}>확인</Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>

      {step !== "complete" ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {step === "rating" ? (
            <Pressable
              style={[
                styles.nextBtn,
                {
                  backgroundColor: rating
                    ? REVIEW_COLORS.buttonActive
                    : REVIEW_COLORS.disabled,
                },
              ]}
              disabled={!rating || submitting}
              onPress={onPressNextFromRating}
            >
              <Text style={styles.nextBtnText}>다음</Text>
            </Pressable>
          ) : null}
          {step === "reasons" ? (
            <Pressable
              style={[
                styles.nextBtn,
                {
                  backgroundColor: REVIEW_COLORS.buttonActive,
                },
              ]}
              onPress={onPressNextFromReasons}
            >
              <Text style={styles.nextBtnText}>다음</Text>
            </Pressable>
          ) : null}
          {step === "note" ? (
            <Pressable
              style={[
                styles.nextBtn,
                { backgroundColor: REVIEW_COLORS.buttonActive },
              ]}
              disabled={submitting}
              onPress={onPressSubmitNote}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.nextBtnText}>후기 남기기</Text>
              )}
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default ActivityReviewScreen;
