import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArtistIcon from "../../components/ArtistIcon/ArtistIcon";
import AgencyIcon from "../../components/AgencyIcon/AgencyIcon";
import SignupFlowProgress from "../../components/SignupFlowProgress/SignupFlowProgress";
import { useAuth } from "../../contexts/AuthContext";
import { MAIN, GRAY, WHITE } from "../../color";
import { styles } from "./styles";
import { styles as roleSelectionStyles } from "../RoleSelectionScreen/styles";

export type UserRole = "artist" | "planner";

const ANIMATION_DURATION = 300;

const SignupFlowScreen = () => {
  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { completeSignup } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("artist");
  const slideX = useSharedValue(0);

  // Step 2 state
  const [activityId, setActivityId] = useState("");
  const [agreeAll, setAgreeAll] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  const allRequiredChecked =
    ageChecked && termsChecked && privacyChecked && activityId.trim().length > 0;

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

  const handleComplete = () => {
    if (!allRequiredChecked) return;
    // TODO: API 호출 - activityId, agreements, selectedRole 전송
    completeSignup(selectedRole);
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

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const pageWidth = width;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top, paddingBottom: bottom },
      ]}
    >
      <View style={styles.headerRow}>
        <SignupFlowProgress currentStep={step} />
        {step === 2 && (
          <Pressable
            style={styles.backButton}
            onPress={goToStep1}
            hitSlop={12}
          >
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
            style={[styles.slidePage, { width: pageWidth, minWidth: pageWidth }]}
            collapsable={false}
          >
            <View style={[styles.content, { paddingBottom: bottom + 24 }]}>
              <Text style={roleSelectionStyles.mainQuestion}>
                {"데이전시를,\n어떤 역할로 이용하시겠어요?"}
              </Text>
              <Text style={roleSelectionStyles.subText}>
                {"선택한 역할에 맞춰 프로필 형식이 생성되고,\n두 역할 모두 기능은 동일합니다."}
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
              <View style={[roleSelectionStyles.iconWrap, roleSelectionStyles.artistIconWrap]}>
                <ArtistIcon width={56} height={56} />
              </View>
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
              <View style={[roleSelectionStyles.iconWrap, roleSelectionStyles.plannerIconWrap]}>
                <AgencyIcon width={56} height={56} />
              </View>
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
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.heading1}>회원가입하고</Text>
            <Text style={styles.heading2}>
              예술 활동을 더 체계적으로 시작해보세요!
            </Text>

            <View style={styles.inputSection}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                value="daygency@gmail.com"
                editable={false}
                placeholderTextColor={GRAY.MEDIUM_100}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>활동 아이디</Text>
              <TextInput
                style={styles.input}
                value={activityId}
                onChangeText={setActivityId}
                placeholder="아이디를 입력하세요."
                placeholderTextColor={GRAY.MEDIUM_100}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.agreementSection}>
              <Pressable style={styles.agreementRow} onPress={handleAgreeAll}>
                <MaterialCommunityIcons
                  name={agreeAll ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={agreeAll ? MAIN.DEFAULT : GRAY.DARK_2}
                />
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
                <MaterialCommunityIcons
                  name={ageChecked ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={ageChecked ? MAIN.DEFAULT : GRAY.DARK_2}
                />
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
                <MaterialCommunityIcons
                  name={termsChecked ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={termsChecked ? MAIN.DEFAULT : GRAY.DARK_2}
                />
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
                <MaterialCommunityIcons
                  name={privacyChecked ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={privacyChecked ? MAIN.DEFAULT : GRAY.DARK_2}
                />
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
                <MaterialCommunityIcons
                  name={marketingChecked ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={marketingChecked ? MAIN.DEFAULT : GRAY.DARK_2}
                />
                <Text
                  style={[
                    styles.agreementItem,
                    !marketingChecked && styles.agreementItemUnchecked,
                  ]}
                >
                  마케팅(홍보) 목적의 개인정보 수집 및 이용에 동의합니다. (선택)
                </Text>
              </Pressable>
            </View>
            </ScrollView>

            <View
              style={[styles.buttonContainer, { paddingBottom: bottom + 24 }]}
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
