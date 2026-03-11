import React from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import { isDupActivityName } from "../../../lib/apis/portfolio/IsDupActivityName";
import styles from "../styles";
import OneLineTextInput from "../../../components/OneLineTextInput/OneLineTextInput";

type Props = {
  nickname: string;
  setNickname: (v: string) => void;
  activityName: string;
  setActivityName: (v: string) => void;
  originalActivityName: string;
  aboutMe: string;
  setAboutMe: (v: string) => void;
};

const TopIntroductionTab = ({
  nickname,
  setNickname,
  activityName,
  setActivityName,
  originalActivityName,
  aboutMe,
  setAboutMe,
}: Props) => {
  const [isNameFocused, setIsNameFocused] = React.useState(false);
  const [isActivityNameFocused, setIsActivityNameFocused] =
    React.useState(false);
  const [isIntroFocused, setIsIntroFocused] = React.useState(false);

  const [isCheckingActivityName, setIsCheckingActivityName] =
    React.useState(false);
  const [isActivityNameDuplicate, setIsActivityNameDuplicate] = React.useState<
    boolean | null
  >(null);
  const [activityNameMessage, setActivityNameMessage] =
    React.useState<string>("");

  const handleCheckActivityId = async () => {
    const value = activityName.trim();
    if (!value) {
      setIsActivityNameDuplicate(null);
      setActivityNameMessage("");
      return;
    }

    try {
      setIsCheckingActivityName(true);
      const isDup = await isDupActivityName(value);
      setIsActivityNameDuplicate(isDup);
      if (isDup) {
        setActivityNameMessage("이미 사용 중인 활동 아이디입니다.");
      } else {
        setActivityNameMessage("사용 가능한 활동 아이디입니다.");
      }
    } catch {
      setIsActivityNameDuplicate(null);
      setActivityNameMessage("활동 아이디 중복 확인에 실패했습니다.");
    } finally {
      setIsCheckingActivityName(false);
    }
  };

  const getActivityIconColor = () => {
    if (!activityName) return GRAY.DARK_2;
    if (isCheckingActivityName) return GRAY.DARK_2;
    if (isActivityNameDuplicate === true) return "#F44336";
    if (isActivityNameDuplicate === false) return "#4CAF50";
    return GRAY.DARK_2;
  };

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.field}>
        <Text style={[styles.label, isNameFocused && styles.labelFocused]}>
          닉네임 *
        </Text>
        <OneLineTextInput
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChangeText={setNickname}
          placeholderTextColor={GRAY.DARK_2}
          onFocus={() => setIsNameFocused(true)}
          onBlur={() => setIsNameFocused(false)}
          style={isNameFocused && styles.inputFocused}
        />
      </View>
      <View style={styles.field}>
        <Text
          style={[styles.label, isActivityNameFocused && styles.labelFocused]}
        >
          활동 아이디 *
        </Text>
        <View style={styles.inputRow}>
          <OneLineTextInput
            placeholder="활동 아이디를 입력하세요"
            value={activityName}
            onChangeText={(text) => {
              setActivityName(text);
              setIsActivityNameDuplicate(null);
              setActivityNameMessage("");
            }}
            placeholderTextColor={GRAY.DARK_2}
            autoCapitalize="none"
            onFocus={() => setIsActivityNameFocused(true)}
            onBlur={() => {
              setIsActivityNameFocused(false);
            }}
            style={[{ flex: 1 }, isActivityNameFocused && styles.inputFocused]}
          />
          <Pressable
            style={{
              marginLeft: 8,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: GRAY.MEDIUM,
              backgroundColor: GRAY.DEFAULT_1,
            }}
            onPress={handleCheckActivityId}
            disabled={
              isCheckingActivityName ||
              !activityName.trim() ||
              activityName.trim() === originalActivityName.trim()
            }
          >
            <Text
              style={{
                fontSize: 12,
                color: GRAY.DARK_100,
              }}
            >
              {isCheckingActivityName ? "확인 중..." : "중복 확인"}
            </Text>
          </Pressable>
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={getActivityIconColor()}
            style={styles.checkIcon}
          />
        </View>
        <Text
          style={{
            marginTop: 4,
            fontSize: 12,
            minHeight: 16,
            color: !activityNameMessage
              ? GRAY.DEFAULT_1
              : isActivityNameDuplicate === true
                ? "#F44336"
                : isActivityNameDuplicate === false
                  ? "#4CAF50"
                  : GRAY.DARK_2,
          }}
        >
          {activityNameMessage || " "}
        </Text>
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
          style={[styles.input, styles.singleLineInput]}
          value=""
          placeholder="세부 전공을 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
        />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, isIntroFocused && styles.labelFocused]}>
          한 줄 소개
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            isIntroFocused && styles.inputFocused,
          ]}
          value={aboutMe}
          onChangeText={setAboutMe}
          placeholder="한 줄 소개를 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
          multiline
          numberOfLines={3}
          onFocus={() => setIsIntroFocused(true)}
          onBlur={() => setIsIntroFocused(false)}
        />
      </View>
    </ScrollView>
  );
};

export default TopIntroductionTab;
