import { useEffect, useState } from "react";
import { Dimensions, Keyboard, Platform, type KeyboardEvent } from "react-native";

export const INPUT_BAR_VERTICAL_PADDING = 6;

export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onShow = (event: KeyboardEvent) => {
      const { height, screenY } = event.endCoordinates;
      const offsetFromBottom =
        screenY > 0
          ? Math.round(Dimensions.get("window").height - screenY)
          : height;
      setKeyboardHeight(offsetFromBottom);
    };
    const onHide = () => setKeyboardHeight(0);

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return keyboardHeight;
}

export function commentInputBottomPadding(
  keyboardHeight: number,
  safeBottom: number,
): number {
  if (keyboardHeight > 0) {
    return keyboardHeight;
  }
  return safeBottom > 0 ? safeBottom : 0;
}

export function commentInputBarPaddingBottom(
  keyboardHeight: number,
  safeBottom: number,
): number {
  return commentInputBottomPadding(keyboardHeight, safeBottom) + INPUT_BAR_VERTICAL_PADDING;
}
