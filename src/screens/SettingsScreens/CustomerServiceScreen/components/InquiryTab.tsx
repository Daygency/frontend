import React, { useEffect, useState } from "react";
import { ScrollView, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootRoutes } from "../../../../navigations/routes";
import ShadowCardList, {
  ShadowCardListFaqItem,
} from "../../../../components/lists/ShadowCardList";
import EmptyState from "../../../../components/ui/EmptyState";
import { getFaqs, type FaqItem } from "../../../../lib/apis/faq/faqApi";
import styles from "../styles";

const InquiryTab = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { bottom } = useSafeAreaInsets();
  const [faqList, setFaqList] = useState<FaqItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getFaqs();
      setFaqList(res ?? []);
    })();
  }, []);

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
        {faqList.length > 0 ? (
          <ShadowCardList>
            {faqList.map((faq, idx) => (
              <ShadowCardListFaqItem
                key={faq.faqId}
                question={faq.question}
                answer={faq.answer}
                isLast={idx === faqList.length - 1}
              />
            ))}
          </ShadowCardList>
        ) : (
          <EmptyState message="등록된 FAQ가 없습니다." />
        )}
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
