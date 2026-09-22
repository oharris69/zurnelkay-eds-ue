/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    items.forEach((item) => {
      const imgs = Array.from(item.querySelectorAll("img")).filter(
        (im) => !(im.getAttribute("src") || "").startsWith("data:")
      );
      const bgImage = imgs[0] || null;
      if (bgImage && !bgImage.getAttribute("alt")) {
        const withAlt = imgs.find((im) => im.getAttribute("alt"));
        if (withAlt) bgImage.setAttribute("alt", withAlt.getAttribute("alt"));
      }
      const desc = item.querySelector(".cmp-teaser__description, .lk-teaser, .cmp-teaser__content") || item;
      const textEls = Array.from(desc.querySelectorAll("h1, h2, h3, h4, h5, p")).filter((el) => el.textContent.trim());
      const cta = item.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href], a.cmp-button");
      if (cta) textEls.push(cta);
      if (!bgImage && !textEls.length) return;
      const imageCell = document2.createDocumentFragment();
      if (bgImage) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(bgImage);
      }
      const textCell = document2.createDocumentFragment();
      if (textEls.length) {
        textCell.appendChild(document2.createComment(" field:text "));
        textEls.forEach((el) => textCell.appendChild(el));
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(".teaserv2"));
    const cells = [];
    cards.forEach((card) => {
      const photo = card.querySelector(".cmp-image__link img");
      const icon = card.querySelector(".cmp-teaser__image img, .cmp-image:not(.cmp-image__link) img");
      const bodyEls = [];
      if (icon && icon !== photo) bodyEls.push(icon);
      const title = card.querySelector(".cmp-teaser__title, h1, h2, h3, h4, h5");
      const titleLink = card.querySelector("a.cmp-teaser__link");
      if (title) {
        const href = titleLink ? titleLink.getAttribute("href") : null;
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = title.textContent.replace(/\s+/g, " ").trim();
          title.textContent = "";
          title.appendChild(a);
        }
        bodyEls.push(title);
      } else if (titleLink) {
        bodyEls.push(titleLink);
      }
      const desc = card.querySelector(".cmp-teaser__description, .cmp-teaser__content") || card;
      Array.from(desc.querySelectorAll("p")).filter((el) => el.textContent.trim()).forEach((el) => bodyEls.push(el));
      if (!bodyEls.length && !photo) return;
      const photoCell = document2.createDocumentFragment();
      photoCell.appendChild(document2.createComment(" field:image "));
      if (photo) photoCell.appendChild(photo);
      const bodyCell = document2.createDocumentFragment();
      if (bodyEls.length) {
        bodyCell.appendChild(document2.createComment(" field:text "));
        bodyEls.forEach((el) => bodyCell.appendChild(el));
      }
      cells.push([photoCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-resource.js
  function parse3(element, { document: document2 }) {
    const labels = Array.from(element.querySelectorAll('.cmp-tabs__tab, [role="tab"]'));
    const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel, [role="tabpanel"]'));
    const cells = [];
    panels.forEach((panel, i) => {
      const labelEl = labels[i];
      const labelText = (labelEl ? labelEl.textContent : "").replace(/\s+/g, " ").trim();
      const labelCell = document2.createDocumentFragment();
      if (labelText) {
        labelCell.appendChild(document2.createComment(" field:label "));
        labelCell.appendChild(document2.createTextNode(labelText));
      }
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      const cards = Array.from(panel.querySelectorAll(".lkmediatext, .cmp-mediatext"));
      if (cards.length) {
        const seen = /* @__PURE__ */ new Set();
        cards.forEach((card) => {
          const media = card.querySelector(".cmp-mediatext") || card;
          if (seen.has(media)) return;
          seen.add(media);
          const descBlock = media.querySelector(".cmp-teaser__description");
          if (descBlock) {
            Array.from(descBlock.children).forEach((el) => textCell.appendChild(el));
          }
        });
      } else {
        Array.from(panel.querySelectorAll("h1, h2, h3, h4, h5, h6, p")).filter((el) => el.textContent.trim() && !el.querySelector("img")).forEach((el) => textCell.appendChild(el));
      }
      if (labelText || textCell.childNodes.length > 1) {
        cells.push([labelCell, textCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-markets.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    items.forEach((item) => {
      const imgs = Array.from(item.querySelectorAll("img")).filter(
        (im) => !(im.getAttribute("src") || "").startsWith("data:")
      );
      const image = imgs[0] || null;
      const desc = item.querySelector(".cmp-teaser__description, .cmp-teaser__content, .cmp-mediatext") || item;
      const textEls = [];
      const title = item.querySelector(".cmp-teaser__title, h1, h2, h3, h4, h5, h6");
      if (title) {
        const wrap = title.closest("a");
        const href = wrap && wrap !== title ? wrap.getAttribute("href") : null;
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = title.textContent.replace(/\s+/g, " ").trim();
          title.textContent = "";
          title.appendChild(a);
        }
        textEls.push(title);
      }
      Array.from(desc.querySelectorAll("p")).filter((el) => el.textContent.trim()).forEach((el) => textEls.push(el));
      const cta = item.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href]");
      if (cta && !textEls.includes(cta)) textEls.push(cta);
      if (!image && !textEls.length) return;
      const imageCell = document2.createDocumentFragment();
      if (image) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(image);
      }
      const textCell = document2.createDocumentFragment();
      if (textEls.length) {
        textCell.appendChild(document2.createComment(" field:text "));
        textEls.forEach((el) => textCell.appendChild(el));
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-markets", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-media.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const tiles = Array.from(element.querySelectorAll("a.cmp-image__link"));
    const seenSrc = /* @__PURE__ */ new Set();
    tiles.forEach((tile) => {
      const img = tile.querySelector("img");
      const src = img ? img.getAttribute("src") || "" : "";
      if (!img || src.startsWith("data:") || seenSrc.has(src)) return;
      seenSrc.add(src);
      const titleP = tile.querySelector(".cmp-image__title") || tile.parentElement && tile.parentElement.querySelector(".cmp-image__title");
      const labelText = titleP ? titleP.textContent.replace(/\s+/g, " ").trim() : (img.getAttribute("alt") || "").trim();
      const href = tile.getAttribute("href");
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(img);
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (labelText) {
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = labelText;
          textCell.appendChild(a);
        } else {
          const p = document2.createElement("p");
          p.textContent = labelText;
          textCell.appendChild(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-band.js
  function parse6(element, { document: document2 }) {
    const imageEl = element.querySelector(".cmp-teaser__image img, .cmp-image img") || element.querySelector(".cmp-teaser__content img, img");
    const desc = element.querySelector(".cmp-teaser__description, .cmp-text") || element;
    const textEls = Array.from(desc.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > p")).filter((el) => el.textContent.trim());
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href], .lkcta a[href], a.cmp-button[href]");
    if (cta) textEls.push(cta);
    if (!imageEl && !textEls.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const variants = [];
    if (element.classList.contains("image-right")) variants.push("image-right");
    const cells = [[
      imageEl ? [imageEl] : "",
      textEls.length ? textEls : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-band", variants, cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/zurn-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        // OneTrust cookie banner + preference-center modal
        "#hs-web-interactives-top-push-anchor",
        // HubSpot interactives push anchor
        // --- Non-authorable chrome inside the resources section (verified in
        //     the bd-snapshot the import runs against) ---
        "nav.pdp-carousel-header",
        // sticky "RESOURCES" tab bar above the band
        ".ze-resources > img",
        // decorative triangles background SVG in the band
        ".ze-return-to-top",
        // "Return to Top" anchor
        ".lk-product-media-modal",
        // hidden product-image modal wrapper (thumbnail carousel)
        ".modal",
        // any Bootstrap modal (mainImageModal/mediaImageModal etc.) — never authorable
        "#mainImageModal",
        // product image lightbox modal
        "#mediaImageModal",
        // media image lightbox modal
        ".QSIFeedbackButton",
        // Qualtrics "Give Feedback" widget + its target container
        "#QSIFeedbackButton-target-container",
        "#db_lr_pixel_ad",
        // LiveRamp tracking pixel
        'img[src*="rlcdn.com"]'
        // any other rlcdn tracking pixels
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#aem-remote-header",
        // global brand/site header experience fragment
        "#aem-remote-footer",
        // global site footer experience fragment
        "iframe",
        // db-sync / onetrust-text-resize / archetype tracking iframes
        "noscript",
        "style",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/zurn-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = element.ownerDocument.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(element.ownerDocument, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/transformers/zurn-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/zurn-form.js
  var FORM_EMBEDS = [
    { selector: ".lkembed.hs-neutral", json: "market-contact-form.json" },
    { selector: ".lkembed.hs-emailsignup", json: "newsletter-signup-form.json" }
  ];
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform4(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const doc = element.ownerDocument || document;
    FORM_EMBEDS.forEach(({ selector, json }) => {
      const embed = element.querySelector(selector);
      if (!embed) return;
      const table = doc.createElement("table");
      const headRow = doc.createElement("tr");
      const headCell = doc.createElement("td");
      headCell.textContent = "Form";
      headRow.appendChild(headCell);
      table.appendChild(headRow);
      const bodyRow = doc.createElement("tr");
      const bodyCell = doc.createElement("td");
      const link = doc.createElement("a");
      link.setAttribute("href", json);
      link.textContent = json;
      bodyCell.appendChild(link);
      bodyRow.appendChild(bodyCell);
      table.appendChild(bodyRow);
      embed.replaceWith(table);
    });
  }

  // tools/importer/transformers/zurn-hero-dam-images.js
  var HERO_SELECTOR = "#bannerCarousel";
  var DAM_BASE = "/content/dam/zurn/en/images";
  var IMAGE_MAP = {
    "zurnv49-grze-banner-mob-2026.png": `${DAM_BASE}/zurnv49-grze-banner-2026.jpeg`,
    "zurnv49-grze-banner-2026.png": `${DAM_BASE}/zurnv49-grze-banner-2026.jpeg`,
    "480-356-npd-bc-n-pattern-975xl3-web-banner-1200x768-mobile.png": `${DAM_BASE}/480-356-NPD-BC-n-Pattern-975XL3-Web-Banner_2000x600.jpeg`,
    "480-356-npd-bc-n-pattern-975xl3-web-banner-2000x600.png": `${DAM_BASE}/480-356-NPD-BC-n-Pattern-975XL3-Web-Banner_2000x600.jpeg`,
    "zurnv49-interceptor-sizing-tool-homepage-banner-mobile.png": `${DAM_BASE}/zurnv49-interceptor-sizing-tool-homepage-banner.jpeg`,
    "zurnv49-interceptor-sizing-tool-homepage-banner.png": `${DAM_BASE}/zurnv49-interceptor-sizing-tool-homepage-banner.jpeg`
  };
  function filenameOf(src) {
    try {
      const noQuery = src.split("?")[0].replace(/\/$/, "");
      return noQuery.split("/").pop().toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function transform5(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const hero = element.querySelector(HERO_SELECTOR);
    if (!hero) return;
    hero.querySelectorAll("img").forEach((im) => {
      const src = im.getAttribute("src") || "";
      const dam = IMAGE_MAP[filenameOf(src)];
      if (dam) {
        im.setAttribute("src", dam);
        im.removeAttribute("srcset");
      }
    });
    hero.querySelectorAll("source[srcset]").forEach((s) => {
      const set = s.getAttribute("srcset") || "";
      if (Object.keys(IMAGE_MAP).some((fn) => set.toLowerCase().includes(fn))) {
        s.removeAttribute("srcset");
      }
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-feature": parse2,
    "tabs-resource": parse3,
    "carousel-markets": parse4,
    "carousel-media": parse5,
    "columns-band": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    blocks: [
      { name: "carousel-hero", instances: ["#bannerCarousel"] },
      { name: "cards-feature", instances: ["#lkcontainer-d0baf9a111"] },
      { name: "tabs-resource", instances: ["#ZurnResources"] },
      { name: "carousel-markets", instances: ["#vMarkets"] },
      { name: "carousel-media", instances: ["#zurnInnovationEfficiencyProducts"] },
      { name: "columns-band", instances: ["#whyZurn"] },
      { name: "form", instances: ["#container-9dddb5c103"] }
    ],
    sections: [
      { id: "s1", name: "hero-carousel", selector: ["#bannerCarousel"], style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "s2", name: "latest-intro", selector: ["#lktext-51c5ff3e5e"], style: null, blocks: [], defaultContent: ["#lktext-51c5ff3e5e"] },
      { id: "s3", name: "latest-cards", selector: ["#lkcontainer-d0baf9a111"], style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "s4", name: "resources-intro", selector: ["#lktext-afe1cfcb1a"], style: null, blocks: [], defaultContent: ["#lktext-afe1cfcb1a"] },
      { id: "s5", name: "resources-tabs", selector: ["#ZurnResources"], style: null, blocks: ["tabs-resource"], defaultContent: [] },
      { id: "s6", name: "markets-carousel", selector: ["#lkcontainer-04137134ae"], style: "grey", blocks: ["carousel-markets"], defaultContent: [] },
      { id: "s7", name: "innovation-media", selector: ["#lkcontainer-92828ff454"], style: null, blocks: ["carousel-media"], defaultContent: [] },
      { id: "s8", name: "where-to-buy-heading", selector: ["#lktitle-cmp-root-container_533156717-lktitle"], style: null, blocks: [], defaultContent: ["#lktitle-cmp-root-container_533156717-lktitle"] },
      { id: "s9", name: "rep-locator", selector: ["#lkcontainer-e8a1ecb7fa"], style: null, blocks: [], defaultContent: ["#lkcontainer-e8a1ecb7fa"] },
      { id: "s10", name: "why-zurn-band", selector: ["#whyZurn"], style: null, blocks: ["columns-band"], defaultContent: [] },
      { id: "s11", name: "newsletter", selector: ["#container-9dddb5c103"], style: "dark", blocks: ["form"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    transform5,
    // rewrite EN hero banner imgs to DAM paths (beforeTransform, before the hero parser extracts them)
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform4,
    // replace the JS-injected HubSpot newsletter embed with a form block referencing the JSON sheet
    transform3
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      const chosen = [];
      for (const selector of blockDef.instances) {
        const elements = [...document2.querySelectorAll(selector)];
        if (!elements.length) continue;
        elements.forEach((element) => {
          const overlaps = chosen.some((c) => c === element || c.contains(element) || element.contains(c));
          if (overlaps) return;
          chosen.push(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
        if (chosen.length) break;
      }
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
