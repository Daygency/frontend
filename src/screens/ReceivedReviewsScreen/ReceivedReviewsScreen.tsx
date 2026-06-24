import { useCallback, useLayoutEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ReceivedReviewsList from "../../components/portfolio/ReceivedReviewsList";
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

  const openHiddenList = useCallback(() => {
    navigation.navigate(RootRoutes.RECEIVED_REVIEWS, { hiddenOnly: true });
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        hiddenOnly ? (
          <Text style={styles.headerTitle}>숨겨진 후기</Text>
        ) : (
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>받은 후기</Text>
            {isOwnProfile ? (
              <Pressable onPress={openHiddenList} hitSlop={8}>
                <Text style={styles.headerInlineButton}>숨겨진 후기</Text>
              </Pressable>
            ) : null}
          </View>
        ),
      headerRight: undefined,
    });
  }, [navigation, hiddenOnly, isOwnProfile, openHiddenList]);

  return (
    <View style={styles.container}>
      <ReceivedReviewsList
        userId={userId || undefined}
        hiddenOnly={hiddenOnly}
        cardWrapperStyle={styles.cardWrapper}
        listContentStyle={styles.listContent}
      />
    </View>
  );
};

export default ReceivedReviewsScreen;
