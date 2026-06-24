import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles";
import { portfolioSectionStyles } from "../styles";
import Section from "../../ui/Section";
import ReceivedReviewsList, {
  RECEIVED_REVIEW_PREVIEW_LIMIT,
} from "../ReceivedReviewsList";
import { RootRoutes } from "../../../navigations/routes";

type ActivityProps = {
  embedded?: boolean;
  /** 타인 포트폴리오 — 해당 유저가 받은 후기 */
  userId?: string;
};

const Activity = ({ embedded = false, userId }: ActivityProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [showMore, setShowMore] = useState(false);
  const isOwnProfile = !userId?.trim();

  const openFullList = useCallback(() => {
    const trimmed = userId?.trim();
    navigation.navigate(RootRoutes.RECEIVED_REVIEWS, {
      ...(trimmed ? { userId: trimmed } : {}),
    });
  }, [navigation, userId]);

  const openHiddenList = useCallback(() => {
    navigation.navigate(RootRoutes.RECEIVED_REVIEWS, { hiddenOnly: true });
  }, [navigation]);

  const inner = (
    <View style={embedded ? styles.embeddedContainer : styles.container}>
      <Section
        title="받은 후기"
        onPressMore={showMore ? openFullList : undefined}
        headerInline={
          isOwnProfile ? (
            <Pressable onPress={openHiddenList} hitSlop={8}>
              <Text style={styles.hiddenReviewsButton}>숨겨진 후기</Text>
            </Pressable>
          ) : undefined
        }
        styles={embedded ? portfolioSectionStyles : undefined}
      >
        <ReceivedReviewsList
          userId={userId}
          previewLimit={RECEIVED_REVIEW_PREVIEW_LIMIT}
          onShowMoreChange={setShowMore}
          cardWrapperStyle={{ marginBottom: 8 }}
        />
      </Section>
    </View>
  );

  if (embedded) {
    return inner;
  }

  return <ScrollView>{inner}</ScrollView>;
};

export default Activity;
