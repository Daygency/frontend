import { View, Text, FlatList } from "react-native";
import styles from "./styles";
import SearchInput from "../../../../components/SearchInput/SearchInput";
import PersonItem from "../PersonItem/PersonItem";

const List = ({ type }: { type: "following" | "follower" }) => {
  const PeopleArray = [
    {
      name: "김연주자",
      tag: "예술가",
      introduction: "안녕하세요, 저는 연주자입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "예술가",
      introduction: "안녕하세요, 저는 연주자입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "예술가",
      introduction: "안녕하세요, 저는 연주자입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "기획사",
      introduction: "안녕하세요, 저는 기획사입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "기획사",
      introduction: "안녕하세요, 저는 기획사입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "기획사",
      introduction: "안녕하세요, 저는 기획사입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "기획사",
      introduction: "안녕하세요, 저는 기획사입니다 !",
      profileImage: null,
    },
    {
      name: "김연주자",
      tag: "기획사",
      introduction: "안녕하세요, 저는 기획사입니다 !",
      profileImage: null,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput placeholder="검색" />
      </View>
      <FlatList
        data={PeopleArray}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PersonItem person={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default List;
