import { convertFileToJcr } from './da-to-jcr.mjs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const models = JSON.parse(await readFile('component-models.json', 'utf-8'));
const definition = JSON.parse(await readFile('component-definition.json', 'utf-8'));
const filters = JSON.parse(await readFile('component-filters.json', 'utf-8'));
const components = { models, definition, filters };

// The About Us page (zurn.com/us/en/about-us → imported to us/en/about-us).
const reportPath = 'tools/importer/reports/us/en/about-us.report.json';
const OUT = 'migration-work/jcr-about-us';

const meta = JSON.parse(await readFile(reportPath, 'utf-8'));
if (meta.status !== 'success' || !meta.path) {
  console.error('Report is not a successful import:', reportPath);
  process.exit(1);
}
const plainPath = path.join('content', `${meta.path}.plain.html`);
if (!existsSync(plainPath)) {
  console.error('Missing plain.html:', plainPath);
  process.exit(1);
}

const xml = await convertFileToJcr(plainPath, meta.title || 'About Zurn', components);
// Destination: the existing en/about-us node (delivery path /en/about-us).
const outPath = path.join(OUT, 'en', 'about-us', '.content.xml');
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, xml, 'utf-8');
console.log(JSON.stringify({ converted: 'us/en/about-us → en/about-us node', out: outPath }));
