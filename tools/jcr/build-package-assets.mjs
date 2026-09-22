/*
 * Build an AEM Assets (DAM) FileVault package from the staged homepage assets.
 * Each file becomes a dam:Asset with an `original` rendition, laid out to match
 * the existing DAM folders under /content/dam/zurn/en:
 *   brand/        → logos (Zurn wordmark + recreated sibling brand marks)
 *   images/       → FR homepage imagery (heroes, feature cards, tiles)
 *   images/en/    → EN homepage imagery (scene7 originals)
 *   images/icons/ → resource/feature icons
 *   documents/    → PDFs (if any)
 *
 * Vault dam:Asset serialization: <name>/.content.xml is the full aggregate;
 * the binary lives at <name>/_jcr_content/renditions/original.
 */
import { readdir, readFile, writeFile, mkdir, cp, stat } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-homepage-assets';
const VERSION = '1.0.0';
const GROUP = 'zurn';
const DAM_ROOT = '/content/dam/zurn/en';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);
const STAGE = 'migration-work/assets-staging';

// staging subdir → DAM subpath under /content/dam/zurn/en
const FOLDER_MAP = {
  brand: 'brand',
  images: 'images',
  'images-en': 'images/en',
  'images-icons': 'images/icons',
  documents: 'documents',
};

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function assetContentXml(mime, title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:dam="http://www.day.com/dam/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" jcr:primaryType="dam:Asset">
  <jcr:content jcr:primaryType="dam:AssetContent">
    <metadata jcr:primaryType="nt:unstructured" dam:MIMEtype="${mime}" dc:title="${xmlEscape(title)}"/>
    <renditions jcr:primaryType="nt:folder">
      <original jcr:primaryType="nt:file">
        <jcr:content jcr:primaryType="nt:resource" jcr:mimeType="${mime}"/>
      </original>
    </renditions>
  </jcr:content>
</jcr:root>
`;
}

const jcrRootDir = path.join(buildDir, 'jcr_root', DAM_ROOT.replace(/^\//, ''));
const filters = [];
let count = 0;

for (const [sub, damSub] of Object.entries(FOLDER_MAP)) {
  const srcDir = path.join(STAGE, sub);
  let files;
  try { files = await readdir(srcDir); } catch { continue; }
  files = files.filter((f) => !f.startsWith('.') && !f.startsWith('*'));
  if (!files.length) continue;

  for (const file of files) {
    const src = path.join(srcDir, file);
    const st = await stat(src);
    if (!st.isFile()) continue;
    const ext = path.extname(file).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';

    // <name>/.content.xml (dam:Asset aggregate)
    const assetDir = path.join(jcrRootDir, damSub, file);
    await mkdir(assetDir, { recursive: true });
    await writeFile(path.join(assetDir, '.content.xml'), assetContentXml(mime, file));

    // binary at <name>/_jcr_content/renditions/original
    const origDir = path.join(assetDir, '_jcr_content', 'renditions');
    await mkdir(origDir, { recursive: true });
    await cp(src, path.join(origDir, 'original'));
    count += 1;
  }
  // Only push top-level filter roots; nested subpaths (images/en, images/icons)
  // are covered by their parent (images) to avoid overlapping filter roots.
  const root = `${DAM_ROOT}/${damSub.split('/')[0]}`;
  if (!filters.includes(root)) filters.push(root);
}

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
${filters.map((r) => `  <filter root="${r}"/>`).join('\n')}
</workspaceFilter>
`, 'utf-8');

await writeFile(path.join(vaultDir, 'properties.xml'),
`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>FileVault Package Definition</comment>
  <entry key="name">${NAME}</entry>
  <entry key="version">${VERSION}</entry>
  <entry key="group">${GROUP}</entry>
  <entry key="description">Zurn homepage assets for manual DAM install under ${DAM_ROOT}: logos (brand/), EN + FR homepage imagery (images/, images/en/), icons (images/icons/). Each is a dam:Asset with an original rendition.</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

console.log(JSON.stringify({ buildDir, assets: count, filters }, null, 1));
