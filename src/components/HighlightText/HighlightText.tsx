import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";

type Props = {
  text: string;
  query: string;
  style?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
};

const HighlightText = ({
  text,
  query,
  style,
  highlightStyle,
}: Props) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return <Text style={style}>{text}</Text>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const parts: React.ReactNode[] = [];
  let start = 0;
  let matchIndex = lowerText.indexOf(lowerQuery);
  let key = 0;

  while (matchIndex !== -1) {
    if (matchIndex > start) {
      parts.push(text.slice(start, matchIndex));
    }
    parts.push(
      <Text key={`m-${key++}`} style={highlightStyle}>
        {text.slice(matchIndex, matchIndex + trimmed.length)}
      </Text>,
    );
    start = matchIndex + trimmed.length;
    matchIndex = lowerText.indexOf(lowerQuery, start);
  }

  if (start < text.length) {
    parts.push(text.slice(start));
  }

  return <Text style={style}>{parts}</Text>;
};

export default HighlightText;
