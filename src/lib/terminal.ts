import { socials } from '@/config/socials';
import { terminalContent as t } from '@/config/terminal';

export interface CommandResult {
  lines: string[];
  /** Wipe the screen. */
  clear?: boolean;
  /** Close the terminal. */
  close?: boolean;
  /** Navigate: internal path or external URL. */
  go?: string;
}

const HELP = [
  'commands:',
  '  whoami          who is this?',
  '  ls              list files',
  '  cat <file>      print a file (try about.txt)',
  '  cd <dir>        open a page (quests, blog, lore, …)',
  '  socials         where to find me',
  '  open <social>   open one (github, x, youtube, instagram)',
  '  pwd · date · echo · uname · clear · exit',
];

/** Pure command interpreter for the hero terminal: input line in, result out. */
export function runCommand(input: string, now: Date = new Date()): CommandResult {
  const [cmd = '', ...args] = input.trim().split(/\s+/);
  const arg = args.join(' ');

  switch (cmd) {
    case '':
      return { lines: [] };
    case 'help':
      return { lines: HELP };
    case 'whoami':
      return { lines: [...t.whoami] };
    case 'ls':
      return { lines: [[...Object.keys(t.files), ...t.dirs.map((d) => `${d}/`)].join('  ')] };
    case 'cat': {
      if (!arg) return { lines: ['usage: cat <file>'] };
      const file = t.files[arg];
      return file ? { lines: file } : { lines: [`cat: ${arg}: No such file or directory`] };
    }
    case 'cd': {
      const dir = arg.replace(/\/$/, '');
      if (!dir || dir === '~') return { lines: [] };
      return t.dirs.includes(dir)
        ? { lines: [`opening /${dir} …`], go: `/${dir}/` }
        : { lines: [`cd: no such file or directory: ${arg}`] };
    }
    case 'socials':
      return { lines: socials.map((s) => `${s.label.padEnd(10)} ${s.href}`) };
    case 'open': {
      const s = socials.find((x) => x.id === arg || x.label === arg);
      return s
        ? { lines: [`opening ${s.href} …`], go: s.href }
        : { lines: [`open: unknown target: ${arg || '(none)'} — try \`socials\``] };
    }
    case 'pwd':
      return { lines: [`/home/${t.user}`] };
    case 'date':
      return { lines: [now.toString()] };
    case 'echo':
      return { lines: [arg] };
    case 'uname':
      return { lines: ['anik8os 1.0 (pixel kernel)'] };
    case 'clear':
      return { lines: [], clear: true };
    case 'exit':
      return { lines: [], close: true };
    case 'sudo':
      return {
        lines: [`${t.user} is not in the sudoers file. this incident will be reported. 👀`],
      };
    default:
      return { lines: [`zsh: command not found: ${cmd} — type \`help\``] };
  }
}
