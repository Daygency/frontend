import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { MAIN, GRAY, WHITE } from "../../color";
import { styles } from "./styles";

type SignupRouteParams = {
  role: "artist" | "planner";
};

const SignupScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const route = useRoute();
  const role = (route.params as SignupRouteParams | undefined)?.role ?? "artist";
  const { completeSignup } = useAuth();

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
    // TODO: API 호출 - activityId, agreements, role 전송
    completeSignup(role);
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
