import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { MAIN, GRAY, WHITE } from "../../../color";
import { isDupActivityName } from "../../../lib/apis/portfolio/IsDupActivityId";
import { styles } from "./styles";

type SignupRouteParams = {
  role: "artist" | "planner";
};

const SignupScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const route = useRoute();
  const role = (route.params as SignupRouteParams | undefined)?.role ?? "artist";
  const { completeSignup, user } = useAuth();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [activityName, setActivityName] = useState("");
  const [isNicknameFocused, setIsNicknameFocused] = useState(false);
  const [isActivityNameFocused, setIsActivityNameFocused] = useState(false);
  const [isCheckingActivityName, setIsCheckingActivityName] = useState(false);
  const [isActivityNameDuplicate, setIsActivityNameDuplicate] =
    useState<boolean | null>(null);
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
    nickname.trim().length > 0 &&
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
        setIsActivityNameVerified(false);
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
        role,
        nickname: nickname.trim() || undefined,
        activityName: activityName.trim(),
      });
    } catch {
      // 에러는 AuthContext에서 Alert 처리
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading1}>회원가입하고</Text>
        <Text style={styles.heading2}>
          예술 활동을 더 체계적으로 시작해보세요!
        </Text>

        <View style={styles.inputSection}>
          <Text
            style={[styles.label, isNicknameFocused && styles.labelFocused]}
          >
            닉네임
          </Text>
          <TextInput
            style={[
              styles.input,
              isNicknameFocused && styles.inputFocused,
            ]}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            placeholderTextColor={GRAY.MEDIUM_100}
            onFocus={() => setIsNicknameFocused(true)}
            onBlur={() => setIsNicknameFocused(false)}
          />
        </View>

        <View style={styles.inputSection}>
          <Text
            style={[styles.label, isActivityNameFocused && styles.labelFocused]}
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
              color:
                !activityNameMessage
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
            <MaterialCommunityIcons
              name={agreeAll ? "radiobox-marked" : "radiobox-blank"}
              size={22}
              color={agreeAll ? MAIN.DEFAULT : GRAY.DARK_2}
            />
            <Text style={styles.agreementTitle}>모두 동의합니다.</Text>
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
            <Text style={styles.agreementItem}>14세 이상입니다.</Text>
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
            <Text style={styles.agreementItem}>
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
            <Text style={styles.agreementItem}>
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
            <Text style={[styles.agreementItem, styles.agreementOptional]}>
              마케팅(홍보) 목적의 개인정보 수집 및 이용에 동의합니다. (선택)
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
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
  );
};

export default SignupScreen;
