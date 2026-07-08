import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "./api";
import type { ApiFile, FileTargetType } from "./files/types";
import { parseApiFile, parseApiFileList } from "./files/parseApiFile";

export type UploadFileOptions = {
  name?: string;
  type?: string;
  /**
   * 게시글 저장 후 해당 글 id로 S3+DB에 묶을 때 (README 권장 흐름)
   * 생략 시 단독 업로드(대표 썸네일용 fileId 확보 등)
   */
  targetType?: FileTargetType;
  targetId?: string;
  /** 같은 글 안 순서 (0부터). targetType+targetId 있을 때 의미 있음 */
  sortOrder?: number;
};

/**
 * 파일 1건 업로드 — `POST /files` (multipart)
 * 응답: ApiFile 형태 또는 `{ fileId }` 최소 형태 모두 처리
 */
export async function uploadFile(
  uri: string,
  options?: UploadFileOptions,
): Promise<ApiFile | null> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: options?.name ?? "image.jpg",
      type: options?.type ?? "image/jpeg",
    } as unknown as Blob);

    if (options?.targetType) {
      formData.append("targetType", options.targetType);
    }
    if (options?.targetId?.trim()) {
      formData.append("targetId", options.targetId.trim());
    }
    if (options?.sortOrder != null) {
      formData.append("sortOrder", String(options.sortOrder));
    }

    const headers: HeadersInit = {};
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/files`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (!data) return null;

    if (Array.isArray(data)) {
      const list = parseApiFileList(data);
      return list[0] ?? null;
    }

    const parsed = parseApiFile(data);
    if (parsed) return parsed;

    const fileId =
      typeof (data as { fileId?: string }).fileId === "string"
        ? (data as { fileId: string }).fileId
        : typeof (data as { id?: string }).id === "string"
          ? (data as { id: string }).id
          : null;
    if (!fileId) return null;

    return {
      fileId,
      imgUrl: String((data as { imgUrl?: string }).imgUrl ?? ""),
      originalName: options?.name ?? "",
      sortOrder: options?.sortOrder ?? 0,
      storedName: "",
      extention: "",
      targetType: options?.targetType ?? null,
      targetId: options?.targetId?.trim() ?? null,
      createdAt: "",
    };
  } catch (e) {
    console.warn("[uploadFile] 에러:", e);
    return null;
  }
}

/** 하위 호환: fileId 문자열만 필요할 때 */
export function getFileId(file: ApiFile | null): string | null {
  return file?.fileId?.trim() ? file.fileId.trim() : null;
}

export type LocalImageAsset = {
  uri: string;
  name?: string;
  type?: string;
};

/**
 * `POST /files`에 targetType, targetId, sortOrder를 붙여 반복 호출.
 * 게시글 작성은 README 기준 `POST /{board}` multipart(`payload`+`files`)를 사용하는 것이 원칙이며,
 * 이 함수는 기타 첨부·레거시 흐름용으로 남겨 둡니다.
 */
export async function attachFilesToPost(
  targetType: FileTargetType,
  targetId: string,
  items: LocalImageAsset[],
  startSortOrder = 0,
): Promise<ApiFile[]> {
  const id = targetId?.trim();
  if (!id || items.length === 0) return [];

  const out: ApiFile[] = [];
  for (let i = 0; i < items.length; i++) {
    const asset = items[i];
    const uploaded = await uploadFile(asset.uri, {
      name: asset.name,
      type: asset.type,
      targetType,
      targetId: id,
      sortOrder: startSortOrder + i,
    });
    if (uploaded) out.push(uploaded);
  }
  return out;
}
