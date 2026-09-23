import { writeFile, mkdir, cp } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-en-homepage';
const VERSION = '1.0.3';
const GROUP = 'zurn';
// The EN homepage lives AT the English language master node, which maps to `/`.
const SITE_ROOT = '/content/zurn/language-masters/en';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

const contentDest = path.join(buildDir, 'jcr_root', SITE_ROOT.replace(/^\//, ''));
await mkdir(contentDest, { recursive: true });

// The en homepage page node (cq:Page with the Zurn homepage jcr:content).
// `en` is ALREADY a cq:Page (it currently serves the WKND boilerplate at /), and
// it has 88 published product pages under en/products that MUST be preserved.
// So we do NOT replace the whole en node — we replace only its jcr:content
// (see filter below), swapping WKND content for the Zurn homepage.
await cp(
  path.join('migration-work', 'jcr-en-homepage', 'en', '.content.xml'),
  path.join(contentDest, '.content.xml'),
);

// The newsletter form field-definition JSON as an nt:file at the en root
// (served at /newsletter-signup-form.json — the homepage form block fetches it,
//  relative to the page, and the en homepage maps to /).
await cp(
  path.join('content', 'fr', 'newsletter-signup-form.json'),
  path.join(contentDest, 'newsletter-signup-form.json'),
);

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

// Two surgical filters, both mode=replace:
//  1) en/jcr:content — replace the page's content (WKND -> Zurn homepage). The
//     en page node itself and its en/products child subtree are OUTSIDE this
//     root, so they are untouched (the 88 published product pages are safe).
//  2) the newsletter JSON file.
// FileVault extracts the jcr:content node from the serialized cq:Page in
// .content.xml when the filter root points at .../en/jcr:content.
await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${SITE_ROOT}/jcr:content" mode="replace"/>
  <filter root="${SITE_ROOT}/newsletter-signup-form.json" mode="replace"/>
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
  <entry key="description">Zurn US-English homepage at ${SITE_ROOT} (maps to /). Replaces the en page's jcr:content (WKND boilerplate) with the Zurn homepage (6 blocks). en/products (88 published pages) is outside the filter and untouched. Ships newsletter-signup-form.json as nt:file.</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

console.log(JSON.stringify({ buildDir, filters: [`${SITE_ROOT}/jcr:content (replace)`, `${SITE_ROOT}/newsletter-signup-form.json`], note: 'en/products preserved (outside filter)' }));
