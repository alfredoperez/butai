/**
 * Linktree fixtures (plan Q3): every rendered string/URL on /links comes from
 * here, and everything points at example.com. No personal names or URLs
 * anywhere in this repo's fixtures — enforced by src/guard.test.ts and the
 * linktree e2e spec.
 */
import type { LinktreeLink } from '@butai/deck';

export const FIXTURE_TALK = {
  title: 'Demo Talk',
  date: '2026-07-07',
  tagline: 'A fixture talk wired to the playground demo deck.',
};

export const FIXTURE_SPEAKER = {
  name: 'Playground Speaker',
  role: 'Fixture role',
};

export const FIXTURE_LINKS_HEADING = 'Fixture links';

export const FIXTURE_LINKS: LinktreeLink[] = [
  {
    icon: '📝',
    label: 'Fixture article',
    detail: 'Read the write-up',
    href: 'https://example.com/article',
  },
  {
    icon: '💻',
    label: 'Fixture repo',
    detail: 'Browse the code',
    href: 'https://example.com/repo',
  },
  {
    icon: '🎥',
    label: 'Fixture recording',
    detail: 'Watch the session',
    href: 'https://example.com/recording',
  },
];

export const FIXTURE_SOCIALS: LinktreeLink[] = [
  { icon: '🌐', label: 'Fixture social one', href: 'https://example.com/social-one' },
  { icon: '💬', label: 'Fixture social two', href: 'https://example.com/social-two' },
];

export const FIXTURE_FOOTER = {
  label: 'example.com',
  href: 'https://example.com',
};
