import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  pressed: {
    opacity: 0.7,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GRAY.DARK_1,
  },
  placeholderImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GRAY.DARK_1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: BLACK,
  },
  subtitle: {
    fontSize: 14,
    color: GRAY.DARK_2,
    marginTop: 4,
  },
});

export default styles;
