import { convertFileToJcr } from './da-to-jcr.mjs';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const models = JSON.parse(await readFile('component-models.json', 'utf-8'));
const definition = JSON.parse(await readFile('component-definition.json', 'utf-8'));
const filters = JSON.parse(await readFile('component-filters.json', 'utf-8'));
const components = { models, definition, filters };

// Collect all report.json (path + title) for the product-detail pages
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.name.endsWith('.report.json')) out.push(p);
  }
  return out;
}
const reports = await walk('tools/importer/reports');
const OUT = 'migration-work/jcr';
let ok = 0, fail = 0;
const failures = [];
for (const rp of reports) {
  let meta;
  try { meta = JSON.parse(await readFile(rp, 'utf-8')); } catch { continue; }
  if (meta.status !== 'success' || !meta.path) continue;
  const plainPath = path.join('content', `${meta.path}.plain.html`);
  if (!existsSync(plainPath)) { failures.push(`${meta.path} (no plain.html)`); fail++; continue; }
  try {
    const xml = await convertFileToJcr(plainPath, meta.title || meta.path, components);
    const outPath = path.join(OUT, `${meta.path}`, '.content.xml');
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, xml, 'utf-8');
    ok++;
  } catch (e) {
    failures.push(`${meta.path}: ${e.message}`);
    fail++;
  }
}
console.log(`Converted: ${ok}  Failed: ${fail}`);
if (failures.length) { console.log('Failures:'); failures.slice(0, 20).forEach((f) => console.log('  ', f)); }
