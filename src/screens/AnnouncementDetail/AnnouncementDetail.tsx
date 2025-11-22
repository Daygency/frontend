import { Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AnnouncementDetailParams = {
  title: string;
  type: string;
  status: string;
  daysLeft: number;
};

type MainHomeStackParamList = {
  MainHome: undefined;
  AnnouncementDetail: AnnouncementDetailParams;
};

type AnnouncementDetailRouteProp = RouteProp<MainHomeStackParamList, "AnnouncementDetail">;

const AnnouncementDetail = () => {
  const route = useRoute<AnnouncementDetailRouteProp>();
  const { title, type, status, daysLeft } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>{title}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>유형: {type}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>상태: {status}</Text>
      <Text style={{ fontSize: 16 }}>남은 일수: D-{daysLeft}</Text>
    </View>
  );
};

export default AnnouncementDetail;
