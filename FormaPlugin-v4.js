/* ============================================================
   FORMA PLUGIN — Squarespace customization plugin by Studio Poema
   File: FormaPlugin-v4.js · Single-file injection · No dependencies
   Panel is shown ONLY to logged-in Squarespace admins.
   Install: paste the generated snippet into
   Settings → Advanced → Code Injection → Footer
   Editor: add ?forma=1 to your site URL, or press Alt+F
   ============================================================ */
(() => {
  "use strict";

  /* ---------- constants ---------- */
  const APP = "forma";
  const VERSION = "4.0";
  const KEYS = {
    config: `${APP}:config:v1`,
    panel: `${APP}:panel`,
    pos: `${APP}:pos`,
    editor: `${APP}:editor`
  };
  const IDS = {
    root: `${APP}-root`,
    baseCss: `${APP}-base-css`,
    fxCss: `${APP}-fx-css`,
    progress: `${APP}-progress`,
    cursor: `${APP}-cursor`,
    totop: `${APP}-totop`,
    cue: `${APP}-cue`,
    configTag: `${APP}-config`
  };
  const SCRIPT_SRC = document.currentScript?.src || "";

  /* ---------- utilities ---------- */
  const clamp = (v, lo = 0, hi = 100) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : 50;
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const px = (a, b, t) => `${Math.round(lerp(a, b, t))}px`;
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cssEsc = (s) => (window.CSS?.escape ? CSS.escape(s) : String(s).replace(/[^a-zA-Z0-9_-]/g, "\\$&"));
  const rgba = (hex, a) => {
    const h = String(hex || "#125B49").replace("#", "");
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return `rgba(18,91,73,${a})`;
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));

  /* selector helpers — Squarespace 7.0 + 7.1 compatible */
  const MEDIA = (s) => `${s} img,${s} video,${s} .sqs-block-image img,${s} .image-block-wrapper img,${s} .thumb-image`;
  const MEDIA_WRAP = (s) => `${s} .sqs-block-image,${s} .image-block-wrapper,${s} figure`;
  const BTN = (s) => `${s} .sqs-button-element--primary,${s} .sqs-button-element--secondary,${s} .sqs-button-element--tertiary,${s} a.sqs-block-button-element,${s} .sqs-block-button a,${s} button[type="submit"],${s} .header-actions .btn,${s} .header-actions-action--cta a,${s} a.btn,${s} .list-item-content__button`;
  const ROW = (s) => `${s} .sqs-layout > .sqs-row,${s} > .content,${s} .fluid-engine`;
  const HEADER = `.header,#header,.Header,.site-header`;

  /* ---------- theme ---------- */
  const PALETTES = [
    { id: "poema",     label: "Poema",     primary: "#125B49", accent: "#AADD66", soft: "#FCF6EB", ink: "#051914" },
    { id: "midnight",  label: "Midnight",  primary: "#051914", accent: "#AADD66", soft: "#FCF6EB", ink: "#051914" },
    { id: "evergreen", label: "Evergreen", primary: "#125B49", accent: "#ECEABE", soft: "#FCF6EB", ink: "#003527" },
    { id: "mono",      label: "Mono",      primary: "#1A1A1A", accent: "#E8E4DA", soft: "#FAFAF7", ink: "#0A0A0A" }
  ];

  const DEFAULT_CONFIG = {
    version: VERSION,
    target: "body",
    scope: "selected",            // "selected" | "global"
    theme: { palette: "poema", primary: "#125B49", accent: "#AADD66", soft: "#FCF6EB", ink: "#051914" },
    effects: {}                   // { [selector]: { [effectId]: { on:true, i:60, p:{...} } } }
  };

  /* ============================================================
     EFFECT CATALOG
     Each effect: { id, label, desc, amount?, params?, cls?, global?, css(s, t, p, theme) }
       s     = CSS selector
       t     = intensity 0..1
       p(key, def) = param getter (0..100)
       theme = current theme colors
     Rule: effects writing to shared singletons (progress bar, cursor)
     use dedicated DOM nodes — never body:before/:after.
     ============================================================ */
  const CATALOG = [
  {
    group: "Typography", icon: "T",
    items: [
      { id: "ty-editorial", label: "Editorial rhythm", desc: "Tighter headings, comfortable body copy.", amount: "Scale",
        css: (s, t) => `${s} h1,${s} h2{line-height:${(1.16 - t * .14).toFixed(2)}!important;letter-spacing:${(-t * .02).toFixed(3)}em!important}${s} p{line-height:${(1.5 + t * .25).toFixed(2)};font-size:clamp(16px,${(1 + t * .4).toFixed(2)}vw,${Math.round(17 + t * 4)}px)}` },
      { id: "ty-gradient", label: "Gradient headings", desc: "Gradient across H1/H2 with your own colors.", amount: "Blend",
        params: [
          { k: "c1", label: "Color 1", type: "color", v: "#125B49" },
          { k: "c2", label: "Color 2", type: "color", v: "#AADD66" },
          { k: "dir", label: "Direction", type: "select", options: ["→", "↘", "↓", "↗", "←"], v: "→" },
          { k: "anim", label: "Animation speed (0 = static)", v: 0 }
        ],
        css: (s, t, p) => {
          const deg = { "→": 90, "↘": 135, "↓": 180, "↗": 45, "←": 270 }[p("dir", "→")] || 90;
          const a = p("anim", 0);
          const animCss = a > 0 ? `;background-size:220% 220%;animation:fmGradFlow ${(9 - a * .07).toFixed(1)}s ease infinite` : "";
          return `${s} h1,${s} h2{background:linear-gradient(${deg}deg,${p("c1", "#125B49")},${p("c2", "#AADD66")} ${Math.round(55 + t * 40)}%)${animCss};-webkit-background-clip:text;background-clip:text;color:transparent!important}${a > 0 ? "@keyframes fmGradFlow{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}" : ""}`;
        } },
      { id: "ty-highlight", label: "Marker highlight", desc: "Bold words get a marker underline.", amount: "Ink",
        params: [{ k: "c", label: "Marker color", type: "color", v: "#AADD66" }],
        css: (s, t, p) => `${s} strong{background:linear-gradient(transparent ${Math.round(78 - t * 28)}%,${rgba(p("c", "#AADD66"), .35 + t * .5)} 0);font-weight:inherit}` },
      { id: "ty-outline", label: "Outline display", desc: "Outlined editorial headings.", amount: "Stroke",
        css: (s, t, p, th) => `${s} h1,${s} h2{-webkit-text-stroke:${Math.round(1 + t * 2)}px ${th.primary};color:${rgba(th.primary, .04 + t * .08)}!important;text-shadow:none!important}` },
      { id: "ty-uppercase", label: "Luxury caps", desc: "Uppercase with wide tracking.", amount: "Tracking",
        css: (s, t, p, th) => `${s} h1,${s} h2,${s} h3{text-transform:uppercase!important;letter-spacing:${(.04 + t * .18).toFixed(2)}em!important;color:${th.ink}!important}` },
      { id: "ty-balance", label: "Balanced lines", desc: "Even heading line breaks.", amount: "—",
        css: (s) => `${s} h1,${s} h2,${s} h3{text-wrap:balance}` },
      { id: "ty-dropcap", label: "Drop cap", desc: "First letter of paragraphs enlarged.", amount: "Size",
        css: (s, t, p, th) => `${s} p:first-of-type::first-letter{font-size:${Math.round(180 + t * 160)}%;color:${th.primary};font-weight:700;padding-right:.06em;line-height:.9}` },
      { id: "ty-link-line", label: "Animated links", desc: "Links underline on hover.", amount: "Line",
        css: (s, t, p, th) => `${s} p a,${s} li a{background-image:linear-gradient(${th.primary},${th.primary});background-repeat:no-repeat;background-position:0 100%;background-size:100% ${Math.round(1 + t * 2)}px;text-decoration:none!important;transition:background-size .22s ease,color .22s ease}${s} p a:hover,${s} li a:hover{background-size:100% ${Math.round(4 + t * 6)}px;color:${th.ink}!important}` },
      { id: "ty-typewriter", label: "Typewriter", desc: "Heading types itself in with a caret.", amount: "Speed",
        css: (s, t, p, th) => `${s} h1,${s} h2{display:inline-block;white-space:nowrap;overflow:hidden;border-right:3px solid ${th.primary};animation:fmType ${(6 - t * 4).toFixed(1)}s steps(36,end) both,fmCaret .8s step-end infinite}@keyframes fmType{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}@keyframes fmCaret{50%{border-color:transparent}}` },
      { id: "ty-columns", label: "Text columns", desc: "Long paragraphs flow into columns.", amount: "Columns",
        css: (s, t) => `@media(min-width:800px){${s} p{column-count:${t > .5 ? 3 : 2};column-gap:${Math.round(28 + t * 30)}px}}` },
      { id: "ty-numbered", label: "Numbered headings", desc: "Auto-numbered section headings.", amount: "Size",
        css: (s, t, p, th) => `${s}{counter-reset:fmH}${s} h2{counter-increment:fmH}${s} h2::before{content:counter(fmH,decimal-leading-zero)" ";color:${th.accent};font-size:${Math.round(60 + t * 50)}%;font-weight:900;vertical-align:super;-webkit-text-stroke:1px ${th.primary}}` },
      { id: "ty-smallcaps", label: "Small caps", desc: "Refined small-caps body styling.", amount: "Tracking",
        css: (s, t) => `${s} h3,${s} h4{font-variant:small-caps;letter-spacing:${(.04 + t * .12).toFixed(2)}em!important}` },
      { id: "ty-shadow", label: "Heading shadow", desc: "Soft offset shadow behind headings.", amount: "Depth",
        css: (s, t, p, th) => `${s} h1,${s} h2{text-shadow:${Math.round(2 + t * 6)}px ${Math.round(2 + t * 6)}px 0 ${rgba(th.accent, .6 + t * .4)}}` },
      { id: "ty-quote", label: "Editorial quotes", desc: "Blockquotes with accent bar and italics.", amount: "Bar",
        css: (s, t, p, th) => `${s} blockquote{border-left:${Math.round(3 + t * 5)}px solid ${th.accent}!important;padding-left:1.2em!important;font-style:italic;color:${th.primary}!important;font-size:${Math.round(105 + t * 20)}%}` }
    ]
  },
  {
    group: "Kinetic", icon: "✴",
    items: [
      { id: "kn-blur-words", label: "Blur reveal · words", desc: "Each word sharpens and lifts in sequence.", amount: "Distance", cls: "fm-reveal", split: "word",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 40 }, { k: "blur", label: "Blur", v: 55 }],
        css: (s, t, p) => { const d = (1.15 - p("speed", 50) * .009).toFixed(2); return `${s} :is(h1,h2,h3) .fm-u{opacity:0!important;filter:blur(${Math.round(2 + p("blur", 55) * .14)}px);transform:translateY(${Math.round(8 + t * 30)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(15 + p("st", 40) * 1.6)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1!important;filter:none!important;transform:none!important}`; } },
      { id: "kn-blur-chars", label: "Blur reveal · characters", desc: "Letter-by-letter blur reveal.", amount: "Distance", cls: "fm-reveal", split: "char",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 30 }, { k: "blur", label: "Blur", v: 55 }],
        css: (s, t, p) => { const d = (1 - p("speed", 50) * .008).toFixed(2); return `${s} :is(h1,h2,h3) .fm-u{opacity:0!important;filter:blur(${Math.round(2 + p("blur", 55) * .12)}px);transform:translateY(${Math.round(4 + t * 18)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(8 + p("st", 30) * .9)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1!important;filter:none!important;transform:none!important}`; } },
      { id: "kn-blur-lines", label: "Blur reveal · lines", desc: "Whole lines sharpen one after another.", amount: "Distance", cls: "fm-reveal", split: "line",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 55 }, { k: "blur", label: "Blur", v: 55 }],
        css: (s, t, p) => { const d = (1.2 - p("speed", 50) * .009).toFixed(2); return `${s} :is(h1,h2,h3) .fm-u{opacity:0!important;filter:blur(${Math.round(2 + p("blur", 55) * .14)}px);transform:translateY(${Math.round(10 + t * 26)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--l,0)*${Math.round(60 + p("st", 55) * 3)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1!important;filter:none!important;transform:none!important}`; } },
      { id: "kn-slide-words", label: "Slide up · words", desc: "Words rise from a clipped baseline.", amount: "Distance", cls: "fm-reveal", split: "word",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 40 }],
        css: (s, t, p) => { const d = (1 - p("speed", 50) * .008).toFixed(2); return `${s} :is(h1,h2,h3) .fm-w{overflow:hidden;vertical-align:bottom}${s} :is(h1,h2,h3) .fm-u{opacity:0!important;transform:translateY(${Math.round(60 + t * 50)}%);transition:opacity ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(15 + p("st", 40) * 1.6)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1!important;transform:none!important}`; } },
      { id: "kn-flip-chars", label: "Flip in · characters", desc: "Letters flip in like tiles.", amount: "Flip", cls: "fm-reveal", split: "char",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 30 }],
        css: (s, t, p) => { const d = (.9 - p("speed", 50) * .006).toFixed(2); return `${s} :is(h1,h2,h3){perspective:600px}${s} :is(h1,h2,h3) .fm-u{opacity:0!important;transform:rotateX(${Math.round(50 + t * 40)}deg) translateY(8px);transform-origin:bottom;transition:opacity ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(8 + p("st", 30) * .9)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1!important;transform:none!important}`; } },
      { id: "kn-pop-chars", label: "Pop in · characters", desc: "Springy letter-by-letter pop.", amount: "Pop", cls: "fm-reveal", split: "char",
        params: [{ k: "st", label: "Stagger", v: 30 }],
        css: (s, t, p) => `${s} :is(h1,h2,h3) .fm-u{opacity:0!important;transform:scale(${(.3 - t * .25).toFixed(2)});transition:opacity .4s ease,transform .55s cubic-bezier(.2,${(1.4 + t * .9).toFixed(1)},.3,1);transition-delay:calc(var(--i)*${Math.round(8 + p("st", 30) * .9)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1!important;transform:none!important}` },
      { id: "kn-wave-loop", label: "Wave loop", desc: "Letters bob in a continuous wave.", amount: "Height", split: "char",
        params: [{ k: "speed", label: "Speed", v: 45 }],
        css: (s, t, p) => `${s} :is(h1,h2,h3) .fm-u{animation:fmKWave ${(2.6 - p("speed", 45) * .016).toFixed(2)}s ease-in-out infinite;animation-delay:calc(var(--i)*-90ms)}@keyframes fmKWave{0%,100%{transform:translateY(0)}50%{transform:translateY(-${Math.round(3 + t * 12)}px)}}` },
      { id: "kn-shimmer-loop", label: "Shimmer loop", desc: "A soft pulse travels through the letters.", amount: "Depth", split: "char",
        params: [{ k: "speed", label: "Speed", v: 45 }],
        css: (s, t, p) => `${s} :is(h1,h2,h3) .fm-u{animation:fmKShim ${(3 - p("speed", 45) * .02).toFixed(2)}s ease-in-out infinite;animation-delay:calc(var(--i)*-70ms)}@keyframes fmKShim{0%,100%{opacity:1}50%{opacity:${(.85 - t * .55).toFixed(2)}}}` },
      { id: "kn-jiggle-loop", label: "Jiggle loop", desc: "Playful per-letter wobble.", amount: "Jiggle", split: "char",
        params: [{ k: "speed", label: "Speed", v: 40 }],
        css: (s, t, p) => `${s} :is(h1,h2,h3) .fm-u{animation:fmKJig ${(1.6 - p("speed", 40) * .009).toFixed(2)}s ease-in-out infinite;animation-delay:calc(var(--i)*-120ms)}@keyframes fmKJig{0%,100%{transform:rotate(0)}25%{transform:rotate(-${(1 + t * 4).toFixed(1)}deg)}75%{transform:rotate(${(1 + t * 4).toFixed(1)}deg)}}` },
      { id: "kn-typewriter-loop", label: "Typewriter loop", desc: "Types itself, holds, and repeats forever.", amount: "Hold", split: "char",
        params: [{ k: "st", label: "Type speed", v: 45 }],
        css: (s, t, p) => { const step = Math.round(30 + (100 - p("st", 45)) * 1.2); const holdUnits = Math.round(8 + t * 30); return `${s} :is(h1,h2,h3){--fmstep:${step}ms}${s} :is(h1,h2,h3) .fm-u{opacity:0!important;animation:fmKType calc((var(--n,20) + ${holdUnits})*var(--fmstep)) steps(1,end) infinite;animation-delay:calc(var(--i)*var(--fmstep))}@keyframes fmKType{0%{opacity:0}2%{opacity:1}80%{opacity:1}82%{opacity:0}100%{opacity:0}}`; } },
      { id: "kn-word-loop", label: "Word loop", desc: "The last word of the heading cycles through your words.", amount: "Speed",
        params: [{ k: "words", label: "Words (comma separated)", type: "text", ph: "design, strategy, growth", v: "" },
                 { k: "color", label: "Word color", type: "color", v: "#125B49" }],
        css: (s, t, p) => `${s} .fm-rot{display:inline-block;color:${p("color", "#125B49")};transition:opacity .25s ease,transform .25s ease}${s} .fm-rot.fm-swap{opacity:0;transform:translateY(${Math.round(6 + t * 10)}px)}` },
      { id: "kn-scramble", label: "Scramble morph", desc: "Letters cycle glyphs, then settle into the text.", amount: "Speed", cls: "fm-reveal", split: "char", scramble: true,
        params: [{ k: "loop", label: "Loop every (s)", v: 0 }],
        css: (s) => `${s} :is(h1,h2,h3) .fm-u{display:inline-block;min-width:.3ch}` }
    ]
  },
  {
    group: "Buttons", icon: "◉",
    items: [
      { id: "bt-solid", label: "Solid refined", desc: "Clean fill, hover darkens and lifts.", amount: "Round",
        css: (s, t, p, th) => `${BTN(s)}{background:${th.primary}!important;color:#fff!important;border:1px solid ${th.primary}!important;border-radius:${Math.round(4 + t * 26)}px!important;box-shadow:none!important;transition:transform .2s ease,background .2s ease!important}${BTN(s)}:hover{background:${th.ink}!important;transform:translateY(-2px)}` },
      { id: "bt-outline", label: "Outline", desc: "Minimal border, fills on hover.", amount: "Weight",
        css: (s, t, p, th) => `${BTN(s)}{background:transparent!important;color:${th.primary}!important;border:${Math.round(1 + t * 2)}px solid ${th.primary}!important;border-radius:${Math.round(4 + t * 22)}px!important;transition:background .2s ease,color .2s ease!important}${BTN(s)}:hover{background:${th.primary}!important;color:#fff!important}` },
      { id: "bt-pill-arrow", label: "Pill + arrow", desc: "Rounded pill, the arrow nudges on hover.", amount: "Distance",
        params: [
          { k: "dir", label: "Arrow direction", type: "select", options: ["→", "←", "↑", "↓", "↗"], v: "→" },
          { k: "bg", label: "Background", type: "color", v: "#125B49" }
        ],
        css: (s, t, p) => {
          const d = p("dir", "→");
          const move = { "→": `translate(${Math.round(3 + t * 5)}px,-50%)`, "←": `translate(-${Math.round(3 + t * 5)}px,-50%)`, "↑": `translate(0,calc(-50% - ${Math.round(3 + t * 4)}px))`, "↓": `translate(0,calc(-50% + ${Math.round(3 + t * 4)}px))`, "↗": `translate(${Math.round(2 + t * 4)}px,calc(-50% - ${Math.round(2 + t * 4)}px))` }[d];
          return `${BTN(s)}{position:relative!important;padding-right:${Math.round(34 + t * 18)}px!important;background:${p("bg", "#125B49")}!important;color:#fff!important;border-radius:999px!important;overflow:hidden!important}${BTN(s)}::after{content:"${d}";position:absolute;right:${Math.round(12 + t * 6)}px;top:50%;transform:translateY(-50%);transition:transform .22s ease;line-height:1}${BTN(s)}:hover::after{transform:${move}}`;
        } },
      { id: "bt-3d", label: "3D press", desc: "Hard shadow, presses down on hover.", amount: "Depth",
        css: (s, t, p, th) => { const d = Math.round(3 + t * 6); return `${BTN(s)}{background:${th.accent}!important;color:${th.ink}!important;border:2px solid ${th.ink}!important;border-radius:${Math.round(6 + t * 14)}px!important;box-shadow:${d}px ${d}px 0 ${th.ink}!important;transition:transform .15s ease,box-shadow .15s ease!important}${BTN(s)}:hover{transform:translate(${Math.round(d / 2)}px,${Math.round(d / 2)}px)!important;box-shadow:${Math.round(d / 2)}px ${Math.round(d / 2)}px 0 ${th.ink}!important}`; } },
      { id: "bt-glass", label: "Glass", desc: "Frosted glassmorphism CTA.", amount: "Blur",
        params: [{ k: "opacity", label: "Opacity", v: 50 }],
        css: (s, t, p, th) => { const b = Math.round(6 + t * 14); return `${BTN(s)}{background:${rgba(th.soft, .25 + p("opacity", 50) * .005)}!important;color:${th.ink}!important;border:1px solid ${rgba(th.primary, .2 + t * .2)}!important;backdrop-filter:blur(${b}px);-webkit-backdrop-filter:blur(${b}px);border-radius:${Math.round(8 + t * 16)}px!important}`; } },
      { id: "bt-underline", label: "Editorial line", desc: "No box — just a growing underline.", amount: "Line",
        css: (s, t, p, th) => `${BTN(s)}{background:transparent!important;color:${th.primary}!important;border:0!important;border-radius:0!important;padding-left:0!important;padding-right:0!important;background-image:linear-gradient(${th.primary},${th.primary})!important;background-size:100% ${Math.round(1 + t * 3)}px!important;background-position:0 100%!important;background-repeat:no-repeat!important;transition:background-size .22s ease!important}${BTN(s)}:hover{background-size:100% ${Math.round(4 + t * 8)}px!important}` },
      { id: "bt-pulse", label: "Pulse glow", desc: "Soft attention pulse for key CTAs.", amount: "Pulse",
        css: (s, t, p, th) => `${BTN(s)}{animation:fmPulse ${(3 - t * 1.4).toFixed(1)}s ease-in-out infinite}@keyframes fmPulse{0%,100%{box-shadow:0 0 0 0 ${rgba(th.accent, 0)}}50%{box-shadow:0 0 0 ${Math.round(6 + t * 16)}px ${rgba(th.accent, .25)}}}` },
      { id: "bt-magnet", label: "Lift hover", desc: "Buttons lift with depth on hover.", amount: "Lift",
        css: (s, t, p, th) => `${BTN(s)}{transition:transform .2s ease,box-shadow .2s ease!important}${BTN(s)}:hover{transform:translateY(-${Math.round(2 + t * 5)}px);box-shadow:0 ${Math.round(8 + t * 16)}px ${Math.round(18 + t * 28)}px ${rgba(th.ink, .12 + t * .12)}!important}` },
      { id: "bt-sparkle", label: "Sparkle", desc: "Tiny animated sparkles on the button.", amount: "Sparkle",
        css: (s, t, p, th) => `${BTN(s)}{position:relative!important;overflow:hidden!important;background:#fff!important;color:${th.primary}!important;border:1px solid ${rgba(th.primary, .25)}!important;border-radius:999px!important}${BTN(s)}::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 22% 32%,${rgba(th.accent, .8)} 0 ${Math.round(1 + t * 3)}px,transparent ${Math.round(3 + t * 3)}px),radial-gradient(circle at 74% 60%,${rgba(th.primary, .5)} 0 ${Math.round(1 + t * 2)}px,transparent ${Math.round(2 + t * 3)}px);animation:fmSparkle 2.4s linear infinite;pointer-events:none}@keyframes fmSparkle{to{transform:translateY(12px)}}` },
      { id: "bt-bubbly", label: "Bubbly", desc: "Springy rounded hover bounce.", amount: "Bounce",
        css: (s, t, p, th) => `${BTN(s)}{background:${th.accent}!important;color:${th.ink}!important;border:0!important;border-radius:999px!important;box-shadow:inset 0 -${Math.round(3 + t * 5)}px 0 ${rgba(th.primary, .25)}!important;transition:transform .22s cubic-bezier(.2,1.6,.3,1)!important}${BTN(s)}:hover{transform:scale(${(1.03 + t * .07).toFixed(2)}) translateY(-${Math.round(1 + t * 4)}px)}` },
      { id: "bt-wobble", label: "Wobble", desc: "Playful side-to-side hover shake.", amount: "Wobble",
        css: (s, t) => `${BTN(s)}:hover{animation:fmWobble ${(1 - t * .4).toFixed(2)}s ease both}@keyframes fmWobble{20%{transform:translateX(-${Math.round(2 + t * 6)}px)}40%{transform:translateX(${Math.round(2 + t * 6)}px)}60%{transform:translateX(-${Math.round(1 + t * 4)}px)}80%{transform:translateX(${Math.round(1 + t * 3)}px)}}` },
      { id: "bt-jelly", label: "Jelly", desc: "Squishy press-down hover.", amount: "Squish",
        css: (s, t) => `${BTN(s)}:hover{animation:fmJelly ${(1 - t * .4).toFixed(2)}s ease both}@keyframes fmJelly{30%{transform:scale(${(1 + t * .15).toFixed(2)},${(1 - t * .08).toFixed(2)})}55%{transform:scale(${(1 - t * .05).toFixed(2)},${(1 + t * .09).toFixed(2)})}100%{transform:scale(1)}}` },
      { id: "bt-caps", label: "Wide caps", desc: "Uppercase with letter spacing.", amount: "Tracking",
        css: (s, t) => `${BTN(s)}{text-transform:uppercase!important;letter-spacing:${(.06 + t * .18).toFixed(2)}em!important;font-size:${Math.round(86 - t * 8)}%!important}` },
      { id: "bt-gradient", label: "Gradient sweep", desc: "Animated gradient fill on hover.", amount: "Speed",
        css: (s, t, p, th) => `${BTN(s)}{background:linear-gradient(110deg,${th.primary},${th.ink},${th.primary})!important;background-size:220% 100%!important;color:#fff!important;border:0!important;transition:background-position ${(0.7 - t * .35).toFixed(2)}s ease!important}${BTN(s)}:hover{background-position:100% 0!important}` },
      { id: "bt-grad-border", label: "Animated gradient border", desc: "A spinning gradient ring traces the button edge.", amount: "Border",
        params: [{ k: "c1", label: "Color 1", type: "color", v: "#AADD66" }, { k: "c2", label: "Color 2", type: "color", v: "#125B49" }, { k: "speed", label: "Spin speed", v: 50 }],
        css: (s, t, p) => { const b = Math.round(2 + t * 3); return `${BTN(s)}{position:relative!important;background:#fff!important;color:#16201c!important;border:0!important;border-radius:12px!important;z-index:0;overflow:visible!important}${BTN(s)}::before{content:"";position:absolute;inset:-${b}px;border-radius:${12 + b}px;background:conic-gradient(from var(--fmga,0deg),${p("c1", "#AADD66")},${p("c2", "#125B49")},${p("c1", "#AADD66")});z-index:-1;animation:fmGradSpin ${(5 - p("speed", 50) * .04).toFixed(1)}s linear infinite}@property --fmga{syntax:"<angle>";initial-value:0deg;inherits:false}@keyframes fmGradSpin{to{--fmga:360deg}}`; } },
      { id: "bt-neon", label: "Neon glow", desc: "Outline button with a pulsing neon halo.", amount: "Glow",
        params: [{ k: "c", label: "Neon color", type: "color", v: "#AADD66" }],
        css: (s, t, p) => { const c = p("c", "#AADD66"); return `${BTN(s)}{background:transparent!important;color:${c}!important;border:2px solid ${c}!important;border-radius:10px!important;text-shadow:0 0 ${Math.round(4 + t * 8)}px ${rgba(c, .8)};box-shadow:0 0 ${Math.round(6 + t * 14)}px ${rgba(c, .5)},inset 0 0 ${Math.round(4 + t * 10)}px ${rgba(c, .25)}!important;transition:box-shadow .25s ease,background .25s ease!important}${BTN(s)}:hover{background:${rgba(c, .12)}!important;box-shadow:0 0 ${Math.round(14 + t * 26)}px ${rgba(c, .8)},inset 0 0 ${Math.round(8 + t * 14)}px ${rgba(c, .35)}!important}`; } },
      { id: "bt-shine", label: "Shine sweep", desc: "A light streak sweeps across on hover.", amount: "Shine",
        params: [{ k: "speed", label: "Sweep speed", v: 50 }],
        css: (s, t, p) => `${BTN(s)}{position:relative!important;overflow:hidden!important}${BTN(s)}::before{content:"";position:absolute;top:0;left:-80%;width:50%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,${(.25 + t * .45).toFixed(2)}),transparent);transform:skewX(-20deg);transition:left ${(0.9 - p("speed", 50) * .006).toFixed(2)}s ease}${BTN(s)}:hover::before{left:130%}` },
      { id: "bt-fill-slide", label: "Fill slide", desc: "Background fills in from a chosen side on hover.", amount: "Speed",
        params: [{ k: "dir", label: "Fill from", type: "select", options: ["left", "right", "top", "bottom", "center"], v: "left" }, { k: "fill", label: "Fill color", type: "color", v: "#125B49" }],
        css: (s, t, p) => {
          const d = p("dir", "left");
          const origin = { left: "left center", right: "right center", top: "center top", bottom: "center bottom", center: "center" }[d];
          const axis = (d === "top" || d === "bottom") ? "scaleY" : d === "center" ? "scale" : "scaleX";
          return `${BTN(s)}{position:relative!important;overflow:hidden!important;background:transparent!important;color:${p("fill", "#125B49")}!important;border:2px solid ${p("fill", "#125B49")}!important;z-index:0;transition:color .25s ease!important}${BTN(s)}::before{content:"";position:absolute;inset:0;background:${p("fill", "#125B49")};transform:${axis}(0);transform-origin:${origin};transition:transform ${(0.55 - t * .3).toFixed(2)}s cubic-bezier(.4,0,.2,1);z-index:-1}${BTN(s)}:hover{color:#fff!important}${BTN(s)}:hover::before{transform:${axis}(1)}`;
        } },
      { id: "bt-layers", label: "Stacked layers", desc: "Offset color layers collapse when pressed.", amount: "Offset",
        params: [{ k: "c", label: "Layer color", type: "color", v: "#AADD66" }],
        css: (s, t, p) => { const o = Math.round(4 + t * 6); const c = p("c", "#AADD66"); return `${BTN(s)}{background:#fff!important;color:#16201c!important;border:2px solid #16201c!important;border-radius:8px!important;box-shadow:${o}px ${o}px 0 ${c},${o * 2}px ${o * 2}px 0 ${rgba(c, .5)}!important;transition:transform .15s ease,box-shadow .15s ease!important}${BTN(s)}:hover{transform:translate(${Math.round(o / 2)}px,${Math.round(o / 2)}px);box-shadow:${Math.round(o / 2)}px ${Math.round(o / 2)}px 0 ${c},${o}px ${o}px 0 ${rgba(c, .5)}!important}${BTN(s)}:active{transform:translate(${o}px,${o}px);box-shadow:0 0 0 ${c}!important}`; } },
      { id: "bt-draw", label: "Border draw", desc: "The border draws itself around the button on hover.", amount: "Thickness",
        params: [{ k: "c", label: "Line color", type: "color", v: "#125B49" }, { k: "speed", label: "Draw speed", v: 50 }],
        css: (s, t, p) => { const c = p("c", "#125B49"); const w = Math.round(2 + t * 2); const d = (0.75 - p("speed", 50) * .005).toFixed(2); return `${BTN(s)}{background:transparent!important;border:0!important;color:${c}!important;border-radius:0!important;background-image:linear-gradient(${c},${c}),linear-gradient(${c},${c}),linear-gradient(${c},${c}),linear-gradient(${c},${c})!important;background-repeat:no-repeat!important;background-size:0 ${w}px,${w}px 0,0 ${w}px,${w}px 0!important;background-position:0 0,100% 0,100% 100%,0 100%!important;transition:background-size ${d}s ease!important}${BTN(s)}:hover{background-size:100% ${w}px,${w}px 100%,100% ${w}px,${w}px 100%!important}`; } },
      { id: "bt-glitch", label: "Glitch", desc: "Quick RGB-split jitter on hover.", amount: "Intensity",
        params: [{ k: "c1", label: "Split color 1", type: "color", v: "#AADD66" }, { k: "c2", label: "Split color 2", type: "color", v: "#125B49" }],
        css: (s, t, p) => { const o = (1 + t * 2).toFixed(1); return `${BTN(s)}:hover{animation:fmGlitch ${(0.4 - t * .15).toFixed(2)}s steps(2,end) infinite}@keyframes fmGlitch{0%,100%{transform:translate(0);text-shadow:none}25%{transform:translate(-${o}px,1px);text-shadow:${o}px 0 ${p("c1", "#AADD66")},-${o}px 0 ${p("c2", "#125B49")}}75%{transform:translate(${o}px,-1px);text-shadow:-${o}px 0 ${p("c1", "#AADD66")},${o}px 0 ${p("c2", "#125B49")}}}`; } },
      { id: "bt-soft", label: "Soft UI", desc: "Neumorphic surface that presses in on hover.", amount: "Depth",
        params: [{ k: "bg", label: "Surface color", type: "color", v: "#ECEFEA" }],
        css: (s, t, p) => { const bg = p("bg", "#ECEFEA"); const d = Math.round(4 + t * 6); return `${BTN(s)}{background:${bg}!important;color:#16201c!important;border:0!important;border-radius:14px!important;box-shadow:${d}px ${d}px ${d * 2}px rgba(22,32,28,.18),-${d}px -${d}px ${d * 2}px rgba(255,255,255,.9)!important;transition:box-shadow .2s ease!important}${BTN(s)}:hover{box-shadow:inset ${Math.round(d * .7)}px ${Math.round(d * .7)}px ${d}px rgba(22,32,28,.18),inset -${Math.round(d * .7)}px -${Math.round(d * .7)}px ${d}px rgba(255,255,255,.9)!important}`; } },
      { id: "bt-icon-expand", label: "Icon expand", desc: "Button widens to reveal an arrow on hover.", amount: "Expand",
        params: [{ k: "icon", label: "Icon", type: "select", options: ["→", "↗", "＋", "✓", "↓"], v: "→" }],
        css: (s, t, p) => { const w = Math.round(16 + t * 16); return `${BTN(s)}{position:relative!important;overflow:hidden!important;transition:padding-right .3s ease!important}${BTN(s)}::after{content:"${p("icon", "→")}";position:absolute;right:${Math.round(8 + t * 4)}px;top:50%;transform:translate(${w}px,-50%);opacity:0;transition:transform .3s ease,opacity .3s ease;line-height:1}${BTN(s)}:hover{padding-right:${Math.round(34 + t * 18)}px!important}${BTN(s)}:hover::after{transform:translate(0,-50%);opacity:1}`; } },
      { id: "bt-double-outline", label: "Double outline", desc: "A second outline blooms outward on hover.", amount: "Spread",
        params: [{ k: "c", label: "Outline color", type: "color", v: "#125B49" }],
        css: (s, t, p) => { const c = p("c", "#125B49"); return `${BTN(s)}{background:transparent!important;color:${c}!important;border:2px solid ${c}!important;border-radius:10px!important;box-shadow:0 0 0 0 ${rgba(c, .4)}!important;transition:box-shadow .3s ease,background .3s ease!important}${BTN(s)}:hover{background:${rgba(c, .07)}!important;box-shadow:0 0 0 ${Math.round(4 + t * 8)}px ${rgba(c, .18)},0 0 0 ${Math.round(8 + t * 16)}px ${rgba(c, .07)}!important}`; } },
      { id: "bt-letter-space", label: "Letter spread", desc: "Letters spread apart smoothly on hover.", amount: "Spread",
        css: (s, t) => `${BTN(s)}{transition:letter-spacing .3s ease!important}${BTN(s)}:hover{letter-spacing:${(.1 + t * .3).toFixed(2)}em!important}` }
    ]
  },
  {
    group: "Images", icon: "▧",
    items: [
      { id: "im-rounded", label: "Rounded media", desc: "Soft corners on images and video.", amount: "Radius",
        css: (s, t) => { const r = Math.round(6 + t * 30); return `${MEDIA_WRAP(s)}{overflow:hidden!important;border-radius:${r}px!important}${MEDIA(s)}{border-radius:${r}px!important}`; } },
      { id: "im-shadow", label: "Soft shadow", desc: "Editorial depth under media.", amount: "Depth",
        css: (s, t, p, th) => `${MEDIA(s)}{box-shadow:0 ${Math.round(10 + t * 24)}px ${Math.round(24 + t * 50)}px ${rgba(th.primary, .08 + t * .15)}!important}` },
      { id: "im-zoom", label: "Hover zoom", desc: "Subtle zoom inside the frame.", amount: "Zoom",
        params: [{ k: "speed", label: "Speed", v: 45 }],
        css: (s, t, p) => `${MEDIA_WRAP(s)}{overflow:hidden!important}${MEDIA(s)}{transition:transform ${(.3 + p("speed", 45) * .009).toFixed(2)}s cubic-bezier(.2,.8,.2,1)!important}${MEDIA_WRAP(s)}:hover img{transform:scale(${(1.03 + t * .1).toFixed(3)})!important}` },
      { id: "im-grayscale-hover", label: "Color on hover", desc: "Muted until hovered.", amount: "Mute",
        css: (s, t) => `${MEDIA(s)}{filter:grayscale(${Math.round(t * 100)}%)!important;transition:filter .35s ease,transform .35s ease!important}${MEDIA_WRAP(s)}:hover img{filter:grayscale(0)!important}` },
      { id: "im-frame", label: "Offset frame", desc: "Solid accent layer behind images.", amount: "Offset",
        css: (s, t, p, th) => { const o = Math.round(8 + t * 16); return `${MEDIA_WRAP(s)}{position:relative!important;isolation:isolate}${MEDIA_WRAP(s)}::before{content:"";position:absolute;inset:${o}px -${o}px -${o}px ${o}px;background:${th.accent};z-index:-1;border-radius:inherit}`; } },
      { id: "im-blob", label: "Organic mask", desc: "Blob-shaped image mask.", amount: "Shape",
        css: (s, t) => { const r = Math.round(35 + t * 25); return `${MEDIA(s)}{border-radius:${r}% ${100 - Math.round(r / 2)}% ${Math.round(40 + t * 25)}% ${Math.round(60 + t * 15)}%!important;transition:border-radius .4s ease!important}${MEDIA_WRAP(s)}:hover img{border-radius:${Math.round(90 - r / 3)}% ${r}% ${Math.round(80 - t * 15)}% ${Math.round(50 + t * 22)}%!important}`; } },
      { id: "im-tilt", label: "Hover tilt", desc: "3D perspective tilt on hover.", amount: "Tilt",
        css: (s, t) => `${MEDIA_WRAP(s)}{perspective:900px!important}${MEDIA(s)}{transition:transform .25s ease!important}${MEDIA_WRAP(s)}:hover img{transform:rotateX(${Math.round(2 + t * 7)}deg) rotateY(-${Math.round(2 + t * 7)}deg)!important}` },
      { id: "im-overlay", label: "Hover overlay", desc: "Your text appears over the image on hover.", amount: "Opacity",
        params: [
          { k: "txt", label: "Overlay text", type: "text", ph: "View", v: "View" },
          { k: "bg", label: "Overlay color", type: "color", v: "#125B49" }
        ],
        css: (s, t, p) => `${MEDIA_WRAP(s)}{position:relative!important;overflow:hidden!important}${MEDIA_WRAP(s)}::after{content:"${String(p("txt", "View")).replace(/"/g, "")}";position:absolute;inset:0;background:${rgba(p("bg", "#125B49"), .2 + t * .4)};color:#fff;display:grid;place-items:center;font-weight:800;font-size:clamp(16px,3vw,28px);opacity:0;transition:opacity .22s ease;pointer-events:none}${MEDIA_WRAP(s)}:hover::after{opacity:1}` },
      { id: "im-duotone", label: "Duotone tint", desc: "Modern contrast color treatment.", amount: "Tint",
        css: (s, t) => `${MEDIA(s)}{filter:contrast(${(1 + t * .2).toFixed(2)}) saturate(${(1 - t * .3).toFixed(2)}) sepia(${(t * .3).toFixed(2)})!important}` },
      { id: "im-polaroid", label: "Polaroid", desc: "White frame with bottom space and tilt.", amount: "Tilt",
        css: (s, t, p, th) => `${MEDIA_WRAP(s)}{background:#fff!important;padding:10px 10px ${Math.round(28 + t * 24)}px!important;box-shadow:0 ${Math.round(8 + t * 14)}px ${Math.round(20 + t * 28)}px ${rgba(th.ink, .15)}!important;transform:rotate(${((t - .5) * 4).toFixed(1)}deg)!important;transition:transform .25s ease!important}${MEDIA_WRAP(s)}:hover{transform:rotate(0) scale(1.02)!important}` },
      { id: "im-circle", label: "Circle crop", desc: "Perfect circular image mask.", amount: "—",
        css: (s) => `${MEDIA(s)}{border-radius:50%!important;aspect-ratio:1!important;object-fit:cover!important}` },
      { id: "im-border", label: "Brand border", desc: "Solid border in brand color.", amount: "Width",
        css: (s, t, p, th) => `${MEDIA(s)}{border:${Math.round(2 + t * 6)}px solid ${th.primary}!important;box-sizing:border-box!important}` },
      { id: "im-collage", label: "Floating collage", desc: "Images offset like an editorial collage.", amount: "Offset",
        css: (s, t) => `${s} .sqs-block-image:nth-of-type(2n){transform:translateY(-${Math.round(t * 26)}px) rotate(${(t * 1.4).toFixed(1)}deg)!important}${s} .sqs-block-image:nth-of-type(2n+1){transform:translateY(${Math.round(t * 16)}px) rotate(-${(t * 1.2).toFixed(1)}deg)!important}${s} .sqs-block-image{transition:transform .4s ease!important}` },
      { id: "im-caption", label: "Caption style", desc: "Small-caps captions with accent line.", amount: "Accent",
        css: (s, t, p, th) => `${s} .image-caption,${s} figcaption{font-variant:small-caps;letter-spacing:.08em;color:${th.primary}!important;border-top:${Math.round(1 + t * 2)}px solid ${th.accent};padding-top:6px;margin-top:8px}` }
    ]
  },
  {
    group: "Layout", icon: "▦",
    items: [
      { id: "ly-cards", label: "Card grid", desc: "Blocks become clean cards in a grid.", amount: "Columns",
        params: [{ k: "gap", label: "Gap", v: 45 }, { k: "radius", label: "Radius", v: 30 }],
        css: (s, t, p, th) => { const cols = t > .7 ? 4 : t > .35 ? 3 : 2; const g = Math.round(14 + p("gap", 45) * .45); const r = Math.round(4 + p("radius", 30) * .3); return `@media(min-width:800px){${ROW(s)}{display:grid!important;grid-template-columns:repeat(${cols},minmax(0,1fr))!important;gap:${g}px!important;align-items:stretch}}${s} .sqs-block{background:${rgba(th.soft, .9)}!important;border:1px solid ${rgba(th.primary, .14)}!important;border-radius:${r}px!important;padding:clamp(18px,3vw,32px)!important;box-shadow:0 14px 36px ${rgba(th.primary, .07)}!important;transition:transform .22s ease,box-shadow .22s ease}${s} .sqs-block:hover{transform:translateY(-4px);box-shadow:0 22px 48px ${rgba(th.primary, .12)}!important}`; } },
      { id: "ly-split", label: "Split columns", desc: "Two-column layout with adjustable ratio.", amount: "Gap",
        params: [{ k: "ratio", label: "Left width", v: 50 }],
        css: (s, t, p) => `@media(min-width:900px){${ROW(s)}{display:grid!important;grid-template-columns:${Math.round(35 + p("ratio", 50) * .3)}% minmax(0,1fr)!important;gap:${Math.round(20 + t * 70)}px!important;align-items:center!important}}` },
      { id: "ly-sticky-col", label: "Sticky column", desc: "First column pins while the rest scrolls.", amount: "Top offset",
        css: (s, t) => `@media(min-width:980px){${ROW(s)}{display:grid!important;grid-template-columns:42% minmax(0,1fr)!important;gap:48px!important;align-items:start!important}${ROW(s)} > *:first-child{position:sticky;top:${Math.round(60 + t * 120)}px}}` },
      { id: "ly-frame", label: "Section frame", desc: "Border, radius and depth around section.", amount: "Depth",
        params: [{ k: "radius", label: "Radius", v: 35 }],
        css: (s, t, p, th) => `${s}{background:${rgba(th.soft, .75)}!important;border:1px solid ${rgba(th.primary, .1 + t * .15)}!important;border-radius:${Math.round(6 + p("radius", 35) * .32)}px!important;box-shadow:0 ${Math.round(10 + t * 24)}px ${Math.round(24 + t * 56)}px ${rgba(th.primary, .06 + t * .12)}!important}` },
      { id: "ly-width", label: "Section width", desc: "Narrow to full-bleed width control.", amount: "Width",
        css: (s, t) => { const w = Math.round(45 + t * 55); return `@media(min-width:768px){${s}{width:${w}%!important;max-width:${w}%!important;margin-left:auto!important;margin-right:auto!important}}`; } },
      { id: "ly-spacing", label: "Vertical air", desc: "Top/bottom breathing space, mobile-safe.", amount: "Air",
        params: [{ k: "mobile", label: "Mobile air", v: 40 }],
        css: (s, t, p) => `${s}{padding-top:${Math.round(30 + t * 90)}px!important;padding-bottom:${Math.round(30 + t * 90)}px!important}@media(max-width:767px){${s}{padding-top:${Math.round(16 + p("mobile", 40) * .5)}px!important;padding-bottom:${Math.round(16 + p("mobile", 40) * .5)}px!important}}` },
      { id: "ly-sticky-section", label: "Sticky section", desc: "Section pins while scrolling past.", amount: "Offset",
        css: (s, t) => `@media(min-width:900px){${s}{position:sticky!important;top:${Math.round(20 + t * 120)}px!important;z-index:2}}` },
      { id: "ly-hide-mobile", label: "Hide on mobile", desc: "Section hidden under the breakpoint.", amount: "Breakpoint",
        css: (s, t) => `@media(max-width:${Math.round(520 + t * 380)}px){${s}{display:none!important}}` },
      { id: "ly-alternate", label: "Alternating rows", desc: "Every second row flips direction.", amount: "—",
        css: (s) => `@media(min-width:800px){${s} .sqs-row:nth-child(even){flex-direction:row-reverse}}` },
      { id: "ly-content-width", label: "Content measure", desc: "Inner text capped at a readable width.", amount: "Width",
        css: (s, t) => `${s} p,${s} h1,${s} h2,${s} h3{max-width:${Math.round(46 + t * 34)}ch;margin-left:auto;margin-right:auto}` },
      { id: "ly-equal", label: "Equal heights", desc: "Blocks stretch to equal height.", amount: "—",
        css: (s) => `${ROW(s)}{align-items:stretch!important}${s} .sqs-block{height:100%!important;box-sizing:border-box}` },
      { id: "ly-overlap", label: "Overlap previous", desc: "Section pulls up over the one above.", amount: "Pull",
        css: (s, t, p, th) => `${s}{margin-top:-${Math.round(20 + t * 80)}px!important;position:relative;z-index:3;border-radius:${Math.round(12 + t * 20)}px ${Math.round(12 + t * 20)}px 0 0!important;background:${th.soft}!important;box-shadow:0 -${Math.round(8 + t * 14)}px ${Math.round(24 + t * 30)}px ${rgba(th.ink, .1)}!important}` }
    ]
  },
  {
    group: "Motion", icon: "↗",
    items: [
      { id: "mo-reveal", label: "Scroll reveal", desc: "Fades and lifts in when scrolled into view.", amount: "Distance", cls: "fm-reveal",
        params: [{ k: "speed", label: "Speed", v: 45 }, { k: "blur", label: "Blur", v: 15 }],
        css: (s, t, p) => { const d = (.35 + p("speed", 45) * .012).toFixed(2); return `${s}.fm-reveal{opacity:0!important;filter:blur(${Math.round(p("blur", 15) * .1)}px);transform:translateY(${Math.round(12 + t * 40)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1)}${s}.fm-reveal.fm-in{opacity:1!important;filter:none!important;transform:none!important}`; } },
      { id: "mo-reveal-left", label: "Slide from right", desc: "Content slides in from the right edge.", amount: "Distance", cls: "fm-reveal",
        css: (s, t) => `${s}.fm-reveal{opacity:0;transform:translateX(${Math.round(30 + t * 90)}px);transition:opacity .55s ease,transform .55s cubic-bezier(.2,.8,.2,1)}${s}.fm-reveal.fm-in{opacity:1;transform:none}` },
      { id: "mo-reveal-scale", label: "Scale in", desc: "Grows softly into place.", amount: "Scale", cls: "fm-reveal",
        css: (s, t) => `${s}.fm-reveal{opacity:0;transform:scale(${(1 - .04 - t * .12).toFixed(2)});transition:opacity .5s ease,transform .5s cubic-bezier(.2,.8,.2,1)}${s}.fm-reveal.fm-in{opacity:1;transform:none}` },
      { id: "mo-stagger", label: "Stagger children", desc: "Children enter one after another.", amount: "Delay", cls: "fm-stagger",
        css: (s, t) => { const d = Math.round(50 + t * 140); let css = `${s}.fm-stagger > *{opacity:0;transform:translateY(${Math.round(10 + t * 22)}px);transition:opacity .5s ease,transform .5s ease}${s}.fm-stagger.fm-in > *{opacity:1;transform:none}`; for (let n = 2; n <= 6; n++) css += `${s}.fm-stagger.fm-in > *:nth-child(${n}){transition-delay:${d * (n - 1)}ms}`; return css; } },
      { id: "mo-float", label: "Gentle float", desc: "Slow continuous floating loop.", amount: "Float",
        css: (s, t) => `${s}{animation:fmFloat ${(7 - t * 3.5).toFixed(1)}s ease-in-out infinite}@keyframes fmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-${Math.round(4 + t * 16)}px)}}` },
      { id: "mo-kenburns", label: "Ken Burns", desc: "Slow cinematic drift on images.", amount: "Zoom",
        css: (s, t) => `${MEDIA_WRAP(s)}{overflow:hidden!important}${MEDIA(s)}{transform-origin:center;animation:fmKB ${(22 - t * 10).toFixed(1)}s ease-in-out infinite alternate}@keyframes fmKB{from{transform:scale(1)}to{transform:scale(${(1.06 + t * .12).toFixed(3)}) translate(${Math.round(t * 12)}px,-${Math.round(t * 10)}px)}}` },
      { id: "mo-marquee", label: "Marquee heading", desc: "Heading scrolls horizontally in a loop.", amount: "Speed",
        css: (s, t) => `${s}{overflow:hidden}${s} h1,${s} h2{white-space:nowrap;display:inline-block;animation:fmMarquee ${(26 - t * 16).toFixed(1)}s linear infinite}@keyframes fmMarquee{0%{transform:translateX(20%)}100%{transform:translateX(-100%)}}` },
      { id: "mo-progress", label: "Scroll progress bar", desc: "Page progress bar at the top.", amount: "Height", global: true, node: "progress",
        css: (s, t, p, th) => `#${IDS.progress}{position:fixed;top:0;left:0;height:${Math.round(2 + t * 6)}px;width:calc(var(--fm-scroll,0)*100%);background:linear-gradient(90deg,${th.primary},${th.accent});z-index:2147483600;pointer-events:none}` },
      { id: "mo-parallax", label: "Background parallax", desc: "Fixed background drift (desktop only).", amount: "—",
        css: (s) => `@media(min-width:768px){${s}{background-attachment:fixed!important;background-size:cover!important;background-position:center!important}}` },
      { id: "mo-shimmer", label: "Shimmer pass", desc: "Light sweep across the section.", amount: "Shine",
        css: (s, t) => `${s}{position:relative!important;overflow:hidden!important}${s}::before{content:"";position:absolute;inset:-40%;background:linear-gradient(110deg,transparent 38%,rgba(255,255,255,${(.08 + t * .22).toFixed(2)}) 50%,transparent 62%);transform:translateX(-70%);animation:fmShimmer ${(7 - t * 3).toFixed(1)}s ease-in-out infinite;pointer-events:none}${s} > *{position:relative;z-index:1}@keyframes fmShimmer{0%,55%{transform:translateX(-70%)}100%{transform:translateX(70%)}}` },
      { id: "mo-scroll-rotate", label: "Scroll rotate", desc: "Element rotates as the page scrolls.", amount: "Rotation",
        css: (s, t) => `${s}{transform:rotate(calc(var(--fm-scroll,0)*${Math.round(45 + t * 315)}deg));transform-origin:center;transition:transform .08s linear}` },
      { id: "mo-horizontal", label: "Horizontal drift", desc: "Content slides sideways with scroll.", amount: "Distance",
        params: [{ k: "reverse", label: "Reverse", v: 0 }],
        css: (s, t, p) => `${s}{overflow:hidden}${ROW(s)}{will-change:transform;transform:translateX(calc(var(--fm-scroll,0)*${p("reverse", 0) > 50 ? "" : "-"}${Math.round(80 + t * 380)}px));transition:transform .08s linear}` },
      { id: "mo-flip", label: "Flip in", desc: "3D flip entrance on scroll.", amount: "Flip", cls: "fm-reveal",
        css: (s, t) => `${s}.fm-reveal{opacity:0;transform:perspective(900px) rotateY(${Math.round(30 + t * 60)}deg);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}${s}.fm-reveal.fm-in{opacity:1;transform:none}` },
      { id: "mo-blur-in", label: "Focus in", desc: "Sharpens from blur on entrance.", amount: "Blur", cls: "fm-reveal",
        css: (s, t) => `${s}.fm-reveal{opacity:.2;filter:blur(${Math.round(4 + t * 12)}px);transition:opacity .6s ease,filter .6s ease}${s}.fm-reveal.fm-in{opacity:1;filter:none}` },
      { id: "mo-bounce", label: "Bounce in", desc: "Springy bounce entrance.", amount: "Bounce", cls: "fm-reveal",
        css: (s, t) => `${s}.fm-reveal{opacity:0;transform:translateY(${Math.round(20 + t * 50)}px);transition:opacity .5s ease,transform .65s cubic-bezier(.2,${(1.4 + t * .8).toFixed(1)},.3,1)}${s}.fm-reveal.fm-in{opacity:1;transform:none}` },
      { id: "mo-breathe", label: "Soft breathe", desc: "Slow continuous scale pulse.", amount: "Pulse",
        css: (s, t) => `${s}{animation:fmBreathe ${(10 - t * 5).toFixed(1)}s ease-in-out infinite;transform-origin:center}@keyframes fmBreathe{0%,100%{transform:scale(1)}50%{transform:scale(${(1 + t * .04).toFixed(3)})}}` }
    ]
  },
  {
    group: "Hover", icon: "⌖",
    items: [
      { id: "hv-lift", label: "Lift", desc: "Element lifts with depth on hover.", amount: "Lift",
        css: (s, t, p, th) => `${s}{transition:transform .22s ease,box-shadow .22s ease!important}${s}:hover{transform:translateY(-${Math.round(2 + t * 8)}px);box-shadow:0 ${Math.round(10 + t * 20)}px ${Math.round(22 + t * 40)}px ${rgba(th.primary, .1 + t * .12)}!important}` },
      { id: "hv-scale", label: "Scale", desc: "Grows slightly on hover.", amount: "Scale",
        css: (s, t) => `${s}{transition:transform .22s ease!important}${s}:hover{transform:scale(${(1.01 + t * .08).toFixed(3)})}` },
      { id: "hv-tilt", label: "3D tilt + glare", desc: "Perspective tilt with light sweep.", amount: "Tilt",
        params: [{ k: "glare", label: "Glare", v: 40 }],
        css: (s, t, p) => `${s}{position:relative!important;transform-style:preserve-3d;transition:transform .28s ease!important;overflow:hidden}${s}:hover{transform:perspective(900px) rotateX(${Math.round(2 + t * 7)}deg) rotateY(-${Math.round(2 + t * 9)}deg)}${s}::after{content:"";position:absolute;inset:-30%;background:linear-gradient(115deg,transparent,rgba(255,255,255,${(p("glare", 40) / 200).toFixed(2)}),transparent);transform:translateX(-65%);transition:transform .38s ease;pointer-events:none}${s}:hover::after{transform:translateX(65%)}` },
      { id: "hv-border", label: "Accent border", desc: "Border and tint appear on hover.", amount: "Strength",
        css: (s, t, p, th) => `${s}{border:1px solid transparent;transition:border-color .22s ease,background .22s ease,border-radius .22s ease!important}${s}:hover{border-color:${th.accent}!important;background:${rgba(th.accent, .06 + t * .1)}!important;border-radius:${Math.round(4 + t * 16)}px!important}` },
      { id: "hv-text-reveal", label: "Heading underline", desc: "Headings underline when section hovered.", amount: "Line",
        css: (s, t, p, th) => `${s} h1,${s} h2,${s} h3{background-image:linear-gradient(${th.accent},${th.accent});background-repeat:no-repeat;background-position:0 100%;background-size:0 ${Math.round(2 + t * 6)}px;transition:background-size .3s ease}${s}:hover h1,${s}:hover h2,${s}:hover h3{background-size:100% ${Math.round(2 + t * 6)}px}` },
      { id: "hv-glow", label: "Accent glow", desc: "Soft glow ring on hover.", amount: "Glow",
        css: (s, t, p, th) => `${s}{transition:box-shadow .25s ease!important}${s}:hover{box-shadow:0 0 ${Math.round(16 + t * 30)}px ${rgba(th.accent, .35 + t * .3)},0 0 0 1px ${rgba(th.accent, .5)}!important}` },
      { id: "hv-rotate", label: "Playful rotate", desc: "Slight rotation on hover.", amount: "Angle",
        css: (s, t) => `${s}{transition:transform .22s ease!important}${s}:hover{transform:rotate(${(.5 + t * 2.5).toFixed(1)}deg) scale(1.01)}` },
      { id: "hv-brighten", label: "Brighten", desc: "Dimmed until hovered.", amount: "Dim",
        css: (s, t) => `${s}{filter:brightness(${(1 - t * .25).toFixed(2)});transition:filter .25s ease!important}${s}:hover{filter:brightness(1.04)}` }
    ]
  },
  {
    group: "Navigation", icon: "≡",
    items: [
      { id: "nv-glass", label: "Glass header", desc: "Translucent blurred site header.", amount: "Blur", global: true,
        css: (s, t) => `${HEADER}{backdrop-filter:blur(${Math.round(6 + t * 16)}px)!important;-webkit-backdrop-filter:blur(${Math.round(6 + t * 16)}px)!important;background:rgba(255,255,255,${(.92 - t * .35).toFixed(2)})!important;border-bottom:1px solid rgba(0,0,0,.06)!important}` },
      { id: "nv-links", label: "Animated nav links", desc: "Underline grows under nav links.", amount: "Weight", global: true,
        css: (s, t) => `.header-nav-item a,.Header-nav-item a{background-image:linear-gradient(currentColor,currentColor);background-size:0 ${Math.round(1 + t * 2)}px;background-position:0 100%;background-repeat:no-repeat;transition:background-size .24s ease}.header-nav-item a:hover,.Header-nav-item a:hover{background-size:100% ${Math.round(1 + t * 2)}px}` },
      { id: "nv-pill", label: "Pill header bar", desc: "The inner header bar becomes a rounded glass pill. Layout untouched.", amount: "Round", global: true,
        params: [
          { k: "size", label: "Pill size (padding)", v: 45 },
          { k: "wide", label: "Pill width", v: 100 },
          { k: "glass", label: "Glass", v: 55 },
          { k: "bg", label: "Pill color", type: "color", v: "#FCF6EB" }
        ],
        css: (s, t, p, th) => {
          const b = Math.round(6 + p("glass", 55) * .18);
          const r = Math.round(14 + t * 30);
          const pv = Math.round(4 + p("size", 45) * .3);
          const ph = Math.round(10 + p("size", 45) * .4);
          const w = Math.round(60 + p("wide", 100) * .4);
          const inner = ".header .header-inner,.Header-inner,#header .header-inner,.header-announcement-bar-wrapper .header-inner";
          return `${inner}{background:${rgba(p("bg", "#FCF6EB"), .8)}!important;border:1px solid ${rgba(th.primary, .14)}!important;border-radius:${r}px!important;box-shadow:0 ${Math.round(6 + t * 12)}px ${Math.round(18 + t * 30)}px ${rgba(th.ink, .1)}!important;backdrop-filter:blur(${b}px)!important;-webkit-backdrop-filter:blur(${b}px)!important;margin:6px auto!important;max-width:${w}%!important;padding:${pv}px ${ph}px!important}.header{background:transparent!important}`;
        } },
      { id: "nv-sticky", label: "Sticky header", desc: "Header stays pinned with a soft shadow.", amount: "Shadow", global: true,
        css: (s, t, p, th) => `${HEADER}{position:sticky!important;top:0!important;z-index:9999!important;box-shadow:0 ${Math.round(2 + t * 10)}px ${Math.round(10 + t * 30)}px ${rgba(th.primary, .06 + t * .1)}!important;transition:box-shadow .25s ease!important}` },
      { id: "nv-caps", label: "Uppercase nav", desc: "Nav links in spaced caps.", amount: "Tracking", global: true,
        css: (s, t) => `.header-nav-item a,.Header-nav-item a{text-transform:uppercase!important;letter-spacing:${(.06 + t * .14).toFixed(2)}em!important;font-size:${Math.round(88 - t * 10)}%!important}` },
      { id: "nv-burger", label: "Burger polish", desc: "Mobile menu icon in brand colors.", amount: "Weight", global: true,
        css: (s, t, p, th) => `.burger-inner>div,.header-burger span{height:${Math.round(2 + t * 2)}px!important;background:${th.primary}!important;border-radius:999px!important}.header-menu,.header-menu-bg{background:${th.soft}!important}` },
      { id: "nv-dropdown", label: "Glass dropdown", desc: "Folder menus become frosted panels.", amount: "Glass", global: true,
        css: (s, t, p, th) => { const b = Math.round(6 + t * 14); return `.header-nav-folder-content{background:${rgba(th.soft, .8)}!important;border:1px solid ${rgba(th.primary, .15)}!important;border-radius:${Math.round(10 + t * 12)}px!important;backdrop-filter:blur(${b}px)!important;-webkit-backdrop-filter:blur(${b}px)!important;box-shadow:0 ${Math.round(10 + t * 16)}px ${Math.round(24 + t * 36)}px ${rgba(th.primary, .14)}!important;overflow:hidden}`; } },
      { id: "nv-cta", label: "Nav CTA pill", desc: "Last nav item becomes a pill button.", amount: "Round", global: true,
        css: (s, t, p, th) => `.header-nav-item:last-child a,.Header-nav-item:last-child a{background:${th.primary}!important;color:#fff!important;border-radius:${Math.round(8 + t * 22)}px!important;padding:8px 18px!important;transition:background .2s ease!important}.header-nav-item:last-child a:hover,.Header-nav-item:last-child a:hover{background:${th.ink}!important}` }
    ]
  },
  {
    group: "Extras", icon: "✦",
    items: [
      { id: "ex-glass-panel", label: "Glass panel", desc: "Section becomes a frosted surface.", amount: "Glass",
        params: [{ k: "opacity", label: "Opacity", v: 50 }],
        css: (s, t, p, th) => { const b = Math.round(6 + t * 18); return `${s}{background:${rgba(th.soft, .15 + p("opacity", 50) * .007)}!important;border:1px solid ${rgba(th.primary, .12 + t * .18)}!important;border-radius:${Math.round(10 + t * 20)}px!important;backdrop-filter:blur(${b}px);-webkit-backdrop-filter:blur(${b}px);box-shadow:0 ${Math.round(12 + t * 20)}px ${Math.round(28 + t * 50)}px ${rgba(th.primary, .08 + t * .1)}!important}`; } },
      { id: "ex-divider", label: "Soft divider", desc: "Gradient hairline under the section.", amount: "Height",
        css: (s, t, p, th) => `${s}{position:relative}${s}::after{content:"";position:absolute;left:5%;right:5%;bottom:0;height:${Math.round(1 + t * 5)}px;background:linear-gradient(90deg,transparent,${rgba(th.primary, .35 + t * .3)},transparent);pointer-events:none}` },
      { id: "ex-pills", label: "Decorative pills", desc: "Floating pill shapes behind content.", amount: "Size",
        css: (s, t, p, th) => `${s}{position:relative;overflow:hidden}${s}::before,${s}::after{content:"";position:absolute;z-index:0;pointer-events:none;border-radius:999px;background:linear-gradient(135deg,${rgba(th.accent, .5)},${rgba(th.soft, .4)});animation:fmPill ${(12 - t * 4).toFixed(1)}s ease-in-out infinite}${s}::before{width:${Math.round(100 + t * 140)}px;height:${Math.round(32 + t * 40)}px;right:6%;top:10%;transform:rotate(-16deg)}${s}::after{width:${Math.round(80 + t * 100)}px;height:${Math.round(26 + t * 32)}px;left:4%;bottom:8%;transform:rotate(10deg);animation-delay:-4s}${s} > *{position:relative;z-index:1}@keyframes fmPill{0%,100%{margin-top:0}50%{margin-top:-16px}}` },
      { id: "ex-grain-tint", label: "Brand tint", desc: "Soft brand-colored wash over section.", amount: "Tint",
        css: (s, t, p, th) => `${s}{background:linear-gradient(135deg,${rgba(th.soft, .8)},${rgba(th.accent, .08 + t * .18)})!important}` },
      { id: "ex-cursor-dot", label: "Custom cursor", desc: "Branded dot cursor over the section.", amount: "Size", node: "cursor",
        css: (s, t) => `${s},${s} *{cursor:none!important}` },
      { id: "ex-totop", label: "Back to top", desc: "Floating button appears after scrolling.", amount: "Size", global: true, node: "totop",
        css: (s, t, p, th) => { const d = Math.round(40 + t * 18); return `#${IDS.totop}{position:fixed;right:20px;bottom:20px;width:${d}px;height:${d}px;border-radius:999px;border:0;background:${th.primary};color:${th.soft};font-size:${Math.round(d * .42)}px;font-weight:900;cursor:pointer;z-index:2147483600;display:grid;place-items:center;box-shadow:0 10px 26px ${rgba(th.ink, .25)};opacity:calc(var(--fm-scroll,0)*4 - .3);pointer-events:auto;transition:transform .2s ease}#${IDS.totop}:hover{transform:translateY(-3px)}`; } },
      { id: "ex-cue", label: "Scroll cue", desc: "Bouncing arrow hints to scroll down.", amount: "Size", global: true, node: "cue",
        css: (s, t, p, th) => { const d = Math.round(16 + t * 14); return `#${IDS.cue}{position:fixed;left:50%;bottom:${Math.round(16 + t * 16)}px;width:${d}px;height:${d}px;border-right:3px solid ${th.primary};border-bottom:3px solid ${th.primary};transform:translateX(-50%) rotate(45deg);z-index:2147483600;pointer-events:none;opacity:calc(.9 - var(--fm-scroll,0)*4);animation:fmCue 2s ease-in-out infinite}@keyframes fmCue{0%,100%{margin-bottom:0}50%{margin-bottom:12px}}`; } }
    ]
  },
  {
    group: "Forms", icon: "✎",
    items: [
      { id: "fo-rounded", label: "Rounded fields", desc: "Inputs with soft corners and padding.", amount: "Radius",
        css: (s, t, p, th) => `${s} input[type="text"],${s} input[type="email"],${s} textarea,${s} select{border-radius:${Math.round(6 + t * 20)}px!important;padding:12px 16px!important;border:1px solid ${rgba(th.primary, .25)}!important;background:#fff!important}` },
      { id: "fo-minimal", label: "Underline fields", desc: "Borderless inputs with a bottom line.", amount: "Line",
        css: (s, t, p, th) => `${s} input[type="text"],${s} input[type="email"],${s} textarea{border:0!important;border-bottom:${Math.round(1 + t * 2)}px solid ${rgba(th.primary, .4)}!important;border-radius:0!important;background:transparent!important;padding-left:0!important}` },
      { id: "fo-focus", label: "Focus ring", desc: "Accent ring when a field is focused.", amount: "Ring",
        css: (s, t, p, th) => `${s} input:focus,${s} textarea:focus,${s} select:focus{outline:none!important;border-color:${th.primary}!important;box-shadow:0 0 0 ${Math.round(2 + t * 4)}px ${rgba(th.accent, .35)}!important}` },
      { id: "fo-labels", label: "Caps labels", desc: "Field labels as small uppercase tags.", amount: "Tracking",
        css: (s, t, p, th) => `${s} .form-item label,${s} label.title{text-transform:uppercase!important;font-size:${Math.round(72 - t * 8)}%!important;letter-spacing:${(.06 + t * .1).toFixed(2)}em!important;color:${th.primary}!important;font-weight:800!important}` },
      { id: "fo-glass", label: "Glass fields", desc: "Frosted translucent inputs.", amount: "Blur",
        css: (s, t, p, th) => { const b = Math.round(4 + t * 12); return `${s} input[type="text"],${s} input[type="email"],${s} textarea{background:${rgba(th.soft, .4)}!important;border:1px solid ${rgba(th.primary, .2)}!important;border-radius:${Math.round(8 + t * 12)}px!important;backdrop-filter:blur(${b}px);-webkit-backdrop-filter:blur(${b}px)}`; } },
      { id: "fo-button", label: "Brand submit", desc: "Submit button matches the theme.", amount: "Round",
        css: (s, t, p, th) => `${s} input[type="submit"],${s} button[type="submit"]{background:${th.primary}!important;color:#fff!important;border:0!important;border-radius:${Math.round(6 + t * 24)}px!important;padding:13px 28px!important;transition:background .2s ease,transform .2s ease!important}${s} input[type="submit"]:hover,${s} button[type="submit"]:hover{background:${th.ink}!important;transform:translateY(-2px)}` }
    ]
  },
  {
    group: "Lists", icon: "≣",
    items: [
      { id: "li-check", label: "Check bullets", desc: "List items get accent checkmarks.", amount: "Size",
        css: (s, t, p, th) => `${s} ul{list-style:none!important;padding-left:0!important}${s} ul li{position:relative;padding-left:${Math.round(26 + t * 10)}px!important}${s} ul li::before{content:"✓";position:absolute;left:0;color:${th.primary};font-weight:900;font-size:${Math.round(95 + t * 25)}%}` },
      { id: "li-arrow", label: "Arrow bullets", desc: "Arrows instead of dots.", amount: "Size",
        css: (s, t, p, th) => `${s} ul{list-style:none!important;padding-left:0!important}${s} ul li{position:relative;padding-left:${Math.round(24 + t * 10)}px!important}${s} ul li::before{content:"→";position:absolute;left:0;color:${th.accent};font-weight:900;-webkit-text-stroke:.5px ${th.primary}}` },
      { id: "li-numbered", label: "Number badges", desc: "Numbered circles for ordered lists.", amount: "Size",
        css: (s, t, p, th) => { const d = Math.round(22 + t * 10); return `${s} ol{list-style:none!important;counter-reset:fmLi;padding-left:0!important}${s} ol li{counter-increment:fmLi;position:relative;padding-left:${d + 12}px!important;margin-bottom:10px}${s} ol li::before{content:counter(fmLi);position:absolute;left:0;top:0;width:${d}px;height:${d}px;border-radius:999px;background:${th.accent};color:${th.ink};display:grid;place-items:center;font-weight:900;font-size:${Math.round(d * .5)}px}`; } },
      { id: "li-spacing", label: "Airy items", desc: "More breathing room between items.", amount: "Air",
        css: (s, t) => `${s} li{margin-bottom:${Math.round(6 + t * 18)}px!important;line-height:${(1.5 + t * .3).toFixed(2)}}` },
      { id: "li-divider", label: "Hairline dividers", desc: "Thin line under each item.", amount: "Opacity",
        css: (s, t, p, th) => `${s} li{border-bottom:1px solid ${rgba(th.primary, .1 + t * .2)}!important;padding-bottom:${Math.round(6 + t * 10)}px!important;margin-bottom:${Math.round(6 + t * 10)}px!important}${s} li:last-child{border-bottom:0!important}` }
    ]
  },
  {
    group: "Backgrounds", icon: "▤",
    items: [
      { id: "bg-gradient-anim", label: "Animated gradient", desc: "Slow drifting brand gradient.", amount: "Motion",
        css: (s, t, p, th) => `${s}{background:linear-gradient(120deg,${th.soft},${rgba(th.accent, .25)},${rgba(th.primary, .12)},${th.soft})!important;background-size:${Math.round(180 + t * 220)}% ${Math.round(180 + t * 160)}%!important;animation:fmBgShift ${(16 - t * 9).toFixed(1)}s ease infinite}@keyframes fmBgShift{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}` },
      { id: "bg-dots", label: "Dot grid", desc: "Subtle dotted pattern backdrop.", amount: "Density",
        css: (s, t, p, th) => { const g = Math.round(34 - t * 16); return `${s}{background-image:radial-gradient(${rgba(th.primary, .18)} 1.5px,transparent 1.5px)!important;background-size:${g}px ${g}px!important}`; } },
      { id: "bg-grid", label: "Line grid", desc: "Light graph-paper grid.", amount: "Density",
        css: (s, t, p, th) => { const g = Math.round(56 - t * 28); const c = rgba(th.primary, .08); return `${s}{background-image:linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)!important;background-size:${g}px ${g}px!important}`; } },
      { id: "bg-radial", label: "Radial glow", desc: "Soft accent glow behind content.", amount: "Glow",
        css: (s, t, p, th) => `${s}{background:radial-gradient(ellipse at ${Math.round(30 + t * 40)}% 20%,${rgba(th.accent, .2 + t * .2)},transparent 55%),${th.soft}!important}` },
      { id: "bg-stripes", label: "Diagonal stripes", desc: "Faint diagonal stripe texture.", amount: "Contrast",
        css: (s, t, p, th) => `${s}{background-image:repeating-linear-gradient(45deg,${rgba(th.primary, .03 + t * .05)} 0 10px,transparent 10px 24px)!important}` },
      { id: "bg-fade", label: "Edge fade", desc: "Section fades out at top and bottom.", amount: "Fade",
        css: (s, t) => { const f = Math.round(4 + t * 14); return `${s}{-webkit-mask-image:linear-gradient(180deg,transparent,#000 ${f}%,#000 ${100 - f}%,transparent);mask-image:linear-gradient(180deg,transparent,#000 ${f}%,#000 ${100 - f}%,transparent)}`; } }
    ]
  },
  {
    group: "Dividers", icon: "〜",
    items: [
      { id: "dv-wave", label: "Wave edge", desc: "Soft wave along the section edge.", amount: "Height",
        params: [{ k: "place", label: "Top / bottom", v: 100 }],
        css: (s, t, p, th) => { const bottom = p("place", 100) > 50; return `${s}{position:relative!important;overflow:visible!important}${s}::after{content:"";position:absolute;left:-4%;right:-4%;${bottom ? "bottom" : "top"}:-${Math.round(10 + t * 18)}px;height:${Math.round(24 + t * 56)}px;background:${th.accent};border-radius:${bottom ? "50% 50% 0 0/100% 100% 0 0" : "0 0 50% 50%/0 0 100% 100%"};opacity:.9;pointer-events:none;z-index:1}`; } },
      { id: "dv-slant", label: "Slanted section", desc: "Section edges cut at an angle.", amount: "Angle",
        css: (s, t) => { const a = Math.round(2 + t * 5); return `${s}{clip-path:polygon(0 ${a}%,100% 0,100% ${100 - a}%,0 100%)}`; } },
      { id: "dv-zigzag", label: "Zigzag line", desc: "Playful zigzag under the section.", amount: "Size",
        css: (s, t, p, th) => { const z = Math.round(8 + t * 10); return `${s}{position:relative}${s}::after{content:"";position:absolute;left:10%;right:10%;bottom:0;height:${z}px;background:linear-gradient(135deg,${th.accent} 25%,transparent 25%) -${z / 2}px 0/${z}px ${z}px,linear-gradient(225deg,${th.accent} 25%,transparent 25%) -${z / 2}px 0/${z}px ${z}px;pointer-events:none}`; } },
      { id: "dv-dots", label: "Dot divider", desc: "Three centered dots below content.", amount: "Size",
        css: (s, t, p, th) => { const d = Math.round(5 + t * 6); return `${s}{position:relative;padding-bottom:${d * 4}px!important}${s}::after{content:"";position:absolute;left:50%;bottom:${d}px;width:${d}px;height:${d}px;border-radius:50%;background:${th.primary};box-shadow:-${d * 2.5}px 0 0 ${rgba(th.primary, .5)},${d * 2.5}px 0 0 ${rgba(th.primary, .5)};transform:translateX(-50%);pointer-events:none}`; } },
      { id: "dv-curve", label: "Curved bottom", desc: "Large rounded bottom edge.", amount: "Curve",
        css: (s, t) => `${s}{border-radius:0 0 ${Math.round(20 + t * 60)}px ${Math.round(20 + t * 60)}px!important;overflow:hidden}` }
    ]
  },
  {
    group: "Utility", icon: "⚙",
    items: [
      { id: "ut-opacity", label: "Opacity", desc: "Transparency of the selected element.", amount: "Opacity",
        css: (s, t) => `${s}{opacity:${(.15 + t * .85).toFixed(2)}}` },
      { id: "ut-rotate", label: "Rotate", desc: "Static rotation of the element.", amount: "Angle",
        css: (s, t) => `${s}{transform:rotate(${((t - .5) * 14).toFixed(1)}deg)}` },
      { id: "ut-blur", label: "Blur", desc: "Atmospheric blur on the element.", amount: "Blur",
        css: (s, t) => `${s}{filter:blur(${(t * 6).toFixed(1)}px)}` },
      { id: "ut-grayscale", label: "Grayscale", desc: "Desaturate the selected area.", amount: "Amount",
        css: (s, t) => `${s}{filter:grayscale(${Math.round(t * 100)}%)}` },
      { id: "ut-radius", label: "Round corners", desc: "Corner radius on the element.", amount: "Radius",
        css: (s, t) => `${s}{border-radius:${Math.round(t * 48)}px!important;overflow:hidden}` },
      { id: "ut-border", label: "Border", desc: "Brand border around the element.", amount: "Width",
        css: (s, t, p, th) => `${s}{border:${Math.round(1 + t * 4)}px solid ${rgba(th.primary, .3 + t * .5)}!important;border-radius:${Math.round(6 + t * 14)}px!important}` },
      { id: "ut-shadow", label: "Drop shadow", desc: "Soft depth under the element.", amount: "Depth",
        css: (s, t, p, th) => `${s}{box-shadow:0 ${Math.round(8 + t * 24)}px ${Math.round(18 + t * 48)}px ${rgba(th.primary, .08 + t * .16)}!important;border-radius:${Math.round(4 + t * 14)}px}` },
      { id: "ut-hide-desktop", label: "Hide on desktop", desc: "Visible only on mobile.", amount: "—",
        css: (s) => `@media(min-width:768px){${s}{display:none!important}}` }
    ]
  }
  ];

  /* flat index */
  const EFFECTS = new Map();
  CATALOG.forEach(g => g.items.forEach(e => EFFECTS.set(e.id, { ...e, group: g.group })));

  /* ============================================================
     STATE — single source of truth
     ============================================================ */
  const state = {
    config: null,
    picking: false,
    hoverEl: null,
    ui: { open: new Set(["__colors"]), openFx: null, search: "", scrollTop: 0, showPub: false, showDiag: false, context: null }
  };

  function readInlineConfig() {
    const tag = document.getElementById(IDS.configTag);
    if (!tag) return null;
    try { return JSON.parse(tag.textContent || "null"); } catch { return null; }
  }

  function normalizeConfig(input) {
    const c = { ...clone(DEFAULT_CONFIG), ...(input || {}) };
    c.theme = { ...clone(DEFAULT_CONFIG.theme), ...((input && input.theme) || {}) };
    c.version = VERSION;
    const fx = {};
    Object.entries((input && input.effects) || {}).forEach(([sel, list]) => {
      if (!sel || typeof list !== "object") return;
      const cleaned = {};
      Object.entries(list || {}).forEach(([id, st]) => {
        if (!EFFECTS.has(id) || !st || typeof st !== "object") return;
        const params = {};
        Object.entries(st.p || {}).forEach(([k, v]) => {
          params[k] = (typeof v === "string" && Number.isNaN(Number(v))) ? String(v).replace(/[<>"`]/g, "").slice(0, 120) : clamp(v);
        });
        cleaned[id] = { on: !!st.on, i: clamp(st.i ?? 60), p: params };
      });
      if (Object.keys(cleaned).length) fx[sel] = cleaned;
    });
    c.effects = fx;
    if (c.scope !== "global") c.scope = "selected";
    return c;
  }

  function loadConfig() {
    if (new URLSearchParams(location.search).has("forma_reset")) {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
      return clone(DEFAULT_CONFIG);
    }
    try {
      const saved = JSON.parse(localStorage.getItem(KEYS.config) || "null");
      return normalizeConfig(saved || readInlineConfig());
    } catch { return clone(DEFAULT_CONFIG); }
  }

  const saveConfig = () => localStorage.setItem(KEYS.config, JSON.stringify(state.config));

  /* effect settings access */
  function fxTargetFor(effect) {
    if (effect.global) return "body";
    return state.config.scope === "global" ? "body" : state.config.target;
  }
  function getFx(sel, id) {
    return state.config.effects[sel]?.[id] || { on: false, i: 60, p: {} };
  }
  const sanitizeStr = (v) => String(v).replace(/[<>"`]/g, "").slice(0, 120);
  function setFx(sel, id, patch) {
    const effect = EFFECTS.get(id);
    if (!effect) return;
    if (effect.cls && (sel === "body" || sel === "html")) { toast("Select a section first"); return; }
    const types = Object.fromEntries((effect.params || []).map(p => [p.k, p.type || "range"]));
    const cur = getFx(sel, id);
    const next = {
      on: patch.on ?? cur.on,
      i: clamp(patch.i ?? cur.i),
      p: { ...cur.p, ...Object.fromEntries(Object.entries(patch.p || {}).map(([k, v]) =>
        [k, (types[k] === "range" || types[k] === undefined) ? clamp(v) : sanitizeStr(v)])) }
    };
    if (!state.config.effects[sel]) state.config.effects[sel] = {};
    if (next.on) state.config.effects[sel][id] = next;
    else delete state.config.effects[sel][id];
    if (!Object.keys(state.config.effects[sel]).length) delete state.config.effects[sel];
    saveConfig();
    // editor preview: any change to a motion/kinetic effect replays its entrance
    if ((effect.cls || effect.split) && sel !== "body") {
      try {
        document.querySelectorAll(sel).forEach(el => {
          seen.delete(el);
          el.classList.remove("fm-in");
        });
      } catch { /* skip */ }
    }
    applyEffects();
  }
  const paramGetter = (st) => (key, def) => {
    const v = st.p?.[key];
    if (v === undefined || v === null || v === "") return typeof def === "number" ? clamp(def) : def;
    return typeof def === "number" ? clamp(v) : String(v);
  };

  /* ============================================================
     CSS ENGINE
     ============================================================ */
  function compileCss() {
    const th = state.config.theme;
    let css = `.fm-w{display:inline-block}.fm-u{display:inline-block}@media(prefers-reduced-motion:reduce){.fm-reveal,.fm-stagger>*,.fm-u{transition:none!important;animation:none!important;opacity:1!important;transform:none!important;filter:none!important}}\n`;
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      Object.entries(list).forEach(([id, st]) => {
        const e = EFFECTS.get(id);
        if (!e || !st.on) return;
        css += `/* ${id} | ${sel} | ${st.i} */\n${e.css(sel, clamp(st.i) / 100, paramGetter(st), th)}\n`;
      });
    });
    return css;
  }

  /* singleton DOM nodes — never shared pseudo-elements */
  const SINGLETONS = [
    { key: "progress", id: IDS.progress },
    { key: "cue", id: IDS.cue },
    { key: "totop", id: IDS.totop, tag: "button",
      create(el) { el.textContent = "↑"; el.setAttribute("aria-label", "Back to top"); el.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" })); } },
    { key: "cursor", id: IDS.cursor,
      create(el) {
        el.style.cssText = "position:fixed;left:0;top:0;width:26px;height:26px;border-radius:999px;border:2px solid currentColor;transform:translate(-50%,-50%);pointer-events:none;z-index:2147483600;display:none;transition:width .15s ease,height .15s ease";
        window.addEventListener("mousemove", onCursorMove, { passive: true });
      },
      destroy() { window.removeEventListener("mousemove", onCursorMove); } }
  ];

  function syncSingletonNodes() {
    SINGLETONS.forEach(def => {
      const want = anyActive(e => e.node === def.key);
      let el = document.getElementById(def.id);
      if (want && !el) {
        el = document.createElement(def.tag || "div");
        el.id = def.id;
        if (def.tag !== "button") el.setAttribute("aria-hidden", "true");
        def.create?.(el);
        document.body.appendChild(el);
      } else if (!want && el) {
        def.destroy?.(el);
        el.remove();
      }
    });
  }

  function anyActive(test) {
    return Object.values(state.config.effects).some(list =>
      Object.entries(list).some(([id, st]) => st.on && test(EFFECTS.get(id) || {})));
  }

  function onCursorMove(ev) {
    const dot = document.getElementById(IDS.cursor);
    if (!dot) return;
    if (ev.target.closest?.(`#${IDS.root}`)) { dot.style.display = "none"; return; }
    const sels = [];
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      if (list["ex-cursor-dot"]?.on) sels.push({ sel, i: list["ex-cursor-dot"].i });
    });
    const hit = sels.find(({ sel }) => { try { return !!ev.target.closest(sel); } catch { return false; } });
    if (!hit) { dot.style.display = "none"; return; }
    const size = Math.round(18 + clamp(hit.i) * 0.4);
    const th = state.config.theme;
    dot.style.display = "block";
    dot.style.left = ev.clientX + "px";
    dot.style.top = ev.clientY + "px";
    dot.style.width = dot.style.height = size + "px";
    dot.style.color = th.accent;
    dot.style.boxShadow = `0 0 0 6px ${rgba(th.accent, .18)}`;
  }


  /* ---------- kinetic text splitting ---------- */
  const seen = new WeakSet();            // motion anti-replay (visitors)
  const splitStore = new Map();          // el -> original innerHTML
  const splitEls = new Set();            // currently split heading elements
  const scrambleTimers = new Map();      // container -> timeout id
  let scrambleJobs = [];                 // [{sel, st}] active scramble effects

  function wrapUnits(node, mode) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement("span");
          w.className = mode === "char" ? "fm-w" : "fm-w fm-u";
          if (mode === "char") {
            [...part].forEach(ch => {
              const c = document.createElement("span");
              c.className = "fm-u";
              c.textContent = ch;
              w.appendChild(c);
            });
          } else w.textContent = part;
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && !/\bfm-/.test(child.className || "")) {
        wrapUnits(child, mode);
      }
    });
  }

  function splitText(el, mode) {
    if (el.dataset.fmSplit === mode) return;
    if (splitStore.has(el)) el.innerHTML = splitStore.get(el);
    else splitStore.set(el, el.innerHTML);
    wrapUnits(el, mode === "line" ? "word" : mode);
    const units = el.querySelectorAll(".fm-u");
    units.forEach((u, i) => { u.style.setProperty("--i", i); u.dataset.fmOrig = u.textContent; });
    el.style.setProperty("--n", units.length);
    el.dataset.fmSplit = mode;
    if (mode === "line") {
      requestAnimationFrame(() => {
        let lastTop = null, line = -1;
        units.forEach(u => {
          if (u.offsetTop !== lastTop) { line++; lastTop = u.offsetTop; }
          u.style.setProperty("--l", line);
        });
      });
    }
  }

  function restoreSplit(el) {
    if (splitStore.has(el)) { el.innerHTML = splitStore.get(el); splitStore.delete(el); }
    delete el.dataset.fmSplit;
    el.style.removeProperty("--n");
  }

  function runScramble(container, st) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const units = [...container.querySelectorAll(":is(h1,h2,h3) .fm-u")];
    if (!units.length) return;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*+=<>";
    const total = Math.round(46 - clamp(st.i) * .28);
    let frame = 0;
    const step = () => {
      frame++;
      units.forEach((u, idx) => {
        const settle = total * .3 + (idx / units.length) * total * .7;
        u.textContent = frame >= settle ? u.dataset.fmOrig : glyphs[Math.random() * glyphs.length | 0];
      });
      if (frame < total && container.isConnected) requestAnimationFrame(step);
      else units.forEach(u => { u.textContent = u.dataset.fmOrig; });
    };
    requestAnimationFrame(step);
    const loop = clamp(st.p?.loop ?? 0);
    if (loop > 0) {
      clearTimeout(scrambleTimers.get(container));
      scrambleTimers.set(container, setTimeout(() => {
        if (container.isConnected && container.classList.contains("fm-in")) runScramble(container, st);
      }, Math.round(2000 + loop * 100)));
    }
  }

  /* ---------- rotating word loops ---------- */
  const rotStore = new Map();      // heading el -> original innerHTML
  const rotTimers = new Map();     // heading el -> interval id

  function clearWordLoops() {
    rotTimers.forEach(t => clearInterval(t));
    rotTimers.clear();
    rotStore.forEach((html, el) => { if (el.isConnected) el.innerHTML = html; });
    rotStore.clear();
  }

  function startWordLoop(heading, st, th) {
    if (rotStore.has(heading)) heading.innerHTML = rotStore.get(heading);
    else rotStore.set(heading, heading.innerHTML);
    const raw = String(st.p?.words || "").trim();
    const extra = raw ? raw.split(",").map(w => w.trim()).filter(Boolean).slice(0, 12) : [];
    // wrap the LAST word of the heading
    const tn = (function lastText(node) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const c = node.childNodes[i];
        if (c.nodeType === 3 && c.textContent.trim()) return c;
        if (c.nodeType === 1) { const r = lastText(c); if (r) return r; }
      }
      return null;
    })(heading);
    if (!tn) return;
    const m = tn.textContent.match(/^(.*?)(\S+)(\s*)$/s);
    if (!m) return;
    const words = [m[2], ...extra];
    if (words.length < 2) return;
    const span = document.createElement("span");
    span.className = "fm-rot";
    span.textContent = m[2];
    const after = document.createTextNode(m[3]);
    tn.textContent = m[1];
    tn.parentNode.insertBefore(span, tn.nextSibling);
    span.parentNode.insertBefore(after, span.nextSibling);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idx = 0;
    const hold = Math.round(2800 - clamp(st.i) * 20);
    rotTimers.set(heading, setInterval(() => {
      if (!heading.isConnected) { clearInterval(rotTimers.get(heading)); return; }
      span.classList.add("fm-swap");
      setTimeout(() => {
        idx = (idx + 1) % words.length;
        span.textContent = words[idx];
        span.classList.remove("fm-swap");
      }, 260);
    }, Math.max(900, hold)));
  }

  function syncWordLoops() {
    clearWordLoops();
    const th = state.config.theme;
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      const st = list["kn-word-loop"];
      if (!st || !st.on || sel === "body") return;
      try {
        document.querySelectorAll(sel).forEach(container => {
          if (container.closest(`#${IDS.root}`)) return;
          const h = container.querySelector("h1,h2,h3");
          if (h && !h.closest(`#${IDS.root}`)) startWordLoop(h, st, th);
        });
      } catch { /* skip */ }
    });
  }

  /* scroll reveal observer — tracks already-seen elements so
     re-applying effects never re-triggers animations */
  let observer = null;
  function syncMotionClasses() {
    document.querySelectorAll(".fm-reveal,.fm-stagger").forEach(el => el.classList.remove("fm-reveal", "fm-stagger"));
    const pending = [];
    const needSplit = new Map();
    scrambleTimers.forEach(t => clearTimeout(t));
    scrambleTimers.clear();
    scrambleJobs = [];
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      Object.entries(list).forEach(([id, st]) => {
        const e = EFFECTS.get(id);
        if (!e || !st.on || !e.cls || sel === "body" || sel === "html") return;
        try {
          document.querySelectorAll(sel).forEach(el => {
            if (el === document.body || el.closest(`#${IDS.root}`)) return;
            el.classList.add(e.cls);
            if (seen.has(el)) el.classList.add("fm-in");
            else pending.push(el);
          });
        } catch { /* invalid selector — skip */ }
      });
    });
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      Object.entries(list).forEach(([id, st]) => {
        const e = EFFECTS.get(id);
        if (!e || !st.on || !e.split || sel === "body" || sel === "html") return;
        if (e.scramble) scrambleJobs.push({ sel, st });
        try {
          document.querySelectorAll(sel).forEach(container => {
            if (container.closest(`#${IDS.root}`)) return;
            container.querySelectorAll("h1,h2,h3").forEach(h => needSplit.set(h, e.split));
          });
        } catch { /* skip */ }
      });
    });
    splitEls.forEach(el => { if (!needSplit.has(el)) { restoreSplit(el); splitEls.delete(el); } });
    needSplit.forEach((mode, el) => { splitText(el, mode); splitEls.add(el); });
    observer?.disconnect();
    if (!pending.length) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("fm-in");
          seen.add(en.target);
          observer.unobserve(en.target);
          const job = scrambleJobs.find(j => { try { return en.target.matches(j.sel); } catch { return false; } });
          if (job) runScramble(en.target, job.st);
        }
      });
    }, { threshold: 0.15 });
    pending.forEach(el => observer.observe(el));
  }

  function applyEffects() {
    let tag = document.getElementById(IDS.fxCss);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = IDS.fxCss;
      document.head.appendChild(tag);
    }
    tag.textContent = compileCss();
    syncSingletonNodes();
    syncMotionClasses();
    syncWordLoops();
    markActiveTarget();
  }

  /* scroll progress variable */
  let scrollRaf = 0;
  function updateScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      document.documentElement.style.setProperty("--fm-scroll", Math.min(1, scrollY / max).toFixed(4));
    });
  }
  addEventListener("scroll", updateScroll, { passive: true });
  addEventListener("resize", updateScroll, { passive: true });

  /* ============================================================
     ELEMENT PICKER
     ============================================================ */
  const PICKABLE = "[data-section-id],[data-block-id],.sqs-block[id],section[id],article[id]";

  function selectorFor(el) {
    if (!el || el === document.body) return "body";
    const sec = el.getAttribute("data-section-id");
    if (sec) return `[data-section-id="${cssEsc(sec)}"]`;
    const blk = el.getAttribute("data-block-id") || el.id;
    if (blk) return `#${cssEsc(blk)}`;
    const parent = el.closest(PICKABLE);
    if (parent && parent !== el) return selectorFor(parent);
    return "body";
  }

  function targetLabel(sel) {
    if (sel === "body") return "Whole page";
    if (sel.includes("data-section-id")) return "Section";
    if (sel.startsWith("#")) return "Block";
    return sel;
  }

  function startPicking() {
    state.picking = true;
    document.documentElement.classList.add("fm-picking");
    renderPanel();
  }
  function stopPicking() {
    state.picking = false;
    document.documentElement.classList.remove("fm-picking");
    state.hoverEl?.classList.remove("fm-hover");
    state.hoverEl = null;
  }

  document.addEventListener("mouseover", ev => {
    if (!state.picking) return;
    const t = ev.target.closest(PICKABLE);
    if (!t || t.closest(`#${IDS.root}`)) return;
    if (state.hoverEl && state.hoverEl !== t) state.hoverEl.classList.remove("fm-hover");
    state.hoverEl = t;
    t.classList.add("fm-hover");
  }, true);

  function kindOf(el) {
    if (el.closest("img,figure,.sqs-block-image,.image-block-wrapper,.thumb-image")) return "image";
    if (el.closest(".sqs-block-button-element,.sqs-button-element--primary,.sqs-button-element--secondary,.sqs-button-element--tertiary,a.btn,button")) return "button";
    if (el.closest("h1,h2,h3,h4,p,blockquote,ul,ol,.sqs-html-content")) return "text";
    return null;
  }
  const CONTEXT_GROUPS = { text: ["Typography", "Kinetic"], image: ["Images", "Hover"], button: ["Buttons"] };
  const CONTEXT_LABEL = { text: "Text effects", image: "Image effects", button: "Button effects" };

  function onPick(ev) {
    if (!state.picking) return;
    const t = ev.target.closest(PICKABLE);
    if (!t || t.closest(`#${IDS.root}`)) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation?.();
    state.config.target = selectorFor(t);
    state.config.scope = "selected";
    state.ui.context = kindOf(ev.target);
    state.ui.scrollTop = 0;
    saveConfig();
    stopPicking();
    applyEffects();
    renderPanel();
    flash(state.config.target);
    toast(state.ui.context ? `Selected — showing ${CONTEXT_LABEL[state.ui.context].toLowerCase()}` : `Selected: ${targetLabel(state.config.target)}`);
  }
  document.addEventListener("pointerdown", onPick, true);
  document.addEventListener("click", onPick, true);

  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape" && state.picking) { stopPicking(); renderPanel(); }
    if (ev.altKey && ev.code === "KeyF" && isEditor()) {
      localStorage.setItem(KEYS.panel, "1");
      renderPanel();
    }
  });

  function flash(sel) {
    try {
      const els = [...document.querySelectorAll(sel)].slice(0, 6);
      els.forEach(el => el.classList.add("fm-flash"));
      setTimeout(() => els.forEach(el => el.classList.remove("fm-flash")), 1200);
    } catch { /* skip */ }
  }

  function markActiveTarget() {
    document.querySelectorAll(".fm-target").forEach(el => el.classList.remove("fm-target"));
    if (!isEditor() || state.config.scope === "global" || state.config.target === "body") return;
    try {
      document.querySelectorAll(state.config.target).forEach(el => {
        if (!el.closest(`#${IDS.root}`)) el.classList.add("fm-target");
      });
    } catch { /* skip */ }
  }

  /* editor mode: ONLY logged-in Squarespace admins (Static.SQUARESPACE_CONTEXT.authenticatedAccount).
     Plain visitors and shared previews never see the panel.
     Dev override only on localhost / local files for the demo page. */
  function isAdmin() {
    try {
      return !!(window.Static && window.Static.SQUARESPACE_CONTEXT &&
        window.Static.SQUARESPACE_CONTEXT.authenticatedAccount);
    } catch { return false; }
  }
  function isEditor() {
    const h = location.hostname;
    if (!h || h === "localhost" || h === "127.0.0.1") return true; // local demo only
    return isAdmin();
  }

  /* ============================================================
     PANEL UI v2 — minimal, accordion structure, search
     ============================================================ */
  function baseCss() {
    return `
#${IDS.root}{position:fixed;top:70px;right:14px;width:min(330px,calc(100vw - 20px));z-index:2147483640;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:#16201c;font-size:13px}
#${IDS.root} *{box-sizing:border-box;font-family:inherit;letter-spacing:0;text-transform:none;animation:none}
#${IDS.root} .fm-panel{display:grid;grid-template-rows:auto auto auto minmax(0,1fr) auto;max-height:min(74vh,720px);background:#fbfcfa;border:1px solid #e4e8e2;border-radius:18px;box-shadow:0 18px 50px rgba(22,32,28,.16);overflow:hidden}
#${IDS.root} .fm-head{display:flex;align-items:center;gap:9px;padding:12px 14px;cursor:grab;background:#fff;border-bottom:1px solid #eef1ec}
#${IDS.root}.fm-drag .fm-head{cursor:grabbing}
#${IDS.root} .fm-logo{width:26px;height:26px;border-radius:8px;background:#125B49;color:#AADD66;display:grid;place-items:center;font-weight:900;font-size:13px;flex-shrink:0}
#${IDS.root} .fm-name{font-weight:800;font-size:13px}
#${IDS.root} .fm-ver{font-size:10px;color:#9aa39c}
#${IDS.root} .fm-head button{flex-shrink:0}#${IDS.root} .fm-head button:first-of-type{margin-left:auto}
#${IDS.root} button{appearance:none;border:1px solid #e4e8e2;background:#fff;color:#16201c;border-radius:9px;font:600 12px Inter,sans-serif;cursor:pointer;padding:0 10px;height:28px;transition:background .15s ease,border-color .15s ease}
#${IDS.root} button:hover{background:#f2f5f0;border-color:#d4dbd2}
#${IDS.root} .fm-target{display:grid;gap:8px;padding:10px 14px;background:#fff;border-bottom:1px solid #eef1ec}
#${IDS.root} .fm-tlabel{font-size:12px;color:#5f6a61;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${IDS.root} .fm-tlabel b{color:#16201c}
#${IDS.root} .fm-tbtns{display:grid;grid-template-columns:1fr auto;gap:7px}
#${IDS.root} .fm-selbtn{height:34px!important;border-radius:10px!important;background:#AADD66!important;border-color:#AADD66!important;color:#16201c!important;font-weight:800!important;font-size:12.5px!important}
#${IDS.root} .fm-selbtn:hover{background:#9BCE57!important}
#${IDS.root} .fm-selbtn[data-on="1"]{background:#125B49!important;border-color:#125B49!important;color:#fff!important}
#${IDS.root} .fm-deselect{height:34px!important;border-radius:10px!important;font-weight:700!important}
#${IDS.root} .fm-deselect[data-on="1"]{background:#fff!important;border-color:#125B49!important;color:#125B49!important}
#${IDS.root} .fm-deselect:disabled{opacity:.45;cursor:not-allowed}
#${IDS.root} .fm-ctx{display:flex;align-items:center;gap:10px;padding:4px 4px 10px}
#${IDS.root} .fm-ctx button{width:32px;height:32px;padding:0!important;border-radius:10px!important;font-size:15px!important;flex-shrink:0}
#${IDS.root} .fm-ctx b{display:block;font-size:13px}
#${IDS.root} .fm-ctx span{font-size:11px;color:#9aa39c}
#${IDS.root} .fm-ctx-group{font-size:11px;font-weight:800;color:#9aa39c;text-transform:uppercase;letter-spacing:.05em;padding:10px 6px 5px}
#${IDS.root} .fm-target select{flex:1;min-width:0;height:32px;border:1px solid #e4e8e2;border-radius:9px;background:#fbfcfa;padding:0 8px;font:600 12px Inter,sans-serif;color:#16201c;cursor:pointer}
#${IDS.root} .fm-crosshair{width:32px;height:32px;padding:0!important;flex-shrink:0;font-size:14px}
#${IDS.root} .fm-crosshair[data-on="1"]{background:#125B49;color:#fff;border-color:#125B49}
#${IDS.root} .fm-search{padding:10px 14px;background:#fff;border-bottom:1px solid #eef1ec}
#${IDS.root} .fm-search input{width:100%;height:34px;border:1px solid #e4e8e2;border-radius:11px;background:#fbfcfa;padding:0 12px;font:500 13px Inter,sans-serif;color:#16201c;outline:none}
#${IDS.root} .fm-search input:focus{border-color:#125B49}
#${IDS.root} .fm-body{overflow-y:auto;overflow-x:hidden;padding:8px 10px 12px;overscroll-behavior:contain;scrollbar-width:thin}
#${IDS.root} .fm-acc{border:1px solid #e9ece7;background:#fff;border-radius:13px;margin-bottom:7px;overflow:hidden}
#${IDS.root} .fm-acc-head{display:flex;align-items:center;gap:9px;padding:11px 13px;cursor:pointer;user-select:none}
#${IDS.root} .fm-acc-head:hover{background:#f7f9f6}
#${IDS.root} .fm-acc-ico{width:24px;height:24px;border-radius:7px;background:#f0f4ee;display:grid;place-items:center;font-size:12px;color:#125B49;flex-shrink:0}
#${IDS.root} .fm-acc-title{font-weight:700;font-size:13px;flex:1}
#${IDS.root} .fm-acc-meta{font-size:11px;color:#9aa39c;font-weight:600}
#${IDS.root} .fm-acc-meta b{color:#125B49}
#${IDS.root} .fm-chev{color:#b9c1ba;font-size:11px;transition:transform .18s ease}
#${IDS.root} .fm-acc[data-open="1"] .fm-chev{transform:rotate(90deg)}
#${IDS.root} .fm-acc-body{display:none;border-top:1px solid #eef1ec;padding:5px}
#${IDS.root} .fm-acc[data-open="1"] .fm-acc-body{display:block}
#${IDS.root} .fm-fx{border-radius:10px;overflow:hidden}
#${IDS.root} .fm-fx + .fm-fx{margin-top:2px}
#${IDS.root} .fm-fx-head{display:flex;align-items:center;gap:9px;padding:9px 9px;cursor:pointer;border-radius:10px}
#${IDS.root} .fm-fx-head:hover{background:#f4f7f3}
#${IDS.root} .fm-fx[data-open="1"]{background:#f7faf6;border:1px solid #e4ece2}
#${IDS.root} .fm-fx-title{font-size:12.5px;font-weight:600;flex:1}
#${IDS.root} .fm-sw{width:34px;height:20px;border-radius:999px;background:#dde2dc;position:relative;transition:background .18s ease;flex-shrink:0}
#${IDS.root} .fm-sw::before{content:"";position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;left:3px;top:3px;transition:left .18s ease;box-shadow:0 1px 3px rgba(0,0,0,.2)}
#${IDS.root} .fm-sw[data-on="1"]{background:#125B49}
#${IDS.root} .fm-sw[data-on="1"]::before{left:17px}
#${IDS.root} .fm-fx-desc{font-size:11px;color:#8b948c;line-height:1.4;padding:0 9px 7px}
#${IDS.root} .fm-ctrl{display:grid;gap:9px;padding:4px 9px 11px}
#${IDS.root} .fm-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:11.5px;color:#5f6a61;font-weight:600}
#${IDS.root} .fm-col{display:grid;gap:5px;font-size:11.5px;color:#5f6a61;font-weight:600}
#${IDS.root} .fm-rangewrap{display:grid;grid-template-columns:1fr 34px;gap:8px;align-items:center}
#${IDS.root} .fm-rangewrap input{width:100%;accent-color:#125B49;cursor:pointer;margin:0;height:18px}
#${IDS.root} .fm-rangewrap b{font-size:11px;text-align:right;color:#16201c}
#${IDS.root} .fm-colwrap{display:inline-flex;align-items:center;gap:6px}
#${IDS.root} .fm-colwrap input[type=color]{width:26px;height:26px;border:1px solid #e4e8e2;border-radius:8px;padding:1px;background:#fff;cursor:pointer}
#${IDS.root} .fm-hex{width:74px;height:26px;border:1px solid #e4e8e2;border-radius:8px;background:#fff;padding:0 7px;font:600 11px ui-monospace,monospace;color:#16201c;outline:none;text-transform:uppercase}
#${IDS.root} .fm-hex:focus{border-color:#125B49}
#${IDS.root} select.fm-sel{height:28px;border:1px solid #e4e8e2;border-radius:8px;background:#fff;padding:0 7px;font:600 12px Inter,sans-serif;color:#16201c;cursor:pointer}
#${IDS.root} .fm-text{width:100%;height:30px;border:1px solid #e4e8e2;border-radius:8px;background:#fff;padding:0 9px;font:500 12px Inter,sans-serif;color:#16201c;outline:none}
#${IDS.root} .fm-text:focus{border-color:#125B49}
#${IDS.root} .fm-empty{padding:14px;text-align:center;color:#9aa39c;font-size:12px}
#${IDS.root} .fm-foot{display:grid;grid-template-columns:auto 1fr;gap:8px;padding:11px 14px;background:#fff;border-top:1px solid #eef1ec}
#${IDS.root} .fm-foot button{height:38px;border-radius:11px;font-size:12px;font-weight:800}
#${IDS.root} .fm-publish{background:#125B49!important;border-color:#125B49!important;color:#fff!important}
#${IDS.root} .fm-publish:hover{background:#0d4537!important}
#${IDS.root} .fm-toast{position:absolute;left:50%;bottom:62px;transform:translateX(-50%);background:#16201c;color:#fff;border-radius:999px;padding:8px 15px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 10px 26px rgba(22,32,28,.3);z-index:6;max-width:90%;overflow:hidden;text-overflow:ellipsis}
#${IDS.root} .fm-pub{position:absolute;inset:0;background:rgba(251,252,250,.97);z-index:5;display:grid;grid-template-rows:auto 1fr auto;padding:16px;border-radius:18px}
#${IDS.root} .fm-pub h4{font-size:14px;font-weight:800;margin-bottom:4px}
#${IDS.root} .fm-pub p{font-size:11.5px;color:#5f6a61;line-height:1.5;margin-bottom:8px}
#${IDS.root} .fm-pub textarea{width:100%;height:100%;min-height:120px;border:1px solid #e4e8e2;border-radius:10px;background:#fff;padding:9px;font:500 10px ui-monospace,monospace;color:#16201c;resize:none;outline:none}
#${IDS.root} .fm-pub-btns{display:flex;gap:8px;margin-top:10px}
#${IDS.root} .fm-pub-btns button{flex:1;height:36px;border-radius:10px;font-weight:800}
.fm-dock{position:fixed;top:70px;right:14px;z-index:2147483640;width:40px;height:40px;border-radius:13px;border:1px solid #e4e8e2;background:#fff;color:#125B49;font:900 15px Inter,sans-serif;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 22px rgba(22,32,28,.16);transition:transform .15s ease}
.fm-dock:hover{transform:scale(1.06)}
html.fm-picking,html.fm-picking *{cursor:crosshair!important}
html.fm-picking::before{content:"Click a section · Esc to cancel";position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147483639;background:#125B49;color:#fff;border-radius:999px;padding:8px 15px;font:700 12px Inter,sans-serif;box-shadow:0 10px 26px rgba(18,91,73,.3);pointer-events:none}
.fm-hover{outline:2px dashed #125B49!important;outline-offset:4px!important}
.fm-flash{outline:2px solid #AADD66!important;outline-offset:5px!important}
.fm-target{outline:2px solid rgba(170,221,102,.7)!important;outline-offset:5px!important}
@media(max-width:600px){#${IDS.root}{top:62px;right:8px;width:calc(100vw - 16px)}}
`;
  }

  function ensureBaseCss() {
    if (document.getElementById(IDS.baseCss)) return;
    const tag = document.createElement("style");
    tag.id = IDS.baseCss;
    tag.textContent = baseCss();
    document.head.appendChild(tag);
  }

  /* ---------- target label ---------- */
  function targetTitle() {
    const t = state.config.target;
    if (t === "body") return "Effects apply to <b>all pages</b>";
    let i = 0, label = "";
    document.querySelectorAll("[data-section-id]").forEach(el => {
      if (el.closest(`#${IDS.root}`)) return;
      i++;
      try { if (el.matches(t)) {
        const h = el.querySelector("h1,h2,h3");
        label = `Section ${i}${h ? " — " + esc(h.textContent.trim().slice(0, 18)) : ""}`;
      } } catch { /* skip */ }
    });
    if (!label) label = "Selected element";
    return `${label} <span style="color:#9aa39c">· this page only</span>`;
  }

  /* ---------- which effects are usable / counts ---------- */
  function activeCountFor(groupName) {
    let n = 0;
    Object.values(state.config.effects).forEach(list => {
      Object.entries(list).forEach(([id, st]) => {
        const e = EFFECTS.get(id);
        if (e && st.on && e.group === groupName) n++;
      });
    });
    return n;
  }

  const GROUP_NEEDS = {
    Buttons: { sel: BTN(""), label: "buttons" },
    Images: { sel: MEDIA(""), label: "images" },
    Forms: { sel: " input, textarea", label: "form fields" },
    Lists: { sel: " ul li, ol li", label: "list items" },
    Kinetic: { sel: " h1, h2, h3", label: "headings" }
  };
  function warnIfNoMatch(effect, sel) {
    const need = GROUP_NEEDS[effect.group];
    if (!need || sel === "body") return;
    try {
      const q = need.sel.split(",").map(part => sel + " " + part.trim().replace(/^\s*/, "")).join(",");
      if (!document.querySelector(q)) toast(`No ${need.label} found in this section — the effect will wait until some exist`);
    } catch { /* skip */ }
  }

  /* ---------- render ---------- */
  function renderPanel() {
    ensureBaseCss();
    const prevBody = document.querySelector(`#${IDS.root} .fm-body`);
    if (prevBody) state.ui.scrollTop = prevBody.scrollTop;
    document.getElementById(IDS.root)?.remove();
    document.querySelector(".fm-dock")?.remove();
    if (!isEditor()) return;

    if (localStorage.getItem(KEYS.panel) === "0") {
      const dock = document.createElement("button");
      dock.className = "fm-dock";
      dock.type = "button";
      dock.title = "Forma";
      dock.textContent = "F";
      dock.addEventListener("click", () => { localStorage.setItem(KEYS.panel, "1"); renderPanel(); });
      document.body.appendChild(dock);
      return;
    }

    const root = document.createElement("div");
    root.id = IDS.root;
    const pos = loadPos();
    if (pos) { root.style.left = pos.x + "px"; root.style.top = pos.y + "px"; root.style.right = "auto"; }
    root.innerHTML = panelHtml();
    document.body.appendChild(root);
    bindPanel(root);
    const body = root.querySelector(".fm-body");
    if (body && state.ui.scrollTop) body.scrollTop = state.ui.scrollTop;
    markActiveTarget();
  }

  function panelHtml() {
    const c = state.config;
    const q = (state.ui.search || "").toLowerCase().trim();
    return `
<div class="fm-panel" role="dialog" aria-label="Forma">
  <div class="fm-head" data-act="drag">
    <div class="fm-logo">F</div>
    <div><div class="fm-name">Forma</div><div class="fm-ver">v${VERSION}</div></div>
    <button type="button" data-act="diag" title="Diagnose effects">?</button>
    <button type="button" data-act="mini" title="Minimize">—</button>
  </div>
  <div class="fm-target">
    <div class="fm-tlabel" title="${esc(c.target)}">${targetTitle()}</div>
    <div class="fm-tbtns">
      <button type="button" class="fm-selbtn" data-act="pick" data-on="${state.picking ? 1 : 0}">${state.picking ? "Click on the page… (Esc)" : "Select section"}</button>
      <button type="button" class="fm-deselect" data-act="deselect" data-on="${c.target !== "body" ? 1 : 0}" ${c.target === "body" ? "disabled" : ""}>Deselect</button>
    </div>
  </div>
  <div class="fm-search"><input type="search" placeholder="Search ${EFFECTS.size} effects…" value="${esc(state.ui.search || "")}" data-act="search"></div>
  <div class="fm-body">
    ${q ? searchHtml(q) : (state.ui.context ? contextHtml() : homeHtml())}
  </div>
  <div class="fm-foot">
    <button type="button" data-act="reset">Reset</button>
    <button type="button" class="fm-publish" data-act="publish">Publish</button>
  </div>
  ${state.ui.showPub ? pubHtml() : ""}${state.ui.showDiag ? diagHtml() : ""}
</div>`;
  }

  function contextHtml() {
    const groups = CONTEXT_GROUPS[state.ui.context] || [];
    let h = `
<div class="fm-ctx">
  <button type="button" data-act="ctxback" title="Back to all effects">←</button>
  <div><b>${esc(CONTEXT_LABEL[state.ui.context] || "Effects")}</b>
  <span>${targetTitle()}</span></div>
</div>`;
    groups.forEach(name => {
      const g = CATALOG.find(x => x.group === name);
      if (!g) return;
      h += `<div class="fm-ctx-group">${esc(g.icon)} ${esc(name)}</div>` + g.items.map(fxHtml).join("");
    });
    return h;
  }

  function homeHtml() {
    return colorsAccHtml() + activeAccHtml() + CATALOG.map(groupAccHtml).join("");
  }

  function colorsAccHtml() {
    const th = state.config.theme;
    const open = state.ui.open.has("__colors") ? 1 : 0;
    const NAMES = { primary: "Primary", accent: "Accent", soft: "Light", ink: "Dark" };
    return `
<div class="fm-acc" data-open="${open}">
  <div class="fm-acc-head" data-act="acc" data-v="__colors">
    <div class="fm-acc-ico">◐</div><div class="fm-acc-title">Colors</div><div class="fm-chev">▶</div>
  </div>
  <div class="fm-acc-body"><div class="fm-ctrl">
    ${["primary", "accent", "soft", "ink"].map(k => `
    <div class="fm-row"><span>${NAMES[k]}</span>
      <span class="fm-colwrap">
        <input type="color" value="${esc(th[k])}" data-act="themecolor" data-k="${k}">
        <input type="text" class="fm-hex" value="${esc(th[k])}" data-act="themehex" data-k="${k}" maxlength="7" spellcheck="false">
      </span>
    </div>`).join("")}
  </div></div>
</div>`;
  }

  function activeAccHtml() {
    const rows = [];
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      Object.entries(list).forEach(([id, st]) => {
        const e = EFFECTS.get(id);
        if (e && st.on) rows.push({ sel, id, e });
      });
    });
    if (!rows.length) return "";
    const open = state.ui.open.has("__active") ? 1 : 0;
    return `
<div class="fm-acc" data-open="${open}">
  <div class="fm-acc-head" data-act="acc" data-v="__active">
    <div class="fm-acc-ico">●</div><div class="fm-acc-title">Active effects</div>
    <div class="fm-acc-meta"><b>${rows.length}</b></div><div class="fm-chev">▶</div>
  </div>
  <div class="fm-acc-body">
    ${rows.map(r => `
    <div class="fm-fx">
      <div class="fm-fx-head" data-act="toggle" data-v="${r.id}" data-sel="${esc(r.sel)}">
        <div class="fm-fx-title">${esc(r.e.label)} <span style="color:#9aa39c;font-weight:500">· ${esc(targetLabel(r.sel))}</span></div>
        <div class="fm-sw" data-on="1"></div>
      </div>
    </div>`).join("")}
  </div>
</div>`;
  }

  function groupAccHtml(g) {
    const open = state.ui.open.has(g.group) ? 1 : 0;
    const n = activeCountFor(g.group);
    return `
<div class="fm-acc" data-open="${open}">
  <div class="fm-acc-head" data-act="acc" data-v="${esc(g.group)}">
    <div class="fm-acc-ico">${esc(g.icon)}</div>
    <div class="fm-acc-title">${esc(g.group)}</div>
    <div class="fm-acc-meta">${n ? `<b>${n}</b> · ` : ""}${g.items.length}</div>
    <div class="fm-chev">▶</div>
  </div>
  <div class="fm-acc-body">${open ? g.items.map(fxHtml).join("") : ""}</div>
</div>`;
  }

  function searchHtml(q) {
    const hits = [];
    CATALOG.forEach(g => g.items.forEach(e => {
      if (e.label.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || g.group.toLowerCase().includes(q)) hits.push(e);
    }));
    if (!hits.length) return `<div class="fm-empty">No results for “${esc(q)}”</div>`;
    return hits.slice(0, 40).map(fxHtml).join("");
  }

  function fxHtml(e) {
    const sel = fxTargetFor(e);
    const st = getFx(sel, e.id);
    const expanded = state.ui.openFx === e.id ? 1 : 0;
    return `
<div class="fm-fx" data-open="${expanded}">
  <div class="fm-fx-head" data-act="fxopen" data-v="${e.id}">
    <div class="fm-fx-title">${esc(e.label)}</div>
    <div class="fm-sw" data-act="toggle" data-v="${e.id}" data-on="${st.on ? 1 : 0}"></div>
  </div>
  ${expanded ? `
  <div class="fm-fx-desc">${esc(e.desc)}${e.global ? " · applies site-wide" : ""}</div>
  <div class="fm-ctrl">${ctrlHtml(e, st)}</div>` : ""}
</div>`;
  }

  function ctrlHtml(e, st) {
    let h = "";
    if (e.amount && e.amount !== "—") {
      h += `<div class="fm-col"><span>${esc(e.amount)}</span><div class="fm-rangewrap">
        <input type="range" min="0" max="100" step="1" value="${st.i}" data-act="intensity" data-v="${e.id}"><b>${st.i}</b>
      </div></div>`;
    }
    (e.params || []).forEach(prm => {
      const val = st.p[prm.k] ?? prm.v;
      const t = prm.type || "range";
      if (t === "color") {
        h += `<div class="fm-row"><span>${esc(prm.label)}</span><span class="fm-colwrap">
          <input type="color" value="${esc(val)}" data-act="pcolor" data-v="${e.id}" data-k="${esc(prm.k)}">
          <input type="text" class="fm-hex" value="${esc(val)}" data-act="phex" data-v="${e.id}" data-k="${esc(prm.k)}" maxlength="7" spellcheck="false">
        </span></div>`;
      } else if (t === "select") {
        h += `<div class="fm-row"><span>${esc(prm.label)}</span>
          <select class="fm-sel" data-act="pselect" data-v="${e.id}" data-k="${esc(prm.k)}">
            ${(prm.options || []).map(o => `<option ${o === val ? "selected" : ""}>${esc(o)}</option>`).join("")}
          </select></div>`;
      } else if (t === "text") {
        h += `<div class="fm-col"><span>${esc(prm.label)}</span>
          <input type="text" class="fm-text" value="${esc(val)}" placeholder="${esc(prm.ph || "")}" data-act="ptext" data-v="${e.id}" data-k="${esc(prm.k)}" maxlength="120"></div>`;
      } else {
        h += `<div class="fm-col"><span>${esc(prm.label)}</span><div class="fm-rangewrap">
          <input type="range" min="0" max="100" step="1" value="${clamp(val)}" data-act="param" data-v="${e.id}" data-k="${esc(prm.k)}"><b>${clamp(val)}</b>
        </div></div>`;
      }
    });
    return h || `<div class="fm-fx-desc">This effect has no extra settings.</div>`;
  }

  /* ---------- on-page diagnostics ---------- */
  function diagSelectorsOf(css) {
    const sels = [];
    let i = 0, buf = "";
    while (i < css.length) {
      const ch = css[i];
      if (ch === "{") {
        const sel = buf.trim(); buf = "";
        if (sel.startsWith("@keyframes") || sel.startsWith("@property")) {
          let d = 1; i++;
          while (i < css.length && d > 0) { if (css[i] === "{") d++; if (css[i] === "}") d--; i++; }
          continue;
        }
        if (sel.startsWith("@media")) { i++; continue; }
        if (sel) sels.push(sel);
        let d = 1; i++;
        while (i < css.length && d > 0) { if (css[i] === "{") d++; if (css[i] === "}") d--; i++; }
        continue;
      }
      if (ch === "}") { buf = ""; i++; continue; }
      buf += ch; i++;
    }
    return sels;
  }
  const diagStrip = (s) => s.replace(/::?(hover|active|focus|before|after|first-letter|first-of-type|last-child|visited)/g, "").trim();

  function diagReport() {
    const t = state.config.target;
    const scope = t === "body" ? document : document.querySelector(t);
    const cnt = (q) => { try { return scope ? scope.querySelectorAll(q).length : 0; } catch { return 0; } };
    const env = [
      ["Headings (h1-h3)", cnt("h1,h2,h3")],
      ["Paragraphs", cnt("p")],
      ["Buttons", cnt(BTN("").split(",").map(x => x.trim().replace(/^\S*\s/, "")).join(","))],
      ["Images", cnt("img")],
      ["List items", cnt("ul li,ol li")],
      ["Form fields", cnt("input,textarea,select")]
    ];
    const css = document.getElementById(IDS.fxCss)?.textContent || "";
    const rows = [];
    Object.entries(state.config.effects).forEach(([sel, list]) => {
      Object.entries(list).forEach(([id, st]) => {
        if (!st.on) return;
        const marker = `/* ${id} | ${sel} | `;
        const start = css.indexOf(marker);
        let detail = "no CSS";
        if (start !== -1) {
          let end = css.indexOf("/* ", start + marker.length);
          if (end === -1) end = css.length;
          let matched = 0, tried = 0, bad = 0;
          diagSelectorsOf(css.slice(start, end)).forEach(group => group.split(",").forEach(one => {
            one = diagStrip(one);
            if (!one) return;
            tried++;
            try { if (document.querySelector(one)) matched++; } catch { bad++; }
          }));
          detail = matched > 0 ? `OK · matches ${matched}/${tried} selectors`
            : bad === tried ? "selectors not testable here"
            : `⚠ 0/${tried} selectors match — nothing on this page to style`;
        }
        rows.push({ id, sel, detail });
      });
    });
    return { env, rows };
  }

  function diagHtml() {
    const { env, rows } = diagReport();
    return `
<div class="fm-pub">
  <div><h4>Diagnose</h4>
  <p>Elements inside <b>${esc(targetLabel(state.config.target))}</b>:<br>
  ${env.map(([k, n]) => `${esc(k)}: <b style="color:${n ? "#125B49" : "#c0392b"}">${n}</b>`).join(" · ")}</p></div>
  <textarea readonly>${rows.length ? rows.map(r => `${r.id}  @ ${targetLabel(r.sel)}\n   ${r.detail}`).join("\n") : "No active effects yet — enable some, then run Diagnose again."}</textarea>
  <div class="fm-pub-btns">
    <button type="button" data-act="diagclose">Close</button>
  </div>
</div>`;
  }

  function pubHtml() {
    return `
<div class="fm-pub">
  <div><h4>Publish</h4>
  <p>1. Copy the code below<br>2. Squarespace → Settings → Advanced → Code Injection → <b>Footer</b> — replace the old Forma block with this one<br>3. Save — changes go live for all visitors</p></div>
  <textarea readonly data-pubcode>${esc(buildSnippet())}</textarea>
  <div class="fm-pub-btns">
    <button type="button" data-act="pubclose">Close</button>
    <button type="button" class="fm-publish" data-act="pubcopy">Copy</button>
  </div>
</div>`;
  }

  /* ---------- event delegation: ONE click + ONE input handler ---------- */
  function bindPanel(root) {
    root.addEventListener("click", ev => {
      const el = ev.target.closest("[data-act]");
      if (!el) return;
      const act = el.dataset.act;
      const v = el.dataset.v;

      if (act === "mini") { localStorage.setItem(KEYS.panel, "0"); renderPanel(); return; }
      if (act === "pick") { state.picking ? (stopPicking(), renderPanel()) : startPicking(); return; }
      if (act === "deselect") {
        state.config.target = "body";
        state.ui.context = null;
        saveConfig(); applyEffects(); renderPanel();
        toast("Effects now apply to all pages");
        return;
      }
      if (act === "ctxback") { state.ui.context = null; state.ui.scrollTop = 0; renderPanel(); return; }
      if (act === "acc") {
        state.ui.open.has(v) ? state.ui.open.delete(v) : state.ui.open.add(v);
        renderPanel();
        return;
      }
      if (act === "fxopen") {
        if (ev.target.closest('[data-act="toggle"]')) return; // switch click ≠ expand
        state.ui.openFx = state.ui.openFx === v ? null : v;
        renderPanel();
        return;
      }
      if (act === "toggle") {
        const e = EFFECTS.get(v);
        if (!e) return;
        const sel = el.dataset.sel || fxTargetFor(e);
        if (e.cls && sel === "body") { toast("Pick a section from the dropdown first"); return; }
        const cur = getFx(sel, v);
        if (!cur.on) warnIfNoMatch(e, sel);
        setFx(sel, v, { on: !cur.on });
        if (!cur.on) state.ui.openFx = v; // auto-expand controls on enable
        renderPanel();
        return;
      }
      if (act === "reset") {
        if (!confirm("Clear all Forma effects?")) return;
        state.config = clone(DEFAULT_CONFIG);
        saveConfig(); applyEffects(); renderPanel();
        toast("All effects cleared");
        return;
      }
      if (act === "publish") { state.ui.showPub = true; renderPanel(); return; }
      if (act === "diag") { state.ui.showDiag = true; renderPanel(); return; }
      if (act === "diagclose") { state.ui.showDiag = false; renderPanel(); return; }
      if (act === "pubclose") { state.ui.showPub = false; renderPanel(); return; }
      if (act === "pubcopy") {
        const ta = root.querySelector("[data-pubcode]");
        ta.select();
        navigator.clipboard?.writeText(ta.value).then(() => toast("Copied — paste into Code Injection"))
          .catch(() => { document.execCommand("copy"); toast("Copied"); });
        return;
      }
    });

    root.addEventListener("input", ev => {
      const el = ev.target;
      const act = el.dataset.act;
      if (!act) return;
      const upd = (patch) => {
        const e = EFFECTS.get(el.dataset.v);
        if (e) setFx(fxTargetFor(e), el.dataset.v, patch);
      };
      if (act === "search") {
        state.ui.search = el.value;
        const body = root.querySelector(".fm-body");
        if (body) body.innerHTML = el.value.trim() ? searchHtml(el.value.toLowerCase().trim()) : homeHtml();
        return;
      }
      if (act === "intensity") {
        upd({ i: el.value });
        const b = el.parentElement.querySelector("b");
        if (b) b.textContent = clamp(el.value);
        return;
      }
      if (act === "param") {
        upd({ p: { [el.dataset.k]: el.value } });
        const b = el.parentElement.querySelector("b");
        if (b) b.textContent = clamp(el.value);
        return;
      }
      if (act === "pcolor" || act === "phex") {
        const val = el.value.trim();
        if (act === "phex" && !/^#[0-9a-fA-F]{3,6}$/.test(val)) return;
        upd({ p: { [el.dataset.k]: val } });
        const wrap = el.closest(".fm-colwrap");
        if (wrap) {
          const other = wrap.querySelector(act === "pcolor" ? ".fm-hex" : "input[type=color]");
          if (other && /^#[0-9a-fA-F]{6}$/.test(val)) other.value = val;
        }
        return;
      }
      if (act === "pselect" || act === "ptext") {
        upd({ p: { [el.dataset.k]: el.value } });
        return;
      }
      if (act === "themecolor" || act === "themehex") {
        const val = el.value.trim();
        if (act === "themehex" && !/^#[0-9a-fA-F]{3,6}$/.test(val)) return;
        state.config.theme = { ...state.config.theme, palette: "custom", [el.dataset.k]: val };
        saveConfig(); applyEffects();
        const wrap = el.closest(".fm-colwrap");
        if (wrap) {
          const other = wrap.querySelector(act === "themecolor" ? ".fm-hex" : "input[type=color]");
          if (other && /^#[0-9a-fA-F]{6}$/.test(val)) other.value = val;
        }
        return;
      }
    });



    enableDrag(root);
  }

  /* ---------- drag ---------- */
  function loadPos() {
    try {
      const p = JSON.parse(localStorage.getItem(KEYS.pos) || "null");
      if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return null;
      return {
        x: Math.max(8, Math.min(innerWidth - 80, p.x)),
        y: Math.max(8, Math.min(innerHeight - 80, p.y))
      };
    } catch { return null; }
  }

  function enableDrag(root) {
    const handle = root.querySelector(".fm-head");
    if (!handle) return;
    let drag = null;
    handle.addEventListener("pointerdown", ev => {
      if (ev.target.closest("button,input,label")) return;
      const r = root.getBoundingClientRect();
      drag = { dx: ev.clientX - r.left, dy: ev.clientY - r.top };
      root.classList.add("fm-drag");
      root.style.left = r.left + "px";
      root.style.top = r.top + "px";
      root.style.right = "auto";
      handle.setPointerCapture(ev.pointerId);
    });
    handle.addEventListener("pointermove", ev => {
      if (!drag) return;
      const w = root.offsetWidth || 400;
      root.style.left = Math.max(8, Math.min(innerWidth - w - 8, ev.clientX - drag.dx)) + "px";
      root.style.top = Math.max(8, Math.min(innerHeight - 60, ev.clientY - drag.dy)) + "px";
    });
    const stop = ev => {
      if (!drag) return;
      const r = root.getBoundingClientRect();
      localStorage.setItem(KEYS.pos, JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }));
      root.classList.remove("fm-drag");
      drag = null;
      try { handle.releasePointerCapture(ev.pointerId); } catch { /* released */ }
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  /* ---------- toast ---------- */
  let toastTimer = 0;
  function toast(msg) {
    const panel = document.querySelector(`#${IDS.root} .fm-panel`);
    if (!panel) return;
    panel.querySelector(".fm-toast")?.remove();
    const t = document.createElement("div");
    t.className = "fm-toast";
    t.textContent = msg;
    panel.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2200);
  }

  /* ============================================================
     PUBLISH — generates the install snippet
     ============================================================ */
  function runtimeSrc() {
    const fallback = `https://cdn.jsdelivr.net/gh/evaldasbanevici-del/SquarePlugin@main/FormaPlugin-v4.js`;
    try {
      const url = new URL(SCRIPT_SRC || fallback, location.href);
      url.searchParams.delete("forma");
      url.searchParams.delete("forma_editor");
      url.searchParams.set("v", VERSION);
      return url.href;
    } catch { return fallback; }
  }

  function buildSnippet() {
    const json = JSON.stringify(state.config, null, 2).replace(/</g, "\\u003c");
    return `<script id="${IDS.configTag}" type="application/json">\n${json}\n</scr` + `ipt>\n<script src="${runtimeSrc()}" defer></scr` + `ipt>`;
  }

  async function publish() {
    saveConfig();
    applyEffects();
    const code = buildSnippet();
    try {
      await navigator.clipboard.writeText(code);
      toast("Install code copied — paste into Code Injection");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("Install code copied");
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    state.config = loadConfig();
    applyEffects();
    updateScroll();
    renderPanel();
  }

  /* Squarespace 7.0 ajax loads + 7.1 dynamic sections: re-apply when page content changes */
  let applying = false;
  const origApply = applyEffects;
  applyEffects = function () { applying = true; try { origApply(); } finally { setTimeout(() => { applying = false; }, 60); } };

  let mutT = 0;
  function watchDom() {
    window.addEventListener("mercury:load", () => { applyEffects(); renderPanel(); });
    const mo = new MutationObserver(muts => {
      if (applying) return;
      const relevant = muts.some(m => [...m.addedNodes].some(n =>
        n.nodeType === 1 && !n.closest?.(`#${IDS.root}`) && !String(n.id || "").startsWith(APP) &&
        (n.matches?.("[data-section-id],section,article") || n.querySelector?.("[data-section-id]"))));
      if (!relevant) return;
      clearTimeout(mutT);
      mutT = setTimeout(() => { applyEffects(); }, 250);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { boot(); watchDom(); });
  else { boot(); watchDom(); }
})();
