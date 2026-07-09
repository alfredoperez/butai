/**
 * Shared placeholder frame for the three studio routes (Task 0). Each studio's
 * Group (A/B/C) replaces its own `src/<name>-studio/` module; this frame just gives
 * the shell something labeled + testable to render until then.
 */
import { Button } from '@/components/ui/button';

export function StudioPlaceholder({
  route,
  title,
  blurb,
}: {
  route: string;
  title: string;
  blurb: string;
}) {
  return (
    <section
      data-studio-placeholder={route}
      className="flex h-full flex-col items-start justify-center gap-4 p-10"
    >
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Butai Studio
      </p>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="max-w-prose text-muted-foreground">{blurb}</p>
      <Button variant="outline" size="sm" disabled>
        Coming soon
      </Button>
    </section>
  );
}
