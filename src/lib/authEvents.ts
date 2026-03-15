/** 401(토큰 만료) 시 리프레시 실패 후 AuthContext에 알림 */
type Listener = () => void;
const listeners: Listener[] = [];

export function onAuthExpired(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function emitAuthExpired(): void {
  listeners.forEach((f) => f());
}
