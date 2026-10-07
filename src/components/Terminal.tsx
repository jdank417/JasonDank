'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleTheme } from './ThemeToggle';
import { getNode, listDir, resolvePath, root, type FsDir } from '@/lib/terminalFs';

type Line = { id: number; kind: 'cmd' | 'out' | 'err'; text: string };

const BOAT = [
  '         |\\',
  '         | \\',
  '         |  \\',
  '         |   \\',
  '    _____|____\\____',
  '    \\  MAT 1070    /',
  ' ~~~~\\____________/~~~~',
  '',
  'Fawn Libowitz. Won Figawi 2026.',
].join('\n');

const HELP = [
  'help              this list',
  'whoami            who runs this site',
  'ls [dir]          list a directory',
  'cd <dir>          change directory (.. to go up, ~ for home)',
  'pwd               where you are',
  'cat <file>        print a file, e.g. cat projects/humanauth',
  'open <file>       open what a file points to (a repo, a page section)',
  'theme             toggle dark mode',
  'sail              go sailing',
  'history           commands you have run',
  'clear             clear the screen (or Ctrl L)',
  'exit              back to the portfolio',
].join('\n');

const COMMANDS = ['help', 'whoami', 'ls', 'cd', 'pwd', 'cat', 'open', 'theme', 'sail', 'history', 'clear', 'exit', 'echo'];

const SUGGESTIONS = ['help', 'ls', 'cat about.txt', 'ls projects', 'cat projects/humanauth', 'cd sailing', 'sail'];

const displayPath = (segs: string[]) => (segs.length ? `~/${segs.join('/')}` : '~');

let nextId = 0;
const line = (kind: Line['kind'], text: string): Line => ({ id: nextId++, kind, text });

