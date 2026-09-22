import { writeFile, mkdir, cp } from 'fs/promises';
import path from 'path';

const NAME = 'zurn-nav-footer';
const VERSION = '1.0.1';
const GROUP = 'zurn';
const LM = '/content/zurn/language-masters';
const buildDir = path.join('migration-work', 'dist', `${NAME}-${VERSION}`);

const jcrRoot = path.join(buildDir, 'jcr_root', LM.replace(/^\//, ''));

// nav + footer child pages for both en and fr. These are NEW nodes (they don't
// exist yet), so a plain additive filter on each path is enough — no replace.
const filters = [];
for (const lang of ['en', 'fr']) {
  for (const frag of ['nav', 'footer']) {
    const dest = path.join(jcrRoot, lang, frag);
    await mkdir(dest, { recursive: true });
    await cp(
      path.join('migration-work', 'jcr-nav-footer', lang, frag, '.content.xml'),
      path.join(dest, '.content.xml'),
    );
    filters.push(`${LM}/${lang}/${frag}`);
  }
}

const vaultDir = path.join(buildDir, 'META-INF', 'vault');
await mkdir(vaultDir, { recursive: true });

await writeFile(path.join(vaultDir, 'filter.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
${filters.map((r) => `  <filter root="${r}" mode="replace"/>`).join('\n')}
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
  <entry key="description">Zurn header nav + footer fragments for the en and fr language trees (/{en,fr}/nav and /{en,fr}/footer). The header/footer blocks load these at runtime; without them both trees rendered with no site chrome.</entry>
  <entry key="createdBy">excat-migration</entry>
  <entry key="packageType">content</entry>
  <entry key="requiresRoot">false</entry>
</properties>
`, 'utf-8');

console.log(JSON.stringify({ buildDir, filters }));
