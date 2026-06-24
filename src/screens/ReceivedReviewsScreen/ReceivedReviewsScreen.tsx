import { useCallback, useLayoutEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ReceivedReviewsList from "../../components/portfolio/ReceivedReviewsList";
import { GRAY } from "../../color";
import { hasHiddenReceivedActivityReviews } from "../../lib/apis/announcement/activityReviewApi";
import { RootRoutes } from "../../navigations/routes";
import styles from "./styles";

type RouteParams = {
  userId?: string;
  hiddenOnly?: boolean;
};

const ReceivedReviewsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const params = (route.params as RouteParams | undefined) ?? {};
  const userId = params.userId?.trim();
  const hiddenOnly = Boolean(params.hiddenOnly);
  const isOwnProfile = !userId;
  const [hasHiddenReviews, setHasHiddenReviews] = useState(false);

  const refreshHiddenAvailability = useCallback(async () => {
    if (!isOwnProfile || hiddenOnly) {
      setHasHiddenReviews(false);
      return;
    }
    const hasHidden = await hasHiddenReceivedActivityReviews();
    setHasHiddenReviews(hasHidden);
  }, [isOwnProfile, hiddenOnly]);

  useFocusEffect(
    useCallback(() => {
      void refreshHiddenAvailability();
      return () => {};
    }, [refreshHiddenAvailability]),
  );

  const openHiddenList = useCallback(() => {
    navigation.navigate(RootRoutes.RECEIVED_REVIEWS, { hiddenOnly: true });
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: hiddenOnly ? "숨겨진 후기" : "받은 후기",
      headerRight:
        isOwnProfile && !hiddenOnly && hasHiddenReviews
          ? () => (
              <Pressable onPress={openHiddenList} hitSlop={8} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>숨겨진 후기</Text>
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, hiddenOnly, isOwnProfile, hasHiddenReviews, openHiddenList]);

  return (
    <View style={styles.container}>
      <ReceivedReviewsList
        userId={userId || undefined}
        hiddenOnly={hiddenOnly}
        onHasHiddenReviewsChange={setHasHiddenReviews}
        cardWrapperStyle={styles.cardWrapper}
        listContentStyle={styles.listContent}
      />
    </View>
  );
};

export default ReceivedReviewsScreen;
