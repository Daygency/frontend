import { Pressable, ScrollView, Text } from "react-native";
import { useState } from "react";
import styles from "./styles";

const CategoryList = [
  "전체",
  "모집공고",
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
      contentContainerStyle={styles.contentContainer}
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
            numberOfLines={1}
          >
            {category}
          </Text>
        </Pressable> 
      ))}
    </ScrollView>
  );
};

export default CategoryNavBar;
