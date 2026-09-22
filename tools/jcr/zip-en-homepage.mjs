import archiver from '/home/node/.excat-marketplaces/excat-marketplace/excat/tools/excatops-mcp/node_modules/archiver/index.js';
import { createWriteStream } from 'fs';
import path from 'path';
const buildDir = 'migration-work/dist/zurn-en-homepage-1.0.1';
const outZip = 'migration-work/dist/zurn-en-homepage-1.0.1.zip';
await new Promise((resolve, reject) => {
  const output = createWriteStream(outZip);
  const archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', resolve); archive.on('error', reject); archive.pipe(output);
  archive.directory(path.join(buildDir, 'jcr_root'), 'jcr_root');
  archive.directory(path.join(buildDir, 'META-INF'), 'META-INF');
  archive.finalize();
});
console.log('zip written:', outZip);
