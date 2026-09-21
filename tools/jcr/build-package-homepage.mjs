import { readFile, writeFile, mkdir, cp, readdir } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-homepage';
const VERSION = '1.0.0';
const GROUP = 'zurn';
// The FR homepage lives AT the French language master root node (fr).
const SITE_ROOT = '/content/zurn/language-masters/fr';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

const contentDest = path.join(buildDir, 'jcr_root', SITE_ROOT.replace(/^\//, ''));
await mkdir(contentDest, { recursive: true });
// migration-work/jcr-homepage/fr/.content.xml -> jcr_root/.../fr/.content.xml
// (the converted path is `fr`; SITE_ROOT already ends in /fr, so copy the .content.xml onto the fr node)
await cp(
  path.join('migration-work', 'jcr-homepage', 'fr', '.content.xml'),
  path.join(contentDest, '.content.xml'),
);

// Ship the newsletter form field-definition JSON as an nt:file at the fr root so
// the franklin.delivery servlet serves it at /fr/newsletter-signup-form.json
// (the form block fetches this relative sheet). FileVault imports a plain file
// as nt:file + nt:resource automatically.
await cp(
  path.join('content', 'fr', 'newsletter-signup-form.json'),
  path.join(contentDest, 'newsletter-signup-form.json'),
);

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

// The fr node currently holds the already-published markets/ subtree. This
// package turns fr into a cq:Page (the homepage) and adds the newsletter form
// JSON, but must NOT wipe markets. So the filter covers the fr root with an
// explicit exclude for markets — FileVault then imports the fr page node +
// jcr:content and the form file, leaving fr/markets untouched.
await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${SITE_ROOT}">
    <exclude pattern="${SITE_ROOT}/markets(/.*)?"/>
  </filter>
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
  <entry key="description">Zurn homepage template — the French homepage at ${SITE_ROOT} (7 blocks: carousel-hero, cards-feature, tabs-resource, carousel-markets, carousel-media, columns-band, form)</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

console.log(JSON.stringify({ buildDir, root: `${SITE_ROOT} (fr homepage node)`, filter: `${SITE_ROOT}/jcr:content` }));
