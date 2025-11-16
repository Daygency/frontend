import { ScrollView } from "react-native";
import ImageScrollView from "../ImageScrollView/ImageScrollView";
import Section from "../Section/Section";
import SupplierList from "../SupplierList/SupplierList";
import AnnouncementCard from "../AnnouncementCard/AnnouncementCard";
import GrayCard from "../GrayCard/GrayCard";
import EventScheduleCard from "../EventScheduleCard/EventScheduleCard";

const AllContentScene = () => {
  return (
    <ScrollView>
      <ImageScrollView
        styles={{ container: { marginBottom: 14 } }}
        width={339}
        height={183}
        gap={5}
      />
      <SupplierList />
      <Section title="모집공고" onPressMore={() => {}}>
        <AnnouncementCard title="제목1" />
        <AnnouncementCard title="제목2" />
        <AnnouncementCard title="제목3" />
      </Section>
      <Section
        title="공연소식"
        styles={{ content: { paddingHorizontal: 0 } }}
      >
        <ImageScrollView
          styles={{ container: { marginBottom: 14 } }}
          width={138}
          height={193}
          gap={14}
        />
      </Section>
      <Section title="커뮤니티" onPressMore={() => {}}>
        <GrayCard
          items={[
            {
              boardName: "자유게시판",
              latestPost: "공연 무사히 마무리했습니다!",
              hasNew: true,
            },
            {
              boardName: "강사·대타구인",
              latestPost: "00월 00일 스탭 구합니다.",
            },
            { boardName: "입시 정보", latestPost: "입시 정보 공유해주세요!" },
            { boardName: "유학 정보", latestPost: "유학 질문 드립니다." },
            {
              boardName: "학원 운영",
              latestPost: "학원을 운영하려고 하는데 도움이 필요합니다!",
            },
            {
              boardName: "학원·연습실 매매",
              latestPost: "연습실 내놓습니다.",
            },
          ]}
        />
      </Section>
      <Section title="내 공연 일정" onPressMore={() => {}}>
        <EventScheduleCard title="재즈 페스티벌 2025" daysLeft="D-12" />
        <EventScheduleCard title="재즈 페스티벌 2025" daysLeft="D-12" />
        <EventScheduleCard title="재즈 페스티벌 2025" daysLeft="D-12" />
      </Section>
    </ScrollView>
  );
};

export default AllContentScene;

