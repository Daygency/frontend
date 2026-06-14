import type { ReactNode } from "react";
import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import Profile from "../Profile/Profile";
import ProfileDetail from "../ProfileDetail/ProfileDetail";
import Photo, {
  PHOTO_PREVIEW_LIMIT,
  PORTFOLIO_PHOTOS,
} from "../Photo/Photo";
import Activity from "../Activity/Activity";
import Section from "../../../../components/Section/Section";
import portfolioStyles from "../../styles";

type Props = {
  header: ReactNode;
};

const PortfolioScrollTabsLayout = ({ header }: Props) => {
  const [photosExpanded, setPhotosExpanded] = useState(false);
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
        <View style={portfolioStyles.contentSheet}>
          <Section
            title="사진"
            onPressMore={
              hasMorePhotos && !photosExpanded
                ? () => setPhotosExpanded(true)
                : undefined
            }
            styles={{
              header: { paddingHorizontal: 0 },
              content: { paddingHorizontal: 0 },
            }}
          >
            <Photo
              embedded
              limit={photosExpanded ? undefined : PHOTO_PREVIEW_LIMIT}
            />
          </Section>
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
