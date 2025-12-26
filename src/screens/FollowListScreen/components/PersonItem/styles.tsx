import { StyleSheet } from "react-native";
import { BLACK, GRAY } from "../../../../color";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0, // No border as per image
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: GRAY.DARK_1,
  },
  placeholderImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: GRAY.DARK_1,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: BLACK,
    marginRight: 6,
  },
  introduction: {
    fontSize: 15,
    color: BLACK,
    fontWeight: "400",
  },
  deleteButton: {
    padding: 8,
  },
});

export default styles;
