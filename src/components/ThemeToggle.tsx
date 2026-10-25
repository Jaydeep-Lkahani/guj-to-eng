import { Moon, Sun } from "@phosphor-icons/react";
import { setTheme, useTheme } from "../theme";

export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-pressed={dark}
      aria-label="ડાર્ક મોડ"
      title={dark ? "લાઇટ મોડ કરો" : "ડાર્ક મોડ કરો"}
      onClick={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setTheme(dark ? "light" : "dark", { x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }}
    >
      <Sun className="theme-icon theme-sun" weight="duotone" aria-hidden="true" />
      <Moon className="theme-icon theme-moon" weight="duotone" aria-hidden="true" />
    </button>
  );
}
