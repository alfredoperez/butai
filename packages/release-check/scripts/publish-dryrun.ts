/**
 * Publish DRY-RUN harness (phase-10 D2).
 *
 * Runs `npm pack --dry-run` for each of the 7 intended-public packages. This is
 * the publish tarball SIMULATION that runs SAFELY with `private: true` intact:
 *   - `npm publish --dry-run` REFUSES on private packages (would force flipping
 *     private — a leak the holds forbid).
 *   - `npm pack --dry-run` works on private packages (private only blocks
 *     *publish*, not *pack*) and prints the EXACT tarball file list — i.e. what
 *     the `files` array would actually ship.
 *
 * It writes NOTHING to any registry and never invokes `publish`. `--dry-run`
 * also means no `.tgz` is written to disk. Pairs with the manifest-report to
 * show, per package, the file list + the morning-flip deltas.
 *
 * Runnable: `pnpm --filter @butai/release-check exec tsx scripts/publish-dryrun.ts`
 */

import { spawnSync } from 'node:child_process';
import { PUBLISHABLE, packageDir } from '../src/manifests.js';
import { computeFlipDeltas, formatReport } from './manifest-report.js';

export type PackResult = {
  name: string;
  dir: string;
  ok: boolean;
  /** files the tarball would ship (from npm pack --dry-run --json) */
  files: string[];
  unpackedSize?: number;
  raw: string;
};

/** Run `npm pack --dry-run --json` for one package dir; parse the file list. */
export function packDryRun(dir: string): PackResult {
  const cwd = packageDir(dir);
  const res = spawnSync('npm', ['pack', '--dry-run', '--json'], {
    cwd,
    encoding: 'utf8',
    // Belt-and-suspenders: never touch a real registry.
    env: { ...process.env, npm_config_registry: 'http://localhost:0/' },
  });
  const raw = (res.stdout || '') + (res.stderr || '');
  let files: string[] = [];
  let unpackedSize: number | undefined;
  let name = dir;
  try {
    // npm prints a JSON array (one entry per packed tarball) to stdout.
    const parsed = JSON.parse(res.stdout);
    const first = Array.isArray(parsed) ? parsed[0] : parsed;
    if (first) {
      name = first.name ?? dir;
      unpackedSize = first.unpackedSize;
      files = Array.isArray(first.files) ? first.files.map((f: { path: string }) => f.path) : [];
    }
  } catch {
    // fall through: ok stays false if we couldn't parse
  }
  return { name, dir, ok: res.status === 0 && files.length > 0, files, unpackedSize, raw };
}

export function runAll(): PackResult[] {
  return PUBLISHABLE.map((p) => packDryRun(p.dir));
}

// Run directly: pack --dry-run all 7 + print file lists + the flip report.
if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write('=== butai publish DRY-RUN (npm pack --dry-run — NO publish) ===\n\n');
  const results = runAll();
  for (const r of results) {
    process.stdout.write(`## ${r.name}  (packages/${r.dir})  ${r.ok ? 'OK' : 'FAILED'}\n`);
    if (r.unpackedSize != null) process.stdout.write(`   unpacked: ${r.unpackedSize} bytes\n`);
    process.stdout.write(`   tarball files (${r.files.length}):\n`);
    for (const f of r.files) process.stdout.write(`     - ${f}\n`);
    process.stdout.write('\n');
  }
  process.stdout.write(formatReport(computeFlipDeltas()) + '\n');
  const failed = results.filter((r) => !r.ok);
  process.stdout.write(
    failed.length
      ? `DRY-RUN completed with ${failed.length} pack failure(s): ${failed.map((f) => f.name).join(', ')}\n`
      : 'DRY-RUN complete: all 7 packed cleanly. NOTHING was published.\n',
  );
}
