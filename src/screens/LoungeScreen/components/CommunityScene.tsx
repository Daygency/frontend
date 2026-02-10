import { useState } from "react";
import { View } from "react-native";
import styles from "../styles";
import SelectableTag from "../../../components/SelectableTag/SelectableTag";

type TagOption =
  | "전체"
  | "자유게시판"
  | "구인"
  | "입시정보"
  | "유학정보"
  | "학원 운영"
  | "학원/연습실 매매";

const TAG_OPTIONS: TagOption[] = [
  "전체",
  "자유게시판",
  "구인",
  "입시정보",
  "유학정보",
  "학원 운영",
  "학원/연습실 매매",
];

const CommunityScene = () => {
  const [selectedTag, setSelectedTag] = useState<TagOption>("전체");

  return (
    <View style={styles.newsSceneContainer}>
      <View style={styles.sortFilterContainer}>
        {TAG_OPTIONS.map((tag) => (
          <SelectableTag
            key={tag}
            label={tag}
            selected={selectedTag === tag}
            onPress={() => setSelectedTag(tag)}
          />
        ))}
      </View>
      {/* TODO: 선택된 태그 기준으로 커뮤니티 글 필터링 */}
    </View>
  );
};

export default CommunityScene;
