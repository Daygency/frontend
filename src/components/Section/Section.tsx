import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ReactNode } from "react";

interface SectionProps {
  title: string;
  onPressMore?: () => void;
  children: ReactNode;
}

export default function Section({
  title,
  onPressMore,
  children,
}: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onPressMore && (
          <TouchableOpacity onPress={onPressMore}>
            <Text style={styles.more}>더 보기 ›</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  more: {
    fontSize: 13,
    color: "#888",
  },
  content: {
    gap: 5,
  },
});
