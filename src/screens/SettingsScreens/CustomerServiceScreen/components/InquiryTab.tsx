import React from "react";
import { ScrollView, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootRoutes } from "../../../../navigations/routes";
import ShadowCardList, {
  ShadowCardListFaqItem,
} from "../../../../components/lists/ShadowCardList";
import styles from "../styles";

const FAQ_LIST = [
  {
    question: "회원가입은 어떻게 하나요?",
    answer:
      "앱 하단의 '회원가입' 버튼을 눌러 이메일 또는 소셜 계정으로 간편하게 가입할 수 있습니다.",
  },
  {
    question: "비밀번호를 잊어버렸어요",
    answer:
      "로그인 화면에서 '비밀번호 찾기'를 선택하시면 등록된 이메일로 재설정 링크를 보내드립니다.",
  },
  {
    question: "프로필 사진은 어떻게 변경하나요?",
    answer: "프로필 화면에서 프로필 이미지를 탭하여 사진을 변경할 수 있습니다.",
  },
  {
    question: "알림을 받고 싶지 않아요",
    answer: "설정 > 알림 설정에서 푸시 알림과 이메일 알림을 각각 끌 수 있습니다.",
  },
];

const InquiryTab = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { bottom } = useSafeAreaInsets();

  const handleInquiry = () => {
    navigation.navigate(RootRoutes.INQUIRY);
  };

  return (
    <View style={styles.tabContent}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: (bottom || 0) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ */}
        <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>FAQ</Text>
        <ShadowCardList>
          {FAQ_LIST.map((faq, idx) => (
            <ShadowCardListFaqItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isLast={idx === FAQ_LIST.length - 1}
            />
          ))}
        </ShadowCardList>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: (bottom || 0) + 12 }]}>
        <Pressable style={styles.inquiryButton} onPress={handleInquiry}>
          <Text style={styles.inquiryButtonText}>문의하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default InquiryTab;
