import { Fragment, type ReactNode } from "react";
import { View } from "react-native";
import SectionHeader from "./SectionHeader";
import styles from "../styles";

type Props<T extends { id: string }> = {
  title: string;
  description: string;
  entries: T[];
  onAdd: () => void;
  renderItem: (entry: T) => ReactNode;
};

function ProfileEntrySection<T extends { id: string }>({
  title,
  description,
  entries,
  onAdd,
  renderItem,
}: Props<T>) {
  return (
    <View style={styles.contentSheet}>
      <View style={styles.section}>
        <SectionHeader
          title={title}
          description={description}
          onAdd={onAdd}
        />
        {entries.map((entry, index) => (
          <Fragment key={entry.id}>
            {index > 0 ? <View style={styles.entryDivider} /> : null}
            {renderItem(entry)}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

export default ProfileEntrySection;
