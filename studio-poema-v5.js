(() => {
  const APP_ID = "ssx-template-studio";
  const STYLE_ID = `${APP_ID}-styles`;
  const EFFECT_STYLE_ID = `${APP_ID}-effect-styles`;
  const STORAGE_KEY = `${APP_ID}:config:v5`;
  const LEGACY_STORAGE_KEY = `${APP_ID}:config:v1`;
  const PANEL_KEY = `${APP_ID}:panel-open`;
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
    version: 5,
    activeTarget: "body",
    scope: "selected",
    theme: {
      palette: "poema",
      primary: "#17451f",
      accent: "#c8ff4d",
      soft: "#f4efe7",
      ink: "#17351d",
      gradientA: "#17451f",
      gradientB: "#b7d09e"
    },
    effects: {}
  };

  const palettes = [
    { id: "poema", label: "Poema", primary: "#17451f", accent: "#c8ff4d", soft: "#f4efe7", ink: "#17351d", gradientA: "#17451f", gradientB: "#b7d09e" },
    { id: "moss", label: "Moss", primary: "#27482f", accent: "#a8d672", soft: "#eef2e7", ink: "#172416", gradientA: "#27482f", gradientB: "#d1c3a4" },
    { id: "olive", label: "Olive", primary: "#4a5d23", accent: "#d8e468", soft: "#f3f1df", ink: "#252915", gradientA: "#4a5d23", gradientB: "#d8e468" },
    { id: "sage", label: "Sage", primary: "#3d6b58", accent: "#d7ead0", soft: "#f7f3eb", ink: "#18362d", gradientA: "#3d6b58", gradientB: "#9fbfaa" }
  ];

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
          id: "section-fullbleed",
          label: "Full bleed",
          description: "Stretch a section edge to edge.",
          intensityLabel: "Width",
          preview: "layout-fullbleed",
          css: (s, i) => `${s}{width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding-left:${Math.round(i * 18)}px!important;padding-right:${Math.round(i * 18)}px!important;}`
        },
        {
          id: "section-soft-frame",
          label: "Soft frame",
          description: "Add border and premium depth.",
          intensityLabel: "Depth",
          preview: "layout-frame",
          css: (s, i) => `${s}{border:1px solid rgba(17,24,39,${0.08 + i * 0.14});box-shadow:0 ${Math.round(10 + i * 28)}px ${Math.round(24 + i * 70)}px rgba(15,23,42,${0.06 + i * 0.16});border-radius:${Math.round(i * 18)}px;}`
        },
        {
          id: "section-tight-mobile",
          label: "Mobile spacing",
          description: "Control mobile vertical spacing.",
          intensityLabel: "Tightness",
          preview: "layout-spacing",
          css: (s, i) => `@media(max-width:767px){${s}{padding-top:${Math.round(72 - i * 46)}px!important;padding-bottom:${Math.round(72 - i * 46)}px!important;}}`
        },
        {
          id: "section-split-grid",
          label: "Split grid",
          description: "Turn content into a two column layout.",
          intensityLabel: "Gap",
          preview: "layout-split",
          css: (s, i) => `@media(min-width:900px){${s}>.content,${s} .sqs-layout>.sqs-row{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:${Math.round(24 + i * 72)}px;align-items:center;}}`
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
          css: (s, i) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{transition:transform .22s ease,box-shadow .22s ease!important;} ${s} .sqs-button-element:hover,${s} a.sqs-block-button-element:hover{transform:translateY(-${Math.round(1 + i * 7)}px);box-shadow:0 ${Math.round(8 + i * 22)}px ${Math.round(18 + i * 36)}px rgba(15,23,42,${0.1 + i * 0.18})!important;}`
        },
        {
          id: "button-magnetic",
          label: "Magnetic glow",
          description: "Add glossy CTA surface and glow.",
          intensityLabel: "Glow",
          preview: "button-glow",
          css: (s, i) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,${0.2 + i * 0.45})!important;box-shadow:inset 0 1px rgba(255,255,255,.24),0 ${Math.round(8 + i * 20)}px ${Math.round(18 + i * 38)}px rgba(15,23,42,${0.1 + i * 0.18})!important;} ${s} .sqs-button-element:hover,${s} a.sqs-block-button-element:hover{filter:saturate(${(1 + i * 0.28).toFixed(2)}) contrast(${(1 + i * 0.14).toFixed(2)});}`
        },
        {
          id: "button-corners",
          label: "Corner radius",
          description: "Dial buttons from sharp to pill.",
          intensityLabel: "Radius",
          preview: "button-radius",
          css: (s, i) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{border-radius:${Math.round(2 + i * 40)}px!important;}`
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
          css: (s, i) => `${s} img,${s} video{box-shadow:0 ${Math.round(10 + i * 30)}px ${Math.round(24 + i * 64)}px rgba(15,23,42,${0.08 + i * 0.18});}`
        },
        {
          id: "image-rounded",
          label: "Rounded media",
          description: "Round images and videos.",
          intensityLabel: "Radius",
          preview: "image-radius",
          css: (s, i) => `${s} img,${s} video{border-radius:${Math.round(4 + i * 34)}px;overflow:hidden;}`
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
          css: (s, i, settings) => `${s} .image-block-wrapper,${s} .sqs-block-image{overflow:hidden;} ${s} img{transition:transform ${(0.25 + param(settings, "speed", 45) * 0.012).toFixed(2)}s cubic-bezier(.2,.8,.2,1);} ${s} .sqs-block-image:hover img,${s} .image-block-wrapper:hover img{transform:scale(${(1 + i * 0.12).toFixed(3)});}`
        },
        {
          id: "image-duotone",
          label: "Duotone tint",
          description: "Apply a modern contrast tint.",
          intensityLabel: "Tint",
          preview: "image-tint",
          css: (s, i) => `${s} img{filter:contrast(${(1 + i * 0.12).toFixed(2)}) saturate(${(1 - i * 0.18).toFixed(2)}) sepia(${(i * 0.18).toFixed(2)});}`
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
          css: (s, i, settings, theme) => `${s} .sqs-block-image,${s} .image-block-wrapper{position:relative;overflow:hidden;} ${s} .sqs-block-image:after,${s} .image-block-wrapper:after{content:"";position:absolute;inset:0;background:${theme.soft};transform:translateX(${param(settings, "direction", 30) > 50 ? "100%" : "-100%"});transition:transform ${(0.35 + param(settings, "speed", 55) * 0.012).toFixed(2)}s cubic-bezier(.2,.8,.2,1);pointer-events:none;} ${s} .sqs-block-image:hover:after,${s} .image-block-wrapper:hover:after{transform:translateX(0);opacity:${(0.15 + i * 0.45).toFixed(2)};}`
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
          css: (s, i, settings) => `${s} .sqs-block-image:nth-of-type(2n){transform:translateY(-${Math.round(i * 28)}px) rotate(${(param(settings, "rotate", 24) * 0.04).toFixed(1)}deg);} ${s} .sqs-block-image:nth-of-type(2n+1){transform:translateY(${Math.round(i * 18)}px) rotate(-${(param(settings, "rotate", 24) * 0.035).toFixed(1)}deg);} ${s} .sqs-block-image{transition:transform .45s ease;}`
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

  const allEffects = effectCatalog.flatMap((group) => group.items.map((effect) => ({ ...effect, group: group.group })));
  const effectById = new Map(allEffects.map((effect) => [effect.id, effect]));
  let config = loadConfig();
  let selecting = false;
  let activeTab = effectCatalog[0].group;
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
    next.effects = {};
    Object.entries((input && input.effects) || {}).forEach(([selector, value]) => {
      if (Array.isArray(value)) {
        next.effects[selector] = {};
        value.forEach((id) => {
          next.effects[selector][id] = { enabled: true, intensity: 60 };
        });
        return;
      }
      next.effects[selector] = {};
      Object.entries(value || {}).forEach(([id, settings]) => {
        if (settings === true) next.effects[selector][id] = { enabled: true, intensity: 60, params: {} };
        else next.effects[selector][id] = { enabled: Boolean(settings.enabled), intensity: clampIntensity(settings.intensity), params: normalizeParams(settings.params) };
      });
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
    return element.tagName.toLowerCase();
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

  function currentScopeTarget(effect) {
    return effect && effect.globalOnly ? "body" : config.scope === "global" ? "body" : config.activeTarget;
  }

  function getEffectSettings(selector, effectId) {
    return config.effects[selector] && config.effects[selector][effectId]
      ? config.effects[selector][effectId]
      : { enabled: false, intensity: 60, params: {} };
  }

  function setEffectSetting(selector, effectId, patch) {
    const effect = effectById.get(effectId);
    if (!effect) return;
    if (selector === "body" && effect.className && patch.enabled) {
      showToast("Pick a section first for motion effects");
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
    return window.confirm("Apply effects to the whole page? This can affect every section. Use Selected for safer template editing.");
  }

  function isDesignerMode() {
    const params = new URLSearchParams(location.search);
    const forced = params.has("ssx_editor") || params.has("ssx") || SCRIPT_PARAMS.has("ssx_editor") || SCRIPT_PARAMS.has("ssx");
    const saved = localStorage.getItem(DESIGNER_KEY) === "1";
    const sqsHints = Boolean(
      document.querySelector(".sqs-edit-mode, [data-test='frameToolbar'], .sqs-layout-editing") ||
      document.body.className.includes("sqs-edit") ||
      location.hostname.includes("squarespace.com")
    );
    return forced || saved || sqsHints;
  }

  function applyEffects() {
    const theme = config.theme || defaultConfig.theme;
    let css = `html{scroll-behavior:smooth;} :root{--ssx-primary:${theme.primary};--ssx-accent:${theme.accent};--ssx-soft:${theme.soft};--ssx-ink:${theme.ink};--ssx-gradient-a:${theme.gradientA};--ssx-gradient-b:${theme.gradientB};--ssx-scroll-progress:0;} @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}}\n`;
    document.querySelectorAll(".ssx-reveal,.ssx-stagger,.ssx-parallax").forEach((element) => {
      element.classList.remove("ssx-reveal", "ssx-stagger", "ssx-parallax", "ssx-in");
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
    let style = document.getElementById(EFFECT_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = EFFECT_STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
    setupMotionObservers();
  }

  let motionObserver;
  function setupMotionObservers() {
    if (motionObserver) motionObserver.disconnect();
    const animated = document.querySelectorAll(".ssx-reveal,.ssx-stagger");
    if (!animated.length) return;
    motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("ssx-in");
      });
    }, { threshold: 0.16 });
    animated.forEach((element) => motionObserver.observe(element));
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
      .ssx-panel{background:rgba(250,248,243,.95);border:1px solid rgba(23,69,31,.16);box-shadow:0 24px 80px rgba(15,23,42,.22);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-radius:16px;overflow:hidden}
      .ssx-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border-bottom:1px solid rgba(23,69,31,.12)}
      .ssx-brand{display:flex;align-items:center;gap:10px;min-width:0}
      .ssx-logo{width:38px;height:38px;border-radius:12px;background:#f4efe7;display:grid;place-items:center;border:1px solid rgba(23,69,31,.10)}
      .ssx-logo svg{width:26px;height:26px;fill:#17451f}
      .ssx-title{font-size:15px;font-weight:820;line-height:1.1}
      .ssx-subtitle{font-size:11px;color:#66715f;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px}
      .ssx-icon-row{display:flex;gap:6px}
      .ssx-icon,.ssx-action,.ssx-copy,.ssx-scope{appearance:none;border:1px solid rgba(23,69,31,.16);background:#fffdf8;color:#17351d;border-radius:10px;height:32px;min-width:32px;padding:0 10px;font:inherit;font-size:12px;font-weight:700;display:inline-grid;place-items:center;cursor:pointer;transition:transform .16s ease,border-color .16s ease,background .16s ease}
      .ssx-icon:hover,.ssx-action:hover,.ssx-copy:hover,.ssx-scope:hover{transform:translateY(-1px);border-color:rgba(23,69,31,.32)}
      .ssx-body{display:block;max-height:calc(100vh - 110px);overflow:hidden}
      .ssx-tabs{display:flex;gap:6px;padding:10px;border-bottom:1px solid rgba(23,69,31,.10);background:rgba(239,235,225,.62);overflow:auto}
      .ssx-tab{appearance:none;border:0;background:transparent;color:#3f4f39;border-radius:999px;padding:8px 11px;text-align:center;font:inherit;font-size:12px;font-weight:760;cursor:pointer;white-space:nowrap}
      .ssx-tab[aria-selected="true"]{background:#17451f;color:#fff}
      .ssx-main{padding:12px;overflow-y:auto;overflow-x:hidden;max-height:calc(100vh - 225px)}
      .ssx-target{display:grid;gap:8px;margin-bottom:12px;position:sticky;top:0;z-index:3;background:linear-gradient(180deg,rgba(250,248,243,.98),rgba(250,248,243,.92));padding-bottom:8px}
      .ssx-target-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
      .ssx-target-info{min-width:0;flex:1;border:1px solid rgba(23,69,31,.12);background:#fffdf8;border-radius:12px;padding:8px 10px}
      .ssx-kicker{font-size:10px;text-transform:uppercase;color:#66715f;font-weight:850}
      .ssx-target-name{font-size:12px;font-weight:780;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ssx-action{height:38px;background:#17451f;color:#fff;border-color:#17451f;min-width:78px}
      .ssx-scope-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .ssx-scope{height:32px;background:#fffdf8}
      .ssx-scope[aria-pressed="true"]{background:#dfe8d8;border-color:#17451f}
      .ssx-list{display:grid;gap:10px}
      .ssx-theme{border:1px solid rgba(23,69,31,.13);background:#fffdf8;border-radius:13px;padding:10px;margin-bottom:10px}
      .ssx-theme-title{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;font-weight:820;margin-bottom:8px}
      .ssx-palette-row{display:flex;gap:6px;overflow:auto;padding-bottom:2px}
      .ssx-palette{appearance:none;border:1px solid rgba(23,69,31,.14);background:#fff;border-radius:999px;padding:5px 8px;font:inherit;font-size:11px;font-weight:760;color:#17351d;display:flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap}
      .ssx-palette[aria-pressed="true"]{border-color:#17451f;background:#dfe8d8}
      .ssx-swatch{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
      .ssx-color-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}
      .ssx-color-grid label{display:grid;gap:4px;font-size:10px;font-weight:800;color:#66715f;text-transform:uppercase}
      .ssx-color-grid input{width:100%;height:30px;border:1px solid rgba(23,69,31,.14);border-radius:8px;background:#fff;padding:2px}
      .ssx-effect{border:1px solid rgba(23,69,31,.13);background:#fffdf8;border-radius:13px;padding:10px;display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;align-items:start;max-width:100%}
      .ssx-preview{height:54px;border-radius:10px;background:#f0eadf;border:1px solid rgba(23,69,31,.11);position:relative;overflow:hidden}
      .ssx-preview:before,.ssx-preview:after{content:"";position:absolute}
      .ssx-preview.layout-fullbleed:before{inset:18px -12px;background:#17451f;border-radius:4px}
      .ssx-preview.layout-frame:before{inset:11px;background:#fff;border:1px solid #17451f;box-shadow:0 10px 20px rgba(23,69,31,.18);border-radius:8px}
      .ssx-preview.layout-spacing:before{left:18px;right:18px;top:8px;bottom:8px;border-top:10px solid #17451f;border-bottom:10px solid #17451f}
      .ssx-preview.layout-split:before{left:12px;top:13px;width:22px;height:32px;background:#17451f;border-radius:5px}.ssx-preview.layout-split:after{right:12px;top:13px;width:22px;height:32px;background:#b7d09e;border-radius:5px}
      .ssx-preview.type-editorial:before{left:12px;top:13px;width:48px;height:7px;background:#17451f;box-shadow:0 13px 0 #8aa083,0 25px 0 #8aa083}
      .ssx-preview.type-highlight:before{left:12px;right:12px;top:22px;height:14px;background:linear-gradient(transparent 45%,#c8ff4d 0)}.ssx-preview.type-gradient:before{left:12px;right:12px;top:20px;height:16px;background:linear-gradient(90deg,#17451f,#0f766e);border-radius:4px}.ssx-preview.type-balance:before{left:16px;right:16px;top:16px;height:6px;background:#17451f;box-shadow:8px 12px 0 #17451f,4px 24px 0 #8aa083}
      .ssx-preview.button-lift:before,.ssx-preview.button-glow:before,.ssx-preview.button-radius:before{left:13px;right:13px;top:19px;height:20px;background:#17451f;border-radius:7px}.ssx-preview.button-glow:before{box-shadow:0 0 18px rgba(23,69,31,.45)}.ssx-preview.button-radius:before{border-radius:999px}
      .ssx-preview.image-shadow:before,.ssx-preview.image-radius:before,.ssx-preview.image-zoom:before,.ssx-preview.image-tint:before{inset:10px;background:linear-gradient(135deg,#c8ff4d,#d9cab8);border-radius:6px}.ssx-preview.image-shadow:before{box-shadow:0 12px 20px rgba(23,69,31,.26)}.ssx-preview.image-radius:before{border-radius:16px}.ssx-preview.image-zoom:before{transform:scale(1.16)}.ssx-preview.image-tint:before{filter:sepia(.4) saturate(.8)}
      .ssx-preview.motion-reveal:before,.ssx-preview.motion-float:before,.ssx-preview.motion-stagger:before{left:14px;top:16px;width:14px;height:26px;background:#17451f;border-radius:5px;box-shadow:20px 8px 0 #8aa083,40px 2px 0 #b7d09e}.ssx-preview.motion-parallax:before{inset:10px;background:linear-gradient(180deg,#b7d09e,#17451f);border-radius:8px}
      .ssx-preview.motion-progress:before{left:8px;right:8px;top:12px;height:4px;background:#d4d8cf;border-radius:999px}.ssx-preview.motion-progress:after{left:8px;top:12px;width:40px;height:4px;background:#17451f;border-radius:999px}.ssx-preview.motion-marquee:before{left:10px;right:-28px;top:22px;height:11px;background:repeating-linear-gradient(90deg,#17451f 0 22px,transparent 22px 30px)}
      .ssx-preview.nav-glass:before{left:8px;right:8px;top:10px;height:16px;background:rgba(255,255,255,.72);border:1px solid rgba(23,69,31,.20);backdrop-filter:blur(4px);border-radius:7px}.ssx-preview.nav-links:before{left:12px;right:12px;top:24px;height:2px;background:#17451f;box-shadow:0 8px 0 #8aa083}
      .ssx-preview.utility-outline:before{inset:13px;border:3px solid #17451f;border-radius:8px}.ssx-preview.utility-bg:before{inset:9px;background:#e8f6df;border-radius:8px}.ssx-preview.utility-sticky:before{left:18px;right:18px;top:8px;height:16px;background:#17451f;border-radius:5px;box-shadow:0 24px 0 #d9cab8}.ssx-preview.utility-mobile:before{left:24px;top:8px;width:25px;height:42px;border:3px solid #17451f;border-radius:8px}
      .ssx-preview.preset-cards:before{left:9px;top:15px;width:15px;height:28px;background:#17451f;border-radius:5px;box-shadow:20px 0 0 #8aa083,40px 0 0 #b7d09e}.ssx-preview.preset-grid:before{inset:11px;background:linear-gradient(90deg,#17451f 0 28%,transparent 28% 36%,#8aa083 36% 64%,transparent 64% 72%,#b7d09e 72%);border-radius:5px}.ssx-preview.preset-sticky:before{left:10px;top:8px;width:20px;height:42px;background:#17451f;border-radius:5px}.ssx-preview.preset-sticky:after{right:11px;top:13px;width:30px;height:6px;background:#8aa083;box-shadow:0 12px 0 #8aa083,0 24px 0 #8aa083}
      .ssx-preview.shape-pills:before{left:10px;top:18px;width:50px;height:17px;background:#c8ff4d;border-radius:999px;transform:rotate(-12deg)}.ssx-preview.shape-blob:before{inset:10px;background:#17451f;border-radius:55% 45% 62% 38%}.ssx-preview.shape-divider:before{left:9px;right:9px;top:28px;height:3px;background:linear-gradient(90deg,transparent,#17451f,transparent)}
      .ssx-preview.image-curtain:before{inset:10px;background:#17451f;border-radius:7px}.ssx-preview.image-curtain:after{inset:10px 10px 10px 36px;background:#f4efe7;border-radius:0 7px 7px 0}.ssx-preview.image-float-gallery:before{left:12px;top:11px;width:22px;height:29px;background:#17451f;border-radius:5px;transform:rotate(-7deg)}.ssx-preview.image-float-gallery:after{right:13px;top:18px;width:24px;height:28px;background:#8aa083;border-radius:5px;transform:rotate(8deg)}
      .ssx-effect-title{font-size:12px;font-weight:820}
      .ssx-effect-desc{font-size:11px;color:#66715f;line-height:1.35;margin-top:3px}
      .ssx-effect-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:start}
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
      .ssx-footer{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(23,69,31,.10);background:rgba(250,248,243,.92)}
      .ssx-copy{height:34px;flex:1}
      .ssx-copy.primary{background:#17451f;border-color:#17451f;color:#fff}
      .ssx-toast{position:absolute;right:12px;bottom:58px;background:#17451f;color:#fff;padding:9px 11px;border-radius:9px;font-size:12px;box-shadow:0 12px 24px rgba(15,23,42,.2)}
      .ssx-collapsed{position:fixed;right:20px;bottom:20px;z-index:2147483647;border:1px solid rgba(23,69,31,.18);background:#17451f;color:#fff;border-radius:999px;height:44px;padding:0 16px;font:700 13px Inter,ui-sans-serif,system-ui,sans-serif;box-shadow:0 14px 34px rgba(15,23,42,.26);cursor:pointer}
      .ssx-outline{outline:2px solid #c8ff4d!important;outline-offset:3px!important}
      .ssx-target-flash{outline:3px solid #c8ff4d!important;outline-offset:7px!important;box-shadow:0 0 0 12px rgba(200,255,77,.20)!important}
      .ssx-selecting *{cursor:crosshair!important}
      @media(max-width:720px){#${APP_ID}{top:8px;right:8px;width:calc(100vw - 16px)}.ssx-main{max-height:60vh}.ssx-effect{grid-template-columns:58px minmax(0,1fr);gap:8px}.ssx-preview{height:52px}.ssx-color-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function logoSvg() {
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 7c7 5 8 13 0 20-8-7-7-15 0-20Z"/><path d="M29 30C19 19 10 22 7 34c11 3 19 1 22-4Z"/><path d="M35 30c10-11 19-8 22 4-11 3-19 1-22-4Z"/><path d="M29 43C17 32 7 36 4 50c12 3 22 1 25-7Z"/><path d="M35 43c12-11 22-7 25 7-12 3-22 1-25-7Z"/><path d="M30 25h4v33h-4z"/></svg>`;
  }

  function renderPanel() {
    ensureBaseStyles();
    document.getElementById(APP_ID)?.remove();
    document.querySelector(".ssx-collapsed")?.remove();

    if (!isDesignerMode() || localStorage.getItem(PANEL_KEY) === "0") {
      renderCollapsed();
      return;
    }

    const root = document.createElement("div");
    root.id = APP_ID;
    root.innerHTML = `
      <div class="ssx-panel" role="dialog" aria-label="Studio Poema">
        <div class="ssx-head">
          <div class="ssx-brand">
            <div class="ssx-logo">${logoSvg()}</div>
            <div>
              <div class="ssx-title">Studio Poema</div>
              <div class="ssx-subtitle">v5 · Presets, colours, shapes</div>
            </div>
          </div>
          <div class="ssx-icon-row">
            <button class="ssx-icon" type="button" data-ssx-clear title="Clear all effects">↺</button>
            <button class="ssx-icon" type="button" data-ssx-close title="Hide panel">×</button>
          </div>
        </div>
        <div class="ssx-body">
          <nav class="ssx-tabs" aria-label="Effect categories">
            ${effectCatalog.map((group) => `<button class="ssx-tab" type="button" data-ssx-tab="${escapeHtml(group.group)}" aria-selected="${group.group === activeTab}">${escapeHtml(group.group)}</button>`).join("")}
          </nav>
          <main class="ssx-main">
            <div class="ssx-target">
              <div class="ssx-target-row">
                <div class="ssx-target-info">
                  <div class="ssx-kicker">Selected · ${targetCount(config.activeTarget)} found</div>
                  <div class="ssx-target-name" title="${escapeHtml(config.activeTarget)}">${escapeHtml(targetLabel(config.activeTarget))} · ${escapeHtml(config.activeTarget)}</div>
                </div>
                <button class="ssx-action" type="button" data-ssx-pick>Pick</button>
              </div>
              <div class="ssx-scope-row">
                <button class="ssx-scope" type="button" data-ssx-scope="selected" aria-pressed="${config.scope !== "global"}">Selected section</button>
                <button class="ssx-scope" type="button" data-ssx-scope="global" aria-pressed="${config.scope === "global"}">Whole page</button>
              </div>
            </div>
            ${renderThemeControls()}
            <div class="ssx-list">${renderEffectList()}</div>
          </main>
        </div>
        <div class="ssx-footer">
          <button class="ssx-copy primary" type="button" data-ssx-copy-code>Copy final code</button>
          <button class="ssx-copy" type="button" data-ssx-copy-css>Copy CSS</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    bindPanel(root);
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
            ["primary", "Primary"],
            ["accent", "Accent"],
            ["soft", "Soft"],
            ["gradientA", "Grad A"],
            ["gradientB", "Grad B"],
            ["ink", "Text"]
          ].map(([key, label]) => `
            <label>${label}<input type="color" value="${escapeHtml(theme[key])}" data-ssx-color="${key}"></label>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderEffectList() {
    const group = effectCatalog.find((item) => item.group === activeTab) || effectCatalog[0];
    return group.items.map((effect) => {
      const selector = currentScopeTarget(effect);
      const settings = getEffectSettings(selector, effect.id);
      const disabledGlobalMotion = selector === "body" && effect.className;
      return `
        <div class="ssx-effect">
          <div class="ssx-preview ${escapeHtml(effect.preview || "")}" title="${escapeHtml(effect.description)}"></div>
          <div>
            <div class="ssx-effect-top">
              <div>
                <div class="ssx-effect-title">${escapeHtml(effect.label)}</div>
                <div class="ssx-effect-desc">${escapeHtml(effect.description)} ${effect.globalOnly ? "Applies globally." : ""}</div>
              </div>
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

  function bindPanel(root) {
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
      input.addEventListener("input", () => {
        config.theme = { ...config.theme, palette: "custom", [input.dataset.ssxColor]: input.value };
        saveConfig();
        applyEffects();
      });
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
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-intensity]").forEach((input) => {
      input.addEventListener("input", () => {
        const effect = effectById.get(input.dataset.ssxIntensity);
        const selector = currentScopeTarget(effect);
        const current = getEffectSettings(selector, input.dataset.ssxIntensity);
        setEffectSetting(selector, input.dataset.ssxIntensity, { enabled: current.enabled, intensity: input.value });
        input.nextElementSibling.textContent = `${effect.intensityLabel || "Amount"} · ${clampIntensity(input.value)}`;
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
        input.nextElementSibling.textContent = `${paramDef ? paramDef.label : input.dataset.ssxParamKey} · ${clampIntensity(input.value)}`;
      });
    });
    root.querySelector("[data-ssx-pick]").addEventListener("click", startPicking);
    root.querySelector("[data-ssx-close]").addEventListener("click", () => {
      localStorage.setItem(PANEL_KEY, "0");
      renderPanel();
    });
    root.querySelector("[data-ssx-clear]").addEventListener("click", () => {
      if (!window.confirm("Clear all Studio Poema effects from this browser?")) return;
      config = clone(defaultConfig);
      saveConfig();
      applyEffects();
      renderPanel();
      showToast("All effects cleared");
    });
    root.querySelector("[data-ssx-copy-code]").addEventListener("click", copyInstallCode);
    root.querySelector("[data-ssx-copy-css]").addEventListener("click", copyCompiledCss);
  }

  function renderCollapsed() {
    if (!isDesignerMode()) return;
    const button = document.createElement("button");
    button.className = "ssx-collapsed";
    button.type = "button";
    button.textContent = "Studio Poema";
    button.addEventListener("click", () => {
      localStorage.setItem(PANEL_KEY, "1");
      renderPanel();
    });
    document.body.appendChild(button);
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

  document.addEventListener("click", (event) => {
    if (!selecting) return;
    const target = event.target.closest("[data-section-id], [data-block-id], .sqs-block[id], section, article");
    if (!target || target.closest(`#${APP_ID}`)) return;
    event.preventDefault();
    event.stopPropagation();
    config.activeTarget = selectorForElement(target);
    config.scope = "selected";
    saveConfig();
    stopPicking();
    renderPanel();
    flashTarget(config.activeTarget);
    showToast(`${targetCount(config.activeTarget)} target found`);
  }, true);

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
    const src = (SCRIPT_SRC || "https://your-domain.com/extension.js").replace(/[?&]ssx_editor=1/g, "").replace(/[?&]ssx=1/g, "");
    const exported = JSON.stringify(config, null, 2).replace(/</g, "\\u003c");
    return `<script id="${CONFIG_SCRIPT_ID}" type="application/json">\n${exported}\n</script>\n<script src="${src}" defer></script>`;
  }

  function buildCompiledCss() {
    let css = "";
    const theme = config.theme || defaultConfig.theme;
    Object.entries(config.effects).forEach(([selector, effects]) => {
      Object.entries(effects || {}).forEach(([id, settings]) => {
        const effect = effectById.get(id);
        if (effect && settings.enabled) css += `/* ${id} | ${selector} | intensity ${settings.intensity} */\n${effect.css(selector, intensity01(settings.intensity), settings, theme)}\n\n`;
      });
    });
    return css.trim();
  }

  function copyInstallCode() {
    copyText(buildInstallCode(), "Final code copied");
  }

  function copyCompiledCss() {
    copyText(buildCompiledCss() || "/* No effects selected yet. */", "CSS copied");
  }

  function boot() {
    localStorage.setItem(DESIGNER_KEY, isDesignerMode() ? "1" : localStorage.getItem(DESIGNER_KEY) || "0");
    applyEffects();
    renderPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
