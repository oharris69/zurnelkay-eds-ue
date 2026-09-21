/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: zurn contact-form injection.
 *
 * The market-solution contact form is a HubSpot form injected client-side, so
 * the scraped HTML has no real <form> — only the field LABELS render as loose
 * text inside the .lkembed.hs-neutral embed container. A block parser can't
 * detect a form that isn't in the DOM, so instead we replace that embed's
 * content with an EDS Form block that references the pre-built form JSON sheet
 * (market-contact-form.json, authored from the analysed field list).
 *
 * Runs in beforeTransform (while the embed element still exists) so the emitted
 * <table> becomes a proper `form` block. The block markup is:
 *   <div class="form"><div><div><a href="market-contact-form.json">…</a></div></div></div>
 * which md2* renders to the form block referencing the sheet.
 */

const FORM_EMBED_SELECTOR = '.lkembed.hs-neutral';
const FORM_JSON = 'market-contact-form.json';

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const embed = element.querySelector(FORM_EMBED_SELECTOR);
  if (!embed) return;

  const doc = element.ownerDocument || document;

  // Build a form block table: header cell "Form", body cell = link to the JSON sheet.
  const table = doc.createElement('table');
  const headRow = doc.createElement('tr');
  const headCell = doc.createElement('td');
  headCell.textContent = 'Form';
  headRow.appendChild(headCell);
  table.appendChild(headRow);

  const bodyRow = doc.createElement('tr');
  const bodyCell = doc.createElement('td');
  const link = doc.createElement('a');
  link.setAttribute('href', FORM_JSON);
  link.textContent = FORM_JSON;
  bodyCell.appendChild(link);
  bodyRow.appendChild(bodyCell);
  table.appendChild(bodyRow);

  // Replace the embed's loose field-label content with the form block table.
  embed.replaceWith(table);
}
