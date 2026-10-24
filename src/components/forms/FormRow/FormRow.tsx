import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, type ReactNode } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { GRAY, MAIN, RED, WHITE } from "../../../color";
import styles from "./styles";

/** 모든 입력란의 커서·선택 하이라이트를 main 색상으로 */
const inputTintProps = {
  selectionColor: MAIN.DEFAULT,
  cursorColor: MAIN.DEFAULT,
} as const;

/* ───────────────────────── Section ───────────────────────── */

type FormSectionProps = {
  title?: string;
  description?: string;
  /** 첫 섹션은 구분선 없이 */
  divider?: boolean;
  children: ReactNode;
};

/** 행 묶음. 섹션 사이는 얇은 구분선 하나로만 나눔 */
export const FormSection = ({
  title,
  description,
  divider = true,
  children,
}: FormSectionProps) => (
  <View style={styles.section}>
    {divider ? <View style={styles.sectionDivider} /> : null}
    {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
    {description ? (
      <Text style={styles.sectionDescription}>{description}</Text>
    ) : null}
    {children}
  </View>
);

type FormGroupDividerProps = {
  /** 화면 좌우 패딩만큼 밖으로 늘려 화면 폭 전체를 채움 */
  bleed?: number;
};

/** 행 묶음 사이의 옅은 회색 띠 (iOS 설정 화면 그룹 간격) */
export const FormGroupDivider = ({ bleed = 20 }: FormGroupDividerProps) => (
  <View style={[styles.groupDivider, { marginHorizontal: -bleed }]} />
);

/* ───────────────────────── Base row ───────────────────────── */

type FormRowProps = {
  label: string;
  isRequired?: boolean;
  /** true면 라벨만 빨간색, 문자열이면 행 아래 메시지도 표시 */
  error?: boolean | string;
  disabled?: boolean;
  /** 라벨 글씨만 회색으로 (레이아웃·투명도는 그대로) */
  muted?: boolean;
  onPress?: () => void;
  /** 오른쪽 값/컨트롤 */
  children?: ReactNode;
  /** 행 아래에 붙는 콘텐츠 */
  below?: ReactNode;
  /** 라벨 바로 오른쪽에 붙는 작은 요소 (예: 안내 버튼) */
  labelAccessory?: ReactNode;
};

/** 왼쪽 라벨, 오른쪽 값/컨트롤 — iOS 설정 화면형 기본 행 */
export const FormRow = ({
  label,
  isRequired,
  error,
  disabled,
  muted,
  onPress,
  children,
  below,
  labelAccessory,
}: FormRowProps) => {
  const hasError = !!error;
  const content = (
    <>
      <View style={styles.labelWrap}>
        <Text
          style={[
            styles.label,
            muted && styles.labelMuted,
            hasError && styles.labelError,
          ]}
        >
          {label}
        </Text>
        {isRequired ? <Text style={styles.required}>*</Text> : null}
        {labelAccessory}
      </View>
      <View style={styles.accessory}>{children}</View>
    </>
  );

  return (
    <View>
      {onPress ? (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.row,
            pressed && styles.rowPressed,
            disabled && styles.rowDisabled,
          ]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={[styles.row, disabled && styles.rowDisabled]}>
          {content}
        </View>
      )}
      {typeof error === "string" && error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      {below ? <View style={styles.below}>{below}</View> : null}
    </View>
  );
};

/** 행 아래 보조 안내 문구 */
export const FormRowHelper = ({ children }: { children: ReactNode }) => (
  <Text style={styles.helperText}>{children}</Text>
);

/* ───────────────────────── Toggle row ───────────────────────── */

type FormToggleRowProps = Omit<FormRowProps, "children" | "onPress"> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const FormToggleRow = ({
  value,
  onValueChange,
  disabled,
  ...rowProps
}: FormToggleRowProps) => (
  <FormRow {...rowProps} disabled={disabled}>
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: GRAY.MEDIUM_2, true: MAIN.DEFAULT }}
      ios_backgroundColor={GRAY.MEDIUM_2}
      thumbColor={Platform.OS === "android" ? WHITE : undefined}
    />
  </FormRow>
);

