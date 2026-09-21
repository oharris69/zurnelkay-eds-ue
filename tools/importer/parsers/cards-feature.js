/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.zurn.ca/fr.html (homepage template — #lkcontainer-d0baf9a111).
 * Project type: xwalk. Container block — one row per card mapping to a
 *   cards-feature-card item: image [reference], imageAlt [→ alt], text [richtext].
 *
 * Structure (Cards — first row is the block name; one row per card):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each card row  : Cell 1 = product photo (field:image; imageAlt → alt),
 *                    Cell 2 = body — icon + linked title + description (field:text).
 *
 * Each source card has TWO images: a small icon (.cmp-teaser__image .cmp-image)
 * and a large product photo (.cmp-image__link, a scene7 asset). The photo is the
 * card's dedicated image cell; the icon stays inline in the body. The card title
 * is an <h3> wrapped in an <a class="cmp-teaser__link"> — that anchor IS the
 * card's link, so it is kept intact (not duplicated as a separate CTA).
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.teaserv2'));
  const cells = [];

  cards.forEach((card) => {
    // Product photo — the linked scene7 image (distinct from the small icon).
    const photo = card.querySelector('.cmp-image__link img');
    // Icon — the teaser's own image container.
    const icon = card.querySelector('.cmp-teaser__image img, .cmp-image:not(.cmp-image__link) img');

    // Body: icon + linked title + description paragraphs (richtext).
    const bodyEls = [];
    if (icon && icon !== photo) bodyEls.push(icon);
    // Title: the source wraps the <h3> inside an <a>. Emitting that anchor as-is
    // yields "[### Title](url)" (literal heading marker inside a link). Instead
    // emit a linked heading — <h3><a href>Title</a></h3> — so md renders a proper
    // heading whose text links out.
    const title = card.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5');
    const titleLink = card.querySelector('a.cmp-teaser__link');
    if (title) {
      const href = titleLink ? titleLink.getAttribute('href') : null;
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = title.textContent.replace(/\s+/g, ' ').trim();
        title.textContent = '';
        title.appendChild(a);
      }
      bodyEls.push(title);
    } else if (titleLink) {
      bodyEls.push(titleLink);
    }
    const desc = card.querySelector('.cmp-teaser__description, .cmp-teaser__content') || card;
    Array.from(desc.querySelectorAll('p'))
      .filter((el) => el.textContent.trim())
      .forEach((el) => bodyEls.push(el));

    if (!bodyEls.length && !photo) return;

    // Cell 1: product photo (field:image; imageAlt collapses into the <img> alt).
    // Always emit the field:image hint — even when the (lazy-loaded) photo is
    // absent — so md2jcr can map the image column; an authored image drops in later.
    const photoCell = document.createDocumentFragment();
    photoCell.appendChild(document.createComment(' field:image '));
    if (photo) photoCell.appendChild(photo);

    // Cell 2: body text (field:text).
    const bodyCell = document.createDocumentFragment();
    if (bodyEls.length) {
      bodyCell.appendChild(document.createComment(' field:text '));
      bodyEls.forEach((el) => bodyCell.appendChild(el));
    }

    // Convention: both cells always present, even if one is empty.
    cells.push([photoCell, bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
