/**
 * download-resources — dark "Resources" band with a list of downloadable
 * document links, each shown with a download icon.
 *
 * Authored content: each block row is one resource. A row may be either
 *   [ link ]                 → the link text is the label, or
 *   [ group label | link ]   → an optional grouping label + the link.
 * A leading text-only row (no link) is treated as a subgroup heading
 * (e.g. "Other").
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
function downloadIconSvg() {
  return `
    <svg class="download-resources-icon" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 2v11M5 9l5 5 5-5M3 16h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;
}

export default function decorate(block) {
  const rows = [...block.children];

  const list = document.createElement('ul');
  list.className = 'download-resources-list';
  list.setAttribute('role', 'list');

  rows.forEach((row) => {
    const link = row.querySelector('a');

    if (!link) {
      // Text-only row → subgroup heading.
      const label = (row.textContent || '').trim();
      if (label) {
        const groupHeading = document.createElement('p');
        groupHeading.className = 'download-resources-group';
        groupHeading.textContent = label;
        list.append(groupHeading);
      }
      return;
    }

    const li = document.createElement('li');
    li.className = 'download-resources-item';

    link.classList.add('download-resources-link');
    if (!link.hasAttribute('download')) link.setAttribute('download', '');
    link.insertAdjacentHTML('afterbegin', downloadIconSvg());

    li.append(link);
    list.append(li);
  });

  block.textContent = '';
  block.append(list);
}
