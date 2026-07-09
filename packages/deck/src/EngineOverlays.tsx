/**
 * EngineOverlays — the presenter-grade overlays for SlideEngine, toggled by keys:
 *  O = overview (jump to any slide by title), ? = keyboard help, P = presenter
 *  view (current + next slide title, speaker notes, running timer). Esc closes.
 */
import { useEffect, useState } from "react";

type Which = "overview" | "help" | "presenter" | null;

// Note: no "C — Cursor / laser" row — the engine binds no such key
// (CursorLayer is a kit concern and lives outside this package).
const SHORTCUTS: [string, string][] = [
  ["→ / Space", "Next step / slide"],
  ["←", "Previous"],
  ["O", "Overview — jump to any slide"],
  ["P", "Presenter view (notes + timer)"],
  ["N", "Chapter navigation"],
  ["T", "Theme picker"],
  ["F", "Fullscreen"],
  ["?", "This help"],
  ["Esc", "Close overlays"],
];

function Timer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setS((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <span className="pv__timer">
      {mm}:{ss}
    </span>
  );
}

export function EngineOverlays({
  open,
  onClose,
  titles,
  notes,
  current,
  total,
  goTo,
}: {
  open: Which;
  onClose: () => void;
  titles: string[];
  notes: string[];
  current: number;
  total: number;
  goTo: (i: number) => void;
}) {
  if (!open) return null;

  if (open === "help") {
    return (
      <div className="eng-overlay" onClick={onClose}>
        <div
          className="eng-panel eng-panel--help"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="eng-panel__title">Keyboard shortcuts</h3>
          <dl className="help-list">
            {SHORTCUTS.map(([k, d]) => (
              <div key={k} className="help-row">
                <dt>
                  <kbd>{k}</kbd>
                </dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }

  if (open === "presenter") {
    const nextTitle = current + 1 < total ? titles[current + 1] : "— end —";
    return (
      <div className="eng-overlay" onClick={onClose}>
        <div
          className="eng-panel eng-panel--pv"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pv__head">
            <span className="pv__now">
              {current + 1} / {total} · {titles[current] || "Slide"}
            </span>
            <Timer />
          </div>
          <div className="pv__next">Next → {nextTitle}</div>
          <div className="pv__notes">
            {notes[current] ? (
              notes[current]
            ) : (
              <span className="pv__nonotes">No notes for this slide.</span>
            )}
          </div>
          <div className="pv__hint">P or Esc to close</div>
        </div>
      </div>
    );
  }

  // overview
  return (
    <div className="eng-overlay" onClick={onClose}>
      <div
        className="eng-panel eng-panel--ov"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="eng-panel__title">Overview — {total} slides</h3>
        <div className="ov-grid">
          {titles.map((t, i) => (
            <button
              key={i}
              type="button"
              className={`ov-cell${i === current ? " is-current" : ""}`}
              onClick={() => {
                goTo(i);
                onClose();
              }}
            >
              <span className="ov-cell__n">{i + 1}</span>
              <span className="ov-cell__t">{t || "Slide"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
