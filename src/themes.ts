export interface Theme {
  name: string;
  id: string;
  colors: {
    background: string;
    gameBackground: string;
    panelBackground: string;
    text: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    block: string;
  };
  fonts: {
    primary: string;
    monospace: string;
    headingWeight: number;
    bodyWeight: number;
    headingSize: string;
    bodySize: string;
  };
}

export const themes: Theme[] = [
  {
    name: "Dark",
    id: "dark",
    colors: {
      background: "#242424",
      gameBackground: "#1e1e1e",
      panelBackground: "#2e2e2e",
      text: "rgba(255, 255, 255, 0.87)",
      textMuted: "rgba(255, 255, 255, 0.5)",
      accent: "#646cff",
      accentHover: "#535bf2",
      block: "#ffffff",
    },
    fonts: {
      primary: "'Space Grotesk', sans-serif",
      monospace: "'Courier New', Courier, monospace",
      headingWeight: 600,
      bodyWeight: 400,
      headingSize: "2rem",
      bodySize: "1rem",
    },
  },
  {
    name: "Ocean",
    id: "ocean",
    colors: {
      background: "#0f1729",
      gameBackground: "#0a1120",
      panelBackground: "#162032",
      text: "#e0f2fe",
      textMuted: "rgba(224, 242, 254, 0.6)",
      accent: "#38bdf8",
      accentHover: "#0ea5e9",
      block: "#22d3ee",
    },
    fonts: {
      primary: "'Space Grotesk', sans-serif",
      monospace: "'Courier New', Courier, monospace",
      headingWeight: 600,
      bodyWeight: 400,
      headingSize: "2rem",
      bodySize: "1rem",
    },
  },
  {
    name: "Electronika",
    id: "electronika",
    colors: {
      background: "#020402", // Deep CRT black-green
      gameBackground: "#050805", // Slightly lighter green tint
      panelBackground: "#0a140a", // Dark phosphor panel
      text: "#39ff14", // Bright phosphor green
      textMuted: "#1b5e20", // Dim green (old terminal feel)
      accent: "#39ff14", // Same green (no modern blue!)
      accentHover: "#66ff66", // Slight glow boost
      block: "#39ff14", // Blocks are terminal green
    },
    fonts: {
      primary: "'VT323', monospace", // Best Google-font terminal vibe
      monospace: "'VT323', monospace",
      headingWeight: 400,
      bodyWeight: 400,
      headingSize: "2rem",
      bodySize: "1.1rem",
    },
  },
];

const THEME_STORAGE_KEY = "ascii-tetris-theme";

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  root.style.setProperty("--color-background", theme.colors.background);
  root.style.setProperty(
    "--color-game-background",
    theme.colors.gameBackground,
  );
  root.style.setProperty(
    "--color-panel-background",
    theme.colors.panelBackground,
  );
  root.style.setProperty("--color-text", theme.colors.text);
  root.style.setProperty("--color-text-muted", theme.colors.textMuted);
  root.style.setProperty("--color-accent", theme.colors.accent);
  root.style.setProperty("--color-accent-hover", theme.colors.accentHover);
  root.style.setProperty("--color-block", theme.colors.block);

  // Font properties
  root.style.setProperty("--font-primary", theme.fonts.primary);
  root.style.setProperty("--font-monospace", theme.fonts.monospace);
  root.style.setProperty(
    "--font-heading-weight",
    theme.fonts.headingWeight.toString(),
  );
  root.style.setProperty(
    "--font-body-weight",
    theme.fonts.bodyWeight.toString(),
  );
  root.style.setProperty("--font-heading-size", theme.fonts.headingSize);
  root.style.setProperty("--font-body-size", theme.fonts.bodySize);

  // Save theme preference
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
}

export function getThemeById(id: string): Theme | undefined {
  return themes.find((theme) => theme.id === id);
}

export function getSavedTheme(): Theme {
  const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedThemeId) {
    const theme = getThemeById(savedThemeId);
    if (theme) return theme;
  }
  return themes[0]; // Default to dark theme
}

export function initializeTheme(): void {
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);
}
