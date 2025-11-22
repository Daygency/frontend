import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import styles from "./styles";

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
      style={styles.conatiner}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {supplierlist.map((title, index) => (
        <Pressable key={index} style={styles.itemContainer}>
          <View style={styles.icon}></View>
          <Text style={styles.title}>{title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default SupplierList;
