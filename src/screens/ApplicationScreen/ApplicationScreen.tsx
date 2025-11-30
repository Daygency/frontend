import { Pressable, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import AnnouncementBox from "../../components/AnnouncementBox/AnnouncementBox";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import { RootRoutes } from "../../navigations/routes";
import ShadowCardButton from "../../components/ShadowCardButton/ShadowCardButton";
import Form from "../../components/Form/Form";
import FormTextInput from "../../components/FormTextInput/FormTextInput";
import FormDropdownInput from "../../components/FormDropdownInput/FormDropdownInput";
import { BLACK, MAIN, WHITE } from "../../color";
import styles from "./styles";

type RootStackParamList = {
  ContentTab: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
  Application: AnnouncementDetailParams;
};

type ApplicationRouteProp = RouteProp<
  RootStackParamList,
  typeof RootRoutes.APPLICATION
>;

const ApplicationScreen = () => {
  const route = useRoute<ApplicationRouteProp>();
  const { title, type, status, daysLeft } = route.params;
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  const majorOptions = [
    { label: "건반악기", value: "건반악기" },
    { label: "현악", value: "현악" },
    { label: "성악", value: "성악" },
    { label: "작곡", value: "작곡" },
    { label: "무용", value: "무용" },
    { label: "실용", value: "실용" },
  ];

  const gradeOptions = [
    { label: "1학년", value: "1학년" },
    { label: "2학년", value: "2학년" },
    { label: "3학년", value: "3학년" },
    { label: "4학년", value: "4학년" },
    { label: "졸업", value: "졸업" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <AnnouncementBox
          title={title}
          type={type}
          status={status}
          daysLeft={daysLeft}
        />
        <View style={{ paddingHorizontal: 12, paddingVertical: 15, }}>
          <View>
            <Form title="이름" isRequired={true}>
              <FormTextInput placeholder="이름을 입력하세요" />
            </Form>
          </View>
          <View style={{ marginTop: 15 }}>
            <Form title="생년" isRequired={true}>
              <FormTextInput placeholder="YYYY" />
            </Form>
          </View>
          <View style={{ marginTop: 15 }}>
            <Form
              title="전공"
              isRequired={true}
              example="ex. 건반악기, 현악, 성악, 작곡, 무용, 실용"
            >
              <FormDropdownInput
                placeholder="전공을 선택하세요"
                data={majorOptions}
                value={selectedMajor}
                onChange={(item) => setSelectedMajor(item.value)}
              />
            </Form>
          </View>
          <View style={{ marginTop: 15 }}>
            <Form title="학력(소속학교/학년)" isRequired={true}>
              <FormTextInput
                placeholder="소속학교를 입력하세요"
                value={schoolName}
                onChangeText={setSchoolName}
              />
              <FormDropdownInput
                placeholder="학년을 선택하세요"
                data={gradeOptions}
                value={selectedGrade}
                onChange={(item) => setSelectedGrade(item.value)}
              />
            </Form>
          </View>
        </View>
      </ScrollView>
      <View
        style={styles.applyContainer}
      >
        <Pressable
          style={styles.btnApply}
          onPress={() => {
            // 제출하기 로직
          }}
        >
          <Text style={styles.btnApplyText}>제출하기</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ApplicationScreen;

