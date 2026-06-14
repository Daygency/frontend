import type { ReactNode } from "react";
import { View, ScrollView, Text } from "react-native";
import Profile from "../Profile/Profile";
import ProfileDetail from "../ProfileDetail/ProfileDetail";
import Photo from "../Photo/Photo";
import Activity from "../Activity/Activity";
import portfolioStyles from "../../styles";

type Props = {
  header: ReactNode;
};

const PortfolioScrollTabsLayout = ({ header }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      {header}
      <ScrollView
        style={portfolioStyles.scroll}
        contentContainerStyle={portfolioStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Profile />
        <ProfileDetail embedded />
        <View style={portfolioStyles.contentSheet}>
          <Text style={portfolioStyles.sectionGroupTitle}>사진</Text>
          <Photo embedded />
        </View>
        <View style={portfolioStyles.contentSheet}>
          <Text style={portfolioStyles.sectionGroupTitle}>활동</Text>
          <Activity embedded />
        </View>
      </ScrollView>
    </View>
  );
};

export default PortfolioScrollTabsLayout;
