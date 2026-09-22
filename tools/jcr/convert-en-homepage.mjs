import { convertFileToJcr } from './da-to-jcr.mjs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const models = JSON.parse(await readFile('component-models.json', 'utf-8'));
const definition = JSON.parse(await readFile('component-definition.json', 'utf-8'));
const filters = JSON.parse(await readFile('component-filters.json', 'utf-8'));
const components = { models, definition, filters };

// The US-English homepage report (imported from zurn.com/us/en → path us/en).
const reportPath = 'tools/importer/reports/us/en.report.json';
const OUT = 'migration-work/jcr-en-homepage';

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

const xml = await convertFileToJcr(plainPath, meta.title || meta.path, components);
// The EN homepage lives AT the `en` language-master node, so write en/.content.xml
const outPath = path.join(OUT, 'en', '.content.xml');
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, xml, 'utf-8');
console.log(JSON.stringify({ converted: 'us/en → en node', out: outPath, blocks: meta.blocks }));
