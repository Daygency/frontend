import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, AppState } from "react-native";
import {
  AppColorScheme,
  applyColorScheme,
  colorScheme as initialScheme,
  toColorScheme,
} from "../color";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "themePreference";

type ThemeContextValue = {
  scheme: AppColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  scheme: initialScheme,
  preference: "system",
  setPreference: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [scheme, setScheme] = useState<AppColorScheme>(initialScheme);
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  const sync = useCallback(() => {
    const next = toColorScheme(Appearance.getColorScheme());
    applyColorScheme(next);
    setScheme(next);
  }, []);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark") {
        setPreferenceState(saved);
        Appearance.setColorScheme(saved);
        sync();
      }
    });
  }, [sync]);

  useEffect(() => {
    // iOS는 백그라운드에서 스냅샷용으로 라이트/다크를 번갈아 알리므로 활성 상태일 때만 반영
    const appearanceSub = Appearance.addChangeListener(() => {
      if (AppState.currentState === "active") sync();
    });
    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });
    return () => {
      appearanceSub.remove();
      appStateSub.remove();
    };
  }, [sync]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      Appearance.setColorScheme(next === "system" ? null : next);
      void AsyncStorage.setItem(STORAGE_KEY, next);
      sync();
    },
    [sync],
  );

  const value = useMemo(
    () => ({ scheme, preference, setPreference }),
    [scheme, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
