import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { isAuthorEnvironment } from '../../scripts/scripts.js';
import { img, a } from '../../scripts/dom-helpers.js';

import {
  getLanguage, getSiteName, PATH_PREFIX,
} from '../../scripts/utils.js';

// Real Zurn footer lockup ("zurn•elkay Water Solutions"), served from the DAM.
const FOOTER_LOGO = '/content/dam/zurn/en/brand/zurn-footer-logo-bottom.svg';

/**
 * Replace the text brand line (first <p><strong>…</strong></p>) with the real
 * footer logo image. No-op if the brand line isn't present.
 */
function applyFooterLogo(footer, langCode) {
  const brandP = footer.querySelector('p');
  if (!brandP) return;
  const home = langCode === 'en' ? '/' : `/${langCode}`;
  const logo = img({ src: FOOTER_LOGO, alt: 'Zurn Elkay Water Solutions', class: 'footer-logo' });
  const link = a({ href: home, 'aria-label': 'Zurn Elkay Water Solutions', class: 'footer-logo-link' });
  link.append(logo);
  brandP.textContent = '';
  brandP.append(link);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const langCode = getLanguage();
  const siteName = await getSiteName();
  const isAuthor = isAuthorEnvironment();
  let footerPath = `/${langCode}/footer`;

  if (isAuthor) {
    footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : `/content/${siteName}${PATH_PREFIX}/${langCode}/footer`;
  }

  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Swap the text brand line for the real Zurn footer logo (from the DAM).
  applyFooterLogo(footer, langCode);

  block.append(footer);
}
