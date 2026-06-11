/* ============================================================
   FORMA PLUGIN — Squarespace customization plugin by Studio Poema
   File: FormaPlugin-v1.js · Single-file injection · No dependencies
   Install: paste the generated snippet into
   Settings → Advanced → Code Injection → Footer
   Editor: add ?forma=1 to your site URL, or press Alt+F
   ============================================================ */
(() => {
  "use strict";

  /* ---------- constants ---------- */
  const APP = "forma";
  const VERSION = "1.3.0";
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
  const BTN = (s) => `${s} .sqs-button-element--primary,${s} .sqs-button-element--secondary,${s} .sqs-button-element--tertiary,${s} a.sqs-block-button-element,${s} .sqs-block-button a,${s} button[type="submit"]`;
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
      { id: "ty-gradient", label: "Gradient headings", desc: "Brand gradient across H1/H2.", amount: "Blend",
        params: [{ k: "angle", label: "Angle", v: 30 }],
        css: (s, t, p, th) => `${s} h1,${s} h2{background:linear-gradient(${Math.round(p("angle", 30) * 1.8)}deg,${th.ink},${th.primary} ${Math.round(40 + t * 25)}%,${th.accent});-webkit-background-clip:text;background-clip:text;color:transparent!important}` },
      { id: "ty-highlight", label: "Marker highlight", desc: "Bold words get a marker underline.", amount: "Ink",
        css: (s, t, p, th) => `${s} strong{background:linear-gradient(transparent ${Math.round(78 - t * 28)}%,${rgba(th.accent, .35 + t * .5)} 0);font-weight:inherit}` },
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
        css: (s, t, p) => { const d = (1.15 - p("speed", 50) * .009).toFixed(2); return `${s} :is(h1,h2,h3) .fm-u{opacity:0;filter:blur(${Math.round(2 + p("blur", 55) * .14)}px);transform:translateY(${Math.round(8 + t * 30)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(15 + p("st", 40) * 1.6)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1;filter:none;transform:none}`; } },
      { id: "kn-blur-chars", label: "Blur reveal · characters", desc: "Letter-by-letter blur reveal.", amount: "Distance", cls: "fm-reveal", split: "char",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 30 }, { k: "blur", label: "Blur", v: 55 }],
        css: (s, t, p) => { const d = (1 - p("speed", 50) * .008).toFixed(2); return `${s} :is(h1,h2,h3) .fm-u{opacity:0;filter:blur(${Math.round(2 + p("blur", 55) * .12)}px);transform:translateY(${Math.round(4 + t * 18)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(8 + p("st", 30) * .9)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1;filter:none;transform:none}`; } },
      { id: "kn-blur-lines", label: "Blur reveal · lines", desc: "Whole lines sharpen one after another.", amount: "Distance", cls: "fm-reveal", split: "line",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 55 }, { k: "blur", label: "Blur", v: 55 }],
        css: (s, t, p) => { const d = (1.2 - p("speed", 50) * .009).toFixed(2); return `${s} :is(h1,h2,h3) .fm-u{opacity:0;filter:blur(${Math.round(2 + p("blur", 55) * .14)}px);transform:translateY(${Math.round(10 + t * 26)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--l,0)*${Math.round(60 + p("st", 55) * 3)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1;filter:none;transform:none}`; } },
      { id: "kn-slide-words", label: "Slide up · words", desc: "Words rise from a clipped baseline.", amount: "Distance", cls: "fm-reveal", split: "word",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 40 }],
        css: (s, t, p) => { const d = (1 - p("speed", 50) * .008).toFixed(2); return `${s} :is(h1,h2,h3) .fm-w{overflow:hidden;vertical-align:bottom}${s} :is(h1,h2,h3) .fm-u{opacity:0;transform:translateY(${Math.round(60 + t * 50)}%);transition:opacity ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(15 + p("st", 40) * 1.6)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1;transform:none}`; } },
      { id: "kn-flip-chars", label: "Flip in · characters", desc: "Letters flip in like tiles.", amount: "Flip", cls: "fm-reveal", split: "char",
        params: [{ k: "speed", label: "Speed", v: 50 }, { k: "st", label: "Stagger", v: 30 }],
        css: (s, t, p) => { const d = (.9 - p("speed", 50) * .006).toFixed(2); return `${s} :is(h1,h2,h3){perspective:600px}${s} :is(h1,h2,h3) .fm-u{opacity:0;transform:rotateX(${Math.round(50 + t * 40)}deg) translateY(8px);transform-origin:bottom;transition:opacity ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--i)*${Math.round(8 + p("st", 30) * .9)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1;transform:none}`; } },
      { id: "kn-pop-chars", label: "Pop in · characters", desc: "Springy letter-by-letter pop.", amount: "Pop", cls: "fm-reveal", split: "char",
        params: [{ k: "st", label: "Stagger", v: 30 }],
        css: (s, t, p) => `${s} :is(h1,h2,h3) .fm-u{opacity:0;transform:scale(${(.3 - t * .25).toFixed(2)});transition:opacity .4s ease,transform .55s cubic-bezier(.2,${(1.4 + t * .9).toFixed(1)},.3,1);transition-delay:calc(var(--i)*${Math.round(8 + p("st", 30) * .9)}ms)}${s}.fm-in :is(h1,h2,h3) .fm-u{opacity:1;transform:none}` },
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
        css: (s, t, p) => { const step = Math.round(30 + (100 - p("st", 45)) * 1.2); const holdUnits = Math.round(8 + t * 30); return `${s} :is(h1,h2,h3){--fmstep:${step}ms}${s} :is(h1,h2,h3) .fm-u{opacity:0;animation:fmKType calc((var(--n,20) + ${holdUnits})*var(--fmstep)) steps(1,end) infinite;animation-delay:calc(var(--i)*var(--fmstep))}@keyframes fmKType{0%{opacity:0}2%{opacity:1}80%{opacity:1}82%{opacity:0}100%{opacity:0}}`; } },
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
      { id: "bt-pill-arrow", label: "Pill + arrow", desc: "Rounded pill, arrow slides on hover.", amount: "Distance",
        css: (s, t, p, th) => `${BTN(s)}{position:relative!important;padding-right:${Math.round(34 + t * 18)}px!important;background:${th.primary}!important;color:#fff!important;border-radius:999px!important;overflow:hidden!important}${BTN(s)}::after{content:"→";position:absolute;right:${Math.round(12 + t * 6)}px;top:50%;transform:translateY(-50%);transition:transform .22s ease;line-height:1}${BTN(s)}:hover::after{transform:translate(${Math.round(3 + t * 5)}px,-50%)}` },
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
        css: (s, t, p, th) => `${BTN(s)}{background:linear-gradient(110deg,${th.primary},${th.ink},${th.primary})!important;background-size:220% 100%!important;color:#fff!important;border:0!important;transition:background-position ${(0.7 - t * .35).toFixed(2)}s ease!important}${BTN(s)}:hover{background-position:100% 0!important}` }
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
      { id: "im-overlay", label: "Click indicator", desc: "\u201cView\u201d overlay shows on hover.", amount: "Opacity",
        css: (s, t, p, th) => `${MEDIA_WRAP(s)}{position:relative!important;overflow:hidden!important}${MEDIA_WRAP(s)}::after{content:"View";position:absolute;inset:0;background:${rgba(th.primary, .2 + t * .4)};color:${th.soft};display:grid;place-items:center;font-weight:800;font-size:clamp(16px,3vw,28px);opacity:0;transition:opacity .22s ease;pointer-events:none}${MEDIA_WRAP(s)}:hover::after{opacity:1}` },
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
        css: (s, t, p) => { const d = (.35 + p("speed", 45) * .012).toFixed(2); return `${s}.fm-reveal{opacity:0;filter:blur(${Math.round(p("blur", 15) * .1)}px);transform:translateY(${Math.round(12 + t * 40)}px);transition:opacity ${d}s ease,filter ${d}s ease,transform ${d}s cubic-bezier(.2,.8,.2,1)}${s}.fm-reveal.fm-in{opacity:1;filter:none;transform:none}`; } },
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
      { id: "nv-pill", label: "Floating pill header", desc: "Header floats as a rounded pill.", amount: "Round", global: true,
        params: [{ k: "glass", label: "Glass", v: 55 }],
        css: (s, t, p, th) => { const b = Math.round(8 + p("glass", 55) * .2); return `${HEADER}{position:sticky!important;top:12px!important;z-index:9999!important;margin:10px auto!important;width:min(1180px,calc(100% - 28px))!important;border-radius:${Math.round(16 + t * 30)}px!important;background:${rgba(th.soft, .78)}!important;border:1px solid ${rgba(th.primary, .15)}!important;box-shadow:0 ${Math.round(8 + t * 16)}px ${Math.round(22 + t * 40)}px ${rgba(th.ink, .1)}!important;backdrop-filter:blur(${b}px)!important;-webkit-backdrop-filter:blur(${b}px)!important}`; } },
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
    ui: { group: CATALOG[0].group, scrollTop: 0 }
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
        Object.entries(st.p || {}).forEach(([k, v]) => { params[k] = clamp(v); });
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
  function setFx(sel, id, patch) {
    const effect = EFFECTS.get(id);
    if (!effect) return;
    if (effect.cls && (sel === "body" || sel === "html")) { toast("Pick a section first for motion effects"); return; }
    const cur = getFx(sel, id);
    const next = {
      on: patch.on ?? cur.on,
      i: clamp(patch.i ?? cur.i),
      p: { ...cur.p, ...Object.fromEntries(Object.entries(patch.p || {}).map(([k, v]) => [k, clamp(v)])) }
    };
    if (!state.config.effects[sel]) state.config.effects[sel] = {};
    if (next.on) state.config.effects[sel][id] = next;
    else delete state.config.effects[sel][id];
    if (!Object.keys(state.config.effects[sel]).length) delete state.config.effects[sel];
    saveConfig();
    applyEffects();
  }
  const paramGetter = (st) => (key, def) => clamp(st.p?.[key] ?? def);

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

  /* scroll reveal observer — tracks already-seen elements so
     re-applying effects never re-triggers animations */
  let observer = null;
  const seen = new WeakSet();
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

  function onPick(ev) {
    if (!state.picking) return;
    const t = ev.target.closest(PICKABLE);
    if (!t || t.closest(`#${IDS.root}`)) return;
    ev.preventDefault();
    ev.stopPropagation();
    state.config.target = selectorFor(t);
    state.config.scope = "selected";
    saveConfig();
    stopPicking();
    applyEffects();
    renderPanel();
    flash(state.config.target);
    toast(`Selected: ${targetLabel(state.config.target)}`);
  }
  document.addEventListener("pointerdown", onPick, true);
  document.addEventListener("click", onPick, true);

  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape" && state.picking) { stopPicking(); renderPanel(); }
    if (ev.altKey && ev.code === "KeyF") {
      localStorage.setItem(KEYS.editor, "1");
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

  /* editor mode: explicit opt-in only — never auto-shows to visitors */
  function isEditor() {
    const q = new URLSearchParams(location.search);
    if (q.has("forma") || q.has("forma_editor")) {
      localStorage.setItem(KEYS.editor, "1");
      return true;
    }
    return localStorage.getItem(KEYS.editor) === "1";
  }

  /* ============================================================
     PANEL UI — event delegation, no per-element bindings
     ============================================================ */
  function baseCss() {
    return `
#${IDS.root}{position:fixed;top:14px;right:14px;width:min(400px,calc(100vw - 24px));z-index:2147483640;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:#051914;letter-spacing:0}
#${IDS.root} *{box-sizing:border-box;font-family:inherit;letter-spacing:0;animation:none;text-transform:none}
#${IDS.root} .fm-panel{display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;max-height:calc(100vh - 28px);background:rgba(252,246,235,.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(5,25,20,.14);border-radius:20px;box-shadow:0 24px 70px rgba(5,25,20,.22);overflow:hidden}
#${IDS.root} .fm-head{display:flex;align-items:center;gap:10px;padding:14px 16px;cursor:grab;border-bottom:1px solid rgba(5,25,20,.1)}
#${IDS.root}.fm-drag .fm-head{cursor:grabbing}
#${IDS.root} .fm-logo{width:30px;height:30px;border-radius:9px;background:#125B49;color:#AADD66;display:grid;place-items:center;font-weight:900;font-size:15px;flex-shrink:0}
#${IDS.root} .fm-name{font-weight:850;font-size:14px}
#${IDS.root} .fm-ver{font-size:10px;color:#5d6e5d}
#${IDS.root} .fm-head-btns{margin-left:auto;display:flex;gap:6px}
#${IDS.root} button{appearance:none;border:1px solid rgba(5,25,20,.16);background:#fff;color:#051914;border-radius:9px;font:700 12px Inter,sans-serif;cursor:pointer;padding:0 10px;height:30px;transition:transform .15s ease,background .15s ease}
#${IDS.root} button:hover{transform:translateY(-1px)}
#${IDS.root} .fm-pick[data-on="1"]{background:#AADD66;border-color:#AADD66}
#${IDS.root} .fm-sub{display:grid;gap:8px;padding:10px 16px;border-bottom:1px solid rgba(5,25,20,.1)}
#${IDS.root} .fm-target-row{display:flex;gap:8px;align-items:center}
#${IDS.root} .fm-target-pill{flex:1;min-width:0;background:#AADD66;border-radius:999px;padding:7px 13px;font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${IDS.root} .fm-scope{display:flex;border:1.5px solid #051914;border-radius:999px;overflow:hidden}
#${IDS.root} .fm-scope button{border:0;border-radius:0;height:28px;font-size:11px;background:transparent}
#${IDS.root} .fm-scope button[data-on="1"]{background:#AADD66}
#${IDS.root} .fm-tabs{display:flex;gap:5px;overflow-x:auto;padding:2px 0;scrollbar-width:none}
#${IDS.root} .fm-tabs::-webkit-scrollbar{display:none}
#${IDS.root} .fm-tab{height:28px;border-radius:999px;font-size:11px;white-space:nowrap;flex-shrink:0}
#${IDS.root} .fm-tab[data-on="1"]{background:#125B49;border-color:#125B49;color:#fff}
#${IDS.root} .fm-body{overflow-y:auto;overflow-x:hidden;padding:12px 16px;display:grid;gap:8px;overscroll-behavior:contain;scrollbar-width:thin}
#${IDS.root} .fm-fx{border:1px solid rgba(5,25,20,.12);background:#fff;border-radius:13px;overflow:hidden}
#${IDS.root} .fm-fx-head{display:grid;grid-template-columns:minmax(0,1fr) 42px;gap:10px;align-items:center;padding:11px 13px;cursor:pointer}
#${IDS.root} .fm-fx-head:hover{background:rgba(170,221,102,.12)}
#${IDS.root} .fm-fx-title{font-size:13px;font-weight:800}
#${IDS.root} .fm-fx-desc{font-size:11px;color:#5d6e5d;margin-top:2px;line-height:1.35}
#${IDS.root} .fm-sw{width:40px;height:22px;border-radius:999px;background:#cfd2c8;position:relative;transition:background .18s ease;justify-self:end}
#${IDS.root} .fm-sw::before{content:"";position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;left:3px;top:3px;transition:left .18s ease;box-shadow:0 1px 3px rgba(0,0,0,.25)}
#${IDS.root} .fm-sw[data-on="1"]{background:#125B49}
#${IDS.root} .fm-sw[data-on="1"]::before{left:21px}
#${IDS.root} .fm-ctrl{display:grid;gap:8px;padding:4px 13px 13px;border-top:1px solid rgba(5,25,20,.08)}
#${IDS.root} .fm-range{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;font-size:11px;color:#5d6e5d;font-weight:700}
#${IDS.root} .fm-range input{width:100%;accent-color:#125B49;cursor:pointer;margin:0}
#${IDS.root} .fm-range b{min-width:64px;text-align:right;color:#051914}
#${IDS.root} .fm-theme{display:flex;gap:7px;align-items:center;flex-wrap:wrap;padding:10px 13px;border:1px solid rgba(5,25,20,.12);background:#fff;border-radius:13px}
#${IDS.root} .fm-theme span{font-size:11px;font-weight:800;margin-right:auto}
#${IDS.root} .fm-pal{height:26px;font-size:10px;padding:0 9px;border-radius:999px}
#${IDS.root} .fm-pal[data-on="1"]{background:#ECEABE;border-color:#125B49}
#${IDS.root} .fm-theme label{width:24px;height:24px;border-radius:999px;overflow:hidden;border:1px solid rgba(5,25,20,.2);cursor:pointer;flex-shrink:0}
#${IDS.root} .fm-theme input{width:34px;height:34px;border:0;padding:0;transform:translate(-5px,-5px);cursor:pointer}
#${IDS.root} .fm-foot{display:grid;grid-template-columns:1fr 1.4fr;gap:9px;padding:12px 16px;border-top:1px solid rgba(5,25,20,.1)}
#${IDS.root} .fm-foot button{height:42px;border-radius:999px;font-size:12px;text-transform:uppercase;font-weight:850}
#${IDS.root} .fm-publish{background:#AADD66!important;border-color:#AADD66!important;box-shadow:0 8px 22px rgba(170,221,102,.4)}
#${IDS.root} .fm-toast{position:absolute;left:50%;bottom:68px;transform:translateX(-50%);background:#051914;color:#FCF6EB;border-radius:999px;padding:8px 15px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 10px 28px rgba(5,25,20,.3);z-index:5}
.fm-mini{position:fixed;top:14px;right:14px;z-index:2147483640;height:38px;padding:0 14px 0 10px;border-radius:999px;border:1px solid rgba(5,25,20,.18);background:#FCF6EB;color:#051914;font:850 12px Inter,sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 10px 26px rgba(5,25,20,.18)}
.fm-mini::before{content:"";width:16px;height:16px;border-radius:999px;background:#AADD66;box-shadow:inset 0 0 0 4px #125B49}
html.fm-picking,html.fm-picking *{cursor:crosshair!important}
html.fm-picking::before{content:"Click a section or block · Esc to cancel";position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:2147483639;background:#AADD66;color:#051914;border-radius:999px;padding:9px 16px;font:850 12px Inter,sans-serif;box-shadow:0 10px 26px rgba(5,25,20,.2);pointer-events:none}
.fm-hover{outline:3px dashed #AADD66!important;outline-offset:5px!important}
.fm-flash{outline:3px solid #AADD66!important;outline-offset:7px!important;box-shadow:0 0 0 12px rgba(170,221,102,.2)!important}
.fm-target{outline:2px solid #AADD66!important;outline-offset:7px!important}
@media(max-width:600px){#${IDS.root}{top:8px;right:8px;width:calc(100vw - 16px)}}
`;
  }

  function ensureBaseCss() {
    if (document.getElementById(IDS.baseCss)) return;
    const tag = document.createElement("style");
    tag.id = IDS.baseCss;
    tag.textContent = baseCss();
    document.head.appendChild(tag);
  }

  /* ---------- render ---------- */
  function renderPanel() {
    ensureBaseCss();
    const prevBody = document.querySelector(`#${IDS.root} .fm-body`);
    if (prevBody) state.ui.scrollTop = prevBody.scrollTop;
    document.getElementById(IDS.root)?.remove();
    document.querySelector(".fm-mini")?.remove();
    if (!isEditor()) return;

    if (localStorage.getItem(KEYS.panel) === "0") {
      const mini = document.createElement("button");
      mini.className = "fm-mini";
      mini.type = "button";
      mini.textContent = "Forma";
      mini.addEventListener("click", () => { localStorage.setItem(KEYS.panel, "1"); renderPanel(); });
      document.body.appendChild(mini);
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
    const group = CATALOG.find(g => g.group === state.ui.group) || CATALOG[0];
    return `
<div class="fm-panel" role="dialog" aria-label="Forma editor">
  <div class="fm-head" data-act="drag">
    <div class="fm-logo">F</div>
    <div><div class="fm-name">Forma</div><div class="fm-ver">v${VERSION} · Studio Poema</div></div>
    <div class="fm-head-btns">
      <button type="button" class="fm-pick" data-act="pick" data-on="${state.picking ? 1 : 0}">${state.picking ? "Picking…" : "Select"}</button>
      <button type="button" data-act="hide" title="Hide panel">×</button>
    </div>
  </div>
  <div class="fm-sub">
    <div class="fm-target-row">
      <div class="fm-target-pill">Editing: ${esc(targetLabel(c.target))}${c.scope === "global" ? " (whole page)" : ""}</div>
      <div class="fm-scope">
        <button type="button" data-act="scope" data-v="selected" data-on="${c.scope !== "global" ? 1 : 0}">Section</button>
        <button type="button" data-act="scope" data-v="global" data-on="${c.scope === "global" ? 1 : 0}">Page</button>
      </div>
    </div>
    <div class="fm-tabs">${CATALOG.map(g =>
      `<button type="button" class="fm-tab" data-act="tab" data-v="${esc(g.group)}" data-on="${g.group === state.ui.group ? 1 : 0}">${esc(g.icon)} ${esc(g.group)}</button>`).join("")}
    </div>
  </div>
  <div class="fm-body">
    ${themeHtml()}
    ${group.items.map(fxHtml).join("")}
  </div>
  <div class="fm-foot">
    <button type="button" data-act="reset">Reset</button>
    <button type="button" class="fm-publish" data-act="publish">Publish ↗</button>
  </div>
</div>`;
  }

  function themeHtml() {
    const th = state.config.theme;
    return `
<div class="fm-theme">
  <span>Colors</span>
  ${PALETTES.map(p => `<button type="button" class="fm-pal" data-act="palette" data-v="${p.id}" data-on="${th.palette === p.id ? 1 : 0}">${esc(p.label)}</button>`).join("")}
  ${["primary", "accent", "soft", "ink"].map(k =>
    `<label title="${k}"><input type="color" value="${esc(th[k])}" data-act="color" data-v="${k}"></label>`).join("")}
</div>`;
  }

  function fxHtml(e) {
    const sel = fxTargetFor(e);
    const st = getFx(sel, e.id);
    const blocked = e.cls && sel === "body";
    return `
<div class="fm-fx" data-fx="${e.id}">
  <div class="fm-fx-head" data-act="toggle" data-v="${e.id}" ${blocked ? 'style="opacity:.45"' : ""}>
    <div>
      <div class="fm-fx-title">${esc(e.label)}${e.global ? " · global" : ""}</div>
      <div class="fm-fx-desc">${esc(blocked ? "Pick a section first" : e.desc)}</div>
    </div>
    <div class="fm-sw" data-on="${st.on ? 1 : 0}"></div>
  </div>
  ${st.on ? `<div class="fm-ctrl">
    ${e.amount && e.amount !== "—" ? `<label class="fm-range">
      <input type="range" min="0" max="100" step="1" value="${st.i}" data-act="intensity" data-v="${e.id}">
      <b>${esc(e.amount)} · ${st.i}</b>
    </label>` : ""}
    ${(e.params || []).map(prm => `<label class="fm-range">
      <input type="range" min="0" max="100" step="1" value="${clamp(st.p[prm.k] ?? prm.v)}" data-act="param" data-v="${e.id}" data-k="${esc(prm.k)}">
      <b>${esc(prm.label)} · ${clamp(st.p[prm.k] ?? prm.v)}</b>
    </label>`).join("")}
  </div>` : ""}
</div>`;
  }

  /* ---------- event delegation: ONE click + ONE input handler ---------- */
  function bindPanel(root) {
    root.addEventListener("click", ev => {
      const el = ev.target.closest("[data-act]");
      if (!el) return;
      const act = el.dataset.act;
      const v = el.dataset.v;

      if (act === "pick") { state.picking ? (stopPicking(), renderPanel()) : startPicking(); return; }
      if (act === "hide") { localStorage.setItem(KEYS.panel, "0"); renderPanel(); return; }
      if (act === "tab") { state.ui.group = v; state.ui.scrollTop = 0; renderPanel(); return; }
      if (act === "scope") {
        state.config.scope = v === "global" ? "global" : "selected";
        saveConfig(); applyEffects(); renderPanel();
        return;
      }
      if (act === "toggle") {
        const e = EFFECTS.get(v);
        if (!e) return;
        const sel = fxTargetFor(e);
        if (e.cls && sel === "body") { toast("Pick a section first"); return; }
        const cur = getFx(sel, v);
        setFx(sel, v, { on: !cur.on });
        renderPanel();
        return;
      }
      if (act === "palette") {
        const p = PALETTES.find(x => x.id === v);
        if (!p) return;
        state.config.theme = { palette: p.id, primary: p.primary, accent: p.accent, soft: p.soft, ink: p.ink };
        saveConfig(); applyEffects(); renderPanel();
        toast(`${p.label} palette`);
        return;
      }
      if (act === "reset") {
        if (!confirm("Clear all Forma effects?")) return;
        state.config = clone(DEFAULT_CONFIG);
        saveConfig(); applyEffects(); renderPanel();
        toast("All effects cleared");
        return;
      }
      if (act === "publish") { publish(); return; }
    });

    root.addEventListener("input", ev => {
      const el = ev.target;
      const act = el.dataset.act;
      if (!act) return;
      if (act === "intensity") {
        const e = EFFECTS.get(el.dataset.v);
        if (!e) return;
        setFx(fxTargetFor(e), el.dataset.v, { i: el.value });
        const b = el.parentElement.querySelector("b");
        if (b) b.textContent = `${e.amount} · ${clamp(el.value)}`;
        return;
      }
      if (act === "param") {
        const e = EFFECTS.get(el.dataset.v);
        if (!e) return;
        setFx(fxTargetFor(e), el.dataset.v, { p: { [el.dataset.k]: el.value } });
        const prm = (e.params || []).find(x => x.k === el.dataset.k);
        const b = el.parentElement.querySelector("b");
        if (b && prm) b.textContent = `${prm.label} · ${clamp(el.value)}`;
        return;
      }
      if (act === "color") {
        state.config.theme = { ...state.config.theme, palette: "custom", [el.dataset.v]: el.value };
        saveConfig(); applyEffects();
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
    const fallback = `https://cdn.jsdelivr.net/gh/evaldasbanevici-del/SquarePlugin@main/FormaPlugin-v1.js`;
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
