import React from "react";
import { ScrollView } from "react-native";
import ShadowCardList, { ShadowCardListItem } from "../../components/ShadowCardList/ShadowCardList";
import styles from "./styles";

const MyInfoScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ShadowCardList>
        <ShadowCardListItem
          label="이름"
          value="김연주"
          onPress={() => {}}
          isFirst
        />
        <ShadowCardListItem label="연락처" value="010-1234-5678" />
        <ShadowCardListItem label="이메일" value="dami**@naver.com" isLast />
      </ShadowCardList>
    </ScrollView>
  );
};

export default MyInfoScreen;
