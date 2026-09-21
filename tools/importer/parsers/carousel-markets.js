/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-markets. Base: carousel.
 * Source: https://www.zurn.ca/fr.html (homepage template — #lkcontainer-04137134ae).
 * Project type: xwalk. Container block — one row per market card (slide) mapping
 *   to a carousel-markets-card item: image [reference], imageAlt [→ alt],
 *   text [richtext].
 *
 * Structure (Carousel — first row is the block name; one row per slide):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each card row  : Cell 1 = market image (field:image; imageAlt → alt),
 *                    Cell 2 = market name + description + CTA link (field:text).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  items.forEach((item) => {
    const imgs = Array.from(item.querySelectorAll('img')).filter(
      (im) => !(im.getAttribute('src') || '').startsWith('data:'),
    );
    const image = imgs[0] || null;

    // Text: market name (linked heading) + description + CTA link (richtext).
    const desc = item.querySelector('.cmp-teaser__description, .cmp-teaser__content, .cmp-mediatext') || item;
    const textEls = [];
    const title = item.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (title) {
      // The source wraps the heading in an anchor (<a><h#>…</h#></a>), which
      // would render as "[#### Title](url)". Emit a linked heading instead —
      // <h#><a href>Title</a></h#> — so md yields a proper heading that links out.
      const wrap = title.closest('a');
      const href = wrap && wrap !== title ? wrap.getAttribute('href') : null;
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = title.textContent.replace(/\s+/g, ' ').trim();
        title.textContent = '';
        title.appendChild(a);
      }
      textEls.push(title);
    }
    Array.from(desc.querySelectorAll('p'))
      .filter((el) => el.textContent.trim())
      .forEach((el) => textEls.push(el));
    const cta = item.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href]');
    if (cta && !textEls.includes(cta)) textEls.push(cta);

    if (!image && !textEls.length) return;

    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(image);
    }

    const textCell = document.createDocumentFragment();
    if (textEls.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textEls.forEach((el) => textCell.appendChild(el));
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-markets', cells });
  element.replaceWith(block);
}
