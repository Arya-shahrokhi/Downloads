import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';
const children = [];
let closing = false;

// Node >= 18.20.2 / 20.12.2 روی ویندوز اجازه‌ی spawn مستقیم فایل‌های .cmd/.bat را
// بدون shell نمی‌دهد (CVE-2024-27980) و خطای EINVAL می‌دهد.
// راه امن: اگر از طریق npm اجرا شده‌ایم، npm-cli.js را مستقیم با همین node اجرا می‌کنیم.
// در غیر این صورت روی ویندوز از shell استفاده می‌کنیم.
function npmCommand(args) {
  const npmCli = process.env.npm_execpath;
  if (npmCli && /\.(c|m)?js$/i.test(npmCli)) {
    return { cmd: process.execPath, args: [npmCli, ...args], shell: false };
  }
  return { cmd: isWin ? 'npm.cmd' : 'npm', args, shell: isWin };
}

function run(name, workspace) {
  const { cmd, args, shell } = npmCommand(['run', 'dev', '--workspace', workspace]);
  const child = spawn(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell,
    windowsHide: false,
    env: { ...process.env, FORCE_COLOR: '1' },
  });
  children.push(child);
  child.on('error', (err) => {
    console.error(`[dev] اجرای ${name} ممکن نشد:`, err.message);
    shutdown(1);
  });
  child.on('exit', (code) => {
    if (!closing && code !== 0) {
      console.error(`[dev] ${name} با خطا متوقف شد`);
      shutdown(code || 1);
    }
  });
}

function shutdown(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) {
    if (child.killed || child.exitCode !== null) continue;
    if (isWin && child.pid) {
      // روی ویندوز SIGTERM کل درخت پروسه (nodemon/vite) را نمی‌بندد
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  }
  setTimeout(() => process.exit(code), 800).unref();
}

run('backend', 'backend');
run('frontend', 'frontend');
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
