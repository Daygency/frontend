import { ActionSheetIOS, Alert, Platform } from "react-native";

type PhotoActionSheetOptions = {
  title: string;
  changeLabel: string;
  resetLabel: string;
  onChange: () => void;
  onReset: () => void;
};

/** iOS에서는 네이티브 하단 액션시트, Android에서는 Alert로 표시 */
export const showPhotoActionSheet = ({
  title,
  changeLabel,
  resetLabel,
  onChange,
  onReset,
}: PhotoActionSheetOptions) => {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [changeLabel, resetLabel, "취소"],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (index) => {
        if (index === 0) onChange();
        else if (index === 1) onReset();
      },
    );
    return;
  }

  Alert.alert(title, undefined, [
    { text: changeLabel, onPress: onChange },
    { text: resetLabel, style: "destructive", onPress: onReset },
    { text: "취소", style: "cancel" },
  ]);
};
