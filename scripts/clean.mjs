#!/usr/bin/env node
/** Remove every build artifact. Dependencies are left alone — use `pnpm clean:deps` for those. */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './env.mjs';

const targets = ['dist', 'coverage', 'site/out', 'site/.next', 'docs/.vitepress/dist', 'docs/.vitepress/cache'];

for (const target of targets) {
  const abs = path.join(ROOT, target);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { recursive: true, force: true });
    console.log(`removed ${target}`);
  }
}
