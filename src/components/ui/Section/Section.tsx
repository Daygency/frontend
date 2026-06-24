import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { ReactNode } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import defaultStyles from "./styles";

interface Styles {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  content?: StyleProp<ViewStyle>;
}

interface SectionProps {
  title: string;
  onPressMore?: () => void;
  headerRight?: ReactNode;
  children: ReactNode;
  styles?: Styles;
}

export default function Section({
  title,
  onPressMore,
  headerRight,
  children,
  styles,
}: SectionProps) {
  const headerContent = (
    <>
      <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
      <View style={defaultStyles.headerActions}>
        {headerRight}
        {onPressMore ? (
          <Pressable onPress={onPressMore} hitSlop={8}>
            <MaterialIcons name="chevron-right" size={28} color="#000" />
          </Pressable>
        ) : null}
      </View>
    </>
  );

  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <View style={[defaultStyles.header, styles?.header]}>{headerContent}</View>
      <View style={[defaultStyles.content, styles?.content]}>{children}</View>
    </View>
  );
}
