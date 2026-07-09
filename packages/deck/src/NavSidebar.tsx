import type { ChapterInfo } from "./useSlides.js";

interface NavSidebarProps {
  title: string;
  chapters: ChapterInfo[];
  currentChapter: string;
  open: boolean;
  onChapterClick: (firstSlide: number) => void;
}

export function NavSidebar({
  title,
  chapters,
  currentChapter,
  open,
  onChapterClick,
}: NavSidebarProps) {
  return (
    <nav className={`nav${open ? "" : " collapsed"}`}>
      <div className="nav-title">{title}</div>
      <div className="nav-chapters">
        {chapters.map((ch, i) => (
          <div
            key={ch.name}
            className={`nav-chapter${currentChapter === ch.name ? " active" : ""}`}
            onClick={() => onChapterClick(ch.firstSlide)}
          >
            <span className="ch-num">{String(i + 1).padStart(2, "0")}</span>
            {ch.name}
          </div>
        ))}
      </div>
      <div className="nav-keys">
        <kbd>&larr;</kbd> <kbd>&rarr;</kbd> Navigate
        <br />
        <kbd>N</kbd> Toggle nav &middot; <kbd>F</kbd> Fullscreen
      </div>
    </nav>
  );
}
