import { writeFile, mkdir, cp } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-about-us';
const VERSION = '1.0.1';
const GROUP = 'zurn';
// The existing About Us page under the English language master (delivery /en/about-us).
const PAGE_ROOT = '/content/zurn/language-masters/en/about-us';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

const contentDest = path.join(buildDir, 'jcr_root', PAGE_ROOT.replace(/^\//, ''));
await mkdir(contentDest, { recursive: true });

// en/about-us already exists as a cq:Page. Ship the full page node .content.xml,
// but filter only its jcr:content (mode=replace) so we swap the page content
// without disturbing the page node itself or any children.
await cp(
  path.join('migration-work', 'jcr-about-us', 'en', 'about-us', '.content.xml'),
  path.join(contentDest, '.content.xml'),
);

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${PAGE_ROOT}/jcr:content" mode="replace"/>
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
  <entry key="description">Zurn About Us page content at ${PAGE_ROOT} (delivery /en/about-us). Replaces the page's jcr:content with the migrated About Zurn content (intro, Why Zurn, Mission/Vision/Values, company history timeline). Default-content page: headings, paragraphs, lists, images.</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

console.log(JSON.stringify({ buildDir, filter: `${PAGE_ROOT}/jcr:content (replace)` }));
