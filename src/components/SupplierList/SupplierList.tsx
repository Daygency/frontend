import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MAIN } from "../../color";

const SupplierList = () => {
  const supplierlist = [
    "연습실",
    "헤어/메이크업",
    "드레스",
    "프로필촬영",
    "포스터디자인",
    "연주 스냅",
  ];

  return (
    <ScrollView
      horizontal
      style={defaultStyles.conatiner}
      contentContainerStyle={defaultStyles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {supplierlist.map((title, index) => (
        <Pressable key={index} style={defaultStyles.itemContainer}>
          <View style={defaultStyles.icon}></View>
          <Text style={defaultStyles.title}>{title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const defaultStyles = StyleSheet.create({
  conatiner: {
    flexGrow: 0,
    marginBottom: 17,
  },
  contentContainer: {
    justifyContent: "center",
    gap: 13,
    paddingHorizontal: 16,
  },
  itemContainer: {
    alignItems: "center",
  },
  icon: {
    backgroundColor: MAIN.DEFAULT,
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  title: { lineHeight: 16, fontSize: 11, fontWeight: "400" },
});

export default SupplierList;
