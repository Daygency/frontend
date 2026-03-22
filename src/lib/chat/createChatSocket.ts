import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, type Socket } from "socket.io-client";
import { API_BASE, AUTH_TOKEN_KEY } from "../apis/api";

/**
 * README: namespace `/chat`, `auth: { token }`
 */
export async function createChatSocket(): Promise<Socket | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  return io(`${API_BASE}/chat`, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });
}
