import type { ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Profile from "../Profile/Profile";
import ProfileDetail from "../ProfileDetail/ProfileDetail";
import Photo, {
  PHOTO_PREVIEW_LIMIT,
  PORTFOLIO_PHOTOS,
} from "../Photo/Photo";
import Activity from "../Activity/Activity";
import Section from "../../../../components/ui/Section";
import portfolioStyles from "../../styles";
import { RootRoutes } from "../../../../navigations/routes";

type Props = {
  header: ReactNode;
};

const PortfolioScrollTabsLayout = ({ header }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const hasPhotos = PORTFOLIO_PHOTOS.length > 0;
  const hasMorePhotos = PORTFOLIO_PHOTOS.length > PHOTO_PREVIEW_LIMIT;

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
        {hasPhotos ? (
          <View style={portfolioStyles.contentSheet}>
            <Section
              title="사진"
              onPressMore={
                hasMorePhotos
                  ? () => navigation.navigate(RootRoutes.PORTFOLIO_PHOTO_GALLERY)
                  : undefined
              }
              styles={portfolioStyles.sectionStyles}
            >
              <Photo embedded limit={PHOTO_PREVIEW_LIMIT} />
            </Section>
          </View>
        ) : null}
        <View style={portfolioStyles.contentSheet}>
          <Activity embedded userId={viewingUserId || undefined} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PortfolioScrollTabsLayout;
