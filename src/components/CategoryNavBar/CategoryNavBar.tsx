import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { GRAY, MAIN, WHITE } from "../../color";

const CategoryList = [
  "전체",
  "공고",
  "공연소식",
  "예술가",
  "공연장",
  "기획사",
  "학원",
];

const CategoryNavBar = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      bounces={false}
    >
      {CategoryList.map((category) => (
        <Pressable
          key={category}
          style={[
            styles.button,
            selectedCategory === category && styles.buttonSelected,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.text,
              selectedCategory === category && styles.textSelected,
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexGrow: 0,
    paddingBottom: 6,
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: GRAY.DEFAULT,
  },
  buttonSelected: {
    borderBottomWidth: 1,
    borderColor: MAIN.DEFAULT,
  },
  text: {
    fontSize: 14,
    color: "#717182",
    fontWeight: "500",
  },
  textSelected: {
    fontWeight: "600",
  },
});

export default CategoryNavBar;
