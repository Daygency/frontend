export const HomeRoutes = {
  MAIN_HOME: "MainHome",
} as const;

export const ContentRoutes = {
  HOME: "Home",
  ACTIVITY: "Activity",
  PAYMENT: "Chat",
  CHAT: "Lounge",
  LOUNGE: "Portfolio",
} as const;

export const RootRoutes = {
  LOGIN: "Login",
  /** 탈퇴 유예 기간 내 재로그인 — 복구 동의 화면 */
  ACCOUNT_REACTIVATION: "AccountReactivation",
  CONTENT_TAB: "ContentTab",
  ANNOUNCEMENT_DETAIL: "AnnouncementDetail",
  ANNOUNCEMENT_REGISTRATION: "AnnouncementRegistration",
  APPLICATION: "Application",
  FOLLOW_LIST: "FollowList",
  COMMUNITY_DETAIL: "CommunityDetail",
  COMMUNITY_REGISTRATION: "CommunityRegistration",
  SETTINGS: "Settings",
  MY_INFO: "MyInfo",
  MY_ACTIVITY: "MyActivity",
  MY_ACTIVITY_LIST: "MyActivityList",
  MY_ACTIVITY_NEWS_LIST: "MyActivityNewsList",
  MY_ACTIVITY_ANNOUNCEMENT_LIST: "MyActivityAnnouncementList",
  CHANGE_NAME: "ChangeName",
  NOTIFICATION_SETTINGS: "NotificationSettings",
  /** 인박스 (GET /notifications) */
  NOTIFICATIONS: "Notifications",
  MY_DATA_ARCHIVE: "MyDataArchive",
  CUSTOMER_SERVICE: "CustomerService",
  INQUIRY: "Inquiry",
  INQUIRY_DETAIL: "InquiryDetail",
  ACCOUNT: "Account",
  WITHDRAW_CONFIRM: "WithdrawConfirm",
  CHAT_ROOM: "ChatRoom",
  CHAT_ROOM_OPTIONS: "ChatRoomOptions",
  MY_POSTED_CHAT_ROOMS: "MyPostedChatRooms",
  ANNOUNCEMENT_APPLICANTS: "AnnouncementApplicants",
  /** README: POST /announcement/:postId/reviews */
  ACTIVITY_REVIEW: "ActivityReview",
  RECEIVED_APPLICATION_DETAIL: "ReceivedApplicationDetail",
  PROFILE_EDIT: "ProfileEdit",
  ARTIST_PORTFOLIO: "ArtistPortfolio",
  PORTFOLIO_PHOTO_GALLERY: "PortfolioPhotoGallery",
  SEARCH: "Search",
  MUSIC_NEWS_DETAIL: "MusicNewsDetail",
  MUSIC_NEWS_REGISTRATION: "MusicNewsRegistration",
  HOME_BANNER_DETAIL: "HomeBannerDetail",
  HOME_BANNER_LIST: "HomeBannerList",
} as const;
