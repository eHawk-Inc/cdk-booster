// Prepend a node shebang to dist/cdk-booster.mjs. Replaces the old
// `echo '#!/usr/bin/env node' | cat - ...` one-liner that worked on Unix
// shells but produced a literal `'#!/usr/bin/env node'` (with quotes) on
// Windows cmd.exe, which then breaks npm's cmd-shim shebang detection on
// install and leaves the .cmd shim invoking the .mjs file with no `node`
// in front of it (Windows then prompts for an app to open .mjs).
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(__dirname, 'dist', 'cdk-booster.mjs');
const shebang = '#!/usr/bin/env node\n';

const existing = await readFile(target, 'utf8');
if (existing.startsWith(shebang)) {
  console.log(`Shebang already present in ${target}, skipping.`);
} else {
  await writeFile(target, shebang + existing, 'utf8');
  console.log(`Prepended shebang to ${target}.`);
}
