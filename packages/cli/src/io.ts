/**
 * Tiny IO seam so commands are testable: `log`/`err` are injected (default to
 * process streams), and prompting is a thin wrapper over node's readline.
 */

export type Logger = {
  log: (msg: string) => void;
  err: (msg: string) => void;
};

export const defaultLogger: Logger = {
  log: (msg) => process.stdout.write(`${msg}\n`),
  err: (msg) => process.stderr.write(`${msg}\n`),
};

/** Collects output into arrays — used by tests to assert on printed text. */
export function collectLogger(): Logger & { out: string[]; errs: string[]; text: () => string } {
  const out: string[] = [];
  const errs: string[] = [];
  return {
    out,
    errs,
    log: (msg) => out.push(msg),
    err: (msg) => errs.push(msg),
    text: () => [...out, ...errs].join('\n'),
  };
}

/** Prompt for a single line; returns `fallback` when stdin is not a TTY. */
export async function prompt(question: string, fallback: string): Promise<string> {
  if (!process.stdin.isTTY) return fallback;
  const readline = await import('node:readline/promises');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`${question} `)).trim();
    return answer.length > 0 ? answer : fallback;
  } finally {
    rl.close();
  }
}

export async function promptYesNo(question: string, fallback: boolean): Promise<boolean> {
  const suffix = fallback ? '[Y/n]' : '[y/N]';
  const answer = (await prompt(`${question} ${suffix}`, fallback ? 'y' : 'n')).toLowerCase();
  return answer.startsWith('y');
}
