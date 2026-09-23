/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: zurn site-wide cleanup.
 *
 * Removes non-authorable site chrome (global header/footer experience
 * fragments, cookie-consent SDK, third-party push/interactive anchors,
 * sync iframes) so the import contains only page-level authorable content.
 *
 * Every selector below was verified by reading migration-work/cleaned.html:
 *  - #hs-web-interactives-top-push-anchor  (HubSpot interactives anchor, top of <body>)
 *  - #aem-remote-header                    (global brand/site header XF)
 *  - #aem-remote-footer                    (global site footer XF)
 *  - #onetrust-consent-sdk                 (OneTrust cookie consent banner + prefs modal)
 *  - iframe#db-sync / other sync/resize iframes (tracking, non-authorable)
 *
 * Authorable page content lives inside <main> (breadcrumb .lk-breadcrumbs,
 * product grid #PDPGrid, resources .ze-resources) and is left untouched.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / consent that would otherwise interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk', // OneTrust cookie banner + preference-center modal
      '#hs-web-interactives-top-push-anchor', // HubSpot interactives push anchor

      // --- Non-authorable chrome inside the resources section (verified in
      //     the bd-snapshot the import runs against) ---
      'nav.pdp-carousel-header', // sticky "RESOURCES" tab bar above the band
      '.ze-resources > img', // decorative triangles background SVG in the band
      '.ze-return-to-top', // "Return to Top" anchor
      '.lk-product-media-modal', // hidden product-image modal wrapper (thumbnail carousel)
      '.modal', // any Bootstrap modal (mainImageModal/mediaImageModal etc.) — never authorable
      '#mainImageModal', // product image lightbox modal
      '#mediaImageModal', // media image lightbox modal
      '.QSIFeedbackButton', // Qualtrics "Give Feedback" widget + its target container
      '#QSIFeedbackButton-target-container',
      '#db_lr_pixel_ad', // LiveRamp tracking pixel
      'img[src*="rlcdn.com"]', // any other rlcdn tracking pixels
    ]);

    // Zurn markup puts the card's IMAGE URL in the anchor's title attribute
    // (e.g. title="https://s7d4.scene7.com/is/image/Elkay/...") on linked
    // headings. When an anchor auto-decorates to a Button block, that URL
    // leaks into the button's Title field. Strip any title attribute whose
    // value is a URL so buttons/links don't carry an image URL as their title.
    element.querySelectorAll('a[title]').forEach((a) => {
      const t = (a.getAttribute('title') || '').trim();
      if (/^https?:\/\//i.test(t) || t.includes('scene7.com') || /\.(png|jpe?g|svg|gif|webp)(\?|$)/i.test(t)) {
        a.removeAttribute('title');
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome and tracking elements.
    WebImporter.DOMUtils.remove(element, [
      '#aem-remote-header', // global brand/site header experience fragment
      '#aem-remote-footer', // global site footer experience fragment
      'iframe', // db-sync / onetrust-text-resize / archetype tracking iframes
      'noscript',
      'style',
      'script',
    ]);
  }
}
