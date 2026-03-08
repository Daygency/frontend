import React from "react";
import { ScrollView, Text, View, Pressable, Linking } from "react-native";
import ShadowCardList, {
  ShadowCardListItem,
  ShadowCardListFaqItem,
} from "../../components/ShadowCardList/ShadowCardList";
import styles from "./styles";

const OPEN_CHAT_URL = "https://open.kakao.com"; // TODO: 실제 오픈채팅 링크로 교체
const INQUIRY_URL = "mailto:support@example.com"; // TODO: 실제 문의 이메일로 교체

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
    answer: "설정 > 내 정보에서 프로필 이미지를 탭하여 사진을 변경할 수 있습니다.",
  },
  {
    question: "알림을 받고 싶지 않아요",
    answer: "설정 > 알림 설정에서 푸시 알림과 이메일 알림을 각각 끌 수 있습니다.",
  },
];

const CustomerServiceScreen = () => {
  const handleOpenChat = () => {
    Linking.openURL(OPEN_CHAT_URL).catch(() => {});
  };

  const handleInquiry = () => {
    Linking.openURL(INQUIRY_URL).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 오픈채팅 링크 */}
      <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>
        오픈채팅 링크
      </Text>
      <ShadowCardList>
        <ShadowCardListItem
          label="오픈채팅"
          value="바로가기"
          onPress={handleOpenChat}
          isLast
        />
      </ShadowCardList>

      {/* 1대1 문의 */}
      <Text style={styles.sectionTitle}>1대1 문의</Text>
      <ShadowCardList>
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 14,
              color: "#888",
              marginBottom: 12,
            }}
          >
            궁금한 점이 있으시면 문의해 주세요.
          </Text>
          <Pressable style={styles.inquiryButton} onPress={handleInquiry}>
            <Text style={styles.inquiryButtonText}>문의하기</Text>
          </Pressable>
        </View>
      </ShadowCardList>

      {/* FAQ */}
      <Text style={styles.sectionTitle}>FAQ</Text>
      <ShadowCardList>
        {FAQ_LIST.map((faq, index) => (
          <ShadowCardListFaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isLast={index === FAQ_LIST.length - 1}
          />
        ))}
      </ShadowCardList>
    </ScrollView>
  );
};

export default CustomerServiceScreen;
