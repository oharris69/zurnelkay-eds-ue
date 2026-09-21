import { convertFileToJcr } from './da-to-jcr.mjs';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const models = JSON.parse(await readFile('component-models.json', 'utf-8'));
const definition = JSON.parse(await readFile('component-definition.json', 'utf-8'));
const filters = JSON.parse(await readFile('component-filters.json', 'utf-8'));
const components = { models, definition, filters };

// FR market report files
const reportsDir = 'tools/importer/reports/fr/markets';
const OUT = 'migration-work/jcr-market';
let ok = 0, fail = 0; const failures = [];
for (const rp of (await readdir(reportsDir)).filter((f) => f.endsWith('.report.json'))) {
  const meta = JSON.parse(await readFile(path.join(reportsDir, rp), 'utf-8'));
  if (meta.status !== 'success' || !meta.path) continue;
  const plainPath = path.join('content', `${meta.path}.plain.html`);
  if (!existsSync(plainPath)) { failures.push(meta.path + ' (no plain.html)'); fail++; continue; }
  try {
    const xml = await convertFileToJcr(plainPath, meta.title || meta.path, components);
    const outPath = path.join(OUT, meta.path, '.content.xml');
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, xml, 'utf-8');
    ok++;
  } catch (e) { failures.push(`${meta.path}: ${e.message}`); fail++; }
}
console.log(`Converted: ${ok}  Failed: ${fail}`);
failures.forEach((f) => console.log('  ' + f));
