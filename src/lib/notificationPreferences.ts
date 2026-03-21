import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  smsOptOut: "@daygency/notif_sms_opt_out",
  emailOptOut: "@daygency/notif_email_opt_out",
} as const;

/** true = SMS 수신 중단(옵트아웃). 서버 연동 시 API와 동기화하면 됨. */
export async function getSmsOptOut(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.smsOptOut)) === "1";
}

export async function setSmsOptOut(optOut: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.smsOptOut, optOut ? "1" : "0");
}

/** true = 이메일 알림 중단 */
export async function getEmailOptOut(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.emailOptOut)) === "1";
}

export async function setEmailOptOut(optOut: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.emailOptOut, optOut ? "1" : "0");
}
