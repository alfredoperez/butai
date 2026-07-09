/**
 * Butai demo site — a read-only "play with butai" surface (no authoring, no persistence).
 * A persistent left nav + four explore routes:
 *   /        → redirect to /theme
 *   /theme   → Theme explorer (edit tokens, preview across the 13 themes)
 *   /slides  → Slide-kit browser (+ the `butai add` copy command)
 *   /video   → Scene-kit contact sheet
 *   /docs    → Docs-kit pattern gallery
 * Content authoring (outline/storyboard) lives in Command Center, not here.
 */
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { Palette, LayoutTemplate, Clapperboard, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ThemeStudio } from '@/theme-studio';
import { SlideStudio } from '@/slide-studio';
import { VideoStudio } from '@/video-studio';
import { DocsStudio } from '@/docs-studio';

const NAV = [
  { to: '/theme', label: 'Theme', Icon: Palette },
  { to: '/slides', label: 'Slides', Icon: LayoutTemplate },
  { to: '/video', label: 'Video', Icon: Clapperboard },
  { to: '/docs', label: 'Docs', Icon: FileText },
] as const;

function LeftNav() {
  return (
    <nav
      aria-label="Explore butai"
      className="flex w-56 shrink-0 flex-col gap-1 border-r bg-sidebar p-3 text-sidebar-foreground"
    >
      <div className="px-2 pb-3 pt-1">
        <span className="text-sm font-semibold">Butai</span>
      </div>
      {NAV.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
              'justify-start',
            )
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <LeftNav />
      <main className="min-w-0 flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/theme" replace />} />
          <Route path="/theme" element={<ThemeStudio />} />
          <Route path="/slides" element={<SlideStudio />} />
          <Route path="/video" element={<VideoStudio />} />
          <Route path="/docs" element={<DocsStudio />} />
        </Routes>
      </main>
    </div>
  );
}
