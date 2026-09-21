/*
 * da-to-jcr.mjs — Convert DA .plain.html (block divs) to Franklin JCR XML.
 *
 * DA block shape:  <div class="blockName"> <div>(row) <div>(cell)…</div> </div>
 * md2jcr expects block content as HTML <table>. We rewrite each top-level
 * block div into a <table>: block name -> single header cell; each row div ->
 * <tr>; each cell div -> <td> (field-hint comments and inner HTML preserved).
 * Section-metadata and page metadata divs are converted the same way.
 * Non-block content (headings, paragraphs, lists, links) is left as-is so it
 * becomes default content. The whole <main> is then handed to helix-importer's
 * md2jcr (HTML path) with the project component models.
 */
import { JSDOM } from '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/jsdom/lib/api.js';
import { md2jcr } from '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/@adobe/helix-importer/src/index.js';
import { readFile } from 'fs/promises';

// Human-friendly block title from a class name, matching component-definition titles.
function titleForBlock(className, definition) {
  // find the definition whose id matches the block class
  const groups = definition?.groups || [];
  for (const g of groups) {
    for (const c of (g.components || [])) {
      if (c.id === className) return c.title || className;
    }
  }
  // fallback: Title Case the kebab id
  return className.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// Build the set of known block ids from the component definition, plus the two
// structural blocks the importer always emits.
function knownBlockIds(definition) {
  const ids = new Set(['section-metadata', 'metadata']);
  for (const g of (definition?.groups || [])) {
    for (const c of (g.components || [])) {
      if (c.id) ids.add(c.id);
    }
  }
  return ids;
}

function isBlockDiv(div, knownIds) {
  // A block div has a single kebab-case class that matches a KNOWN component id.
  // Divs with unknown classes (import-parser artifacts like compliance badges or
  // misfired product-spec parses) are NOT blocks — they get unwrapped to default
  // content so md2jcr never sees a table for a component that has no model.
  if (div.tagName !== 'DIV') return false;
  const cls = div.getAttribute('class');
  if (!cls) return false;
  if (/\s/.test(cls)) return false;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cls)) return false;
  return knownIds.has(cls);
}

function blockDivToTable(doc, div, definition) {
  const cls = div.getAttribute('class');
  const table = doc.createElement('table');
  // Header row: block title (single cell)
  const thead = doc.createElement('tr');
  const th = doc.createElement('td');
  th.textContent = titleForBlock(cls, definition);
  thead.appendChild(th);
  table.appendChild(thead);
  // Body rows: each direct child div is a row
  for (const rowDiv of [...div.children]) {
    if (rowDiv.tagName !== 'DIV') continue;
    const tr = doc.createElement('tr');
    const cells = [...rowDiv.children].filter((c) => c.tagName === 'DIV');
    if (cells.length === 0) {
      // row with no cell divs: treat the row itself as a single cell
      const td = doc.createElement('td');
      td.innerHTML = rowDiv.innerHTML;
      tr.appendChild(td);
    } else {
      for (const cellDiv of cells) {
        const td = doc.createElement('td');
        td.innerHTML = cellDiv.innerHTML; // preserves <!-- field:x --> + content
        tr.appendChild(td);
      }
    }
    table.appendChild(tr);
  }
  return table;
}

function transformMain(doc, definition) {
  const main = doc.querySelector('main');
  const knownIds = knownBlockIds(definition);

  // First, unwrap divs whose single class is NOT a known component id — these are
  // import-parser artifacts (compliance badges, misfired product-spec parses).
  // Replace each with its inner content so it becomes default content, never a
  // table for a non-existent component. Iterate until none remain (handles any
  // nesting), matching only single-kebab-class divs to avoid touching layout divs.
  let unwrapped = true;
  while (unwrapped) {
    unwrapped = false;
    for (const div of [...main.querySelectorAll('div[class]')]) {
      const cls = div.getAttribute('class');
      if (!cls || /\s/.test(cls) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cls)) continue;
      if (knownIds.has(cls)) continue;
      // unknown-class block-like div → unwrap to a paragraph of its text content
      const p = doc.createElement('p');
      p.textContent = div.textContent.trim();
      div.replaceWith(p);
      unwrapped = true;
    }
  }

  // Now convert the known block divs to tables (outermost first).
  const candidates = [...main.querySelectorAll('div[class]')].filter((d) => isBlockDiv(d, knownIds));
  for (const div of candidates) {
    if (div.closest('table')) continue;
    const table = blockDivToTable(doc, div, definition);
    div.replaceWith(table);
  }
  return main;
}

// md2jcr occasionally leaves a raw `&` in attribute values (e.g. query-string
// links like `?productNumber=Z-882&type=options`), producing not-well-formed XML.
// Escape any ampersand that isn't already the start of a valid entity.
function escapeStrayAmpersands(xml) {
  return xml.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
}

export async function convertFileToJcr(plainHtmlPath, title, components) {
  const plainHtml = await readFile(plainHtmlPath, 'utf-8');
  const full = `<!DOCTYPE html><html><head><title>${title.replace(/</g, '&lt;')}</title></head><body><main>${plainHtml}</main></body></html>`;
  const dom = new JSDOM(full);
  const doc = dom.window.document;
  transformMain(doc, components.definition);
  const res = await md2jcr('https://example.com/p', doc, undefined, {}, { components });
  return escapeStrayAmpersands(res.jcr);
}

// CLI test
if (process.argv[2]) {
  const [, , plainPath, title] = process.argv;
  const models = JSON.parse(await readFile('component-models.json', 'utf-8'));
  const definition = JSON.parse(await readFile('component-definition.json', 'utf-8'));
  const filters = JSON.parse(await readFile('component-filters.json', 'utf-8'));
  const xml = await convertFileToJcr(plainPath, title || 'Page', { models, definition, filters });
  console.log(xml);
}
