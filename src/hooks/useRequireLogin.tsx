import { useCallback, type ComponentType } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { resetNavigationToBrowseHome } from "../lib/navigation/resetToBrowseHome";

export function useRequireLogin() {
  const { isLoggedIn, requireLogin } = useAuth();

  const ensureLoggedIn = useCallback(() => {
    if (isLoggedIn) return true;
    requireLogin();
    return false;
  }, [isLoggedIn, requireLogin]);

  return { isLoggedIn, ensureLoggedIn, requireLogin };
}

/** 로그인 필수 화면 — 비로그인 시 로그인 화면 또는 홈(둘러보기)으로 전환 */
export function useAuthGate() {
  const { isLoggedIn, requireLogin, isBrowsing } = useAuth();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) return;
      if (isBrowsing) {
        resetNavigationToBrowseHome(navigation);
        return;
      }
      requireLogin();
    }, [isLoggedIn, isBrowsing, requireLogin, navigation]),
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
