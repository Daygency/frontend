import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import styles from "./styles";
import { GRAY, MAIN } from "../../../color";
import ShadowCardButton from "../../../components/cards/ShadowCardButton";
import { usePortfolioProfile } from "../../../hooks/usePortfolioProfile";
import {
  getProfileDetailSections,
  type ProfileDisplayEntry,
} from "../../../lib/profile/profileDisplayEntries";

type ProfileDetailProps = {
  embedded?: boolean;
};

function EntrySection({
  title,
  items,
  embedded,
}: {
  title: string;
  items: ProfileDisplayEntry[];
  embedded: boolean;
}) {
  if (items.length === 0) return null;

  const Sheet = embedded ? View : ShadowCardButton;
  const sheetProps = embedded
    ? { style: styles.embeddedSheet }
    : {
        styles: {
          container: {
            paddingTop: 16,
            paddingBottom: 17,
            paddingHorizontal: 16,
          },
        },
      };

  return (
    <Sheet {...sheetProps}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.entryList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <View
              key={`${title}-${index}-${item.description}`}
              style={styles.entryRow}
            >
              <View style={styles.timelineTrack}>
                <View style={styles.timelineDot} />
                {!isLast ? <View style={styles.timelineLine} /> : null}
              </View>
              <View
                style={[styles.entryBody, isLast ? styles.entryBodyLast : null]}
              >
                <Text style={styles.entryTitle}>{item.description}</Text>
                {item.period ? (
                  <Text style={styles.entryPeriod}>{item.period}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </Sheet>
  );
}

const ProfileDetail = ({ embedded = false }: ProfileDetailProps) => {
  const {
    profile,
    isLoading,
    isInvalidOtherRoute,
    isOtherProfile,
    isPortfolioPrivateBlocked,
  } = usePortfolioProfile({ refreshOnFocus: true });

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.contentContainer,
          { justifyContent: "center", alignItems: "center", minHeight: 200 },
        ]}
      >
        <ActivityIndicator size="small" color={MAIN.DEFAULT} />
      </View>
    );
  }

  if (isInvalidOtherRoute) {
    return (
      <View
        style={[
          styles.container,
          styles.contentContainer,
          { padding: 24, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: GRAY.DARK, textAlign: "center" }}>
          프로필 상세를 불러올 수 없습니다.
        </Text>
      </View>
    );
  }

  if (isOtherProfile && isPortfolioPrivateBlocked) {
    return null;
  }

  const sections = getProfileDetailSections(profile);

  const body = (
    <>
      <EntrySection
        title="학력"
        items={sections.education}
        embedded={embedded}
      />
      <EntrySection title="경력" items={sections.career} embedded={embedded} />
      <EntrySection
        title="수상 경력"
        items={sections.awards}
        embedded={embedded}
      />
      <EntrySection
        title="수료증 / 자격증"
        items={sections.certificates}
        embedded={embedded}
      />
    </>
  );

  if (embedded) {
    return <View style={styles.embeddedRoot}>{body}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {body}
    </ScrollView>
  );
};

export default ProfileDetail;
