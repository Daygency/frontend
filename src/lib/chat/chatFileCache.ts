import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Linking } from "react-native";
import { API_BASE, AUTH_TOKEN_KEY } from "../apis/api";
import { resolveProfileImageUrlForDisplay } from "./resolveProfileImageUrl";

export type ChatCachedFile = {
  id: string;
  fileName: string;
  fileMime?: string | null;
  sourceUrl: string;
  localUri: string;
  size: number;
  createdAt: string;
  accessedAt: string;
};

const ARCHIVE_DIR = `${FileSystem.documentDirectory ?? ""}daygency_chat_files/`;
const MANIFEST_URI = `${ARCHIVE_DIR}manifest.json`;

type ExpoSharingModule = {
  isAvailableAsync: () => Promise<boolean>;
  shareAsync: (
    url: string,
    options?: { dialogTitle?: string; mimeType?: string },
  ) => Promise<void>;
};

function getSharingModule(): ExpoSharingModule | null {
  try {
    // Some dev-client builds do not include ExpoSharing yet. Load lazily so the
    // app can still start and fall back to remote URL opening.
    return require("expo-sharing") as ExpoSharingModule;
  } catch {
    return null;
  }
}

function getWritableDirectory() {
  if (!FileSystem.documentDirectory) {
    throw new Error("document directory unavailable");
  }
  return ARCHIVE_DIR;
}

async function ensureArchiveDirectory() {
  const dir = getWritableDirectory();
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

function normalizeFileName(value: string) {
  return typeof value.normalize === "function" ? value.normalize("NFC") : value;
}

function sanitizeFileName(value: string) {
  const normalized = normalizeFileName(value.trim() || "file");
  return normalized.replace(/[\\/:*?"<>|]/g, "_").slice(0, 120) || "file";
}

function fileNameFromUrl(value: string) {
  const withoutQuery = value.split("?")[0]?.split("#")[0] ?? value;
  const lastSegment = withoutQuery.split("/").filter(Boolean).pop() ?? "file";
  try {
    return decodeURIComponent(lastSegment);
  } catch {
    return lastSegment;
  }
}

function hashString(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

async function readManifest(): Promise<ChatCachedFile[]> {
  await ensureArchiveDirectory();
  const info = await FileSystem.getInfoAsync(MANIFEST_URI);
  if (!info.exists) return [];
  try {
    const raw = await FileSystem.readAsStringAsync(MANIFEST_URI);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatCachedFile[]) : [];
  } catch {
    return [];
  }
}

async function writeManifest(items: ChatCachedFile[]) {
  await ensureArchiveDirectory();
  await FileSystem.writeAsStringAsync(MANIFEST_URI, JSON.stringify(items));
}

async function buildDownloadHeaders(url: string): Promise<Record<string, string>> {
  if (!url.startsWith(API_BASE)) return {};
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getChatCachedFiles(): Promise<ChatCachedFile[]> {
  const manifest = await readManifest();
  const existing: ChatCachedFile[] = [];

  for (const item of manifest) {
    const info = await FileSystem.getInfoAsync(item.localUri);
    if (info.exists) {
      existing.push({
        ...item,
        size: info.size ?? item.size ?? 0,
      });
    }
  }

  if (existing.length !== manifest.length) {
    await writeManifest(existing);
  }

  return existing.sort(
    (a, b) =>
      new Date(b.accessedAt).getTime() - new Date(a.accessedAt).getTime(),
  );
}

export async function cacheChatFile(input: {
  url: string;
  fileName?: string | null;
  fileMime?: string | null;
}): Promise<ChatCachedFile> {
  await ensureArchiveDirectory();
  const sourceUrl = resolveProfileImageUrlForDisplay(input.url) ?? input.url;
  const id = hashString(sourceUrl);
  const now = new Date().toISOString();
  const manifest = await readManifest();
  const existing = manifest.find((item) => item.id === id);

  if (existing) {
    const info = await FileSystem.getInfoAsync(existing.localUri);
    if (info.exists) {
      const updated = {
        ...existing,
        fileName: sanitizeFileName(input.fileName ?? existing.fileName),
        fileMime: input.fileMime ?? existing.fileMime,
        size: info.size ?? existing.size ?? 0,
        accessedAt: now,
      };
      await writeManifest(
        manifest.map((item) => (item.id === id ? updated : item)),
      );
      return updated;
    }
    await writeManifest(manifest.filter((item) => item.id !== id));
  }

  const safeName = sanitizeFileName(input.fileName ?? fileNameFromUrl(sourceUrl));
  const localUri = `${ARCHIVE_DIR}${id}_${safeName}`;
  const headers = await buildDownloadHeaders(sourceUrl);
  const result = await FileSystem.downloadAsync(sourceUrl, localUri, { headers });
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`download failed: ${result.status}`);
  }
  const info = await FileSystem.getInfoAsync(result.uri);
  if (!info.exists) {
    throw new Error("downloaded file missing");
  }

  const item: ChatCachedFile = {
    id,
    fileName: safeName,
    fileMime: input.fileMime,
    sourceUrl,
    localUri: result.uri,
    size: info.size ?? 0,
    createdAt: now,
    accessedAt: now,
  };

  await writeManifest([item, ...manifest.filter((row) => row.id !== id)]);
  return item;
}

export async function deleteChatCachedFile(id: string): Promise<void> {
  const manifest = await readManifest();
  const item = manifest.find((row) => row.id === id);
  if (item) {
    await FileSystem.deleteAsync(item.localUri, { idempotent: true });
  }
  await writeManifest(manifest.filter((row) => row.id !== id));
}

export async function clearChatCachedFiles(): Promise<void> {
  const manifest = await readManifest();
  await Promise.all(
    manifest.map((item) =>
      FileSystem.deleteAsync(item.localUri, { idempotent: true }),
    ),
  );
  await writeManifest([]);
}

export async function openChatCachedFile(item: {
  localUri: string;
  sourceUrl?: string | null;
  fileName?: string | null;
  fileMime?: string | null;
}): Promise<void> {
  const Sharing = getSharingModule();
  if (Sharing) {
    const available = await Sharing.isAvailableAsync();
    if (available) {
      await Sharing.shareAsync(item.localUri, {
        dialogTitle: item.fileName ?? "파일 열기",
        mimeType: item.fileMime ?? undefined,
      });
      return;
    }
  }

  await Linking.openURL(item.sourceUrl ?? item.localUri);
}
