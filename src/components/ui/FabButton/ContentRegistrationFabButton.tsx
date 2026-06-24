import { StyleProp, ViewStyle } from "react-native";
import FabButton from "./FabButton";
import { useContentRegistrationFabMenu } from "./contentRegistrationFabMenu";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};

/** 모집공고 · 공연 소식 · 커뮤니티 등록 메뉴가 붙은 공통 FAB */
const ContentRegistrationFabButton = ({ containerStyle }: Props) => {
  const menuItems = useContentRegistrationFabMenu();
  return <FabButton containerStyle={containerStyle} menuItems={menuItems} />;
};

export default ContentRegistrationFabButton;
