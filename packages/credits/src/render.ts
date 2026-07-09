/**
 * @butai/credits — CREDITS.md renderer (frozen SIGNATURE; body filled by Group A).
 *
 * `renderCredits` is a PURE function of the parsed `sources.yml` data (§0.3):
 * it MUST NOT call `Date.now()`, `new Date()`, read `process`/env, touch `fs`,
 * or hit the network. Two runs on the same ledger produce byte-identical output
 * (the determinism proof). Any date shown is a `last_checked` value read from the
 * data — never a generation-time stamp.
 *
 * The render is grouped by `how` in the frozen HOW_ORDER, entries sorted by `id`
 * within each group, empty groups omitted, every entry rendered exactly once (§0.4).
 */
import { HOW_ORDER, type SourceEntry, type SourceHow, type SourcesLedger } from './types.js';

/** Constant generation header — NO timestamp (a fixed string, §0.3). */
const GENERATED_HEADER = '<!-- generated from sources.yml by @butai/credits — do not edit by hand -->';

/** Human-readable section title per `how` (frozen group order via HOW_ORDER, §0.4). */
const GROUP_TITLES: Record<SourceHow, string> = {
  'copied-in': 'Vendored (copied in)',
  'inspired-by': 'Inspired by',
  'runtime-dep': 'Runtime dependencies',
  'external-tool': 'External tools',
  'own-work': 'Our own work',
  excluded: 'Excluded (considered, not shipped)',
};

/** Deterministic id sort (byte order). */
function byId(a: SourceEntry, b: SourceEntry): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/** Render one entry's block. Excluded rows render their `excluded_reason` (§0.4). */
function renderEntry(e: SourceEntry): string {
  const lines: string[] = [];
  lines.push(`### [${e.name}](${e.url}) — ${e.license}`);
  lines.push('');

  if (e.how === 'excluded') {
    lines.push(`${e.what} **Why excluded:** ${e.excluded_reason}`);
  } else {
    const meta: string[] = [];
    if (e.adopted) meta.push(`Adopted ${e.adopted}.`);
    const checked = e.last_ref ? `Last checked ${e.last_checked} at ${e.last_ref}.` : `Last checked ${e.last_checked}.`;
    meta.push(checked);
    lines.push(`${e.what} ${meta.join(' ')}`);
  }

  if (e.repo) {
    lines.push('');
    lines.push(`Source: ${e.repo}`);
  }
  if (e.notes) {
    lines.push('');
    lines.push(`_${e.notes}_`);
  }
  return lines.join('\n');
}

/** Render the deterministic CREDITS.md body from the ledger (§0.4). PURE — no wallclock/fs/net. */
export function renderCredits(ledger: SourcesLedger): string {
  const out: string[] = [];
  out.push(GENERATED_HEADER);
  out.push('');
  out.push('# Credits');
  out.push('');
  out.push(
    "Butai stands on other people's work, and this file is the honest account of it: " +
      'the code we vendored, the ideas we were inspired by, the runtime libraries we depend on, ' +
      'the external tools we call, and our own prior work. It is generated from `sources.yml` ' +
      '(edit there, not here). The **Excluded** section at the end is the point of the license ' +
      'review — it records the non-free things we looked at and deliberately did NOT ship, and why.',
  );

  const byHow = new Map<SourceHow, SourceEntry[]>();
  for (const e of ledger.sources) {
    const list = byHow.get(e.how) ?? [];
    list.push(e);
    byHow.set(e.how, list);
  }

  for (const how of HOW_ORDER) {
    const entries = byHow.get(how);
    if (!entries || entries.length === 0) continue; // omit empty groups
    out.push('');
    out.push(`## ${GROUP_TITLES[how]}`);
    for (const e of [...entries].sort(byId)) {
      out.push('');
      out.push(renderEntry(e));
    }
  }

  // Single trailing newline (POSIX text file), byte-stable.
  return out.join('\n') + '\n';
}
