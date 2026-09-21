import { readFile, writeFile, mkdir, cp, readdir } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-market-solution';
const VERSION = '1.0.0';
const GROUP = 'zurn';
// FR market pages live under the French language master.
const SITE_ROOT = '/content/zurn/language-masters/fr';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

const contentDest = path.join(buildDir, 'jcr_root', SITE_ROOT.replace(/^\//, ''));
await mkdir(contentDest, { recursive: true });
// migration-work/jcr-market/fr/markets/... -> jcr_root/.../fr/markets/...
// (the converted paths are fr/markets/<page>; strip the leading 'fr/' since SITE_ROOT already ends in /fr)
await cp(path.join('migration-work', 'jcr-market', 'fr', 'markets'), path.join(contentDest, 'markets'), { recursive: true });

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${SITE_ROOT}/markets"/>
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
  <entry key="description">Zurn market-solution template — 11 French market pages under ${SITE_ROOT}/markets</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

async function countXml(dir){let n=0;for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())n+=await countXml(p);else if(e.name==='.content.xml')n+=1;}return n;}
const pages = await countXml(path.join(contentDest,'markets'));
console.log(JSON.stringify({ buildDir, pages, filter: `${SITE_ROOT}/markets` }));
