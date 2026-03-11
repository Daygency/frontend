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
  <Pressable style={styles.sectionHeader} onPress={onAdd}>
    <View style={styles.sectionHeaderTextBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.sectionSubtitle}>{description}</Text>
      ) : null}
    </View>
    <View style={styles.sectionHeaderIconWrapper}>
      <MaterialCommunityIcons
        name="plus"
        size={18}
        color={MAIN.DEFAULT}
      />
    </View>
  </Pressable>
);

export default SectionHeader;
