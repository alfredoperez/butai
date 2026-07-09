/*
 * Video Studio (phase-5 · Group B) — a READ-ONLY video lane surface.
 *
 * It visualizes two frozen artifacts side by side:
 *   • a hand-authored STORYBOARD.md (parsed by the isomorphic `parseStoryboard`
 *     from @butai/scene-kit) — the shot list: frame titles, durations, transitions,
 *     voiceover, director notes;
 *   • the scene kit's framework-free scene documents — rendered as a themed
 *     contact-sheet grid, each scene isolated in an `<iframe srcdoc>` so its CSS
 *     never leaks into the shadcn chrome (and Tailwind preflight never restyles it).
 *
 * A theme switcher (driven by @butai/themes `THEMES`) injects the selected theme's
 * token block into every scene's `:root` — the same HTML repaints, proving the
 * scenes-restyle-via-token-contract contract. There is NO persistence / refine loop
 * here (that is P4's JSON storyboard, a distinct artifact — §0.6).
 *
 * Robust to Group A's timing: scenes come from the kit's `src/scenes/*.html` when
 * present, else this studio's bundled fixture scenes — so the surface is never empty.
 */
import { useMemo, useState, type JSX } from 'react';
import { Clapperboard } from 'lucide-react';
import { parseStoryboard, type StoryboardScene } from '@butai/scene-kit';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { loadScenes, loadThemeTokens, sceneSrcdoc, type SceneDoc } from './scenes-data';
import './video-studio.css';

