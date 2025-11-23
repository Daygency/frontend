import { Pressable, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AnnouncementBox from "../../components/AnnouncementBox/AnnouncementBox";
import { AnnouncementDetailParams } from "../AnnouncementDetailScreen/AnnouncementDetailScreen";
import { RootRoutes } from "../../navigations/routes";
import ShadowCardButton from "../../components/ShadowCardButton/ShadowCardButton";
import FormInput from "../../components/FormInput/FormInput";
import { BLACK, MAIN, WHITE } from "../../color";

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

  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 12 }}
      >
        {/* <AnnouncementBox
          title={title}
          type={type}
          status={status}
          daysLeft={daysLeft}
        /> */}
        <Text
          style={{
            marginVertical: 16,
            marginHorizontal: 20,
            fontSize: 20,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
        <View>
          <FormInput
            title="이름"
            isRequired={true}
            placeholder="이름을 입력하세요"
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <FormInput title="생년" isRequired={true} placeholder="YYYY" />
        </View>
        <View style={{ marginTop: 15 }}>
          <FormInput
            title="세부전공"
            isRequired={true}
            placeholder="전공을 선택하세요"
            example="ex. 피아노, 첼로, 소프라노, 발레"
          />
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 20,
          backgroundColor: WHITE,
        }}
      >
        <Pressable
          style={{
            backgroundColor: MAIN.DEFAULT,
            borderRadius: 16,
            paddingVertical: 16,
            bottom: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            // 제출하기 로직
          }}
        >
          <Text style={{ color: WHITE, fontSize: 16, fontWeight: "600" }}>
            제출하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ApplicationScreen;

