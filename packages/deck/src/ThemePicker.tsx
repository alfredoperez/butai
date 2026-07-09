/**
 * ThemePicker — small in-deck panel (toggled with T) that lists themes and
 * applies one by setting `data-theme` on <html> — the documented contract with
 * the theme CSS (each theme file is scoped to `[data-theme="<id>"]`).
 *
 * The list defaults to the `THEMES` manifest from `@butai/themes`; consumers
 * can pass their own subset/ordering via the `themes` prop.
 */
import { useState, useEffect, useRef } from "react";
import { THEMES, type ThemeManifestEntry } from "@butai/themes";

export interface ThemePickerProps {
  onClose: () => void;
  /** themes to list; defaults to the full @butai/themes manifest */
  themes?: ThemeManifestEntry[];
  /** notified after a theme is applied (data-theme is already set) */
  onThemeChange?: (id: string) => void;
}

export function ThemePicker({
  onClose,
  themes = THEMES,
  onThemeChange,
}: ThemePickerProps) {
  const [active, setActive] = useState<string>(
    document.documentElement.dataset.theme ?? "dark",
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleMouse);
    return () => document.removeEventListener("mousedown", handleMouse);
  }, [onClose]);

  function select(id: string) {
    document.documentElement.dataset.theme = id;
    setActive(id);
    onThemeChange?.(id);
  }

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 60,
        right: 32,
        zIndex: 100,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "16px 12px",
        minWidth: 180,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "var(--text-dim)",
          marginBottom: 10,
          paddingLeft: 8,
        }}
      >
        Theme
      </div>
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => select(theme.id)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            background:
              active === theme.id ? "var(--accent-glow)" : "transparent",
            border: "none",
            borderRadius: 6,
            padding: "7px 8px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: active === theme.id ? 600 : 400,
            color: active === theme.id ? "var(--accent)" : "var(--text)",
            fontFamily: "inherit",
          }}
        >
          {active === theme.id ? "● " : "○ "}
          {theme.id}
        </button>
      ))}
      <div
        style={{
          marginTop: 10,
          borderTop: "1px solid var(--border)",
          paddingTop: 10,
          fontSize: 11,
          color: "var(--text-dim)",
          paddingLeft: 8,
        }}
      >
        <kbd
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "2px 6px",
            fontFamily: "inherit",
            fontSize: 10,
          }}
        >
          T
        </kbd>
        {" · "}
        <kbd
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "2px 6px",
            fontFamily: "inherit",
            fontSize: 10,
          }}
        >
          Esc
        </kbd>
        {" to close"}
      </div>
    </div>
  );
}
