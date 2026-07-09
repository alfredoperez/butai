/**
 * `pnpm --filter @butai/credits gen`
 *
 * The ONE fs boundary of the credits generator: load the repo-root `sources.yml`
 * (via `loadLedger`), render it through the PURE `renderCredits`, and write the
 * repo-root `CREDITS.md`. Deterministic — `renderCredits` injects no timestamp, so
 * two runs on the same ledger produce a byte-identical file (the git diff --exit-code
 * proof). The credits file is a repo-root singleton, so this workspace writes outside
 * its own tree by design (§0.3).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { loadLedger } from '../src/parse.js';
import { renderCredits } from '../src/render.js';

const pkgRoot = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = join(pkgRoot, '..', '..');

/** Repo-root `sources.yml` — the ledger data source. */
export const LEDGER_PATH = join(repoRoot, 'sources.yml');
/** Repo-root `CREDITS.md` — the generated, committed output. */
export const CREDITS_PATH = join(repoRoot, 'CREDITS.md');

/** Load the real ledger + render it. Pure w.r.t. the on-disk `sources.yml` (no wallclock). */
export function generateCredits(): string {
  return renderCredits(loadLedger(LEDGER_PATH));
}

/** Read the committed CREDITS.md (for the "output is current" test). */
export function readCommittedCredits(): string {
  return readFileSync(CREDITS_PATH, 'utf8');
}

function main() {
  const out = generateCredits();
  writeFileSync(CREDITS_PATH, out);
  const entries = out.match(/^### /gm)?.length ?? 0;
  console.log(`[gen] CREDITS.md written: ${entries} entries, ${out.length} bytes`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