// The committed STORYBOARD.md fixture (personal-data-free), read as raw text.
const STORYBOARD_RAW = import.meta.glob('../../e2e/fixtures/scene-storyboard.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const STORYBOARD_MD = Object.values(STORYBOARD_RAW)[0] ?? '';

/** basename of a frame `src` path, minus extension → a scene id to match on. */
function sceneIdFromSrc(src?: string): string | undefined {
  if (!src) return undefined;
  const base = src.slice(src.lastIndexOf('/') + 1);
  return base.replace(/\.html$/, '');
}

export function VideoStudio(): JSX.Element {
  const scenes = useMemo(() => loadScenes(), []);
  const themeList = useMemo(() => loadThemeTokens(), []);
  const storyboard = useMemo(() => parseStoryboard(STORYBOARD_MD), []);

  const [themeId, setThemeId] = useState(
    () => themeList.find((t) => t.id === 'dark')?.id ?? themeList[0]?.id ?? 'dark',
  );
  const tokens = useMemo(
    () => themeList.find((t) => t.id === themeId)?.tokens ?? {},
    [themeList, themeId],
  );

  // Match each parsed frame to a scene by `src` basename (best-effort, positional
  // fallback) purely to overlay the frame's duration on the matching thumbnail.
  const frameBySceneId = useMemo(() => {
    const map = new Map<string, StoryboardScene>();
    storyboard.scenes.forEach((frame, i) => {
      const id = sceneIdFromSrc(frame.src) ?? scenes[i]?.id;
      if (id && !map.has(id)) map.set(id, frame);
    });
    return map;
  }, [storyboard.scenes, scenes]);

  return (
    <div className="flex h-full min-h-0 flex-col" data-video-studio>
      <header className="flex flex-wrap items-center gap-3 border-b px-6 py-4">
        <Clapperboard className="size-5 text-muted-foreground" />
        <div className="mr-auto">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Butai Studio
          </p>
          <h1 className="text-2xl font-semibold">Video Studio</h1>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Read-only. A parsed STORYBOARD.md shot list beside a themed contact-sheet of the
            framework-free scene kit. Switch the theme to repaint every scene via the token
            contract.
          </p>
        </div>

        {/* Theme switcher */}
        <div className="flex flex-wrap gap-1.5" data-testid="theme-switcher">
          {themeList.map((theme) => (
            <button
              key={theme.id}
              type="button"
              data-theme-chip={theme.id}
              aria-pressed={theme.id === themeId}
              onClick={() => setThemeId(theme.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                theme.id === themeId
                  ? 'border-primary bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50',
              )}
            >
              <span className="flex gap-0.5">
                {['--bg', '--accent', '--text'].map((t) => (
                  <span
                    key={t}
                    className="size-3 rounded-full border"
                    style={{ background: theme.tokens[t] ?? 'transparent' }}
                  />
                ))}
              </span>
              {theme.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(300px,380px)_1fr]">
        {/* ── Shot list (parsed STORYBOARD.md) ─────────────────────────────── */}
        <aside className="min-h-0 space-y-3 overflow-auto border-r p-5" data-testid="shot-list">
          <div>
            <h2 className="text-sm font-semibold">Storyboard</h2>
            {storyboard.message && (
              <p className="mt-1 text-xs text-muted-foreground italic">{storyboard.message}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {storyboard.format && <Badge variant="secondary">{storyboard.format}</Badge>}
              {storyboard.arc && <Badge variant="outline">{storyboard.arc}</Badge>}
            </div>
          </div>

          {storyboard.scenes.map((frame) => (
            <Card key={frame.index} data-frame={frame.index}>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(frame.index).padStart(2, '0')}
                  </span>
                  {frame.title}
                </CardTitle>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {frame.durationSeconds !== undefined && (
                    <Badge variant="secondary">{frame.durationSeconds}s</Badge>
                  )}
                  {frame.transitionIn && <Badge variant="outline">{frame.transitionIn}</Badge>}
                  {frame.status && <Badge variant="outline">{frame.status}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                {frame.voiceover && (
                  <p className="text-foreground">
                    <span className="text-muted-foreground">VO: </span>
                    {frame.voiceover}
                  </p>
                )}
                {frame.note && <p className="text-muted-foreground">{frame.note}</p>}
              </CardContent>
            </Card>
          ))}
        </aside>

        {/* ── Contact sheet (themed scene thumbnails) ──────────────────────── */}
        <section className="min-h-0 overflow-auto p-5" data-testid="contact-sheet">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold">Contact sheet</h2>
            <Badge variant="secondary">{themeId}</Badge>
            <Badge variant="outline">
              {scenes.length} scene{scenes.length === 1 ? '' : 's'}
            </Badge>
            {scenes[0]?.fixture && <Badge variant="outline">fixtures</Badge>}
          </div>

          {scenes.length === 0 ? (
            <p className="text-sm text-muted-foreground" data-testid="scenes-empty">
              No scenes yet. The scene kit has not published any scenes.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {scenes.map((scene) => (
                <SceneThumb
                  key={scene.id}
                  scene={scene}
                  tokens={tokens}
                  durationSeconds={frameBySceneId.get(scene.id)?.durationSeconds}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SceneThumb({
  scene,
  tokens,
  durationSeconds,
}: {
  scene: SceneDoc;
  tokens: Record<string, string>;
  durationSeconds?: number;
}): JSX.Element {
  const srcdoc = useMemo(() => sceneSrcdoc(scene.html, tokens), [scene.html, tokens]);
  return (
    <figure className="m-0" data-scene={scene.id}>
      <div className="vs-thumb" data-scene-frame={scene.id}>
        {/* `allow-same-origin` (no `allow-scripts`): thumbnails render the scene's
            static first frame — no inline motion runs, so no CDN fetch, no console
            noise — while Playwright can still read the token probe's computed style. */}
        <iframe
          title={`Scene: ${scene.title}`}
          srcDoc={srcdoc}
          loading="lazy"
          sandbox="allow-same-origin"
        />
      </div>
      <figcaption className="mt-1.5 flex items-center gap-1.5">
        <span className="truncate font-mono text-[11px] text-foreground" title={scene.id}>
          {scene.id}
        </span>
        {durationSeconds !== undefined && (
          <span className="font-mono text-[10px] text-muted-foreground">{durationSeconds}s</span>
        )}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">{scene.category}</span>
      </figcaption>
    </figure>
  );
}
