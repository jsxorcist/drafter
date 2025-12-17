import { useState, useEffect } from "react";

const THEME_STORAGE_KEY = "drafter-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialIsDark = savedTheme === "dark";
    setIsDark(initialIsDark);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", initialIsDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", newIsDark ? "dark" : "light");

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, newIsDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={{
        padding: "var(--spacing-sm)",
        backgroundColor: "var(--color-surface)",
        border: `1px solid var(--color-border)`,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        fontSize: "var(--font-size-base)",
        color: "var(--color-text-primary)",
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        transition: "var(--transition-base)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-surface)";
      }}
      title={`Переключить на ${isDark ? "светлую" : "темную"} тему`}
      aria-label={`Переключить на ${isDark ? "светлую" : "темную"} тему`}
    >
      <span style={{ fontSize: "1.2em" }}>{isDark ? "🌞" : "🌙"}</span>
      <span>{isDark ? "Светлая" : "Темная"}</span>
    </button>
  );
}
