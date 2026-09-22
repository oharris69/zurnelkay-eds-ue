import { writeFile, mkdir, cp } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-homepage';
const VERSION = '1.0.2';
const GROUP = 'zurn';
// The FR homepage lives AT the French language master root node (fr).
const SITE_ROOT = '/content/zurn/language-masters/fr';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

const contentDest = path.join(buildDir, 'jcr_root', SITE_ROOT.replace(/^\//, ''));
await mkdir(contentDest, { recursive: true });

// 1) The fr homepage page node itself: fr/.content.xml (turns fr into a cq:Page).
await cp(
  path.join('migration-work', 'jcr-homepage', 'fr', '.content.xml'),
  path.join(contentDest, '.content.xml'),
);

// 2) The newsletter form field-definition JSON as an nt:file at the fr root
//    (served at /fr/newsletter-signup-form.json; the homepage form block fetches it).
await cp(
  path.join('content', 'fr', 'newsletter-signup-form.json'),
  path.join(contentDest, 'newsletter-signup-form.json'),
);

// 3) The 11 market pages nested under fr/markets. v1.0.0 of the homepage package
//    excluded markets, but FileVault can't cleanly convert the pre-existing `fr`
//    FOLDER (auto-created by the market package) into a cq:Page while preserving
//    a child subtree — so `fr` stayed a folder and /fr.html had no page to render.
//    This combined package ships the WHOLE fr subtree (homepage + markets) under a
//    single filter root with no exclude, so FileVault replaces `fr` outright:
//    `fr` becomes a cq:Page with markets correctly nested beneath it.
await cp(
  path.join('migration-work', 'jcr-market', 'fr', 'markets'),
  path.join(contentDest, 'markets'),
  { recursive: true },
);

// 4) The market contact-form JSON as an nt:file under fr/markets
//    (served at /fr/markets/market-contact-form.json).
await cp(
  path.join('content', 'fr', 'markets', 'market-contact-form.json'),
  path.join(contentDest, 'markets', 'market-contact-form.json'),
);

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

// Single filter root on fr with mode="replace". By default FileVault MERGES into
// an existing node and will NOT change its primary type — which is why v1.0.1
// left `fr` as an nt:folder (the cq:Page conversion silently no-op'd). mode=replace
// forces FileVault to delete the existing fr node and recreate it from the package,
// so nt:folder → cq:Page takes effect. The package contains the full fr subtree
// (homepage + 11 markets + both form JSONs), so the replace loses nothing.
await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${SITE_ROOT}" mode="replace"/>
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
  <entry key="description">Zurn FR homepage + 11 market pages at ${SITE_ROOT}. Combined package: turns the fr node into a cq:Page (homepage — 7 blocks) with markets/ nested beneath. Ships newsletter-signup-form.json and market-contact-form.json as nt:file.</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

console.log(JSON.stringify({ buildDir, root: SITE_ROOT, filter: SITE_ROOT, note: 'whole fr subtree, no exclude' }));
