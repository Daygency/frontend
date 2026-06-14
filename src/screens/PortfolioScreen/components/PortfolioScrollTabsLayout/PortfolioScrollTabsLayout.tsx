import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Profile from "../Profile/Profile";
import ProfileDetail from "../ProfileDetail/ProfileDetail";
import Photo, {
  PHOTO_PREVIEW_LIMIT,
  PORTFOLIO_PHOTOS,
} from "../Photo/Photo";
import Activity from "../Activity/Activity";
import PortfolioInlineTabBar, {
  type PortfolioTabRoute,
} from "../../../../components/PortfolioInlineTabBar/PortfolioInlineTabBar";
import Section from "../../../../components/Section/Section";
import portfolioStyles from "../../styles";

const ROUTES: PortfolioTabRoute[] = [
  { key: "profile", title: "프로필" },
  { key: "photo", title: "사진" },
  { key: "activity", title: "활동" },
];

const PHOTO_TAB_INDEX = 1;
const MIN_TAB_PAGE_HEIGHT = 320;

type Props = {
  header: ReactNode;
};

/**
 * 세로 ScrollView 안에 가로 ScrollView를 두고 height를 숫자로 고정하면,
 * 부모가 먼저 자식을 잘라 레이아웃이 꼬이는 경우가 많음.
 * height는 두지 않고 minHeight만 주면, 가로축 높이는 자식 콘텐츠에 맞춰진다.
 */
const PortfolioScrollTabsLayout = ({ header }: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);
  const horizontalScrollRef = useRef<ScrollView>(null);

  const hasMorePhotos = PORTFOLIO_PHOTOS.length > PHOTO_PREVIEW_LIMIT;

  const goToTab = useCallback(
    (i: number) => {
      setTabIndex(i);
      horizontalScrollRef.current?.scrollTo({
        x: i * windowWidth,
        animated: true,
      });
    },
    [windowWidth],
  );

  const onHorizontalScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / windowWidth);
      if (i >= 0 && i < ROUTES.length) {
        setTabIndex(i);
      }
    },
    [windowWidth],
  );

  return (
    <View style={{ flex: 1 }}>
      {header}
      <ScrollView
        style={portfolioStyles.scroll}
        contentContainerStyle={portfolioStyles.scrollContent}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Profile />
        <PortfolioInlineTabBar
          routes={ROUTES}
          index={tabIndex}
          onIndexChange={goToTab}
        />
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{
            width: windowWidth,
            minHeight: MIN_TAB_PAGE_HEIGHT,
            alignSelf: "flex-start",
          }}
          onMomentumScrollEnd={onHorizontalScrollEnd}
        >
          <View style={{ width: windowWidth }}>
            <ProfileDetail embedded />
            {PORTFOLIO_PHOTOS.length > 0 ? (
              <View style={portfolioStyles.contentSheet}>
                <Section
                  title="사진"
                  onPressMore={
                    hasMorePhotos ? () => goToTab(PHOTO_TAB_INDEX) : undefined
                  }
                  styles={{
                    header: { paddingHorizontal: 0 },
                    content: { paddingHorizontal: 0 },
                  }}
                >
                  <Photo embedded limit={PHOTO_PREVIEW_LIMIT} />
                </Section>
              </View>
            ) : null}
          </View>
          <View style={{ width: windowWidth }}>
            <View style={portfolioStyles.contentSheet}>
              <Photo embedded />
            </View>
          </View>
          <View style={{ width: windowWidth }}>
            <Activity embedded />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default PortfolioScrollTabsLayout;
