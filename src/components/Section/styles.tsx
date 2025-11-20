import { StyleSheet } from "react-native";
import { GRAY } from "../../color";

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 12 + 8, // 기존 12씩 + 양쪽 4만큼 해서 콘텐츠보다 더 안쪽에 위치하도록 함
  },
  title: {
    marginLeft: 4,
    fontSize: 19,
    lineHeight: 27,
    letterSpacing: -0.32,
    fontWeight: "600",
  },
  moreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  more: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontWeight: 400,
    color: GRAY.DARK,
  },
  moreIcon: {},
  content: {
    marginTop: 5,
    gap: 5,
    paddingHorizontal: 12,
  },
});

export default styles;

