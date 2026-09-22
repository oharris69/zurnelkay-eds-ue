/*
 * Generate nav + footer fragment JCR (.content.xml) for the en and fr language
 * trees. These are simple structural fragments the header/footer blocks load at
 * runtime from /{lang}/nav.plain.html and /{lang}/footer.plain.html.
 *
 * The header expects the rendered nav fragment to have THREE top-level sections
 * (brand / sections / tools → nav.children[0..2]); the footer is a single
 * section of default content. The DA→md2jcr HTML path collapses <hr> breaks into
 * one section, so we emit the section nodes directly here — each JCR <section>
 * renders as one top-level <div> in the delivered .plain.html.
 */
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const OUT = 'migration-work/jcr-nav-footer';

const xmlEscape = (s) => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const RT = {
  page: 'core/franklin/components/page/v1/page',
  root: 'core/franklin/components/root/v1/root',
  section: 'core/franklin/components/section/v1/section',
  text: 'core/franklin/components/text/v1/text',
  title: 'core/franklin/components/title/v1/title',
  button: 'core/franklin/components/button/v1/button',
};

// A text node carries rich HTML in its `text` attribute (double-escaped: the
// HTML is entity-escaped, then attribute-escaped by the serializer).
function textNode(name, html) {
  return `        <${name} sling:resourceType="${RT.text}" jcr:primaryType="nt:unstructured" text="${xmlEscape(html)}"/>`;
}
function buttonNode(name, link, linkText) {
  return `        <${name} sling:resourceType="${RT.button}" jcr:primaryType="nt:unstructured" link="${xmlEscape(link)}" linkText="${xmlEscape(linkText)}"/>`;
}
// JCR sibling nodes MUST have unique names — three <section> siblings collapse
// to just the last on import. Name them section, section_1, section_2, matching
// the franklin serialization convention.
function section(children, index) {
  const name = index === 0 ? 'section' : `section_${index}`;
  return `      <${name} sling:resourceType="${RT.section}" jcr:primaryType="nt:unstructured" model="section" modelFields="[name,style]">
${children.join('\n')}
      </${name}>`;
}
function page(title, sections) {
  const sectionXml = sections.map((children, i) => section(children, i)).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0" jcr:primaryType="cq:Page">
  <jcr:content cq:template="/libs/core/franklin/templates/page" sling:resourceType="${RT.page}" jcr:primaryType="cq:PageContent" jcr:title="${xmlEscape(title)}" modelFields="[jcr:title,jcr:pagetitle,jcr:description,cq:tags,theme,pageName,pageCategory]">
    <root jcr:primaryType="nt:unstructured" sling:resourceType="${RT.root}">
${sectionXml}
    </root>
  </jcr:content>
</jcr:root>
`;
}

// ---- Navigation content per language ----
// Section 1 = brand (logo/name link), 2 = sections (nav menu <ul>), 3 = tools.
const NAV = {
  en: {
    title: 'Navigation',
    brand: { link: '/', text: 'Zurn' },
    menu: `<ul>
<li><a href="/en/products">Products</a></li>
<li><a href="/en/markets">Markets</a></li>
<li><a href="/en/innovation-efficiency">Innovation &amp; Efficiency</a>
<ul>
<li><a href="/en/innovation-efficiency">Overview</a></li>
<li><a href="/en/resources/specification/spec-library">Specification Library</a></li>
</ul>
</li>
<li><a href="/en/resources/technical-resources">Resources</a>
<ul>
<li><a href="/en/resources/technical-resources">Technical Resources</a></li>
<li><a href="/en/resources/approvals-and-certifications">Approvals &amp; Certifications</a></li>
</ul>
</li>
<li><a href="/where-to-buy/rep-locator">Where to Buy</a></li>
<li><a href="/en/about-us">About Zurn</a></li>
</ul>`,
    tools: { link: '/en/support/contact-us', text: 'Contact Us' },
  },
  fr: {
    title: 'Navigation',
    brand: { link: '/fr', text: 'Zurn' },
    menu: `<ul>
<li><a href="/fr/products">Produits</a></li>
<li><a href="/fr/markets">Marchés</a></li>
<li><a href="/fr/innovation-efficiency">Innovation et Efficacité</a>
<ul>
<li><a href="/fr/innovation-efficiency">Aperçu</a></li>
<li><a href="/fr/resources/specification/spec-library">Bibliothèque de Spécifications</a></li>
</ul>
</li>
<li><a href="/fr/resources/technical-resources">Ressources</a>
<ul>
<li><a href="/fr/resources/technical-resources">Ressources Techniques</a></li>
<li><a href="/fr/resources/approvals-and-certifications">Approbations et Certifications</a></li>
</ul>
</li>
<li><a href="/where-to-buy/rep-locator">Où Acheter</a></li>
<li><a href="/fr/about-us">À Propos de Zurn</a></li>
</ul>`,
    tools: { link: '/fr/support/contact-us', text: 'Nous Joindre' },
  },
};

// ---- Footer content per language (single section, default content) ----
const FOOTER = {
  en: {
    title: 'Footer',
    html: `<p><strong>Zurn Elkay Water Solutions</strong></p>
<ul>
<li><a href="/en/products">Products</a></li>
<li><a href="/en/markets">Markets</a></li>
<li><a href="/en/innovation-efficiency">Innovation &amp; Efficiency</a></li>
<li><a href="/en/resources/technical-resources">Resources</a></li>
<li><a href="/where-to-buy/rep-locator">Where to Buy</a></li>
<li><a href="/en/about-us">About Zurn</a></li>
<li><a href="/en/support/contact-us">Contact Us</a></li>
</ul>
<p>© Zurn Elkay Water Solutions. All rights reserved.</p>`,
  },
  fr: {
    title: 'Footer',
    html: `<p><strong>Zurn Elkay Water Solutions</strong></p>
<ul>
<li><a href="/fr/products">Produits</a></li>
<li><a href="/fr/markets">Marchés</a></li>
<li><a href="/fr/innovation-efficiency">Innovation et Efficacité</a></li>
<li><a href="/fr/resources/technical-resources">Ressources</a></li>
<li><a href="/where-to-buy/rep-locator">Où Acheter</a></li>
<li><a href="/fr/about-us">À Propos de Zurn</a></li>
<li><a href="/fr/support/contact-us">Nous Joindre</a></li>
</ul>
<p>© Zurn Elkay Water Solutions. Tous droits réservés.</p>`,
  },
};

for (const lang of ['en', 'fr']) {
  const nav = NAV[lang];
  const navXml = page(nav.title, [
    [buttonNode('button', nav.brand.link, nav.brand.text)],
    [textNode('text', nav.menu)],
    [buttonNode('button', nav.tools.link, nav.tools.text)],
  ]);
  const navPath = path.join(OUT, lang, 'nav', '.content.xml');
  await mkdir(path.dirname(navPath), { recursive: true });
  await writeFile(navPath, navXml, 'utf-8');

  const ft = FOOTER[lang];
  const footerXml = page(ft.title, [[textNode('text', ft.html)]]);
  const footerPath = path.join(OUT, lang, 'footer', '.content.xml');
  await mkdir(path.dirname(footerPath), { recursive: true });
  await writeFile(footerPath, footerXml, 'utf-8');

  console.log(`${lang}: nav (3 sections) + footer written`);
}
