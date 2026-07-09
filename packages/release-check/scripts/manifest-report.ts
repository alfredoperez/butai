/**
 * Manifest morning-flip report (phase-10 D2).
 *
 * Pure, READ-ONLY analysis. For each intended-public package it computes the
 * exact deltas the real publish needs — WITHOUT editing any manifest. The
 * output is the raw material for PUBLIC-FLIP-CHECKLIST.md; the presence of
 * these deltas is EXPECTED overnight (they are morning-flip work, not bugs).
 *
 * Importable (`computeFlipDeltas`, `formatReport`) by publish-manifest.test.ts;
 * runnable directly (`tsx scripts/manifest-report.ts`) to print the report.
 */

import { PUBLISHABLE, CREATE_BUTAI, readPkg, type PackageJson, type PublishablePkg } from '../src/manifests.js';

const LAUNCH_PLACEHOLDER = '0.0.1'; // versions still at pre-launch seed

export type FlipDelta = {
  dir: string;
  name: string;
  /** morning actions needed to make this package publishable */
  needsPrivateRemoved: boolean;
  needsPublishConfig: boolean;
  needsLicenseField: boolean;
  /** true when `files` is absent (would ship src/ + configs) */
  needsFilesArray: boolean;
  /** suggested files array to add when missing (checklist hint) */
  suggestedFiles?: string[];
  needsVersionBump: boolean;
  /** inter-package deps still pinned to workspace:* (pnpm rewrites at publish) */
  workspaceDeps: string[];
  /** static facts (reported, asserted present) */
  hasName: boolean;
  hasMain: boolean;
  hasTypes: boolean;
  hasExports: boolean;
  hasBin: boolean;
};

const SUGGESTED_FILES: Record<string, string[]> = {
  patterns: ['dist'],
  themes: ['dist', 'themes'],
};

function collectWorkspaceDeps(pkg: PackageJson): string[] {
  const out: string[] = [];
  for (const group of [pkg.dependencies, pkg.peerDependencies]) {
    if (!group) continue;
    for (const [dep, spec] of Object.entries(group)) {
      if (typeof spec === 'string' && spec.startsWith('workspace:')) out.push(dep);
    }
  }
  return out;
}

export function computeFlipDelta(entry: PublishablePkg): FlipDelta {
  const pkg = readPkg(entry.dir);
  const hasFiles = Array.isArray(pkg.files) && pkg.files.length > 0;
  return {
    dir: entry.dir,
    name: pkg.name ?? '(unnamed)',
    needsPrivateRemoved: pkg.private === true,
    needsPublishConfig: pkg.publishConfig?.access !== 'public',
    needsLicenseField: typeof pkg.license !== 'string' || pkg.license.length === 0,
    needsFilesArray: !hasFiles,
    suggestedFiles: hasFiles ? undefined : SUGGESTED_FILES[entry.dir],
    needsVersionBump: pkg.version === LAUNCH_PLACEHOLDER,
    workspaceDeps: collectWorkspaceDeps(pkg),
    hasName: typeof pkg.name === 'string',
    hasMain: typeof pkg.main === 'string',
    hasTypes: typeof pkg.types === 'string',
    hasExports: pkg.exports != null,
    hasBin: pkg.bin != null,
  };
}

export function computeFlipDeltas(): FlipDelta[] {
  return [...PUBLISHABLE, CREATE_BUTAI].map(computeFlipDelta);
}

function fmtActions(d: FlipDelta): string {
  const actions: string[] = [];
  if (d.needsPrivateRemoved) actions.push('remove "private": true');
  if (d.needsPublishConfig) actions.push('add publishConfig.access="public"');
  if (d.needsLicenseField) actions.push('add license="MIT"');
  if (d.needsFilesArray)
    actions.push(`add files array${d.suggestedFiles ? ` (${JSON.stringify(d.suggestedFiles)})` : ''}`);
  if (d.needsVersionBump) actions.push('bump version 0.0.1 -> launch');
  if (d.workspaceDeps.length) actions.push(`pnpm rewrites workspace:* -> ${d.workspaceDeps.join(', ')}`);
  return actions.length ? actions.join('; ') : 'no manifest changes needed';
}

export function formatReport(deltas: FlipDelta[]): string {
  const lines: string[] = [];
  lines.push('# Morning-flip manifest report (READ-ONLY — nothing edited)');
  lines.push('');
  for (const d of deltas) {
    lines.push(`## ${d.name}  (packages/${d.dir})`);
    lines.push(`   flip: ${fmtActions(d)}`);
    lines.push(
      `   ok:   name=${d.hasName} main=${d.hasMain} types=${d.hasTypes} exports=${d.hasExports} bin=${d.hasBin}`,
    );
    lines.push('');
  }
  return lines.join('\n');
}

// Run directly: print the report.
if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(formatReport(computeFlipDeltas()) + '\n');
}
