import React from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import styles from "../styles";

type Props = {
  nickname: string;
  setNickname: (v: string) => void;
  activityId: string;
  setActivityId: (v: string) => void;
  aboutMe: string;
  setAboutMe: (v: string) => void;
};

const TopIntroductionTab = ({
  nickname,
  setNickname,
  activityId,
  setActivityId,
  aboutMe,
  setAboutMe,
}: Props) => (
  <ScrollView
    style={styles.tabContent}
    contentContainerStyle={styles.tabContentContainer}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.field}>
      <Text style={styles.label}>이름 *</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="이름을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>활동 아이디 *</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={activityId}
          onChangeText={setActivityId}
          placeholder="활동 아이디를 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
          autoCapitalize="none"
        />
        <MaterialCommunityIcons
          name="check-circle"
          size={24}
          color={activityId ? "#4CAF50" : GRAY.DARK_2}
          style={styles.checkIcon}
        />
      </View>
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>전공/세부전공</Text>
      <Pressable style={[styles.input, styles.selectInput]}>
        <Text style={styles.placeholder}>전공을 선택하세요</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={GRAY.DARK_2}
        />
      </Pressable>
      <TextInput
        style={styles.input}
        value=""
        placeholder="세부 전공을 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
      />
    </View>
    <View style={styles.field}>
      <Text style={styles.label}>한 줄 소개</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={aboutMe}
        onChangeText={setAboutMe}
        placeholder="한 줄 소개를 입력하세요"
        placeholderTextColor={GRAY.DARK_2}
        multiline
        numberOfLines={3}
      />
    </View>
  </ScrollView>
);

export default TopIntroductionTab;
