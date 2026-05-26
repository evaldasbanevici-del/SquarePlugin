(() => {
  const APP_ID = "ssx-template-studio";
  const STYLE_ID = `${APP_ID}-styles`;
  const EFFECT_STYLE_ID = `${APP_ID}-effect-styles`;
  const STORAGE_KEY = `${APP_ID}:config:v3`;
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
    version: 3,
    activeTarget: "body",
    scope: "selected",
    effects: {}
  };

  const effectCatalog = [
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
          css: (s, i) => `${s} strong{background:linear-gradient(transparent ${Math.round(74 - i * 18)}%,rgba(191,255,92,${0.28 + i * 0.58}) 0);font-weight:inherit;}`
        },
        {
          id: "text-gradient",
          label: "Headline gradient",
          description: "Add restrained gradient to headings.",
          intensityLabel: "Color",
          preview: "type-gradient",
          css: (s, i) => `${s} h1,${s} h2{background:linear-gradient(90deg,#102018,#34513d ${Math.round(35 + i * 25)}%,#0f766e);-webkit-background-clip:text;background-clip:text;color:transparent!important;filter:saturate(${(0.8 + i * 0.7).toFixed(2)});}`
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
          css: (s, i) => `${s} .image-block-wrapper,${s} .sqs-block-image{overflow:hidden;} ${s} img{transition:transform .55s cubic-bezier(.2,.8,.2,1);} ${s} .sqs-block-image:hover img,${s} .image-block-wrapper:hover img{transform:scale(${(1 + i * 0.09).toFixed(3)});}`
        },
        {
          id: "image-duotone",
          label: "Duotone tint",
          description: "Apply a modern contrast tint.",
          intensityLabel: "Tint",
          preview: "image-tint",
          css: (s, i) => `${s} img{filter:contrast(${(1 + i * 0.12).toFixed(2)}) saturate(${(1 - i * 0.18).toFixed(2)}) sepia(${(i * 0.18).toFixed(2)});}`
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
          css: (s, i) => `${s}.ssx-reveal{opacity:0;transform:translateY(${Math.round(10 + i * 34)}px);transition:opacity ${(0.45 + i * 0.55).toFixed(2)}s ease,transform ${(0.45 + i * 0.55).toFixed(2)}s ease;} ${s}.ssx-reveal.ssx-in{opacity:1;transform:none;}`
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
          css: (s, i) => `${s}{animation:ssxFloat ${Math.max(3, 8 - i * 4).toFixed(1)}s ease-in-out infinite;} @keyframes ssxFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-${Math.round(4 + i * 18)}px)}}`
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
        if (settings === true) next.effects[selector][id] = { enabled: true, intensity: 60 };
        else next.effects[selector][id] = { enabled: Boolean(settings.enabled), intensity: clampIntensity(settings.intensity) };
      });
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
      : { enabled: false, intensity: 60 };
  }

  function setEffectSetting(selector, effectId, patch) {
    const effect = effectById.get(effectId);
    if (!effect) return;
    if (selector === "body" && effect.className && patch.enabled) {
      showToast("Pick a section first for motion effects");
      return;
    }
    const current = getEffectSettings(selector, effectId);
    const next = { ...current, ...patch, intensity: clampIntensity(patch.intensity ?? current.intensity) };
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
    let css = "html{scroll-behavior:smooth;} @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}}\n";
    document.querySelectorAll(".ssx-reveal,.ssx-stagger,.ssx-parallax").forEach((element) => {
      element.classList.remove("ssx-reveal", "ssx-stagger", "ssx-parallax", "ssx-in");
    });
    Object.entries(config.effects).forEach(([selector, effects]) => {
      Object.entries(effects || {}).forEach(([id, settings]) => {
        const effect = effectById.get(id);
        if (!effect || !settings.enabled) return;
        if (effect.className && (selector === "body" || selector === "html")) return;
        css += `\n/* ${id} | ${selector} | intensity ${settings.intensity} */\n${effect.css(selector, intensity01(settings.intensity), settings)}\n`;
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

  function ensureBaseStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${APP_ID}{position:fixed;top:20px;right:20px;width:min(430px,calc(100vw - 32px));max-height:calc(100vh - 40px);z-index:2147483647;color:#17351d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:0}
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
      .ssx-body{display:grid;grid-template-columns:116px minmax(0,1fr);min-height:500px;max-height:calc(100vh - 112px)}
      .ssx-tabs{padding:10px;border-right:1px solid rgba(23,69,31,.10);background:rgba(239,235,225,.62);overflow:auto}
      .ssx-tab{width:100%;appearance:none;border:0;background:transparent;color:#3f4f39;border-radius:10px;padding:9px 10px;margin:2px 0;text-align:left;font:inherit;font-size:12px;font-weight:760;cursor:pointer}
      .ssx-tab[aria-selected="true"]{background:#17451f;color:#fff}
      .ssx-main{padding:12px;overflow:auto}
      .ssx-target{display:grid;gap:8px;margin-bottom:12px}
      .ssx-target-row{display:flex;gap:8px;align-items:center}
      .ssx-target-info{min-width:0;flex:1;border:1px solid rgba(23,69,31,.12);background:#fffdf8;border-radius:12px;padding:8px 10px}
      .ssx-kicker{font-size:10px;text-transform:uppercase;color:#66715f;font-weight:850}
      .ssx-target-name{font-size:12px;font-weight:780;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ssx-action{height:38px;background:#17451f;color:#fff;border-color:#17451f}
      .ssx-scope-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .ssx-scope{height:32px;background:#fffdf8}
      .ssx-scope[aria-pressed="true"]{background:#dfe8d8;border-color:#17451f}
      .ssx-list{display:grid;gap:10px}
      .ssx-effect{border:1px solid rgba(23,69,31,.13);background:#fffdf8;border-radius:13px;padding:10px;display:grid;grid-template-columns:74px minmax(0,1fr);gap:10px;align-items:start}
      .ssx-preview{height:58px;border-radius:10px;background:#f0eadf;border:1px solid rgba(23,69,31,.11);position:relative;overflow:hidden}
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
      .ssx-preview.nav-glass:before{left:8px;right:8px;top:10px;height:16px;background:rgba(255,255,255,.72);border:1px solid rgba(23,69,31,.20);backdrop-filter:blur(4px);border-radius:7px}.ssx-preview.nav-links:before{left:12px;right:12px;top:24px;height:2px;background:#17451f;box-shadow:0 8px 0 #8aa083}
      .ssx-preview.utility-outline:before{inset:13px;border:3px solid #17451f;border-radius:8px}.ssx-preview.utility-bg:before{inset:9px;background:#e8f6df;border-radius:8px}.ssx-preview.utility-sticky:before{left:18px;right:18px;top:8px;height:16px;background:#17451f;border-radius:5px;box-shadow:0 24px 0 #d9cab8}.ssx-preview.utility-mobile:before{left:24px;top:8px;width:25px;height:42px;border:3px solid #17451f;border-radius:8px}
      .ssx-effect-title{font-size:12px;font-weight:820}
      .ssx-effect-desc{font-size:11px;color:#66715f;line-height:1.35;margin-top:3px}
      .ssx-effect-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:start}
      .ssx-switch{position:relative;width:42px;height:24px;display:inline-block}
      .ssx-switch input{opacity:0;width:0;height:0}
      .ssx-slider{position:absolute;cursor:pointer;inset:0;background:#d4d8cf;border-radius:999px;transition:.18s}
      .ssx-slider:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:.18s}
      .ssx-switch input:checked+.ssx-slider{background:#17451f}
      .ssx-switch input:checked+.ssx-slider:before{transform:translateX(18px)}
      .ssx-range-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin-top:9px}
      .ssx-range-row input{width:100%;accent-color:#17451f}
      .ssx-range-label{font-size:10px;color:#66715f;font-weight:800;min-width:58px;text-align:right}
      .ssx-footer{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(23,69,31,.10);background:rgba(250,248,243,.92)}
      .ssx-copy{height:34px;flex:1}
      .ssx-copy.primary{background:#17451f;border-color:#17451f;color:#fff}
      .ssx-toast{position:absolute;right:12px;bottom:58px;background:#17451f;color:#fff;padding:9px 11px;border-radius:9px;font-size:12px;box-shadow:0 12px 24px rgba(15,23,42,.2)}
      .ssx-collapsed{position:fixed;right:20px;bottom:20px;z-index:2147483647;border:1px solid rgba(23,69,31,.18);background:#17451f;color:#fff;border-radius:999px;height:44px;padding:0 16px;font:700 13px Inter,ui-sans-serif,system-ui,sans-serif;box-shadow:0 14px 34px rgba(15,23,42,.26);cursor:pointer}
      .ssx-outline{outline:2px solid #c8ff4d!important;outline-offset:3px!important}
      .ssx-target-flash{outline:3px solid #c8ff4d!important;outline-offset:7px!important;box-shadow:0 0 0 12px rgba(200,255,77,.20)!important}
      .ssx-selecting *{cursor:crosshair!important}
      @media(max-width:720px){#${APP_ID}{top:10px;right:10px;width:calc(100vw - 20px)}.ssx-body{grid-template-columns:1fr;min-height:0}.ssx-tabs{display:flex;gap:6px;overflow:auto;border-right:0;border-bottom:1px solid rgba(23,69,31,.10)}.ssx-tab{width:auto;white-space:nowrap}.ssx-main{max-height:56vh}.ssx-effect{grid-template-columns:64px minmax(0,1fr)}}
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
              <div class="ssx-subtitle">Advanced Squarespace styling system</div>
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
          </div>
        </div>
      `;
    }).join("");
  }

  function bindPanel(root) {
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
    Object.entries(config.effects).forEach(([selector, effects]) => {
      Object.entries(effects || {}).forEach(([id, settings]) => {
        const effect = effectById.get(id);
        if (effect && settings.enabled) css += `/* ${id} | ${selector} | intensity ${settings.intensity} */\n${effect.css(selector, intensity01(settings.intensity), settings)}\n\n`;
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
