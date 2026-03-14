import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY, MAIN } from "../../../color";
import styles from "../styles";

type Props = {
  title: string;
  description?: string;
  onAdd: () => void;
};

const SectionHeader = ({ title, description, onAdd }: Props) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderTextBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.sectionSubtitle}>{description}</Text>
      ) : null}
    </View>
    <Pressable
      style={styles.sectionHeaderIconWrapper}
      onPress={onAdd}
      hitSlop={0}
    >
      <MaterialCommunityIcons
        name="plus"
        size={18}
        color={MAIN.DEFAULT}
      />
    </Pressable>
  </View>
);

export default SectionHeader;
