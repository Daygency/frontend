import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "./api";
import { fetchWithAuth } from "./fetchWithAuth";
import type { LocalImageAsset } from "./fileApi";

/** 모집공고·커뮤니티 multipart 최대 장수 */
export const MAX_MULTIPART_FILES = 5;

/**
 * README §1 — `payload`(JSON 문자열) + 동일 필드명 `files`로 여러 번 append
 * Content-Type 은 직접 넣지 않음 (boundary 자동)
 */
export function buildBoardMultipartForm(
  payload: Record<string, unknown>,
  files: LocalImageAsset[],
): FormData {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  const slice = files.slice(0, MAX_MULTIPART_FILES);
  slice.forEach((f, index) => {
    form.append(
      "files",
      {
        uri: f.uri,
        // expo-image-picker는 fileName을 종종 null로 주기 때문에, 고정 폴백("image.jpg")을 쓰면
        // 여러 장을 한 요청에 append할 때 파일명이 겹쳐 일부가 누락된다 (채팅 다중 전송에서 이미 겪은 문제).
        name: f.name ?? `image_${Date.now()}_${index + 1}.jpg`,
        type: f.type ?? "image/jpeg",
      } as unknown as Blob,
    );
  });
  return form;
}

async function getBearerOnlyHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return { Authorization: `Bearer ${token}` };
}

/**
 * README §1 — `POST` + multipart (이미지 포함 글 작성)
 */
export async function postBoardMultipart(
  path: string,
  payload: Record<string, unknown>,
  files: LocalImageAsset[],
): Promise<Response> {
  const headers = await getBearerOnlyHeaders();
  const body = buildBoardMultipartForm(payload, files);
  return fetchWithAuth(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body,
  });
}
