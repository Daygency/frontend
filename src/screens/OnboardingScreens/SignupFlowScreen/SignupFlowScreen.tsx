import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignupFlowProgress from "../../../components/SignupFlowProgress/SignupFlowProgress";
import { useAuth } from "../../../contexts/AuthContext";
import { MAIN, GRAY, WHITE } from "../../../color";
import { isDupActivityName } from "../../../lib/apis/portfolio/IsDupActivityName";
import { styles, roleSelectionStyles } from "./styles";

export type UserRole = "artist" | "planner";

const ANIMATION_DURATION = 300;

const SignupFlowScreen = () => {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { completeSignup, logout } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("artist");
  const slideX = useSharedValue(0);

  // Step 2 state
  const [name, setName] = useState("");
  const [activityName, setActivityName] = useState("");
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isActivityNameFocused, setIsActivityNameFocused] = useState(false);
  const [isCheckingActivityName, setIsCheckingActivityName] = useState(false);
  const [isActivityNameDuplicate, setIsActivityNameDuplicate] = useState<
    boolean | null
  >(null);
  const [activityNameMessage, setActivityNameMessage] = useState<string>("");
  const [isActivityNameVerified, setIsActivityNameVerified] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  const allRequiredChecked =
    ageChecked &&
    termsChecked &&
    privacyChecked &&
    activityName.trim().length > 0 &&
    isActivityNameVerified &&
    isActivityNameDuplicate === false;

  useEffect(() => {
    const all =
      ageChecked && termsChecked && privacyChecked && marketingChecked;
    setAgreeAll(all);
  }, [ageChecked, termsChecked, privacyChecked, marketingChecked]);

  const handleAgreeAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgeChecked(next);
    setTermsChecked(next);
    setPrivacyChecked(next);
    setMarketingChecked(next);
  };

  const handleCheckActivityId = async () => {
    const value = activityName.trim();
    if (!value) {
      setIsActivityNameDuplicate(null);
      setActivityNameMessage("");
      setIsActivityNameVerified(false);
      return;
    }

    try {
      setIsCheckingActivityName(true);
      const isDup = await isDupActivityName(value);
      setIsActivityNameDuplicate(isDup);
      if (isDup) {
        setActivityNameMessage("이미 사용 중인 활동 아이디입니다.");
      } else {
        setActivityNameMessage("사용 가능한 활동 아이디입니다.");
        setIsActivityNameVerified(true);
      }
    } catch {
      setIsActivityNameDuplicate(null);
      setActivityNameMessage("활동 아이디 중복 확인에 실패했습니다.");
      setIsActivityNameVerified(false);
    } finally {
      setIsCheckingActivityName(false);
    }
  };

  const handleComplete = async () => {
    if (!allRequiredChecked) return;
    try {
      if (activityName.trim()) {
        const isDup = await isDupActivityName(activityName.trim());
        if (isDup) {
          Alert.alert(
            "활동 아이디 중복",
            "이미 사용 중인 활동 아이디입니다. 다른 아이디를 입력해주세요.",
          );
          return;
        }
      }

      await completeSignup({
        role: selectedRole,
        name: name.trim() || undefined,
        activityName: activityName.trim(),
      });
    } catch {
      // 에러는 AuthContext에서 Alert 처리
    }
  };

  const goToStep2 = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
    slideX.value = withTiming(-width, { duration: ANIMATION_DURATION });
  };

  const goToStep1 = () => {
    setStep(1);
    slideX.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  const handleBackFromRoleSelection = () => {
    Alert.alert(
      "가입 취소",
      "가입을 취소하고 로그인 화면으로 돌아가시겠어요?",
      [
        { text: "아니요", style: "cancel" },
        { text: "예", onPress: () => logout() },
      ]
    );
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const pageWidth = width;

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <View style={styles.headerRow}>
        {step === 1 ? (
          <Pressable
            style={styles.backButton}
            onPress={handleBackFromRoleSelection}
            hitSlop={12}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={MAIN.DEFAULT}
            />
          </Pressable>
        ) : null}
        <SignupFlowProgress currentStep={step} />
        {step === 2 && (
          <Pressable style={styles.backButton} onPress={goToStep1} hitSlop={12}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={MAIN.DEFAULT}
            />
          </Pressable>
        )}
      </View>

      <View style={[styles.sliderWrapper, { width: pageWidth }]}>
        <Animated.View
          style={[
            styles.sliderTrack,
            { width: pageWidth * 2 },
            contentAnimatedStyle,
          ]}
        >
          <View
            style={[
              styles.slidePage,
              { width: pageWidth, minWidth: pageWidth },
            ]}
            collapsable={false}
          >
            <View style={[styles.content, { paddingBottom: bottom + 24 }]}>
              <Text style={roleSelectionStyles.mainQuestion}>
                {"데이전시를,\n어떤 역할로 이용하시겠어요?"}
              </Text>
              <Text style={roleSelectionStyles.subText}>
                {
                  "선택한 역할에 맞춰 프로필 형식이 생성되고,\n두 역할 모두 기능은 동일합니다."
                }
              </Text>

              <View style={roleSelectionStyles.optionsContainer}>
                <Pressable
                  style={({ pressed }) => [
                    roleSelectionStyles.roleOption,
                    roleSelectionStyles.artistOption,
                    pressed && roleSelectionStyles.optionPressed,
                  ]}
                  onPress={() => goToStep2("artist")}
                >
                  <View style={roleSelectionStyles.textWrap}>
                    <Text style={roleSelectionStyles.roleTitle}>
                      아티스트로 시작하기
                    </Text>
                    <Text style={roleSelectionStyles.roleDescription}>
                      예술가로서의 여러 활동을 더 활발하게 이어가고 싶어요
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    roleSelectionStyles.roleOption,
                    roleSelectionStyles.plannerOption,
                    pressed && roleSelectionStyles.optionPressed,
                  ]}
                  onPress={() => goToStep2("planner")}
                >
                  <View style={roleSelectionStyles.textWrap}>
                    <Text style={roleSelectionStyles.roleTitle}>
                      기획자로 시작하기
                    </Text>
                    <Text style={roleSelectionStyles.roleDescription}>
                      공연 기획의 전 과정을 한 곳에서 관리하고 싶어요
                    </Text>
                  </View>
                </Pressable>
              </View>

              <Text style={roleSelectionStyles.footerText}>
                가입 후에 두 역할 모두 사용할 수 있어요.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.slidePage,
              styles.formPage,
              { width: pageWidth, minWidth: pageWidth },
            ]}
            collapsable={false}
          >
            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={[
                styles.formContent,
                { paddingBottom: bottom + 24 },
              ]}
              showsVerticalScrollIndicator={false}
              bounces={false}
              alwaysBounceVertical={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.heading1}>회원가입하고</Text>
              <Text style={styles.heading2}>
                예술 활동을 더 체계적으로 시작해보세요!
              </Text>

              <View style={styles.inputSection}>
                <Text
                  style={[
                    styles.label,
                    isNameFocused && styles.labelFocused,
                  ]}
                >
                  이름 (선택)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isNameFocused && styles.inputFocused,
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="미입력 시 자동 생성"
                  placeholderTextColor={GRAY.MEDIUM_100}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>

              <View style={styles.inputSection}>
                <Text
                  style={[
                    styles.label,
                    isActivityNameFocused && styles.labelFocused,
                  ]}
                >
                  활동 아이디
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      { flex: 1 },
                      isActivityNameFocused && styles.inputFocused,
                    ]}
                    value={activityName}
                    onChangeText={(text) => {
                      setActivityName(text);
                      setIsActivityNameDuplicate(null);
                      setActivityNameMessage("");
                      setIsActivityNameVerified(false);
                    }}
                    placeholder="아이디를 입력하세요."
                    placeholderTextColor={GRAY.MEDIUM_100}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setIsActivityNameFocused(true)}
                    onBlur={() => setIsActivityNameFocused(false)}
                  />
                  <Pressable
                    style={{
                      marginLeft: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: GRAY.MEDIUM,
                      backgroundColor: GRAY.DEFAULT_1,
                    }}
                    onPress={handleCheckActivityId}
                    disabled={isCheckingActivityName}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: GRAY.DARK_100,
                      }}
                    >
                      {isCheckingActivityName ? "확인 중..." : "중복 확인"}
                    </Text>
                  </Pressable>
                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    minHeight: 16,
                    color: !activityNameMessage
                      ? GRAY.DEFAULT_1
                      : isActivityNameDuplicate === true
                        ? "#F44336"
                        : isActivityNameDuplicate === false
                          ? "#4CAF50"
                          : GRAY.DARK_2,
                  }}
                >
                  {activityNameMessage || " "}
                </Text>
              </View>

              <View style={styles.agreementSection}>
                <Pressable style={styles.agreementRow} onPress={handleAgreeAll}>
                  <View
                    style={[
                      styles.agreementRadioBox,
                      agreeAll && styles.agreementRadioBoxChecked,
                    ]}
                  >
                    {agreeAll ? (
                      <View style={styles.agreementCheckmark} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.agreementTitle,
                      !agreeAll && styles.agreementItemUnchecked,
                    ]}
                  >
                    모두 동의합니다.
                  </Text>
                </Pressable>
                <Text style={styles.agreementDesc}>
                  회원 가입 및 회원 관리 등의 목적으로 이메일, 휴대폰 번호 등의
                  정보를 수집 및 이용하고 있습니다.
                </Text>

                <Pressable
                  style={styles.agreementRow}
                  onPress={() => setAgeChecked(!ageChecked)}
                >
                  <View
                    style={[
                      styles.agreementRadioBox,
                      ageChecked && styles.agreementRadioBoxChecked,
                    ]}
                  >
                    {ageChecked ? (
                      <View style={styles.agreementCheckmark} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.agreementItem,
                      !ageChecked && styles.agreementItemUnchecked,
                    ]}
                  >
                    14세 이상입니다.
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.agreementRow}
                  onPress={() => setTermsChecked(!termsChecked)}
                >
                  <View
                    style={[
                      styles.agreementRadioBox,
                      termsChecked && styles.agreementRadioBoxChecked,
                    ]}
                  >
                    {termsChecked ? (
                      <View style={styles.agreementCheckmark} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.agreementItem,
                      !termsChecked && styles.agreementItemUnchecked,
                    ]}
                  >
                    서비스 이용약관에 동의합니다.
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.agreementRow}
                  onPress={() => setPrivacyChecked(!privacyChecked)}
                >
                  <View
                    style={[
                      styles.agreementRadioBox,
                      privacyChecked && styles.agreementRadioBoxChecked,
                    ]}
                  >
                    {privacyChecked ? (
                      <View style={styles.agreementCheckmark} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.agreementItem,
                      !privacyChecked && styles.agreementItemUnchecked,
                    ]}
                  >
                    개인정보 수집 및 이용에 동의합니다.
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.agreementRow}
                  onPress={() => setMarketingChecked(!marketingChecked)}
                >
                  <View
                    style={[
                      styles.agreementRadioBox,
                      marketingChecked && styles.agreementRadioBoxChecked,
                    ]}
                  >
                    {marketingChecked ? (
                      <View style={styles.agreementCheckmark} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.agreementItem,
                      !marketingChecked && styles.agreementItemUnchecked,
                    ]}
                  >
                    마케팅(홍보) 목적의 개인정보 수집 및 이용에 동의합니다.
                    (선택)
                  </Text>
                </Pressable>
              </View>
            </ScrollView>

            <View
              style={[styles.buttonContainer, { paddingBottom: 0 }]}
            >
              <Pressable
                style={[
                  styles.completeButton,
                  !allRequiredChecked && styles.completeButtonDisabled,
                ]}
                onPress={handleComplete}
                disabled={!allRequiredChecked}
              >
                <Text
                  style={[
                    styles.completeButtonText,
                    !allRequiredChecked && styles.completeButtonTextDisabled,
                  ]}
                >
                  가입완료
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default SignupFlowScreen;
