#!/usr/bin/env node
/**
 * NexBridge Build Script
 * 1. Reads source templates from src/ and injects partials (navbar, footer)
 * 2. Outputs English pages to the project root
 * 3. Reads JSON translation files and generates translated pages in /{lang}/
 *
 * Usage: node build-i18n.js
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src');
const PARTIALS_DIR = path.join(ROOT, 'partials');
const I18N_DIR = path.join(ROOT, 'i18n');

// ── Source files ────────────────────────────────────────────
const ROOT_PAGES = [
  'index.html', 'about.html', 'contact.html', 'ecosystem.html',
  'explore.html', 'faq.html', 'glossary.html', 'insights.html',
  'issuances.html', 'legal-framework.html', 'tutorials.html'
];
const INSIGHT_PAGES = [
  'insights/audit-report.html',
  'insights/pioneering-the-future-of-finance.html',
  'insights/ustbl-reaches-goal.html',
  'insights/ustbl-rid-update-2025.html',
  'insights/ustbl.html'
];
const ALL_PAGES = [...ROOT_PAGES, ...INSIGHT_PAGES];

// ── Load partials ─────────────────────────────────────────
const navbarPartial = fs.readFileSync(path.join(PARTIALS_DIR, 'navbar.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8');

function injectPartials(html) {
  // Replace the full indented placeholder line with partial content
  // The partials already include proper indentation from extraction
  return html
    .replace(/^[ \t]*<!-- @include navbar -->/m, navbarPartial)
    .replace(/^[ \t]*<!-- @include footer -->/m, footerPartial);
}

// ── Load translations ──────────────────────────────────────
function loadTranslations() {
  const langs = [];
  const files = fs.readdirSync(I18N_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(I18N_DIR, file), 'utf8'));
    langs.push(data);
  }
  return langs;
}

// ── Text replacement helper ────────────────────────────────
// Replaces exact text content in a cheerio element's direct text nodes
function replaceText($el, oldText, newText) {
  if (!newText || !oldText) return false;
  const html = $el.html();
  if (html === null) return false;
  // Try direct text content match first
  const trimmedHtml = html.trim();
  if (trimmedHtml === oldText.trim()) {
    $el.html(newText);
    return true;
  }
  // Try replacing within the html (preserving child elements)
  if (html.includes(oldText)) {
    $el.html(html.replace(oldText, newText));
    return true;
  }
  return false;
}

// ── Translate shared elements (nav, footer, mega, mobile nav) ──
function translateShared($, t) {
  const s = t.shared;
  if (!s) return;

  // ─ Nav links ─
  if (s.nav) {
    const navLinks = $('.nav-links > a');
    navLinks.each(function() {
      const $a = $(this);
      const text = $a.clone().children().remove().end().text().trim();
      if (text === 'Products' && s.nav.products) {
        // Has SVG child - replace text node only
        const svg = $a.find('svg').toString();
        $a.html(s.nav.products + ' ' + svg);
      } else if (text === 'Ecosystem' && s.nav.ecosystem) {
        $a.text(s.nav.ecosystem);
      } else if (text === 'Resources' && s.nav.resources) {
        const svg = $a.find('svg').toString();
        $a.html(s.nav.resources + ' ' + svg);
      } else if (text === 'About' && s.nav.about) {
        $a.text(s.nav.about);
      }
    });
    // CTA
    if (s.nav.launchApp) {
      const cta = $('.nav-cta');
      if (cta.length) cta.text(s.nav.launchApp + ' \u2192');
    }
  }

  // ─ Mega Dropdown: Products ─
  if (s.mega) {
    const m = s.mega;

    // Section titles
    $('.mega-section-title').each(function() {
      const $el = $(this);
      const text = $el.clone().children().remove().end().text().trim();
      if (text === 'Issuances' && m.issuances) {
        const svg = $el.find('svg').toString();
        $el.html(m.issuances + ' ' + svg);
      } else if (text === 'Infrastructure' && m.infrastructure) {
        const svg = $el.find('svg').toString();
        $el.html(m.infrastructure + ' ' + svg);
      } else if (text.startsWith('Platforms') && m.platformsMarkets) {
        const svg = $el.find('svg').toString();
        $el.html(m.platformsMarkets + ' ' + svg);
      }
    });

    // Mega item descriptions
    if (m.items) {
      for (const [key, val] of Object.entries(m.items)) {
        $('.mega-item-name').each(function() {
          const $el = $(this);
          const text = $el.clone().children().remove().end().text().trim();
          if (text === key && val.name) {
            const tags = $el.find('.mega-item-tag').toString();
            $el.html(val.name + (tags ? ' ' + tags : ''));
          }
        });
        $('.mega-item-desc').each(function() {
          const $el = $(this);
          const text = $el.text().trim();
          if (val.descMatch && text.includes(val.descMatch) && val.desc) {
            $el.text(val.desc);
          }
        });
      }
    }

    // Featured card
    if (m.featured) {
      if (m.featured.badge) {
        const badge = $('.mega-featured-badge');
        if (badge.length) badge.text(m.featured.badge);
      }
      if (m.featured.subtitle) {
        const sub = $('.mega-featured-subtitle');
        if (sub.length) sub.text(m.featured.subtitle);
      }
      if (m.featured.cta) {
        const cta = $('.mega-featured-cta');
        if (cta.length) {
          cta.html(m.featured.cta + ' <span>\u2192</span>');
        }
      }
    }

    // Tags
    if (m.tags) {
      if (m.tags.live) {
        $('.mega-tag-live').each(function() { $(this).text(m.tags.live); });
      }
      if (m.tags.soon) {
        $('.mega-tag-soon').each(function() { $(this).text(m.tags.soon); });
      }
    }
  }

  // ─ Resources dropdown ─
  if (s.resourcesMega) {
    const r = s.resourcesMega;
    $('#resources-dropdown .mega-item-name').each(function() {
      const $el = $(this);
      const text = $el.text().trim();
      if (text === 'Legal Framework' && r.legalFramework) $el.text(r.legalFramework);
      else if (text === 'FAQs' && r.faqs) $el.text(r.faqs);
      else if (text === 'Insights' && r.insights) $el.text(r.insights);
    });
    $('#resources-dropdown .mega-item-desc').each(function() {
      const $el = $(this);
      const text = $el.text().trim();
      if (text.includes('Regulatory') && r.legalDesc) $el.text(r.legalDesc);
      else if (text.includes('Frequently') && r.faqsDesc) $el.text(r.faqsDesc);
      else if (text.includes('Announcements') && r.insightsDesc) $el.text(r.insightsDesc);
    });
  }

  // ─ Mobile nav ─
  if (s.mobileNav) {
    const mn = s.mobileNav;
    const mobileLinks = $('.mobile-nav a');
    mobileLinks.each(function() {
      const $a = $(this);
      const text = $a.text().trim();
      if (text === 'Products' && mn.products) $a.text(mn.products);
      else if (text === 'Ecosystem' && mn.ecosystem) $a.text(mn.ecosystem);
      else if (text === 'Legal Framework' && mn.legalFramework) $a.text(mn.legalFramework);
      else if (text === 'FAQs' && mn.faqs) $a.text(mn.faqs);
      else if (text === 'Insights' && mn.insights) $a.text(mn.insights);
      else if (text === 'About' && mn.about) $a.text(mn.about);
      else if (text.includes('Eligible Markets') && mn.launchApp) $a.text(mn.launchApp + ' \u2192');
    });
  }

  // ─ Footer ─
  if (s.footer) {
    const f = s.footer;
    // Brand tagline
    if (f.tagline) {
      const brand = $('.footer-brand p');
      if (brand.length) brand.text(f.tagline);
    }
    // Column headers
    $('.footer-col h5').each(function() {
      const $h5 = $(this);
      const text = $h5.text().trim();
      if (text === 'Products' && f.productsHeader) $h5.text(f.productsHeader);
      else if (text.startsWith('Platforms') && f.platformsHeader) $h5.text(f.platformsHeader);
      else if (text === 'Resources' && f.resourcesHeader) $h5.text(f.resourcesHeader);
      else if (text === 'Learn' && f.learnHeader) $h5.text(f.learnHeader);
    });
    // Footer links
    if (f.links) {
      $('.footer-col a').each(function() {
        const $a = $(this);
        const text = $a.text().trim();
        if (f.links[text]) $a.text(f.links[text]);
      });
    }
    // LEI label
    if (f.leiLabel) {
      const lei = $('.footer-lei-label');
      if (lei.length) lei.text(f.leiLabel);
    }
    // Disclaimer
    if (f.disclaimer) {
      const disclaimerPs = $('.footer-disclaimer p');
      if (f.disclaimer.p1 && disclaimerPs.length > 0) $(disclaimerPs[0]).html(f.disclaimer.p1);
      if (f.disclaimer.p2 && disclaimerPs.length > 1) $(disclaimerPs[1]).html(f.disclaimer.p2);
      if (f.disclaimer.copyright && disclaimerPs.length > 2) $(disclaimerPs[2]).html(f.disclaimer.copyright);
    }
  }

  // ─ Product tags (shared across pages) ─
  if (s.productTags) {
    if (s.productTags.live) {
      $('.tag-live').each(function() { $(this).text('\u25CF ' + s.productTags.live); });
    }
    if (s.productTags.comingSoon) {
      $('.tag-soon').each(function() { $(this).text(s.productTags.comingSoon); });
    }
  }
}

// ── Translate page-specific content ────────────────────────
function translatePage($, pageName, t) {
  const p = t.pages && t.pages[pageName];
  if (!p) return;

  // Generic approach: iterate over key-value pairs and use selectors
  // Support both selector-based and text-match-based approaches

  if (p._selectors) {
    // Selector-based: { selector: text }
    for (const [sel, text] of Object.entries(p._selectors)) {
      const $el = $(sel);
      if ($el.length && text) {
        $el.html(text);
      }
    }
  }

  // Section-based translations
  if (p.sections) {
    for (const section of p.sections) {
      const $section = section.id ? $(`#${section.id}`) : $(section.selector);
      if (!$section.length) continue;

      if (section.label) {
        const $label = $section.find('.section-label').first();
        if ($label.length) $label.text(section.label);
      }
      if (section.title) {
        const $title = $section.find('.section-title').first();
        if ($title.length) $title.html(section.title);
      }
      if (section.subtitle) {
        const $sub = $section.find('.section-subtitle').first();
        if ($sub.length) $sub.html(section.subtitle);
      }
    }
  }

  // Text replacements: { "English text": "Translated text" }
  if (p._textReplace) {
    for (const [eng, trans] of Object.entries(p._textReplace)) {
      // Search all text-bearing elements
      $('h1, h2, h3, h4, h5, h6, p, span, a, button, div, label, option, li, dt, dd, th, td, blockquote, cite').each(function() {
        const $el = $(this);
        // Only replace if this element's direct text matches
        const clone = $el.clone();
        clone.children().remove();
        const directText = clone.text().trim();
        if (directText === eng) {
          if ($el.children().length === 0) {
            // No children — simple text replacement
            $el.text(trans);
          } else {
            // Has children — replace only the text node, preserving child elements
            const html = $el.html();
            // Replace the first occurrence of the English text in the HTML
            // (text nodes appear as raw text in the HTML string)
            $el.html(html.replace(eng, trans));
          }
        }
        // Also check full text content for leaf elements (no children)
        if ($el.children().length === 0) {
          const fullText = $el.text().trim();
          if (fullText === eng && fullText !== directText) {
            $el.text(trans);
          }
        }
      });
    }
  }

  // HTML replacements: { selector: html }
  if (p._html) {
    for (const [sel, html] of Object.entries(p._html)) {
      const $el = $(sel);
      if ($el.length) $el.html(html);
    }
  }
}

// ── Fix internal links for language subdirectory ───────────
function fixLinks($, lang, isInsight) {
  const internalPages = [
    'index.html', 'about.html', 'contact.html', 'ecosystem.html',
    'explore.html', 'faq.html', 'glossary.html', 'insights.html',
    'issuances.html', 'legal-framework.html', 'tutorials.html'
  ];
  const insightPages = [
    'insights/audit-report.html',
    'insights/pioneering-the-future-of-finance.html',
    'insights/ustbl-reaches-goal.html',
    'insights/ustbl-rid-update-2025.html',
    'insights/ustbl.html'
  ];

  $('a[href]').each(function() {
    const $a = $(this);
    let href = $a.attr('href');
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // Normalize relative paths from insight articles
    let normalized = href;
    if (isInsight && href.startsWith('../')) {
      normalized = href.replace('../', '');
    }

    // Check if it's an internal page link (supports both relative and absolute formats)
    for (const page of internalPages) {
      const pageName = page.replace('.html', '');
      if (normalized === page || normalized === pageName || normalized === '/' + pageName || normalized === '/' + page) {
        $a.attr('href', `/${lang}/${pageName}`);
        return;
      }
    }
    // Homepage special case: "/" → "/{lang}/index"
    if (normalized === '/') {
      $a.attr('href', `/${lang}/index`);
      return;
    }
    // Check insight pages
    for (const page of insightPages) {
      const pageName = page.replace('.html', '');
      if (normalized === page || normalized === pageName || href === page || href === pageName || normalized === '/' + pageName || normalized === '/' + page) {
        $a.attr('href', `/${lang}/${pageName}`);
        return;
      }
    }
    // Hash links with page reference
    for (const page of internalPages) {
      const pageName = page.replace('.html', '');
      if (normalized.startsWith(page + '#') || normalized.startsWith(pageName + '#') ||
          normalized.startsWith('/' + page + '#') || normalized.startsWith('/' + pageName + '#')) {
        const hash = normalized.substring(normalized.indexOf('#'));
        $a.attr('href', `/${lang}/${pageName}${hash}`);
        return;
      }
    }
  });

  // Fix asset paths to absolute
  $('img[src], link[href], script[src]').each(function() {
    const $el = $(this);
    const attr = $el.is('link') ? 'href' : 'src';
    let val = $el.attr(attr);
    if (!val || val.startsWith('http') || val.startsWith('//') || val.startsWith('/') || val.startsWith('data:')) return;

    // Make paths absolute
    if (isInsight && val.startsWith('../')) {
      val = val.replace('../', '');
    }
    $el.attr(attr, '/' + val);
  });

  // Fix CSS url() references for background images (in inline styles if any remain)
  $('style').each(function() {
    let css = $(this).html();
    if (!css) return;
    // Replace relative url() paths — url("something.svg") → url("/something.svg")
    css = css.replace(/url\(["']?(?!data:|http|\/\/|\/)([^"')]+)["']?\)/g, function(match, p1) {
      if (isInsight && p1.startsWith('../')) {
        p1 = p1.replace('../', '');
      }
      return 'url("/' + p1 + '")';
    });
    $(this).html(css);
  });
}

// ── Add hreflang tags ──────────────────────────────────────
function addHreflang($, lang, pagePath, allLangs) {
  const head = $('head');
  let cleanPath = pagePath.replace('.html', '');
  // Use / instead of /index for homepage
  const enPath = cleanPath === 'index' ? '/' : '/' + cleanPath;

  // Self
  head.append(`\n    <link rel="alternate" hreflang="${lang}" href="/${lang}/${cleanPath}">`);
  // English original
  head.append(`\n    <link rel="alternate" hreflang="en" href="${enPath}">`);
  // Other languages
  for (const otherLang of allLangs) {
    if (otherLang !== lang) {
      head.append(`\n    <link rel="alternate" hreflang="${otherLang}" href="/${otherLang}/${cleanPath}">`);
    }
  }
  // x-default
  head.append(`\n    <link rel="alternate" hreflang="x-default" href="${enPath}">`);
}

// ── Update cookie-consent.js references for translated text ──
function addCookieTranslation($, t) {
  if (!t.shared || !t.shared.cookies) return;
  const c = t.shared.cookies;
  // Inject a script that overrides cookie-consent text after it loads
  const script = `
<script>
(function() {
  var cookieI18n = ${JSON.stringify(c)};
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var title = document.querySelector('.nb-cookie-title');
      var body = document.querySelector('.nb-cookie-body');
      var allowNec = document.getElementById('nbAllowNecessary');
      var allowAll = document.getElementById('nbAllowAll');
      var settingsTitle = document.querySelector('.nb-cookie-settings-title');
      var settingsDesc = document.querySelector('.nb-cookie-settings-desc');
      var settingsConfirm = document.getElementById('nbSettingsConfirm');
      var settingsAllowAll = document.getElementById('nbSettingsAllowAll');

      if (title && cookieI18n.title) title.textContent = cookieI18n.title;
      if (body && cookieI18n.body) body.innerHTML = cookieI18n.body;
      if (allowNec && cookieI18n.allowNecessary) allowNec.textContent = cookieI18n.allowNecessary;
      if (allowAll && cookieI18n.allowAll) allowAll.textContent = cookieI18n.allowAll;
      if (settingsTitle && cookieI18n.settingsTitle) settingsTitle.textContent = cookieI18n.settingsTitle;
      if (settingsDesc && cookieI18n.settingsDesc) settingsDesc.textContent = cookieI18n.settingsDesc;
      if (settingsConfirm && cookieI18n.confirm) settingsConfirm.textContent = cookieI18n.confirm;
      if (settingsAllowAll && cookieI18n.settingsAllowAll) settingsAllowAll.textContent = cookieI18n.settingsAllowAll;

      // Category names and descriptions
      var catNames = document.querySelectorAll('.nb-cookie-cat-name');
      var catDescs = document.querySelectorAll('.nb-cookie-cat-desc');
      if (cookieI18n.categories) {
        var cats = cookieI18n.categories;
        var order = ['necessary', 'functional', 'analytical', 'marketing'];
        for (var i = 0; i < order.length; i++) {
          if (cats[order[i]] && catNames[i]) catNames[i].textContent = cats[order[i]].name;
          if (cats[order[i]] && catDescs[i]) catDescs[i].textContent = cats[order[i]].desc;
        }
      }
    }, 100);
  });
})();
</script>`;
  $('body').append(script);
}

// ── Main build ─────────────────────────────────────────────
function build() {
  const translations = loadTranslations();
  const allLangCodes = translations.map(t => t._meta.lang);

  // ── Phase 1: Build English pages (inject partials only) ──
  console.log('── Building: English (en) ──');

  for (const pagePath of ALL_PAGES) {
    const srcPath = path.join(SRC_DIR, pagePath);
    if (!fs.existsSync(srcPath)) {
      console.log(`  SKIP: ${pagePath} (not found in src/)`);
      continue;
    }

    // Read source template and inject partials
    const srcHtml = fs.readFileSync(srcPath, 'utf8');
    const html = injectPartials(srcHtml);

    // Write to project root
    const isInsight = pagePath.startsWith('insights/');
    if (isInsight) {
      fs.mkdirSync(path.join(ROOT, 'insights'), { recursive: true });
    }
    const outPath = path.join(ROOT, pagePath);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`  \u2713 ${pagePath}`);
  }

  // ── Phase 2: Build translated pages ──
  if (translations.length === 0) {
    console.log('\nNo translation files found in i18n/');
    console.log('\n\u2714  Build complete!');
    return;
  }

  console.log(`\nFound ${translations.length} language(s): ${allLangCodes.join(', ')}`);

  for (const t of translations) {
    const lang = t._meta.lang;
    const langName = t._meta.langName;
    console.log(`\n── Building: ${langName} (${lang}) ──`);

    for (const pagePath of ALL_PAGES) {
      const srcPath = path.join(SRC_DIR, pagePath);
      if (!fs.existsSync(srcPath)) {
        console.log(`  SKIP: ${pagePath} (not found in src/)`);
        continue;
      }

      // Read source template and inject partials
      const srcHtml = fs.readFileSync(srcPath, 'utf8');
      const assembledHtml = injectPartials(srcHtml);

      const $ = cheerio.load(assembledHtml, { decodeEntities: false });

      // Set lang attribute
      $('html').attr('lang', lang);

      // Update title
      if (t.shared && t.shared.pageTitle) {
        $('title').text(t.shared.pageTitle);
      }

      // Translate shared elements
      translateShared($, t);

      // Translate page-specific content
      const isInsight = pagePath.startsWith('insights/');
      const pageName = pagePath.replace('insights/', '').replace('.html', '');
      translatePage($, pageName, t);

      // Fix links for language subdirectory
      fixLinks($, lang, isInsight);

      // Add hreflang tags
      addHreflang($, lang, pagePath, allLangCodes);

      // Add cookie translation script
      addCookieTranslation($, t);

      // Write output
      const outDir = path.join(ROOT, lang, isInsight ? 'insights' : '');
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(ROOT, lang, pagePath);
      fs.writeFileSync(outPath, $.html(), 'utf8');
      console.log(`  \u2713 ${lang}/${pagePath}`);
    }
  }

  console.log('\n\u2714  Build complete!');
}

build();
