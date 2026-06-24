import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import ShadowCardButton from "../../cards/ShadowCardButton";
import { Entypo } from "@expo/vector-icons";
import styles from "./styles";
import Tag from "../../ui/Tag";
import { MAIN } from "../../../color";

export interface ReviewCardProps {
  author?: string;
  date?: string;
  title: string;
  content?: string;
  reactionTag?: string;
  tags?: { text: string; variant?: "type" | "status" | "reaction" }[];
  onPress?: () => void;
  onOptionsPress?: () => void;
  optionsMenu?: ReactNode;
}

const ReviewCard = ({
  author = "이XX",
  date = "2025.09.20",
  title,
  content,
  reactionTag,
  tags,
  onPress,
  onOptionsPress,
  optionsMenu,
}: ReviewCardProps) => {
  const showReactionTag = reactionTag !== undefined && reactionTag !== "";
  const showTags = tags && tags.length > 0;
  const showOptions = Boolean(optionsMenu || onOptionsPress);

  return (
    <ShadowCardButton onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.profileContainer, { backgroundColor: MAIN.DEFAULT }]} />
        <View style={styles.profileNameContainer}>
          <Text style={styles.authorText}>{author}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        {optionsMenu ? (
          optionsMenu
        ) : showOptions ? (
          <Pressable
            onPress={onOptionsPress}
            hitSlop={10}
            style={styles.dotsContainer}
          >
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {content ? <Text style={styles.content}>{content}</Text> : null}
      </View>

      {(showReactionTag || showTags) && (
        <View style={styles.tagContainer}>
          {showReactionTag && (
            <Tag text={reactionTag!} variant="reaction" />
          )}
          {(tags ?? []).map((tag, index) => (
            <Tag
              key={index}
              text={tag.text}
              variant={tag.variant ?? "type"}
            />
          ))}
        </View>
      )}
    </ShadowCardButton>
  );
};

export default ReviewCard;
