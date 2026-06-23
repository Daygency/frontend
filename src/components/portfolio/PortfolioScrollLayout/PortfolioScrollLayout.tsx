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
import Photo, { PHOTO_PREVIEW_LIMIT, PORTFOLIO_PHOTOS } from "../Photo/Photo";
import Activity from "../Activity/Activity";
import Section from "../../ui/Section";
import portfolioStyles, { portfolioSectionStyles } from "../styles";
import { PORTFOLIO_IMMERSIVE_BG } from "../../../constants/portfolio";
import { RootRoutes } from "../../../navigations/routes";

type Props = {
  header: ReactNode;
  immersiveCover?: boolean;
};

export type PortfolioHeaderScrollProps = {
  scrollY?: Animated.Value;
  fadeStart?: number;
  fadeEnd?: number;
};

const HEADER_FADE_RANGE = 60;

const PortfolioScrollLayout = ({ header, immersiveCover = false }: Props) => {
  const { top } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const routeParams = (route.params ?? {}) as { userId?: string };
  const viewingUserId = routeParams.userId?.trim() ?? "";
  const hasPhotos = PORTFOLIO_PHOTOS.length > 0;
  const hasMorePhotos = PORTFOLIO_PHOTOS.length > PHOTO_PREVIEW_LIMIT;
  const coverExtendTop = immersiveCover ? top + 44 : 0;
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
              styles={portfolioSectionStyles}
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

const layoutStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootImmersive: {
    backgroundColor: PORTFOLIO_IMMERSIVE_BG,
  },
  scrollImmersive: {
    backgroundColor: PORTFOLIO_IMMERSIVE_BG,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default PortfolioScrollLayout;
