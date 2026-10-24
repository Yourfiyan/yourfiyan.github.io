import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Code2,
  Copy,
  ExternalLink,
  HelpCircle,
  MousePointer2,
  Search,
  Sliders,
  Sparkles,
  Table as TableIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, CURSOR_CATEGORIES } from '../constants';
import { useJsonLd, usePageMeta } from '../hooks/usePageMeta';

// Flattened view of the catalog in constants.ts, tagged with its category
// so a single list drives both the search box and the category pills.
const ALL_CURSORS = CURSOR_CATEGORIES.flatMap(category =>
  category.cursors.map(cursor => ({ ...cursor, category: category.name }))
);

const COPY_FEEDBACK_MS = 1600;

// Search-facing metadata. The title leads with what people actually search
// for ("CSS Cursor Playground & Complete Reference") to target #1 rankings
// for cursor queries; usePageMeta appends the site suffix.
const PAGE_TITLE = 'CSS Cursor Playground & Complete Reference — All 36 Values';
const PAGE_DESCRIPTION =
  'Interactive CSS cursor playground and complete reference. Live preview all 36 standard CSS cursor values, test custom cursors, browse cheat sheet, and copy CSS rules.';
const PAGE_KEYWORDS =
  'css cursor, css cursor playground, css cursor list, all 36 css cursors, css cursor reference, custom cursor css, cursor pointer, css cursor values, css cursor cheat sheet, css mouse cursor, css cursor tester, css cursor syntax';

// Rendered in the FAQ section AND serialized into the FAQPage JSON-LD,
// so the structured data can never drift from the visible answers.
const FAQ_ITEMS = [
  {
    q: 'How do I change the mouse cursor in CSS?',
    a: 'Set the cursor property on the element, for example button { cursor: pointer; }. The browser shows that cursor whenever the pointer is over the element, and the value is inherited by the element’s children unless they override it.',
  },
  {
    q: 'How do I make a custom cursor in CSS with an image?',
    a: 'Use an image URL plus a mandatory keyword fallback: cursor: url("pen.png") 2 2, auto;. The two numbers specify the hotspot x and y coordinates in image pixels from the top-left corner. Keep the image small (under 128×128, recommended 32×32) and use PNG, SVG with intrinsic dimensions, or .cur.',
  },
  {
    q: 'Why is my custom CSS cursor not working?',
    a: 'The three most common causes: (1) The trailing keyword fallback after url() is missing, which makes the CSS rule invalid and silently dropped; (2) The image exceeds the 128×128 pixel browser limit; (3) The SVG lacks intrinsic width and height attributes; or (4) The element has pointer-events: none.',
  },
  {
    q: 'Does cursor: pointer work on mobile phones and tablets?',
    a: 'No. Standard touchscreens do not display a mouse cursor, so cursor properties have no visible effect. On iPadOS with an external trackpad or mouse, the pointer renders as a small adaptive circle where text is the only keyword that morphs its shape. Never use cursor as the only indicator of clickability.',
  },
  {
    q: 'How do I hide the cursor with CSS?',
    a: 'cursor: none removes the pointer while over the element. Use it only when an alternative pointer is provided (such as an in-canvas brush or drawing reticle) or in media players where the pointer fades out during fullscreen video playback.',
  },
  {
    q: 'What is the difference between wait and progress cursors?',
    a: 'Both indicate that the system is busy. progress means background work is happening but the user can still click and interact with the page; wait means the entire application is blocked and the user must wait until the task completes.',
  },
  {
    q: 'How do I set the hotspot for an image cursor in CSS?',
    a: 'Specify the x and y pixel offsets after the url(), like cursor: url("cursor.png") 10 5, pointer;. Here 10px from the left and 5px from the top is the exact active click coordinate. If omitted, the default hotspot is 0 0 (the top-left pixel).',
  },
  {
    q: 'Can I animate a CSS cursor?',
    a: 'CSS cannot animate the cursor property directly via transitions or CSS @keyframes. To create animated cursors, use an animated .ani file (supported primarily on Windows), change cursor classes via JavaScript requestAnimationFrame, or hide the native cursor with cursor: none and render a custom DOM element that tracks pointer coordinates.',
  },
];

