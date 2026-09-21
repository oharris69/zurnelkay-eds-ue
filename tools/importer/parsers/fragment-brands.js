/* eslint-disable */
/* global WebImporter */
/**
 * Parser for fragment-brands. Base: fragment.
 * Source: https://www.zurn.ca/fr/markets/k12education (market-solution template —
 *   .experiencefragment.w-max-1300)
 * Project type: xwalk. Simple fragment block — the model has a single
 *   `reference` field (component: aem-content). The block's decorate() reads the
 *   first anchor's href (or the cell text) as the fragment path and inlines it.
 *
 * Intent: reference a shared "brands portfolio" experience fragment reused across
 *   market pages, so it is authored once and reused. The source is an inline
 *   AEM experience-fragment component that does NOT expose its XF/content path in
 *   the scraped DOM, so we emit a stable EDS fragment path derived from the
 *   fragment's modifier class (cmp-experiencefragment--{name}). Authors can
 *   re-point the reference in Universal Editor if needed.
 *
 * Structure (Fragment — 1 column, 1 content row):
 *   Row 1 (header) : block name (added by createBlock).
 *   Row 2          : field:reference — a single link to the fragment path.
 */
export default function parse(element, { document }) {
  // Derive a fragment name from the experience-fragment modifier class, e.g.
  // "cmp-experiencefragment--brands" -> "brands". Fall back to "brands".
  const inner = element.querySelector('[class*="cmp-experiencefragment--"]') || element;
  let fragName = 'brands';
  const modClass = Array.from(inner.classList).find((c) => c.startsWith('cmp-experiencefragment--'));
  if (modClass) {
    fragName = modClass.replace('cmp-experiencefragment--', '').trim() || 'brands';
  }

  // Build the EDS fragment path. Fragments are authored under a shared
  // /fr/fragments/ root for this (French) market-solution template.
  const fragmentPath = `/fr/fragments/${fragName}`;

  // field:reference — a single anchor to the fragment path.
  const link = document.createElement('a');
  link.setAttribute('href', fragmentPath);
  link.textContent = fragmentPath;

  const refCell = document.createDocumentFragment();
  refCell.appendChild(document.createComment(' field:reference '));
  refCell.appendChild(link);

  const cells = [[refCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'fragment-brands', cells });
  element.replaceWith(block);
}
