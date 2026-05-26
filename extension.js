(() => {
  const APP_ID = "ssx-template-studio";
  const STYLE_ID = `${APP_ID}-styles`;
  const EFFECT_STYLE_ID = `${APP_ID}-effect-styles`;
  const STORAGE_KEY = `${APP_ID}:config:v1`;
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
    version: 1,
    activeTarget: "body",
    effects: {}
  };

  const effectCatalog = [
    {
      group: "Layout",
      items: [
        {
          id: "section-fullbleed",
          label: "Full bleed",
          description: "Makes a section stretch edge to edge.",
          css: (s) => `${s}{width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);}`
        },
        {
          id: "section-soft-frame",
          label: "Soft frame",
          description: "Adds a refined framed section look.",
          css: (s) => `${s}{border:1px solid rgba(12,18,28,.12);box-shadow:0 18px 50px rgba(12,18,28,.10);}`
        },
        {
          id: "section-tight-mobile",
          label: "Tight mobile spacing",
          description: "Reduces padding on small screens.",
          css: (s) => `@media(max-width:767px){${s}{padding-top:36px!important;padding-bottom:36px!important;}}`
        },
        {
          id: "section-split-grid",
          label: "Split grid",
          description: "Turns direct content into a two column composition.",
          css: (s) => `@media(min-width:900px){${s}>.content,${s} .sqs-layout>.sqs-row{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,5vw,72px);align-items:center;}}`
        }
      ]
    },
    {
      group: "Typography",
      items: [
        {
          id: "text-editorial",
          label: "Editorial text",
          description: "Cleaner rhythm and modern paragraph sizing.",
          css: (s) => `${s} h1,${s} h2{letter-spacing:0!important;line-height:1.02!important;} ${s} p{font-size:clamp(16px,1.2vw,19px);line-height:1.65;}`
        },
        {
          id: "text-highlight",
          label: "Text highlight",
          description: "Adds underline emphasis to bold text.",
          css: (s) => `${s} strong{background:linear-gradient(transparent 62%,rgba(191,255,92,.62) 0);font-weight:inherit;}`
        },
        {
          id: "text-gradient",
          label: "Headline gradient",
          description: "Applies a restrained gradient to headings.",
          css: (s) => `${s} h1,${s} h2{background:linear-gradient(90deg,#101828,#4b5563 48%,#0f766e);-webkit-background-clip:text;background-clip:text;color:transparent!important;}`
        },
        {
          id: "text-balanced",
          label: "Balanced headings",
          description: "Improves headline wrapping.",
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
          description: "Adds a crisp hover lift.",
          css: (s) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{transition:transform .22s ease,box-shadow .22s ease!important;} ${s} .sqs-button-element:hover,${s} a.sqs-block-button-element:hover{transform:translateY(-3px);box-shadow:0 14px 28px rgba(15,23,42,.18)!important;}`
        },
        {
          id: "button-magnetic",
          label: "Magnetic glow",
          description: "Adds a premium border and glow style.",
          css: (s) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.35)!important;box-shadow:inset 0 1px rgba(255,255,255,.22),0 12px 28px rgba(15,23,42,.16)!important;} ${s} .sqs-button-element:hover,${s} a.sqs-block-button-element:hover{filter:saturate(1.08) contrast(1.04);}`
        },
        {
          id: "button-sharp",
          label: "Sharp corners",
          description: "Makes CTAs more architectural.",
          css: (s) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{border-radius:2px!important;}`
        },
        {
          id: "button-pill",
          label: "Pill buttons",
          description: "Rounds CTAs into pills.",
          css: (s) => `${s} .sqs-button-element,${s} a.sqs-block-button-element{border-radius:999px!important;}`
        }
      ]
    },
    {
      group: "Images",
      items: [
        {
          id: "image-soft-shadow",
          label: "Soft shadow",
          description: "Adds controlled depth to images and videos.",
          css: (s) => `${s} img,${s} video{box-shadow:0 22px 55px rgba(15,23,42,.16);}`
        },
        {
          id: "image-rounded",
          label: "Rounded media",
          description: "Rounds media without changing layout.",
          css: (s) => `${s} img,${s} video{border-radius:18px;overflow:hidden;}`
        },
        {
          id: "image-zoom-hover",
          label: "Zoom hover",
          description: "Subtle hover zoom for visual blocks.",
          css: (s) => `${s} .image-block-wrapper,${s} .sqs-block-image{overflow:hidden;} ${s} img{transition:transform .55s cubic-bezier(.2,.8,.2,1);} ${s} .sqs-block-image:hover img,${s} .image-block-wrapper:hover img{transform:scale(1.045);}`
        },
        {
          id: "image-duotone",
          label: "Duotone tint",
          description: "Applies a modern contrast tint.",
          css: (s) => `${s} img{filter:contrast(1.06) saturate(.92) sepia(.08);}`
        }
      ]
    },
    {
      group: "Motion",
      items: [
        {
          id: "motion-reveal",
          label: "Scroll reveal",
          description: "Fades content upward as it enters view.",
          className: "ssx-reveal",
          css: (s) => `${s}.ssx-reveal,[data-ssx-reveal] ${s}{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease;} ${s}.ssx-reveal.ssx-in,[data-ssx-reveal] ${s}.ssx-in{opacity:1;transform:none;}`
        },
        {
          id: "motion-parallax",
          label: "Gentle parallax",
          description: "Adds slow background movement.",
          className: "ssx-parallax",
          css: (s) => `${s}.ssx-parallax{background-attachment:fixed;background-size:cover;background-position:center;} @media(max-width:767px){${s}.ssx-parallax{background-attachment:scroll;}}`
        },
        {
          id: "motion-float",
          label: "Float",
          description: "Creates a slow floating animation.",
          css: (s) => `${s}{animation:ssxFloat 6s ease-in-out infinite;} @keyframes ssxFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`
        },
        {
          id: "motion-stagger",
          label: "Stagger children",
          description: "Staggers direct child entrances.",
          className: "ssx-stagger",
          css: (s) => `${s}.ssx-stagger>*{opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease;} ${s}.ssx-stagger.ssx-in>*{opacity:1;transform:none;} ${s}.ssx-stagger.ssx-in>*:nth-child(2){transition-delay:.08s}${s}.ssx-stagger.ssx-in>*:nth-child(3){transition-delay:.16s}${s}.ssx-stagger.ssx-in>*:nth-child(4){transition-delay:.24s}${s}.ssx-stagger.ssx-in>*:nth-child(5){transition-delay:.32s}`
        }
      ]
    },
    {
      group: "Navigation",
      items: [
        {
          id: "nav-glass",
          label: "Glass header",
          description: "Turns the fixed header into a glass surface.",
          css: () => `.header,.Header,.site-header{backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);background:rgba(255,255,255,.76)!important;border-bottom:1px solid rgba(15,23,42,.08);}`
        },
        {
          id: "nav-link-underline",
          label: "Animated nav links",
          description: "Adds understated link hover lines.",
          css: () => `.header-nav a,.Header-nav a,.site-header a{background-image:linear-gradient(currentColor,currentColor);background-size:0 1px;background-position:0 100%;background-repeat:no-repeat;transition:background-size .24s ease;} .header-nav a:hover,.Header-nav a:hover,.site-header a:hover{background-size:100% 1px;}`
        },
        {
          id: "nav-compact",
          label: "Compact header",
          description: "Reduces header height for templates.",
          css: () => `.header,.Header,.site-header{min-height:64px!important;} .header-announcement-bar-wrapper{padding-top:12px!important;padding-bottom:12px!important;}`
        }
      ]
    },
    {
      group: "Utility",
      items: [
        {
          id: "utility-hide-mobile",
          label: "Hide mobile",
          description: "Hides selected target on small screens.",
          css: (s) => `@media(max-width:767px){${s}{display:none!important;}}`
        },
        {
          id: "utility-hide-desktop",
          label: "Hide desktop",
          description: "Hides selected target on desktop.",
          css: (s) => `@media(min-width:768px){${s}{display:none!important;}}`
        },
        {
          id: "utility-sticky",
          label: "Sticky target",
          description: "Pins selected target while scrolling.",
          css: (s) => `@media(min-width:900px){${s}{position:sticky!important;top:96px;z-index:2;}}`
        },
        {
          id: "utility-cursor",
          label: "Pointer polish",
          description: "Adds pointer intent to interactive blocks.",
          css: (s) => `${s} a,${s} button,${s} .sqs-button-element{cursor:pointer;}`
        }
      ]
    }
  ];

  const allEffects = effectCatalog.flatMap((group) => group.items);
  const effectById = new Map(allEffects.map((effect) => [effect.id, effect]));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
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
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return normalizeConfig(saved || readInlineConfig() || defaultConfig);
    } catch {
      return clone(defaultConfig);
    }
  }

  function normalizeConfig(config) {
    return {
      ...clone(defaultConfig),
      ...config,
      effects: config && typeof config.effects === "object" ? config.effects : {}
    };
  }

  let config = loadConfig();
  let selecting = false;
  let activeTab = effectCatalog[0].group;
  let selectedElement = null;

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function selectorForElement(element) {
    if (!element || element === document.body) return "body";
    const sectionId = element.getAttribute("data-section-id");
    if (sectionId) return `[data-section-id="${cssEscape(sectionId)}"]`;
    const blockId = element.getAttribute("data-block-id") || element.id;
    if (blockId) return `#${cssEscape(blockId)}`;
    const closestBlock = element.closest("[data-block-id], .sqs-block[id]");
    if (closestBlock) return selectorForElement(closestBlock);
    const closestSection = element.closest("[data-section-id], section, article");
    if (closestSection && closestSection !== element) return selectorForElement(closestSection);
    return element.tagName.toLowerCase();
  }

  function targetLabel(selector) {
    if (selector === "body") return "Visa svetainė";
    if (selector.includes("data-section-id")) return "Pasirinkta sekcija";
    if (selector.startsWith("#")) return "Pasirinktas blokas";
    return selector;
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

  function ensureBaseStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${APP_ID}{position:fixed;top:20px;right:20px;width:min(390px,calc(100vw - 32px));max-height:calc(100vh - 40px);z-index:2147483647;color:#111827;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:0}
      #${APP_ID} *{box-sizing:border-box;letter-spacing:0}
      .ssx-panel{background:rgba(252,252,250,.94);border:1px solid rgba(17,24,39,.13);box-shadow:0 24px 80px rgba(15,23,42,.22);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-radius:14px;overflow:hidden}
      .ssx-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 14px 12px;border-bottom:1px solid rgba(17,24,39,.09)}
      .ssx-brand{display:flex;align-items:center;gap:10px;min-width:0}
      .ssx-logo{width:34px;height:34px;border-radius:10px;background:#111827;color:#fff;display:grid;place-items:center;font-size:13px;font-weight:800}
      .ssx-title{font-size:14px;font-weight:760;line-height:1.2}
      .ssx-subtitle{font-size:11px;color:#6b7280;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:230px}
      .ssx-icon-row{display:flex;gap:6px;align-items:center}
      .ssx-icon,.ssx-action,.ssx-copy{appearance:none;border:1px solid rgba(17,24,39,.14);background:#fff;color:#111827;border-radius:9px;height:32px;min-width:32px;padding:0 10px;font:inherit;font-size:12px;font-weight:650;display:inline-grid;place-items:center;cursor:pointer;transition:transform .16s ease,background .16s ease,border-color .16s ease}
      .ssx-icon:hover,.ssx-action:hover,.ssx-copy:hover{transform:translateY(-1px);border-color:rgba(17,24,39,.28)}
      .ssx-body{display:grid;grid-template-columns:112px minmax(0,1fr);min-height:430px;max-height:calc(100vh - 112px)}
      .ssx-tabs{padding:10px;border-right:1px solid rgba(17,24,39,.09);background:rgba(244,245,242,.72);overflow:auto}
      .ssx-tab{width:100%;appearance:none;border:0;background:transparent;color:#374151;border-radius:9px;padding:9px 10px;margin:2px 0;text-align:left;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
      .ssx-tab[aria-selected="true"]{background:#111827;color:#fff}
      .ssx-main{padding:12px;overflow:auto}
      .ssx-target{display:flex;gap:8px;align-items:center;margin-bottom:12px}
      .ssx-target-info{min-width:0;flex:1;border:1px solid rgba(17,24,39,.10);background:#fff;border-radius:10px;padding:8px 10px}
      .ssx-kicker{font-size:10px;text-transform:uppercase;color:#6b7280;font-weight:800}
      .ssx-target-name{font-size:12px;font-weight:760;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ssx-action{height:38px;background:#111827;color:#fff;border-color:#111827}
      .ssx-list{display:grid;gap:8px}
      .ssx-effect{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;border:1px solid rgba(17,24,39,.10);background:#fff;border-radius:11px;padding:10px}
      .ssx-effect-title{font-size:12px;font-weight:760}
      .ssx-effect-desc{font-size:11px;color:#6b7280;line-height:1.35;margin-top:3px}
      .ssx-switch{position:relative;width:42px;height:24px;display:inline-block}
      .ssx-switch input{opacity:0;width:0;height:0}
      .ssx-slider{position:absolute;cursor:pointer;inset:0;background:#d1d5db;border-radius:999px;transition:.18s}
      .ssx-slider:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:.18s}
      .ssx-switch input:checked+.ssx-slider{background:#111827}
      .ssx-switch input:checked+.ssx-slider:before{transform:translateX(18px)}
      .ssx-footer{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(17,24,39,.09);background:rgba(250,250,249,.92)}
      .ssx-copy{height:34px;flex:1}
      .ssx-copy.primary{background:#c8ff4d;border-color:#b8ed3f;color:#111827}
      .ssx-toast{position:absolute;right:12px;bottom:58px;background:#111827;color:#fff;padding:9px 11px;border-radius:9px;font-size:12px;box-shadow:0 12px 24px rgba(15,23,42,.2)}
      .ssx-collapsed{position:fixed;right:20px;bottom:20px;z-index:2147483647;border:1px solid rgba(17,24,39,.18);background:#111827;color:#fff;border-radius:999px;height:44px;padding:0 16px;font:700 13px Inter,ui-sans-serif,system-ui,sans-serif;box-shadow:0 14px 34px rgba(15,23,42,.26);cursor:pointer}
      .ssx-outline{outline:2px solid #c8ff4d!important;outline-offset:3px!important}
      .ssx-selecting *{cursor:crosshair!important}
      @media(max-width:720px){#${APP_ID}{top:10px;right:10px;width:calc(100vw - 20px)}.ssx-body{grid-template-columns:1fr;min-height:0}.ssx-tabs{display:flex;gap:6px;overflow:auto;border-right:0;border-bottom:1px solid rgba(17,24,39,.09)}.ssx-tab{width:auto;white-space:nowrap}.ssx-main{max-height:56vh}}
    `;
    document.head.appendChild(style);
  }

  function getEnabledEffects(selector) {
    return config.effects[selector] || [];
  }

  function setEffect(selector, effectId, enabled) {
    const current = new Set(getEnabledEffects(selector));
    if (enabled) current.add(effectId);
    else current.delete(effectId);
    config.effects[selector] = [...current];
    if (!config.effects[selector].length) delete config.effects[selector];
    saveConfig();
    applyEffects();
  }

  function applyEffects() {
    let css = "html{scroll-behavior:smooth;} @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}}\n";
    document.querySelectorAll(".ssx-reveal,.ssx-stagger,.ssx-parallax").forEach((element) => {
      element.classList.remove("ssx-reveal", "ssx-stagger", "ssx-parallax", "ssx-in");
    });
    Object.entries(config.effects).forEach(([selector, ids]) => {
      ids.forEach((id) => {
        const effect = effectById.get(id);
        if (!effect) return;
        css += `\n/* ${id} */\n${effect.css(selector)}\n`;
        if (effect.className) {
          document.querySelectorAll(selector).forEach((element) => element.classList.add(effect.className));
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
    const animated = document.querySelectorAll(".ssx-reveal,.ssx-stagger");
    if (!animated.length) return;
    if (motionObserver) motionObserver.disconnect();
    motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("ssx-in");
      });
    }, { threshold: 0.16 });
    animated.forEach((element) => motionObserver.observe(element));
  }

  function renderPanel() {
    ensureBaseStyles();
    const old = document.getElementById(APP_ID);
    if (old) old.remove();

    if (!isDesignerMode() || localStorage.getItem(PANEL_KEY) === "0") {
      renderCollapsed();
      return;
    }

    const root = document.createElement("div");
    root.id = APP_ID;
    root.innerHTML = `
      <div class="ssx-panel" role="dialog" aria-label="Squarespace Template Studio">
        <div class="ssx-head">
          <div class="ssx-brand">
            <div class="ssx-logo">SX</div>
            <div>
              <div class="ssx-title">Template Studio</div>
              <div class="ssx-subtitle">Modern effects for Squarespace</div>
            </div>
          </div>
          <div class="ssx-icon-row">
            <button class="ssx-icon" type="button" data-ssx-reset title="Reset target">↺</button>
            <button class="ssx-icon" type="button" data-ssx-close title="Hide panel">×</button>
          </div>
        </div>
        <div class="ssx-body">
          <nav class="ssx-tabs" aria-label="Effect categories">
            ${effectCatalog.map((group) => `<button class="ssx-tab" type="button" data-ssx-tab="${group.group}" aria-selected="${group.group === activeTab}">${group.group}</button>`).join("")}
          </nav>
          <main class="ssx-main">
            <div class="ssx-target">
              <div class="ssx-target-info">
                <div class="ssx-kicker">Target</div>
                <div class="ssx-target-name">${targetLabel(config.activeTarget)} · ${config.activeTarget}</div>
              </div>
              <button class="ssx-action" type="button" data-ssx-pick>Pick</button>
            </div>
            <div class="ssx-list">
              ${renderEffectList()}
            </div>
          </main>
        </div>
        <div class="ssx-footer">
          <button class="ssx-copy primary" type="button" data-ssx-copy-code>Copy install code</button>
          <button class="ssx-copy" type="button" data-ssx-copy-css>Copy CSS</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    bindPanel(root);
  }

  function renderEffectList() {
    const group = effectCatalog.find((item) => item.group === activeTab) || effectCatalog[0];
    const enabled = new Set(getEnabledEffects(config.activeTarget));
    return group.items.map((effect) => `
      <label class="ssx-effect">
        <span>
          <span class="ssx-effect-title">${effect.label}</span>
          <span class="ssx-effect-desc">${effect.description}</span>
        </span>
        <span class="ssx-switch">
          <input type="checkbox" data-ssx-effect="${effect.id}" ${enabled.has(effect.id) ? "checked" : ""}>
          <span class="ssx-slider"></span>
        </span>
      </label>
    `).join("");
  }

  function bindPanel(root) {
    root.querySelectorAll("[data-ssx-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.ssxTab;
        renderPanel();
      });
    });
    root.querySelectorAll("[data-ssx-effect]").forEach((input) => {
      input.addEventListener("change", () => setEffect(config.activeTarget, input.dataset.ssxEffect, input.checked));
    });
    root.querySelector("[data-ssx-pick]").addEventListener("click", startPicking);
    root.querySelector("[data-ssx-close]").addEventListener("click", () => {
      localStorage.setItem(PANEL_KEY, "0");
      renderPanel();
    });
    root.querySelector("[data-ssx-reset]").addEventListener("click", () => {
      config.activeTarget = "body";
      saveConfig();
      renderPanel();
    });
    root.querySelector("[data-ssx-copy-code]").addEventListener("click", copyInstallCode);
    root.querySelector("[data-ssx-copy-css]").addEventListener("click", copyCompiledCss);
  }

  function renderCollapsed() {
    const old = document.querySelector(".ssx-collapsed");
    if (old) old.remove();
    if (!isDesignerMode()) return;
    const button = document.createElement("button");
    button.className = "ssx-collapsed";
    button.type = "button";
    button.textContent = "Template Studio";
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
    if (selectedElement) selectedElement.classList.remove("ssx-outline");
    selectedElement = null;
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
    saveConfig();
    stopPicking();
    renderPanel();
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
    const old = root.querySelector(".ssx-toast");
    if (old) old.remove();
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
    const src = SCRIPT_SRC || "https://your-domain.com/extension.js";
    const exported = JSON.stringify(config, null, 2).replace(/</g, "\\u003c");
    return `<script id="${CONFIG_SCRIPT_ID}" type="application/json">\n${exported}\n</script>\n<script src="${src}" defer></script>`;
  }

  function buildCompiledCss() {
    let css = "";
    Object.entries(config.effects).forEach(([selector, ids]) => {
      ids.forEach((id) => {
        const effect = effectById.get(id);
        if (effect) css += `/* ${id} */\n${effect.css(selector)}\n\n`;
      });
    });
    return css.trim();
  }

  function copyInstallCode() {
    copyText(buildInstallCode(), "Install code copied");
  }

  function copyCompiledCss() {
    copyText(buildCompiledCss() || "/* No effects selected yet. */", "CSS copied");
  }

  function boot() {
    localStorage.setItem(DESIGNER_KEY, isDesignerMode() ? "1" : localStorage.getItem(DESIGNER_KEY) || "0");
    applyEffects();
    renderPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
