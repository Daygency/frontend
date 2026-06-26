import { ScrollView } from "react-native";
import SelectableTag from "../../../components/ui/SelectableTag";
import styles from "../styles";

export const LOUNGE_COMMUNITY_TAG_OPTIONS = [
  "전체",
  "자유게시판",
  "구인",
  "입시정보",
  "유학정보",
  "학원 운영",
  "학원/연습실 매매",
] as const;

export type LoungeCommunityTagOption = (typeof LOUNGE_COMMUNITY_TAG_OPTIONS)[number];

type Props = {
  selectedTag: LoungeCommunityTagOption;
  onSelectTag: (tag: LoungeCommunityTagOption) => void;
};

const LoungeCommunityTagRow = ({ selectedTag, onSelectTag }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.communityTagScroll}
    contentContainerStyle={styles.sortFilterContainer}
    nestedScrollEnabled
    directionalLockEnabled
    scrollEventThrottle={16}
    bounces={false}
  >
    {LOUNGE_COMMUNITY_TAG_OPTIONS.map((tag) => (
      <SelectableTag
        key={tag}
        label={tag}
        selected={selectedTag === tag}
        onPress={() => onSelectTag(tag)}
      />
    ))}
  </ScrollView>
);

export default LoungeCommunityTagRow;
