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

  // tools/importer/import-market-solution.js
  var import_market_solution_exports = {};
  __export(import_market_solution_exports, {
    default: () => import_market_solution_default
  });

  // tools/importer/parsers/hero-market.js
  function parse(element, { document: document2 }) {
    const imgs = Array.from(element.querySelectorAll("img")).filter(
      (im) => !(im.getAttribute("src") || "").startsWith("data:")
    );
    let bgImage = imgs[0] || null;
    if (bgImage && !bgImage.getAttribute("alt")) {
      const withAlt = imgs.find((im) => im.getAttribute("alt"));
      if (withAlt) bgImage.setAttribute("alt", withAlt.getAttribute("alt"));
    }
    const textContainer = element.querySelector(".cmp-teaser__description, .cmp-lk-teaser__content");
    const textEls = [];
    const heading = (textContainer || element).querySelector("h1, h2, .cmp-teaser__title");
    if (heading) textEls.push(heading);
    const subEls = Array.from(
      (textContainer || element).querySelectorAll("h3, h4, h5, p")
    ).filter((el) => el !== heading && el.textContent.trim());
    textEls.push(...subEls);
    const ctas = Array.from(element.querySelectorAll(".cmp-teaser__action-link, a.cmp-button, .cmp-teaser__action-container a[href]"));
    textEls.push(...ctas);
    if (!bgImage && !textEls.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(bgImage);
      cells.push([imageCell]);
    }
    if (textEls.length) {
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      textEls.forEach((el) => textCell.appendChild(el));
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-market", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stat.js
  function parse2(element, { document: document2 }) {
    const textBlocks = Array.from(
      element.querySelectorAll(":scope > div > .lktext, :scope > .lktext, .lktext")
    );
    const seen = /* @__PURE__ */ new Set();
    const columns = [];
    textBlocks.forEach((tb) => {
      if (seen.has(tb)) return;
      seen.add(tb);
      const inner = tb.querySelector(".cmp-text") || tb;
      const contentEls = Array.from(inner.children).filter((el) => el.textContent.trim());
      if (contentEls.length) columns.push(contentEls);
    });
    if (!columns.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columns.map((els) => els);
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-stat", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-band.js
  function parse3(element, { document: document2 }) {
    const imageEl = element.querySelector(".cmp-teaser__image img, .cmp-image img") || element.querySelector(".cmp-teaser__content img, img");
    const desc = element.querySelector(".cmp-teaser__description") || element;
    const textEls = Array.from(desc.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > p")).filter((el) => el.textContent.trim());
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href]");
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

  // tools/importer/parsers/cards-icon.js
  function parse4(element, { document: document2 }) {
    const imageEl = element.querySelector(".cmp-teaser__image img, .cmp-image img") || element.querySelector(".cmp-teaser__content img, img");
    const desc = element.querySelector(".cmp-teaser__description") || element;
    const textEls = Array.from(desc.querySelectorAll(":scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p")).filter((el) => el.textContent.trim());
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a[href]");
    if (cta) textEls.push(cta);
    if (!imageEl && !textEls.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = document2.createDocumentFragment();
    if (imageEl) {
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(imageEl);
    }
    const textCell = document2.createDocumentFragment();
    if (textEls.length) {
      textCell.appendChild(document2.createComment(" field:text "));
      textEls.forEach((el) => textCell.appendChild(el));
    }
    const cells = [[
      imageEl ? imageCell : "",
      textEls.length ? textCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-audience.js
  function parse5(element, { document: document2 }) {
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
      const imageCell = document2.createDocumentFragment();
      const img = panel.querySelector("img");
      if (img && !(img.getAttribute("src") || "").startsWith("data:")) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document2.createDocumentFragment();
      const desc = panel.querySelector(".cmp-teaser__description, .cmp-mediatext") || panel;
      const textEls = Array.from(desc.querySelectorAll("h1, h2, h3, h4, h5, h6, p")).filter((el) => el.textContent.trim());
      if (textEls.length) {
        textCell.appendChild(document2.createComment(" field:text "));
        textEls.forEach((el) => textCell.appendChild(el));
      }
      if (labelText || img || textEls.length) {
        cells.push([labelCell, imageCell, textCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-audience", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/fragment-brands.js
  function parse6(element, { document: document2 }) {
    const inner = element.querySelector('[class*="cmp-experiencefragment--"]') || element;
    let fragName = "brands";
    const modClass = Array.from(inner.classList).find((c) => c.startsWith("cmp-experiencefragment--"));
    if (modClass) {
      fragName = modClass.replace("cmp-experiencefragment--", "").trim() || "brands";
    }
    const fragmentPath = `/fr/fragments/${fragName}`;
    const link = document2.createElement("a");
    link.setAttribute("href", fragmentPath);
    link.textContent = fragmentPath;
    const refCell = document2.createDocumentFragment();
    refCell.appendChild(document2.createComment(" field:reference "));
    refCell.appendChild(link);
    const cells = [[refCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "fragment-brands", cells });
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
  var FORM_EMBED_SELECTOR = ".lkembed.hs-neutral";
  var FORM_JSON = "market-contact-form.json";
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform4(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    const embed = element.querySelector(FORM_EMBED_SELECTOR);
    if (!embed) return;
    const doc = element.ownerDocument || document;
    const table = doc.createElement("table");
    const headRow = doc.createElement("tr");
    const headCell = doc.createElement("td");
    headCell.textContent = "Form";
    headRow.appendChild(headCell);
    table.appendChild(headRow);
    const bodyRow = doc.createElement("tr");
    const bodyCell = doc.createElement("td");
    const link = doc.createElement("a");
    link.setAttribute("href", FORM_JSON);
    link.textContent = FORM_JSON;
    bodyCell.appendChild(link);
    bodyRow.appendChild(bodyCell);
    table.appendChild(bodyRow);
    embed.replaceWith(table);
  }

  // tools/importer/import-market-solution.js
  var parsers = {
    "hero-market": parse,
    "columns-stat": parse2,
    "columns-band": parse3,
    "cards-icon": parse4,
    "tabs-audience": parse5,
    "fragment-brands": parse6
  };
  var PAGE_TEMPLATE = {
    name: "market-solution",
    blocks: [
      { name: "hero-market", instances: [".lkteaser.teaser-default"] },
      { name: "columns-stat", instances: [".lkcontainer.w-max-1000.flex-just-center"] },
      { name: "columns-band", instances: [".teaserv2.core-scheme-feature"] },
      { name: "cards-icon", instances: [".teaserv2.core-scheme-blacktext.teaser-text-center"] },
      { name: "tabs-audience", instances: [".lktabs"] },
      { name: "fragment-brands", instances: [".cmp-experiencefragment--brands"] },
      { name: "form", instances: [".lkembed.hs-neutral"] }
    ],
    sections: [
      { id: "s1", name: "breadcrumb", selector: [".lkbreadcrumb"], style: null, blocks: [], defaultContent: [] },
      { id: "s2", name: "hero", selector: [".lkteaser.teaser-default"], style: null, blocks: ["hero-market"], defaultContent: [] },
      { id: "s3", name: "stat-callout", selector: [".lkcontainer.w-max-1000.flex-just-center"], style: null, blocks: ["columns-stat"], defaultContent: [] },
      { id: "s4", name: "band-tco", selector: [".cmp-experiencefragment--tco-callout"], style: "dark", blocks: [], defaultContent: [] },
      { id: "s5", name: "band-hygiene", selector: [".teaserv2.image-right"], style: "dark", blocks: ["columns-band"], defaultContent: [] },
      { id: "s6", name: "band-smart", selector: [".teaserv2.image-left"], style: "accent", blocks: ["columns-band"], defaultContent: [] },
      { id: "s7", name: "brands", selector: [".cmp-experiencefragment--brands"], style: "dark", blocks: ["fragment-brands"], defaultContent: [] },
      { id: "s8", name: "wellness-intro", selector: [".cmp-experiencefragment--sustainability-section"], style: null, blocks: [], defaultContent: [] },
      { id: "s9", name: "icon-features", selector: [".teaserv2.core-scheme-blacktext.teaser-text-center"], style: null, blocks: ["cards-icon"], defaultContent: [] },
      { id: "s10", name: "sustainability-stats", selector: [".teaserv2.larger-fonts"], style: null, blocks: [], defaultContent: [] },
      { id: "s11", name: "upgrades-title", selector: [".lktitle.title-center"], style: null, blocks: [], defaultContent: [] },
      { id: "s12", name: "audience-tabs", selector: [".lktabs"], style: null, blocks: ["tabs-audience"], defaultContent: [] },
      { id: "s13", name: "contact-form", selector: [".lkembed.hs-neutral"], style: "light-grey", blocks: ["form"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform4,
    // replace the JS-injected HubSpot embed with a form block referencing the JSON sheet
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
  var import_market_solution_default = {
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
  return __toCommonJS(import_market_solution_exports);
})();
