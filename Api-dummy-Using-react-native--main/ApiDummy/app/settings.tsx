import React from "react";
import { useState } from "react";

type Theme = "light" | "dark";
type FontSize = "sm" | "md" | "lg" | "xl";
type ContrastMode = "normal" | "high";

interface Settings {
  theme: Theme;
  fontSize: FontSize;
  contrastMode: ContrastMode;
  reduceMotion: boolean;
  screenReader: boolean;
  focusIndicators: boolean;
  language: string;
  notifications: boolean;
  adaptiveControls: boolean;
}

const defaultSettings: Settings = {
  theme: "light",
  fontSize: "md",
  contrastMode: "normal",
  reduceMotion: false,
  screenReader: false,
  focusIndicators: true,
  language: "en",
  notifications: true,
  adaptiveControls: true,
};

const ORANGE = "#F97316";
const ORANGE_DARK = "#EA6A0A";
const ORANGE_LIGHT = "#FED7AA";

export default function SettingsMenu() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<"general" | "accessibility">("general");
  const [saved, setSaved] = useState(false);

  const isDark = settings.theme === "dark";

  const colors = {
    bg: isDark ? "#0F0F0F" : "#FAF8F5",
    surface: isDark ? "#1A1A1A" : "#FFFFFF",
    surfaceAlt: isDark ? "#242424" : "#F5F0EA",
    border: isDark ? "#2E2E2E" : "#E8E0D4",
    text: isDark ? "#F5F0EA" : "#1A1007",
    textMuted: isDark ? "#8A8070" : "#9A8A70",
    accent: ORANGE,
    accentHover: ORANGE_DARK,
    accentLight: isDark ? "#431A00" : ORANGE_LIGHT,
  };

  const set = <K extends keyof Settings>(key: K, val: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => setSettings(defaultSettings);

  const fontSizeMap: Record<FontSize, string> = { sm: "13px", md: "15px", lg: "17px", xl: "20px" };
  const fontSizeLabel: Record<FontSize, string> = { sm: "Small", md: "Medium", lg: "Large", xl: "X-Large" };

  const styles: Record<string, React.CSSProperties> = {
    root: {
      minHeight: "100vh",
      background: colors.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: fontSizeMap[settings.fontSize],
      transition: "background 0.3s ease",
      padding: "24px 16px",
    },
    panel: {
      background: colors.surface,
      border: `1.5px solid ${colors.border}`,
      borderRadius: "20px",
      width: "100%",
      maxWidth: "520px",
      boxShadow: isDark
        ? "0 24px 60px rgba(0,0,0,0.6)"
        : "0 24px 60px rgba(200,160,80,0.12)",
      overflow: "hidden",
    },
    header: {
      padding: "28px 32px 0",
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: "0",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    title: {
      fontSize: "1.5em",
      fontWeight: "700",
      color: colors.text,
      letterSpacing: "-0.02em",
      margin: 0,
    },
    gear: {
      fontSize: "1.3em",
      color: colors.accent,
    },
    tabs: {
      display: "flex",
      gap: "4px",
    },
    body: {
      padding: "28px 32px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    sectionLabel: {
      fontSize: "0.72em",
      fontWeight: "700",
      color: colors.accent,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
    },
    card: {
      background: colors.surfaceAlt,
      borderRadius: "12px",
      border: `1px solid ${colors.border}`,
      overflow: "hidden",
    },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      borderBottom: `1px solid ${colors.border}`,
    },
    rowLast: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
    },
    rowLabel: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    rowTitle: {
      color: colors.text,
      fontWeight: "600",
      fontSize: "0.92em",
    },
    rowDesc: {
      color: colors.textMuted,
      fontSize: "0.76em",
    },
    themeToggle: {
      display: "flex",
      gap: "6px",
    },
    fontRow: {
      display: "flex",
      gap: "6px",
    },
    contrastRow: {
      display: "flex",
      gap: "6px",
    },
    select: {
      background: colors.surfaceAlt,
      border: `1.5px solid ${colors.border}`,
      color: colors.text,
      borderRadius: "8px",
      padding: "6px 10px",
      fontFamily: "inherit",
      fontSize: "0.85em",
      cursor: "pointer",
      outline: "none",
    },
    footer: {
      padding: "0 32px 28px",
      display: "flex",
      gap: "10px",
    },
    saveBtn: {
      flex: 1,
      padding: "13px",
      background: saved ? "#16A34A" : colors.accent,
      border: "none",
      borderRadius: "12px",
      color: "#fff",
      fontFamily: "inherit",
      fontSize: "0.92em",
      fontWeight: "700",
      cursor: "pointer",
      letterSpacing: "0.02em",
      transition: "background 0.25s ease",
    },
    resetBtn: {
      padding: "13px 18px",
      background: "transparent",
      border: `1.5px solid ${colors.border}`,
      borderRadius: "12px",
      color: colors.textMuted,
      fontFamily: "inherit",
      fontSize: "0.85em",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  };

  const dynStyles = {
    tab: (active: boolean): React.CSSProperties => ({
      padding: "10px 20px",
      border: "none",
      background: active ? colors.accent : "transparent",
      color: active ? "#fff" : colors.textMuted,
      borderRadius: "10px 10px 0 0",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "0.88em",
      fontWeight: active ? "700" : "500",
      letterSpacing: "0.01em",
      transition: "all 0.2s ease",
    }),
    toggleTrack: (on: boolean): React.CSSProperties => ({
      width: "42px",
      height: "24px",
      borderRadius: "12px",
      background: on ? colors.accent : (isDark ? "#3A3530" : "#D4C8B8"),
      position: "relative",
      cursor: "pointer",
      transition: "background 0.25s ease",
      border: "none",
      flexShrink: 0,
    }),
    toggleThumb: (on: boolean): React.CSSProperties => ({
      position: "absolute",
      top: "3px",
      left: on ? "21px" : "3px",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#fff",
      transition: "left 0.25s ease",
      boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    }),
    themeBtn: (active: boolean): React.CSSProperties => ({
      padding: "6px 14px",
      border: `1.5px solid ${active ? colors.accent : colors.border}`,
      background: active ? colors.accentLight : "transparent",
      color: active ? (isDark ? colors.accent : ORANGE_DARK) : colors.textMuted,
      borderRadius: "8px",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "0.82em",
      fontWeight: active ? "700" : "500",
      transition: "all 0.2s ease",
    }),
    fontBtn: (active: boolean): React.CSSProperties => ({
      flex: 1,
      padding: "7px 4px",
      border: `1.5px solid ${active ? colors.accent : colors.border}`,
      background: active ? colors.accentLight : "transparent",
      color: active ? (isDark ? colors.accent : ORANGE_DARK) : colors.textMuted,
      borderRadius: "8px",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "0.8em",
      fontWeight: active ? "700" : "500",
      transition: "all 0.2s ease",
      textAlign: "center" as const,
    }),
    contrastBtn: (active: boolean): React.CSSProperties => ({
      flex: 1,
      padding: "7px 4px",
      border: `1.5px solid ${active ? colors.accent : colors.border}`,
      background: active ? colors.accentLight : "transparent",
      color: active ? (isDark ? colors.accent : ORANGE_DARK) : colors.textMuted,
      borderRadius: "8px",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "0.82em",
      fontWeight: active ? "700" : "500",
      transition: "all 0.2s ease",
      textAlign: "center" as const,
    }),
  };

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      style={dynStyles.toggleTrack(on)}
    >
      <span style={dynStyles.toggleThumb(on)} />
    </button>
  );

  return (
    <div style={styles.root}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>Settings</h1>
          </div>
          <div style={styles.tabs}>
            {(["general", "accessibility"] as const).map((tab) => (
              <button
                key={tab}
                style={dynStyles.tab(activeTab === tab)}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "general" ? "General" : "Accessibility"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {activeTab === "general" && (
            <>
              <div style={styles.section}>
                <span style={styles.sectionLabel}>Appearance</span>
                <div style={styles.card}>
                  <div style={styles.row}>
                    <div style={styles.rowLabel}>
                      <span style={styles.rowTitle}>Theme</span>
                      <span style={styles.rowDesc}>Choose your preferred colour scheme</span>
                    </div>
                    <div style={styles.themeToggle}>
                      {(["light", "dark"] as Theme[]).map((t) => (
                        <button
                          key={t}
                          style={dynStyles.themeBtn(settings.theme === t)}
                          onClick={() => set("theme", t)}
                        >
                          {t === "light" ? "Light" : "Dark"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={styles.rowLast}>
                    <div style={styles.rowLabel}>
                      <span style={styles.rowTitle}>Language</span>
                      <span style={styles.rowDesc}>Select display language</span>
                    </div>
                    <select
                      style={styles.select}
                      value={settings.language}
                      onChange={(e) => set("language", e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <span style={styles.sectionLabel}>Preferences</span>
                <div style={styles.card}>
                  {[
                    { key: "notifications" as const, title: "Notifications", desc: "Receive app notifications" },
                    { key: "adaptiveControls" as const, title: "Adaptive Equipment Mode", desc: "Optimise for paddle grips, outriggers & adaptive kayak gear" },
                  ].map(({ key, title, desc }, i, arr) => (
                    <div key={key} style={i < arr.length - 1 ? styles.row : styles.rowLast}>
                      <div style={styles.rowLabel}>
                        <span style={styles.rowTitle}>{title}</span>
                        <span style={styles.rowDesc}>{desc}</span>
                      </div>
                      <Toggle on={settings[key] as boolean} onChange={() => set(key, !settings[key])} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "accessibility" && (
            <>
              <div style={styles.section}>
                <span style={styles.sectionLabel}>Vision</span>
                <div style={styles.card}>
                  <div style={styles.row}>
                    <div style={styles.rowLabel}>
                      <span style={styles.rowTitle}>Text Size</span>
                      <span style={styles.rowDesc}>Adjust interface font size</span>
                    </div>
                    <div style={styles.fontRow}>
                      {(["sm", "md", "lg", "xl"] as FontSize[]).map((s) => (
                        <button
                          key={s}
                          style={dynStyles.fontBtn(settings.fontSize === s)}
                          onClick={() => set("fontSize", s)}
                          title={fontSizeLabel[s]}
                        >
                          {fontSizeLabel[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={styles.rowLast}>
                    <div style={styles.rowLabel}>
                      <span style={styles.rowTitle}>Contrast</span>
                      <span style={styles.rowDesc}>Increase colour contrast for readability</span>
                    </div>
                    <div style={styles.contrastRow}>
                      {(["normal", "high"] as ContrastMode[]).map((c) => (
                        <button
                          key={c}
                          style={dynStyles.contrastBtn(settings.contrastMode === c)}
                          onClick={() => set("contrastMode", c)}
                        >
                          {c === "normal" ? "Normal" : "High"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <span style={styles.sectionLabel}>Motor & Cognitive</span>
                <div style={styles.card}>
                  {[
                    { key: "reduceMotion" as const, title: "Reduce Motion", desc: "Minimise animations and transitions" },
                    { key: "focusIndicators" as const, title: "Focus Indicators", desc: "Show visible keyboard focus rings" },
                    { key: "screenReader" as const, title: "Screen Reader Mode", desc: "Optimise layout for assistive technology" },
                  ].map(({ key, title, desc }, i, arr) => (
                    <div key={key} style={i < arr.length - 1 ? styles.row : styles.rowLast}>
                      <div style={styles.rowLabel}>
                        <span style={styles.rowTitle}>{title}</span>
                        <span style={styles.rowDesc}>{desc}</span>
                      </div>
                      <Toggle on={settings[key] as boolean} onChange={() => set(key, !settings[key])} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.saveBtn} onClick={handleSave}>
            {saved ? "Saved!" : "Save Changes"}
          </button>
          <button style={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}