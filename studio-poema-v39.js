(() => {
  const APP_ID = "ssx-template-studio";
  const STYLE_ID = `${APP_ID}-styles`;
  const EFFECT_STYLE_ID = `${APP_ID}-effect-styles`;
  const CURSOR_ID = `${APP_ID}-cursor`;
  const STORAGE_KEY = `${APP_ID}:config:v39`;
  const LEGACY_STORAGE_KEY = `${APP_ID}:config:v1`;
  const PANEL_KEY = `${APP_ID}:panel-open`;
  const PANEL_POSITION_KEY = `${APP_ID}:panel-position`;
  const DESIGNER_KEY = `${APP_ID}:designer-mode`;
  const CONFIG_SCRIPT_ID = `${APP_ID}-config`;
  const SCRIPT_SRC = document.currentScript && document.currentScript.src ? document.currentScript.src : "";
  const SCRIPT_PARAMS = (() => {
    try {
      return new URL(SCRIPT_SRC, location.href).searchParams;
    } catch {
      return new URLSearchParams();
    }
  })();

  const defaultConfig = {
    version: 39,
    activeTarget: "body",
    scope: "selected",
    mode: "Studio",
    preview: "desktop",
    theme: {
      palette: "poema",
      primary: "#125B49",
      accent: "#AADD66",
      soft: "#FCF6EB",
      ink: "#051914",
      gradientA: "#003527",
      gradientB: "#ECEABE"
    },
    effects: {},
    design: {}
  };

  const designDefaults = {
    font: { color: "", size: 0, lineHeight: 50, letterSpacing: 50, align: "", transform: "", weight: "" },
    background: { color: "", gradientTop: "", gradientBottom: "", gradientDirection: 0, opacity: 100 },
    border: { style: "solid", color: "", size: 0, radius: 0 },
    shadow: { color: "", spread: 0, blur: 20, x: 50, y: 60, inset: false },
    layout: { size: "medium", maxWidth: 50, padding: 50, gap: 50 },
    position: { x: 50, y: 50, rotate: 50, scale: 50 },
    effects: { glass: 0, blur: 0, opacity: 100, saturate: 50 },
    visibility: { mobile: true, desktop: true }
  };

  const designTools = [
    { id: "font", label: "Font", description: "Size, color, alignment and text formatting." },
    { id: "background", label: "Background", description: "Solid color, gradient and opacity." },
    { id: "border", label: "Border", description: "Border style, size and rounded corners." },
    { id: "shadow", label: "Shadow", description: "Outer or inset shadow with direction controls." },
    { id: "layout", label: "Layout", description: "Responsive sizing, spacing and max-width." },
    { id: "position", label: "Position", description: "Move, rotate and scale the selected element." },
    { id: "effects", label: "Effects", description: "Glass, blur, opacity and saturation." },
    { id: "visibility", label: "Visibility", description: "Show or hide on mobile and desktop." }
  ];

  const palettes = [
    { id: "poema", label: "Poema", primary: "#125B49", accent: "#AADD66", soft: "#FCF6EB", ink: "#051914", gradientA: "#003527", gradientB: "#ECEABE" },
    { id: "midnight", label: "Midnight", primary: "#051914", accent: "#AADD66", soft: "#FCF6EB", ink: "#051914", gradientA: "#051914", gradientB: "#125B49" },
    { id: "evergreen", label: "Evergreen", primary: "#125B49", accent: "#ECEABE", soft: "#FCF6EB", ink: "#003527", gradientA: "#125B49", gradientB: "#AADD66" },
    { id: "coach", label: "Coach", primary: "#003527", accent: "#AADD66", soft: "#ECEABE", ink: "#051914", gradientA: "#003527", gradientB: "#125B49" }
  ];

  const cursorEmojiOptions = ["☺", "😊", "✨", "↗", "👀", "🔥", "💚", "✦"];

  function mediaTargets(s) {
    return `${s} img,${s} video,${s}.sqs-block-image img,${s} .sqs-block-image img,${s} .image-block-wrapper img,${s} .thumb-image,${s} picture img`;
  }

  function mediaWrappers(s) {
    return `${s}.sqs-block-image,${s} .sqs-block-image,${s} .image-block-wrapper,${s} figure,${s} picture`;
  }

  function textTargets(s) {
    return `${s}:is(h1,h2,h3,p,li,a),${s} :is(h1,h2,h3,p,li,a)`;
  }

  function headingTargets(s) {
    return `${s}:is(h1,h2,h3),${s} :is(h1,h2,h3)`;
  }

  function paragraphTargets(s) {
    return `${s}:is(p,li,a),${s} :is(p,li,a)`;
  }

  function revealTextTargets(s) {
    return `${s}.ssx-reveal:is(h1,h2,h3,p,li,a),${s}.ssx-reveal :is(h1,h2,h3,p,li,a),${s}.ssx-parallax:is(h1,h2,h3,p,li,a),${s}.ssx-parallax :is(h1,h2,h3,p,li,a)`;
  }

  function hiddenRevealTextTargets(s) {
    return `${s}.ssx-reveal:not(.ssx-in):is(h1,h2,h3,p,li,a),${s}.ssx-reveal:not(.ssx-in) :is(h1,h2,h3,p,li,a),${s}.ssx-parallax:not(.ssx-in):is(h1,h2,h3,p,li,a),${s}.ssx-parallax:not(.ssx-in) :is(h1,h2,h3,p,li,a)`;
  }

  function wordRevealWordTargets(s) {
    return `${s}.ssx-word-blur-reveal:is(h1,h2,h3,h4,p,li,blockquote,.sqsrte-large,.sqsrte-small) .ssx-word,${s}.ssx-word-blur-reveal :is(h1,h2,h3,h4,p,li,blockquote,.sqsrte-large,.sqsrte-small) .ssx-word`;
  }

  function activeWordRevealWordTargets(s) {
    return `${s}.ssx-word-blur-reveal.ssx-in:is(h1,h2,h3,h4,p,li,blockquote,.sqsrte-large,.sqsrte-small) .ssx-word,${s}.ssx-word-blur-reveal.ssx-in :is(h1,h2,h3,h4,p,li,blockquote,.sqsrte-large,.sqsrte-small) .ssx-word`;
  }

  function buttonTargets(s) {
    return `${s}:is(a,button,.sqs-button-element,.sqs-block-button-element),${s} .sqs-button-element,${s} a.sqs-block-button-element,${s} .sqs-block-button a,${s} button`;
  }

  function contentTargets(s) {
    return `${s}>.content,${s} .content,${s} .sqs-layout>.sqs-row,${s}>.sqs-layout>.sqs-row,${s}.sqs-row,${s}>.sqs-row`;
  }

  const effectCatalog = [
    {
      group: "Presets",
      items: [
        {
          id: "preset-service-cards",
          label: "Service cards",
          description: "Turn blocks into clean service cards.",
          intensityLabel: "Depth",
          preview: "preset-cards",
          params: [
            { key: "gap", label: "Gap", value: 42 },
            { key: "radius", label: "Radius", value: 28 }
          ],
          css: (s, i, settings, theme) => {
            const gap = Math.round(12 + param(settings, "gap", 42) * 0.36);
            const radius = Math.round(2 + param(settings, "radius", 28) * 0.34);
            return `@media(min-width:800px){${s} .sqs-layout>.sqs-row,${s} .content{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:${gap}px;}} ${s} .sqs-block{background:${theme.soft}!important;border:1px solid color-mix(in srgb, ${theme.primary} 18%, transparent);border-radius:${radius}px;padding:clamp(18px,3vw,32px)!important;box-shadow:0 ${Math.round(8 + i * 22)}px ${Math.round(18 + i * 46)}px rgba(23,69,31,${0.05 + i * 0.15});transition:transform .24s ease,box-shadow .24s ease;} ${s} .sqs-block:hover{transform:translateY(-${Math.round(2 + i * 6)}px);}`;
          }
        },
        {
          id: "preset-feature-grid",
          label: "Feature grid",
          description: "Editorial feature blocks with rhythm.",
          intensityLabel: "Scale",
          preview: "preset-grid",
          params: [
            { key: "columns", label: "Columns", value: 50 },
            { key: "spacing", label: "Spacing", value: 54 }
          ],
          css: (s, i, settings, theme) => {
            const columns = param(settings, "columns", 50) > 64 ? 4 : param(settings, "columns", 50) < 34 ? 2 : 3;
            const gap = Math.round(16 + param(settings, "spacing", 54) * 0.5);
            return `@media(min-width:900px){${s} .sqs-layout>.sqs-row,${s} .content{display:grid!important;grid-template-columns:repeat(${columns},minmax(0,1fr));gap:${gap}px;align-items:start;}} ${s} .sqs-block h1,${s} .sqs-block h2,${s} .sqs-block h3{color:${theme.primary}!important;} ${s} .sqs-block{transition:transform .25s ease;} ${s} .sqs-block:hover{transform:translateY(-${Math.round(i * 8)}px);}`;
          }
        },
        {
          id: "preset-sticky-story",
          label: "Sticky story",
          description: "Pin one column while content scrolls.",
          intensityLabel: "Offset",
          preview: "preset-sticky",
          params: [
            { key: "gap", label: "Gap", value: 58 },
            { key: "width", label: "Left width", value: 50 }
          ],
          css: (s, i, settings) => {
            const gap = Math.round(24 + param(settings, "gap", 58) * 0.7);
            const left = Math.round(35 + param(settings, "width", 50) * 0.28);
            return `@media(min-width:980px){${s} .content,${s} .sqs-layout>.sqs-row{display:grid!important;grid-template-columns:${left}% minmax(0,1fr);gap:${gap}px;align-items:start;} ${s} .content>*:first-child,${s} .sqs-layout>.sqs-row>*:first-child{position:sticky;top:${Math.round(64 + i * 120)}px;}}`;
          }
        }
      ]
    },
    {
      group: "Layout",
      items: [
        {
          id: "section-soft-frame",
          label: "Soft frame",
          description: "Add border and premium depth.",
          intensityLabel: "Depth",
          preview: "layout-frame",
          params: [
            { key: "radius", label: "Radius", value: 36 },
            { key: "opacity", label: "Border", value: 42 }
          ],
          css: (s, i, settings, theme) => `${s}{background:${hexToRgba(theme.soft, 0.72)}!important;border:1px solid ${hexToRgba(theme.primary, 0.08 + param(settings, "opacity", 42) * 0.004)}!important;box-shadow:${Math.round(i * 10)}px ${Math.round(10 + i * 28)}px ${Math.round(24 + i * 72)}px ${hexToRgba(theme.primary, 0.06 + i * 0.14)}!important;border-radius:${Math.round(4 + param(settings, "radius", 36) * 0.34)}px!important;}`
        },
        {
          id: "layout-safe-container",
          label: "Safe centered container",
          description: "Center content with reliable responsive widths.",
          intensityLabel: "Width",
          preview: "layout-frame",
          params: [
            { key: "padding", label: "Side padding", value: 45 },
            { key: "space", label: "Vertical space", value: 42 }
          ],
          css: (s, i, settings) => {
            const max = Math.round(760 + i * 520);
            const pad = Math.round(14 + param(settings, "padding", 45) * 0.38);
            const y = Math.round(24 + param(settings, "space", 42) * 0.72);
            return `${s}{width:min(100%,${max}px)!important;max-width:${max}px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important;} ${s}>.content,${s} .content,${s} .sqs-layout{padding-left:${pad}px!important;padding-right:${pad}px!important;box-sizing:border-box!important;} ${s}{padding-top:${y}px!important;padding-bottom:${y}px!important;} @media(max-width:767px){${s}{width:100%!important;max-width:100%!important;} ${s}>.content,${s} .content,${s} .sqs-layout{padding-left:${Math.max(14, Math.round(pad * .7))}px!important;padding-right:${Math.max(14, Math.round(pad * .7))}px!important;}}`;
          }
        },
        {
          id: "layout-balanced-section",
          label: "Balanced section spacing",
          description: "Safe top/bottom spacing without shifting content left.",
          intensityLabel: "Air",
          preview: "layout-spacing",
          params: [
            { key: "mobile", label: "Mobile air", value: 42 }
          ],
          css: (s, i, settings) => {
            const y = Math.round(34 + i * 86);
            const mobile = Math.round(18 + param(settings, "mobile", 42) * 0.5);
            return `${s}{padding-top:${y}px!important;padding-bottom:${y}px!important;} ${s}>.content,${s} .content,${s} .sqs-layout{margin-left:auto!important;margin-right:auto!important;} @media(max-width:767px){${s}{padding-top:${mobile}px!important;padding-bottom:${mobile}px!important;}}`;
          }
        },
        {
          id: "layout-responsive-cards",
          label: "Responsive card grid",
          description: "Create tidy cards that collapse cleanly on mobile.",
          intensityLabel: "Columns",
          preview: "preset-cards",
          params: [
            { key: "gap", label: "Gap", value: 48 },
            { key: "radius", label: "Round", value: 24 }
          ],
          css: (s, i, settings, theme) => {
            const columns = i > .72 ? 4 : i > .38 ? 3 : 2;
            const gap = Math.round(14 + param(settings, "gap", 48) * .5);
            const radius = Math.round(4 + param(settings, "radius", 24) * .32);
            return `${contentTargets(s)}{display:grid!important;grid-template-columns:repeat(${columns},minmax(0,1fr))!important;gap:${gap}px!important;align-items:stretch!important;} ${s} .sqs-block{background:${hexToRgba(theme.soft,.86)}!important;border:1px solid ${hexToRgba(theme.primary,.14)}!important;border-radius:${radius}px!important;padding:clamp(18px,3vw,34px)!important;box-shadow:0 16px 42px ${hexToRgba(theme.primary,.08)}!important;} @media(max-width:767px){${contentTargets(s)}{grid-template-columns:1fr!important;}}`;
          }
        },
        {
          id: "section-tight-mobile",
          label: "Mobile spacing",
          description: "Control mobile vertical spacing.",
          intensityLabel: "Tightness",
          preview: "layout-spacing",
          params: [
            { key: "side", label: "Side pad", value: 42 }
          ],
          css: (s, i, settings) => {
            const y = Math.round(96 - i * 74);
            const x = Math.round(12 + param(settings, "side", 42) * 0.36);
            return `@media(max-width:767px){${s},${s} .content,${s} .section-background{padding-top:${y}px!important;padding-bottom:${y}px!important;} ${s} .content,${s} .sqs-layout{padding-left:${x}px!important;padding-right:${x}px!important;}}`;
          }
        },
        {
          id: "section-split-grid",
          label: "Split grid",
          description: "Turn content into a two column layout.",
          intensityLabel: "Gap",
          preview: "layout-split",
          params: [
            { key: "ratio", label: "Ratio", value: 50 }
          ],
          css: (s, i, settings) => {
            const left = Math.round(36 + param(settings, "ratio", 50) * 0.28);
            const gap = Math.round(18 + i * 78);
            return `@media(min-width:900px){${contentTargets(s)}{display:grid!important;grid-template-columns:${left}% minmax(0,1fr)!important;gap:${gap}px!important;align-items:center!important;} ${contentTargets(s)}>*{width:auto!important;max-width:none!important;}}`;
          }
        },
        {
          id: "section-width-control",
          label: "Section width",
          description: "Set section width presets from narrow to full.",
          intensityLabel: "Width",
          preview: "layout-frame",
          params: [
            { key: "align", label: "Align", value: 50 }
          ],
          css: (s, i, settings) => {
            const width = Math.round(25 + i * 75);
            const align = param(settings, "align", 50);
            const margin = align < 35 ? "0 auto 0 0" : align > 65 ? "0 0 0 auto" : "0 auto";
            return `${s}{width:${width}%!important;max-width:${width}%!important;margin:${margin}!important;} @media(max-width:767px){${s}{width:100%!important;max-width:100%!important;margin:0!important;}}`;
          }
        },
        {
          id: "section-divider-wave",
          label: "Wave divider",
          description: "Add a soft wave divider to the selected section.",
          intensityLabel: "Height",
          preview: "shape-divider",
          params: [
            { key: "placement", label: "Placement", value: 100 },
            { key: "opacity", label: "Opacity", value: 70 }
          ],
          css: (s, i, settings, theme) => `${s}{position:relative!important;overflow:hidden!important;} ${s}:after{content:"";position:absolute;left:-5%;right:-5%;${param(settings,"placement",100)>50?"bottom":"top"}:-${Math.round(8+i*22)}px;height:${Math.round(28+i*80)}px;background:${hexToRgba(theme.accent,param(settings,"opacity",70)/100)};border-radius:50% 50% 0 0/100% 100% 0 0;transform:${param(settings,"placement",100)>50?"none":"rotate(180deg)"};pointer-events:none;}`
        },
        {
          id: "section-sticky-pin",
          label: "Sticky section",
          description: "Pin selected section while scrolling.",
          intensityLabel: "Offset",
          preview: "utility-sticky",
          css: (s, i) => `@media(min-width:900px){${s}{position:sticky!important;top:${Math.round(20+i*140)}px!important;z-index:${Math.round(2+i*20)}!important;}}`
        },
        {
          id: "section-footer-reveal",
          label: "Footer reveal",
          description: "Create a sticky footer reveal feel.",
          intensityLabel: "Depth",
          preview: "preset-sticky",
          globalOnly: true,
          css: (_s, i, _settings, theme) => `footer,.Footer,.site-footer{position:sticky!important;bottom:0!important;z-index:0!important;background:${theme.soft}!important;box-shadow:0 -${Math.round(10+i*28)}px ${Math.round(24+i*70)}px ${hexToRgba(theme.primary,.08+i*.16)}!important;} main,.Main,.site-wrapper{position:relative;z-index:1;background:inherit;}`
        }
      ]
    },
    {
      group: "Typography",
      items: [
        {
          id: "text-editorial",
          label: "Editorial text",
          description: "Refine headings and paragraph rhythm.",
          intensityLabel: "Scale",
          preview: "type-editorial",
          css: (s, i) => `${s} h1,${s} h2{letter-spacing:0!important;line-height:${(1.12 - i * 0.12).toFixed(2)}!important;} ${s} p{font-size:clamp(16px,${(1 + i * 0.55).toFixed(2)}vw,${Math.round(17 + i * 6)}px);line-height:${(1.52 + i * 0.22).toFixed(2)};}`
        },
        {
          id: "text-highlight",
          label: "Text highlight",
          description: "Underline bold text with a marker.",
          intensityLabel: "Ink",
          preview: "type-highlight",
          params: [
            { key: "height", label: "Height", value: 58 }
          ],
          css: (s, i, settings, theme) => `${s} strong{background:linear-gradient(transparent ${Math.round(82 - param(settings, "height", 58) * 0.36)}%,${hexToRgba(theme.accent, 0.28 + i * 0.58)} 0);font-weight:inherit;}`
        },
        {
          id: "text-gradient",
          label: "Headline gradient",
          description: "Add restrained gradient to headings.",
          intensityLabel: "Color",
          preview: "type-gradient",
          params: [
            { key: "angle", label: "Angle", value: 25 }
          ],
          css: (s, i, settings, theme) => `${s} h1,${s} h2{background:linear-gradient(${Math.round(param(settings, "angle", 25) * 1.8)}deg,${theme.gradientA},${theme.primary} ${Math.round(35 + i * 25)}%,${theme.gradientB});-webkit-background-clip:text;background-clip:text;color:transparent!important;filter:saturate(${(0.8 + i * 0.7).toFixed(2)});}`
        },
        {
          id: "text-balanced",
          label: "Balanced headings",
          description: "Improve heading line breaks.",
          intensityLabel: "Balance",
          preview: "type-balance",
          css: (s) => `${s} h1,${s} h2,${s} h3{text-wrap:balance;}`
        },
        {
          id: "text-typewriter",
          label: "Typewriter heading",
          description: "Animate headings like typed text.",
          intensityLabel: "Speed",
          preview: "type-typewriter",
          params: [
            { key: "width", label: "Width", value: 72 },
            { key: "cursor", label: "Cursor", value: 70 }
          ],
          css: (s, i, settings, theme) => `${s} h1,${s} h2{display:inline-block;max-width:${Math.round(12 + param(settings, "width", 72) * 0.9)}ch;white-space:nowrap;overflow:hidden;border-right:${Math.round(1 + param(settings, "cursor", 70) * 0.04)}px solid ${theme.primary};animation:ssxTypewriter ${Math.max(1.8, 7 - i * 4.8).toFixed(1)}s steps(42,end) both,ssxCaret .85s step-end infinite;} @keyframes ssxTypewriter{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}} @keyframes ssxCaret{50%{border-color:transparent}}`
        },
        {
          id: "text-3d-hover",
          label: "3D text hover",
          description: "Flip headings like a small 3D tile on hover.",
          intensityLabel: "Depth",
          preview: "type-3d",
          params: [
            { key: "speed", label: "Speed", value: 45 }
          ],
          css: (s, i, settings, theme) => `${s} h1,${s} h2,${s} h3{display:inline-block;transform-style:preserve-3d;transition:transform ${(0.18 + param(settings,"speed",45)*.008).toFixed(2)}s ease,text-shadow .22s ease;} ${s} h1:hover,${s} h2:hover,${s} h3:hover{transform:perspective(700px) rotateX(${Math.round(4+i*18)}deg) rotateY(-${Math.round(3+i*12)}deg);text-shadow:${Math.round(i*8)}px ${Math.round(i*10)}px 0 ${hexToRgba(theme.accent,.35)};}`
        },
        {
          id: "text-outline-trend",
          label: "Outline trend",
          description: "Make large headings outlined and editorial.",
          intensityLabel: "Stroke",
          preview: "type-outline",
          css: (s, i, _settings, theme) => `${s} h1,${s} h2{-webkit-text-stroke:${Math.round(1+i*3)}px ${theme.primary};color:${hexToRgba(theme.primary, .04 + i*.08)}!important;text-shadow:none!important;}`
        },
        {
          id: "text-split-luxury",
          label: "Luxury split text",
          description: "Add wide tracking and refined uppercase rhythm.",
          intensityLabel: "Spacing",
          preview: "type-luxury",
          css: (s, i, _settings, theme) => `${s} h1,${s} h2,${s} .sqs-block-html h3{text-transform:uppercase;letter-spacing:${(0.04+i*.22).toFixed(2)}em!important;color:${theme.ink}!important;} ${s} p:first-letter{color:${theme.primary};font-size:${Math.round(110+i*60)}%;}`
        }
      ]
    },
    {
      group: "Buttons",
      items: [
        {
          id: "button-lift",
          label: "Lift hover",
          description: "Make buttons lift on hover.",
          intensityLabel: "Lift",
          preview: "button-lift",
          css: (s, i) => `${buttonTargets(s)}{transition:transform .22s ease,box-shadow .22s ease!important;} ${buttonTargets(s)}:hover{transform:translateY(-${Math.round(1 + i * 7)}px);box-shadow:0 ${Math.round(8 + i * 22)}px ${Math.round(18 + i * 36)}px rgba(15,23,42,${0.1 + i * 0.18})!important;}`
        },
        {
          id: "button-magnetic",
          label: "Magnetic glow",
          description: "Add glossy CTA surface and glow.",
          intensityLabel: "Glow",
          preview: "button-glow",
          params: [
            { key: "x", label: "Shadow X", value: 42 },
            { key: "y", label: "Shadow Y", value: 66 },
            { key: "blur", label: "Blur", value: 58 }
          ],
          css: (s, i, settings, theme) => {
            const x = Math.round((param(settings, "x", 42) - 50) * 0.28);
            const y = Math.round(4 + param(settings, "y", 66) * 0.32);
            const blur = Math.round(12 + param(settings, "blur", 58) * 0.55);
            return `${buttonTargets(s)}{position:relative;overflow:hidden;border:1px solid ${hexToRgba(theme.accent, 0.18 + i * 0.32)}!important;box-shadow:inset 0 1px rgba(255,255,255,.30),${x}px ${y}px ${blur}px ${hexToRgba(theme.primary, 0.1 + i * 0.2)}!important;background:linear-gradient(135deg,${theme.primary},${theme.gradientA})!important;} ${buttonTargets(s)}:hover{filter:saturate(${(1 + i * 0.28).toFixed(2)}) contrast(${(1 + i * 0.14).toFixed(2)});}`;
          }
        },
        {
          id: "button-corners",
          label: "Corner radius",
          description: "Dial buttons from sharp to pill.",
          intensityLabel: "Radius",
          preview: "button-radius",
          css: (s, i) => `${buttonTargets(s)}{border-radius:${Math.round(2 + i * 40)}px!important;}`
        },
        {
          id: "button-glass",
          label: "Glass buttons",
          description: "Turn buttons into glassmorphism CTAs.",
          intensityLabel: "Glass",
          preview: "button-glass",
          params: [
            { key: "blur", label: "Blur", value: 58 },
            { key: "opacity", label: "Opacity", value: 48 }
          ],
          css: (s, i, settings, theme) => `${buttonTargets(s)}{background:${hexToRgba(theme.soft, 0.2 + param(settings, "opacity", 48) * 0.006)}!important;color:${theme.ink}!important;border:1px solid ${hexToRgba(theme.primary, 0.12 + i * 0.24)}!important;backdrop-filter:blur(${Math.round(4 + param(settings, "blur", 58) * 0.22)}px);-webkit-backdrop-filter:blur(${Math.round(4 + param(settings, "blur", 58) * 0.22)}px);box-shadow:0 ${Math.round(8 + i * 18)}px ${Math.round(18 + i * 42)}px ${hexToRgba(theme.primary, 0.08 + i * 0.14)}!important;}`
        },
        {
          id: "button-solid-style",
          label: "Solid",
          description: "Clean filled button with refined hover.",
          intensityLabel: "Round",
          preview: "button-glow",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{background:${theme.primary}!important;color:#fff!important;border:1px solid ${theme.primary}!important;border-radius:${Math.round(4+i*26)}px!important;box-shadow:none!important;transition:transform .22s ease,background .22s ease!important;} ${buttonTargets(s)}:hover{background:${theme.ink}!important;transform:translateY(-${Math.round(1+i*4)}px)!important;}`
        },
        {
          id: "button-border-style",
          label: "Border",
          description: "Minimal outlined button style.",
          intensityLabel: "Weight",
          preview: "button-radius",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{background:transparent!important;color:${theme.primary}!important;border:${Math.round(1+i*3)}px solid ${theme.primary}!important;border-radius:${Math.round(5+i*22)}px!important;transition:background .22s ease,color .22s ease,transform .22s ease!important;} ${buttonTargets(s)}:hover{background:${theme.primary}!important;color:#fff!important;transform:translateY(-${Math.round(i*4)}px)!important;}`
        },
        {
          id: "button-arrow-style",
          label: "Arrow",
          description: "Add a clean arrow interaction.",
          intensityLabel: "Distance",
          preview: "button-arrow",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{position:relative!important;overflow:hidden!important;padding-right:${Math.round(28+i*24)}px!important;background:${theme.primary}!important;color:#fff!important;border-radius:999px!important;} ${buttonTargets(s)}:after{content:"↗";position:absolute;right:${Math.round(12+i*10)}px;top:50%;transform:translateY(-50%);transition:transform .22s ease;line-height:1;} ${buttonTargets(s)}:hover:after{transform:translate(${Math.round(2+i*8)}px,-${Math.round(2+i*8)}px);}`
        },
        {
          id: "button-line-style",
          label: "Line",
          description: "Editorial underline button style.",
          intensityLabel: "Line",
          preview: "button-line",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{background:transparent!important;color:${theme.primary}!important;border:0!important;border-radius:0!important;padding-left:0!important;padding-right:0!important;background-image:linear-gradient(${theme.primary},${theme.primary})!important;background-size:100% ${Math.round(1+i*4)}px!important;background-position:0 100%!important;background-repeat:no-repeat!important;transition:background-size .22s ease,color .22s ease!important;} ${buttonTargets(s)}:hover{background-size:100% ${Math.round(4+i*10)}px!important;color:${theme.ink}!important;}`
        },
        {
          id: "button-3d-style",
          label: "3D",
          description: "Tactile button with pressed depth.",
          intensityLabel: "Depth",
          preview: "button-3d",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{background:${theme.accent}!important;color:${theme.ink}!important;border:2px solid ${theme.ink}!important;border-radius:${Math.round(6+i*18)}px!important;box-shadow:${Math.round(4+i*8)}px ${Math.round(5+i*10)}px 0 ${theme.ink}!important;transition:transform .16s ease,box-shadow .16s ease!important;} ${buttonTargets(s)}:hover{transform:translate(${Math.round(2+i*4)}px,${Math.round(2+i*4)}px)!important;box-shadow:${Math.round(2+i*3)}px ${Math.round(2+i*4)}px 0 ${theme.ink}!important;}`
        },
        {
          id: "button-snowy-style",
          label: "Snowy",
          description: "Soft sparkle button for playful CTAs.",
          intensityLabel: "Sparkle",
          preview: "button-snowy",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{position:relative!important;overflow:hidden!important;background:#fff!important;color:${theme.primary}!important;border:1px solid ${hexToRgba(theme.primary,.18)}!important;border-radius:999px!important;box-shadow:0 16px 34px ${hexToRgba(theme.primary,.08)}!important;} ${buttonTargets(s)}:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,${hexToRgba(theme.accent,.75)} 0 ${Math.round(1+i*3)}px,transparent ${Math.round(2+i*4)}px),radial-gradient(circle at 72% 62%,${hexToRgba(theme.gradientB,.75)} 0 ${Math.round(1+i*3)}px,transparent ${Math.round(2+i*4)}px);opacity:${(.35+i*.5).toFixed(2)};pointer-events:none;animation:ssxSnowy 2.6s linear infinite;} @keyframes ssxSnowy{to{transform:translateY(14px)}}`
        },
        {
          id: "button-bubbly-style",
          label: "Bubbly",
          description: "Rounded bubbly hover movement.",
          intensityLabel: "Bounce",
          preview: "button-bubbly",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{background:${theme.gradientB}!important;color:${theme.ink}!important;border:0!important;border-radius:999px!important;box-shadow:inset 0 -${Math.round(3+i*8)}px 0 ${hexToRgba(theme.primary,.18)},0 14px 30px ${hexToRgba(theme.primary,.10)}!important;transition:transform .22s cubic-bezier(.2,1.6,.3,1),filter .22s ease!important;} ${buttonTargets(s)}:hover{transform:scale(${(1+i*.09).toFixed(2)}) translateY(-${Math.round(1+i*5)}px)!important;filter:saturate(${(1+i*.35).toFixed(2)});}`
        },
        {
          id: "engagement-pulse",
          label: "Pulse",
          description: "Draw attention with a soft pulse.",
          intensityLabel: "Pulse",
          preview: "engagement-pulse",
          css: (s, i, _settings, theme) => `${buttonTargets(s)}{animation:ssxEngPulse ${Math.max(1.2,3-i*1.5).toFixed(1)}s ease-in-out infinite;} @keyframes ssxEngPulse{0%,100%{box-shadow:0 0 0 0 ${hexToRgba(theme.accent,.0)}}50%{box-shadow:0 0 0 ${Math.round(8+i*22)}px ${hexToRgba(theme.accent,.26)}}}`
        },
        {
          id: "engagement-wobble",
          label: "Wobble",
          description: "Playful side-to-side button motion.",
          intensityLabel: "Wobble",
          preview: "engagement-wobble",
          css: (s, i) => `${buttonTargets(s)}:hover{animation:ssxWobble ${Math.max(.45,1.1-i*.45).toFixed(2)}s ease both;} @keyframes ssxWobble{0%,100%{transform:translateX(0)}20%{transform:translateX(-${Math.round(2+i*8)}px)}40%{transform:translateX(${Math.round(2+i*8)}px)}60%{transform:translateX(-${Math.round(1+i*5)}px)}80%{transform:translateX(${Math.round(1+i*4)}px)}}`
        },
        {
          id: "engagement-hovering",
          label: "Hovering",
          description: "Make important buttons float gently.",
          intensityLabel: "Float",
          preview: "engagement-hover",
          css: (s, i) => `${buttonTargets(s)}{animation:ssxButtonHovering ${Math.max(2.4,5-i*2).toFixed(1)}s ease-in-out infinite;} @keyframes ssxButtonHovering{0%,100%{transform:translateY(0)}50%{transform:translateY(-${Math.round(2+i*9)}px)}}`
        },
        {
          id: "engagement-jelly",
          label: "Jelly",
          description: "Squishy CTA hover effect.",
          intensityLabel: "Jelly",
          preview: "engagement-jelly",
          css: (s, i) => `${buttonTargets(s)}:hover{animation:ssxJelly ${Math.max(.45,1.1-i*.42).toFixed(2)}s ease both;} @keyframes ssxJelly{0%,100%{transform:scale(1)}30%{transform:scale(${(1+i*.18).toFixed(2)},${(1-i*.08).toFixed(2)})}55%{transform:scale(${(1-i*.06).toFixed(2)},${(1+i*.1).toFixed(2)})}75%{transform:scale(${(1+i*.04).toFixed(2)},${(1-i*.03).toFixed(2)})}}`
        }
      ]
    },
    {
      group: "Images",
      items: [
        {
          id: "image-soft-shadow",
          label: "Soft shadow",
          description: "Add controlled media depth.",
          intensityLabel: "Depth",
          preview: "image-shadow",
          css: (s, i, _settings, theme) => `${mediaTargets(s)}{box-shadow:0 ${Math.round(10 + i * 30)}px ${Math.round(24 + i * 64)}px ${hexToRgba(theme.primary, 0.08 + i * 0.18)}!important;}`
        },
        {
          id: "image-rounded",
          label: "Rounded media",
          description: "Round images and videos.",
          intensityLabel: "Radius",
          preview: "image-radius",
          css: (s, i) => `${mediaWrappers(s)}{overflow:hidden!important;border-radius:${Math.round(4 + i * 34)}px!important;} ${mediaTargets(s)}{border-radius:${Math.round(4 + i * 34)}px!important;overflow:hidden!important;}`
        },
        {
          id: "image-zoom-hover",
          label: "Zoom hover",
          description: "Add subtle image hover zoom.",
          intensityLabel: "Zoom",
          preview: "image-zoom",
          params: [
            { key: "speed", label: "Speed", value: 45 }
          ],
          css: (s, i, settings) => `${mediaWrappers(s)}{overflow:hidden!important;} ${mediaTargets(s)}{transition:transform ${(0.25 + param(settings, "speed", 45) * 0.012).toFixed(2)}s cubic-bezier(.2,.8,.2,1)!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{transform:scale(${(1 + i * 0.12).toFixed(3)})!important;}`
        },
        {
          id: "image-duotone",
          label: "Duotone tint",
          description: "Apply a modern contrast tint.",
          intensityLabel: "Tint",
          preview: "image-tint",
          css: (s, i) => `${mediaTargets(s)}{filter:contrast(${(1 + i * 0.18).toFixed(2)}) saturate(${(1 - i * 0.22).toFixed(2)}) sepia(${(i * 0.25).toFixed(2)})!important;}`
        },
        {
          id: "image-curtain-reveal",
          label: "Curtain reveal",
          description: "Reveal images with a soft curtain.",
          intensityLabel: "Reveal",
          preview: "image-curtain",
          params: [
            { key: "speed", label: "Speed", value: 55 },
            { key: "direction", label: "Direction", value: 30 }
          ],
          css: (s, i, settings, theme) => `${mediaWrappers(s)}{position:relative!important;overflow:hidden!important;} ${mediaWrappers(s)}:after{content:"";position:absolute;inset:0;background:${theme.soft};transform:translateX(${param(settings, "direction", 30) > 50 ? "100%" : "-100%"});transition:transform ${(0.35 + param(settings, "speed", 55) * 0.012).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity .25s ease;pointer-events:none;opacity:${(0.15 + i * 0.45).toFixed(2)};} ${mediaWrappers(s)}:hover:after{transform:translateX(0);}`
        },
        {
          id: "image-floating-gallery",
          label: "Floating gallery",
          description: "Offset image blocks like an editorial collage.",
          intensityLabel: "Offset",
          preview: "image-float-gallery",
          params: [
            { key: "rotate", label: "Rotate", value: 24 }
          ],
          css: (s, i, settings) => `${s} .sqs-block-image:nth-of-type(2n),${s} figure:nth-of-type(2n){transform:translateY(-${Math.round(i * 28)}px) rotate(${(param(settings, "rotate", 24) * 0.04).toFixed(1)}deg)!important;} ${s} .sqs-block-image:nth-of-type(2n+1),${s} figure:nth-of-type(2n+1){transform:translateY(${Math.round(i * 18)}px) rotate(-${(param(settings, "rotate", 24) * 0.035).toFixed(1)}deg)!important;} ${s} .sqs-block-image,${s} figure{transition:transform .45s ease!important;}`
        },
        {
          id: "image-infinite-gallery",
          label: "Infinite gallery",
          description: "Create a continuous horizontal gallery feel.",
          intensityLabel: "Speed",
          preview: "image-infinite",
          params: [
            { key: "gap", label: "Gap", value: 32 }
          ],
          css: (s, i, settings) => `${s}{overflow:hidden!important;} ${contentTargets(s)},${s} .gallery,${s} .sqs-gallery{display:flex!important;gap:${Math.round(8 + param(settings, "gap", 32) * 0.42)}px!important;width:max-content!important;animation:ssxGallery ${Math.max(10, 42 - i * 30).toFixed(1)}s linear infinite;} ${s}:hover .gallery,${s}:hover .sqs-gallery,${s}:hover .sqs-row{animation-play-state:paused;} @keyframes ssxGallery{0%{transform:translateX(0)}100%{transform:translateX(-45%)}}`
        }
      ]
    },
    {
      group: "Motion",
      items: [
        {
          id: "motion-reveal",
          label: "Scroll reveal",
          description: "Fade content upward on entry.",
          intensityLabel: "Distance",
          preview: "motion-reveal",
          className: "ssx-reveal",
          params: [
            { key: "speed", label: "Speed", value: 45 },
            { key: "blur", label: "Blur", value: 18 }
          ],
          css: (s, i, settings) => `${s}.ssx-reveal{opacity:0;filter:blur(${Math.round(param(settings, "blur", 18) * 0.12)}px);transform:translateY(${Math.round(10 + i * 44)}px);transition:opacity ${(0.35 + param(settings, "speed", 45) * 0.013).toFixed(2)}s ease,filter ${(0.35 + param(settings, "speed", 45) * 0.013).toFixed(2)}s ease,transform ${(0.35 + param(settings, "speed", 45) * 0.013).toFixed(2)}s ease;} ${s}.ssx-reveal.ssx-in{opacity:1;filter:none;transform:none;}`
        },
        {
          id: "motion-parallax",
          label: "Gentle parallax",
          description: "Add slow background movement.",
          intensityLabel: "Strength",
          preview: "motion-parallax",
          className: "ssx-parallax",
          css: (s) => `${s}.ssx-parallax{background-attachment:fixed;background-size:cover;background-position:center;} @media(max-width:767px){${s}.ssx-parallax{background-attachment:scroll;}}`
        },
        {
          id: "motion-float",
          label: "Float",
          description: "Create a slow floating animation.",
          intensityLabel: "Float",
          preview: "motion-float",
          params: [
            { key: "speed", label: "Speed", value: 45 },
            { key: "rotate", label: "Rotate", value: 8 }
          ],
          css: (s, i, settings) => `${s}{animation:ssxFloat ${Math.max(3, 9 - param(settings, "speed", 45) * 0.055).toFixed(1)}s ease-in-out infinite;} @keyframes ssxFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-${Math.round(4 + i * 22)}px) rotate(${(param(settings, "rotate", 8) * 0.05).toFixed(1)}deg)}}`
        },
        {
          id: "motion-stagger",
          label: "Stagger children",
          description: "Stagger direct child entrances.",
          intensityLabel: "Delay",
          preview: "motion-stagger",
          className: "ssx-stagger",
          css: (s, i) => {
            const delay = Math.round(45 + i * 150);
            return `${s}.ssx-stagger>*{opacity:0;transform:translateY(${Math.round(8 + i * 24)}px);transition:opacity .55s ease,transform .55s ease;} ${s}.ssx-stagger.ssx-in>*{opacity:1;transform:none;} ${s}.ssx-stagger.ssx-in>*:nth-child(2){transition-delay:${delay}ms}${s}.ssx-stagger.ssx-in>*:nth-child(3){transition-delay:${delay * 2}ms}${s}.ssx-stagger.ssx-in>*:nth-child(4){transition-delay:${delay * 3}ms}${s}.ssx-stagger.ssx-in>*:nth-child(5){transition-delay:${delay * 4}ms}`;
          }
        },
        {
          id: "motion-scroll-progress",
          label: "Scroll progress",
          description: "Add page progress bar.",
          intensityLabel: "Height",
          preview: "motion-progress",
          globalOnly: true,
          css: (_s, i, settings, theme) => `body:before{content:"";position:fixed;top:0;left:0;height:${Math.round(2 + i * 8)}px;width:calc(var(--ssx-scroll-progress,0)*100%);background:linear-gradient(90deg,${theme.gradientA},${theme.gradientB});z-index:2147483646;pointer-events:none;box-shadow:0 0 ${Math.round(param(settings, "glow", 30) * 0.25)}px ${hexToRgba(theme.accent,.45)};}`
        },
        {
          id: "motion-marquee",
          label: "Soft marquee",
          description: "Turn repeated text into horizontal motion.",
          intensityLabel: "Speed",
          preview: "motion-marquee",
          params: [
            { key: "distance", label: "Distance", value: 70 }
          ],
          css: (s, i, settings) => `${s}{overflow:hidden;} ${s} h1,${s} h2,${s} h3{white-space:nowrap;display:inline-block;animation:ssxMarquee ${Math.max(8, 28 - i * 18).toFixed(1)}s linear infinite;} @keyframes ssxMarquee{0%{transform:translateX(${Math.round(param(settings, "distance", 70) * 0.3)}%)}100%{transform:translateX(-${Math.round(70 + param(settings, "distance", 70) * 0.3)}%)}}`
        },
        {
          id: "motion-scroll-rotate",
          label: "Scroll rotate",
          description: "Rotate selected element while scrolling.",
          intensityLabel: "Rotation",
          preview: "motion-rotate",
          params: [
            { key: "scale", label: "Scale", value: 30 }
          ],
          css: (s, i, settings) => `${s}{transform:rotate(calc(var(--ssx-scroll-progress,0) * ${Math.round(90 + i * 630)}deg)) scale(${(1 + param(settings, "scale", 30) * 0.002).toFixed(2)});transform-origin:center;transition:transform .08s linear;}`
        },
        {
          id: "motion-fixed-mark",
          label: "Fixed rotating mark",
          description: "Add a fixed rotating Studio Poema mark.",
          intensityLabel: "Size",
          preview: "motion-fixed",
          globalOnly: true,
          params: [
            { key: "speed", label: "Speed", value: 45 },
            { key: "opacity", label: "Opacity", value: 42 }
          ],
          css: (_s, i, settings, theme) => `body:after{content:"";position:fixed;right:${Math.round(18 + i * 34)}px;bottom:${Math.round(18 + i * 34)}px;width:${Math.round(34 + i * 72)}px;height:${Math.round(34 + i * 72)}px;z-index:2147483000;pointer-events:none;opacity:${(0.18 + param(settings, "opacity", 42) * 0.006).toFixed(2)};background:${theme.primary};-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M32 7c7 5 8 13 0 20-8-7-7-15 0-20Z'/%3E%3Cpath d='M29 30C19 19 10 22 7 34c11 3 19 1 22-4Z'/%3E%3Cpath d='M35 30c10-11 19-8 22 4-11 3-19 1-22-4Z'/%3E%3Cpath d='M29 43C17 32 7 36 4 50c12 3 22 1 25-7Z'/%3E%3Cpath d='M35 43c12-11 22-7 25 7-12 3-22 1-25-7Z'/%3E%3Cpath d='M30 25h4v33h-4z'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M32 7c7 5 8 13 0 20-8-7-7-15 0-20Z'/%3E%3Cpath d='M29 30C19 19 10 22 7 34c11 3 19 1 22-4Z'/%3E%3Cpath d='M35 30c10-11 19-8 22 4-11 3-19 1-22-4Z'/%3E%3Cpath d='M29 43C17 32 7 36 4 50c12 3 22 1 25-7Z'/%3E%3Cpath d='M35 43c12-11 22-7 25 7-12 3-22 1-25-7Z'/%3E%3Cpath d='M30 25h4v33h-4z'/%3E%3C/svg%3E") center/contain no-repeat;animation:ssxFixedMark ${Math.max(4, 18 - param(settings, "speed", 45) * 0.14).toFixed(1)}s linear infinite;} @keyframes ssxFixedMark{to{transform:rotate(360deg)}}`
        },
        {
          id: "motion-soft-breathe",
          label: "Soft breathe",
          description: "Slow premium scale and opacity movement.",
          intensityLabel: "Pulse",
          preview: "motion-float",
          params: [
            { key: "speed", label: "Speed", value: 40 }
          ],
          css: (s, i, settings) => `${s}{animation:ssxBreathe ${Math.max(3.5, 11 - param(settings,"speed",40)*.07).toFixed(1)}s ease-in-out infinite;transform-origin:center;} @keyframes ssxBreathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(${(1+i*.045).toFixed(3)});opacity:${(1-i*.12).toFixed(2)}}}`
        },
        {
          id: "motion-clip-reveal",
          label: "Clip reveal",
          description: "Modern clipped entrance for content blocks.",
          intensityLabel: "Reveal",
          preview: "motion-reveal",
          className: "ssx-reveal",
          params: [
            { key: "speed", label: "Speed", value: 52 }
          ],
          css: (s, i, settings) => `${s}.ssx-reveal{opacity:0;clip-path:inset(0 0 ${Math.round(18+i*62)}% 0);transform:translateY(${Math.round(8+i*32)}px);transition:opacity ${(0.32+param(settings,"speed",52)*.012).toFixed(2)}s ease,clip-path ${(0.32+param(settings,"speed",52)*.012).toFixed(2)}s cubic-bezier(.2,.8,.2,1),transform ${(0.32+param(settings,"speed",52)*.012).toFixed(2)}s ease;} ${s}.ssx-reveal.ssx-in{opacity:1;clip-path:inset(0);transform:none;}`
        },
        {
          id: "motion-gradient-shift",
          label: "Animated gradient",
          description: "Move a tasteful gradient through the selected area.",
          intensityLabel: "Motion",
          preview: "type-gradient",
          params: [
            { key: "speed", label: "Speed", value: 42 }
          ],
          css: (s, i, settings, theme) => `${s}{background:linear-gradient(120deg,${theme.soft},${hexToRgba(theme.gradientB,.72)},${hexToRgba(theme.accent,.38)},${theme.soft})!important;background-size:${Math.round(160+i*280)}% ${Math.round(160+i*220)}%!important;animation:ssxGradientShift ${Math.max(4,18-param(settings,"speed",42)*.13).toFixed(1)}s ease infinite;} @keyframes ssxGradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`
        },
        {
          id: "motion-ken-burns",
          label: "Ken Burns media",
          description: "Add slow cinematic movement to images.",
          intensityLabel: "Zoom",
          preview: "image-zoom",
          params: [
            { key: "speed", label: "Speed", value: 32 }
          ],
          css: (s, i, settings) => `${mediaWrappers(s)}{overflow:hidden!important;} ${mediaTargets(s)}{transform-origin:center;animation:ssxKenBurns ${Math.max(8,28-param(settings,"speed",32)*.18).toFixed(1)}s ease-in-out infinite alternate;} @keyframes ssxKenBurns{from{transform:scale(1) translate3d(0,0,0)}to{transform:scale(${(1+i*.16).toFixed(3)}) translate3d(${Math.round(i*18)}px,-${Math.round(i*14)}px,0)}}`
        },
        {
          id: "motion-micro-shimmer",
          label: "Micro shimmer",
          description: "Subtle passing highlight for cards and buttons.",
          intensityLabel: "Shine",
          preview: "shape-glass",
          params: [
            { key: "speed", label: "Speed", value: 46 }
          ],
          css: (s, i, settings) => `${s}{position:relative!important;overflow:hidden!important;} ${s}:before{content:"";position:absolute;inset:-40%;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,${(.1+i*.28).toFixed(2)}) 50%,transparent 65%);transform:translateX(-70%);animation:ssxShimmer ${Math.max(2.5,8-param(settings,"speed",46)*.05).toFixed(1)}s ease-in-out infinite;pointer-events:none;} ${s}>*{position:relative;z-index:1;} @keyframes ssxShimmer{0%,55%{transform:translateX(-70%)}100%{transform:translateX(70%)}}`
        }
      ]
    },
    {
      group: "Navigation",
      items: [
        {
          id: "nav-glass",
          label: "Glass header",
          description: "Make header translucent and blurred.",
          intensityLabel: "Blur",
          preview: "nav-glass",
          globalOnly: true,
          css: (_s, i) => `.header,.Header,.site-header{backdrop-filter:blur(${Math.round(6 + i * 18)}px);-webkit-backdrop-filter:blur(${Math.round(6 + i * 18)}px);background:rgba(255,255,255,${(0.94 - i * 0.32).toFixed(2)})!important;border-bottom:1px solid rgba(15,23,42,.08);}`
        },
        {
          id: "nav-link-underline",
          label: "Animated nav links",
          description: "Add nav hover underline.",
          intensityLabel: "Weight",
          preview: "nav-links",
          globalOnly: true,
          css: (_s, i) => `.header-nav a,.Header-nav a,.site-header a{background-image:linear-gradient(currentColor,currentColor);background-size:0 ${Math.round(1 + i * 3)}px;background-position:0 100%;background-repeat:no-repeat;transition:background-size .24s ease;} .header-nav a:hover,.Header-nav a:hover,.site-header a:hover{background-size:100% ${Math.round(1 + i * 3)}px;}`
        },
        {
          id: "nav-pill-box",
          label: "Pill header",
          description: "Turn the full header and links into a modern pill.",
          intensityLabel: "Round",
          preview: "nav-pill",
          globalOnly: true,
          params: [
            { key: "gap", label: "Gap", value: 44 },
            { key: "padding", label: "Padding", value: 50 },
            { key: "glass", label: "Glass", value: 55 }
          ],
          css: (_s, i, settings, theme) => {
            const pad = Math.round(8 + param(settings, "padding", 50) * .18);
            const gap = Math.round(6 + param(settings, "gap", 44) * .22);
            const blur = Math.round(8 + param(settings, "glass", 55) * .22);
            const radius = Math.round(18 + i * 34);
            return `.header,.Header,.site-header{position:sticky!important;top:14px!important;z-index:9999!important;margin:10px auto!important;width:min(1180px,calc(100% - 28px))!important;border-radius:${radius}px!important;background:${hexToRgba(theme.soft,.72)}!important;border:1px solid ${hexToRgba(theme.primary,.16+i*.18)}!important;box-shadow:0 ${Math.round(10+i*20)}px ${Math.round(24+i*48)}px ${hexToRgba(theme.ink,.10)}!important;backdrop-filter:blur(${blur}px)!important;-webkit-backdrop-filter:blur(${blur}px)!important;overflow:visible!important;} .header-inner,.Header-inner,.site-header>div{padding:${Math.round(pad*.7)}px ${pad}px!important;} .header-nav-list,.Header-nav-list,.site-header nav ul,.site-header nav{gap:${gap}px!important;align-items:center!important;} .header-nav a,.Header-nav a,.site-header nav a{border:1px solid ${hexToRgba(theme.primary,.16+i*.2)}!important;border-radius:999px!important;padding:${Math.round(5+pad*.18)}px ${Math.round(12+pad*.32)}px!important;background:${hexToRgba(theme.soft,.34+i*.32)}!important;color:${theme.ink}!important;transition:background .22s ease,color .22s ease,transform .22s ease,box-shadow .22s ease!important;} .header-nav a:hover,.Header-nav a:hover,.site-header nav a:hover{background:${theme.accent}!important;color:${theme.ink}!important;transform:translateY(-${Math.round(1+i*4)}px);box-shadow:0 8px 18px ${hexToRgba(theme.accent,.24)}!important;}`;
          }
        },
        {
          id: "nav-dropdown-glass",
          label: "Glass dropdown",
          description: "Style dropdown menus as glass panels.",
          intensityLabel: "Glass",
          preview: "nav-dropdown",
          globalOnly: true,
          params: [
            { key: "blur", label: "Blur", value: 64 }
          ],
          css: (_s, i, settings, theme) => `.header-nav-folder-content,.Header-nav-folder-content,.site-header [role="menu"],.site-header .subnav{background:${hexToRgba(theme.soft, .5 + i * .35)}!important;border:1px solid ${hexToRgba(theme.primary, .14 + i * .22)}!important;border-radius:${Math.round(8 + i * 20)}px!important;box-shadow:0 ${Math.round(12 + i * 24)}px ${Math.round(28 + i * 60)}px ${hexToRgba(theme.primary, .12)}!important;backdrop-filter:blur(${Math.round(5 + param(settings, "blur", 64) * .22)}px)!important;-webkit-backdrop-filter:blur(${Math.round(5 + param(settings, "blur", 64) * .22)}px)!important;}`
        },
        {
          id: "nav-burger-polish",
          label: "Burger polish",
          description: "Refine mobile menu icon and panel.",
          intensityLabel: "Size",
          preview: "nav-burger",
          globalOnly: true,
          css: (_s, i, _settings, theme) => `.burger-inner .top-bun,.burger-inner .patty,.burger-inner .bottom-bun,.Mobile-bar-menu .Icon-line{height:${Math.round(2 + i * 3)}px!important;background:${theme.primary}!important;border-radius:999px!important;} .header-menu,.Header-menu,.mobile-menu{background:${theme.soft}!important;color:${theme.ink}!important;}`
        },
        {
          id: "nav-sticky-hover",
          label: "Sticky hover",
          description: "Header sticks and lifts on hover.",
          intensityLabel: "Lift",
          preview: "nav-sticky",
          globalOnly: true,
          css: (_s, i, _settings, theme) => `.header,.Header,.site-header{position:sticky!important;top:0!important;z-index:9999!important;transition:transform .22s ease,box-shadow .22s ease,background .22s ease!important;} .header:hover,.Header:hover,.site-header:hover{background:${hexToRgba(theme.soft,.88)}!important;box-shadow:0 ${Math.round(6 + i * 20)}px ${Math.round(16 + i * 42)}px ${hexToRgba(theme.primary,.12)}!important;transform:translateY(${Math.round(i * 2)}px);}`
        }
      ]
    },
    {
      group: "Cursor",
      items: [
        {
          id: "cursor-soft-dot",
          label: "Soft dot cursor",
          description: "Use a refined dot cursor on the selected area.",
          intensityLabel: "Size",
          preview: "cursor-dot",
          css: (s, i, _settings, theme) => `${s},${s} *{cursor:crosshair!important;} ${s} a,${s} button{cursor:pointer!important;} ${s}:hover{outline:${Math.round(1 + i * 3)}px solid ${hexToRgba(theme.accent,.5)}!important;outline-offset:${Math.round(2 + i * 8)}px!important;}`
        },
        {
          id: "cursor-link-magnet",
          label: "Link magnet",
          description: "Make links feel tactile on hover.",
          intensityLabel: "Pull",
          preview: "cursor-magnet",
          css: (s, i) => `${s} a,${s} button{transition:transform .18s ease,filter .18s ease!important;} ${s} a:hover,${s} button:hover{transform:translateY(-${Math.round(1+i*5)}px) scale(${(1+i*.04).toFixed(2)});filter:saturate(${(1+i*.35).toFixed(2)});}`
        },
        {
          id: "cursor-emoji",
          label: "Emoji cursor",
          description: "Adds a simple emoji cursor mark near links.",
          intensityLabel: "Size",
          preview: "cursor-dot",
          params: [
            { key: "emoji", label: "Style", value: 50 }
          ],
          css: (s, i) => `${s} a,${s} button{position:relative!important;} ${s} a:hover:after,${s} button:hover:after{content:"${i > .65 ? "✦" : i > .35 ? "●" : "→"}";position:absolute;right:-${Math.round(12+i*22)}px;top:50%;transform:translateY(-50%);font-size:${Math.round(12+i*18)}px;line-height:1;pointer-events:none;}`
        },
        {
          id: "cursor-block-tilt",
          label: "Block tilt",
          description: "Adds a 3D tilt and glare feeling on hover.",
          intensityLabel: "Tilt",
          preview: "motion-rotate",
          params: [
            { key: "glare", label: "Glare", value: 45 }
          ],
          css: (s, i, settings) => `${s}{position:relative!important;transform-style:preserve-3d;transition:transform .28s ease!important;overflow:hidden;} ${s}:hover{transform:perspective(900px) rotateX(${Math.round(2+i*9)}deg) rotateY(-${Math.round(2+i*12)}deg) scale(${(1+i*.035).toFixed(2)})!important;} ${s}:after{content:"";position:absolute;inset:-30%;background:linear-gradient(115deg,transparent,rgba(255,255,255,${(param(settings,"glare",45)/180).toFixed(2)}),transparent);transform:translateX(-65%);transition:transform .38s ease;pointer-events:none;} ${s}:hover:after{transform:translateX(65%);}`
        }
      ]
    },
    {
      group: "Hover",
      items: [
        {
          id: "hover-transform-kit",
          label: "Hover transform kit",
          description: "Scale, rotate and fade selected blocks on hover.",
          intensityLabel: "Scale",
          preview: "hover-transform",
          params: [
            { key: "rotate", label: "Rotate", value: 50 },
            { key: "opacity", label: "Opacity", value: 100 },
            { key: "speed", label: "Speed", value: 45 }
          ],
          css: (s, i, settings) => `${s}{transition:transform ${(0.12 + param(settings,"speed",45)*.009).toFixed(2)}s ease,opacity ${(0.12 + param(settings,"speed",45)*.009).toFixed(2)}s ease,filter ${(0.12 + param(settings,"speed",45)*.009).toFixed(2)}s ease!important;} ${s}:hover{transform:scale(${(1 + i*.18).toFixed(2)}) rotate(${Math.round((param(settings,"rotate",50)-50)*.5)}deg)!important;opacity:${(param(settings,"opacity",100)/100).toFixed(2)}!important;}`
        },
        {
          id: "hover-color-border",
          label: "Hover color border",
          description: "Change border, background and shadow on hover.",
          intensityLabel: "Strength",
          preview: "hover-border",
          params: [
            { key: "border", label: "Border", value: 45 },
            { key: "shadow", label: "Shadow", value: 52 },
            { key: "radius", label: "Radius", value: 34 }
          ],
          css: (s, i, settings, theme) => `${s}{transition:background .25s ease,border .25s ease,box-shadow .25s ease,border-radius .25s ease!important;} ${s}:hover{background:linear-gradient(135deg,${hexToRgba(theme.gradientA,.78)},${hexToRgba(theme.gradientB,.78)})!important;border:${Math.round(1+param(settings,"border",45)*.05)}px solid ${theme.accent}!important;border-radius:${Math.round(4+param(settings,"radius",34)*.42)}px!important;box-shadow:0 ${Math.round(8+i*24)}px ${Math.round(18+param(settings,"shadow",52)*.7)}px ${hexToRgba(theme.primary,.08+i*.18)}!important;}`
        },
        {
          id: "hover-image-filter",
          label: "Hover image filter",
          description: "Animate images from muted to bright color.",
          intensityLabel: "Color",
          preview: "hover-image",
          params: [
            { key: "brightness", label: "Bright", value: 58 },
            { key: "contrast", label: "Contrast", value: 54 },
            { key: "blur", label: "Blur", value: 8 }
          ],
          css: (s, i, settings) => `${mediaTargets(s)}{filter:grayscale(${Math.round(100-i*100)}%) brightness(${(0.7+param(settings,"brightness",58)*.01).toFixed(2)}) contrast(${(.8+param(settings,"contrast",54)*.01).toFixed(2)}) blur(${Math.round(param(settings,"blur",8)*.08)}px)!important;transition:filter .35s ease,transform .35s ease!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{filter:grayscale(0%) brightness(1.06) contrast(1.05) blur(0)!important;transform:scale(${(1+i*.07).toFixed(2)})!important;}`
        },
        {
          id: "hover-overlay-reveal",
          label: "Hover overlay reveal",
          description: "Show a colored overlay and reveal text feel on hover.",
          intensityLabel: "Overlay",
          preview: "hover-overlay",
          params: [
            { key: "speed", label: "Speed", value: 45 },
            { key: "direction", label: "Direction", value: 50 }
          ],
          css: (s, i, settings, theme) => `${s}{position:relative!important;overflow:hidden!important;} ${s}:before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(135deg,${hexToRgba(theme.primary,.18+i*.38)},${hexToRgba(theme.accent,.12+i*.24)});transform:translateX(${param(settings,"direction",50)>50?"100%":"-100%"});transition:transform ${(0.18+param(settings,"speed",45)*.01).toFixed(2)}s ease;} ${s}:hover:before{transform:translateX(0);} ${s}>*{position:relative;z-index:2;}`
        },
        {
          id: "hover-text-reveal",
          label: "Hover text reveal",
          description: "Reveal headings with underline and letter spacing.",
          intensityLabel: "Reveal",
          preview: "hover-text",
          params: [
            { key: "spacing", label: "Spacing", value: 42 }
          ],
          css: (s, i, settings, theme) => `${s} h1,${s} h2,${s} h3,${s} a{background-image:linear-gradient(${theme.accent},${theme.accent});background-repeat:no-repeat;background-position:0 100%;background-size:0 ${Math.round(2+i*8)}px;transition:background-size .28s ease,letter-spacing .28s ease,color .28s ease;} ${s}:hover h1,${s}:hover h2,${s}:hover h3,${s} a:hover{background-size:100% ${Math.round(2+i*8)}px;color:${theme.primary}!important;letter-spacing:${(param(settings,"spacing",42)*.012).toFixed(2)}em!important;}`
        }
      ]
    },
    {
      group: "ScrollFX",
      items: [
        {
          id: "scroll-timeline-basic",
          label: "Timeline transform",
          description: "Animate movement, opacity, scale, rotate and blur with scroll.",
          intensityLabel: "Distance",
          preview: "motion-reveal",
          params: [
            { key: "x", label: "X move", value: 50 },
            { key: "opacity", label: "Opacity", value: 100 },
            { key: "scale", label: "Scale", value: 50 },
            { key: "rotate", label: "Rotate", value: 50 },
            { key: "blur", label: "Blur", value: 0 }
          ],
          css: (s, i, settings) => `${s}{--spx:calc(var(--ssx-scroll-progress,0) * ${Math.round((param(settings,"x",50)-50)*4)}px);--spy:calc(var(--ssx-scroll-progress,0) * ${Math.round((i*220)-80)}px);transform:translate(var(--spx),var(--spy)) scale(calc(1 + (var(--ssx-scroll-progress,0) * ${(param(settings,"scale",50)-50)/120}))) rotate(calc(var(--ssx-scroll-progress,0) * ${Math.round((param(settings,"rotate",50)-50)*7.2)}deg))!important;opacity:calc(${Math.max(.05,param(settings,"opacity",100)/100)} - (var(--ssx-scroll-progress,0) * ${i*.45}))!important;filter:blur(calc(var(--ssx-scroll-progress,0) * ${Math.round(param(settings,"blur",0)*.25)}px))!important;transition:transform .08s linear,opacity .08s linear,filter .08s linear;}`
        },
        {
          id: "scroll-color-shift",
          label: "Dynamic colors",
          description: "Shift section and text colors while scrolling.",
          intensityLabel: "Blend",
          preview: "utility-bg",
          params: [
            { key: "text", label: "Text", value: 60 }
          ],
          css: (s, i, settings, theme) => `${s}{background:color-mix(in srgb,${theme.soft} calc(100% - (var(--ssx-scroll-progress,0) * ${Math.round(40+i*60)}%)),${theme.gradientB})!important;} ${s} h1,${s} h2,${s} h3,${s} p,${s} a{color:color-mix(in srgb,${theme.ink} calc(100% - (var(--ssx-scroll-progress,0) * ${Math.round(param(settings,"text",60))}%)),${theme.primary})!important;}`
        },
        {
          id: "scroll-indicator",
          label: "Scroll indicator",
          description: "Add a subtle down-scroll cue.",
          intensityLabel: "Size",
          preview: "motion-progress",
          globalOnly: true,
          params: [
            { key: "speed", label: "Speed", value: 48 }
          ],
          css: (_s, i, settings, theme) => `html:after{content:"";position:fixed;left:50%;bottom:${Math.round(18+i*28)}px;width:${Math.round(18+i*22)}px;height:${Math.round(18+i*22)}px;border-right:2px solid ${theme.primary};border-bottom:2px solid ${theme.primary};transform:translateX(-50%) rotate(45deg);z-index:2147483001;opacity:calc(.85 - var(--ssx-scroll-progress,0));animation:ssxCue ${Math.max(1.2,3-param(settings,"speed",48)*.018).toFixed(1)}s ease-in-out infinite;pointer-events:none;} @keyframes ssxCue{0%,100%{margin-bottom:0}50%{margin-bottom:12px}}`
        },
        {
          id: "scroll-horizontal-track",
          label: "Horizontal scroll track",
          description: "Move content horizontally as the page scrolls.",
          intensityLabel: "Distance",
          preview: "image-infinite",
          params: [
            { key: "reverse", label: "Reverse", value: 0 }
          ],
          css: (s, i, settings) => `${s}{overflow:hidden!important;} ${contentTargets(s)}{display:flex!important;gap:clamp(16px,4vw,56px)!important;will-change:transform;transform:translateX(calc(var(--ssx-scroll-progress,0) * ${param(settings,"reverse",0)>50?"":"-"}${Math.round(120+i*520)}px))!important;transition:transform .08s linear;}`
        }
      ]
    },
    {
      group: "Shapes",
      items: [
        {
          id: "shape-pills",
          label: "Animated pills",
          description: "Add soft decorative pill shapes.",
          intensityLabel: "Amount",
          preview: "shape-pills",
          params: [
            { key: "size", label: "Size", value: 48 },
            { key: "speed", label: "Speed", value: 35 }
          ],
          css: (s, i, settings, theme) => `${s}{position:relative;overflow:hidden;} ${s}:before,${s}:after{content:"";position:absolute;z-index:0;pointer-events:none;border-radius:999px;background:linear-gradient(135deg,${hexToRgba(theme.accent, 0.55)},${hexToRgba(theme.gradientB, 0.45)});filter:blur(${Math.round(i * 6)}px);animation:ssxPillFloat ${Math.max(6, 14 - param(settings, "speed", 35) * 0.08).toFixed(1)}s ease-in-out infinite;} ${s}:before{width:${Math.round(80 + param(settings, "size", 48) * 2.4)}px;height:${Math.round(28 + param(settings, "size", 48) * 0.72)}px;right:${Math.round(4 + i * 10)}%;top:${Math.round(8 + i * 10)}%;transform:rotate(-18deg);} ${s}:after{width:${Math.round(64 + param(settings, "size", 48) * 1.8)}px;height:${Math.round(24 + param(settings, "size", 48) * 0.6)}px;left:${Math.round(3 + i * 10)}%;bottom:${Math.round(6 + i * 12)}%;transform:rotate(12deg);animation-delay:-3s;} ${s}>*{position:relative;z-index:1;} @keyframes ssxPillFloat{0%,100%{transform:translateY(0) rotate(-12deg)}50%{transform:translateY(-18px) rotate(8deg)}}`
        },
        {
          id: "shape-glass-panel",
          label: "Glassmorphism panel",
          description: "Turn selected area into a glass surface.",
          intensityLabel: "Glass",
          preview: "shape-glass",
          params: [
            { key: "blur", label: "Blur", value: 70 },
            { key: "opacity", label: "Opacity", value: 52 }
          ],
          css: (s, i, settings, theme) => `${s}{background:${hexToRgba(theme.soft, 0.16 + param(settings, "opacity", 52) * 0.007)}!important;border:1px solid ${hexToRgba(theme.primary, 0.1 + i * 0.22)}!important;box-shadow:0 ${Math.round(12 + i * 24)}px ${Math.round(28 + i * 70)}px ${hexToRgba(theme.primary, 0.08 + i * 0.16)}!important;backdrop-filter:blur(${Math.round(5 + param(settings, "blur", 70) * 0.22)}px);-webkit-backdrop-filter:blur(${Math.round(5 + param(settings, "blur", 70) * 0.22)}px);border-radius:${Math.round(8 + i * 24)}px!important;}`
        },
        {
          id: "shape-blob-mask",
          label: "Blob image mask",
          description: "Mask images into organic shapes.",
          intensityLabel: "Shape",
          preview: "shape-blob",
          params: [
            { key: "radius", label: "Roundness", value: 62 }
          ],
          css: (s, i, settings) => {
            const r = Math.round(30 + param(settings, "radius", 62) * 0.45);
            return `${s} img{border-radius:${r}% ${Math.round(100 - r / 2)}% ${Math.round(40 + i * 30)}% ${Math.round(60 + i * 20)}%;transition:border-radius .35s ease,transform .35s ease;} ${s} img:hover{border-radius:${Math.round(95 - r / 3)}% ${r}% ${Math.round(85 - i * 20)}% ${Math.round(50 + i * 28)}%;}`;
          }
        },
        {
          id: "shape-soft-divider",
          label: "Soft divider",
          description: "Add an editorial section divider.",
          intensityLabel: "Height",
          preview: "shape-divider",
          params: [
            { key: "opacity", label: "Opacity", value: 45 }
          ],
          css: (s, i, settings, theme) => `${s}{position:relative;} ${s}:after{content:"";position:absolute;left:5%;right:5%;bottom:0;height:${Math.round(1 + i * 8)}px;background:linear-gradient(90deg,transparent,${hexToRgba(theme.primary, param(settings, "opacity", 45) / 100)},transparent);pointer-events:none;}`
        }
      ]
    },
    {
      group: "Utility",
      items: [
        {
          id: "utility-selected-outline",
          label: "Selected outline",
          description: "Show selected target clearly.",
          intensityLabel: "Visibility",
          preview: "utility-outline",
          css: (s, i) => `${s}{outline:${Math.round(2 + i * 4)}px solid #17451f!important;outline-offset:${Math.round(3 + i * 9)}px!important;box-shadow:0 0 0 ${Math.round(4 + i * 14)}px rgba(200,255,77,${0.12 + i * 0.22})!important;}`
        },
        {
          id: "utility-test-bg",
          label: "Test background",
          description: "Paint target for setup testing.",
          intensityLabel: "Color",
          preview: "utility-bg",
          css: (s, i) => `${s}{background:linear-gradient(135deg,rgba(248,255,230,${0.45 + i * 0.55}),rgba(238,252,248,${0.45 + i * 0.55}))!important;}`
        },
        {
          id: "utility-sticky",
          label: "Sticky target",
          description: "Pin selected target while scrolling.",
          intensityLabel: "Offset",
          preview: "utility-sticky",
          css: (s, i) => `@media(min-width:900px){${s}{position:sticky!important;top:${Math.round(42 + i * 120)}px;z-index:2;}}`
        },
        {
          id: "utility-hide-mobile",
          label: "Hide mobile",
          description: "Hide selected target on mobile.",
          intensityLabel: "Breakpoint",
          preview: "utility-mobile",
          css: (s, i) => `@media(max-width:${Math.round(520 + i * 360)}px){${s}{display:none!important;}}`
        }
      ]
    }
  ];

  const textEffectExtras = [
    {
      id: "txt-format-strike",
      label: "Text options · Strike",
      description: "Adds a clean editorial strike treatment to selected text.",
      intensityLabel: "Weight",
      preview: "type-highlight",
      css: (s, i, _settings, theme) => `${s} :is(p,h1,h2,h3,li){text-decoration:line-through;text-decoration-color:${theme.primary};text-decoration-thickness:${Math.round(1 + i * 5)}px;text-decoration-skip-ink:auto;}`
    },
    {
      id: "txt-color-primary",
      label: "Text options · Text color",
      description: "Applies the brand ink color to selected headings and paragraphs.",
      intensityLabel: "Mix",
      preview: "type-editorial",
      css: (s, i, _settings, theme) => `${s} :is(h1,h2,h3,p,li,a){color:${i > .5 ? theme.primary : theme.ink}!important;}`
    },
    {
      id: "txt-color-accent",
      label: "Text options · Accent color",
      description: "Uses the accent color for emphasis words and selected text.",
      intensityLabel: "Accent",
      preview: "type-gradient",
      css: (s, i, _settings, theme) => `${s} :is(strong,em,mark,.highlight){color:${i > .5 ? theme.accent : theme.primary}!important;font-style:normal;}`
    },
    {
      id: "txt-format-bold",
      label: "Formatting · Bold",
      description: "Makes selected text heavier without changing the layout.",
      intensityLabel: "Weight",
      preview: "type-editorial",
      css: (s, i) => `${textTargets(s)}{font-weight:${Math.round(620 + i * 280)}!important;}`
    },
    {
      id: "txt-format-italic",
      label: "Formatting · Italic",
      description: "Adds a soft editorial italic treatment.",
      intensityLabel: "Slant",
      preview: "type-luxury",
      css: (s) => `${textTargets(s)}{font-style:italic!important;}`
    },
    {
      id: "txt-format-uppercase",
      label: "Formatting · Uppercase",
      description: "Turns selected text into uppercase display copy.",
      intensityLabel: "Space",
      preview: "type-luxury",
      css: (s, i) => `${textTargets(s)}{text-transform:uppercase!important;letter-spacing:${(0.02 + i * .14).toFixed(2)}em!important;}`
    },
    {
      id: "txt-size-desktop",
      label: "Size · Desktop text",
      description: "Adjusts desktop text size for selected text blocks.",
      intensityLabel: "Size",
      preview: "type-editorial",
      css: (s, i) => `${paragraphTargets(s)}{font-size:clamp(16px,${(0.9 + i * 1.1).toFixed(2)}vw,${Math.round(18 + i * 18)}px)!important;} ${headingTargets(s)}{font-size:clamp(32px,${(2.4 + i * 4.8).toFixed(2)}vw,${Math.round(54 + i * 70)}px)!important;}`
    },
    {
      id: "txt-size-mobile",
      label: "Size · Mobile text",
      description: "Controls selected text size on mobile only.",
      intensityLabel: "Mobile",
      preview: "type-editorial",
      css: (s, i) => `@media(max-width:767px){${paragraphTargets(s)}{font-size:${Math.round(14 + i * 10)}px!important;} ${headingTargets(s)}{font-size:${Math.round(28 + i * 34)}px!important;}}`
    },
    {
      id: "txt-line-gap",
      label: "Line gap · Comfortable",
      description: "Adds more readable line spacing to selected text.",
      intensityLabel: "Gap",
      preview: "type-balance",
      css: (s, i) => `${s}:is(p,li),${s} :is(p,li){line-height:${(1.25 + i * .75).toFixed(2)}!important;} ${headingTargets(s)}{line-height:${(0.92 + i * .34).toFixed(2)}!important;}`
    },
    {
      id: "txt-align-left",
      label: "Align · Left",
      description: "Aligns selected text to the left.",
      intensityLabel: "Align",
      preview: "layout-split",
      css: (s) => `${textTargets(s)}{text-align:left!important;}`
    },
    {
      id: "txt-align-center",
      label: "Align · Center",
      description: "Centers selected headings and paragraphs.",
      intensityLabel: "Align",
      preview: "layout-frame",
      css: (s) => `${textTargets(s)}{text-align:center!important;margin-left:auto!important;margin-right:auto!important;}`
    },
    {
      id: "txt-align-right",
      label: "Align · Right",
      description: "Aligns selected text to the right.",
      intensityLabel: "Align",
      preview: "layout-split",
      css: (s) => `${textTargets(s)}{text-align:right!important;margin-left:auto!important;}`
    },
    {
      id: "txt-heading-gradient-live",
      label: "Heading · Moving gradient",
      description: "Animated gradient for hero headings and section titles.",
      intensityLabel: "Speed",
      preview: "type-gradient",
      params: [
        { key: "direction", label: "Gradient direction", value: 25 },
        { key: "type", label: "Gradient type", value: 0 }
      ],
      css: (s, i, settings, theme) => {
        const angle = Math.round(param(settings, "direction", 25) * 3.6);
        const radial = param(settings, "type", 0) > 50;
        const gradient = radial
          ? `radial-gradient(circle at 50% 50%,${theme.accent},${theme.primary},${theme.gradientA})`
          : `linear-gradient(${angle}deg,${theme.gradientA},${theme.primary},${theme.accent},${theme.gradientA})`;
        return `${headingTargets(s)}{background:${gradient};background-size:${radial ? "180% 180%" : "260% 100%"};-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:ssxTextGradient ${Math.max(3, 9 - i * 5).toFixed(1)}s ease infinite;}@keyframes ssxTextGradient{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`;
      }
    },
    {
      id: "txt-heading-underline",
      label: "Heading · Brush underline",
      description: "Adds a soft underline under headings without changing layout.",
      intensityLabel: "Ink",
      preview: "type-highlight",
      css: (s, i, _settings, theme) => `${headingTargets(s)}{display:inline;background-image:linear-gradient(transparent ${Math.round(78 - i * 22)}%,${hexToRgba(theme.accent,.38 + i * .48)} 0);background-repeat:no-repeat;background-size:100% 100%;}`
    },
    {
      id: "txt-heading-stroke",
      label: "Heading · Outline stroke",
      description: "Outlined display text for more editorial pages.",
      intensityLabel: "Stroke",
      preview: "type-outline",
      css: (s, i, _settings, theme) => `${s}:is(h1,h2),${s} :is(h1,h2){-webkit-text-stroke:${Math.round(1 + i * 3)}px ${theme.primary};color:${hexToRgba(theme.primary,.03 + i * .11)}!important;text-shadow:none!important;}`
    },
    {
      id: "txt-heading-fill",
      label: "Heading · Soft fill",
      description: "Adds a filled highlight shape behind large text.",
      intensityLabel: "Fill",
      preview: "type-highlight",
      css: (s, i, _settings, theme) => `${s}:is(h1,h2),${s} :is(h1,h2){display:inline;box-decoration-break:clone;-webkit-box-decoration-break:clone;background:${hexToRgba(theme.accent,.22 + i * .45)};color:${theme.primary}!important;padding:.02em .14em;border-radius:${Math.round(2 + i * 18)}px;}`
    },
    {
      id: "txt-paragraph-fill",
      label: "Paragraph · Fill",
      description: "Soft background for paragraphs and captions.",
      intensityLabel: "Softness",
      preview: "preset-cards",
      css: (s, i, _settings, theme) => `${s} p{display:inline;box-decoration-break:clone;-webkit-box-decoration-break:clone;background:${hexToRgba(theme.gradientB,.32 + i * .35)};padding:.08em .18em;border-radius:${Math.round(2+i*14)}px;}`
    },
    {
      id: "txt-paragraph-underline",
      label: "Paragraph · Underline",
      description: "Marker-style underline for body copy.",
      intensityLabel: "Line",
      preview: "type-highlight",
      css: (s, i, _settings, theme) => `${s} p{background-image:linear-gradient(transparent ${Math.round(86 - i * 22)}%,${hexToRgba(theme.accent,.30 + i * .48)} 0);background-repeat:no-repeat;background-size:100% 100%;}`
    },
    {
      id: "txt-paragraph-strong-fill",
      label: "Paragraph · Strong fill",
      description: "Highlights bold words inside paragraphs.",
      intensityLabel: "Ink",
      preview: "type-highlight",
      css: (s, i, _settings, theme) => `${s} p strong,${s} li strong{background:${hexToRgba(theme.accent,.42 + i * .48)};color:${theme.ink};padding:.02em .16em;border-radius:${Math.round(2+i*12)}px;}`
    },
    {
      id: "txt-link-line",
      label: "Links · Line",
      description: "Animated underline for text links.",
      intensityLabel: "Line",
      preview: "button-line",
      css: (s, i, _settings, theme) => `${s} a{background-image:linear-gradient(${theme.primary},${theme.primary});background-repeat:no-repeat;background-position:0 100%;background-size:100% ${Math.round(1+i*4)}px;text-decoration:none!important;transition:background-size .22s ease,color .22s ease;} ${s} a:hover{background-size:100% ${Math.round(5+i*10)}px;color:${theme.ink}!important;}`
    },
    {
      id: "txt-link-marker",
      label: "Links · Marker",
      description: "Highlighted link hover for editorial callouts.",
      intensityLabel: "Marker",
      preview: "type-highlight",
      css: (s, i, _settings, theme) => `${s} a{background:linear-gradient(transparent ${Math.round(76-i*18)}%,${hexToRgba(theme.accent,.36+i*.44)} 0);text-decoration:none!important;color:${theme.ink}!important;}`
    },
    {
      id: "txt-link-fill",
      label: "Links · Fill",
      description: "Turns links into small filled tags.",
      intensityLabel: "Round",
      preview: "button-radius",
      css: (s, i, _settings, theme) => `${s} a{display:inline-block;background:${theme.primary};color:${theme.soft}!important;text-decoration:none!important;padding:.08em .42em;border-radius:${Math.round(2+i*22)}px;transition:transform .18s ease;} ${s} a:hover{transform:translateY(-2px);}`
    },
    {
      id: "txt-link-clean",
      label: "Links · Clean",
      description: "Quiet premium link color and hover fade.",
      intensityLabel: "Calm",
      preview: "type-editorial",
      css: (s, i, _settings, theme) => `${s} a{color:${theme.primary}!important;text-decoration-thickness:${Math.round(1+i*2)}px;text-underline-offset:.2em;transition:opacity .2s ease,color .2s ease;} ${s} a:hover{color:${theme.ink}!important;opacity:${(0.72+i*.24).toFixed(2)};}`
    },
    {
      id: "txt-scroll-parallax",
      label: "Scroll · Parallax",
      description: "Light vertical movement when text enters view.",
      intensityLabel: "Move",
      preview: "motion-parallax",
      className: "ssx-parallax",
      params: [{ key: "distance", label: "Move distance", value: 70 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:.12;transform:translateY(${Math.round(38 + param(settings, "distance", 70) * 2.1)}px);}`
    },
    {
      id: "txt-scroll-left",
      label: "Scroll · Slide left",
      description: "Text slides in from the right edge.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 72 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;transform:translateX(${Math.round(72 + param(settings, "distance", 72) * 2.8)}px);}`
    },
    {
      id: "txt-scroll-right",
      label: "Scroll · Slide right",
      description: "Text slides in from the left edge.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 72 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;transform:translateX(-${Math.round(72 + param(settings, "distance", 72) * 2.8)}px);}`
    },
    {
      id: "txt-scroll-up",
      label: "Scroll · Slide up",
      description: "Clean upward reveal for text blocks.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 68 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;transform:translateY(${Math.round(64 + param(settings, "distance", 68) * 2.45)}px);}`
    },
    {
      id: "txt-scroll-down",
      label: "Scroll · Slide down",
      description: "Drops text gently into place on scroll.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 68 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;transform:translateY(-${Math.round(64 + param(settings, "distance", 68) * 2.45)}px);}`
    },
    {
      id: "txt-scroll-scale-up",
      label: "Scroll · Scale up",
      description: "Text grows into place softly.",
      intensityLabel: "Scale",
      preview: "motion-scale",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Scale amount", value: 55 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;transform-origin:center;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;transform:scale(${(1 - (0.12 + param(settings, "distance", 55) * .0038)).toFixed(2)});}`
    },
    {
      id: "txt-scroll-scale-down",
      label: "Scroll · Scale down",
      description: "Text settles down from a larger scale.",
      intensityLabel: "Scale",
      preview: "motion-scale",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Scale amount", value: 55 }],
      css: (s, i, settings) => `${revealTextTargets(s)}{transition:transform ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s cubic-bezier(.18,.82,.22,1),opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;transform-origin:center;will-change:transform,opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;transform:scale(${(1.12 + param(settings, "distance", 55) * .0048).toFixed(2)});}`
    },
    {
      id: "txt-scroll-fade",
      label: "Scroll · Fade in",
      description: "Simple fade-in for calmer websites.",
      intensityLabel: "Fade",
      preview: "motion-reveal",
      className: "ssx-reveal",
      css: (s, i) => `${revealTextTargets(s)}{transition:opacity ${Math.max(.42, 1.35 - i * .72).toFixed(2)}s ease;will-change:opacity;} ${hiddenRevealTextTargets(s)}{opacity:0;}`
    },
    {
      id: "txt-scroll-blur-reveal",
      label: "Scroll · Blur reveal",
      description: "Reveals each word from blur, inspired by Framer-style text motion.",
      intensityLabel: "Speed",
      preview: "motion-reveal",
      className: "ssx-word-blur-reveal",
      params: [
        { key: "distance", label: "Move distance", value: 42 },
        { key: "blur", label: "Blur amount", value: 62 },
        { key: "stagger", label: "Word delay", value: 40 }
      ],
      css: (s, i, settings) => {
        const duration = Math.max(.36, 1.05 - i * .46).toFixed(2);
        const distance = Math.round(10 + param(settings, "distance", 42) * 1.35);
        const blur = Math.round(3 + param(settings, "blur", 62) * .22);
        const stagger = Math.round(12 + param(settings, "stagger", 40) * .9);
        return `${wordRevealWordTargets(s)}{display:inline-block;opacity:0;filter:blur(${blur}px);transform:translateY(${distance}px);transition:opacity ${duration}s ease,filter ${duration}s ease,transform ${duration}s cubic-bezier(.18,.82,.22,1);transition-delay:calc(var(--ssx-word-index,0) * ${stagger}ms);will-change:opacity,filter,transform;} ${activeWordRevealWordTargets(s)}{opacity:1;filter:blur(0);transform:translateY(0);}`;
      }
    },
    {
      id: "txt-loop-pulse",
      label: "Loop · Pulse",
      description: "Continuous soft emphasis for key text.",
      intensityLabel: "Pulse",
      preview: "engagement-pulse",
      css: (s, i) => `${s}{animation:ssxTxtPulse ${Math.max(1.6,3.8-i*1.9).toFixed(1)}s ease-in-out infinite;}@keyframes ssxTxtPulse{0%,100%{transform:scale(1)}50%{transform:scale(${(1.01+i*.06).toFixed(2)})}}`
    },
    {
      id: "txt-loop-hover",
      label: "Loop · Float",
      description: "Subtle floating movement for decorative text.",
      intensityLabel: "Float",
      preview: "engagement-hover",
      css: (s, i) => `${s}{animation:ssxTxtFloat ${Math.max(2.4,5-i*2).toFixed(1)}s ease-in-out infinite;}@keyframes ssxTxtFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-${Math.round(2+i*10)}px)}}`
    },
    {
      id: "txt-loop-fade",
      label: "Loop · Fade",
      description: "Slow breathing opacity for soft sections.",
      intensityLabel: "Fade",
      preview: "motion-reveal",
      css: (s, i) => `${s}{animation:ssxTxtFade ${Math.max(2,5-i*2).toFixed(1)}s ease-in-out infinite;}@keyframes ssxTxtFade{0%,100%{opacity:1}50%{opacity:${(.45+i*.35).toFixed(2)}}}`
    },
    {
      id: "txt-loop-spin",
      label: "Loop · Spin",
      description: "Small rotation loop for badges or short labels.",
      intensityLabel: "Spin",
      preview: "motion-spin",
      css: (s, i) => `${s}{display:inline-block;animation:ssxTxtSpin ${Math.max(4,12-i*7).toFixed(1)}s linear infinite;}@keyframes ssxTxtSpin{to{transform:rotate(360deg)}}`
    },
    {
      id: "txt-loop-shake",
      label: "Loop · Shake",
      description: "A tiny shake for announcements.",
      intensityLabel: "Shake",
      preview: "engagement-wobble",
      css: (s, i) => `${s}{animation:ssxTxtShake ${Math.max(.7,1.8-i*.8).toFixed(1)}s ease-in-out infinite;}@keyframes ssxTxtShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-${Math.round(1+i*5)}px)}75%{transform:translateX(${Math.round(1+i*5)}px)}}`
    },
    {
      id: "txt-loop-wiggle",
      label: "Loop · Wiggle",
      description: "Playful rotation loop for short text.",
      intensityLabel: "Wiggle",
      preview: "engagement-wobble",
      css: (s, i) => `${s}{display:inline-block;animation:ssxTxtWiggle ${Math.max(1.2,3-i*1.3).toFixed(1)}s ease-in-out infinite;}@keyframes ssxTxtWiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-${Math.round(1+i*5)}deg)}75%{transform:rotate(${Math.round(1+i*5)}deg)}}`
    },
    {
      id: "txt-hover-scale",
      label: "Hover · Scale",
      description: "Text scales on hover.",
      intensityLabel: "Scale",
      preview: "hover-scale",
      css: (s, i) => `${s}{display:inline-block;transition:transform .22s ease;} ${s}:hover{transform:scale(${(1.02+i*.12).toFixed(2)});}`
    },
    {
      id: "txt-hover-up",
      label: "Hover · Lift up",
      description: "Small upward hover movement.",
      intensityLabel: "Lift",
      preview: "button-lift",
      css: (s, i) => `${s}{display:inline-block;transition:transform .22s ease;} ${s}:hover{transform:translateY(-${Math.round(2+i*12)}px);}`
    },
    {
      id: "txt-hover-pop",
      label: "Hover · Pop",
      description: "A snappier hover pop for links and labels.",
      intensityLabel: "Pop",
      preview: "engagement-jelly",
      css: (s, i) => `${s}{display:inline-block;transition:transform .2s cubic-bezier(.2,1.6,.3,1);} ${s}:hover{transform:scale(${(1.04+i*.15).toFixed(2)}) rotate(-${Math.round(i*3)}deg);}`
    },
    {
      id: "txt-hover-tilt",
      label: "Hover · Tilt",
      description: "Small tilt interaction for headings.",
      intensityLabel: "Tilt",
      preview: "type-3d",
      css: (s, i) => `${s}{display:inline-block;transition:transform .22s ease;} ${s}:hover{transform:perspective(700px) rotateX(${Math.round(2+i*10)}deg) rotateY(-${Math.round(2+i*10)}deg);}`
    },
    {
      id: "txt-hover-fade",
      label: "Hover · Fade",
      description: "Fades text on hover.",
      intensityLabel: "Fade",
      preview: "motion-reveal",
      css: (s, i) => `${s}{transition:opacity .2s ease;} ${s}:hover{opacity:${(.38+i*.45).toFixed(2)};}`
    },
    {
      id: "txt-hover-flip",
      label: "Hover · Flip",
      description: "3D flip hover for short headings.",
      intensityLabel: "Flip",
      preview: "type-3d",
      css: (s, i) => `${s}{display:inline-block;transform-style:preserve-3d;transition:transform .35s ease;} ${s}:hover{transform:perspective(700px) rotateX(${Math.round(45+i*135)}deg);}`
    },
    {
      id: "txt-block-opacity",
      label: "Block · Opacity",
      description: "Control selected text block opacity.",
      intensityLabel: "Opacity",
      preview: "utility-mobile",
      css: (s, i) => `${s}{opacity:${(.18+i*.82).toFixed(2)};}`
    },
    {
      id: "txt-block-rotate",
      label: "Block · Rotate",
      description: "Rotate selected text block slightly.",
      intensityLabel: "Rotate",
      preview: "type-3d",
      css: (s, i) => `${s}{transform:rotate(${Math.round((i-.5)*18)}deg);}`
    },
    {
      id: "txt-block-blur",
      label: "Block · Blur",
      description: "Adds controlled blur for atmospheric text.",
      intensityLabel: "Blur",
      preview: "motion-reveal",
      css: (s, i) => `${s}{filter:blur(${Math.round(i*8)}px);}`
    },
    {
      id: "txt-block-background",
      label: "Block · Background",
      description: "Adds a soft panel behind selected text.",
      intensityLabel: "Soft",
      preview: "preset-cards",
      css: (s, i, _settings, theme) => `${s}{background:${hexToRgba(theme.gradientB,.30+i*.48)}!important;border-radius:${Math.round(8+i*24)}px!important;padding:clamp(14px,3vw,34px)!important;}`
    },
    {
      id: "txt-block-corners",
      label: "Block · Softer corners",
      description: "Rounds the selected text block from subtle to pill-soft.",
      intensityLabel: "Corners",
      preview: "button-radius",
      css: (s, i) => `${s}{border-radius:${Math.round(4 + i * 44)}px!important;overflow:hidden!important;}`
    },
    {
      id: "txt-block-border",
      label: "Block · Border",
      description: "Adds a refined border to selected text block.",
      intensityLabel: "Line",
      preview: "layout-frame",
      css: (s, i, _settings, theme) => `${s}{border:${Math.round(1+i*3)}px solid ${hexToRgba(theme.primary,.20+i*.45)}!important;border-radius:${Math.round(6+i*22)}px!important;padding:clamp(14px,3vw,30px)!important;}`
    },
    {
      id: "txt-block-shadow",
      label: "Block · Shadow",
      description: "Adds premium depth to selected text block.",
      intensityLabel: "Depth",
      preview: "image-shadow",
      css: (s, i, _settings, theme) => `${s}{box-shadow:0 ${Math.round(8+i*28)}px ${Math.round(18+i*56)}px ${hexToRgba(theme.primary,.08+i*.16)}!important;border-radius:${Math.round(6+i*20)}px!important;}`
    },
    {
      id: "txt-block-margin",
      label: "Block · Margin",
      description: "Adds breathing space around selected text.",
      intensityLabel: "Space",
      preview: "layout-spacing",
      css: (s, i) => `${s}{margin-top:${Math.round(8+i*72)}px!important;margin-bottom:${Math.round(8+i*72)}px!important;}`
    },
    {
      id: "txt-block-margin-x",
      label: "Block · Side margin",
      description: "Adds left and right breathing space to selected text.",
      intensityLabel: "Sides",
      preview: "layout-frame",
      css: (s, i) => `${s}{margin-left:${Math.round(i*80)}px!important;margin-right:${Math.round(i*80)}px!important;max-width:calc(100% - ${Math.round(i*160)}px)!important;}`
    },
    {
      id: "txt-cursor-emoji",
      label: "Cursor · Emoji pointer",
      description: "Shows a playful emoji cursor over selected text.",
      intensityLabel: "Size",
      preview: "cursor-dot",
      css: (s) => `${s},${s} *{cursor:none!important;}`
    },
    {
      id: "txt-cursor-large",
      label: "Cursor · Large pointer",
      description: "Uses a larger custom pointer over selected text.",
      intensityLabel: "Size",
      preview: "cursor-dot",
      css: (s) => `${s},${s} *{cursor:none!important;}`
    },
    {
      id: "txt-cursor-hide",
      label: "Cursor · Hide default",
      description: "Hides the default cursor over selected text.",
      intensityLabel: "Area",
      preview: "cursor-dot",
      css: (s) => `${s},${s} *{cursor:none!important;}`
    }
  ];

  const imageEffectExtras = [
    {
      id: "img-style-shadow",
      label: "Image styles · Shadow",
      description: "Adds a soft editorial shadow to selected images.",
      intensityLabel: "Depth",
      preview: "image-shadow",
      css: (s, i, _settings, theme) => `${mediaTargets(s)}{box-shadow:0 ${Math.round(12+i*28)}px ${Math.round(24+i*58)}px ${hexToRgba(theme.primary,.08+i*.18)}!important;}`
    },
    {
      id: "img-style-solid-shadow",
      label: "Image styles · Solid shadow",
      description: "Creates a bold offset shadow for graphic layouts.",
      intensityLabel: "Offset",
      preview: "image-shadow",
      params: [{ key: "offset", label: "Shadow offset", value: 44 }],
      css: (s, i, settings, theme) => `${mediaTargets(s)}{box-shadow:${Math.round(8+param(settings,"offset",44)*.34)}px ${Math.round(8+param(settings,"offset",44)*.34)}px 0 ${theme.primary}!important;}`
    },
    {
      id: "img-style-border",
      label: "Image styles · Border",
      description: "Adds a clean brand border around images.",
      intensityLabel: "Width",
      preview: "layout-frame",
      css: (s, i, _settings, theme) => `${mediaTargets(s)}{border:${Math.round(1+i*6)}px solid ${theme.primary}!important;box-sizing:border-box!important;}`
    },
    {
      id: "img-style-3d",
      label: "Image styles · 3D",
      description: "Adds a subtle perspective lift to photos.",
      intensityLabel: "Tilt",
      preview: "type-3d",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{perspective:900px!important;} ${mediaTargets(s)}{transform:rotateX(${Math.round(1+i*8)}deg) rotateY(-${Math.round(1+i*8)}deg)!important;box-shadow:${Math.round(8+i*22)}px ${Math.round(10+i*28)}px 0 ${hexToRgba(theme.accent,.45)}!important;}`
    },
    {
      id: "img-style-split",
      label: "Image styles · Split",
      description: "Creates a layered split-card image treatment.",
      intensityLabel: "Split",
      preview: "image-curtain",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;isolation:isolate!important;} ${mediaWrappers(s)}:before{content:"";position:absolute;inset:${Math.round(8+i*18)}px -${Math.round(6+i*18)}px -${Math.round(6+i*18)}px ${Math.round(8+i*18)}px;background:${theme.accent};z-index:-1;border-radius:inherit;}`
    },
    {
      id: "img-style-arrow",
      label: "Image styles · Arrow",
      description: "Adds a small directional marker to image cards.",
      intensityLabel: "Size",
      preview: "button-arrow",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;} ${mediaWrappers(s)}:after{content:"↗";position:absolute;right:${Math.round(10+i*16)}px;bottom:${Math.round(10+i*16)}px;width:${Math.round(34+i*24)}px;height:${Math.round(34+i*24)}px;border-radius:999px;background:${theme.accent};color:${theme.ink};display:grid;place-items:center;font-weight:900;font-size:${Math.round(18+i*12)}px;pointer-events:none;}`
    },
    {
      id: "img-click-overlay",
      label: "Image click indicator · Overlay",
      description: "Adds a clear hover overlay to show images are clickable.",
      intensityLabel: "Opacity",
      preview: "hover-overlay",
      css: (s, i, settings, theme) => `${mediaWrappers(s)}{position:relative!important;overflow:hidden!important;} ${mediaWrappers(s)}:after{content:"${escapeCssString(settings.customText || "View")}";position:absolute;inset:0;background:${hexToRgba(theme.primary,.18+i*.46)};color:${theme.soft};display:grid;place-items:center;font-weight:900;font-size:clamp(18px,3vw,34px);opacity:0;transition:opacity .22s ease;pointer-events:none;} ${mediaWrappers(s)}:hover:after{opacity:1;}`
    },
    {
      id: "img-click-pill",
      label: "Image click indicator · Pill",
      description: "Shows a small custom label when hovering images.",
      intensityLabel: "Size",
      preview: "button-radius",
      css: (s, i, settings, theme) => `${mediaWrappers(s)}{position:relative!important;} ${mediaWrappers(s)}:after{content:"${escapeCssString(settings.customText || "Open")}";position:absolute;left:14px;bottom:14px;background:${theme.accent};color:${theme.ink};border-radius:999px;padding:${Math.round(6+i*6)}px ${Math.round(12+i*14)}px;font-weight:900;font-size:${Math.round(12+i*8)}px;opacity:0;transform:translateY(8px);transition:opacity .22s ease,transform .22s ease;pointer-events:none;} ${mediaWrappers(s)}:hover:after{opacity:1;transform:translateY(0);}`
    },
    {
      id: "img-shape-parallel-1",
      label: "Animated image shapes · Parallel 1",
      description: "Adds sliding parallel shape accents around images.",
      intensityLabel: "Speed",
      preview: "shape-pills",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;overflow:hidden!important;} ${mediaWrappers(s)}:before{content:"";position:absolute;inset:auto auto ${Math.round(10+i*22)}px ${Math.round(10+i*22)}px;width:${Math.round(70+i*80)}px;height:${Math.round(18+i*22)}px;background:${theme.accent};transform:skewX(-18deg);animation:ssxImgParallel ${Math.max(2,6-i*3).toFixed(1)}s ease-in-out infinite;pointer-events:none;}@keyframes ssxImgParallel{50%{transform:translateX(18px) skewX(-18deg)}}`
    },
    {
      id: "img-shape-parallel-2",
      label: "Animated image shapes · Parallel 2",
      description: "Adds double moving parallel accents.",
      intensityLabel: "Speed",
      preview: "shape-pills",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;overflow:hidden!important;} ${mediaWrappers(s)}:before,${mediaWrappers(s)}:after{content:"";position:absolute;right:${Math.round(10+i*20)}px;width:${Math.round(54+i*70)}px;height:${Math.round(12+i*18)}px;background:${theme.accent};transform:skewX(-18deg);animation:ssxImgParallel ${Math.max(2,6-i*3).toFixed(1)}s ease-in-out infinite;pointer-events:none;} ${mediaWrappers(s)}:before{top:18px;} ${mediaWrappers(s)}:after{top:44px;animation-delay:-1s;}@keyframes ssxImgParallel{50%{transform:translateX(-18px) skewX(-18deg)}}`
    },
    {
      id: "img-shape-parallel-3",
      label: "Animated image shapes · Parallel 3",
      description: "Adds a stronger three-line editorial motion accent.",
      intensityLabel: "Speed",
      preview: "shape-pills",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;overflow:hidden!important;background:${theme.soft};} ${mediaWrappers(s)}:after{content:"";position:absolute;left:12px;right:12px;bottom:16px;height:${Math.round(5+i*10)}px;background:${theme.accent};box-shadow:0 -${Math.round(12+i*12)}px 0 ${theme.primary},0 -${Math.round(24+i*24)}px 0 ${hexToRgba(theme.primary,.55)};animation:ssxImgBars ${Math.max(2,6-i*3).toFixed(1)}s ease-in-out infinite;pointer-events:none;}@keyframes ssxImgBars{50%{transform:translateY(-8px)}}`
    },
    {
      id: "img-shape-arrow",
      label: "Animated image shapes · Arrow",
      description: "Animated arrow badge for image direction.",
      intensityLabel: "Speed",
      preview: "button-arrow",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;} ${mediaWrappers(s)}:after{content:"→";position:absolute;right:16px;top:16px;color:${theme.ink};background:${theme.accent};border-radius:999px;width:${Math.round(34+i*28)}px;height:${Math.round(34+i*28)}px;display:grid;place-items:center;font-weight:900;animation:ssxImgArrow ${Math.max(1.2,3.8-i*2).toFixed(1)}s ease-in-out infinite;pointer-events:none;}@keyframes ssxImgArrow{50%{transform:translateX(8px)}}`
    },
    {
      id: "img-shape-square",
      label: "Animated image shapes · Square",
      description: "Adds a moving square frame accent.",
      intensityLabel: "Speed",
      preview: "shape-divider",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;} ${mediaWrappers(s)}:after{content:"";position:absolute;right:12px;bottom:12px;width:${Math.round(30+i*48)}px;height:${Math.round(30+i*48)}px;border:${Math.round(2+i*3)}px solid ${theme.accent};animation:ssxImgSpin ${Math.max(4,12-i*7).toFixed(1)}s linear infinite;pointer-events:none;}@keyframes ssxImgSpin{to{transform:rotate(360deg)}}`
    },
    {
      id: "img-shape-spotlight",
      label: "Animated image shapes · Spotlight",
      description: "Adds a soft animated spotlight over images.",
      intensityLabel: "Glow",
      preview: "shape-glass",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;overflow:hidden!important;} ${mediaWrappers(s)}:after{content:"";position:absolute;inset:-30%;background:radial-gradient(circle at 35% 35%,${hexToRgba(theme.accent,.18+i*.42)},transparent 36%);animation:ssxImgSpot ${Math.max(4,12-i*6).toFixed(1)}s ease-in-out infinite;pointer-events:none;}@keyframes ssxImgSpot{50%{transform:translate(16%,-10%)}}`
    },
    {
      id: "img-shape-triangle",
      label: "Animated image shapes · Triangle",
      description: "Adds a triangular accent to image compositions.",
      intensityLabel: "Speed",
      preview: "shape-divider",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;} ${mediaWrappers(s)}:after{content:"";position:absolute;left:18px;top:18px;border-left:${Math.round(22+i*38)}px solid transparent;border-right:${Math.round(22+i*38)}px solid transparent;border-bottom:${Math.round(38+i*56)}px solid ${hexToRgba(theme.accent,.78)};animation:ssxImgFloat ${Math.max(2.5,7-i*3).toFixed(1)}s ease-in-out infinite;pointer-events:none;}@keyframes ssxImgFloat{50%{transform:translateY(-10px) rotate(8deg)}}`
    },
    {
      id: "img-shape-circle",
      label: "Animated image shapes · Circle",
      description: "Adds a floating circular image accent.",
      intensityLabel: "Speed",
      preview: "cursor-dot",
      css: (s, i, _settings, theme) => `${mediaWrappers(s)}{position:relative!important;} ${mediaWrappers(s)}:after{content:"";position:absolute;right:18px;bottom:18px;width:${Math.round(32+i*58)}px;height:${Math.round(32+i*58)}px;border-radius:999px;background:${hexToRgba(theme.accent,.70)};animation:ssxImgFloat ${Math.max(2.5,7-i*3).toFixed(1)}s ease-in-out infinite;pointer-events:none;}@keyframes ssxImgFloat{50%{transform:translateY(-12px)}}`
    },
    {
      id: "img-scroll-parallax",
      label: "Animate on scroll · Parallax",
      description: "Images move softly as they enter the viewport.",
      intensityLabel: "Move",
      preview: "motion-parallax",
      className: "ssx-parallax",
      params: [{ key: "distance", label: "Move distance", value: 72 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease,opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-parallax:not(.ssx-in){opacity:.2;transform:translateY(${Math.round(20+param(settings,"distance",72)*1.45)}px);}`
    },
    {
      id: "img-scroll-left",
      label: "Animate on scroll · Slide left",
      description: "Image slides in from the right.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 72 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:translateX(${Math.round(34+param(settings,"distance",72)*1.9)}px);}`
    },
    {
      id: "img-scroll-right",
      label: "Animate on scroll · Slide right",
      description: "Image slides in from the left.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 72 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:translateX(-${Math.round(34+param(settings,"distance",72)*1.9)}px);}`
    },
    {
      id: "img-scroll-up",
      label: "Animate on scroll · Slide up",
      description: "Image slides upward into place.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 68 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:translateY(${Math.round(28+param(settings,"distance",68)*1.55)}px);}`
    },
    {
      id: "img-scroll-down",
      label: "Animate on scroll · Slide down",
      description: "Image drops softly into place.",
      intensityLabel: "Move",
      preview: "motion-reveal",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Move distance", value: 68 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:translateY(-${Math.round(28+param(settings,"distance",68)*1.55)}px);}`
    },
    {
      id: "img-scroll-scale-up",
      label: "Animate on scroll · Scale up",
      description: "Image grows into view.",
      intensityLabel: "Scale",
      preview: "motion-scale",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Scale amount", value: 55 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:scale(${(1-(.08+param(settings,"distance",55)*.0025)).toFixed(2)});}`
    },
    {
      id: "img-scroll-scale-down",
      label: "Animate on scroll · Scale down",
      description: "Image settles from a larger scale.",
      intensityLabel: "Scale",
      preview: "motion-scale",
      className: "ssx-reveal",
      params: [{ key: "distance", label: "Scale amount", value: 55 }],
      css: (s, i, settings) => `${s}{transition:transform ${Math.max(.28,1.15-i*.72).toFixed(2)}s cubic-bezier(.2,.8,.2,1),opacity ${Math.max(.28,1.15-i*.72).toFixed(2)}s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:scale(${(1.06+param(settings,"distance",55)*.003).toFixed(2)});}`
    },
    {
      id: "img-scroll-flip",
      label: "Animate on scroll · Flip",
      description: "Image flips into view.",
      intensityLabel: "Flip",
      preview: "type-3d",
      className: "ssx-reveal",
      css: (s, i) => `${s}{transition:transform ${Math.max(.35,1.2-i*.7).toFixed(2)}s ease,opacity .45s ease;transform-style:preserve-3d;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:perspective(900px) rotateY(${Math.round(35+i*85)}deg);}`
    },
    {
      id: "img-scroll-focus",
      label: "Animate on scroll · Focus",
      description: "Image sharpens into view.",
      intensityLabel: "Focus",
      preview: "motion-reveal",
      className: "ssx-reveal",
      css: (s, i) => `${s}{transition:filter ${Math.max(.35,1.1-i*.6).toFixed(2)}s ease,opacity .45s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:.25;filter:blur(${Math.round(4+i*10)}px);}`
    },
    {
      id: "img-scroll-spin",
      label: "Animate on scroll · Spin",
      description: "Image rotates into place.",
      intensityLabel: "Spin",
      preview: "motion-spin",
      className: "ssx-reveal",
      css: (s, i) => `${s}{transition:transform ${Math.max(.35,1.2-i*.7).toFixed(2)}s ease,opacity .45s ease;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:rotate(${Math.round(25+i*140)}deg) scale(.92);}`
    },
    {
      id: "img-scroll-3d",
      label: "Animate on scroll · 3D",
      description: "Image enters with a 3D tilt.",
      intensityLabel: "Depth",
      preview: "type-3d",
      className: "ssx-reveal",
      css: (s, i) => `${s}{transition:transform ${Math.max(.35,1.2-i*.7).toFixed(2)}s ease,opacity .45s ease;transform-style:preserve-3d;} ${s}.ssx-reveal:not(.ssx-in){opacity:0;transform:perspective(900px) rotateX(${Math.round(15+i*45)}deg) translateY(40px);}`
    },
    {
      id: "img-loop-pulse",
      label: "Loop animations · Pulse",
      description: "Continuous soft scale loop for images.",
      intensityLabel: "Pulse",
      preview: "engagement-pulse",
      css: (s, i) => `${mediaTargets(s)}{animation:ssxImgPulse ${Math.max(1.8,4-i*2).toFixed(1)}s ease-in-out infinite;}@keyframes ssxImgPulse{50%{transform:scale(${(1.01+i*.06).toFixed(2)})}}`
    },
    {
      id: "img-loop-hover",
      label: "Loop animations · Hover",
      description: "Subtle floating image loop.",
      intensityLabel: "Hover",
      preview: "engagement-hover",
      css: (s, i) => `${mediaTargets(s)}{animation:ssxImgHover ${Math.max(2.4,5-i*2).toFixed(1)}s ease-in-out infinite;}@keyframes ssxImgHover{50%{transform:translateY(-${Math.round(2+i*10)}px)}}`
    },
    {
      id: "img-loop-fade",
      label: "Loop animations · Fade",
      description: "Breathing opacity for softer galleries.",
      intensityLabel: "Fade",
      preview: "motion-reveal",
      css: (s, i) => `${mediaTargets(s)}{animation:ssxImgFade ${Math.max(2,5-i*2).toFixed(1)}s ease-in-out infinite;}@keyframes ssxImgFade{50%{opacity:${(.45+i*.35).toFixed(2)}}}`
    },
    {
      id: "img-loop-spin",
      label: "Loop animations · Spin",
      description: "Slow image spin for graphic elements.",
      intensityLabel: "Spin",
      preview: "motion-spin",
      css: (s, i) => `${mediaTargets(s)}{animation:ssxImgSpin ${Math.max(5,16-i*9).toFixed(1)}s linear infinite;}@keyframes ssxImgSpin{to{transform:rotate(360deg)}}`
    },
    {
      id: "img-loop-shake",
      label: "Loop animations · Shake",
      description: "Small shake for playful image moments.",
      intensityLabel: "Shake",
      preview: "engagement-wobble",
      css: (s, i) => `${mediaTargets(s)}{animation:ssxImgShake ${Math.max(.8,1.9-i*.8).toFixed(1)}s ease-in-out infinite;}@keyframes ssxImgShake{25%{transform:translateX(-${Math.round(1+i*5)}px)}75%{transform:translateX(${Math.round(1+i*5)}px)}}`
    },
    {
      id: "img-loop-wiggle",
      label: "Loop animations · Wiggle",
      description: "Playful rotating image loop.",
      intensityLabel: "Wiggle",
      preview: "engagement-wobble",
      css: (s, i) => `${mediaTargets(s)}{animation:ssxImgWiggle ${Math.max(1.2,3-i*1.3).toFixed(1)}s ease-in-out infinite;}@keyframes ssxImgWiggle{25%{transform:rotate(-${Math.round(1+i*5)}deg)}75%{transform:rotate(${Math.round(1+i*5)}deg)}}`
    },
    {
      id: "img-hover-scale",
      label: "Animate on hover · Scale",
      description: "Image scales on hover.",
      intensityLabel: "Scale",
      preview: "hover-scale",
      css: (s, i) => `${mediaWrappers(s)}{overflow:hidden!important;} ${mediaTargets(s)}{transition:transform .24s ease!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{transform:scale(${(1.03+i*.13).toFixed(2)})!important;}`
    },
    {
      id: "img-hover-up",
      label: "Animate on hover · Up",
      description: "Image lifts upward on hover.",
      intensityLabel: "Lift",
      preview: "button-lift",
      css: (s, i) => `${mediaTargets(s)}{transition:transform .24s ease!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{transform:translateY(-${Math.round(3+i*14)}px)!important;}`
    },
    {
      id: "img-hover-pop",
      label: "Animate on hover · Pop",
      description: "Snappy hover pop for images.",
      intensityLabel: "Pop",
      preview: "engagement-jelly",
      css: (s, i) => `${mediaTargets(s)}{transition:transform .22s cubic-bezier(.2,1.6,.3,1)!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{transform:scale(${(1.04+i*.14).toFixed(2)}) rotate(-${Math.round(i*3)}deg)!important;}`
    },
    {
      id: "img-hover-tilt",
      label: "Animate on hover · Tilt",
      description: "3D tilt interaction for photos.",
      intensityLabel: "Tilt",
      preview: "type-3d",
      css: (s, i) => `${mediaWrappers(s)}{perspective:900px!important;} ${mediaTargets(s)}{transition:transform .24s ease!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{transform:rotateX(${Math.round(2+i*10)}deg) rotateY(-${Math.round(2+i*10)}deg)!important;}`
    },
    {
      id: "img-hover-fade",
      label: "Animate on hover · Fade",
      description: "Image fades on hover.",
      intensityLabel: "Fade",
      preview: "motion-reveal",
      css: (s, i) => `${mediaTargets(s)}{transition:opacity .2s ease!important;} ${mediaWrappers(s)}:hover img,${s}:hover img{opacity:${(.38+i*.45).toFixed(2)}!important;}`
    },
    {
      id: "img-hover-flip",
      label: "Animate on hover · Flip",
      description: "3D flip on hover.",
      intensityLabel: "Flip",
      preview: "type-3d",
      css: (s, i) => `${mediaWrappers(s)}{perspective:900px!important;} ${mediaTargets(s)}{transition:transform .36s ease!important;transform-style:preserve-3d;} ${mediaWrappers(s)}:hover img,${s}:hover img{transform:rotateY(${Math.round(45+i*135)}deg)!important;}`
    },
    {
      id: "img-block-opacity",
      label: "Block styling · Opacity",
      description: "Controls image block opacity.",
      intensityLabel: "Opacity",
      preview: "utility-mobile",
      css: (s, i) => `${s}{opacity:${(.18+i*.82).toFixed(2)};}`
    },
    {
      id: "img-block-rotate",
      label: "Block styling · Rotate",
      description: "Rotates image block slightly.",
      intensityLabel: "Rotate",
      preview: "type-3d",
      css: (s, i) => `${s}{transform:rotate(${Math.round((i-.5)*18)}deg);}`
    },
    {
      id: "img-block-blur",
      label: "Block styling · Blur",
      description: "Adds controlled blur to image block.",
      intensityLabel: "Blur",
      preview: "motion-reveal",
      css: (s, i) => `${s}{filter:blur(${Math.round(i*8)}px);}`
    },
    {
      id: "img-block-background",
      label: "Block styling · Background",
      description: "Adds a soft background behind images.",
      intensityLabel: "Soft",
      preview: "preset-cards",
      css: (s, i, _settings, theme) => `${s}{background:${hexToRgba(theme.gradientB,.30+i*.48)}!important;border-radius:${Math.round(8+i*24)}px!important;padding:clamp(14px,3vw,34px)!important;}`
    },
    {
      id: "img-block-border",
      label: "Block styling · Border",
      description: "Adds a border around image blocks.",
      intensityLabel: "Line",
      preview: "layout-frame",
      css: (s, i, _settings, theme) => `${s}{border:${Math.round(1+i*4)}px solid ${hexToRgba(theme.primary,.22+i*.48)}!important;border-radius:${Math.round(6+i*22)}px!important;padding:clamp(8px,2vw,22px)!important;}`
    },
    {
      id: "img-block-shadow",
      label: "Block styling · Shadow",
      description: "Adds depth around image blocks.",
      intensityLabel: "Depth",
      preview: "image-shadow",
      css: (s, i, _settings, theme) => `${s}{box-shadow:0 ${Math.round(8+i*28)}px ${Math.round(18+i*56)}px ${hexToRgba(theme.primary,.08+i*.16)}!important;border-radius:${Math.round(6+i*20)}px!important;}`
    },
    {
      id: "img-visibility-mobile",
      label: "Block visibility · Hide on mobile",
      description: "Hides selected image blocks on mobile.",
      intensityLabel: "Mobile",
      preview: "utility-mobile",
      css: (s) => `@media(max-width:767px){${s}{display:none!important;}}`
    },
    {
      id: "img-visibility-desktop",
      label: "Block visibility · Hide on desktop",
      description: "Hides selected image blocks on desktop.",
      intensityLabel: "Desktop",
      preview: "utility-mobile",
      css: (s) => `@media(min-width:768px){${s}{display:none!important;}}`
    },
    {
      id: "img-cursor-emoji",
      label: "Cursor on hover · Emoji pointer",
      description: "Shows a playful cursor over selected images.",
      intensityLabel: "Size",
      preview: "cursor-dot",
      css: (s) => `${s},${s} *{cursor:none!important;}`
    },
    {
      id: "img-cursor-large",
      label: "Cursor on hover · Large pointer",
      description: "Uses a larger custom pointer over selected images.",
      intensityLabel: "Size",
      preview: "cursor-dot",
      css: (s) => `${s},${s} *{cursor:none!important;}`
    },
    {
      id: "img-reveal-hover",
      label: "Reveal on hover · Reveal",
      description: "Shows hidden image content on hover.",
      intensityLabel: "Speed",
      preview: "hover-overlay",
      css: (s, i, _settings, theme) => `${s}{position:relative!important;overflow:hidden!important;} ${mediaTargets(s)}{transition:filter ${Math.max(.18,.65-i*.35).toFixed(2)}s ease,transform ${Math.max(.18,.65-i*.35).toFixed(2)}s ease!important;filter:brightness(.82)!important;} ${s}:hover img{filter:brightness(1)!important;transform:scale(1.04)!important;} ${s}:after{content:"";position:absolute;inset:0;background:${hexToRgba(theme.primary,.16+i*.28)};opacity:1;transition:opacity ${Math.max(.18,.65-i*.35).toFixed(2)}s ease;pointer-events:none;} ${s}:hover:after{opacity:0;}`
    }
  ];

  const allEffects = effectCatalog.flatMap((group) => group.items.map((effect) => ({ ...effect, group: group.group }))).concat(textEffectExtras.map((effect) => ({ ...effect, group: "Text" })), imageEffectExtras.map((effect) => ({ ...effect, group: "Image" })));
  const effectById = new Map(allEffects.map((effect) => [effect.id, effect]));
  const featureLibrary = [
    { id: "text-suite", title: "Text", target: ["text", "section", "page", "button", "image"], icon: "T", description: "Typography, links, motion, hover, block and cursor tools for selected text.", options: textEffectExtras.map((effect) => effect.id) },
    { id: "image-suite", title: "Image", target: ["image", "section", "page"], icon: "▧", description: "Image styles, shapes, motion, hover, visibility and cursor tools.", options: imageEffectExtras.map((effect) => effect.id) }
  ];
  const textSections = [
    { id: "text-options", icon: "T", title: "Text options", description: "Base color, formatting, size, alignment and rhythm.", options: ["txt-color-primary", "txt-color-accent", "txt-format-strike", "txt-format-bold", "txt-format-italic", "txt-format-uppercase", "txt-size-desktop", "txt-size-mobile", "txt-line-gap", "txt-align-left", "txt-align-center", "txt-align-right"] },
    { id: "heading", icon: "H", title: "Heading styles", description: "Display treatments for headings.", options: ["txt-heading-gradient-live", "txt-heading-underline", "txt-heading-stroke", "txt-heading-fill"] },
    { id: "paragraph", icon: "¶", title: "Paragraph styles", description: "Highlights and fills for body copy.", options: ["txt-paragraph-fill", "txt-paragraph-underline", "txt-paragraph-strong-fill"] },
    { id: "links", icon: "↗", title: "Link styles", description: "Line, marker, fill and clean link treatments.", options: ["txt-link-line", "txt-link-marker", "txt-link-fill", "txt-link-clean"] },
    { id: "scroll", icon: "↕", title: "Animate on scroll", description: "Smooth animations that move as text enters view.", options: ["txt-scroll-parallax", "txt-scroll-left", "txt-scroll-right", "txt-scroll-up", "txt-scroll-down", "txt-scroll-scale-up", "txt-scroll-scale-down", "txt-scroll-fade", "txt-scroll-blur-reveal"] },
    { id: "loop", icon: "⌁", title: "Loop animations", description: "Continuous animation for callouts and badges.", options: ["txt-loop-pulse", "txt-loop-hover", "txt-loop-fade", "txt-loop-spin", "txt-loop-shake", "txt-loop-wiggle"] },
    { id: "hover", icon: "⌖", title: "Animate on hover", description: "Interactions that respond when visitors hover.", options: ["txt-hover-scale", "txt-hover-up", "txt-hover-pop", "txt-hover-tilt", "txt-hover-fade", "txt-hover-flip"] },
    { id: "block", icon: "✧", title: "Block styling", description: "Opacity, rotation, blur, background, border, shadow and spacing.", options: ["txt-block-opacity", "txt-block-rotate", "txt-block-blur", "txt-block-background", "txt-block-corners", "txt-block-border", "txt-block-shadow", "txt-block-margin", "txt-block-margin-x"] },
    { id: "cursor", icon: "☝", title: "Cursor on hover", description: "Custom cursor options for selected text.", options: ["txt-cursor-emoji", "txt-cursor-large", "txt-cursor-hide"] }
  ];
  const imageSections = [
    { id: "image-styles", icon: "▧", title: "Image styles", description: "Shadows, borders, 3D layers and editorial accents.", options: ["img-style-shadow", "img-style-solid-shadow", "img-style-border", "img-style-3d", "img-style-split", "img-style-arrow"] },
    { id: "image-click", icon: "☝", title: "Image click indicator", description: "Hover indicators that make clickable images obvious.", options: ["img-click-overlay", "img-click-pill"] },
    { id: "image-shapes", icon: "▱", title: "Animated image shapes", description: "Shape-shifting accents for photos and graphics.", options: ["img-shape-parallel-1", "img-shape-parallel-2", "img-shape-parallel-3", "img-shape-arrow", "img-shape-square", "img-shape-spotlight", "img-shape-triangle", "img-shape-circle"] },
    { id: "image-scroll", icon: "↕", title: "Animate on scroll", description: "Smooth animations that move as images enter view.", options: ["img-scroll-parallax", "img-scroll-left", "img-scroll-right", "img-scroll-up", "img-scroll-down", "img-scroll-scale-up", "img-scroll-scale-down", "img-scroll-flip", "img-scroll-focus", "img-scroll-spin", "img-scroll-3d"] },
    { id: "image-loop", icon: "⌁", title: "Loop animations", description: "Continuous image animation for callouts and badges.", options: ["img-loop-pulse", "img-loop-hover", "img-loop-fade", "img-loop-spin", "img-loop-shake", "img-loop-wiggle"] },
    { id: "image-hover", icon: "⌖", title: "Animate on hover", description: "Interactions that respond when visitors hover over images.", options: ["img-hover-scale", "img-hover-up", "img-hover-pop", "img-hover-tilt", "img-hover-fade", "img-hover-flip"] },
    { id: "image-block", icon: "✧", title: "Block styling", description: "Opacity, rotation, blur, background, border and shadow.", options: ["img-block-opacity", "img-block-rotate", "img-block-blur", "img-block-background", "img-block-border", "img-block-shadow"] },
    { id: "image-visibility", icon: "◉", title: "Block visibility", description: "Show or hide image blocks on mobile or desktop.", options: ["img-visibility-mobile", "img-visibility-desktop"] },
    { id: "image-cursor", icon: "☝", title: "Cursor on hover", description: "Custom cursor helpers for selected images.", options: ["img-cursor-emoji", "img-cursor-large"] },
    { id: "image-reveal", icon: "☞", title: "Reveal on hover", description: "Show hidden image detail when someone hovers.", options: ["img-reveal-hover"] }
  ];
  let config = loadConfig();
  let selecting = false;
  let activeTab = effectCatalog[0].group;
  let activeMode = "Studio";
  let activeTool = null;
  let activeFeature = null;
  let activeTextSection = "heading";
  let savedMainScrollTop = 0;
  let pendingTextAnchor = "";
  let pendingEffectAnchor = "";
  let pendingEffectOffset = null;
  let helpOpen = false;
  let selectedElement = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function shouldResetFromUrl() {
    const params = new URLSearchParams(location.search);
    return params.has("ssx_reset") || SCRIPT_PARAMS.has("ssx_reset");
  }

  function readInlineConfig() {
    const script = document.getElementById(CONFIG_SCRIPT_ID);
    if (!script) return {};
    try {
      return JSON.parse(script.textContent || "{}");
    } catch {
      return {};
    }
  }

  function loadConfig() {
    if (shouldResetFromUrl()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(PANEL_KEY);
      localStorage.removeItem(PANEL_POSITION_KEY);
      return clone(defaultConfig);
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
      return normalizeConfig(saved || readInlineConfig() || legacy || defaultConfig);
    } catch {
      return clone(defaultConfig);
    }
  }

  function normalizeConfig(input) {
    const next = { ...clone(defaultConfig), ...(input || {}) };
    next.theme = { ...clone(defaultConfig.theme), ...((input && input.theme) || {}) };
    next.design = normalizeDesignMap((input && input.design) || {});
    next.effects = normalizeEffectsMap((input && input.effects) || {});
    next.mode = "Studio";
    next.version = 39;
    return next;
  }

  function normalizeDesignMap(value) {
    const next = {};
    Object.entries(value || {}).forEach(([selector, settings]) => {
      if (!selector || typeof settings !== "object") return;
      next[selector] = normalizeDesign(settings);
    });
    return next;
  }

  function normalizeEffectsMap(value) {
    const next = {};
    Object.entries(value || {}).forEach(([selector, effects]) => {
      if (!selector || typeof effects !== "object") return;
      const cleanEffects = {};
      Object.entries(effects || {}).forEach(([id, settings]) => {
        if (!effectById.has(id) || !settings || typeof settings !== "object") return;
        cleanEffects[id] = {
          enabled: Boolean(settings.enabled),
          intensity: clampIntensity(settings.intensity === undefined ? 60 : settings.intensity),
          params: normalizeParams(settings.params),
          customText: typeof settings.customText === "string" ? settings.customText.slice(0, 40) : ""
        };
      });
      if (Object.keys(cleanEffects).length) next[selector] = cleanEffects;
    });
    return next;
  }

  function normalizeDesign(value) {
    const next = clone(designDefaults);
    Object.entries(value || {}).forEach(([group, settings]) => {
      next[group] = { ...(next[group] || {}), ...(settings || {}) };
    });
    return next;
  }

  function normalizeParams(params) {
    const next = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      next[key] = clampIntensity(value);
    });
    return next;
  }

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function loadPanelPosition() {
    try {
      const saved = JSON.parse(localStorage.getItem(PANEL_POSITION_KEY) || "null");
      if (!saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.y)) return null;
      const width = Math.min(520, window.innerWidth - 28);
      const height = Math.min(window.innerHeight - 18, window.innerHeight);
      return {
        x: Math.max(8, Math.min(window.innerWidth - width - 8, Math.round(saved.x))),
        y: Math.max(8, Math.min(window.innerHeight - Math.min(height, 360), Math.round(saved.y)))
      };
    } catch {
      return null;
    }
  }

  function savePanelPosition(x, y) {
    localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify({
      x: Math.max(8, Math.min(window.innerWidth - 80, Math.round(x))),
      y: Math.max(8, Math.min(window.innerHeight - 80, Math.round(y)))
    }));
  }

  function clampIntensity(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 60;
    return Math.max(0, Math.min(100, Math.round(number)));
  }

  function intensity01(value) {
    return clampIntensity(value) / 100;
  }

  function param(settings, key, fallback) {
    return clampIntensity(settings && settings.params && settings.params[key] !== undefined ? settings.params[key] : fallback);
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || "#17451f").replace("#", "");
    const value = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
    const int = parseInt(value, 16);
    if (Number.isNaN(int)) return `rgba(23,69,31,${alpha})`;
    return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${alpha})`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function escapeCssString(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").slice(0, 40);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function selectorForElement(element) {
    if (!element || element === document.body) return "body";
    const editableTarget = element.closest("[data-section-id], [data-block-id], .sqs-block[id], section[id], article[id], main, footer, header");
    if (editableTarget && editableTarget !== element) return selectorForElement(editableTarget);
    const sectionId = element.getAttribute("data-section-id");
    if (sectionId) return `[data-section-id="${cssEscape(sectionId)}"]`;
    const blockId = element.getAttribute("data-block-id") || element.id;
    if (blockId) return `#${cssEscape(blockId)}`;
    if (!element.dataset.ssxTargetUid) element.dataset.ssxTargetUid = `ssx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    return `[data-ssx-target-uid="${cssEscape(element.dataset.ssxTargetUid)}"]`;
  }

  function targetLabel(selector) {
    if (selector === "body") return "Whole page";
    if (selector.includes("data-section-id")) return "Selected section";
    if (selector.startsWith("#")) return "Selected block";
    return selector;
  }

  function targetCount(selector) {
    try {
      return document.querySelectorAll(selector).length;
    } catch {
      return 0;
    }
  }

  function selectedElementFor(selector) {
    try {
      return document.querySelector(selector);
    } catch {
      return null;
    }
  }

  function targetKind(selector) {
    if (selector === "body") return "page";
    const element = selectedElementFor(selector);
    if (!element) return selector.includes("data-section-id") || selector.includes("section") ? "section" : "block";
    if (element.matches("a,button,.sqs-button-element,.sqs-block-button,.sqs-block-button-element") || element.querySelector(".sqs-button-element,a.sqs-block-button-element,.sqs-block-button a,button")) return "button";
    if (element.matches("img,video,picture,.sqs-block-image") || element.querySelector("img,video,picture,.sqs-block-image")) return "image";
    if (element.matches("h1,h2,h3,p,.sqs-block-html,.sqs-block-content") || element.querySelector("h1,h2,h3,p,.sqs-block-html")) return "text";
    if (element.matches("[data-section-id],section,article,main,footer,header")) return "section";
    return "section";
  }

  function targetKindLabel(kind) {
    return ({ page: "Page", section: "Section", button: "Buttons", text: "Text", image: "Images" }[kind] || "Section");
  }

  function featuresForCurrentTarget() {
    const kind = targetKind(config.activeTarget);
    const all = featureLibrary.filter((feature) => feature.target.includes(kind) || (kind !== "page" && feature.target.includes("section")));
    const preferredOrder = kind === "image" ? ["image-suite", "text-suite"] : ["text-suite", "image-suite"];
    return all.sort((a, b) => {
      const ai = preferredOrder.indexOf(a.id);
      const bi = preferredOrder.indexOf(b.id);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }

  function effectIsEnabledAnywhere(effectId) {
    return Object.values(config.effects || {}).some((effects) => effects && effects[effectId] && effects[effectId].enabled);
  }

  function featureValue(feature) {
    const selected = feature.options.find((id) => {
      const effect = effectById.get(id);
      return Boolean(effect && getEffectSettings(currentScopeTarget(effect), id).enabled);
    });
    return selected ? effectById.get(selected).label : "None";
  }

  function currentScopeTarget(effect) {
    return effect && effect.globalOnly ? "body" : config.scope === "global" ? "body" : config.activeTarget;
  }

  function getEffectSettings(selector, effectId) {
    return config.effects[selector] && config.effects[selector][effectId]
      ? config.effects[selector][effectId]
      : { enabled: false, intensity: 60, params: {} };
  }

  function getDesignSettings(selector) {
    return normalizeDesign(config.design && config.design[selector]);
  }

  function setDesignSetting(selector, group, patch) {
    if (!config.design) config.design = {};
    const current = getDesignSettings(selector);
    current[group] = { ...(current[group] || {}), ...patch };
    config.design[selector] = current;
    saveConfig();
    applyEffects();
  }

  function setEffectSetting(selector, effectId, patch) {
    const effect = effectById.get(effectId);
    if (!effect) return;
    if (selector === "body" && (effect.className || /^txt-block-/.test(effectId)) && patch.enabled) {
      showToast(/^txt-block-/.test(effectId) ? "Pick a section or block first" : "Pick a section first for motion effects");
      return;
    }
    const current = getEffectSettings(selector, effectId);
    const next = {
      ...current,
      ...patch,
      intensity: clampIntensity(patch.intensity ?? current.intensity),
      params: { ...(current.params || {}), ...normalizeParams(patch.params || {}) }
    };
    if (!config.effects[selector]) config.effects[selector] = {};
    if (!next.enabled) delete config.effects[selector][effectId];
    else config.effects[selector][effectId] = next;
    if (!Object.keys(config.effects[selector]).length) delete config.effects[selector];
    saveConfig();
    applyEffects();
  }

  function confirmGlobalScope() {
    if (config.scope === "global") return true;
    showToast("Whole page mode enabled");
    return true;
  }

  function isDesignerMode() {
    const params = new URLSearchParams(location.search);
    const forced = params.has("ssx_editor") || params.has("ssx") || SCRIPT_PARAMS.has("ssx_editor") || SCRIPT_PARAMS.has("ssx");
    const saved = localStorage.getItem(DESIGNER_KEY) === "1";
    const sqsHints = Boolean(
      document.querySelector(".sqs-edit-mode, [data-test='frameToolbar'], .sqs-layout-editing") ||
      document.body.className.includes("sqs-edit") ||
      (location.hostname.includes("squarespace.com") && document.body.className.includes("sqs-edit"))
    );
    return forced || saved || sqsHints;
  }

  function applyEffects() {
    const theme = config.theme || defaultConfig.theme;
    let css = `html{scroll-behavior:smooth;} :root{--ssx-primary:${theme.primary};--ssx-accent:${theme.accent};--ssx-soft:${theme.soft};--ssx-ink:${theme.ink};--ssx-gradient-a:${theme.gradientA};--ssx-gradient-b:${theme.gradientB};--ssx-scroll-progress:0;} @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}}\n`;
    css += buildDesignCss(theme);
    document.querySelectorAll(".ssx-reveal,.ssx-stagger,.ssx-parallax,.ssx-word-blur-reveal").forEach((element) => {
      element.classList.remove("ssx-reveal", "ssx-stagger", "ssx-parallax", "ssx-word-blur-reveal");
    });
    Object.entries(config.effects).forEach(([selector, effects]) => {
      Object.entries(effects || {}).forEach(([id, settings]) => {
        const effect = effectById.get(id);
        if (!effect || !settings.enabled) return;
        if (effect.className && (selector === "body" || selector === "html")) return;
        css += `\n/* ${id} | ${selector} | intensity ${settings.intensity} */\n${effect.css(selector, intensity01(settings.intensity), settings, theme)}\n`;
        if (effect.className) {
          document.querySelectorAll(selector).forEach((element) => {
            if (element === document.body || element === document.documentElement) return;
            element.classList.add(effect.className);
          });
        }
      });
    });
    css += pluginIsolationCss();
    let style = document.getElementById(EFFECT_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = EFFECT_STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
    setupWordBlurReveal();
    setupMotionObservers();
    setupCursorFollower(theme);
    syncSelectedIndicator();
  }

  function syncSelectedIndicator() {
    document.querySelectorAll(".ssx-active-target").forEach((element) => element.classList.remove("ssx-active-target"));
    if (!isDesignerMode() || config.scope === "global" || !config.activeTarget || config.activeTarget === "body") return;
    try {
      document.querySelectorAll(config.activeTarget).forEach((element) => {
        if (!element.closest(`#${APP_ID}`)) element.classList.add("ssx-active-target");
      });
    } catch {}
  }

  function pluginIsolationCss() {
    return `
/* Studio Poema editor isolation */
#${APP_ID},#${APP_ID} *{
  animation:none!important;
  transition:none!important;
  transform:none!important;
  filter:none!important;
  clip-path:none!important;
  text-shadow:none!important;
  letter-spacing:0!important;
  text-transform:none!important;
  writing-mode:horizontal-tb!important;
  white-space:normal!important;
  overflow-wrap:normal!important;
  word-break:normal!important;
  text-wrap:normal!important;
  line-height:normal!important;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
}
#${APP_ID}{position:fixed!important;z-index:2147483647!important}
#${APP_ID} .ssx-panel{transform:none!important;filter:none!important}
#${APP_ID} .ssx-feature-row strong,#${APP_ID} .ssx-option-row span:first-child,#${APP_ID} .ssx-tool-title{
  white-space:normal!important;
  word-break:normal!important;
  overflow-wrap:normal!important;
  line-height:1.12!important;
}
`;
  }

  function buildDesignCss(theme) {
    let css = "";
    Object.entries(config.design || {}).forEach(([selector, settings]) => {
      const d = normalizeDesign(settings);
      const font = d.font;
      const bg = d.background;
      const border = d.border;
      const shadow = d.shadow;
      const layout = d.layout;
      const pos = d.position;
      const fx = d.effects;
      const visibility = d.visibility;
      const targetText = `${selector},${selector} h1,${selector} h2,${selector} h3,${selector} p,${selector} a,${selector} button`;
      const declarations = [];
      if (bg.color) declarations.push(`background-color:${hexToRgba(bg.color, (bg.opacity || 100) / 100)}!important`);
      if (bg.gradientTop || bg.gradientBottom) declarations.push(`background-image:linear-gradient(${bg.gradientDirection || 0}deg,${bg.gradientTop || "transparent"},${bg.gradientBottom || "transparent"})!important`);
      if (border.size > 0) declarations.push(`border:${Math.round(border.size / 5)}px ${border.style || "solid"} ${border.color || theme.primary}!important`);
      if (border.radius > 0) declarations.push(`border-radius:${Math.round(border.radius * 0.5)}px!important`);
      if (layout.size) {
        const sizeMap = { small: 720, medium: 1040, large: 1280 };
        const maxWidth = sizeMap[layout.size] || Math.round(560 + layout.maxWidth * 10);
        declarations.push(`width:min(100%,${maxWidth}px)!important`);
        declarations.push(`max-width:${maxWidth}px!important`);
        declarations.push(`margin-left:auto!important`);
        declarations.push(`margin-right:auto!important`);
        declarations.push(`box-sizing:border-box!important`);
      }
      if (layout.gap !== 50) declarations.push(`gap:${Math.round(6 + layout.gap * 0.58)}px!important`);
      if (shadow.blur > 0 || shadow.spread > 0) {
        const x = Math.round((shadow.x - 50) * 0.45);
        const y = Math.round((shadow.y - 50) * 0.45);
        const blur = Math.round(shadow.blur * 0.65);
        const spread = Math.round(shadow.spread * 0.24);
        declarations.push(`box-shadow:${shadow.inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(shadow.color || theme.primary, 0.22)}!important`);
      }
      const transforms = [];
      if (pos.x !== 50) transforms.push(`translateX(${Math.round((pos.x - 50) * 1.2)}px)`);
      if (pos.y !== 50) transforms.push(`translateY(${Math.round((pos.y - 50) * 1.2)}px)`);
      if (pos.rotate !== 50) transforms.push(`rotate(${Math.round((pos.rotate - 50) * 3.6)}deg)`);
      if (pos.scale !== 50) transforms.push(`scale(${(1 + (pos.scale - 50) * 0.01).toFixed(2)})`);
      if (transforms.length) declarations.push(`transform:${transforms.join(" ")}!important`);
      if (fx.opacity !== 100) declarations.push(`opacity:${Math.max(0.05, fx.opacity / 100)}!important`);
      if (fx.glass > 0) {
        declarations.push(`background:${hexToRgba(theme.soft, 0.22 + fx.glass * 0.005)}!important`);
        declarations.push(`backdrop-filter:blur(${Math.round(fx.glass * 0.22)}px)!important`);
        declarations.push(`-webkit-backdrop-filter:blur(${Math.round(fx.glass * 0.22)}px)!important`);
        declarations.push(`border:1px solid ${hexToRgba(theme.primary, 0.14 + fx.glass * 0.002)}!important`);
      }
      if (fx.blur > 0 || fx.saturate !== 50) declarations.push(`filter:blur(${Math.round(fx.blur * 0.12)}px) saturate(${(0.5 + fx.saturate / 50).toFixed(2)})!important`);
      if (declarations.length) css += `${selector}{${declarations.join(";")};}\n`;
      if (layout.padding !== 50) {
        const sidePadding = Math.round(10 + layout.padding * 0.52);
        css += `${selector}>.content,${selector} .content,${selector} .sqs-layout{padding-left:${sidePadding}px!important;padding-right:${sidePadding}px!important;box-sizing:border-box!important;margin-left:auto!important;margin-right:auto!important;}\n`;
        css += `@media(max-width:767px){${selector}>.content,${selector} .content,${selector} .sqs-layout{padding-left:${Math.max(14, Math.round(sidePadding * .7))}px!important;padding-right:${Math.max(14, Math.round(sidePadding * .7))}px!important;}}\n`;
      }
      if (layout.gap !== 50) css += `${contentTargets(selector)}{gap:${Math.round(6 + layout.gap * 0.58)}px!important;}\n`;

      const textDeclarations = [];
      if (font.color) textDeclarations.push(`color:${font.color}!important`);
      if (font.size > 0) textDeclarations.push(`font-size:clamp(14px,${(0.85 + font.size * 0.025).toFixed(2)}vw,${Math.round(14 + font.size * 0.42)}px)!important`);
      if (font.lineHeight !== 50) textDeclarations.push(`line-height:${(0.9 + font.lineHeight * 0.018).toFixed(2)}!important`);
      if (font.letterSpacing !== 50) textDeclarations.push(`letter-spacing:${((font.letterSpacing - 50) * 0.04).toFixed(2)}px!important`);
      if (font.align) textDeclarations.push(`text-align:${font.align}!important`);
      if (font.transform) textDeclarations.push(`text-transform:${font.transform}!important`);
      if (font.weight) textDeclarations.push(`font-weight:${font.weight}!important`);
      if (textDeclarations.length) css += `${targetText}{${textDeclarations.join(";")};}\n`;
      if (!visibility.mobile) css += `@media(max-width:767px){${selector}{display:none!important;}}\n`;
      if (!visibility.desktop) css += `@media(min-width:768px){${selector}{display:none!important;}}\n`;
    });
    return css;
  }

  let motionObserver;
  function setupMotionObservers() {
    if (motionObserver) motionObserver.disconnect();
    const animated = document.querySelectorAll(".ssx-reveal,.ssx-stagger,.ssx-word-blur-reveal");
    if (!animated.length) return;
    motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("ssx-in");
      });
    }, { threshold: 0.16 });
    animated.forEach((element) => motionObserver.observe(element));
  }

  function unwrapWordSpan(span) {
    const text = document.createTextNode(span.textContent || "");
    span.replaceWith(text);
    if (text.parentNode && text.parentNode.normalize) text.parentNode.normalize();
  }

  function cleanupInactiveWordReveal() {
    document.querySelectorAll(".ssx-word[data-ssx-word]").forEach((span) => {
      if (!span.closest(".ssx-word-blur-reveal")) unwrapWordSpan(span);
    });
  }

  function wrapTextNodeWords(textNode, startIndex) {
    const text = textNode.nodeValue || "";
    if (!/\S/.test(text)) return startIndex;
    const fragment = document.createDocumentFragment();
    let index = startIndex;
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement("span");
      span.className = "ssx-word";
      span.dataset.ssxWord = "1";
      span.style.setProperty("--ssx-word-index", String(index));
      span.textContent = part;
      fragment.appendChild(span);
      index += 1;
    });
    textNode.replaceWith(fragment);
    return index;
  }

  function wrapWordsInTextElement(element) {
    if (!element || element.closest(`#${APP_ID}`)) return;
    if (element.querySelector("img,button,video,iframe,canvas,a > svg")) return;
    if (element.querySelector(".ssx-word[data-ssx-word]")) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !/\S/.test(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".ssx-word,script,style,noscript,textarea,input,button,svg")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach((node) => {
      index = wrapTextNodeWords(node, index);
    });
  }

  function setupWordBlurReveal() {
    cleanupInactiveWordReveal();
    const containers = document.querySelectorAll(".ssx-word-blur-reveal");
    if (!containers.length) return;
    containers.forEach((container) => {
      const targets = container.matches("h1,h2,h3,h4,p,li,blockquote,.sqsrte-large,.sqsrte-small")
        ? [container]
        : Array.from(container.querySelectorAll("h1,h2,h3,h4,p,li,blockquote,.sqsrte-large,.sqsrte-small"));
      targets.forEach(wrapWordsInTextElement);
    });
  }

  let cursorMoveHandler = null;
  function setupCursorFollower(theme) {
    if (cursorMoveHandler) {
      window.removeEventListener("mousemove", cursorMoveHandler);
      cursorMoveHandler = null;
    }
    document.getElementById(CURSOR_ID)?.remove();
    const entries = [];
    Object.entries(config.effects || {}).forEach(([selector, effects]) => {
      Object.entries(effects || {}).forEach(([id, settings]) => {
        if (settings && settings.enabled && /^(txt|img)-cursor-/.test(id)) entries.push({ selector, id, settings });
      });
    });
    if (!entries.length) return;
    const cursor = document.createElement("div");
    cursor.id = CURSOR_ID;
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.cssText = [
      "position:fixed",
      "left:0",
      "top:0",
      "z-index:2147483646",
      "pointer-events:none",
      "display:none",
      "place-items:center",
      "transform:translate(-50%,-50%)",
      "font-family:Inter,system-ui,sans-serif",
      "font-weight:900",
      "line-height:1",
      "transition:width .12s ease,height .12s ease,opacity .12s ease,background .12s ease,color .12s ease"
    ].join(";");
    document.body.appendChild(cursor);
    cursorMoveHandler = (event) => {
      if (event.target && event.target.closest && event.target.closest(`#${APP_ID}`)) {
        cursor.style.display = "none";
        return;
      }
      const matched = cursorEntryForTarget(entries, event.target);
      if (!matched) {
        cursor.style.display = "none";
        return;
      }
      const large = entries.find((entry) => entry.selector === matched.selector && /-cursor-large$/.test(entry.id));
      const emoji = entries.find((entry) => entry.selector === matched.selector && /-cursor-emoji$/.test(entry.id));
      const sizeSource = large || emoji || matched;
      const size = Math.round(24 + clampIntensity(sizeSource.settings.intensity || 60) * 0.42);
      cursor.style.display = "grid";
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.style.width = `${size}px`;
      cursor.style.height = `${size}px`;
      cursor.style.borderRadius = "999px";
      if (emoji) {
        const emojiIndex = Math.max(0, Math.min(cursorEmojiOptions.length - 1, Math.round(param(emoji.settings, "emoji", 0) / (100 / Math.max(1, cursorEmojiOptions.length - 1)))));
        cursor.textContent = cursorEmojiOptions[emojiIndex] || cursorEmojiOptions[0];
        cursor.style.background = "transparent";
        cursor.style.border = "0";
        cursor.style.color = theme.ink;
        cursor.style.fontSize = `${Math.round(size * 0.78)}px`;
        cursor.style.boxShadow = "none";
      } else if (large) {
        cursor.textContent = "";
        cursor.style.background = theme.accent;
        cursor.style.border = `2px solid ${theme.ink}`;
        cursor.style.boxShadow = `0 10px 28px ${hexToRgba(theme.primary, .22)}`;
      } else {
        cursor.textContent = "";
        cursor.style.background = "transparent";
        cursor.style.border = `2px solid ${theme.accent}`;
        cursor.style.boxShadow = `0 0 0 8px ${hexToRgba(theme.accent, .18)}`;
      }
    };
    window.addEventListener("mousemove", cursorMoveHandler, { passive: true });
  }

  function cursorEntryForTarget(entries, target) {
    if (!target || !target.closest) return entries.find((entry) => entry.selector === "body") || null;
    return entries.find((entry) => {
      try {
        if (entry.selector === "body" || entry.selector === "html") return true;
        return Boolean(target.closest(entry.selector));
      } catch {
        return false;
      }
    }) || null;
  }

  function updateScrollProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, window.scrollY / max));
    document.documentElement.style.setProperty("--ssx-scroll-progress", progress.toFixed(4));
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  function ensureBaseStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${APP_ID}{position:fixed;top:14px;right:14px;width:min(420px,calc(100vw - 28px));max-height:calc(100vh - 28px);z-index:2147483647;color:#17351d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:0}
      #${APP_ID} *{box-sizing:border-box;letter-spacing:0}
      .ssx-panel{background:#242424;border:1px solid rgba(255,255,255,.10);box-shadow:0 24px 80px rgba(0,0,0,.35);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-radius:16px;overflow:hidden;color:#f7f4fb}
      .ssx-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);background:#242424}
      .ssx-brand{display:flex;align-items:center;gap:10px;min-width:0}
      .ssx-logo{width:34px;height:34px;border-radius:10px;background:#303030;display:grid;place-items:center;border:1px solid rgba(214,255,69,.34)}
      .ssx-logo svg{width:24px;height:24px;fill:#d8ff3f}
      .ssx-title{font-size:15px;font-weight:820;line-height:1.1;text-align:center}
      .ssx-subtitle{font-size:10px;color:#a9a9ad;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px}
      .ssx-icon-row{display:flex;gap:10px;justify-content:flex-end}
      .ssx-device-row{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px 12px;background:#1f1f1f;border-bottom:1px solid rgba(255,255,255,.08)}
      .ssx-device{height:30px;border:1px solid rgba(255,255,255,.14);background:#303030;color:#f7f4fb;border-radius:8px;font:700 11px Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
      .ssx-device[aria-pressed="true"]{background:#d8ff3f;color:#151515;border-color:#d8ff3f}
      .ssx-icon,.ssx-action,.ssx-copy,.ssx-scope,.ssx-mode,.ssx-back{appearance:none;border:1px solid rgba(255,255,255,.14);background:#303030;color:#f7f4fb;border-radius:10px;height:32px;min-width:32px;padding:0 10px;font:inherit;font-size:12px;font-weight:700;display:inline-grid;place-items:center;cursor:pointer;transition:transform .16s ease,border-color .16s ease,background .16s ease}
      .ssx-icon:hover,.ssx-action:hover,.ssx-copy:hover,.ssx-scope:hover,.ssx-mode:hover,.ssx-back:hover{transform:translateY(-1px);border-color:#d8ff3f}
      .ssx-body{display:block;max-height:calc(100vh - 110px);overflow:hidden}
      .ssx-mode{height:44px;border:0;border-radius:0;background:transparent;font-size:15px;position:relative}
      .ssx-mode[aria-selected="true"]:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:#d8ff3f}
      .ssx-tabs{display:flex;gap:6px;padding:10px;border-bottom:1px solid rgba(255,255,255,.10);background:#242424;overflow:auto}
      .ssx-tab{appearance:none;border:0;background:#303030;color:#d7d5dc;border-radius:999px;padding:8px 11px;text-align:center;font:inherit;font-size:12px;font-weight:760;cursor:pointer;white-space:nowrap}
      .ssx-tab[aria-selected="true"]{background:#d8ff3f;color:#151515}
      .ssx-main{padding:12px 16px;overflow-y:auto;overflow-x:hidden;max-height:calc(100vh - 270px)}
      .ssx-target{display:grid;gap:8px;margin-bottom:12px;position:sticky;top:0;z-index:3;background:linear-gradient(180deg,#242424,#242424e8);padding-bottom:8px}
      .ssx-target-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
      .ssx-target-info{min-width:0;flex:1;border:1px solid rgba(255,255,255,.10);background:#303030;border-radius:12px;padding:8px 10px}
      .ssx-kicker{font-size:10px;text-transform:uppercase;color:#aaa7b0;font-weight:850}
      .ssx-target-name{font-size:12px;font-weight:780;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ssx-action{height:38px;background:#d8ff3f;color:#151515;border-color:#d8ff3f;min-width:78px}
      .ssx-scope-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .ssx-scope{height:32px;background:#303030}
      .ssx-scope[aria-pressed="true"]{background:#d8ff3f;border-color:#d8ff3f;color:#151515}
      .ssx-list{display:grid;gap:10px}
      .ssx-design-list{display:grid;gap:0;border-top:1px solid rgba(255,255,255,.08)}
      .ssx-design-row{appearance:none;border:0;border-bottom:1px solid rgba(255,255,255,.08);background:transparent;color:#f7f4fb;min-height:54px;text-align:left;font:inherit;font-size:16px;font-weight:650;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:0 4px;cursor:pointer}
      .ssx-design-row:before{content:"";width:7px;height:7px;border-radius:50%;background:#d8ff3f;opacity:.9}
      .ssx-design-row span{color:#aaa7b0;font-size:11px;font-weight:700;text-transform:uppercase}
      .ssx-design-row:after{content:"›";font-size:34px;line-height:1;color:#f7f4fb}
      .ssx-tool-head{display:flex;align-items:center;gap:10px;margin-bottom:16px}
      .ssx-tool-head{justify-content:space-between}
      .ssx-restore{appearance:none;border:1px solid rgba(255,255,255,.14);background:#303030;color:#d8ff3f;border-radius:999px;height:30px;padding:0 12px;font:700 11px Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
      .ssx-tool-title{font-size:24px;font-weight:820}
      .ssx-tool-desc{color:#aaa7b0;font-size:13px;line-height:1.45;margin:-6px 0 18px}
      .ssx-control{display:grid;gap:8px;margin:18px 0}
      .ssx-control-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;font-size:15px}
      .ssx-control input[type="range"]{width:100%;accent-color:#d8ff3f}
      .ssx-control input[type="color"]{width:36px;height:36px;border-radius:50%;padding:2px;border:1px solid rgba(255,255,255,.4);background:#fff}
      .ssx-segment{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
      .ssx-segment button{height:42px;border:0;border-radius:6px;background:#3a3a3a;color:#fff;font:inherit;cursor:pointer}
      .ssx-segment button[aria-pressed="true"]{outline:2px solid #d8ff3f;color:#d8ff3f}
      .ssx-theme{border:1px solid rgba(255,255,255,.10);background:#303030;border-radius:13px;padding:10px;margin-bottom:10px}
      .ssx-theme-title{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;font-weight:820;margin-bottom:8px}
      .ssx-palette-row{display:flex;gap:6px;overflow:auto;padding-bottom:2px}
      .ssx-palette{appearance:none;border:1px solid rgba(23,69,31,.14);background:#fff;border-radius:999px;padding:5px 8px;font:inherit;font-size:11px;font-weight:760;color:#17351d;display:flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap}
      .ssx-palette[aria-pressed="true"]{border-color:#17451f;background:#dfe8d8}
      .ssx-swatch{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
      .ssx-color-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}
      .ssx-color-grid label{display:grid;gap:4px;font-size:10px;font-weight:800;color:#66715f;text-transform:uppercase}
      .ssx-color-grid input{width:100%;height:30px;border:1px solid rgba(23,69,31,.14);border-radius:8px;background:#fff;padding:2px}
      .ssx-effect{border:1px solid rgba(255,255,255,.10);background:#303030;border-radius:13px;padding:10px;display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:start;max-width:100%}
      .ssx-preview{height:54px;border-radius:10px;background:#f0eadf;border:1px solid rgba(23,69,31,.11);position:relative;overflow:hidden}
      .ssx-preview:before,.ssx-preview:after{content:"";position:absolute}
      .ssx-preview.layout-frame:before{inset:11px;background:#fff;border:1px solid #17451f;box-shadow:0 10px 20px rgba(23,69,31,.18);border-radius:8px}
      .ssx-preview.layout-spacing:before{left:18px;right:18px;top:8px;bottom:8px;border-top:10px solid #17451f;border-bottom:10px solid #17451f}
      .ssx-preview.layout-split:before{left:12px;top:13px;width:22px;height:32px;background:#17451f;border-radius:5px}.ssx-preview.layout-split:after{right:12px;top:13px;width:22px;height:32px;background:#b7d09e;border-radius:5px}
      .ssx-preview.type-editorial:before{left:12px;top:13px;width:48px;height:7px;background:#17451f;box-shadow:0 13px 0 #8aa083,0 25px 0 #8aa083}
      .ssx-preview.type-highlight:before{left:12px;right:12px;top:22px;height:14px;background:linear-gradient(transparent 45%,#c8ff4d 0)}.ssx-preview.type-gradient:before{left:12px;right:12px;top:20px;height:16px;background:linear-gradient(90deg,#17451f,#0f766e);border-radius:4px}.ssx-preview.type-balance:before{left:16px;right:16px;top:16px;height:6px;background:#17451f;box-shadow:8px 12px 0 #17451f,4px 24px 0 #8aa083}.ssx-preview.type-typewriter:before{left:12px;right:18px;top:22px;height:10px;background:#17451f;border-right:3px solid #c8ff4d}
      .ssx-preview.type-3d:before{left:13px;right:13px;top:19px;height:18px;background:#17451f;border-radius:4px;transform:skewY(-10deg);box-shadow:7px 8px 0 #c8ff4d}.ssx-preview.type-outline:before{left:12px;right:12px;top:20px;height:16px;border:2px solid #17451f;border-radius:4px}.ssx-preview.type-luxury:before{left:14px;right:14px;top:18px;height:5px;background:#17451f;box-shadow:0 12px 0 #17451f,0 24px 0 #8aa083}
      .ssx-preview.button-lift:before,.ssx-preview.button-glow:before,.ssx-preview.button-radius:before,.ssx-preview.button-glass:before{left:13px;right:13px;top:19px;height:20px;background:#17451f;border-radius:7px}.ssx-preview.button-glow:before{box-shadow:8px 12px 22px rgba(23,69,31,.35)}.ssx-preview.button-radius:before{border-radius:999px}.ssx-preview.button-glass:before{background:rgba(255,255,255,.48);border:1px solid rgba(23,69,31,.28);backdrop-filter:blur(4px);box-shadow:0 10px 22px rgba(23,69,31,.18)}
      .ssx-preview.image-shadow:before,.ssx-preview.image-radius:before,.ssx-preview.image-zoom:before,.ssx-preview.image-tint:before{inset:10px;background:linear-gradient(135deg,#c8ff4d,#d9cab8);border-radius:6px}.ssx-preview.image-shadow:before{box-shadow:0 12px 20px rgba(23,69,31,.26)}.ssx-preview.image-radius:before{border-radius:16px}.ssx-preview.image-zoom:before{transform:scale(1.16)}.ssx-preview.image-tint:before{filter:sepia(.4) saturate(.8)}
      .ssx-preview.motion-reveal:before,.ssx-preview.motion-float:before,.ssx-preview.motion-stagger:before{left:14px;top:16px;width:14px;height:26px;background:#17451f;border-radius:5px;box-shadow:20px 8px 0 #8aa083,40px 2px 0 #b7d09e}.ssx-preview.motion-parallax:before{inset:10px;background:linear-gradient(180deg,#b7d09e,#17451f);border-radius:8px}
      .ssx-preview.motion-progress:before{left:8px;right:8px;top:12px;height:4px;background:#d4d8cf;border-radius:999px}.ssx-preview.motion-progress:after{left:8px;top:12px;width:40px;height:4px;background:#17451f;border-radius:999px}.ssx-preview.motion-marquee:before{left:10px;right:-28px;top:22px;height:11px;background:repeating-linear-gradient(90deg,#17451f 0 22px,transparent 22px 30px)}.ssx-preview.motion-rotate:before{left:22px;top:14px;width:28px;height:28px;background:#17451f;border-radius:8px;transform:rotate(24deg)}.ssx-preview.motion-fixed:before{left:23px;top:13px;width:28px;height:28px;background:#17451f;border-radius:50%;box-shadow:0 0 0 6px rgba(23,69,31,.12)}
      .ssx-preview.nav-glass:before{left:8px;right:8px;top:10px;height:16px;background:rgba(255,255,255,.72);border:1px solid rgba(23,69,31,.20);backdrop-filter:blur(4px);border-radius:7px}.ssx-preview.nav-links:before{left:12px;right:12px;top:24px;height:2px;background:#17451f;box-shadow:0 8px 0 #8aa083}
      .ssx-preview.nav-pill:before{left:8px;right:8px;top:18px;height:18px;background:repeating-linear-gradient(90deg,#17451f 0 18px,transparent 18px 24px);border-radius:999px}.ssx-preview.nav-dropdown:before{left:10px;right:10px;top:9px;height:14px;background:#17451f;border-radius:5px}.ssx-preview.nav-dropdown:after{left:22px;right:12px;top:27px;height:20px;background:rgba(255,255,255,.55);border:1px solid rgba(23,69,31,.2);border-radius:7px}.ssx-preview.nav-burger:before{left:20px;right:20px;top:17px;height:3px;background:#17451f;box-shadow:0 8px 0 #17451f,0 16px 0 #17451f}.ssx-preview.nav-sticky:before{left:8px;right:8px;top:10px;height:16px;background:#17451f;border-radius:7px;box-shadow:0 16px 18px rgba(23,69,31,.25)}
      .ssx-preview.cursor-dot:before{left:28px;top:24px;width:9px;height:9px;background:#d8ff3f;border-radius:50%;box-shadow:0 0 0 9px rgba(216,255,63,.18)}.ssx-preview.cursor-magnet:before{left:14px;right:14px;top:20px;height:16px;background:#17451f;border-radius:999px;transform:translateY(-4px)}
      .ssx-preview.utility-outline:before{inset:13px;border:3px solid #17451f;border-radius:8px}.ssx-preview.utility-bg:before{inset:9px;background:#e8f6df;border-radius:8px}.ssx-preview.utility-sticky:before{left:18px;right:18px;top:8px;height:16px;background:#17451f;border-radius:5px;box-shadow:0 24px 0 #d9cab8}.ssx-preview.utility-mobile:before{left:24px;top:8px;width:25px;height:42px;border:3px solid #17451f;border-radius:8px}
      .ssx-preview.preset-cards:before{left:9px;top:15px;width:15px;height:28px;background:#17451f;border-radius:5px;box-shadow:20px 0 0 #8aa083,40px 0 0 #b7d09e}.ssx-preview.preset-grid:before{inset:11px;background:linear-gradient(90deg,#17451f 0 28%,transparent 28% 36%,#8aa083 36% 64%,transparent 64% 72%,#b7d09e 72%);border-radius:5px}.ssx-preview.preset-sticky:before{left:10px;top:8px;width:20px;height:42px;background:#17451f;border-radius:5px}.ssx-preview.preset-sticky:after{right:11px;top:13px;width:30px;height:6px;background:#8aa083;box-shadow:0 12px 0 #8aa083,0 24px 0 #8aa083}
      .ssx-preview.shape-pills:before{left:10px;top:18px;width:50px;height:17px;background:#c8ff4d;border-radius:999px;transform:rotate(-12deg)}.ssx-preview.shape-blob:before{inset:10px;background:#17451f;border-radius:55% 45% 62% 38%}.ssx-preview.shape-divider:before{left:9px;right:9px;top:28px;height:3px;background:linear-gradient(90deg,transparent,#17451f,transparent)}.ssx-preview.shape-glass:before{inset:10px;background:rgba(255,255,255,.46);border:1px solid rgba(23,69,31,.28);border-radius:12px;box-shadow:0 12px 24px rgba(23,69,31,.16);backdrop-filter:blur(5px)}
      .ssx-preview.image-curtain:before{inset:10px;background:#17451f;border-radius:7px}.ssx-preview.image-curtain:after{inset:10px 10px 10px 36px;background:#f4efe7;border-radius:0 7px 7px 0}.ssx-preview.image-float-gallery:before{left:12px;top:11px;width:22px;height:29px;background:#17451f;border-radius:5px;transform:rotate(-7deg)}.ssx-preview.image-float-gallery:after{right:13px;top:18px;width:24px;height:28px;background:#8aa083;border-radius:5px;transform:rotate(8deg)}.ssx-preview.image-infinite:before{left:8px;top:16px;width:18px;height:24px;background:#17451f;border-radius:5px;box-shadow:24px 0 0 #8aa083,48px 0 0 #b7d09e,72px 0 0 #17451f}
      .ssx-effect-title{font-size:12px;font-weight:820}
      .ssx-effect-desc{font-size:11px;color:#aaa7b0;line-height:1.35;margin-top:3px}
      .ssx-effect-top{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:start}
      .ssx-switch{position:relative;width:42px;height:24px;display:inline-block}
      .ssx-switch input{opacity:0;width:0;height:0}
      .ssx-slider{position:absolute;cursor:pointer;inset:0;background:#d4d8cf;border-radius:999px;transition:.18s}
      .ssx-slider:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:.18s}
      .ssx-switch input:checked+.ssx-slider{background:#17451f}
      .ssx-switch input:checked+.ssx-slider:before{transform:translateX(18px)}
      .ssx-range-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;margin-top:9px}
      .ssx-range-row input{width:100%;min-width:0;accent-color:#17451f}
      .ssx-range-label{font-size:10px;color:#66715f;font-weight:800;min-width:54px;text-align:right;white-space:nowrap}
      .ssx-advanced{display:grid;gap:6px;margin-top:7px}
      .ssx-footer{display:flex;gap:0;padding:0;border-top:1px solid rgba(255,255,255,.10);background:#242424}
      .ssx-copy{height:34px;flex:1}
      .ssx-footer .ssx-copy{height:48px;border-radius:0;border:0;background:#242424;color:#f7f4fb;text-transform:uppercase;letter-spacing:.06em}
      .ssx-footer .ssx-copy+.ssx-copy{border-left:1px solid rgba(255,255,255,.10)}
      .ssx-copy.primary{background:#242424;border-color:#242424;color:#f7f4fb}
      .ssx-toast{position:absolute;right:12px;bottom:58px;background:#d8ff3f;color:#151515;padding:9px 11px;border-radius:9px;font-size:12px;box-shadow:0 12px 24px rgba(15,23,42,.2)}
      .ssx-collapsed{position:fixed;left:18px;right:auto;bottom:18px;top:auto;z-index:2147483647;border:1px solid rgba(5,25,20,.18);background:#FCF6EB;color:#051914;border-radius:999px;height:44px;padding:0 16px 0 12px;font:850 13px Inter,ui-sans-serif,system-ui,sans-serif;box-shadow:0 14px 34px rgba(5,25,20,.20);cursor:pointer;display:inline-flex;align-items:center;gap:9px;letter-spacing:0;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
      .ssx-collapsed:before{content:"";width:20px;height:20px;border-radius:999px;background:#AADD66;box-shadow:inset 0 0 0 5px #125B49}
      .ssx-collapsed:hover{transform:translateY(-2px);box-shadow:0 18px 42px rgba(5,25,20,.24)}
      .ssx-collapsed:focus-visible{outline:3px solid rgba(170,221,102,.55);outline-offset:3px}
      .ssx-outline{outline:2px solid #c8ff4d!important;outline-offset:3px!important}
      .ssx-target-flash{outline:3px solid #c8ff4d!important;outline-offset:7px!important;box-shadow:0 0 0 12px rgba(200,255,77,.20)!important}
      .ssx-selecting *{cursor:crosshair!important}
      #${APP_ID}{color:#17351d}
      #${APP_ID}.ssx-dragging{user-select:none}
      .ssx-panel{background:#f7f2e8!important;color:#17351d!important;border:1px solid rgba(23,69,31,.16)!important;box-shadow:0 26px 90px rgba(40,52,31,.25)!important}
      .ssx-head{background:#fbf8ef!important;border-bottom:1px solid rgba(23,69,31,.12)!important;cursor:grab}
      #${APP_ID}.ssx-dragging .ssx-head{cursor:grabbing}
      .ssx-logo{background:#fffdf8!important;border-color:rgba(23,69,31,.16)!important}.ssx-logo svg{fill:#17451f!important}
      .ssx-subtitle,.ssx-effect-desc,.ssx-tool-desc{color:#62715d!important}
      .ssx-device-row,.ssx-tabs,.ssx-target,.ssx-footer{background:#f7f2e8!important;border-color:rgba(23,69,31,.12)!important}
      .ssx-icon,.ssx-action,.ssx-copy,.ssx-scope,.ssx-mode,.ssx-back,.ssx-device{background:#fffdf8!important;color:#17351d!important;border-color:rgba(23,69,31,.16)!important}
      .ssx-action,.ssx-device[aria-pressed="true"],.ssx-scope[aria-pressed="true"]{background:#17451f!important;border-color:#17451f!important;color:#fff!important}
      .ssx-mode[aria-selected="true"]:after{background:#17451f!important}
      .ssx-tabs{display:grid!important;grid-template-columns:1fr!important;gap:7px!important;overflow:visible!important;padding:0 0 12px!important}
      .ssx-tab{background:#fffdf8!important;color:#17351d!important;border:1px solid rgba(23,69,31,.14)!important;border-radius:11px!important;text-align:left!important;padding:10px 12px!important}
      .ssx-tab[aria-selected="true"]{background:#dfe8d8!important;color:#17451f!important;border-color:#17451f!important}
      .ssx-main{background:#f7f2e8!important}
      .ssx-target-info,.ssx-theme,.ssx-effect{background:#fffdf8!important;border-color:rgba(23,69,31,.13)!important;color:#17351d!important}
      .ssx-design-list{border-top-color:rgba(23,69,31,.12)!important}.ssx-design-row{color:#17351d!important;border-bottom-color:rgba(23,69,31,.12)!important}.ssx-design-row:after{color:#17451f!important}.ssx-design-row span{color:#62715d!important}
      .ssx-restore{background:#eef2e7!important;color:#17451f!important;border-color:rgba(23,69,31,.16)!important}
      .ssx-control input[type="range"],.ssx-range-row input{accent-color:#17451f!important}
      .ssx-segment button{background:#fffdf8!important;color:#17351d!important;border:1px solid rgba(23,69,31,.13)!important}.ssx-segment button[aria-pressed="true"]{outline:2px solid #17451f!important;color:#17451f!important;background:#dfe8d8!important}
      .ssx-footer .ssx-copy{background:#fffdf8!important;color:#17351d!important;border-left-color:rgba(23,69,31,.12)!important}.ssx-footer .ssx-copy.primary{background:#17451f!important;color:#fff!important}
      .ssx-how{background:#fffdf8;border:1px solid rgba(23,69,31,.13);border-radius:13px;padding:11px 12px;margin-bottom:12px;color:#17351d}
      .ssx-how-title{font-size:12px;font-weight:850;text-transform:uppercase;color:#17451f;margin-bottom:5px}
      .ssx-how p{margin:0;font-size:12px;line-height:1.45;color:#62715d}
      .ssx-theme-note{font-size:11px;color:#62715d;line-height:1.4;margin:8px 0 0}
      .ssx-back{font-size:12px!important;min-width:118px!important;justify-content:start!important}
      .ssx-publish{min-width:78px!important;border-radius:999px!important;background:#fffdf8!important;border:2px solid #17351d!important;text-transform:uppercase;font-weight:900!important}
      .ssx-studio-hero{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:4px 0 10px}
      .ssx-scope-pill{display:inline-flex;align-items:center;min-height:30px;border-radius:999px;background:#eeece8;color:#17351d;padding:0 11px;font-size:12px;font-weight:750;white-space:nowrap}
      .ssx-publish-note{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center;background:#fffdf8;border:1px solid rgba(23,69,31,.1);border-radius:13px;padding:12px;margin:0 0 12px;color:#17351d;font-size:13px;line-height:1.35}
      .ssx-note-icon{width:28px;height:28px;border:2px solid #17351d;border-radius:999px;display:grid;place-items:center;font-weight:900}
      .ssx-feature-list,.ssx-option-list{display:grid;gap:0;background:#fffdf8;border:1px solid rgba(23,69,31,.11);border-radius:14px;overflow:hidden;margin-bottom:12px}
      .ssx-feature-row,.ssx-option-row{appearance:none;width:100%;border:0;border-bottom:1px solid rgba(23,69,31,.1);background:#fffdf8;color:#111;text-align:left;font:inherit;display:grid;grid-template-columns:36px minmax(0,1fr) auto auto;gap:10px;align-items:center;min-height:66px;padding:12px;cursor:pointer}
      .ssx-feature-row:hover,.ssx-option-row:hover{background:#f4efe7}
      .ssx-feature-icon{width:28px;height:28px;display:grid;place-items:center;color:#17351d;font-weight:900;font-size:18px}
      .ssx-feature-row strong{display:block;font-size:16px;font-weight:820;color:#111}
      .ssx-feature-row em{display:block;margin-top:3px;font-style:normal;font-size:12px;line-height:1.3;color:#8a8a8a}
      .ssx-feature-value{font-size:14px;color:#9a9a9a;white-space:nowrap}
      .ssx-chevron{font-size:24px;line-height:1;color:#111}
      .ssx-help-box{background:#fffdf8;border:1px solid rgba(23,69,31,.11);border-radius:13px;padding:10px 12px;margin-bottom:12px;color:#62715d;font-size:12px;line-height:1.45}
      .ssx-help-box summary{cursor:pointer;color:#17351d;font-weight:850;font-size:13px}.ssx-help-box p{margin:8px 0 0}
      .ssx-feature-head{display:flex;gap:12px;align-items:flex-start;margin:4px 0 12px}
      .ssx-inline-back{appearance:none;border:0;background:transparent;color:#111;font:800 14px Inter,ui-sans-serif,system-ui,sans-serif;padding:4px 0;cursor:pointer;white-space:nowrap}
      .ssx-option-card{border-bottom:1px solid rgba(23,69,31,.1);background:#fffdf8}
      .ssx-option-card:last-child,.ssx-option-row:last-child{border-bottom:0}
      .ssx-option-row{grid-template-columns:minmax(0,1fr) auto;min-height:56px;font-size:16px;font-weight:760}
      .ssx-option-row[aria-pressed="true"]{color:#17451f;background:#f4efe7}
      .ssx-option-check{font-size:20px;font-weight:900;color:#111}
      .ssx-option-controls{display:grid;grid-template-columns:60px minmax(0,1fr) auto;gap:10px;align-items:center;padding:0 12px 12px}
      .ssx-hover-preview{position:absolute;left:calc(100% + 14px);top:210px;width:240px;min-height:130px;background:#fffdf8;border:1px solid rgba(23,69,31,.13);border-radius:12px;box-shadow:0 20px 56px rgba(24,35,24,.22);padding:16px;opacity:0;transform:translateY(6px);pointer-events:none;transition:opacity .16s ease,transform .16s ease;color:#17351d}
      .ssx-hover-preview.is-visible{opacity:1;transform:translateY(0)}
      .ssx-hover-title{font-size:16px;font-weight:850;margin-bottom:8px}.ssx-hover-preview p{margin:0;color:#62715d;font-size:13px;line-height:1.45}
      .ssx-preview.button-arrow:before{left:12px;right:12px;top:18px;height:20px;background:#17451f;border-radius:999px}.ssx-preview.button-arrow:after{content:"↗";right:16px;top:19px;color:#fff;font-size:14px}
      .ssx-preview.button-line:before{left:12px;right:12px;top:28px;height:3px;background:#17451f}.ssx-preview.button-3d:before{left:13px;right:13px;top:17px;height:20px;background:#c8ff4d;border:2px solid #17351d;border-radius:7px;box-shadow:5px 6px 0 #17351d}
      .ssx-preview.button-snowy:before{left:13px;right:13px;top:18px;height:20px;background:#fff;border:1px solid #17451f;border-radius:999px}.ssx-preview.button-snowy:after{left:22px;top:24px;width:4px;height:4px;background:#c8ff4d;border-radius:50%;box-shadow:18px -3px 0 #b7d09e,34px 4px 0 #c8ff4d}
      .ssx-preview.button-bubbly:before{left:13px;right:13px;top:18px;height:20px;background:#b7d09e;border-radius:999px;box-shadow:inset 0 -5px 0 rgba(23,69,31,.22)}
      .ssx-preview.engagement-pulse:before,.ssx-preview.engagement-wobble:before,.ssx-preview.engagement-hover:before,.ssx-preview.engagement-jelly:before{left:13px;right:13px;top:19px;height:20px;background:#17451f;border-radius:999px}.ssx-preview.engagement-pulse:after{inset:12px;border:2px solid #c8ff4d;border-radius:999px}.ssx-preview.engagement-wobble:before{transform:rotate(-5deg)}.ssx-preview.engagement-hover:before{transform:translateY(-6px);box-shadow:0 12px 18px rgba(23,69,31,.18)}.ssx-preview.engagement-jelly:before{transform:scale(1.12,.82)}
      #${APP_ID},#${APP_ID} *{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;cursor:default!important}
      #${APP_ID} button,#${APP_ID} summary,#${APP_ID} label,#${APP_ID} input[type="range"],#${APP_ID} input[type="color"]{cursor:pointer!important}
      #${APP_ID} .ssx-head{cursor:grab!important}
      #${APP_ID}.ssx-dragging .ssx-head,#${APP_ID}.ssx-dragging .ssx-head *{cursor:grabbing!important}
      #${APP_ID}{color:#051914!important}
      #${APP_ID} .ssx-panel,#${APP_ID} .ssx-main,#${APP_ID} .ssx-device-row,#${APP_ID} .ssx-tabs,#${APP_ID} .ssx-target,#${APP_ID} .ssx-footer{background:#FCF6EB!important;color:#051914!important}
      #${APP_ID} .ssx-head{background:#ECEABE!important;color:#051914!important;border-color:rgba(0,53,39,.14)!important}
      #${APP_ID} .ssx-logo{width:40px!important;height:40px!important;border-radius:12px!important;background:#FCF6EB!important;border-color:rgba(0,53,39,.12)!important}
      #${APP_ID} .ssx-logo svg{width:30px!important;height:30px!important;fill:#003527!important}
      #${APP_ID} .ssx-icon,#${APP_ID} .ssx-action,#${APP_ID} .ssx-copy,#${APP_ID} .ssx-scope,#${APP_ID} .ssx-mode,#${APP_ID} .ssx-back,#${APP_ID} .ssx-device,#${APP_ID} .ssx-tab,#${APP_ID} .ssx-palette,#${APP_ID} .ssx-segment button,#${APP_ID} .ssx-restore{background:#FCF6EB!important;color:#051914!important;border-color:rgba(0,53,39,.16)!important}
      #${APP_ID} .ssx-action,#${APP_ID} .ssx-device[aria-pressed="true"],#${APP_ID} .ssx-scope[aria-pressed="true"],#${APP_ID} .ssx-copy.primary{background:#003527!important;border-color:#003527!important;color:#FCF6EB!important}
      #${APP_ID} .ssx-publish{background:#FCF6EB!important;border-color:#051914!important;color:#051914!important}
      #${APP_ID} .ssx-target-info,#${APP_ID} .ssx-theme,#${APP_ID} .ssx-effect,#${APP_ID} .ssx-how,#${APP_ID} .ssx-publish-note,#${APP_ID} .ssx-feature-list,#${APP_ID} .ssx-option-list,#${APP_ID} .ssx-help-box,#${APP_ID} .ssx-option-card,#${APP_ID} .ssx-hover-preview{background:#FCF6EB!important;border-color:rgba(0,53,39,.14)!important;color:#051914!important}
      #${APP_ID} .ssx-feature-row,#${APP_ID} .ssx-option-row{background:#FCF6EB!important;color:#051914!important;border-bottom-color:rgba(0,53,39,.12)!important}
      #${APP_ID} .ssx-feature-row:hover,#${APP_ID} .ssx-option-row:hover,#${APP_ID} .ssx-option-row[aria-pressed="true"],#${APP_ID} .ssx-tab[aria-selected="true"],#${APP_ID} .ssx-palette[aria-pressed="true"],#${APP_ID} .ssx-segment button[aria-pressed="true"]{background:#ECEABE!important;color:#003527!important;border-color:#125B49!important}
      #${APP_ID} .ssx-subtitle,#${APP_ID} .ssx-effect-desc,#${APP_ID} .ssx-tool-desc,#${APP_ID} .ssx-how p,#${APP_ID} .ssx-theme-note,#${APP_ID} .ssx-help-box,#${APP_ID} .ssx-feature-row em,#${APP_ID} .ssx-feature-value,#${APP_ID} .ssx-hover-preview p{color:#125B49!important}
      #${APP_ID} .ssx-tool-title,#${APP_ID} .ssx-feature-row strong,#${APP_ID} .ssx-hover-title,#${APP_ID} .ssx-how-title,#${APP_ID} .ssx-kicker,#${APP_ID} .ssx-chevron,#${APP_ID} .ssx-option-check{color:#051914!important}
      #${APP_ID} .ssx-scope-pill,#${APP_ID} .ssx-slider{background:#ECEABE!important;color:#003527!important}
      #${APP_ID} .ssx-switch input:checked+.ssx-slider,#${APP_ID} .ssx-range-row input,#${APP_ID} .ssx-control input[type="range"]{accent-color:#125B49!important}
      #${APP_ID}{width:min(430px,calc(100vw - 28px))!important}
      #${APP_ID} .ssx-panel{background:rgba(252,246,235,.86)!important;backdrop-filter:blur(24px) saturate(1.1)!important;-webkit-backdrop-filter:blur(24px) saturate(1.1)!important;border-radius:28px!important;box-shadow:0 30px 90px rgba(5,25,20,.20)!important;overflow:hidden!important}
      #${APP_ID} .ssx-head{grid-template-columns:auto 1fr auto!important;padding:22px 24px!important;background:rgba(252,246,235,.72)!important;border-bottom:0!important}
      #${APP_ID} .ssx-title,#${APP_ID} .ssx-subtitle{display:none!important}
      #${APP_ID} .ssx-icon-row{gap:10px!important}
      #${APP_ID} .ssx-icon{border:0!important;background:transparent!important;min-width:34px!important;height:34px!important;font-size:20px!important;padding:0!important}
      #${APP_ID} .ssx-pick-button{width:auto!important;min-width:118px!important;border:1px solid rgba(5,25,20,.16)!important;border-radius:999px!important;background:rgba(252,246,235,.8)!important;padding:0 14px!important;font-size:13px!important;font-weight:850!important}
      #${APP_ID}.ssx-is-picking .ssx-pick-button{background:#AADD66!important;color:#051914!important;box-shadow:0 0 0 3px rgba(170,221,102,.28)!important}
      #${APP_ID} .ssx-icon[title="Close"],#${APP_ID} .ssx-icon[data-ssx-close]{font-size:18px!important}
      #${APP_ID} .ssx-publish{border:2px solid #051914!important;border-radius:999px!important;min-width:112px!important;height:42px!important;font-size:14px!important;background:rgba(252,246,235,.8)!important}
      #${APP_ID} .ssx-logo{background:transparent!important;border:0!important;width:38px!important;height:38px!important}
      #${APP_ID} .ssx-body{max-height:calc(100vh - 118px)!important}
      #${APP_ID} .ssx-main{padding:24px 26px 28px!important;max-height:calc(100vh - 118px)!important;background:transparent!important}
      #${APP_ID} .ssx-studio-hero{display:grid!important;grid-template-columns:1fr auto!important;margin:0 0 28px!important}
      #${APP_ID} .ssx-tool-title{font-size:30px!important;line-height:1.05!important;font-weight:850!important}
      #${APP_ID} .ssx-tool-desc{display:none!important}
      #${APP_ID} .ssx-scope-pill{background:rgba(236,234,190,.75)!important;border-radius:999px!important;font-size:13px!important;padding:0 14px!important;min-height:34px!important;color:#051914!important}
      #${APP_ID} .ssx-feature-list,#${APP_ID} .ssx-option-list{border:0!important;border-radius:0!important;background:transparent!important;overflow:visible!important}
      #${APP_ID} .ssx-feature-row,#${APP_ID} .ssx-option-row{background:transparent!important;border-bottom:1px solid rgba(5,25,20,.12)!important;min-height:66px!important;padding:0!important;grid-template-columns:38px minmax(0,1fr) auto!important}
      #${APP_ID} .ssx-feature-row span:nth-child(2){min-width:0!important}
      #${APP_ID} .ssx-feature-row strong,#${APP_ID} .ssx-option-row span:first-child{font-size:20px!important;font-weight:650!important;color:#051914!important}
      #${APP_ID} .ssx-feature-row em,#${APP_ID} .ssx-feature-value{display:none!important}
      #${APP_ID} .ssx-feature-icon{font-size:24px!important;color:#051914!important;width:28px!important}
      #${APP_ID} .ssx-chevron{font-size:30px!important;color:rgba(5,25,20,.38)!important;transform:rotate(-90deg)}
      #${APP_ID} .ssx-feature-row:hover,#${APP_ID} .ssx-option-row:hover{background:rgba(236,234,190,.22)!important}
      #${APP_ID} .ssx-feature-head{display:grid!important;grid-template-columns:1fr!important;gap:22px!important;margin:0 0 18px!important}
      #${APP_ID} .ssx-inline-back,#${APP_ID} .ssx-back{font-size:17px!important;font-weight:750!important;background:transparent!important;border:0!important;min-width:auto!important;padding:0!important}
      #${APP_ID} .ssx-option-card{background:transparent!important;border-bottom:0!important}
      #${APP_ID} .ssx-option-controls{display:none!important;grid-template-columns:minmax(0,1fr) auto!important;padding:0 0 14px 0!important}
      #${APP_ID} .ssx-option-card:has(.ssx-option-row[aria-pressed="true"]) .ssx-option-controls{display:grid!important}
      #${APP_ID} .ssx-option-controls>.ssx-preview{display:none!important}
      #${APP_ID} .ssx-how{background:rgba(252,246,235,.72)!important;border:1px solid rgba(5,25,20,.10)!important;border-radius:18px!important;margin:0 0 22px!important}
      #${APP_ID} .ssx-hover-preview{display:none!important}
      #${APP_ID} .ssx-head{grid-template-columns:auto minmax(0,1fr)!important}
      #${APP_ID} .ssx-icon-row{align-items:center!important;justify-content:flex-end!important;flex-wrap:wrap!important}
      #${APP_ID} .ssx-top-scope{display:flex!important;align-items:center!important;gap:0!important;border:2px solid #051914!important;border-radius:999px!important;overflow:hidden!important;background:rgba(252,246,235,.82)!important;height:42px!important}
      #${APP_ID} .ssx-top-scope button{appearance:none!important;border:0!important;background:transparent!important;color:#051914!important;height:100%!important;padding:0 12px!important;font:800 12px Inter,ui-sans-serif,system-ui,sans-serif!important;cursor:pointer!important;white-space:nowrap!important}
      #${APP_ID} .ssx-top-scope button[aria-pressed="true"]{background:#AADD66!important;color:#051914!important}
      #${APP_ID} .ssx-scope-pill{background:#AADD66!important;color:#051914!important;font-weight:850!important;box-shadow:0 0 0 1px rgba(5,25,20,.14) inset!important}
      #${APP_ID} .ssx-footer{display:grid!important;grid-template-columns:.9fr .9fr 1.25fr!important;gap:10px!important;padding:14px 18px 18px!important;border-top:1px solid rgba(5,25,20,.10)!important;background:rgba(252,246,235,.82)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important}
      #${APP_ID} .ssx-footer .ssx-copy{height:48px!important;border-radius:999px!important;border:1px solid rgba(5,25,20,.18)!important;background:rgba(252,246,235,.62)!important;color:#051914!important;font:850 13px Inter,ui-sans-serif,system-ui,sans-serif!important;text-transform:uppercase!important}
      #${APP_ID} .ssx-footer .ssx-copy.primary{background:#AADD66!important;border-color:#AADD66!important;color:#051914!important;box-shadow:0 10px 28px rgba(170,221,102,.34)!important}
      #${APP_ID} .ssx-option-row{grid-template-columns:minmax(0,1fr) 34px!important;column-gap:12px!important;align-items:center!important}
      #${APP_ID} .ssx-option-row span:first-child{display:block!important;min-width:0!important;max-width:100%!important;font-size:18px!important;line-height:1.18!important;white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important}
      #${APP_ID} .ssx-option-row span:first-child strong{display:block!important;font-size:18px!important;line-height:1.18!important;font-weight:720!important;color:#051914!important}
      #${APP_ID} .ssx-option-row span:first-child em{display:block!important;margin-top:5px!important;font-style:normal!important;font-size:12px!important;line-height:1.35!important;font-weight:650!important;color:#125B49!important}
      #${APP_ID} .ssx-option-check{justify-self:end!important;width:28px!important;text-align:center!important;color:#051914!important}
      #${APP_ID} .ssx-feature-row[aria-pressed="true"],#${APP_ID} .ssx-option-row[aria-pressed="true"]{background:rgba(170,221,102,.32)!important}
      #${APP_ID} .ssx-range-row input{accent-color:#AADD66!important}
      #${APP_ID} .ssx-logo svg{fill:#051914!important}
      #${APP_ID}{width:min(520px,calc(100vw - 28px))!important;height:calc(100vh - 18px)!important;max-height:calc(100vh - 18px)!important}
      #${APP_ID} .ssx-panel{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;height:100%!important;max-height:100%!important;min-height:360px!important;resize:none!important;overflow:hidden!important}
      #${APP_ID} .ssx-body{min-height:0!important;overflow:hidden!important;max-height:none!important}
      #${APP_ID} .ssx-main{min-height:0!important;height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;max-height:none!important;padding-bottom:96px!important;overscroll-behavior:contain!important;scrollbar-color:#AADD66 rgba(5,25,20,.10)!important}
      #${APP_ID} .ssx-text-head{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;gap:12px!important;align-items:start!important;margin:0 0 18px!important}
      #${APP_ID} .ssx-text-suite{display:grid!important;gap:0!important}
      #${APP_ID} .ssx-text-none{appearance:none!important;width:100%!important;min-height:56px!important;border:0!important;border-bottom:1px solid rgba(5,25,20,.12)!important;background:rgba(170,221,102,.26)!important;color:#051914!important;display:grid!important;grid-template-columns:minmax(0,1fr) 34px!important;align-items:center!important;text-align:left!important;padding:0 16px!important;font:800 18px Inter,ui-sans-serif,system-ui,sans-serif!important;cursor:pointer!important}
      #${APP_ID} .ssx-text-section{border-bottom:1px solid rgba(5,25,20,.12)!important;background:transparent!important}
      #${APP_ID} .ssx-text-toggle{appearance:none!important;width:100%!important;min-height:66px!important;border:0!important;background:transparent!important;color:#051914!important;display:grid!important;grid-template-columns:36px minmax(0,1fr) auto 28px!important;gap:12px!important;align-items:center!important;text-align:left!important;padding:0 10px!important;cursor:pointer!important}
      #${APP_ID} .ssx-text-toggle:hover{background:rgba(236,234,190,.22)!important}
      #${APP_ID} .ssx-text-section-icon{font-size:22px!important;font-weight:850!important;color:#051914!important;text-align:center!important}
      #${APP_ID} .ssx-text-toggle strong{display:inline!important;font-size:20px!important;line-height:1.15!important;font-weight:720!important;color:#051914!important}
      #${APP_ID} .ssx-text-toggle em{display:block!important;margin-top:4px!important;font-size:12px!important;line-height:1.25!important;font-style:normal!important;font-weight:650!important;color:#125B49!important}
      #${APP_ID} .ssx-text-toggle b{display:inline-flex!important;align-items:center!important;height:22px!important;border-radius:999px!important;background:#AADD66!important;color:#051914!important;padding:0 8px!important;font-size:11px!important;font-weight:900!important}
      #${APP_ID} .ssx-text-caret{font-size:24px!important;font-weight:850!important;color:#051914!important;text-align:center!important}
      #${APP_ID} .ssx-text-options{background:rgba(255,255,255,.22)!important;border-top:1px solid rgba(5,25,20,.10)!important}
      #${APP_ID} .ssx-text-option-card{border-bottom:1px solid rgba(5,25,20,.10)!important;background:transparent!important}
      #${APP_ID} .ssx-text-option{appearance:none!important;width:100%!important;min-height:56px!important;border:0!important;background:transparent!important;color:#051914!important;display:grid!important;grid-template-columns:minmax(0,1fr) 34px!important;gap:12px!important;align-items:center!important;text-align:left!important;padding:0 12px 0 48px!important;cursor:pointer!important}
      #${APP_ID} .ssx-text-option:hover,#${APP_ID} .ssx-text-option[aria-pressed="true"]{background:rgba(170,221,102,.24)!important}
      #${APP_ID} .ssx-text-option span:first-child{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important}
      #${APP_ID} .ssx-text-option strong{display:block!important;font-size:20px!important;line-height:1.16!important;font-weight:650!important;color:#051914!important}
      #${APP_ID} .ssx-text-option span:last-child{font-size:22px!important;font-weight:900!important;text-align:center!important;color:#051914!important}
      #${APP_ID} .ssx-text-controls{padding:12px 14px 16px 48px!important;display:grid!important;gap:8px!important;background:rgba(255,255,255,.30)!important;border-top:1px solid rgba(5,25,20,.08)!important}
      #${APP_ID} .ssx-control-title{font:750 17px/1.1 Inter,ui-sans-serif,system-ui,sans-serif!important;color:#051914!important;padding:8px 0 10px!important}
      #${APP_ID} .ssx-control-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
      #${APP_ID} .ssx-control-line,#${APP_ID} .ssx-control-card{appearance:none!important;border:0!important;background:#f7f7f4!important;color:#051914!important;border-bottom:1px solid rgba(5,25,20,.12)!important;text-align:left!important;font:650 18px/1.1 Inter,ui-sans-serif,system-ui,sans-serif!important}
      #${APP_ID} .ssx-control-line{min-height:58px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;gap:12px!important;align-items:center!important;padding:0 12px!important}
      #${APP_ID} .ssx-control-card{min-height:78px!important;border:1px solid rgba(5,25,20,.09)!important;border-radius:8px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-content:center!important;gap:4px 10px!important;padding:10px 12px!important;box-shadow:0 1px 0 rgba(5,25,20,.04)!important}
      #${APP_ID} .ssx-control-line small,#${APP_ID} .ssx-control-card small{display:block!important;text-transform:uppercase!important;font-size:11px!important;line-height:1!important;font-weight:750!important;color:#051914!important;grid-column:1/-1!important}
      #${APP_ID} .ssx-control-line em,#${APP_ID} .ssx-control-card em,#${APP_ID} .ssx-control-card span + b{font-style:normal!important;color:rgba(5,25,20,.45)!important;font-weight:650!important}
      #${APP_ID} .ssx-control-card span{font-size:19px!important;color:#051914!important}
      #${APP_ID} .ssx-control-line input[type="range"],#${APP_ID} .ssx-control-card input[type="range"]{width:120px!important;accent-color:#AADD66!important}
      #${APP_ID} .ssx-control-line input[type="color"],#${APP_ID} .ssx-control-card input[type="color"]{width:36px!important;height:36px!important;border:1px solid rgba(5,25,20,.18)!important;border-radius:999px!important;padding:0!important;background:#fff!important;overflow:hidden!important;cursor:pointer!important}
      #${APP_ID} .ssx-control-line[data-ssx-switch-effect],#${APP_ID} .ssx-control-card[data-ssx-switch-effect]{cursor:pointer!important}
      #${APP_ID} .ssx-emoji-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
      #${APP_ID} .ssx-emoji-grid button{appearance:none!important;height:44px!important;border:1px solid rgba(5,25,20,.14)!important;border-radius:12px!important;background:#FCF6EB!important;color:#051914!important;font:850 20px/1 Inter,ui-sans-serif,system-ui,sans-serif!important;cursor:pointer!important}
      #${APP_ID} .ssx-emoji-grid button[aria-pressed="true"]{background:#AADD66!important;border-color:#125B49!important}
      #${APP_ID} .ssx-plus{width:30px!important;height:30px!important;border-radius:999px!important;display:grid!important;place-items:center!important;background:#fff!important;color:#125B49!important;border:1px solid rgba(5,25,20,.18)!important;font-size:23px!important;font-weight:500!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.8)!important}
      #${APP_ID} .ssx-toggle-dot{width:44px!important;height:24px!important;border-radius:999px!important;background:#9fa09f!important;position:relative!important;display:inline-block!important}
      #${APP_ID} .ssx-toggle-dot:before{content:""!important;position:absolute!important;width:20px!important;height:20px!important;border-radius:999px!important;left:2px!important;top:2px!important;background:#fff!important;box-shadow:0 1px 3px rgba(5,25,20,.22)!important}
      #${APP_ID} .ssx-toggle-dot.is-on{background:#AADD66!important}
      #${APP_ID} .ssx-toggle-dot.is-on:before{left:22px!important}
      #${APP_ID} .ssx-footer{position:sticky!important;bottom:0!important;z-index:4!important}
      .ssx-active-target{outline:3px solid #AADD66!important;outline-offset:8px!important;box-shadow:0 0 0 9999px rgba(5,25,20,.05),0 0 0 14px rgba(170,221,102,.22)!important;position:relative!important}
      .ssx-active-target:after{content:"Studio Poema selected";position:absolute;left:12px;top:12px;z-index:2147483000;background:#AADD66;color:#051914;border:1px solid rgba(5,25,20,.18);border-radius:999px;padding:7px 11px;font:850 11px Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:0;pointer-events:none;box-shadow:0 8px 20px rgba(5,25,20,.18)}
      html.ssx-selecting:before{content:"Select a section or block";position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:2147483646;background:#AADD66;color:#051914;border:1px solid rgba(5,25,20,.18);border-radius:999px;padding:10px 16px;font:850 13px Inter,ui-sans-serif,system-ui,sans-serif;box-shadow:0 12px 28px rgba(5,25,20,.18);pointer-events:none}
      .ssx-outline{outline:3px dashed #AADD66!important;outline-offset:6px!important;box-shadow:0 0 0 10px rgba(170,221,102,.18)!important}
      #${APP_ID} .ssx-mini-colors{display:flex!important;align-items:center!important;gap:9px!important;margin:0 0 14px!important;padding:10px 12px!important;border:1px solid rgba(5,25,20,.12)!important;border-radius:16px!important;background:rgba(252,246,235,.58)!important}
      #${APP_ID} .ssx-mini-colors span{font:850 12px Inter,ui-sans-serif,system-ui,sans-serif!important;color:#051914!important;margin-right:auto!important}
      #${APP_ID} .ssx-mini-colors label{width:28px!important;height:28px!important;border-radius:999px!important;overflow:hidden!important;border:1px solid rgba(5,25,20,.18)!important;display:block!important}
      #${APP_ID} .ssx-mini-colors input{width:38px!important;height:38px!important;border:0!important;padding:0!important;transform:translate(-5px,-5px)!important}
      #${APP_ID} .ssx-publish{border-color:#AADD66!important;box-shadow:0 0 0 1px rgba(5,25,20,.08) inset,0 0 22px rgba(170,221,102,.22)!important}
      #${APP_ID} .ssx-footer .ssx-copy.primary{position:relative!important;text-align:left!important;padding-left:22px!important;padding-right:54px!important}
      #${APP_ID} .ssx-footer .ssx-copy.primary:after{content:"↗";position:absolute;right:6px;top:6px;width:36px;height:36px;border-radius:999px;background:#AADD66;color:#051914;display:grid;place-items:center;font-size:18px;font-weight:900;box-shadow:inset 0 0 0 1px rgba(5,25,20,.12)}
      @media(max-width:720px){#${APP_ID}{top:8px;right:8px;width:calc(100vw - 16px)}.ssx-main{max-height:60vh}.ssx-effect{grid-template-columns:58px minmax(0,1fr);gap:8px}.ssx-preview{height:52px}.ssx-color-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function logoSvg() {
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M31 12c6 4 7 12 1 18-6-5-7-13-1-18Z"/><path d="M29 30C18 22 9 26 7 39c11 3 19 0 22-9Z"/><path d="M35 30c11-8 20-4 22 9-11 3-19 0-22-9Z"/><path d="M29 43C17 34 7 38 4 54c13 3 23-1 25-11Z"/><path d="M35 43c12-9 22-5 25 11-13 3-23-1-25-11Z"/><path d="M29.5 27h5v31h-5z"/></svg>`;
  }

  function renderPanel() {
    ensureBaseStyles();
    rememberMainScroll();
    document.getElementById(APP_ID)?.remove();
    document.querySelector(".ssx-collapsed")?.remove();

    if (!isDesignerMode() || localStorage.getItem(PANEL_KEY) === "0") {
      renderCollapsed();
      return;
    }

    const root = document.createElement("div");
    root.id = APP_ID;
    if (selecting) root.classList.add("ssx-is-picking");
    const panelPosition = loadPanelPosition();
    if (panelPosition) {
      root.style.left = `${panelPosition.x}px`;
      root.style.top = `${panelPosition.y}px`;
      root.style.right = "auto";
    }
    root.innerHTML = `
      <div class="ssx-panel" role="dialog" aria-label="Studio Poema">
        <div class="ssx-head" data-ssx-drag>
          <div class="ssx-brand">
            ${activeTool || activeFeature ? `<button class="ssx-back" type="button" data-ssx-back>← Back</button>` : `<div class="ssx-logo">${logoSvg()}</div>`}
          </div>
          <div>
            <div class="ssx-title">Studio Poema</div>
            <div class="ssx-subtitle">v39 · tested blur reveal</div>
          </div>
          <div class="ssx-icon-row">
            <button class="ssx-icon ssx-pick-button" type="button" data-ssx-pick title="Select section">${selecting ? "Selecting..." : "Select section"}</button>
            <button class="ssx-icon" type="button" data-ssx-help-toggle title="Help">?</button>
            <button class="ssx-icon" type="button" data-ssx-clear-target title="Reset current target">↺</button>
            <div class="ssx-top-scope" role="group" aria-label="Editing scope">
              <button type="button" data-ssx-scope="selected" aria-pressed="${config.scope !== "global"}">Section</button>
              <button type="button" data-ssx-scope="global" aria-pressed="${config.scope === "global"}">Whole page</button>
            </div>
            <button class="ssx-icon" type="button" data-ssx-close title="Hide panel">×</button>
          </div>
        </div>
        <div class="ssx-body">
          <main class="ssx-main">
            ${helpOpen ? `<section class="ssx-how">
              <div class="ssx-how-title">How to use</div>
              <p>Select a block, open Text, then use the dropdown groups to apply tested text effects.</p>
            </section>` : ""}
            ${renderMainContent()}
          </main>
        </div>
        <div class="ssx-hover-preview" aria-hidden="true">
          <div class="ssx-hover-title">Preview</div>
          <p>Hover a feature to see what it does.</p>
        </div>
        <div class="ssx-footer">
          <button class="ssx-copy" type="button" data-ssx-clear>Reset</button>
          <button class="ssx-copy" type="button" data-ssx-copy-css>Copy CSS</button>
          <button class="ssx-copy primary" type="button" data-ssx-publish>Publish</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    bindPanel(root);
    restoreMainScroll(root);
    syncSelectedIndicator();
  }

  function rememberMainScroll() {
    const main = document.querySelector(`#${APP_ID} .ssx-main`);
    if (main) savedMainScrollTop = main.scrollTop || 0;
  }

  function restoreMainScroll(root) {
    const main = root.querySelector(".ssx-main");
    if (!main) return;
    const top = savedMainScrollTop || 0;
    if (top) main.scrollTop = top;
    requestAnimationFrame(() => {
      if (top) main.scrollTop = top;
      keepTextAnchorVisible(root);
    });
  }

  function keepTextAnchorVisible(root) {
    const main = root.querySelector(".ssx-main");
    if (pendingEffectAnchor) {
      const effectButton = [...root.querySelectorAll("[data-ssx-feature-effect]")].find((button) => button.dataset.ssxFeatureEffect === pendingEffectAnchor);
      if (effectButton && main && Number.isFinite(pendingEffectOffset)) {
        const mainRect = main.getBoundingClientRect();
        const buttonRect = effectButton.getBoundingClientRect();
        main.scrollTop += buttonRect.top - mainRect.top - pendingEffectOffset;
      } else if (effectButton && effectButton.scrollIntoView) {
        effectButton.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
      pendingEffectAnchor = "";
      pendingEffectOffset = null;
      pendingTextAnchor = "";
      return;
    }
    if (pendingTextAnchor) {
      const button = root.querySelector(`[data-ssx-text-section="${cssEscape(pendingTextAnchor)}"]`);
      if (button && button.scrollIntoView) {
        button.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
      pendingTextAnchor = "";
    }
  }

  function captureRelativeOffset(element) {
    const main = element && element.closest(".ssx-main");
    if (!main || !element.getBoundingClientRect) return null;
    return element.getBoundingClientRect().top - main.getBoundingClientRect().top;
  }

  function renderThemeControls() {
    const theme = config.theme || defaultConfig.theme;
    return `
      <section class="ssx-theme">
        <div class="ssx-theme-title">
          <span>Colours & gradients</span>
          <span class="ssx-kicker">Presets + custom</span>
        </div>
        <div class="ssx-palette-row">
          ${palettes.map((palette) => `
            <button class="ssx-palette" type="button" data-ssx-palette="${escapeHtml(palette.id)}" aria-pressed="${theme.palette === palette.id}">
              <span class="ssx-swatch" style="background:${escapeHtml(palette.primary)}"></span>${escapeHtml(palette.label)}
            </button>
          `).join("")}
        </div>
        <div class="ssx-color-grid">
          ${[
            ["primary", "Brand"],
            ["accent", "Highlight"],
            ["soft", "Background"],
            ["gradientA", "Gradient 1"],
            ["gradientB", "Gradient 2"],
            ["ink", "Text"]
          ].map(([key, label]) => `
            <label>${label}<input type="color" value="${escapeHtml(theme[key])}" data-ssx-color="${key}"></label>
          `).join("")}
        </div>
        <p class="ssx-theme-note">Pick a preset, then adjust any color below. Your edited palette is saved as custom.</p>
      </section>
    `;
  }

  function renderMainContent() {
    if (activeFeature) return renderFeatureDetail(activeFeature);
    return renderStudioDashboard();
  }

  function renderStudioDashboard() {
    const kind = targetKind(config.activeTarget);
    const features = featuresForCurrentTarget();
    return `
      <section class="ssx-studio-hero">
        <div>
          <div class="ssx-tool-title">Features</div>
          <p class="ssx-tool-desc">${escapeHtml(targetKindLabel(kind))} tools · ${config.scope === "global" ? "All pages" : "Selected area"}</p>
        </div>
        <span class="ssx-scope-pill">Editing: ${config.scope === "global" ? "Whole page" : targetLabel(config.activeTarget)}</span>
      </section>
      <div class="ssx-feature-list">
        ${features.map((feature) => `
          <button class="ssx-feature-row" type="button" data-ssx-feature="${escapeHtml(feature.id)}" data-ssx-help="${escapeHtml(feature.description)}">
            <span class="ssx-feature-icon">${escapeHtml(feature.icon)}</span>
            <span>
              <strong>${escapeHtml(feature.title)}</strong>
              <em>${escapeHtml(feature.description)}</em>
            </span>
            <span class="ssx-feature-value">${escapeHtml(featureValue(feature))}</span>
            <span class="ssx-chevron">⌄</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderFeatureDetail(featureId) {
    const feature = featureLibrary.find((item) => item.id === featureId) || featureLibrary[0];
    if (feature.id === "text-suite") return renderTextSuite(feature);
    if (feature.id === "image-suite") return renderImageSuite(feature);
    const options = feature.options.map((id) => effectById.get(id)).filter(Boolean);
    return `
      <div class="ssx-feature-head">
        <button class="ssx-inline-back" type="button" data-ssx-feature-back>← Back</button>
        <div>
          <div class="ssx-tool-title">${escapeHtml(feature.title)}</div>
          <p class="ssx-tool-desc">${escapeHtml(feature.description)}</p>
        </div>
      </div>
      ${renderFeatureColorControls(feature)}
      <div class="ssx-option-list">
        ${renderNoneOption(feature)}
        ${options.length ? options.map((effect) => renderFeatureOption(feature, effect)).join("") : `
          <article class="ssx-option-card">
            <div class="ssx-option-row" aria-pressed="false">
              <span>No text effect added yet</span>
              <span class="ssx-feature-value">Ready for first test</span>
            </div>
          </article>
        `}
      </div>
    `;
  }

  function renderTextSuite(feature) {
    return `
      <div class="ssx-text-head">
        <button class="ssx-inline-back" type="button" data-ssx-feature-back>← Back</button>
        <div>
          <div class="ssx-tool-title">Text</div>
          <p class="ssx-tool-desc">Choose a dropdown, select an option, then tune the controls below it.</p>
        </div>
        <span class="ssx-scope-pill">Editing: ${config.scope === "global" ? "Whole page" : targetLabel(config.activeTarget)}</span>
      </div>
      <div class="ssx-text-suite">
        <button class="ssx-text-none" type="button" data-ssx-feature-none="${escapeHtml(feature.id)}">
          <span>Clear all text effects</span>
          <span>×</span>
        </button>
        ${textSections.map((section) => renderTextSection(feature, section)).join("")}
      </div>
    `;
  }

  function renderImageSuite(feature) {
    return `
      <div class="ssx-text-head">
        <button class="ssx-inline-back" type="button" data-ssx-feature-back>← Back</button>
        <div>
          <div class="ssx-tool-title">Image</div>
          <p class="ssx-tool-desc">Choose an image dropdown, select an option, then tune the controls below it.</p>
        </div>
        <span class="ssx-scope-pill">Editing: ${config.scope === "global" ? "Whole page" : targetLabel(config.activeTarget)}</span>
      </div>
      <div class="ssx-text-suite">
        <button class="ssx-text-none" type="button" data-ssx-feature-none="${escapeHtml(feature.id)}">
          <span>Clear all image effects</span>
          <span>×</span>
        </button>
        ${imageSections.map((section) => renderTextSection(feature, section)).join("")}
      </div>
    `;
  }

  function renderTextSection(feature, section) {
    const isOpen = activeTextSection === section.id;
    const active = section.options.some((id) => {
      const effect = effectById.get(id);
      return effect && getEffectSettings(currentScopeTarget(effect), id).enabled;
    });
    if (section.id === "block") {
      return `
        <section class="ssx-text-section ${isOpen ? "is-open" : ""}">
          <button class="ssx-text-toggle" type="button" data-ssx-text-section="${escapeHtml(section.id)}" aria-expanded="${isOpen}">
            <span class="ssx-text-section-icon">${escapeHtml(section.icon)}</span>
            <span>
              <strong>${escapeHtml(section.title)}</strong>
              <em>${escapeHtml(section.description)}</em>
            </span>
            ${active ? `<b>Active</b>` : ""}
            <span class="ssx-text-caret">${isOpen ? "⌃" : "⌄"}</span>
          </button>
          ${isOpen ? `
            <div class="ssx-text-options">
              <button class="ssx-text-option" type="button" data-ssx-text-section-none="${escapeHtml(section.id)}" aria-pressed="${!active}">
                <span>None</span>
                <span>${!active ? "✓" : ""}</span>
              </button>
              <div class="ssx-text-controls">
                ${renderBlockStylingControls()}
              </div>
            </div>
          ` : ""}
        </section>
      `;
    }
    if (section.id === "cursor") {
      return `
        <section class="ssx-text-section ${isOpen ? "is-open" : ""}">
          <button class="ssx-text-toggle" type="button" data-ssx-text-section="${escapeHtml(section.id)}" aria-expanded="${isOpen}">
            <span class="ssx-text-section-icon">${escapeHtml(section.icon)}</span>
            <span>
              <strong>${escapeHtml(section.title)}</strong>
              <em>${escapeHtml(section.description)}</em>
            </span>
            ${active ? `<b>Active</b>` : ""}
            <span class="ssx-text-caret">${isOpen ? "⌃" : "⌄"}</span>
          </button>
          ${isOpen ? `
            <div class="ssx-text-options">
              <button class="ssx-text-option" type="button" data-ssx-text-section-none="${escapeHtml(section.id)}" aria-pressed="${!active}">
                <span>None</span>
                <span>${!active ? "✓" : ""}</span>
              </button>
              <div class="ssx-text-controls">
                ${renderCursorControls()}
              </div>
            </div>
          ` : ""}
        </section>
      `;
    }
    return `
      <section class="ssx-text-section ${isOpen ? "is-open" : ""}">
        <button class="ssx-text-toggle" type="button" data-ssx-text-section="${escapeHtml(section.id)}" aria-expanded="${isOpen}">
          <span class="ssx-text-section-icon">${escapeHtml(section.icon)}</span>
          <span>
            <strong>${escapeHtml(section.title)}</strong>
            <em>${escapeHtml(section.description)}</em>
          </span>
          ${active ? `<b>Active</b>` : ""}
          <span class="ssx-text-caret">${isOpen ? "⌃" : "⌄"}</span>
        </button>
        ${isOpen ? `
          <div class="ssx-text-options">
            <button class="ssx-text-option" type="button" data-ssx-text-section-none="${escapeHtml(section.id)}" aria-pressed="${!active}">
              <span>None</span>
              <span>${!active ? "✓" : ""}</span>
            </button>
            ${section.options.map((id) => {
              const effect = effectById.get(id);
              return effect ? renderTextOption(feature, section, effect) : "";
            }).join("")}
          </div>
        ` : ""}
      </section>
    `;
  }

  function renderTextOption(feature, section, effect) {
    const selector = currentScopeTarget(effect);
    const settings = getEffectSettings(selector, effect.id);
    const disabledGlobalMotion = selector === "body" && (effect.className || /^txt-block-/.test(effect.id));
    return `
      <article class="ssx-text-option-card">
        <button class="ssx-text-option" type="button" data-ssx-feature-effect="${escapeHtml(feature.id)}:${escapeHtml(effect.id)}" aria-pressed="${settings.enabled}" ${disabledGlobalMotion ? "disabled" : ""}>
          <span>
            <strong>${escapeHtml(cleanTextLabel(effect.label))}</strong>
          </span>
          <span>${settings.enabled ? "✓" : ""}</span>
        </button>
        ${settings.enabled && shouldRenderTextControls(section, effect) ? `
          <div class="ssx-text-controls">
            ${renderTextControls(section, effect, settings, disabledGlobalMotion)}
          </div>
        ` : ""}
      </article>
    `;
  }

  function shouldRenderTextControls(section, effect) {
    if (section.id !== "text-options") return true;
    return /^txt-format-/.test(effect.id) || /^txt-color-/.test(effect.id);
  }

  function blockSetting(id) {
    const effect = effectById.get(id);
    return getEffectSettings(currentScopeTarget(effect), id);
  }

  function renderBlockStylingControls() {
    const theme = config.theme || defaultConfig.theme;
    const disabled = currentScopeTarget(effectById.get("txt-block-opacity")) === "body";
    const opacity = blockSetting("txt-block-opacity");
    const rotate = blockSetting("txt-block-rotate");
    const blur = blockSetting("txt-block-blur");
    const background = blockSetting("txt-block-background");
    const corners = blockSetting("txt-block-corners");
    const border = blockSetting("txt-block-border");
    const shadow = blockSetting("txt-block-shadow");
    const margin = blockSetting("txt-block-margin");
    const sideMargin = blockSetting("txt-block-margin-x");
    const opacityValue = opacity.intensity || 100;
    const rotateValue = rotate.intensity || 50;
    const blurValue = blur.intensity || 0;
    const cornerValue = corners.intensity || 50;
    const marginValue = margin.intensity || 50;
    const sideValue = sideMargin.intensity || 0;
    return `
      ${disabled ? `<div class="ssx-control-title">Select a section or block first</div>` : ""}
      <label class="ssx-control-line"><span>Opacity</span><em>${opacity.enabled ? `${opacityValue}%` : "100%"}</em><input type="range" min="0" max="100" value="${opacityValue}" data-ssx-intensity="txt-block-opacity" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
      <label class="ssx-control-line"><span>Rotate</span><em>${rotate.enabled ? `${Math.round((rotateValue - 50) * .18)}°` : "0°"}</em><input type="range" min="0" max="100" value="${rotateValue}" data-ssx-intensity="txt-block-rotate" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
      <label class="ssx-control-line"><span>Blur</span><em>${blur.enabled ? `${Math.round(blurValue * .08)}px` : "0px"}</em><input type="range" min="0" max="100" value="${blurValue}" data-ssx-intensity="txt-block-blur" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
      <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-block-background" ${disabled ? "disabled" : ""}><span>Background</span><b class="ssx-toggle-dot ${background.enabled ? "is-on" : ""}"></b></button>
      <div class="ssx-control-grid">
        <label class="ssx-control-card">
          <span>Color</span>
          <input type="color" value="${escapeHtml(theme.gradientB || defaultConfig.theme.gradientB)}" data-ssx-color="gradientB" ${disabled ? "disabled" : ""}>
        </label>
        <label class="ssx-control-card">
          <small>Corners</small><span>${cornerValue > 66 ? "Round" : cornerValue < 34 ? "Sharp" : "Softer"}</span>
          <input type="range" min="0" max="100" value="${cornerValue}" data-ssx-intensity="txt-block-corners" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}>
        </label>
      </div>
      <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-block-border" ${disabled ? "disabled" : ""}><span>Border</span><b class="ssx-toggle-dot ${border.enabled ? "is-on" : ""}"></b></button>
      <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-block-shadow" ${disabled ? "disabled" : ""}><span>Shadow</span><b class="ssx-toggle-dot ${shadow.enabled ? "is-on" : ""}"></b></button>
      <label class="ssx-control-line"><span>Top & bottom</span><em>${margin.enabled ? `${Math.round(8 + (marginValue / 100) * 72)}px` : "0px"}</em><input type="range" min="0" max="100" value="${marginValue}" data-ssx-intensity="txt-block-margin" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
      <label class="ssx-control-line"><span>Left & right</span><em>${sideMargin.enabled ? `${Math.round((sideValue / 100) * 80)}px` : "0px"}</em><input type="range" min="0" max="100" value="${sideValue}" data-ssx-intensity="txt-block-margin-x" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
    `;
  }

  function renderCursorControls() {
    const theme = config.theme || defaultConfig.theme;
    const emoji = blockSetting("txt-cursor-emoji");
    const large = blockSetting("txt-cursor-large");
    const hide = blockSetting("txt-cursor-hide");
    const sizeValue = large.enabled ? large.intensity || 60 : emoji.intensity || 60;
    const selectedEmoji = Math.max(0, Math.min(cursorEmojiOptions.length - 1, Math.round(param(emoji, "emoji", 0) / (100 / Math.max(1, cursorEmojiOptions.length - 1)))));
    return `
      <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-cursor-emoji"><span>Emoji cursor</span><em>${escapeHtml(cursorEmojiOptions[selectedEmoji] || "☺")}</em><b class="ssx-toggle-dot ${emoji.enabled ? "is-on" : ""}"></b></button>
      ${emoji.enabled ? `<div class="ssx-emoji-grid">${cursorEmojiOptions.map((item, index) => `<button type="button" data-ssx-cursor-emoji="${index}" aria-pressed="${index === selectedEmoji}">${escapeHtml(item)}</button>`).join("")}</div>` : ""}
      <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-cursor-large"><span>Large dot cursor</span><em>${Math.round(24 + sizeValue * .42)}px</em><b class="ssx-toggle-dot ${large.enabled ? "is-on" : ""}"></b></button>
      ${large.enabled ? `<label class="ssx-control-line"><span>Dot color</span><input type="color" value="${escapeHtml(theme.accent || defaultConfig.theme.accent)}" data-ssx-color="accent"></label>` : ""}
      <label class="ssx-control-line"><span>Cursor size</span><em>${Math.round(24 + sizeValue * .42)}px</em><input type="range" min="0" max="100" value="${sizeValue}" data-ssx-intensity="${large.enabled ? "txt-cursor-large" : "txt-cursor-emoji"}" data-ssx-auto-enable="true"></label>
      <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-cursor-hide"><span>Hide default cursor</span><b class="ssx-toggle-dot ${hide.enabled ? "is-on" : ""}"></b></button>
    `;
  }

  function renderTextControls(section, effect, settings, disabled) {
    const label = cleanTextLabel(effect.label);
    const value = settings.intensity;
    const theme = config.theme || defaultConfig.theme;
    const speed = value > 68 ? "Fast" : value < 34 ? "Slow" : "Medium";
    const size = value > 68 ? "Large" : value < 34 ? "Small" : "Medium";
    const colorControl = (name, key) => `
      <label class="ssx-control-line">
        <span>${name}</span>
        <input type="color" value="${escapeHtml(theme[key] || defaultConfig.theme[key])}" data-ssx-color="${escapeHtml(key)}" ${disabled ? "disabled" : ""}>
      </label>
    `;
    const colorCard = (name, key) => `
      <label class="ssx-control-card">
        <span>${name}</span>
        <input type="color" value="${escapeHtml(theme[key] || defaultConfig.theme[key])}" data-ssx-color="${escapeHtml(key)}" ${disabled ? "disabled" : ""}>
      </label>
    `;
    const colorRows = `
      ${colorControl("Text color", "primary")}
      ${colorControl("Accent color", "accent")}
    `;
    if (section.id === "image-styles") {
      const corner = /solid-shadow/i.test(effect.id) ? "Bottom right" : "All corners";
      return `
        ${colorControl(/shadow/i.test(effect.id) ? "Shadow color" : "Accent color", /shadow/i.test(effect.id) ? "primary" : "accent")}
        <button class="ssx-control-line" type="button" disabled><span>Corner</span><em>${corner}</em></button>
        ${effect.params && effect.params.length ? `<label class="ssx-control-line"><span>${escapeHtml(effect.params[0].label)}</span><em>${param(settings, effect.params[0].key, effect.params[0].value)}</em><input type="range" min="0" max="100" value="${param(settings, effect.params[0].key, effect.params[0].value)}" data-ssx-param-effect="${escapeHtml(effect.id)}" data-ssx-param-key="${escapeHtml(effect.params[0].key)}" ${disabled ? "disabled" : ""}></label>` : ""}
        <label class="ssx-control-line"><span>${/border/i.test(effect.id) ? "Border width" : "Corners"}</span><em>${Math.round(value)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "image-click") {
      return `
        ${colorControl("Background color", "primary")}
        <label class="ssx-control-line"><span>Custom text</span><input type="text" value="${escapeHtml(settings.customText || (/pill/i.test(effect.id) ? "Open" : "View"))}" data-ssx-custom-text-effect="${escapeHtml(effect.id)}" maxlength="40" ${disabled ? "disabled" : ""}></label>
        <button class="ssx-control-line" type="button" data-ssx-switch-effect="${escapeHtml(nextTextOptionEffect(effect.id, section.options))}"><span>Style</span><em>${/pill/i.test(effect.id) ? "Pill" : "Overlay"}</em><b>‹ ›</b></button>
        <label class="ssx-control-line"><span>Opacity</span><em>${Math.round(value)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "image-shapes") {
      return `
        ${colorControl("Shape color", "accent")}
        <label class="ssx-control-line"><span>Speed</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "image-scroll") {
      const distance = param(settings, "distance", /scale/i.test(effect.id) ? 55 : 72);
      return `
        <label class="ssx-control-line"><span>Animation speed</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        ${effect.params && effect.params.length ? `<label class="ssx-control-line"><span>${escapeHtml(effect.params[0].label)}</span><em>${distance}</em><input type="range" min="0" max="100" value="${distance}" data-ssx-param-effect="${escapeHtml(effect.id)}" data-ssx-param-key="${escapeHtml(effect.params[0].key)}" ${disabled ? "disabled" : ""}></label>` : ""}
      `;
    }
    if (section.id === "image-loop" || section.id === "image-hover" || section.id === "image-reveal") {
      return `
        <label class="ssx-control-line"><span>${section.id === "image-hover" ? "Hover speed" : "Animation speed"}</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "image-block") {
      return `
        ${colorControl(/border/i.test(effect.id) ? "Border color" : /shadow/i.test(effect.id) ? "Shadow color" : "Background color", /shadow|border/i.test(effect.id) ? "primary" : "gradientB")}
        <label class="ssx-control-line"><span>Amount</span><em>${Math.round(value)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "image-visibility") {
      return `
        <button class="ssx-control-line" type="button" data-ssx-switch-effect="${escapeHtml(nextTextOptionEffect(effect.id, section.options))}"><span>Hide on</span><em>${/mobile/i.test(effect.id) ? "Mobile" : "Desktop"}</em><b>‹ ›</b></button>
      `;
    }
    if (section.id === "image-cursor") {
      return `
        <button class="ssx-control-line" type="button"><span>Enter cursor here</span><em>${/emoji/i.test(effect.id) ? "☺" : "Dot"}</em></button>
        <label class="ssx-control-line"><span>Cursor size</span><em>${Math.round(24 + value * .42)}px</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "text-options") {
      if (/^txt-color-/.test(effect.id)) {
        const colorKey = effect.id === "txt-color-accent" ? "accent" : "primary";
        const secondaryKey = effect.id === "txt-color-accent" ? "primary" : "accent";
        return `
          <div class="ssx-control-title">${effect.id === "txt-color-accent" ? "Accent color" : "Text color"}</div>
          <div class="ssx-control-grid">
            ${colorCard(effect.id === "txt-color-accent" ? "Accent" : "Text", colorKey)}
            ${colorCard(effect.id === "txt-color-accent" ? "Text" : "Accent", secondaryKey)}
          </div>
          <button class="ssx-control-line" type="button" data-ssx-switch-effect="${escapeHtml(effect.id === "txt-color-accent" ? "txt-color-primary" : "txt-color-accent")}"><span>Color target</span><em>${effect.id === "txt-color-accent" ? "Accent" : "Text"}</em><b>‹ ›</b></button>
        `;
      }
      const formatIds = ["txt-format-strike", "txt-format-bold", "txt-format-italic", "txt-format-uppercase"];
      const alignIds = ["txt-align-left", "txt-align-center", "txt-align-right"];
      const activeFormatId = formatIds.find((id) => getEffectSettings(currentScopeTarget(effectById.get(id)), id).enabled) || (formatIds.includes(effect.id) ? effect.id : "txt-format-strike");
      const activeAlignId = alignIds.find((id) => getEffectSettings(currentScopeTarget(effectById.get(id)), id).enabled) || "";
      const sizeEffect = effectById.get("txt-size-desktop");
      const mobileEffect = effectById.get("txt-size-mobile");
      const lineEffect = effectById.get("txt-line-gap");
      const sizeSettings = getEffectSettings(currentScopeTarget(sizeEffect), "txt-size-desktop");
      const mobileSettings = getEffectSettings(currentScopeTarget(mobileEffect), "txt-size-mobile");
      const lineSettings = getEffectSettings(currentScopeTarget(lineEffect), "txt-line-gap");
      const sizeValue = sizeSettings.intensity || 60;
      const mobileValue = mobileSettings.intensity || 60;
      const lineValue = lineSettings.intensity || 60;
      return `
        <div class="ssx-control-title">Paragraph 2</div>
        <div class="ssx-control-grid">
          ${colorCard("Color", "primary")}
          <button class="ssx-control-card" type="button" data-ssx-switch-effect="${escapeHtml(nextTextOptionEffect(activeFormatId, formatIds))}"><small>Formatting</small><span>${escapeHtml(cleanTextLabel(effectById.get(activeFormatId).label))}</span><b>‹ ›</b></button>
          <label class="ssx-control-card"><small>Size</small><span>${Math.round(18 + sizeValue * .22)}px</span><input type="range" min="0" max="100" value="${sizeValue}" data-ssx-intensity="txt-size-desktop" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
          <button class="ssx-control-card" type="button" data-ssx-switch-effect="${escapeHtml(activeAlignId ? nextTextOptionEffect(activeAlignId, alignIds) : "txt-align-left")}"><small>Align</small><span>${activeAlignId ? escapeHtml(cleanTextLabel(effectById.get(activeAlignId).label)) : "Auto"}</span><b>‹ ›</b></button>
          <label class="ssx-control-card"><small>Mobile size</small><span>${mobileSettings.enabled ? `${Math.round(14 + mobileValue * .1)}px` : "Auto"}</span><input type="range" min="0" max="100" value="${mobileValue}" data-ssx-intensity="txt-size-mobile" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
          <label class="ssx-control-card"><small>Line gap</small><span>${lineSettings.enabled ? (lineValue > 68 ? "Wide" : lineValue < 34 ? "Tight" : "Auto") : "Auto"}</span><input type="range" min="0" max="100" value="${lineValue}" data-ssx-intensity="txt-line-gap" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
        </div>
      `;
    }
    if (section.id === "heading") {
      if (effect.id === "txt-heading-gradient-live") {
        const direction = param(settings, "direction", 25);
        const typeValue = param(settings, "type", 0);
        return `
          ${colorControl("Text color", "primary")}
          ${colorControl("Accent color", "accent")}
          <button class="ssx-control-line" type="button" data-ssx-param-toggle="txt-heading-gradient-live:type" data-ssx-param-value="${typeValue > 50 ? "0" : "100"}"><span>Gradient type</span><em>${typeValue > 50 ? "Radial" : "Linear"}</em><b>‹ ›</b></button>
          <label class="ssx-control-line"><span>Gradient direction</span><em>${Math.round(direction * 3.6)}°</em><input type="range" min="0" max="100" value="${direction}" data-ssx-param-effect="txt-heading-gradient-live" data-ssx-param-key="direction" ${disabled ? "disabled" : ""}></label>
          <label class="ssx-control-line"><span>Animation speed</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        `;
      }
      if (effect.id === "txt-heading-fill") {
        return `
          ${colorControl("Fill color", "accent")}
          ${colorControl("Text color", "primary")}
          <label class="ssx-control-line"><span>Fill height</span><em>${Math.round(40 + value * .6)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        `;
      }
      return `
        ${colorRows}
        <label class="ssx-control-line"><span>${effect.id === "txt-heading-stroke" ? "Stroke width" : "Style amount"}</span><em>${Math.round(value)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "paragraph") {
      return `
        ${colorControl("Fill color", "gradientB")}
        ${colorControl("Text color", "primary")}
        <button class="ssx-control-line" type="button" data-ssx-switch-effect="${escapeHtml(nextTextOptionEffect(effect.id, section.options))}"><span>Style</span><em>${/underline/i.test(label) ? "Line" : "Square"}</em><b>− +</b></button>
        <label class="ssx-control-line"><span>Fill height</span><em>${Math.round(40 + value * .6)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "links") {
      return `
        ${colorRows}
        <label class="ssx-control-line"><span>Animation speed</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "scroll") {
      const distance = param(settings, "distance", /scale/i.test(effect.id) ? 55 : 72);
      const blur = param(settings, "blur", 62);
      const stagger = param(settings, "stagger", 40);
      return `
        <label class="ssx-control-line"><span>Animation speed</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        ${effect.params && effect.params.length ? `<label class="ssx-control-line"><span>${escapeHtml(effect.params[0].label)}</span><em>${distance}</em><input type="range" min="0" max="100" value="${distance}" data-ssx-param-effect="${escapeHtml(effect.id)}" data-ssx-param-key="${escapeHtml(effect.params[0].key)}" ${disabled ? "disabled" : ""}></label>` : ""}
        ${effect.id === "txt-scroll-blur-reveal" ? `<label class="ssx-control-line"><span>Blur amount</span><em>${blur}</em><input type="range" min="0" max="100" value="${blur}" data-ssx-param-effect="${escapeHtml(effect.id)}" data-ssx-param-key="blur" ${disabled ? "disabled" : ""}></label>` : ""}
        ${effect.id === "txt-scroll-blur-reveal" ? `<label class="ssx-control-line"><span>Word delay</span><em>${stagger}</em><input type="range" min="0" max="100" value="${stagger}" data-ssx-param-effect="${escapeHtml(effect.id)}" data-ssx-param-key="stagger" ${disabled ? "disabled" : ""}></label>` : ""}
      `;
    }
    if (section.id === "block") {
      return `
        <label class="ssx-control-line"><span>Opacity</span><em>${Math.round(value)}%</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        <label class="ssx-control-line"><span>Rotate</span><em>${Math.round((value - 50) * .18)}°</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        <label class="ssx-control-line"><span>Blur</span><em>${Math.round(value * .08)}px</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
        <button class="ssx-control-line" type="button"><span>Background</span><b class="ssx-toggle-dot is-on"></b></button>
        <div class="ssx-control-grid">
          ${colorCard("Color", "gradientB")}
          <button class="ssx-control-card" type="button" data-ssx-switch-effect="txt-block-corners"><small>Corners</small><span>${value > 66 ? "Round" : value < 34 ? "Sharp" : "Softer"}</span><b>− +</b></button>
        </div>
        <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-block-border"><span>Border</span><b class="ssx-toggle-dot ${effect.id === "txt-block-border" ? "is-on" : ""}"></b></button>
        <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-block-shadow"><span>Shadow</span><b class="ssx-toggle-dot ${effect.id === "txt-block-shadow" ? "is-on" : ""}"></b></button>
        <label class="ssx-control-line"><span>Margin</span><em>${Math.round(value)}px</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
      `;
    }
    if (section.id === "cursor") {
      const emoji = blockSetting("txt-cursor-emoji");
      const large = blockSetting("txt-cursor-large");
      const selectedEmoji = Math.max(0, Math.min(cursorEmojiOptions.length - 1, Math.round(param(emoji, "emoji", 0) / (100 / Math.max(1, cursorEmojiOptions.length - 1)))));
      return `
        <div class="ssx-control-line"><span>Cursor preview</span><em>${/emoji/i.test(effect.label) ? escapeHtml(cursorEmojiOptions[selectedEmoji] || "☺") : "Dot"}</em></div>
        ${/emoji/i.test(effect.id) ? `<div class="ssx-emoji-grid">${cursorEmojiOptions.map((item, index) => `<button type="button" data-ssx-cursor-emoji="${index}" aria-pressed="${index === selectedEmoji}">${escapeHtml(item)}</button>`).join("")}</div>` : ""}
        <button class="ssx-control-line" type="button" data-ssx-switch-effect="txt-cursor-hide"><span>Hide default cursor</span><b class="ssx-toggle-dot ${/hide/i.test(effect.label) ? "is-on" : ""}"></b></button>
        ${/large/i.test(effect.id) ? colorControl("Dot color", "accent") : ""}
        <div class="ssx-control-grid">
          <label class="ssx-control-card"><small>Size</small><span>${size}</span><input type="range" min="0" max="100" value="${large.enabled ? large.intensity || value : value}" data-ssx-intensity="${escapeHtml(effect.id)}" data-ssx-auto-enable="true" ${disabled ? "disabled" : ""}></label>
        </div>
      `;
    }
    return `
      <label class="ssx-control-line"><span>Animation speed</span><em>${speed}</em><input type="range" min="0" max="100" value="${value}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabled ? "disabled" : ""}></label>
    `;
  }

  function cleanTextLabel(label) {
    const raw = String(label || "").replace(/^(Text options|Formatting|Size|Line gap|Align|Heading|Paragraph|Links|Scroll|Loop|Hover|Block|Cursor|Image styles|Image click indicator|Animated image shapes|Animate on scroll|Loop animations|Animate on hover|Block styling|Block visibility|Reveal on hover)\s*[·:]\s*/i, "");
    const replacements = {
      "Moving gradient": "Gradient animated",
      "Brush underline": "Underline",
      "Outline stroke": "Stroke",
      "Color split": "Colorful",
      "Soft fill": "Fill",
      "Ribbon stripe": "Candy cane",
      "Lift up": "Up",
      "Float": "Hover"
    };
    return replacements[raw] || raw;
  }

  function allUiSections() {
    return textSections.concat(imageSections);
  }

  function nextTextOptionEffect(currentId, ids) {
    const options = ids.filter((id) => effectById.has(id));
    if (!options.length) return currentId;
    const index = options.indexOf(currentId);
    return options[(index + 1 + options.length) % options.length];
  }

  function renderFeatureColorControls(feature) {
    const wantsColors = /heading|button|header|image|block|shape/.test(feature.id);
    if (!wantsColors) return "";
    const theme = config.theme || defaultConfig.theme;
    return `
      <section class="ssx-mini-colors" aria-label="Feature colors">
        <span>Colors</span>
        ${[
          ["primary", "Brand"],
          ["accent", "Neon"],
          ["gradientA", "Dark"],
          ["gradientB", "Soft"]
        ].map(([key, label]) => `
          <label title="${label}">
            <input type="color" value="${escapeHtml(theme[key])}" data-ssx-color="${key}">
          </label>
        `).join("")}
      </section>
    `;
  }

  function renderNoneOption(feature) {
    const active = feature.options.some((id) => {
      const effect = effectById.get(id);
      return effect && getEffectSettings(currentScopeTarget(effect), id).enabled;
    });
    return `
      <button class="ssx-option-row" type="button" data-ssx-feature-none="${escapeHtml(feature.id)}" aria-pressed="${!active}" data-ssx-preview-title="None" data-ssx-preview-desc="Remove this feature from the current selection.">
        <span>None</span>
        <span class="ssx-option-check">${!active ? "✓" : ""}</span>
      </button>
    `;
  }

  function renderFeatureOption(feature, effect) {
    const selector = currentScopeTarget(effect);
    const settings = getEffectSettings(selector, effect.id);
    const disabledGlobalMotion = selector === "body" && (effect.className || /^txt-block-/.test(effect.id));
    return `
      <article class="ssx-option-card" data-ssx-preview-title="${escapeHtml(effect.label)}" data-ssx-preview-desc="${escapeHtml(effect.description)}">
        <button class="ssx-option-row" type="button" data-ssx-feature-effect="${escapeHtml(feature.id)}:${escapeHtml(effect.id)}" aria-pressed="${settings.enabled}" ${disabledGlobalMotion ? "disabled" : ""}>
          <span><strong>${escapeHtml(effect.label)}</strong><em>${escapeHtml(effect.description)}</em></span>
          <span class="ssx-option-check">${settings.enabled ? "✓" : ""}</span>
        </button>
        <div class="ssx-option-controls">
          <div class="ssx-preview ${escapeHtml(effect.preview || "")}"></div>
          <div>
            <div class="ssx-range-row">
              <input type="range" min="0" max="100" value="${settings.intensity}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabledGlobalMotion ? "disabled" : ""}>
              <div class="ssx-range-label">${escapeHtml(effect.intensityLabel || "Amount")} · ${settings.intensity}</div>
            </div>
            ${renderEffectParams(effect, settings, disabledGlobalMotion)}
          </div>
          <button class="ssx-restore" type="button" data-ssx-restore-effect="${escapeHtml(effect.id)}">Restore</button>
        </div>
      </article>
    `;
  }

  function renderDesignList() {
    return `
      <div class="ssx-tool-title">Design</div>
      <p class="ssx-tool-desc">Select a tool to style the current element. Changes are live and only affect the selected target unless Whole page is active.</p>
      <div class="ssx-design-list">
        ${designTools.map((tool) => `
          <button class="ssx-design-row" type="button" data-ssx-tool="${tool.id}">
            <div>${tool.label}</div>
            <span>${tool.description}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderDesignTool(toolId) {
    const tool = designTools.find((item) => item.id === toolId) || designTools[0];
    const selector = currentScopeTarget();
    const settings = getDesignSettings(selector);
    const group = settings[tool.id] || {};
    return `
      <div class="ssx-tool-head">
        <div>
          <div class="ssx-tool-title">${escapeHtml(tool.label)}</div>
          <p class="ssx-tool-desc">${escapeHtml(tool.description)}</p>
        </div>
        <button class="ssx-restore" type="button" data-ssx-restore-tool="${escapeHtml(tool.id)}">Restore</button>
      </div>
      ${renderToolControls(tool.id, group)}
    `;
  }

  function rangeControl(label, value, group, key, suffix = "") {
    return `
      <div class="ssx-control" data-ssx-control>
        <div class="ssx-control-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}${suffix}</strong></div>
        <input type="range" min="0" max="100" value="${escapeHtml(value)}" data-ssx-design-group="${group}" data-ssx-design-key="${key}">
      </div>
    `;
  }

  function colorControl(label, value, group, key) {
    return `
      <div class="ssx-control">
        <div class="ssx-control-row"><span>${escapeHtml(label)}</span><input type="color" value="${escapeHtml(value || "#17451f")}" data-ssx-design-group="${group}" data-ssx-design-key="${key}"></div>
      </div>
    `;
  }

  function segmentControl(label, value, group, key, options) {
    return `
      <div class="ssx-control">
        <div class="ssx-control-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "Default")}</strong></div>
        <div class="ssx-segment">
          ${options.map((option) => `<button type="button" data-ssx-design-choice="${group}:${key}:${option.value}" aria-pressed="${value === option.value}">${option.label}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderToolControls(toolId, group) {
    if (toolId === "font") {
      return `
        ${rangeControl("Size", group.size || 0, "font", "size", "%")}
        ${colorControl("Color", group.color || "#17451f", "font", "color")}
        ${segmentControl("Text Alignment", group.align || "", "font", "align", [{ label: "None", value: "" }, { label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }])}
        ${rangeControl("Line Height", group.lineHeight ?? 50, "font", "lineHeight", "%")}
        ${rangeControl("Letter Spacing", group.letterSpacing ?? 50, "font", "letterSpacing", "px")}
        ${segmentControl("Text Transform", group.transform || "", "font", "transform", [{ label: "Default", value: "" }, { label: "Upper", value: "uppercase" }, { label: "Lower", value: "lowercase" }, { label: "Caps", value: "capitalize" }])}
      `;
    }
    if (toolId === "layout") {
      return `
        ${segmentControl("Size", group.size || "medium", "layout", "size", [{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }, { label: "Custom", value: "custom" }])}
        ${rangeControl("Max Width", group.maxWidth ?? 50, "layout", "maxWidth", "%")}
        ${rangeControl("Padding", group.padding ?? 50, "layout", "padding", "px")}
        ${rangeControl("Gap", group.gap ?? 50, "layout", "gap", "px")}
      `;
    }
    if (toolId === "background") {
      return `
        ${colorControl("Color", group.color || "#f4efe7", "background", "color")}
        ${rangeControl("Opacity", group.opacity ?? 100, "background", "opacity", "%")}
        ${colorControl("Gradient Top", group.gradientTop || "#17451f", "background", "gradientTop")}
        ${colorControl("Gradient Bottom", group.gradientBottom || "#b7d09e", "background", "gradientBottom")}
        ${rangeControl("Gradient Direction", group.gradientDirection || 0, "background", "gradientDirection", "deg")}
      `;
    }
    if (toolId === "border") {
      return `
        ${segmentControl("Style", group.style || "solid", "border", "style", [{ label: "None", value: "none" }, { label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "Dotted", value: "dotted" }])}
        ${colorControl("Color", group.color || "#17451f", "border", "color")}
        ${rangeControl("Size", group.size || 0, "border", "size", "px")}
        ${rangeControl("Rounded", group.radius || 0, "border", "radius", "px")}
      `;
    }
    if (toolId === "shadow") {
      return `
        ${colorControl("Color", group.color || "#17451f", "shadow", "color")}
        ${rangeControl("Spread", group.spread || 0, "shadow", "spread", "px")}
        ${rangeControl("Blur", group.blur ?? 20, "shadow", "blur", "px")}
        ${rangeControl("Horizontal", group.x ?? 50, "shadow", "x", "%")}
        ${rangeControl("Vertical", group.y ?? 60, "shadow", "y", "%")}
        ${segmentControl("Type", group.inset ? "inset" : "", "shadow", "inset", [{ label: "Outset", value: "" }, { label: "Inset", value: "inset" }])}
      `;
    }
    if (toolId === "position") {
      return `${rangeControl("Horizontal", group.x ?? 50, "position", "x", "%")}${rangeControl("Vertical", group.y ?? 50, "position", "y", "%")}${rangeControl("Rotate", group.rotate ?? 50, "position", "rotate", "deg")}${rangeControl("Scale", group.scale ?? 50, "position", "scale", "%")}`;
    }
    if (toolId === "effects") {
      return `${rangeControl("Glass", group.glass || 0, "effects", "glass", "%")}${rangeControl("Blur", group.blur || 0, "effects", "blur", "px")}${rangeControl("Opacity", group.opacity ?? 100, "effects", "opacity", "%")}${rangeControl("Saturate", group.saturate ?? 50, "effects", "saturate", "%")}`;
    }
    return `${segmentControl("Mobile", group.mobile === false ? "hidden" : "visible", "visibility", "mobile", [{ label: "Show", value: "visible" }, { label: "Hide", value: "hidden" }])}${segmentControl("Desktop", group.desktop === false ? "hidden" : "visible", "visibility", "desktop", [{ label: "Show", value: "visible" }, { label: "Hide", value: "hidden" }])}`;
  }

  function renderEffectList() {
    const group = effectCatalog.find((item) => item.group === activeTab) || effectCatalog[0];
    return group.items.map((effect) => {
      const selector = currentScopeTarget(effect);
      const settings = getEffectSettings(selector, effect.id);
      const disabledGlobalMotion = selector === "body" && (effect.className || /^txt-block-/.test(effect.id));
      return `
        <div class="ssx-effect">
          <div class="ssx-preview ${escapeHtml(effect.preview || "")}" title="${escapeHtml(effect.description)}"></div>
          <div>
            <div class="ssx-effect-top">
              <div>
                <div class="ssx-effect-title">${escapeHtml(effect.label)}</div>
                <div class="ssx-effect-desc">${escapeHtml(effect.description)} ${effect.globalOnly ? "Applies globally." : ""}</div>
              </div>
              <button class="ssx-restore" type="button" data-ssx-restore-effect="${escapeHtml(effect.id)}">Restore</button>
              <label class="ssx-switch" title="${disabledGlobalMotion ? "Pick a section first" : "Enable effect"}">
                <input type="checkbox" data-ssx-effect="${escapeHtml(effect.id)}" ${settings.enabled ? "checked" : ""} ${disabledGlobalMotion ? "disabled" : ""}>
                <span class="ssx-slider"></span>
              </label>
            </div>
            <div class="ssx-range-row">
              <input type="range" min="0" max="100" value="${settings.intensity}" data-ssx-intensity="${escapeHtml(effect.id)}" ${disabledGlobalMotion ? "disabled" : ""}>
              <div class="ssx-range-label">${escapeHtml(effect.intensityLabel || "Amount")} · ${settings.intensity}</div>
            </div>
            ${renderEffectParams(effect, settings, disabledGlobalMotion)}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderEffectParams(effect, settings, disabled) {
    if (!effect.params || !effect.params.length) return "";
    return `
      <div class="ssx-advanced">
        ${effect.params.map((item) => {
          const value = param(settings, item.key, item.value);
          return `
            <div class="ssx-range-row">
              <input type="range" min="0" max="100" value="${value}" data-ssx-param-effect="${escapeHtml(effect.id)}" data-ssx-param-key="${escapeHtml(item.key)}" ${disabled ? "disabled" : ""}>
              <div class="ssx-range-label">${escapeHtml(item.label)} · ${value}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function enablePanelDrag(root) {
    const handle = root.querySelector("[data-ssx-drag]");
    if (!handle) return;
    let drag = null;
    handle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button,input,a,label")) return;
      const rect = root.getBoundingClientRect();
      drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
      root.classList.add("ssx-dragging");
      root.style.left = `${rect.left}px`;
      root.style.top = `${rect.top}px`;
      root.style.right = "auto";
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const width = root.offsetWidth || 420;
      const height = Math.min(root.offsetHeight || 500, window.innerHeight - 16);
      const x = Math.max(8, Math.min(window.innerWidth - width - 8, event.clientX - drag.dx));
      const y = Math.max(8, Math.min(window.innerHeight - Math.min(80, height) - 8, event.clientY - drag.dy));
      root.style.left = `${x}px`;
      root.style.top = `${y}px`;
    });
    const stopDrag = (event) => {
      if (!drag) return;
      const rect = root.getBoundingClientRect();
      savePanelPosition(rect.left, rect.top);
      root.classList.remove("ssx-dragging");
      drag = null;
      try {
        handle.releasePointerCapture(event.pointerId);
      } catch {}
    };
    handle.addEventListener("pointerup", stopDrag);
    handle.addEventListener("pointercancel", stopDrag);
  }

  function bindPanel(root) {
    enablePanelDrag(root);
    root.querySelectorAll("[data-ssx-preview]").forEach((button) => {
      button.addEventListener("click", () => {
        config.preview = button.dataset.ssxPreview;
        saveConfig();
        renderPanel();
        showToast(`${config.preview} preview selected`);
      });
    });
    root.querySelector("[data-ssx-back]")?.addEventListener("click", () => {
      activeTool = null;
      activeFeature = null;
      activeMode = "Studio";
      helpOpen = false;
      renderPanel();
    });
    root.querySelector("[data-ssx-feature-back]")?.addEventListener("click", () => {
      activeFeature = null;
      activeMode = "Studio";
      helpOpen = false;
      renderPanel();
    });
    root.querySelectorAll("[data-ssx-feature]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFeature = button.dataset.ssxFeature;
        activeMode = "Studio";
        helpOpen = false;
        activeTextSection = activeFeature === "image-suite" ? "image-styles" : "heading";
        renderPanel();
      });
    });
    root.querySelector("[data-ssx-help-toggle]")?.addEventListener("click", () => {
      helpOpen = !helpOpen;
      renderPanel();
    });
    root.querySelectorAll("[data-ssx-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTool = button.dataset.ssxTool;
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-restore-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        const selector = currentScopeTarget();
        if (!config.design) config.design = {};
        const current = getDesignSettings(selector);
        current[button.dataset.ssxRestoreTool] = clone(designDefaults[button.dataset.ssxRestoreTool]);
        config.design[selector] = current;
        saveConfig();
        applyEffects();
        renderPanel();
        showToast("Tool restored");
      });
    });
    root.querySelectorAll("[data-ssx-design-group]").forEach((input) => {
      input.addEventListener("input", () => {
        const selector = currentScopeTarget();
        const value = input.type === "color" ? input.value : clampIntensity(input.value);
        setDesignSetting(selector, input.dataset.ssxDesignGroup, { [input.dataset.ssxDesignKey]: value });
        const label = input.closest(".ssx-control")?.querySelector("strong");
        if (label && input.type !== "color") label.textContent = String(value);
      });
    });
    root.querySelectorAll("[data-ssx-design-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const [group, key, rawValue] = button.dataset.ssxDesignChoice.split(":");
        let value = rawValue;
        if (group === "shadow" && key === "inset") value = rawValue === "inset";
        if (group === "visibility") value = rawValue === "visible";
        setDesignSetting(currentScopeTarget(), group, { [key]: value });
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-palette]").forEach((button) => {
      button.addEventListener("click", () => {
        const palette = palettes.find((item) => item.id === button.dataset.ssxPalette);
        if (!palette) return;
        config.theme = { ...config.theme, ...palette };
        saveConfig();
        applyEffects();
        renderPanel();
        showToast(`${palette.label} palette applied`);
      });
    });
    root.querySelectorAll("[data-ssx-color]").forEach((input) => {
      const updateColor = () => {
        config.theme = { ...config.theme, palette: "custom", [input.dataset.ssxColor]: input.value };
        saveConfig();
        applyEffects();
      };
      input.addEventListener("input", updateColor);
      input.addEventListener("change", updateColor);
    });
    root.querySelectorAll("[data-ssx-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.ssxTab;
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-scope]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextScope = button.dataset.ssxScope;
        if (nextScope === "global" && !confirmGlobalScope()) return;
        config.scope = nextScope;
        saveConfig();
        renderPanel();
        showToast(nextScope === "global" ? "Whole page mode enabled" : "Selected section mode enabled");
      });
    });
    root.querySelectorAll("[data-ssx-effect]").forEach((input) => {
      input.addEventListener("change", () => {
        const effect = effectById.get(input.dataset.ssxEffect);
        const selector = currentScopeTarget(effect);
        setEffectSetting(selector, input.dataset.ssxEffect, { enabled: input.checked });
        showToast(input.checked ? "Effect enabled" : "Effect disabled");
      });
    });
    root.querySelectorAll("[data-ssx-feature-none]").forEach((button) => {
      button.addEventListener("click", () => {
        const feature = featureLibrary.find((item) => item.id === button.dataset.ssxFeatureNone);
        if (!feature) return;
        feature.options.forEach((id) => {
          const effect = effectById.get(id);
          if (!effect) return;
          setEffectSetting(currentScopeTarget(effect), id, { enabled: false, intensity: 60, params: {} });
        });
        renderPanel();
        showToast(`${feature.title} removed`);
      });
    });
    root.querySelectorAll("[data-ssx-text-section]").forEach((button) => {
      button.addEventListener("click", () => {
        pendingTextAnchor = button.dataset.ssxTextSection;
        activeTextSection = activeTextSection === button.dataset.ssxTextSection ? "" : button.dataset.ssxTextSection;
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-text-section-none]").forEach((button) => {
      button.addEventListener("click", () => {
        const section = allUiSections().find((item) => item.id === button.dataset.ssxTextSectionNone);
        if (!section) return;
        section.options.forEach((id) => {
          const effect = effectById.get(id);
          if (effect) setEffectSetting(currentScopeTarget(effect), id, { enabled: false, intensity: 60, params: {} });
        });
        renderPanel();
        showToast(`${section.title} cleared`);
      });
    });
    root.querySelectorAll("[data-ssx-feature-effect]").forEach((button) => {
      button.addEventListener("click", () => {
        const [featureId, effectId] = button.dataset.ssxFeatureEffect.split(":");
        const feature = featureLibrary.find((item) => item.id === featureId);
        const effect = effectById.get(effectId);
        if (!feature || !effect) return;
        const current = getEffectSettings(currentScopeTarget(effect), effectId);
        const section = allUiSections().find((item) => item.options.includes(effectId));
        if (section) {
          pendingTextAnchor = section.id;
          pendingEffectAnchor = `${featureId}:${effectId}`;
          pendingEffectOffset = captureRelativeOffset(button);
        }
        if (!current.enabled && section && !["text-options", "block", "cursor", "image-block", "image-cursor"].includes(section.id)) {
          section.options.forEach((id) => {
            const sectionEffect = effectById.get(id);
            if (sectionEffect) setEffectSetting(currentScopeTarget(sectionEffect), id, { enabled: false, intensity: 60, params: {} });
          });
        }
        if (!current.enabled && section && section.id === "text-options" && /^txt-color-/.test(effectId)) {
          section.options.filter((id) => /^txt-color-/.test(id) && id !== effectId).forEach((id) => {
            const colorEffect = effectById.get(id);
            if (colorEffect) setEffectSetting(currentScopeTarget(colorEffect), id, { enabled: false, intensity: 60, params: {} });
          });
        }
        setEffectSetting(currentScopeTarget(effect), effectId, { enabled: !current.enabled, intensity: current.intensity || 60 });
        renderPanel();
        showToast(`${effect.label} ${current.enabled ? "removed" : "applied"}`);
      });
    });
    root.querySelectorAll("[data-ssx-switch-effect]").forEach((button) => {
      button.addEventListener("click", () => {
        const effectId = button.dataset.ssxSwitchEffect;
        const effect = effectById.get(effectId);
        if (!effect) return;
        const section = allUiSections().find((item) => item.options.includes(effectId));
        if (section) {
          activeTextSection = section.id;
          pendingTextAnchor = section.id;
          pendingEffectAnchor = `text-suite:${effectId}`;
          pendingEffectOffset = captureRelativeOffset(button);
        }
        if (section && section.id === "text-options") {
          const related = section.options.filter((id) => {
            if (/^txt-color-/.test(effectId)) return /^txt-color-/.test(id);
            if (/^txt-format-/.test(effectId)) return /^txt-format-/.test(id);
            if (/^txt-align-/.test(effectId)) return /^txt-align-/.test(id);
            return id === effectId;
          });
          related.forEach((id) => {
            const relatedEffect = effectById.get(id);
            if (relatedEffect) setEffectSetting(currentScopeTarget(relatedEffect), id, { enabled: false, intensity: 60, params: {} });
          });
        }
        if ((section && section.id === "cursor" && (effectId === "txt-cursor-emoji" || effectId === "txt-cursor-large")) || (section && section.id === "image-cursor" && (effectId === "img-cursor-emoji" || effectId === "img-cursor-large"))) {
          const otherId = effectId.endsWith("emoji") ? effectId.replace("emoji", "large") : effectId.replace("large", "emoji");
          const otherEffect = effectById.get(otherId);
          if (otherEffect) setEffectSetting(currentScopeTarget(otherEffect), otherId, { enabled: false, intensity: getEffectSettings(currentScopeTarget(otherEffect), otherId).intensity || 60 });
        }
        const current = getEffectSettings(currentScopeTarget(effect), effectId);
        setEffectSetting(currentScopeTarget(effect), effectId, { enabled: section && section.id === "text-options" ? true : !current.enabled, intensity: current.intensity || 60 });
        renderPanel();
        showToast(`${effect.label} ${section && section.id === "text-options" ? "selected" : current.enabled ? "removed" : "selected"}`);
      });
    });
    root.querySelectorAll("[data-ssx-param-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const [effectId, key] = button.dataset.ssxParamToggle.split(":");
        const effect = effectById.get(effectId);
        if (!effect) return;
        const selector = currentScopeTarget(effect);
        const current = getEffectSettings(selector, effectId);
        setEffectSetting(selector, effectId, {
          enabled: current.enabled,
          intensity: current.intensity,
          params: { [key]: button.dataset.ssxParamValue }
        });
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-cursor-emoji]").forEach((button) => {
      button.addEventListener("click", () => {
        const effect = effectById.get("txt-cursor-emoji");
        if (!effect) return;
        const selector = currentScopeTarget(effect);
        const current = getEffectSettings(selector, "txt-cursor-emoji");
        const maxIndex = Math.max(1, cursorEmojiOptions.length - 1);
        setEffectSetting(selector, "txt-cursor-emoji", {
          enabled: true,
          intensity: current.intensity || 60,
          params: { emoji: Math.round((Number(button.dataset.ssxCursorEmoji) / maxIndex) * 100) }
        });
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-restore-effect]").forEach((button) => {
      button.addEventListener("click", () => {
        const effect = effectById.get(button.dataset.ssxRestoreEffect);
        const selector = currentScopeTarget(effect);
        setEffectSetting(selector, button.dataset.ssxRestoreEffect, { enabled: false, intensity: 60, params: {} });
        renderPanel();
        showToast("Effect restored");
      });
    });
    root.querySelectorAll("[data-ssx-intensity]").forEach((input) => {
      input.addEventListener("input", () => {
        const effect = effectById.get(input.dataset.ssxIntensity);
        const selector = currentScopeTarget(effect);
        const current = getEffectSettings(selector, input.dataset.ssxIntensity);
        setEffectSetting(selector, input.dataset.ssxIntensity, { enabled: input.dataset.ssxAutoEnable === "true" ? true : current.enabled, intensity: input.value });
        const valueNode = input.parentElement && input.parentElement.querySelector("em");
        if (valueNode) valueNode.textContent = `${effect.intensityLabel || "Amount"} · ${clampIntensity(input.value)}`;
        const cardValue = input.parentElement && input.parentElement.querySelector("span");
        if (cardValue && input.dataset.ssxAutoEnable === "true") {
          const amount = clampIntensity(input.value);
          if (input.dataset.ssxIntensity === "txt-size-desktop") cardValue.textContent = `${Math.round(18 + amount * .22)}px`;
          if (input.dataset.ssxIntensity === "txt-size-mobile") cardValue.textContent = `${Math.round(14 + amount * .1)}px`;
          if (input.dataset.ssxIntensity === "txt-line-gap") cardValue.textContent = amount > 68 ? "Wide" : amount < 34 ? "Tight" : "Auto";
        }
        if (valueNode && input.dataset.ssxAutoEnable === "true") {
          const amount = clampIntensity(input.value);
          if (input.dataset.ssxIntensity === "txt-block-opacity") valueNode.textContent = `${amount}%`;
          if (input.dataset.ssxIntensity === "txt-block-rotate") valueNode.textContent = `${Math.round((amount - 50) * .18)}°`;
          if (input.dataset.ssxIntensity === "txt-block-blur") valueNode.textContent = `${Math.round(amount * .08)}px`;
          if (input.dataset.ssxIntensity === "txt-block-margin") valueNode.textContent = `${Math.round(8 + (amount / 100) * 72)}px`;
          if (input.dataset.ssxIntensity === "txt-block-margin-x") valueNode.textContent = `${Math.round((amount / 100) * 80)}px`;
          if (input.dataset.ssxIntensity === "txt-cursor-large" || input.dataset.ssxIntensity === "txt-cursor-emoji") valueNode.textContent = `${Math.round(24 + amount * .42)}px`;
        }
        if (cardValue && input.dataset.ssxIntensity === "txt-block-corners") {
          const amount = clampIntensity(input.value);
          cardValue.textContent = amount > 66 ? "Round" : amount < 34 ? "Sharp" : "Softer";
        }
      });
    });
    root.querySelectorAll("[data-ssx-param-effect]").forEach((input) => {
      input.addEventListener("input", () => {
        const effect = effectById.get(input.dataset.ssxParamEffect);
        const selector = currentScopeTarget(effect);
        const current = getEffectSettings(selector, input.dataset.ssxParamEffect);
        setEffectSetting(selector, input.dataset.ssxParamEffect, {
          enabled: current.enabled,
          intensity: current.intensity,
          params: { [input.dataset.ssxParamKey]: input.value }
        });
        const paramDef = (effect.params || []).find((item) => item.key === input.dataset.ssxParamKey);
        const valueNode = input.parentElement && input.parentElement.querySelector("em");
        if (valueNode) valueNode.textContent = `${clampIntensity(input.value)}`;
        if (input.nextElementSibling) input.nextElementSibling.textContent = `${paramDef ? paramDef.label : input.dataset.ssxParamKey} · ${clampIntensity(input.value)}`;
      });
    });
    root.querySelectorAll("[data-ssx-custom-text-effect]").forEach((input) => {
      input.addEventListener("input", () => {
        const effect = effectById.get(input.dataset.ssxCustomTextEffect);
        if (!effect) return;
        const selector = currentScopeTarget(effect);
        const current = getEffectSettings(selector, input.dataset.ssxCustomTextEffect);
        setEffectSetting(selector, input.dataset.ssxCustomTextEffect, {
          enabled: current.enabled,
          intensity: current.intensity,
          params: current.params,
          customText: input.value
        });
      });
    });
    root.querySelectorAll("[data-ssx-pick]").forEach((button) => button.addEventListener("click", () => {
      startPicking();
      renderPanel();
    }));
    root.querySelector("[data-ssx-close]").addEventListener("click", () => {
      localStorage.setItem(PANEL_KEY, "0");
      renderPanel();
    });
    root.querySelectorAll("[data-ssx-clear]").forEach((button) => button.addEventListener("click", () => {
      if (!window.confirm("Clear all Studio Poema effects from this browser?")) return;
      config = clone(defaultConfig);
      activeFeature = null;
      activeMode = "Studio";
      saveConfig();
      applyEffects();
      renderPanel();
      showToast("All effects cleared");
    }));
    root.querySelectorAll("[data-ssx-clear-target]").forEach((button) => button.addEventListener("click", () => {
      const selector = config.scope === "global" ? "body" : config.activeTarget;
      if (config.effects && config.effects[selector]) delete config.effects[selector];
      if (config.design && config.design[selector]) delete config.design[selector];
      saveConfig();
      applyEffects();
      renderPanel();
      showToast("Current target reset");
    }));
    root.querySelectorAll("[data-ssx-publish],[data-ssx-copy-code]").forEach((button) => button.addEventListener("click", publishSite));
    root.querySelector("[data-ssx-copy-css]")?.addEventListener("click", copyCompiledCss);
    bindHoverPreview(root);
  }

  function renderCollapsed() {
    if (!isDesignerMode()) return;
    const button = document.createElement("button");
    button.className = "ssx-collapsed";
    button.type = "button";
    button.title = "Open Poema Plugin";
    button.textContent = "Poema Plugin";
    button.addEventListener("click", () => {
      localStorage.setItem(PANEL_KEY, "1");
      renderPanel();
    });
    document.body.appendChild(button);
  }

  function findSquarespaceDock() {
    const candidates = [
      "[data-test='frameToolbar']",
      "[data-test='site-frame-toolbar']",
      "[data-test='preview-bar']",
      ".frame-toolbar",
      ".sqs-editor-toolbar",
      ".sqs-preview-toolbar",
      "[class*='FrameToolbar']",
      "[class*='frameToolbar']"
    ];
    for (const selector of candidates) {
      const element = document.querySelector(selector);
      if (!element || element.closest(`#${APP_ID}`)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width > 120 && rect.height >= 28 && rect.top < 100) {
        if (getComputedStyle(element).position === "static") element.style.position = "relative";
        return element;
      }
    }
    return null;
  }

  function startPicking() {
    selecting = true;
    document.documentElement.classList.add("ssx-selecting");
    showToast("Click a Squarespace section or block");
  }

  function stopPicking() {
    selecting = false;
    document.documentElement.classList.remove("ssx-selecting");
    selectedElement?.classList.remove("ssx-outline");
    selectedElement = null;
  }

  function flashTarget(selector) {
    let targets = [];
    try {
      targets = [...document.querySelectorAll(selector)];
    } catch {
      return;
    }
    targets.slice(0, 8).forEach((element) => element.classList.add("ssx-target-flash"));
    setTimeout(() => targets.slice(0, 8).forEach((element) => element.classList.remove("ssx-target-flash")), 1400);
  }

  document.addEventListener("mouseover", (event) => {
    if (!selecting) return;
    const target = event.target.closest("[data-section-id], [data-block-id], .sqs-block[id], section, article");
    if (!target || target.closest(`#${APP_ID}`)) return;
    if (selectedElement && selectedElement !== target) selectedElement.classList.remove("ssx-outline");
    selectedElement = target;
    selectedElement.classList.add("ssx-outline");
  }, true);

  function handlePickEvent(event) {
    if (!selecting) return;
    const target = event.target.closest("[data-section-id], [data-block-id], .sqs-block[id], section, article");
    if (!target || target.closest(`#${APP_ID}`)) return;
    event.preventDefault();
    event.stopPropagation();
    config.activeTarget = selectorForElement(target);
    config.scope = "selected";
    activeFeature = null;
    activeMode = "Studio";
    config.mode = "Studio";
    saveConfig();
    stopPicking();
    renderPanel();
    flashTarget(config.activeTarget);
    showToast(`${targetCount(config.activeTarget)} target found`);
  }

  document.addEventListener("pointerdown", handlePickEvent, true);
  document.addEventListener("click", handlePickEvent, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selecting) stopPicking();
    if ((event.altKey || event.metaKey) && event.key.toLowerCase() === "s") {
      localStorage.setItem(DESIGNER_KEY, "1");
      localStorage.setItem(PANEL_KEY, "1");
      renderPanel();
    }
  });

  function showToast(message) {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    root.querySelector(".ssx-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "ssx-toast";
    toast.textContent = message;
    root.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  function bindHoverPreview(root) {
    const preview = root.querySelector(".ssx-hover-preview");
    if (!preview) return;
    const update = (title, description) => {
      preview.querySelector(".ssx-hover-title").textContent = title || "Preview";
      preview.querySelector("p").textContent = description || "Hover a feature to see what it does.";
      preview.classList.add("is-visible");
    };
    root.querySelectorAll("[data-ssx-help],[data-ssx-preview-title]").forEach((element) => {
      element.addEventListener("mouseenter", () => {
        const title = element.dataset.ssxPreviewTitle || element.querySelector("strong")?.textContent || "Preview";
        const description = element.dataset.ssxPreviewDesc || element.dataset.ssxHelp || element.querySelector("em")?.textContent || "";
        update(title, description);
      });
      element.addEventListener("mouseleave", () => {
        preview.classList.remove("is-visible");
      });
    });
  }

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast(message);
    }
  }

  function buildInstallCode() {
    const src = cleanRuntimeSrc();
    const exported = JSON.stringify(config, null, 2).replace(/</g, "\\u003c");
    return `<script id="${CONFIG_SCRIPT_ID}" type="application/json">\n${exported}\n</script>\n<script src="${src}" defer></script>`;
  }

  function cleanRuntimeSrc() {
    const fallback = `https://cdn.jsdelivr.net/gh/evaldasbanevici-del/SquarePlugin@main/studio-poema-v39.js?v=${defaultConfig.version}`;
    try {
      const url = new URL(SCRIPT_SRC || fallback, location.href);
      url.searchParams.delete("ssx_editor");
      url.searchParams.delete("ssx");
      url.searchParams.set("v", String(defaultConfig.version));
      return url.href;
    } catch {
      return fallback;
    }
  }

  function buildCompiledCss() {
    const theme = config.theme || defaultConfig.theme;
    let css = buildDesignCss(theme);
    Object.entries(config.effects).forEach(([selector, effects]) => {
      Object.entries(effects || {}).forEach(([id, settings]) => {
        const effect = effectById.get(id);
        if (effect && settings.enabled) css += `/* ${id} | ${selector} | intensity ${settings.intensity} */\n${effect.css(selector, intensity01(settings.intensity), settings, theme)}\n\n`;
      });
    });
    return css.trim();
  }

  function applyPublishedPreviewCss() {
    const css = buildCompiledCss();
    let style = document.getElementById(`${APP_ID}-published-css`);
    if (!style) {
      style = document.createElement("style");
      style.id = `${APP_ID}-published-css`;
      style.setAttribute("data-ssx-published", "true");
      document.head.appendChild(style);
    }
    style.textContent = css;
    return css;
  }

  function publishSite() {
    saveConfig();
    applyEffects();
    applyPublishedPreviewCss();
    copyText(buildInstallCode(), "Published preview saved · final code copied");
  }

  function copyCompiledCss() {
    copyText(buildCompiledCss() || "/* No effects selected yet. */", "CSS copied");
  }

  function boot() {
    localStorage.setItem(DESIGNER_KEY, isDesignerMode() ? "1" : localStorage.getItem(DESIGNER_KEY) || "0");
    applyEffects();
    updateScrollProgress();
    renderPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
