import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootRoutes } from "../../../../navigations/routes";
import ShadowCardList, {
  ShadowCardListFaqItem,
} from "../../../../components/lists/ShadowCardList";
import EmptyState from "../../../../components/ui/EmptyState";
import { getFaqs, type FaqItem } from "../../../../lib/apis/faq/faqApi";
import { MAIN } from "../../../../color";
import styles from "../styles";

const PAGE_LIMIT = 8;

const InquiryTab = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { bottom } = useSafeAreaInsets();
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getFaqs({ limit: PAGE_LIMIT });
      setFaqList(res?.items ?? []);
      setNextCursor(res?.nextCursor ?? null);
      setHasMore(res?.hasMore ?? false);
    })();
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    const res = await getFaqs({ cursor: nextCursor, limit: PAGE_LIMIT });
    setFaqList((prev) => [...prev, ...(res?.items ?? [])]);
    setNextCursor(res?.nextCursor ?? null);
    setHasMore(res?.hasMore ?? false);
    setLoadingMore(false);
  }, [hasMore, nextCursor, loadingMore]);

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
          <>
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
            {hasMore ? (
              <Pressable
                onPress={() => void loadMore()}
                disabled={loadingMore}
                style={styles.loadMoreButton}
              >
                {loadingMore ? (
                  <ActivityIndicator color={MAIN.DEFAULT} />
                ) : (
                  <Text style={styles.loadMoreButtonText}>FAQ 더보기</Text>
                )}
              </Pressable>
            ) : null}
          </>
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
