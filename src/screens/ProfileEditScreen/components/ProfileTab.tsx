import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { GRAY } from "../../../color";
import type {
  EducationEntry,
  CareerEntry,
  AwardEntry,
  CertificateEntry,
} from "../../../lib/apis/portfolio/profileApi";
import SectionHeader from "./SectionHeader";
import EducationItem from "./EducationItem";
import CareerItem from "./CareerItem";
import AwardItem from "./AwardItem";
import CertificateItem from "./CertificateItem";
import styles from "../styles";

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type Props = {
  aboutMe: string;
  setAboutMe: (v: string) => void;
  educationList: EducationEntry[];
  setEducationList: (v: EducationEntry[]) => void;
  careerList: CareerEntry[];
  setCareerList: (v: CareerEntry[]) => void;
  awardList: AwardEntry[];
  setAwardList: (v: AwardEntry[]) => void;
  certificateList: CertificateEntry[];
  setCertificateList: (v: CertificateEntry[]) => void;
};

const ProfileTab = ({
  aboutMe,
  setAboutMe,
  educationList,
  setEducationList,
  careerList,
  setCareerList,
  awardList,
  setAwardList,
  certificateList,
  setCertificateList,
}: Props) => {
  const [isAboutFocused, setIsAboutFocused] = React.useState(false);
  // ── 학력 ──
  const updateEducation = (id: string, updates: Partial<EducationEntry>) =>
    setEducationList(
      educationList.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  const deleteEducation = (id: string) =>
    setEducationList((prev) => prev.filter((e) => e.id !== id));
  const addEducation = () => {
    const hasEditing = educationList.some(
      (e) => !e.description || !e.description.trim(),
    );
    if (hasEditing) return;
    setEducationList([
      ...educationList,
      {
        id: newId(),
        description: "",
        startYear: "",
        startMonth: "",
        endYear: "",
        endMonth: "",
      },
    ]);
  };

  // ── 경력 ──
  const updateCareer = (id: string, updates: Partial<CareerEntry>) =>
    setCareerList(
      careerList.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  const deleteCareer = (id: string) =>
    setCareerList((prev) => prev.filter((e) => e.id !== id));
  const addCareer = () => {
    const hasEditing = careerList.some(
      (e) => !e.description || !e.description.trim(),
    );
    if (hasEditing) return;
    setCareerList([
      ...careerList,
      {
        id: newId(),
        description: "",
        startYear: "",
        startMonth: "",
        endYear: "",
        endMonth: "",
      },
    ]);
  };

  // ── 수상 ──
  const updateAward = (id: string, updates: Partial<AwardEntry>) =>
    setAwardList(
      awardList.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  const deleteAward = (id: string) =>
    setAwardList((prev) => prev.filter((e) => e.id !== id));
  const addAward = () => {
    const hasEditing = awardList.some(
      (e) => !e.description || !e.description.trim(),
    );
    if (hasEditing) return;
    setAwardList([
      ...awardList,
      { id: newId(), description: "", year: "", month: "" },
    ]);
  };

  // ── 자격증 ──
  const updateCertificate = (id: string, updates: Partial<CertificateEntry>) =>
    setCertificateList(
      certificateList.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    );
  const deleteCertificate = (id: string) =>
    setCertificateList((prev) => prev.filter((e) => e.id !== id));
  const addCertificate = () => {
    const hasEditing = certificateList.some(
      (e) => !e.description || !e.description.trim(),
    );
    if (hasEditing) return;
    setCertificateList([
      ...certificateList,
      { id: newId(), description: "", year: "", month: "" },
    ]);
  };

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.field}>
        <Text style={[styles.label, isAboutFocused && styles.labelFocused]}>
          소개
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            isAboutFocused && styles.inputFocused,
          ]}
          value={aboutMe}
          onChangeText={setAboutMe}
          placeholder="소개를 입력하세요"
          placeholderTextColor={GRAY.DARK_2}
          multiline
          numberOfLines={5}
          onFocus={() => setIsAboutFocused(true)}
          onBlur={() => setIsAboutFocused(false)}
        />
      </View>

      {/* 학력 */}
      <View style={styles.field}>
        <View style={styles.sectionCard}>
          <SectionHeader
            title="학력"
            description="최근 학력부터 등록"
            onAdd={addEducation}
          />
          {educationList.map((entry) => (
            <EducationItem
              key={entry.id}
              entry={entry}
              onChange={(u) => updateEducation(entry.id, u)}
              onDelete={() => deleteEducation(entry.id)}
            />
          ))}
        </View>
      </View>

      {/* 경력 */}
      <View style={styles.field}>
        <View style={styles.sectionCard}>
          <SectionHeader
            title="경력사항"
            description="최근 경력부터 등록"
            onAdd={addCareer}
          />
          {careerList.map((entry) => (
            <CareerItem
              key={entry.id}
              entry={entry}
              onChange={(u) => updateCareer(entry.id, u)}
              onDelete={() => deleteCareer(entry.id)}
            />
          ))}
        </View>
      </View>

      {/* 수상경력 */}
      <View style={styles.field}>
        <View style={styles.sectionCard}>
          <SectionHeader
            title="수상경력"
            description="가장 의미 있는 수상부터 등록"
            onAdd={addAward}
          />
          {awardList.map((entry) => (
            <AwardItem
              key={entry.id}
              entry={entry}
              onChange={(u) => updateAward(entry.id, u)}
              onDelete={() => deleteAward(entry.id)}
            />
          ))}
        </View>
      </View>

      {/* 수료증/자격증 */}
      <View style={styles.field}>
        <View style={styles.sectionCard}>
          <SectionHeader
            title="수료증 / 자격증"
            description="보유 자격증을 등록"
            onAdd={addCertificate}
          />
          {certificateList.map((entry) => (
            <CertificateItem
              key={entry.id}
              entry={entry}
              onChange={(u) => updateCertificate(entry.id, u)}
              onDelete={() => deleteCertificate(entry.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;
