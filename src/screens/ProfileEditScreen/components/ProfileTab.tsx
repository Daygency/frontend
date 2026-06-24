import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import type {
  EducationEntry,
  CareerEntry,
  AwardEntry,
  CertificateEntry,
} from "../../../lib/apis/portfolio/types";
import EducationItem from "./EducationItem";
import CareerItem from "./CareerItem";
import AwardItem from "./AwardItem";
import CertificateItem from "./CertificateItem";
import ProfileEntrySection from "./ProfileEntrySection";
import {
  createEmptyAwardEntry,
  createEmptyCareerEntry,
  createEmptyCertificateEntry,
  createEmptyEducationEntry,
  useProfileEntryList,
} from "./profileEntryUtils";
import styles from "../styles";

type EditingFocusHandler = (
  focused: boolean,
  inputNode?: number | null,
  actionRowNode?: number | null,
) => void;

type Props = {
  educationList: EducationEntry[];
  setEducationList: Dispatch<SetStateAction<EducationEntry[]>>;
  careerList: CareerEntry[];
  setCareerList: Dispatch<SetStateAction<CareerEntry[]>>;
  awardList: AwardEntry[];
  setAwardList: Dispatch<SetStateAction<AwardEntry[]>>;
  certificateList: CertificateEntry[];
  setCertificateList: Dispatch<SetStateAction<CertificateEntry[]>>;
  onEditingFocusChange?: EditingFocusHandler;
};

const ProfileTab = ({
  educationList,
  setEducationList,
  careerList,
  setCareerList,
  awardList,
  setAwardList,
  certificateList,
  setCertificateList,
  onEditingFocusChange,
}: Props) => {
  const education = useProfileEntryList(
    setEducationList,
    useCallback(createEmptyEducationEntry, []),
  );
  const career = useProfileEntryList(
    setCareerList,
    useCallback(createEmptyCareerEntry, []),
  );
  const award = useProfileEntryList(
    setAwardList,
    useCallback(createEmptyAwardEntry, []),
  );
  const certificate = useProfileEntryList(
    setCertificateList,
    useCallback(createEmptyCertificateEntry, []),
  );

  return (
    <View style={[styles.tabContent, styles.tabContentContainer]}>
      <ProfileEntrySection
        title="학력"
        description="최근 학력부터 등록"
        entries={educationList}
        onAdd={education.add}
        renderItem={(entry) => (
          <EducationItem
            entry={entry}
            onChange={(updates) => education.update(entry.id, updates)}
            onDelete={() => education.remove(entry.id)}
            onEditingFocusChange={onEditingFocusChange}
          />
        )}
      />

      <ProfileEntrySection
        title="경력사항"
        description="최근 경력부터 등록"
        entries={careerList}
        onAdd={career.add}
        renderItem={(entry) => (
          <CareerItem
            entry={entry}
            onChange={(updates) => career.update(entry.id, updates)}
            onDelete={() => career.remove(entry.id)}
            onEditingFocusChange={onEditingFocusChange}
          />
        )}
      />

      <ProfileEntrySection
        title="수상경력"
        description="가장 의미 있는 수상부터 등록"
        entries={awardList}
        onAdd={award.add}
        renderItem={(entry) => (
          <AwardItem
            entry={entry}
            onChange={(updates) => award.update(entry.id, updates)}
            onDelete={() => award.remove(entry.id)}
            onEditingFocusChange={onEditingFocusChange}
          />
        )}
      />

      <ProfileEntrySection
        title="수료증 / 자격증"
        description="보유 자격증을 등록"
        entries={certificateList}
        onAdd={certificate.add}
        renderItem={(entry) => (
          <CertificateItem
            entry={entry}
            onChange={(updates) => certificate.update(entry.id, updates)}
            onDelete={() => certificate.remove(entry.id)}
            onEditingFocusChange={onEditingFocusChange}
          />
        )}
      />
    </View>
  );
};

export default ProfileTab;
