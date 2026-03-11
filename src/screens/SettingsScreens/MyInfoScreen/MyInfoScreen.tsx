import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ShadowCardList, { ShadowCardListItem } from "../../../components/ShadowCardList/ShadowCardList";
import styles from "./styles";
import { RootRoutes } from "../../../navigations/routes";

const ORIGINAL_NAME = "김연주";

const MyInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        <ShadowCardListItem
          label="이름"
          value={ORIGINAL_NAME}
          onPress={() =>
            navigation.navigate(RootRoutes.CHANGE_NAME, {
              originalName: ORIGINAL_NAME,
            })
          }
        />
        <ShadowCardListItem label="연락처" value="010-1234-5678" />
        <ShadowCardListItem label="이메일" value="dami**@naver.com" isLast />
      </ShadowCardList>
    </ScrollView>
  );
};

export default MyInfoScreen;
