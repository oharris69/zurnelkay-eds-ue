/*
 * build-package.mjs — assemble an installable AEM (FileVault) content package
 * from the converted JCR under migration-work/jcr/products.
 *
 * Layout produced:
 *   <buildDir>/jcr_root/content/zurn/products/.../.content.xml
 *   <buildDir>/META-INF/vault/filter.xml
 *   <buildDir>/META-INF/vault/properties.xml
 * Then zipped to migration-work/dist/<name>-<version>.zip
 */
import { readFile, writeFile, mkdir, readdir, cp } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const NAME = 'zurn-product-detail';
const VERSION = '1.0.1';
const GROUP = 'zurn';
// Site root is the language-masters/en tree (maps to / via the delivery mountpoint),
// NOT the bare /content/zurn — pages must live inside the site to preview/publish.
const SITE_ROOT = '/content/zurn/language-masters/en';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

// jcr_root/content/zurn/language-masters/en — copy converted pages under it
const contentDest = path.join(buildDir, 'jcr_root', SITE_ROOT.replace(/^\//, ''));
await mkdir(contentDest, { recursive: true });
// copy migration-work/jcr/products -> jcr_root/content/zurn/language-masters/en/products
await cp(path.join('migration-work', 'jcr', 'products'), path.join(contentDest, 'products'), { recursive: true });

// META-INF/vault
const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

const filterXml = `<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${SITE_ROOT}/products"/>
</workspaceFilter>
`;
await writeFile(path.join(vaultDir, 'filter.xml'), filterXml, 'utf-8');

const propsXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>FileVault Package Definition</comment>
  <entry key="name">${NAME}</entry>
  <entry key="version">${VERSION}</entry>
  <entry key="group">${GROUP}</entry>
  <entry key="description">Zurn product-detail template — 88 imported pages (breadcrumb-product, columns-product, download-resources) under ${SITE_ROOT}/products</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
  <entry key="allowIndexDefinitions">false</entry>
</properties>
`;
await writeFile(path.join(vaultDir, 'properties.xml'), propsXml, 'utf-8');

// Count pages staged
async function countXml(dir) {
  let n = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) n += await countXml(p);
    else if (e.name === '.content.xml') n += 1;
  }
  return n;
}
const pages = await countXml(path.join(contentDest, 'products'));
console.log(JSON.stringify({ buildDir, pages, filter: `${SITE_ROOT}/products`, version: VERSION }));