export default function Terminal() {
  const router = useRouter();
  const [cwd, setCwd] = useState<string[]>([]);
  const [lines, setLines] = useState<Line[]>(() => [
    line('out', 'jasondank.com terminal. Type help to see what works here, or tap a suggestion below.'),
  ]);
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ready to type on arrival — but only with a mouse/trackpad, so phones don't
  // throw up a keyboard over the page.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = useCallback(
    (raw: string) => {
      const cmdText = raw.trim();
      const prompt = `${displayPath(cwd)} % ${cmdText}`;
      if (!cmdText) {
        setLines((ls) => [...ls, line('cmd', prompt)]);
        return;
      }
      history.current.push(cmdText);
      historyIndex.current = history.current.length;

      const [name, ...args] = cmdText.split(/\s+/);
      const arg = args.join(' ');
      const out: Line[] = [line('cmd', prompt)];
      const say = (text: string) => out.push(line('out', text));
      const fail = (text: string) => out.push(line('err', text));

      switch (name.toLowerCase()) {
        case 'help':
          say(HELP);
          break;
        case 'whoami':
          say('Jason Dank. Full-stack software engineer at Fidelity Investments,\nbuilding on the Private Shares platform. Boston Seaport.');
          break;
        case 'pwd':
          say(displayPath(cwd));
          break;
        case 'ls': {
          const segs = arg ? resolvePath(cwd, arg) : cwd;
          const node = segs && getNode(segs);
          if (!node) fail(`ls: ${arg}: No such file or directory`);
          else if (node.type === 'file') say(arg);
          else say(listDir(node));
          break;
        }
        case 'cd': {
          const segs = resolvePath(cwd, arg || '~');
          const node = segs && getNode(segs);
          if (!segs || !node) fail(`cd: no such directory: ${arg}`);
          else if (node.type !== 'dir') fail(`cd: not a directory: ${arg}`);
          else setCwd(segs);
          break;
        }
        case 'cat': {
          if (!arg) {
            fail('usage: cat <file>   try: cat about.txt');
            break;
          }
          const segs = resolvePath(cwd, arg);
          const node = segs && getNode(segs);
          if (!node) fail(`cat: ${arg}: No such file. Try ls`);
          else if (node.type === 'dir') fail(`cat: ${arg}: Is a directory. Try ls ${arg}`);
          else say(node.content);
          break;
        }
        case 'open': {
          const segs = arg ? resolvePath(cwd, arg) : null;
          const node = segs && getNode(segs);
          if (!arg) fail('usage: open <file>   try: open projects/humanauth');
          else if (!node || node.type !== 'file' || !node.href) fail(`open: ${arg}: nothing to open`);
          else if (/^https?:/.test(node.href)) {
            window.open(node.href, '_blank', 'noopener,noreferrer');
            say(`Opened ${node.href}`);
          } else {
            say(`Going to ${node.href}`);
            router.push(node.href);
          }
          break;
        }
        case 'theme':
          say(`Switched to ${toggleTheme()} mode.`);
          break;
        case 'sail':
        case 'figawi':
          say(BOAT);
          break;
        case 'history':
          say(history.current.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n'));
          break;
        case 'echo':
          say(arg);
          break;
        case 'sudo':
          fail('Nice try.');
          break;
        case 'exit':
          say('Back to the portfolio…');
          router.push('/');
          break;
        case 'clear':
          setLines([]);
          return;
        default:
          fail(`zsh: command not found: ${name}\nType help to see what works here.`);
      }
      setLines((ls) => [...ls, ...out]);
    },
    [cwd, router],
  );

  // Tab completes a command name, or the last path segment of the argument.
  const complete = () => {
    const parts = input.split(' ');
    if (parts.length === 1) {
      const matches = COMMANDS.filter((c) => c.startsWith(parts[0]));
      if (matches.length === 1) setInput(`${matches[0]} `);
      else if (matches.length > 1) setLines((ls) => [...ls, line('out', matches.join('  '))]);
      return;
    }
    const partial = parts[parts.length - 1];
    const slash = partial.lastIndexOf('/');
    const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : '';
    const stem = partial.slice(slash + 1);
    const dirSegs = dirPart ? resolvePath(cwd, dirPart) : cwd;
    const dir = dirSegs && getNode(dirSegs);
    if (!dir || dir.type !== 'dir') return;
    const names = Object.entries((dir as FsDir).children)
      .filter(([n]) => n.startsWith(stem))
      .map(([n, node]) => (node.type === 'dir' ? `${n}/` : n));
    if (names.length === 1) {
      parts[parts.length - 1] = dirPart + names[0];
      setInput(parts.join(' '));
    } else if (names.length > 1) {
      setLines((ls) => [...ls, line('out', names.join('  '))]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex.current > 0) {
        historyIndex.current -= 1;
        setInput(history.current[historyIndex.current]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex.current < history.current.length - 1) {
        historyIndex.current += 1;
        setInput(history.current[historyIndex.current]);
      } else {
        historyIndex.current = history.current.length;
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.12em] text-muted">
        <span className="flex gap-1.5" aria-hidden>
          <i className="block h-2.5 w-2.5 rounded-full border border-border" />
          <i className="block h-2.5 w-2.5 rounded-full border border-border" />
          <i className="block h-2.5 w-2.5 rounded-full border border-border" />
        </span>
        <span>jason@seaport — zsh</span>
        <span className="hidden sm:inline">{Object.keys(root.children).length} entries in ~</span>
      </div>

      <div
        ref={scrollRef}
        className="h-[min(62vh,560px)] cursor-text overflow-y-auto px-4 py-4 text-sm leading-relaxed sm:px-5"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((l) => (
            <pre
              key={l.id}
              className={`whitespace-pre-wrap break-words font-mono ${
                l.kind === 'cmd' ? 'mt-3 text-foreground first:mt-0' : l.kind === 'err' ? 'text-danger' : 'text-muted'
              }`}
            >
              {l.text}
            </pre>
          ))}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <label htmlFor="terminal-input" className="flex-shrink-0 text-signal">
            {displayPath(cwd)} %
          </label>
          <input
            ref={inputRef}
            id="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal command"
            className="min-w-0 flex-1 bg-transparent font-mono text-base text-foreground caret-accent outline-none sm:text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-3" aria-label="Example commands">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              run(s);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