/* ───────────────────────── Picker / disclosure row ───────────────────────── */

type FormPickerRowProps = Omit<FormRowProps, "children"> & {
  value?: string;
  placeholder?: string;
  /** "updown"=⌃⌄ 선택 목록, "disclosure"=› 이동/추가 */
  variant?: "updown" | "disclosure";
};

export const FormPickerRow = ({
  value,
  placeholder,
  variant = "updown",
  ...rowProps
}: FormPickerRowProps) => (
  <FormRow {...rowProps}>
    <Text
      style={[styles.valueText, !value && styles.valuePlaceholder]}
      numberOfLines={1}
    >
      {value || placeholder}
    </Text>
    <MaterialCommunityIcons
      name={variant === "updown" ? "unfold-more-horizontal" : "chevron-right"}
      size={variant === "updown" ? 16 : 20}
      color={GRAY.MEDIUM_100}
    />
  </FormRow>
);

/* ───────────────────────── Date / time chips ───────────────────────── */

/** 2026. 3. 17 */
export function formatChipDate(d: Date): string {
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
}

/** 오후 02:00 */
export function formatChipTime(d: Date): string {
  const h = d.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h < 12 ? "오전" : "오후"} ${String(h12).padStart(2, "0")}:${m}`;
}

type FormChipProps = {
  label: string;
  onPress?: () => void;
  hasError?: boolean;
  disabled?: boolean;
};

export const FormChip = ({
  label,
  onPress,
  hasError,
  disabled,
}: FormChipProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    hitSlop={4}
    style={({ pressed }) => [
      styles.chip,
      pressed && styles.chipPressed,
      hasError && styles.chipError,
      disabled && styles.chipDisabled,
    ]}
  >
    <Text style={[styles.chipText, hasError && styles.chipTextError]}>
      {label}
    </Text>
  </Pressable>
);

type FormDateTimeRowProps = Omit<FormRowProps, "children" | "onPress"> & {
  date: Date;
  /** 시간 칩에 쓸 값(날짜와 따로 관리하는 경우). 생략 시 date 사용 */
  time?: Date;
  showTime?: boolean;
  onPressDate: () => void;
  onPressTime?: () => void;
  /** 칩만 흐리게·누를 수 없게 (예: '미정' 버튼이 켜졌을 때) */
  chipsDisabled?: boolean;
  /** 칩 오른쪽에 붙는 요소 (예: FormPillButton) */
  trailing?: ReactNode;
};

export const FormDateTimeRow = ({
  date,
  time,
  showTime = true,
  onPressDate,
  onPressTime,
  chipsDisabled,
  trailing,
  ...rowProps
}: FormDateTimeRowProps) => {
  const hasError = !!rowProps.error;
  return (
    <FormRow {...rowProps}>
      <FormChip
        label={formatChipDate(date)}
        onPress={onPressDate}
        hasError={hasError}
        disabled={chipsDisabled}
      />
      {showTime ? (
        <FormChip
          label={formatChipTime(time ?? date)}
          onPress={onPressTime}
          hasError={hasError}
          disabled={chipsDisabled}
        />
      ) : null}
      {trailing}
    </FormRow>
  );
};

/* ───────────────────────── Pill toggle button ───────────────────────── */

type FormPillButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** 눌러서 켜고 끄는 작은 pill 버튼. 켜지면 main 색 */
export const FormPillButton = ({
  label,
  selected,
  onPress,
}: FormPillButtonProps) => (
  <Pressable
    onPress={onPress}
    hitSlop={6}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    style={({ pressed }) => [
      styles.pill,
      selected && styles.pillSelected,
      pressed && styles.pillPressed,
    ]}
  >
    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

/* ───────────────────────── Inline text input row ───────────────────────── */

type FormInputRowProps = Omit<FormRowProps, "children" | "onPress"> &
  Pick<
    TextInputProps,
    "value" | "onChangeText" | "placeholder" | "keyboardType" | "maxLength"
  > & {
    suffix?: string;
  };

export const FormInputRow = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  suffix,
  disabled,
  ...rowProps
}: FormInputRowProps) => (
  // 비활성이어도 행 레이아웃은 그대로, 라벨·입력 글씨만 회색 — 높이가 변하지 않음
  <FormRow {...rowProps} muted={disabled}>
    <TextInput
      style={[styles.input, disabled && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={
        rowProps.error && !disabled ? RED.DEFAULT : GRAY.MEDIUM_100
      }
      keyboardType={keyboardType}
      maxLength={maxLength}
      editable={!disabled}
      returnKeyType="done"
      {...inputTintProps}
    />
    {suffix ? (
      <Text
        style={[styles.inputSuffix, disabled && styles.inputSuffixDisabled]}
      >
        {suffix}
      </Text>
    ) : null}
  </FormRow>
);

/* ───────────────────────── Title input ───────────────────────── */

type FormTitleInputProps = Pick<
  TextInputProps,
  "value" | "onChangeText" | "placeholder" | "maxLength"
> & {
  hasError?: boolean;
};

/** 폼 맨 위 큰 제목 입력 (iOS 캘린더 '제목' 같은 형태) */
export const FormTitleInput = ({
  hasError,
  ...inputProps
}: FormTitleInputProps) => (
  <TextInput
    {...inputProps}
    style={styles.titleInput}
    placeholderTextColor={hasError ? RED.DEFAULT : GRAY.MEDIUM_100}
    returnKeyType="done"
    {...inputTintProps}
  />
);

/* ───────────────────────── Multiline (memo) row ───────────────────────── */

type FormTextAreaRowProps = Omit<
  FormRowProps,
  "children" | "onPress" | "below"
> &
  Pick<
    TextInputProps,
    "value" | "onChangeText" | "placeholder" | "maxLength"
  > & {
    showCounter?: boolean;
    footer?: string;
  };

export const FormTextAreaRow = ({
  value,
  onChangeText,
  placeholder,
  maxLength,
  showCounter,
  footer,
  ...rowProps
}: FormTextAreaRowProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <FormRow
      {...rowProps}
      below={
        // 보더 두께는 항상 고정, 상태에 따라 색만 바뀜 → 포커스 시 레이아웃 흔들림 없음
        <View
          style={[
            styles.textAreaBox,
            focused && styles.textAreaBoxFocused,
            !!rowProps.error && !focused && styles.textAreaBoxError,
          ]}
        >
          <TextInput
            style={styles.textArea}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={GRAY.MEDIUM_100}
            maxLength={maxLength}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...inputTintProps}
          />
          {footer ? <Text style={styles.textAreaFooter}>{footer}</Text> : null}
        </View>
      }
    >
      {showCounter && maxLength ? (
        <Text style={styles.counterText}>
          {value?.length ?? 0}/{maxLength}
        </Text>
      ) : null}
    </FormRow>
  );
};

/* ───────────────────────── Segmented control ───────────────────────── */

type FormSegmentedControlProps<T extends string> = {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};

export const FormSegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: FormSegmentedControlProps<T>) => (
  <View style={styles.segment}>
    {options.map((opt) => {
      const selected = opt.value === value;
      return (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[styles.segmentItem, selected && styles.segmentItemSelected]}
        >
          <Text
            style={[styles.segmentText, selected && styles.segmentTextSelected]}
          >
            {opt.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

/* ───────────────────────── Image thumbnails ───────────────────────── */

export type FormImagePreviewItem = {
  key: string;
  uri: string;
  onRemove: () => void;
};

export const FormImagePreviewList = ({
  items,
}: {
  items: FormImagePreviewItem[];
}) =>
  items.length > 0 ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.thumbList}
    >
      {items.map((item) => (
        <View key={item.key} style={styles.thumbItem}>
          <Image
            source={{ uri: item.uri }}
            style={styles.thumb}
            resizeMode="cover"
          />
          <Pressable
            onPress={item.onRemove}
            style={styles.thumbRemove}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={22}
              color={MAIN.DEFAULT}
            />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  ) : null;
