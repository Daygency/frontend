import { useCallback, type ComponentType } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

export function useRequireLogin() {
  const { isLoggedIn, requireLogin } = useAuth();

  const ensureLoggedIn = useCallback(() => {
    if (isLoggedIn) return true;
    requireLogin();
    return false;
  }, [isLoggedIn, requireLogin]);

  return { isLoggedIn, ensureLoggedIn, requireLogin };
}

/** 로그인 필수 화면 — 비로그인(둘러보기) 시 로그인 화면으로 전환 */
export function useAuthGate() {
  const { isLoggedIn, requireLogin } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) requireLogin();
    }, [isLoggedIn, requireLogin]),
  );
}

export function withAuthGate<P extends object>(
  Wrapped: ComponentType<P>,
): ComponentType<P> {
  const Component = (props: P) => {
    useAuthGate();
    return <Wrapped {...props} />;
  };
  Component.displayName = `WithAuthGate(${Wrapped.displayName ?? Wrapped.name ?? "Component"})`;
  return Component;
}
