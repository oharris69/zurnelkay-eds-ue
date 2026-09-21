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

  // tools/importer/import-product-detail.js
  var import_product_detail_exports = {};
  __export(import_product_detail_exports, {
    default: () => import_product_detail_default
  });

  // tools/importer/parsers/breadcrumb-product.js
  function parse(element, { document }) {
    let items = Array.from(element.querySelectorAll("li"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("a")).map((a) => {
        const wrap = document.createElement("span");
        wrap.appendChild(a.cloneNode(true));
        return wrap;
      });
    }
    const cells = [];
    items.forEach((item) => {
      const srcLink = item.querySelector("a[href]");
      const label = (srcLink ? srcLink.textContent : item.textContent).replace(/\s+/g, " ").trim();
      if (!label) return;
      let linkCell = "";
      if (srcLink && srcLink.getAttribute("href")) {
        const anchor = document.createElement("a");
        anchor.setAttribute("href", srcLink.getAttribute("href"));
        anchor.textContent = label;
        const linkFrag = document.createDocumentFragment();
        linkFrag.appendChild(document.createComment(" field:link "));
        linkFrag.appendChild(anchor);
        linkCell = linkFrag;
      }
      const labelFrag = document.createDocumentFragment();
      labelFrag.appendChild(document.createComment(" field:label "));
      labelFrag.appendChild(document.createTextNode(label));
      cells.push([linkCell, labelFrag]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "breadcrumb-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-product.js
  function parse2(element, { document }) {
    const imageCell = [];
    const productImg = element.querySelector(
      "#productMedia .splide__slide img, #productMedia img.pdp-image, .pdp-image"
    );
    if (productImg && !(productImg.getAttribute("src") || "").startsWith("data:")) {
      imageCell.push(productImg);
    }
    const infoCell = [];
    const sku = element.querySelector(".product-sku");
    if (sku) infoCell.push(sku);
    const title = element.querySelector(".product-name, h1");
    if (title) infoCell.push(title);
    const desc = element.querySelector(".product-description");
    if (desc && desc.textContent.trim()) infoCell.push(desc);
    const addlDesc = element.querySelector(".product-additional-description");
    if (addlDesc && addlDesc.textContent.trim()) infoCell.push(addlDesc);
    const ctaAnchor = element.querySelector("#pdp-content-cta a[href], .lkcta a[href]");
    if (ctaAnchor && ctaAnchor.getAttribute("href")) {
      const a = document.createElement("a");
      a.setAttribute("href", ctaAnchor.getAttribute("href"));
      a.textContent = (ctaAnchor.textContent || "").replace(/\s+/g, " ").trim();
      infoCell.push(a);
    }
    const featureItems = Array.from(element.querySelectorAll("#sellingFeaturesList > li"));
    if (featureItems.length) {
      const ul = document.createElement("ul");
      featureItems.forEach((li) => {
        const textEl = li.querySelector(".selling-features-text");
        const text = (textEl ? textEl.textContent : li.textContent).replace(/\s+/g, " ").trim();
        if (text) {
          const item = document.createElement("li");
          item.textContent = text;
          ul.appendChild(item);
        }
      });
      if (ul.children.length) infoCell.push(ul);
    }
    if (!imageCell.length && !infoCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      imageCell.length ? imageCell : "",
      infoCell.length ? infoCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/download-resources.js
  function parse3(element, { document }) {
    const cells = [];
    function pushLabelOnlyRow(text) {
      const label = (text || "").replace(/\s+/g, " ").trim();
      if (!label) return;
      const labelFrag = document.createDocumentFragment();
      labelFrag.appendChild(document.createComment(" field:label "));
      labelFrag.appendChild(document.createTextNode(label));
      cells.push(["", labelFrag]);
    }
    function pushLinkRow(anchor) {
      const href = anchor.getAttribute("href");
      if (!href) return;
      const textEl = anchor.querySelector(".cmp-button__text");
      const label = (textEl ? textEl.textContent : anchor.textContent).replace(/\s+/g, " ").trim();
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label || href;
      const linkFrag = document.createDocumentFragment();
      linkFrag.appendChild(document.createComment(" field:link "));
      linkFrag.appendChild(a);
      let labelCell = "";
      if (label) {
        const labelFrag = document.createDocumentFragment();
        labelFrag.appendChild(document.createComment(" field:label "));
        labelFrag.appendChild(document.createTextNode(label));
        labelCell = labelFrag;
      }
      cells.push([linkFrag, labelCell]);
    }
    const sections = Array.from(element.querySelectorAll(".ze-resource-section"));
    if (sections.length) {
      sections.forEach((section) => {
        const heading = section.querySelector(".ze-resource-section-label");
        if (heading) pushLabelOnlyRow(heading.textContent);
        Array.from(section.querySelectorAll("a[href]")).forEach(pushLinkRow);
      });
    } else {
      Array.from(element.querySelectorAll("a[href]")).forEach(pushLinkRow);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "download-resources", cells });
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

  // tools/importer/import-product-detail.js
  var parsers = {
    "breadcrumb-product": parse,
    "columns-product": parse2,
    "download-resources": parse3
  };
  var PAGE_TEMPLATE = {
    name: "product-detail",
    description: "Product detail page with product image, title, description, feature bullets and a dark resources download band",
    urls: [
      "https://www.zurn.com/products/drainage-interceptors/cleanouts/cleanouts/3nl-gasket"
    ],
    blocks: [
      { name: "breadcrumb-product", instances: [".lk-breadcrumbs"] },
      { name: "columns-product", instances: ["#PDPGrid"] },
      { name: "download-resources", instances: [".ze-resources-listing", ".ze-resources"] }
    ],
    sections: [
      {
        id: "s1",
        name: "breadcrumb",
        selector: [".lk-breadcrumbs"],
        style: null,
        blocks: ["breadcrumb-product"],
        defaultContent: []
      },
      {
        id: "s2",
        name: "product-detail-grid",
        selector: ["#PDPGrid"],
        style: null,
        blocks: ["columns-product"],
        defaultContent: []
      },
      {
        id: "s3",
        name: "resources",
        selector: [".ze-resources"],
        style: "dark",
        blocks: ["download-resources"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    transform3,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
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
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      const chosen = [];
      for (const selector of blockDef.instances) {
        const elements = [...document.querySelectorAll(selector)];
        if (!elements.length) continue;
        elements.forEach((element) => {
          const overlaps = chosen.some((c) => c === element || c.contains(element) || element.contains(c));
          if (overlaps) return;
          chosen.push(element);
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
        if (chosen.length) break;
      }
      if (!chosen.length) {
        console.warn(`Block "${blockDef.name}" selectors not found: ${blockDef.instances.join(", ")}`);
      }
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_product_detail_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_product_detail_exports);
})();
