import React from "react";
import { Keyboard, View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import { isDupActivityName } from "../../../lib/apis/portfolio/IsDupActivityName";
import styles from "../styles";
import { MAJOR_OPTIONS } from "../../../constants/majors";
import OneLineTextInput from "../../../components/OneLineTextInput/OneLineTextInput";

type Props = {
  nickname: string;
  setNickname: (v: string) => void;
  activityName: string;
  setActivityName: (v: string) => void;
  originalActivityName: string;
  aboutMe: string;
  setAboutMe: (v: string) => void;
  majorId: number | null;
  setMajorId: (id: number | null) => void;
  major: string;
  setMajor: (v: string) => void;
  majorDetail: string;
  setMajorDetail: (v: string) => void;
};

const TopIntroductionTab = ({
  nickname,
  setNickname,
  activityName,
  setActivityName,
  originalActivityName,
  aboutMe,
  setAboutMe,
  majorId,
  setMajorId,
  major,
  setMajor,
  majorDetail,
  setMajorDetail,
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

  const [isMajorListOpen, setIsMajorListOpen] = React.useState(false);
  const [selectedMajorId, setSelectedMajorId] = React.useState<number | null>(
    majorId ?? null,
  );
  const [customMajor, setCustomMajor] = React.useState<string>(
    major &&
      !MAJOR_OPTIONS.some((option) => option.label === major)
      ? major
      : "",
  );

  const [isCustomMajorFocused, setIsCustomMajorFocused] = React.useState(false);
  const [isDetailMajorFocused, setIsDetailMajorFocused] = React.useState(false);

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

  const selectedMajorOption =
    selectedMajorId == null
      ? undefined
      : MAJOR_OPTIONS.find((option) => option.id === selectedMajorId);

  const handleSelectMajor = (
    option: (typeof MAJOR_OPTIONS)[number],
  ) => {
    setSelectedMajorId(option.id);
    setMajorId(option.id);
    setMajor(option.label === "기타" ? "" : option.label);
    if (option.label !== "기타") {
      setCustomMajor("");
    }
    setIsMajorListOpen(false);
  };

  return (
    <View style={[styles.tabContent, styles.tabContentContainer]}>
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
        <Pressable
          style={[styles.input, styles.selectInput]}
          onPress={() => setIsMajorListOpen((prev) => !prev)}
        >
          <Text style={styles.placeholder}>
            {selectedMajorOption && selectedMajorOption.label !== "기타"
              ? selectedMajorOption.label
              : selectedMajorOption?.label === "기타" && customMajor.trim()
                ? customMajor.trim()
                : "전공을 선택하세요"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={GRAY.DARK_2}
          />
        </Pressable>
        {isMajorListOpen && (
          <View
            style={{
              marginTop: 6,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: GRAY.DEFAULT_1,
              backgroundColor: "white",
              maxHeight: 3 * 44, // 3개만 보이도록
              overflow: "hidden",
            }}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {MAJOR_OPTIONS.map((option, index) => (
                <Pressable
                  key={option.id}
                  onPress={() => handleSelectMajor(option)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomWidth:
                      index === MAJOR_OPTIONS.length - 1 ? 0 : 1,
                    borderBottomColor: GRAY.DEFAULT_1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        selectedMajorId === option.id
                          ? GRAY.DARK_100
                          : GRAY.DARK_2,
                    }}
                  >
                    {option.label}
                  </Text>
                  {selectedMajorId === option.id && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color={GRAY.DARK_100}
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
        {selectedMajorOption?.label === "기타" && (
          <TextInput
            style={[
              styles.input,
              styles.singleLineInput,
              { marginTop: 8 },
              isCustomMajorFocused && styles.inputFocused,
            ]}
            value={customMajor}
            onChangeText={(text) => {
              setCustomMajor(text);
              setMajor(text);
            }}
            placeholder="전공을 직접 입력하세요"
            placeholderTextColor={GRAY.DARK_2}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
            onFocus={() => setIsCustomMajorFocused(true)}
            onBlur={() => setIsCustomMajorFocused(false)}
          />
        )}
        <TextInput
          style={[
            styles.input,
            styles.singleLineInput,
            selectedMajorOption?.label === "기타" && { marginTop: 16 },
            isDetailMajorFocused && styles.inputFocused,
          ]}
          value={majorDetail}
          onChangeText={setMajorDetail}
          placeholder="세부 전공을 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => setIsDetailMajorFocused(true)}
          onBlur={() => setIsDetailMajorFocused(false)}
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
    </View>
  );
};

export default TopIntroductionTab;
