import { StyleSheet } from "react-native";
import { AppColorScheme, colorScheme } from "../color";

/**
 * StyleSheet.create 대체. factory 안에서 읽은 색상 토큰이 현재 컬러 스킴 기준으로
 * 다시 계산되도록, 스킴별로 스타일을 캐시하고 키 접근 시점에 현재 스킴의 스타일을 돌려준다.
 */
export const themedStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: () => T & StyleSheet.NamedStyles<any>,
): T => {
  const cache: Partial<Record<AppColorScheme, T>> = {};
  const current = (): T =>
    (cache[colorScheme] ??= StyleSheet.create(factory()) as T);
  const proxy = {} as T;
  for (const key of Object.keys(current())) {
    Object.defineProperty(proxy, key, {
      enumerable: true,
      get: () => current()[key as keyof T],
    });
  }
  return proxy;
};
