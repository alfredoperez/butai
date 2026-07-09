#!/usr/bin/env node
/**
 * @butai/cli — the `butai` command (phase-3).
 *
 * Hand-rolled arg parsing (no framework) dispatching to init/add/diff. Kept
 * near-zero-dep on purpose: `yaml` + node builtins only.
 */

import { readFileSync } from 'node:fs';
import { runInit } from './commands/init.js';
import { runAdd } from './commands/add.js';
import { runDiff } from './commands/diff.js';
import { NotImplementedError } from './registry.js';
import { defaultLogger } from './io.js';

const USAGE = `butai — copy-in slide registry CLI

Usage:
  butai <command> [options]

Commands:
  init                Write/merge a butai.json into a consumer project
  add <item...>       Copy a registry item's source (+ its closure) into the consumer
  diff <item>         Show drift between a local copy and the registry

Global options:
  --cwd <dir>         Consumer project root (default: current directory)
  -h, --help          Show help
  -v, --version       Show version

init options:
  --yes               Accept defaults (no prompts)
  --force             Overwrite an existing butai.json (never merges)
  --registry <spec>   Registry location (default: file:node_modules/@butai/slide-kit/registry)
  --alias-base <b>    Base for slides/primitives/styles aliases (e.g. @/components/butai)
  --import-extensions Keep .js on rewritten imports (NodeNext consumers)
  --no-tsx            Consumer uses .jsx, not .tsx

add options:
  --overwrite         Replace files that already exist
  --backup            Keep a .bak when overwriting
  --dry-run           Print the plan without writing

diff options:
  --quiet             Minimal output for CI (exit code is the signal)
`;

type Parsed = {
  command?: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
};

function parseArgs(argv: string[]): Parsed {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  const valueFlags = new Set(['cwd', 'registry', 'alias-base']);
  let command: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      if (valueFlags.has(name)) {
        flags[name] = argv[++i];
      } else {
        flags[name] = true;
      }
    } else if (arg === '-h') {
      flags.help = true;
    } else if (arg === '-v') {
      flags.version = true;
    } else if (!command) {
      command = arg;
    } else {
      positionals.push(arg);
    }
  }
  return { command, positionals, flags };
}

function version(): string {
  try {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function main(argv: string[]): Promise<number> {
  const { command, positionals, flags } = parseArgs(argv.slice(2));

  if (flags.version) {
    process.stdout.write(`${version()}\n`);
    return 0;
  }
  if (!command || (flags.help && !['init', 'add', 'diff'].includes(command))) {
    process.stdout.write(USAGE);
    return 0;
  }

  const cwd = typeof flags.cwd === 'string' ? flags.cwd : process.cwd();

  try {
    switch (command) {
      case 'init':
        return await runInit({
          cwd,
          yes: flags.yes === true,
          force: flags.force === true,
          registry: typeof flags.registry === 'string' ? flags.registry : undefined,
          aliasBase: typeof flags['alias-base'] === 'string' ? flags['alias-base'] : undefined,
          importExtensions: flags['import-extensions'] === true ? true : undefined,
          tsx: flags['no-tsx'] === true ? false : undefined,
        });
      case 'add':
        if (positionals.length === 0) {
          defaultLogger.err('add: expected at least one item id.');
          process.stdout.write(USAGE);
          return 1;
        }
        return await runAdd({
          cwd,
          items: positionals,
          overwrite: flags.overwrite === true,
          backup: flags.backup === true,
          dryRun: flags['dry-run'] === true,
        });
      case 'diff':
        if (positionals.length === 0) {
          defaultLogger.err('diff: expected an item id.');
          process.stdout.write(USAGE);
          return 1;
        }
        return await runDiff({ cwd, item: positionals[0], quiet: flags.quiet === true });
      default:
        defaultLogger.err(`butai: unknown command '${command}'`);
        process.stdout.write(USAGE);
        return 1;
    }
  } catch (err) {
    if (err instanceof NotImplementedError) {
      defaultLogger.err(`butai: ${err.message}`);
      return 2;
    }
    defaultLogger.err(`butai: ${(err as Error).message}`);
    return 1;
  }
}

main(process.argv).then((code) => process.exit(code));
