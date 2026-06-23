import React, { isValidElement, cloneElement, useRef, useCallback } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  Animated,
  View,
  StyleSheet,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Profile from "../Profile/Profile";
import { PROFILE_BANNER_RATIO } from "../Profile/styles";
import ProfileDetail from "../ProfileDetail/ProfileDetail";
import Photo, {
  PHOTO_PREVIEW_LIMIT,
  PORTFOLIO_PHOTOS,
} from "../Photo/Photo";
import Activity from "../Activity/Activity";
import Section from "../../../../components/ui/Section";
import portfolioStyles from "../../styles";
import { RootRoutes } from "../../../../navigations/routes";
import { MAIN_HOME_TOP_BAR_HEIGHT } from "../../../../components/layout/MainHomeTopBar/styles";

type Props = {
  header: ReactNode;
  immersiveCover?: boolean;
};

const HEADER_FADE_RANGE = 60;

const PortfolioScrollTabsLayout = ({ header, immersiveCover = false }: Props) => {
  const { top } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const hasPhotos = PORTFOLIO_PHOTOS.length > 0;
  const hasMorePhotos = PORTFOLIO_PHOTOS.length > PHOTO_PREVIEW_LIMIT;
  const coverExtendTop = immersiveCover ? top + MAIN_HOME_TOP_BAR_HEIGHT : 0;
  const bannerVisibleHeight = Math.round(windowHeight * PROFILE_BANNER_RATIO);
  const fadeStart = coverExtendTop + bannerVisibleHeight * 0.1;
  const fadeEnd = fadeStart + HEADER_FADE_RANGE;

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const clampScrollTop = useCallback(
    (y: number) => {
      if (!immersiveCover || y >= 0) return;
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    },
    [immersiveCover],
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        clampScrollTop(event.nativeEvent.contentOffset.y);
      },
    },
  );

  const immersiveHeader =
    immersiveCover && isValidElement(header)
      ? cloneElement(header as ReactElement<PortfolioHeaderScrollProps>, {
          scrollY,
          fadeStart,
          fadeEnd,
        })
      : header;

  return (
    <View
      style={[
        layoutStyles.root,
        immersiveCover && layoutStyles.rootImmersive,
      ]}
    >
      {!immersiveCover ? header : null}
      <Animated.ScrollView
        ref={scrollRef}
        style={[
          portfolioStyles.scroll,
          immersiveCover && layoutStyles.scrollImmersive,
        ]}
        contentContainerStyle={portfolioStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        scrollEventThrottle={16}
        bounces={!immersiveCover}
        alwaysBounceVertical={!immersiveCover}
        overScrollMode={immersiveCover ? "never" : "auto"}
        onScroll={onScroll}
        onScrollEndDrag={(event) => {
          clampScrollTop(event.nativeEvent.contentOffset.y);
        }}
        onMomentumScrollEnd={(event) => {
          clampScrollTop(event.nativeEvent.contentOffset.y);
        }}
      >
        <Profile coverExtendTop={coverExtendTop} />
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
      </Animated.ScrollView>
      {immersiveCover ? (
        <View style={layoutStyles.headerOverlay} pointerEvents="box-none">
          {immersiveHeader}
        </View>
      ) : null}
    </View>
  );
};

type PortfolioHeaderScrollProps = {
  scrollY?: Animated.Value;
  fadeStart?: number;
  fadeEnd?: number;
};

const layoutStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootImmersive: {
    backgroundColor: "#C8D8E8",
  },
  scrollImmersive: {
    backgroundColor: "#C8D8E8",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default PortfolioScrollTabsLayout;