const filterPillClass = (active: boolean) =>
  `text-xs font-medium px-4 py-2 rounded-full transition-colors ${
    active
      ? 'bg-primary text-white'
      : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
  }`;

// ── Small presentational helpers for the reference sections ──
const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed mb-6">
    <code className="font-mono text-slate-300">{code}</code>
  </pre>
);

const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="font-mono text-secondary bg-white/5 px-1.5 py-0.5 rounded text-[0.9em]">
    {children}
  </code>
);

const ProseLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary hover:text-white underline underline-offset-4 transition-colors"
  >
    {children}
  </a>
);

const CursorPlaygroundPage: React.FC = () => {
  usePageMeta(PAGE_TITLE, PAGE_DESCRIPTION, PAGE_KEYWORDS);

  // Route-specific structured data. Absolute URLs come from the current
  // origin, mirroring how usePageMeta builds canonicals for both hosts.
  const origin = window.location.origin;
  useJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${origin}/labs/cursor-playground#app`,
        name: 'CSS Cursor Playground & Live Reference',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: PAGE_DESCRIPTION,
        url: `${origin}/labs/cursor-playground`,
      },
      {
        '@type': 'TechArticle',
        '@id': `${origin}/labs/cursor-playground#article`,
        headline: 'CSS Cursor Playground: an interactive reference for all 36 cursor values',
        description: PAGE_DESCRIPTION,
        keywords: PAGE_KEYWORDS,
        proficiencyLevel: 'Beginner',
        url: `${origin}/labs/cursor-playground`,
        mainEntityOfPage: `${origin}/labs/cursor-playground`,
        inLanguage: 'en',
        datePublished: '2026-07-22',
        dateModified: '2026-07-22',
        author: {
          '@type': 'Person',
          name: 'Syed Sufiyan Hamza',
          url: origin,
          sameAs: [CONTACT_INFO.github, CONTACT_INFO.linkedin],
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Labs', item: `${origin}/labs` },
          { '@type': 'ListItem', position: 3, name: 'CSS Cursor Playground', item: `${origin}/labs/cursor-playground` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'All 36 CSS Cursor Keywords',
        numberOfItems: ALL_CURSORS.length,
        itemListElement: ALL_CURSORS.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.value,
          description: c.hint,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const copyTimeout = useRef<number | undefined>(undefined);

  // Interactive tester / sandbox state
  const [testerCursor, setTesterCursor] = useState('crosshair');
  const [testerActive, setTesterActive] = useState(false);
  const [testerClicks, setTesterClicks] = useState(0);
  const [copiedTester, setCopiedTester] = useState(false);
  const testerCopyTimeout = useRef<number | undefined>(undefined);

  // Touch screens never show hover cursors, so tell those visitors up front
  // that the preview half of the page won't apply (copying still works).
  const [isCoarsePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true
  );

  useEffect(() => () => {
    window.clearTimeout(copyTimeout.current);
    window.clearTimeout(testerCopyTimeout.current);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = ALL_CURSORS.filter(cursor => {
    if (activeCategory && cursor.category !== activeCategory) return false;
    if (!normalizedQuery) return true;
    return (
      cursor.value.toLowerCase().includes(normalizedQuery) ||
      cursor.hint.toLowerCase().includes(normalizedQuery)
    );
  });

  const copyCursor = async (value: string) => {
    try {
      await navigator.clipboard.writeText(`cursor: ${value};`);
      window.clearTimeout(copyTimeout.current);
      setCopiedValue(value);
      copyTimeout.current = window.setTimeout(() => setCopiedValue(null), COPY_FEEDBACK_MS);
    } catch {
      // Clipboard access denied — the rule is printed on the card anyway
    }
  };

  const copyTesterCode = async () => {
    try {
      await navigator.clipboard.writeText(`cursor: ${testerCursor};`);
      window.clearTimeout(testerCopyTimeout.current);
      setCopiedTester(true);
      testerCopyTimeout.current = window.setTimeout(() => setCopiedTester(false), COPY_FEEDBACK_MS);
    } catch {
      // Fallback
    }
  };

  const loadIntoTester = (val: string) => {
    setTesterCursor(val);
    const el = document.getElementById('tester');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 relative z-10">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          to="/labs"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Labs
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono mb-4">
          <Sparkles size={14} /> Complete CSS UI Spec &middot; All 36 Values + Generator
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          CSS Cursor <span className="text-gradient">Playground</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Every standard CSS cursor value in one place — all {ALL_CURSORS.length} of them.
          Hover a card to preview the cursor, click it to copy the CSS rule, generate
          custom cursors, and explore full syntax &amp; browser support.
        </p>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6" />

        {/* Quick jump navigation (table of contents for quick lookups and SEO anchor sitelinks) */}
        <nav aria-label="Page sections" className="flex flex-wrap items-center justify-center gap-2 mt-8 text-xs font-mono">
          <span className="text-slate-500 mr-1">Jump to:</span>
          <a href="#playground" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            36 Values
          </a>
          <a href="#tester" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            Custom Generator
          </a>
          <a href="#cheat-sheet" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            Comparison Table
          </a>
          <a href="#what-is-the-css-cursor-property" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            What is Cursor?
          </a>
          <a href="#syntax" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            Syntax &amp; url()
          </a>
          <a href="#when-to-use-each-cursor" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            When to Use
          </a>
          <a href="#browser-support" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            Browser Support
          </a>
          <a href="#faq" className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-secondary/40 transition-colors">
            FAQ
          </a>
        </nav>
      </motion.div>

      {/* Touch-device note */}
      {isCoarsePointer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-2xl max-w-2xl mx-auto mb-8 flex items-start gap-3"
        >
          <MousePointer2 size={18} className="text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-slate-400 text-left leading-relaxed">
            Cursor previews need a mouse or trackpad — touch screens don't show
            hover cursors. You can still browse every cursor and copy its CSS.
          </p>
        </motion.div>
      )}

      {/* Interactive reference — the heading is for document structure
          (assistive tech + crawlers); the H1 already introduces it visually. */}
      <section id="playground" aria-labelledby="playground-heading" className="scroll-mt-28">
        <h2 id="playground-heading" className="sr-only">
          Interactive CSS cursor reference
        </h2>

        {/* Search + category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-6"
        >
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search cursors"
              placeholder="Search cursors — try “resize” or “zoom”…"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              aria-pressed={activeCategory === null}
              className={filterPillClass(activeCategory === null)}
            >
              All
            </button>
            {CURSOR_CATEGORIES.map(category => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                aria-pressed={activeCategory === category.name}
                className={filterPillClass(activeCategory === category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result count */}
        <p className="text-center text-xs text-slate-500 font-mono mb-8">
          {filtered.length} of {ALL_CURSORS.length} cursors
        </p>

        {/* Announce copies to screen readers (visual feedback is on the card) */}
        <div role="status" aria-live="polite" className="sr-only">
          {copiedValue ? `Copied cursor: ${copiedValue}; to clipboard` : ''}
        </div>

        {/* Cursor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cursor, idx) => {
            const isCopied = copiedValue === cursor.value;
            return (
              <motion.div
                key={cursor.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={() => copyCursor(cursor.value)}
                  style={{ cursor: cursor.value }}
                  aria-label={`Copy the CSS rule for the ${cursor.value} cursor`}
                  className="group block w-full h-full text-left glass-card p-5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-mono font-bold text-white group-hover:text-secondary transition-colors">
                      {cursor.value}
                    </span>
                    {isCopied ? (
                      <Check size={16} className="text-green-400 shrink-0 mt-1" />
                    ) : (
                      <Copy
                        size={16}
                        className="text-slate-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity shrink-0 mt-1"
                      />
                    )}
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{cursor.hint}</p>

                  <p
                    className={`text-xs font-mono transition-colors ${
                      isCopied ? 'text-green-400' : 'text-slate-500'
                    }`}
                  >
                    {isCopied ? 'Copied!' : `cursor: ${cursor.value};`}
                  </p>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 mt-12">
            No cursors match “{query}”. Try a different search or category.
          </p>
        )}

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-slate-500 mt-16 max-w-xl mx-auto leading-relaxed"
        >
          Exactly how each cursor looks depends on your OS and browser — Firefox
          on Windows, for instance, draws <span className="font-mono">no-drop</span>{' '}
          the same as <span className="font-mono">not-allowed</span>.
        </motion.p>
      </section>

      {/* ── Interactive Custom Cursor Sandbox & Generator ───────── */}
      <section id="tester" className="mt-20 scroll-mt-28">
        <div className="max-w-4xl mx-auto glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-secondary mb-1">
                <Sliders size={14} /> Interactive Sandbox
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Custom CSS Cursor Generator &amp; Tester
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              Pick any standard keyword or try preset custom cursors to test how the browser pointer reacts in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Select Cursor Keyword
                </label>
                <select
                  value={testerCursor}
                  onChange={e => setTesterCursor(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-secondary transition-colors"
                >
                  {CURSOR_CATEGORIES.map(cat => (
                    <optgroup key={cat.name} label={cat.name} className="bg-slate-900 text-slate-300">
                      {cat.cursors.map(c => (
                        <option key={c.value} value={c.value}>
                          {c.value} — {c.hint}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {['pointer', 'grab', 'crosshair', 'wait', 'zoom-in', 'not-allowed', 'none'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTesterCursor(val)}
                      className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                        testerCursor === val
                          ? 'bg-secondary/20 border-secondary text-secondary'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Generated CSS Rule
                </label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-3">
                  <code className="font-mono text-sm text-secondary flex-1 overflow-x-auto">
                    cursor: {testerCursor};
                  </code>
                  <button
                    type="button"
                    onClick={copyTesterCode}
                    aria-label="Copy generated cursor code"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedTester ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Interactive Box */}
            <div className="lg:col-span-6">
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Live Interactive Surface (Move mouse here)
              </label>
              <div
                style={{ cursor: testerCursor }}
                onMouseDown={() => setTesterActive(true)}
                onMouseUp={() => setTesterActive(false)}
                onClick={() => setTesterClicks(c => c + 1)}
                className={`h-64 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center select-none ${
                  testerActive
                    ? 'border-secondary bg-secondary/10'
                    : 'border-white/20 bg-white/[0.02] hover:border-secondary/60'
                }`}
              >
                <MousePointer2
                  size={32}
                  className={`mb-3 transition-transform ${
                    testerActive ? 'scale-125 text-secondary' : 'text-slate-500'
                  }`}
                />
                <p className="font-mono text-sm text-white font-bold mb-1">
                  Hovering with: <span className="text-secondary">{testerCursor}</span>
                </p>
                <p className="text-xs text-slate-400 max-w-xs mb-3">
                  Click and hold to test interaction state. Notice how your pointer changes instantly.
                </p>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                  Clicks registered: {testerClicks}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Complete CSS Cursor Cheatsheet & Comparison Table ──── */}
      <section id="cheat-sheet" className="mt-20 scroll-mt-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-secondary mb-1">
              <TableIcon size={14} /> Spec Cheatsheet
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              All 36 CSS Cursor Values Comparison Table
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Quick-reference guide mapping every CSS UI Level 4 keyword to its real-world purpose, common HTML elements, and CSS declaration.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 font-mono text-xs text-slate-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Keyword</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Description &amp; Meaning</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {ALL_CURSORS.map(cursor => (
                  <tr
                    key={cursor.value}
                    style={{ cursor: cursor.value }}
                    className="hover:bg-white/[0.04] transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white group-hover:text-secondary whitespace-nowrap">
                      {cursor.value}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 whitespace-nowrap font-mono">
                      {cursor.category}
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-xs leading-relaxed">
                      {cursor.hint}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => copyCursor(cursor.value)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono border border-white/10 transition-colors"
                      >
                        {copiedValue === cursor.value ? (
                          <>
                            <Check size={12} className="text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy CSS</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Reference guide ─────────────────────────────────────────
          Static prose below the interactive tool. Kept free of entrance
          animations: it sits below the fold, and static markup is kinder
          to CLS/INP than three screens of motion wrappers. */}
      <div className="max-w-3xl mx-auto mt-24">
        <section id="what-is-the-css-cursor-property" className="scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            What is the CSS cursor property?
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            The <InlineCode>cursor</InlineCode> property controls which mouse pointer the
            browser shows while the pointer is over an element. It is defined in the{' '}
            <ProseLink href="https://drafts.csswg.org/css-ui-4/#cursor">
              CSS Basic User Interface Module Level 4
            </ProseLink>
            , it is inherited, its initial value is <InlineCode>auto</InlineCode>, and it
            applies to every element — including the <InlineCode>::before</InlineCode> and{' '}
            <InlineCode>::after</InlineCode> pseudo-elements.
          </p>
          <p className="text-slate-400 leading-relaxed mb-4">
            <InlineCode>auto</InlineCode> is not a fixed cursor. The spec says it behaves
            as <InlineCode>text</InlineCode> over selectable text and editable fields, and
            as <InlineCode>default</InlineCode> — the platform arrow — everywhere else.
            That is why paragraphs get the I-beam without you writing any CSS.
          </p>
          <p className="text-slate-400 leading-relaxed mb-4">
            The cursor is a hint, not a guarantee. Browsers may ignore it over native UI
            such as scrollbars, while the page is busy, or during a text selection, and
            they block cursor changes that overlap browser toolbars to prevent spoofing.
          </p>
        </section>

        <section id="syntax" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Syntax: keyword and custom image cursors
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Most of the time you assign one of the {ALL_CURSORS.length} keywords from the
            playground above:
          </p>
          <CodeBlock
            code={`a            { cursor: pointer; }   /* links and clickable things */
.saving      { cursor: progress; }  /* busy, but still interactive */
.map-canvas  { cursor: grab; }
.map-canvas:active { cursor: grabbing; }`}
          />

          <h3 className="text-lg font-bold text-white mt-8 mb-3">Custom image cursors</h3>
          <p className="text-slate-400 leading-relaxed mb-4">
            The full grammar is a comma-separated list of images followed by one keyword:
          </p>
          <CodeBlock
            code={`/* One image, hotspot at 4,4 — crosshair if it fails to load */
.paint { cursor: url("brush.png") 4 4, crosshair; }

/* Several formats: the first one the browser can load wins */
.paint { cursor: url("brush.svg"), url("brush.cur"), auto; }`}
          />
          <ul className="list-disc pl-5 text-slate-400 leading-relaxed space-y-2 mb-4">
            <li>
              The trailing keyword is <strong className="text-white">mandatory</strong>.
              A <InlineCode>url()</InlineCode> list without it is invalid CSS, and the
              whole declaration is dropped.
            </li>
            <li>
              The two optional numbers set the <em>hotspot</em> — the exact pixel that
              does the pointing — as x and y offsets from the image's top-left corner.
              Out-of-range values are clamped; if omitted, the image's own hotspot is
              used, falling back to <InlineCode>0 0</InlineCode>.
            </li>
            <li>
              Browsers must support PNG and static SVG with an intrinsic size; desktop
              browsers also broadly support the <InlineCode>.cur</InlineCode> format.
            </li>
            <li>
              Firefox and Chromium ignore cursor images larger than 128×128 pixels.
              MDN recommends staying at 32×32, which also matches typical OS cursor
              sizes.
            </li>
          </ul>
        </section>

        <section id="when-to-use-each-cursor" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            When to use each cursor
          </h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            The spec groups the keywords into six families — the same grouping the
            filter pills above use. Here is where each family earns its keep in real
            interfaces:
          </p>
          <ul className="list-disc pl-5 text-slate-400 leading-relaxed space-y-3 mb-4">
            <li>
              <strong className="text-white">General</strong> —{' '}
              <InlineCode>default</InlineCode> restores the arrow (useful on text you
              don't want the I-beam on), <InlineCode>none</InlineCode> hides the pointer
              for canvas apps and video players that draw their own.
            </li>
            <li>
              <strong className="text-white">Links &amp; status</strong> —{' '}
              <InlineCode>pointer</InlineCode> for links; <InlineCode>progress</InlineCode>{' '}
              while an autosave or background sync runs and the UI stays usable;{' '}
              <InlineCode>wait</InlineCode> only when the user genuinely can't continue;{' '}
              <InlineCode>help</InlineCode> on "what's this?" affordances.
            </li>
            <li>
              <strong className="text-white">Selection</strong> —{' '}
              <InlineCode>text</InlineCode> and <InlineCode>vertical-text</InlineCode> for
              editable or selectable content, <InlineCode>cell</InlineCode> for
              spreadsheet-style grids, <InlineCode>crosshair</InlineCode> for precise
              picking in screenshot croppers, color pickers, and charts.
            </li>
            <li>
              <strong className="text-white">Drag &amp; drop</strong> —{' '}
              <InlineCode>grab</InlineCode>/<InlineCode>grabbing</InlineCode> for pannable
              maps, whiteboards, and image viewers; <InlineCode>move</InlineCode> for
              repositionable items; <InlineCode>copy</InlineCode> and{' '}
              <InlineCode>alias</InlineCode> in file-manager-style trees;{' '}
              <InlineCode>no-drop</InlineCode> means "not on <em>this</em> target," while{' '}
              <InlineCode>not-allowed</InlineCode> means the action itself is blocked.
            </li>
            <li>
              <strong className="text-white">Resize &amp; scroll</strong> — the eight
              single-edge cursors (<InlineCode>n-resize</InlineCode>,{' '}
              <InlineCode>se-resize</InlineCode>, …) say "this edge moves"; the four
              bidirectional ones (<InlineCode>ew-resize</InlineCode>,{' '}
              <InlineCode>nwse-resize</InlineCode>, …) fit handles that drag both ways.{' '}
              <InlineCode>col-resize</InlineCode> and <InlineCode>row-resize</InlineCode>{' '}
              belong on table and split-pane dividers, <InlineCode>all-scroll</InlineCode>{' '}
              on middle-click panning.
            </li>
            <li>
              <strong className="text-white">Zoom</strong> —{' '}
              <InlineCode>zoom-in</InlineCode> and <InlineCode>zoom-out</InlineCode> for
              lightboxes, image previews, and map controls.
            </li>
          </ul>
        </section>

        <section id="browser-support" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Browser support
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            All {ALL_CURSORS.length} keywords work in every current major browser —{' '}
            <ProseLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">
              MDN
            </ProseLink>{' '}
            lists the property as Baseline "Widely available." The history only matters
            if you support very old browsers:
          </p>
          <ul className="list-disc pl-5 text-slate-400 leading-relaxed space-y-2 mb-4">
            <li>
              <InlineCode>zoom-in</InlineCode>/<InlineCode>zoom-out</InlineCode> shipped
              unprefixed in Chrome 37, Firefox 24, and Safari 9;{' '}
              <InlineCode>grab</InlineCode>/<InlineCode>grabbing</InlineCode> were the
              last to land — Chrome 68, Firefox 27, Safari 11. Before that they needed{' '}
              <InlineCode>-webkit-</InlineCode>/<InlineCode>-moz-</InlineCode> prefixes,
              and Internet Explorer never supported any of the four.
            </li>
            <li>
              Touchscreens render no cursor at all, which is why compatibility tables
              mark mobile browsers as unsupported. The exception: iPadOS with a trackpad
              or mouse shows a circular pointer, and <InlineCode>text</InlineCode> is the
              only keyword that changes its appearance.
            </li>
            <li>
              Platform quirks exist: Firefox draws <InlineCode>no-drop</InlineCode> like{' '}
              <InlineCode>not-allowed</InlineCode> on Windows and macOS and{' '}
              <InlineCode>all-scroll</InlineCode> like <InlineCode>move</InlineCode> on
              Windows, and <InlineCode>context-menu</InlineCode> only gets a distinct
              cursor on macOS and Linux.
            </li>
            <li>
              <InlineCode>url()</InlineCode> image cursors have worked on desktop
              browsers since their earliest versions (Chrome 1, Firefox 1.5, Safari 3,
              IE 6).
            </li>
          </ul>
        </section>

        <section id="accessibility" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Accessibility and UX guidance
          </h2>
          <ul className="list-disc pl-5 text-slate-400 leading-relaxed space-y-3 mb-4">
            <li>
              <strong className="text-white">
                The cursor must never be the only affordance.
              </strong>{' '}
              Keyboard, touch, and switch users never see it — pair it with visible
              hover/focus states and real semantics (a <InlineCode>button</InlineCode>,
              a link), never a <InlineCode>div</InlineCode> that only looks clickable on
              mouse-over.
            </li>
            <li>
              A custom image cursor replaces the pointer a user may have enlarged or
              recolored in their OS accessibility settings. If you must use one, keep it
              small, high-contrast against your backgrounds, and set the hotspot to the
              pixel that visually points.
            </li>
            <li>
              <InlineCode>cursor: none</InlineCode> is only defensible when something
              else takes the pointer's place, and it must come back the moment the
              pointer leaves the region.
            </li>
            <li>
              The pointer-on-buttons debate: the spec reserves{' '}
              <InlineCode>pointer</InlineCode> for links, and operating systems keep the
              arrow on native buttons — yet years of web convention use the hand for
              anything clickable, and many design systems follow suit. Either stance is
              defensible; being consistent across your product matters more than the
              side you pick.
            </li>
            <li>
              Don't let the cursor lie. <InlineCode>not-allowed</InlineCode> over a
              working control, or <InlineCode>pointer</InlineCode> over dead text,
              erodes trust in every other affordance on the page.
            </li>
          </ul>
        </section>

        <section id="common-mistakes" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Common mistakes
          </h2>
          <ul className="list-disc pl-5 text-slate-400 leading-relaxed space-y-3 mb-4">
            <li>
              <strong className="text-white">No keyword after url().</strong> The
              fallback keyword is required by the grammar — without it the declaration
              is invalid and silently dropped, which looks exactly like "my custom
              cursor doesn't work."
            </li>
            <li>
              <strong className="text-white">Oversized cursor images.</strong> Anything
              over 128×128 pixels is ignored by Firefox and Chromium; an SVG without an
              intrinsic <InlineCode>width</InlineCode>/<InlineCode>height</InlineCode>{' '}
              can fail the same way.
            </li>
            <li>
              <strong className="text-white">
                <InlineCode>wait</InlineCode> when you mean{' '}
                <InlineCode>progress</InlineCode>.
              </strong>{' '}
              If the interface still responds during the operation,{' '}
              <InlineCode>wait</InlineCode> tells users to stop for no reason.
            </li>
            <li>
              <strong className="text-white">
                Cursor rules under <InlineCode>pointer-events: none</InlineCode>.
              </strong>{' '}
              An element that can't be a hover target never shows its own cursor — the
              parent's cursor appears instead, so the rule looks broken.
            </li>
            <li>
              <strong className="text-white">Forgetting the active state.</strong> A
              draggable surface should switch from <InlineCode>grab</InlineCode> to{' '}
              <InlineCode>grabbing</InlineCode> (via <InlineCode>:active</InlineCode> or
              a class while dragging) — a hand that never closes feels unresponsive.
            </li>
            <li>
              <strong className="text-white">Designing for the cursor on touch.</strong>{' '}
              Any interaction cue that exists only as a cursor change is invisible to
              every phone and tablet user.
            </li>
          </ul>
        </section>

        <section id="faq" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map(item => (
              <div key={item.q} className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about-this-tool" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            About this playground
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Cursor Playground is one of the experiments in my{' '}
            <Link to="/labs" className="text-primary hover:text-white underline underline-offset-4 transition-colors">
              Labs collection
            </Link>{' '}
            — small, focused tools that run right inside this site. If you're curious
            about the stack behind it, I wrote up{' '}
            <Link
              to="/blog/building-portfolio-with-react"
              className="text-primary hover:text-white underline underline-offset-4 transition-colors"
            >
              how this portfolio is built with React and Vite
            </Link>
            . For the normative details beyond this page, the{' '}
            <ProseLink href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">
              MDN cursor reference
            </ProseLink>{' '}
            and the{' '}
            <ProseLink href="https://drafts.csswg.org/css-ui-4/#cursor">
              CSS UI Level 4 draft
            </ProseLink>{' '}
            are the sources this guide was checked against.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CursorPlaygroundPage;
