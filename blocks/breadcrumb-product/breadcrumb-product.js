/**
 * breadcrumb-product — horizontal product-hierarchy navigation trail.
 *
 * Authored content: each block row is one breadcrumb crumb. A crumb that
 * contains a link is a linked ancestor; a crumb with plain text is the
 * current page. Crumbs render inline, separated by a "/" delimiter, in
 * source order.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  const rows = [...block.children];

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-product-list';

  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-product-item';

    const link = row.querySelector('a');
    if (link) {
      link.className = 'breadcrumb-product-link';
      li.append(link);
    } else {
      const text = (row.textContent || '').trim();
      const span = document.createElement('span');
      span.className = 'breadcrumb-product-current';
      span.setAttribute('aria-current', 'page');
      span.textContent = text;
      li.append(span);
    }

    ol.append(li);
  });

  block.textContent = '';
  nav.append(ol);
  block.append(nav);
}
