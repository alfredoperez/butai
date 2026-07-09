/**
 * @butai/credits — sources.yml loader (frozen SIGNATURE; body filled by Group A).
 *
 * `loadLedger` is the Node-only fs/yaml boundary: it reads and schema-validates
 * the repo-root `sources.yml`, throwing on any schema break (missing required
 * field, unknown `how`, duplicate id, or a `how: excluded` row without an
 * `excluded_reason`). It is intentionally NOT re-exported from the isomorphic
 * root barrel (`index.ts`) — only `renderCredits` + the types are (§0.3).
 */
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { HOW_ORDER, type SourceEntry, type SourceHow, type SourcesLedger } from './types.js';

const HOW_SET = new Set<string>(HOW_ORDER);

/** The frozen required-on-every-entry field set (§0.1). */
const REQUIRED_FIELDS = [
  'id',
  'name',
  'url',
  'license',
  'what',
  'how',
  'adopted',
  'last_checked',
  'last_ref',
] as const;

function fail(msg: string): never {
  throw new Error(`sources.yml: ${msg}`);
}

/** A required field is "present" if the key exists (null IS allowed for adopted/last_ref). */
function hasKey(entry: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(entry, key);
}

function validateEntry(raw: unknown, index: number): SourceEntry {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    fail(`entry #${index} is not a mapping`);
  }
  const entry = raw as Record<string, unknown>;
  const where = typeof entry.id === 'string' ? `entry "${entry.id}"` : `entry #${index}`;

  for (const field of REQUIRED_FIELDS) {
    if (!hasKey(entry, field)) fail(`${where} is missing required field "${field}"`);
  }

  // String-required fields (adopted + last_ref MAY be null; everything else must be a string).
  for (const field of ['id', 'name', 'url', 'license', 'what', 'how', 'last_checked'] as const) {
    if (typeof entry[field] !== 'string' || (entry[field] as string).trim() === '') {
      fail(`${where} field "${field}" must be a non-empty string`);
    }
  }

  const how = entry.how as string;
  if (!HOW_SET.has(how)) {
    fail(`${where} has unknown how "${how}" (allowed: ${HOW_ORDER.join(', ')})`);
  }

  // adopted + last_ref are string | null.
  for (const field of ['adopted', 'last_ref'] as const) {
    const v = entry[field];
    if (v !== null && typeof v !== 'string') fail(`${where} field "${field}" must be a string or null`);
  }

  // excluded rows REQUIRE a non-empty excluded_reason (§0.1).
  if (how === 'excluded') {
    const reason = entry.excluded_reason;
    if (typeof reason !== 'string' || reason.trim() === '') {
      fail(`${where} is how: excluded but has no excluded_reason (required)`);
    }
  }

  // Optional fields, if present, must be strings.
  for (const field of ['repo', 'notes', 'excluded_reason'] as const) {
    if (hasKey(entry, field) && entry[field] !== undefined) {
      if (typeof entry[field] !== 'string') fail(`${where} optional field "${field}" must be a string`);
    }
  }

  return {
    id: entry.id as string,
    name: entry.name as string,
    url: entry.url as string,
    ...(hasKey(entry, 'repo') ? { repo: entry.repo as string } : {}),
    license: entry.license as string,
    what: entry.what as string,
    how: how as SourceHow,
    adopted: (entry.adopted as string | null) ?? null,
    last_checked: entry.last_checked as string,
    last_ref: (entry.last_ref as string | null) ?? null,
    ...(hasKey(entry, 'notes') ? { notes: entry.notes as string } : {}),
    ...(hasKey(entry, 'excluded_reason') ? { excluded_reason: entry.excluded_reason as string } : {}),
  };
}

/** Parse + schema-validate a `sources.yml` at `path`; throw on any schema break. */
export function loadLedger(path: string): SourcesLedger {
  const text = readFileSync(path, 'utf8');
  const doc = parseYaml(text) as unknown;

  if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) {
    fail('top-level document is not a mapping');
  }
  const root = doc as Record<string, unknown>;

  if (root.version !== 1) fail(`unexpected version ${JSON.stringify(root.version)} (expected 1)`);
  if (!Array.isArray(root.sources)) fail('"sources" must be an array');

  const sources = root.sources.map((raw, i) => validateEntry(raw, i));

  // Ids must be unique across the file (the sync skill keys off them).
  const seen = new Set<string>();
  for (const s of sources) {
    if (seen.has(s.id)) fail(`duplicate id "${s.id}"`);
    seen.add(s.id);
  }

  return { version: 1, sources };
}
