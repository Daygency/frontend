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
import { BLACK } from "../../../color";

interface Styles {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  content?: StyleProp<ViewStyle>;
}

interface SectionProps {
  title: string;
  onPressMore?: () => void;
  /** 제목 바로 오른쪽 (예: 숨겨진 후기) */
  headerInline?: ReactNode;
  children: ReactNode;
  styles?: Styles;
}

export default function Section({
  title,
  onPressMore,
  headerInline,
  children,
  styles,
}: SectionProps) {
  const headerContent = (
    <>
      <View style={defaultStyles.headerLeft}>
        <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
        {headerInline}
      </View>
      {onPressMore ? (
        <Pressable onPress={onPressMore} hitSlop={8}>
          <MaterialIcons name="chevron-right" size={28} color={BLACK} />
        </Pressable>
      ) : null}
    </>
  );

  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <View style={[defaultStyles.header, styles?.header]}>{headerContent}</View>
      <View style={[defaultStyles.content, styles?.content]}>{children}</View>
    </View>
  );
}
