import { useState, useContext, createContext, useEffect } from "react";
import { getBrowserName } from "@clickpesa/components-library.shared.shared-functions";

interface ThemeContextProps {
  theme: "dark" | "light" | undefined;
  setTheme: (value: string) => void;
  darkPrimary: string;
  darkSecondary: string;
}

interface ThemeProviderProps {
  children: any;
}

export const ThemeContext = createContext<ThemeContextProps>(
  {} as ThemeContextProps
);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const auth: any = useThemeProvider();
  return <ThemeContext.Provider value={auth}>{children}</ThemeContext.Provider>;
}

const useThemeProvider = () => {
  const [theme, setTheme] = useState<string>("light");

  // default settings
  useEffect(() => {
    if (localStorage.getItem("mode")) {
      // @ts-ignore
      return setTheme(localStorage.getItem("mode"));
    }

    const userModePreferenceChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
      return localStorage.setItem("mode", event.matches ? "dark" : "light");
    };

    if (getBrowserName() !== "Safari")
      window
        ?.matchMedia("(prefers-color-scheme: dark)")
        ?.addEventListener("change", userModePreferenceChange);

    if (
      window?.matchMedia &&
      window?.matchMedia("(prefers-color-scheme: dark)")?.matches
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    if (getBrowserName() !== "Safari")
      return window
        ?.matchMedia("(prefers-color-scheme: dark)")
        ?.removeEventListener("change", userModePreferenceChange);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    darkPrimary: "#1E272E",
    darkSecondary: "#2B343B",
  };
};
