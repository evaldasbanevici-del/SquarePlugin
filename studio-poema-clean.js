(function () {
  "use strict";

  var APP_ID = "studio-poema-clean";
  var STYLE_ID = APP_ID + "-styles";
  var UI_STYLE_ID = APP_ID + "-ui-styles";
  var STORE_KEY = APP_ID + "-state";
  var SCOPE_ATTR = "data-studio-poema-scope";
  var ACTIVE_CLASS = "sp-effect-active";

  if (window.__studioPoemaClean) {
    window.__studioPoemaClean.destroy();
  }

  var palette = {
    cream: "#FCF6EB",
    asparagus: "#ECEABE",
    lettuce: "#AADD66",
    evergreen: "#125B49",
    coach: "#003527",
    midnight: "#051914"
  };

  var defaults = {
    tab: "Typography",
    scope: "selection",
    selectedScope: "",
    selectedLabel: "Nothing selected",
    compact: false,
    features: {}
  };

  var featureGroups = [
    {
      name: "Typography",
      features: [
        {
          id: "editorialText",
          title: "Editorial text",
          text: "Sharper headings and calmer paragraph rhythm.",
          control: "Scale",
          min: 35,
          max: 90,
          value: 62,
          css: function (scope, value) {
            var lift = round(value / 100, 2);
            return [
              scope + " :is(h1,h2,h3):not(#" + APP_ID + " *){font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-weight:760;line-height:" + (1.04 + lift * 0.06).toFixed(2) + ";letter-spacing:0;color:var(--sp-ink,#051914);text-wrap:balance;}",
              scope + " :is(p,li):not(#" + APP_ID + " *){font-family:Inter,ui-sans-serif,system-ui,sans-serif;line-height:" + (1.48 + lift * 0.18).toFixed(2) + ";font-weight:450;color:color-mix(in srgb,var(--sp-ink,#051914) 80%,transparent);}",
              scope + " :is(.sqs-block-content,.content,.section-content):not(#" + APP_ID + " *){--sp-ink:" + palette.midnight + ";}"
            ].join("\n");
          }
        },
        {
          id: "balancedHeadings",
          title: "Balanced headings",
          text: "Better line breaks for premium sections.",
          control: "Balance",
          min: 20,
          max: 100,
          value: 66,
          css: function (scope, value) {
            var max = Math.max(9, Math.round(18 - value / 10));
            return scope + " :is(h1,h2,h3):not(#" + APP_ID + " *){max-width:" + max + "em;text-wrap:balance;overflow-wrap:normal;}";
          }
        },
        {
          id: "markerHighlight",
          title: "Text highlight",
          text: "Framer-style emphasis for bold and marked text.",
          control: "Ink",
          min: 20,
          max: 100,
          value: 58,
          css: function (scope, value) {
            var height = Math.round(20 + value / 3);
            return [
              scope + " :is(strong,mark,.highlight):not(#" + APP_ID + " *){background:linear-gradient(transparent " + (100 - height) + "%, " + palette.lettuce + " " + (100 - height) + "%);color:" + palette.midnight + ";font-weight:780;padding-inline:.04em;}",
              scope + " mark:not(#" + APP_ID + " *){background-color:transparent;}"
            ].join("\n");
          }
        },
        {
          id: "displayGradient",
          title: "Headline gradient",
          text: "A restrained green gradient for hero titles.",
          control: "Color",
          min: 20,
          max: 100,
          value: 54,
          css: function (scope, value) {
            var stop = Math.round(36 + value / 3);
            return scope + " :is(h1,.sp-display):not(#" + APP_ID + " *){background:linear-gradient(100deg," + palette.midnight + " 0%," + palette.evergreen + " " + stop + "%," + palette.lettuce + " 130%);-webkit-background-clip:text;background-clip:text;color:transparent;}";
          }
        },
        {
          id: "paragraphRhythm",
          title: "Paragraph rhythm",
          text: "Readable text blocks with elegant spacing.",
          control: "Space",
          min: 20,
          max: 100,
          value: 60,
          css: function (scope, value) {
            var gap = (0.65 + value / 100).toFixed(2);
            return [
              scope + " :is(p,ul,ol):not(#" + APP_ID + " *){max-width:68ch;}",
              scope + " :is(p + p,p + ul,p + ol):not(#" + APP_ID + " *){margin-top:" + gap + "em;}"
            ].join("\n");
          }
        }
      ]
    },
    {
      name: "Buttons",
      features: [
        {
          id: "buttonPill",
          title: "Button styles",
          text: "Polished pills for Squarespace buttons and links.",
          control: "Round",
          min: 24,
          max: 100,
          value: 70,
          css: function (scope, value) {
            var radius = Math.round(value * 0.42);
            return [
              scope + " :is(.sqs-button-element--primary,.sqs-button-element--secondary,.button,a[href].btn):not(#" + APP_ID + " *){border-radius:" + radius + "px!important;border:1px solid color-mix(in srgb," + palette.evergreen + " 42%,transparent)!important;background:" + palette.midnight + "!important;color:" + palette.cream + "!important;box-shadow:0 10px 26px rgba(5,25,20,.16);transition:transform .28s ease,box-shadow .28s ease,background .28s ease!important;}",
              scope + " :is(.sqs-button-element--primary,.sqs-button-element--secondary,.button,a[href].btn):hover:not(#" + APP_ID + " *){transform:translateY(-2px);box-shadow:0 18px 36px rgba(5,25,20,.22);background:" + palette.evergreen + "!important;}"
            ].join("\n");
          }
        },
        {
          id: "buttonMagnet",
          title: "Animate on hover",
          text: "Small lift and glow that feels more custom.",
          control: "Lift",
          min: 10,
          max: 90,
          value: 50,
          css: function (scope, value) {
            var y = Math.round(1 + value / 18);
            return scope + " :is(a,button,.summary-item,.product-list-item):not(#" + APP_ID + " *){transition:transform .28s ease,filter .28s ease;} " + scope + " :is(a,button,.summary-item,.product-list-item):hover:not(#" + APP_ID + " *){transform:translateY(-" + y + "px);filter:saturate(1.04);}";
          }
        },
        {
          id: "linkUnderline",
          title: "Header link styles",
          text: "Animated underline for nav and text links.",
          control: "Line",
          min: 20,
          max: 100,
          value: 58,
          css: function (scope, value) {
            var h = Math.max(1, Math.round(value / 26));
            return [
              scope + " :is(nav a,.header-nav a,p a):not(#" + APP_ID + " *){background-image:linear-gradient(" + palette.lettuce + "," + palette.lettuce + ");background-position:0 100%;background-repeat:no-repeat;background-size:0% " + h + "px;text-decoration:none!important;transition:background-size .28s ease,color .28s ease;}",
              scope + " :is(nav a,.header-nav a,p a):hover:not(#" + APP_ID + " *){background-size:100% " + h + "px;color:" + palette.evergreen + "!important;}"
            ].join("\n");
          }
        },
        {
          id: "cursorOnHover",
          title: "Cursor on hover",
          text: "Subtle custom pointer for interactive elements.",
          control: "Size",
          min: 20,
          max: 80,
          value: 45,
          css: function (scope, value) {
            var size = Math.round(14 + value / 5);
            return scope + " :is(a,button,[role='button'],.sqs-block-button-element):not(#" + APP_ID + " *){cursor:crosshair;} body.sp-cursor-on .sp-cursor{width:" + size + "px;height:" + size + "px;}";
          },
          helpers: ["cursor"]
        }
      ]
    },
    {
      name: "Images",
      features: [
        {
          id: "imageReveal",
          title: "Animated image background",
          text: "Soft image reveal on scroll.",
          control: "Fade",
          min: 20,
          max: 100,
          value: 60,
          css: function (scope, value) {
            var y = Math.round(14 + value / 4);
            return [
              scope + " :is(img,picture,.image-block,.sqs-image-shape-container):not(#" + APP_ID + " *){transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1);}",
              scope + ".sp-observe :is(img,picture,.image-block,.sqs-image-shape-container):not(#" + APP_ID + " *){opacity:0;transform:translateY(" + y + "px) scale(.985);}",
              scope + ".sp-observe .sp-in-view:is(img,picture,.image-block,.sqs-image-shape-container), " + scope + ".sp-observe :is(img,picture,.image-block,.sqs-image-shape-container).sp-in-view{opacity:1;transform:none;}"
            ].join("\n");
          },
          helpers: ["observe"]
        },
        {
          id: "imageHoverLift",
          title: "Image styles",
          text: "Premium hover depth for image grids.",
          control: "Depth",
          min: 20,
          max: 100,
          value: 52,
          css: function (scope, value) {
            var lift = Math.round(3 + value / 12);
            return scope + " :is(img,.summary-thumbnail,.gallery-grid-item,.image-block):not(#" + APP_ID + " *){transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s ease;} " + scope + " :is(img,.summary-thumbnail,.gallery-grid-item,.image-block):hover:not(#" + APP_ID + " *){transform:translateY(-" + lift + "px) scale(1.015);box-shadow:0 24px 50px rgba(5,25,20,.18);}";
          }
        },
        {
          id: "imageShapes",
          title: "Animated image shapes",
          text: "Custom radius and organic image corners.",
          control: "Shape",
          min: 0,
          max: 100,
          value: 46,
          css: function (scope, value) {
            var a = Math.round(10 + value / 2);
            var b = Math.round(28 + value / 3);
            return scope + " :is(img,.sqs-image-shape-container,.gallery-grid-image):not(#" + APP_ID + " *){border-radius:" + a + "px " + b + "px " + a + "px " + b + "px;overflow:hidden;}";
          }
        },
        {
          id: "galleryStyles",
          title: "Gallery styles",
          text: "Clean grid spacing and hover focus.",
          control: "Gap",
          min: 20,
          max: 100,
          value: 56,
          css: function (scope, value) {
            var gap = Math.round(8 + value / 4);
            return [
              scope + " :is(.gallery-grid,.summary-item-list,.product-list):not(#" + APP_ID + " *){gap:" + gap + "px!important;}",
              scope + " :is(.gallery-grid-item,.summary-item,.product-list-item):not(#" + APP_ID + " *){border-radius:18px;overflow:hidden;}"
            ].join("\n");
          }
        }
      ]
    },
    {
      name: "Motion",
      features: [
        {
          id: "scrollReveal",
          title: "Animate on scroll",
          text: "Framer-like reveal for sections and blocks.",
          control: "Move",
          min: 20,
          max: 100,
          value: 64,
          css: function (scope, value) {
            var y = Math.round(12 + value / 3);
            return [
              scope + ".sp-observe :is(section,.page-section,.sqs-block,.sp-card):not(#" + APP_ID + " *){opacity:0;transform:translateY(" + y + "px);transition:opacity .75s ease,transform .75s cubic-bezier(.2,.8,.2,1);}",
              scope + ".sp-observe :is(section,.page-section,.sqs-block,.sp-card).sp-in-view{opacity:1;transform:none;}"
            ].join("\n");
          },
          helpers: ["observe"]
        },
        {
          id: "staggerReveal",
          title: "Engagement effects",
          text: "Stagger child blocks for more crafted pages.",
          control: "Delay",
          min: 20,
          max: 100,
          value: 48,
          css: function (scope, value) {
            var delay = Math.round(30 + value);
            return [
              scope + " :is(.sqs-block,.summary-item,.gallery-grid-item,.sp-card):not(#" + APP_ID + " *){transition-delay:calc(var(--sp-i,0) * " + delay + "ms);}",
              scope + " :is(.sqs-block:nth-child(1),.summary-item:nth-child(1),.gallery-grid-item:nth-child(1)){--sp-i:1;}",
              scope + " :is(.sqs-block:nth-child(2),.summary-item:nth-child(2),.gallery-grid-item:nth-child(2)){--sp-i:2;}",
              scope + " :is(.sqs-block:nth-child(3),.summary-item:nth-child(3),.gallery-grid-item:nth-child(3)){--sp-i:3;}",
              scope + " :is(.sqs-block:nth-child(4),.summary-item:nth-child(4),.gallery-grid-item:nth-child(4)){--sp-i:4;}"
            ].join("\n");
          },
          helpers: ["observe"]
        },
        {
          id: "revealOnHover",
          title: "Reveal on hover",
          text: "Cards reveal hidden captions on hover.",
          control: "Reveal",
          min: 20,
          max: 100,
          value: 55,
          css: function (scope, value) {
            var y = Math.round(8 + value / 5);
            return [
              scope + " :is(.summary-content,.image-caption,.portfolio-text):not(#" + APP_ID + " *){transition:opacity .3s ease,transform .3s ease;}",
              scope + " :is(.summary-item,.gallery-grid-item,.portfolio-item):not(#" + APP_ID + " *) :is(.summary-content,.image-caption,.portfolio-text){opacity:.18;transform:translateY(" + y + "px);}",
              scope + " :is(.summary-item,.gallery-grid-item,.portfolio-item):hover :is(.summary-content,.image-caption,.portfolio-text){opacity:1;transform:none;}"
            ].join("\n");
          }
        },
        {
          id: "animatedShapes",
          title: "Animated shapes",
          text: "Tasteful floating accents for selected sections.",
          control: "Soft",
          min: 20,
          max: 90,
          value: 46,
          css: function (scope, value) {
            var opacity = (0.08 + value / 900).toFixed(2);
            return [
              scope + ":not(#" + APP_ID + "){position:relative;overflow:hidden;}",
              scope + ":not(#" + APP_ID + ")::before{content:'';position:absolute;inset:auto 8% 12% auto;width:160px;height:160px;border-radius:999px;background:" + palette.lettuce + ";opacity:" + opacity + ";filter:blur(2px);animation:spFloat 9s ease-in-out infinite;pointer-events:none;}",
              "@keyframes spFloat{0%,100%{transform:translate3d(0,0,0) scale(1);}50%{transform:translate3d(-18px,-12px,0) scale(1.06);}}"
            ].join("\n");
          }
        }
      ]
    },
    {
      name: "Navigation",
      features: [
        {
          id: "headerGlass",
          title: "Header styles",
          text: "Soft sticky glass header for modern pages.",
          control: "Blur",
          min: 20,
          max: 100,
          value: 58,
          css: function (scope, value) {
            var blur = Math.round(6 + value / 8);
            return "body :is(header,.Header,.header,.site-header):not(#" + APP_ID + " *){backdrop-filter:blur(" + blur + "px);-webkit-backdrop-filter:blur(" + blur + "px);background:rgba(252,246,235,.78)!important;border-bottom:1px solid rgba(18,91,73,.14);}";
          }
        },
        {
          id: "mobileMenu",
          title: "Mobile menu styling",
          text: "Cleaner menu panels and larger tap targets.",
          control: "Pad",
          min: 20,
          max: 100,
          value: 56,
          css: function (scope, value) {
            var pad = Math.round(14 + value / 6);
            return "body :is(.header-menu,.Mobile-overlay,.sqs-mobile-overlay-menu):not(#" + APP_ID + " *){background:" + palette.cream + "!important;color:" + palette.midnight + "!important;} body :is(.header-menu a,.Mobile-overlay a,.sqs-mobile-overlay-menu a):not(#" + APP_ID + " *){padding-block:" + pad + "px!important;border-bottom:1px solid rgba(5,25,20,.1);}";
          }
        },
        {
          id: "scrollProgress",
          title: "Scroll indicators",
          text: "A slim progress bar for long editorial pages.",
          control: "Height",
          min: 20,
          max: 100,
          value: 44,
          css: function (scope, value) {
            var h = Math.round(2 + value / 30);
            return ".sp-progress{position:fixed;top:0;left:0;z-index:2147483000;width:var(--sp-progress,0%);height:" + h + "px;background:linear-gradient(90deg," + palette.lettuce + "," + palette.evergreen + ");pointer-events:none;}";
          },
          helpers: ["progress"]
        },
        {
          id: "backToTop",
          title: "Back to top button",
          text: "Small floating button for longer pages.",
          control: "Size",
          min: 20,
          max: 80,
          value: 46,
          css: function (scope, value) {
            var size = Math.round(42 + value / 2);
            return ".sp-top-button{position:fixed;right:22px;bottom:22px;z-index:2147483000;width:" + size + "px;height:" + size + "px;border-radius:999px;border:1px solid rgba(18,91,73,.22);background:" + palette.cream + ";color:" + palette.midnight + ";box-shadow:0 16px 35px rgba(5,25,20,.18);font:700 22px/1 Inter,system-ui,sans-serif;display:grid;place-items:center;opacity:0;transform:translateY(10px);transition:opacity .25s ease,transform .25s ease;cursor:pointer}.sp-top-button.is-visible{opacity:1;transform:none}";
          },
          helpers: ["top"]
        }
      ]
    },
    {
      name: "Utility",
      features: [
        {
          id: "accordionStyles",
          title: "Accordion styles",
          text: "More premium FAQ and service accordions.",
          control: "Line",
          min: 20,
          max: 100,
          value: 62,
          css: function (scope, value) {
            var pad = Math.round(12 + value / 8);
            return scope + " :is(details,.accordion-item,.sqs-block-accordion .accordion-item):not(#" + APP_ID + " *){border:1px solid rgba(18,91,73,.18);border-radius:14px;padding:" + pad + "px;background:rgba(252,246,235,.72);box-shadow:0 10px 26px rgba(5,25,20,.06);} " + scope + " :is(summary,.accordion-item__title):not(#" + APP_ID + " *){font-weight:760;color:" + palette.midnight + ";cursor:pointer;}";
          }
        },
        {
          id: "blockStyling",
          title: "Block styling",
          text: "Quick card treatment for content blocks.",
          control: "Card",
          min: 20,
          max: 100,
          value: 50,
          css: function (scope, value) {
            var pad = Math.round(14 + value / 5);
            return scope + " :is(.sqs-block-html,.sqs-block-summary-v2,.sqs-block-newsletter,.sp-card):not(#" + APP_ID + " *){border:1px solid rgba(18,91,73,.14);border-radius:18px;padding:" + pad + "px;background:rgba(252,246,235,.76);box-shadow:0 18px 45px rgba(5,25,20,.08);}";
          }
        },
        {
          id: "announcementBar",
          title: "Announcement bar styling",
          text: "Branded top strip for promos and launches.",
          control: "Pop",
          min: 20,
          max: 100,
          value: 54,
          css: function (scope, value) {
            var pad = Math.round(8 + value / 12);
            return "body :is(.sqs-announcement-bar,.announcement-bar,.AnnouncementBar):not(#" + APP_ID + " *){background:" + palette.lettuce + "!important;color:" + palette.midnight + "!important;padding-block:" + pad + "px!important;font-weight:760;letter-spacing:0;text-align:center;}";
          }
        },
        {
          id: "scrollbarStyles",
          title: "Scrollbar styles",
          text: "Site scrollbar that matches the brand palette.",
          control: "Width",
          min: 20,
          max: 100,
          value: 46,
          css: function (scope, value) {
            var w = Math.round(8 + value / 14);
            return [
              "html{scrollbar-color:" + palette.evergreen + " " + palette.cream + ";}",
              "body::-webkit-scrollbar{width:" + w + "px}body::-webkit-scrollbar-track{background:" + palette.cream + "}body::-webkit-scrollbar-thumb{background:" + palette.evergreen + ";border-radius:999px;border:2px solid " + palette.cream + "}"
            ].join("\n");
          }
        }
      ]
    }
  ];

  var features = {};
  featureGroups.forEach(function (group) {
    group.features.forEach(function (feature) {
      features[feature.id] = feature;
      defaults.features[feature.id] = { enabled: false, value: feature.value };
    });
  });

  var state = loadState();
  var root;
  var selectionMode = false;
  var hoverTarget = null;
  var selectedElement = null;
  var observers = [];

  function loadState() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return merge(defaults, stored);
    } catch (error) {
      return merge(defaults, {});
    }
  }

  function merge(base, patch) {
    var output = JSON.parse(JSON.stringify(base));
    Object.keys(patch || {}).forEach(function (key) {
      if (patch[key] && typeof patch[key] === "object" && !Array.isArray(patch[key])) {
        output[key] = merge(output[key] || {}, patch[key]);
      } else {
        output[key] = patch[key];
      }
    });
    return output;
  }

  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function round(value, places) {
    var multiplier = Math.pow(10, places || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (attrs[key] === false || attrs[key] === null || attrs[key] === undefined) return;
      if (key === "checked" && attrs[key] !== true && attrs[key] !== "checked") return;
      if (key === "class") node.className = attrs[key];
      else if (key === "text") node.textContent = attrs[key];
      else if (key === "html") node.innerHTML = attrs[key];
      else if (key.indexOf("on") === 0) node.addEventListener(key.slice(2), attrs[key]);
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function init() {
    injectUiStyles();
    root = el("div", { id: APP_ID }, []);
    document.documentElement.appendChild(root);
    render();
    applyEffects();
  }

  function render() {
    var activeGroup = featureGroups.find(function (group) { return group.name === state.tab; }) || featureGroups[0];
    root.innerHTML = "";
    root.className = state.compact ? "sp compact" : "sp";

    var tabs = el("nav", { class: "sp-tabs", "aria-label": "Feature groups" }, featureGroups.map(function (group) {
      return el("button", {
        class: "sp-tab" + (group.name === state.tab ? " is-active" : ""),
        type: "button",
        text: group.name,
        onclick: function () {
          state.tab = group.name;
          saveState();
          render();
        }
      });
    }));

    var selectedText = state.scope === "page" ? "Editing whole page" : state.selectedLabel;

    var scopeBar = el("div", { class: "sp-scope" }, [
      el("div", { class: "sp-selected" }, [
        el("span", { class: "sp-kicker", text: state.scope === "page" ? "WHOLE PAGE" : "SELECTED" }),
        el("strong", { text: selectedText })
      ]),
      el("div", { class: "sp-segment" }, [
        el("button", {
          class: state.scope === "selection" ? "is-active" : "",
          type: "button",
          text: "Selected",
          onclick: function () {
            state.scope = "selection";
            saveState();
            render();
            applyEffects();
          }
        }),
        el("button", {
          class: state.scope === "page" ? "is-active" : "",
          type: "button",
          text: "Whole page",
          onclick: function () {
            state.scope = "page";
            saveState();
            render();
            applyEffects();
          }
        })
      ]),
      el("div", { class: "sp-actions" }, [
        el("button", { class: "sp-ghost", type: "button", text: selectionMode ? "Selecting..." : "Pick section", onclick: toggleSelectionMode }),
        el("button", { class: "sp-icon", type: "button", title: "Clear selection", text: "x", onclick: clearSelection })
      ])
    ]);

    var cards = el("div", { class: "sp-card-list" }, activeGroup.features.map(renderFeature));

    var panel = el("section", { class: "sp-panel", role: "dialog", "aria-label": "Studio Poema styling panel" }, [
      el("header", { class: "sp-head" }, [
        el("div", { class: "sp-logo", text: "SP" }),
        el("div", { class: "sp-brand" }, [
          el("h2", { text: "Studio Poema" }),
          el("p", { text: "Squarespace styling system" })
        ]),
        el("button", { class: "sp-icon", type: "button", title: "Reset settings", text: "↺", onclick: resetSettings }),
        el("button", { class: "sp-icon", type: "button", title: "Compact panel", text: state.compact ? "+" : "–", onclick: function () {
          state.compact = !state.compact;
          saveState();
          render();
        }})
      ]),
      el("div", { class: "sp-body" }, [
        tabs,
        el("main", { class: "sp-main" }, [
          scopeBar,
          cards
        ])
      ]),
      el("footer", { class: "sp-foot" }, [
        el("button", { class: "sp-primary", type: "button", text: "Copy final code", onclick: function () { copyText(getFinalCode(), "Final code copied"); } }),
        el("button", { class: "sp-secondary", type: "button", text: "Copy CSS", onclick: function () { copyText(getCss(), "CSS copied"); } })
      ])
    ]);

    root.appendChild(panel);
  }

  function renderFeature(feature) {
    var item = state.features[feature.id] || { enabled: false, value: feature.value };
    var card = el("article", { class: "sp-feature" + (item.enabled ? " is-on" : "") }, [
      el("div", { class: "sp-preview sp-preview-" + feature.id }, [el("span")]),
      el("div", { class: "sp-feature-copy" }, [
        el("div", { class: "sp-row" }, [
          el("h3", { text: feature.title }),
          el("label", { class: "sp-switch", title: "Enable " + feature.title }, [
            el("input", {
              type: "checkbox",
              checked: item.enabled ? "checked" : "",
              onchange: function (event) {
                state.features[feature.id].enabled = event.target.checked;
                saveState();
                render();
                applyEffects();
              }
            }),
            el("span")
          ])
        ]),
        el("p", { text: feature.text }),
        el("div", { class: "sp-slider-row" }, [
          el("input", {
            type: "range",
            min: feature.min,
            max: feature.max,
            value: item.value,
            oninput: function (event) {
              state.features[feature.id].value = Number(event.target.value);
              event.target.nextSibling.textContent = feature.control + " · " + event.target.value;
              applyEffects();
              saveState();
            }
          }),
          el("strong", { text: feature.control + " · " + item.value })
        ])
      ])
    ]);
    return card;
  }

  function getScopeSelector() {
    if (state.scope === "page") return "body";
    if (!state.selectedScope) return "body";
    return "[" + SCOPE_ATTR + "='" + state.selectedScope + "']";
  }

  function getCss() {
    var scope = getScopeSelector();
    var chunks = [
      ":root{--sp-cream:" + palette.cream + ";--sp-asparagus:" + palette.asparagus + ";--sp-lettuce:" + palette.lettuce + ";--sp-evergreen:" + palette.evergreen + ";--sp-coach:" + palette.coach + ";--sp-midnight:" + palette.midnight + ";}",
      "@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important;}}"
    ];

    Object.keys(state.features).forEach(function (id) {
      var item = state.features[id];
      var feature = features[id];
      if (item && item.enabled && feature) {
        chunks.push("/* " + feature.title + " */");
        chunks.push(feature.css(scope, item.value));
      }
    });

    return chunks.join("\n\n");
  }

  function getFinalCode() {
    var css = getCss().replace(/<\/style/gi, "<\\/style");
    var helperIds = getActiveHelpers();
    var helperCode = getRuntimeHelpers(helperIds).replace(/<\/script/gi, "<\\/script");
    return "<style id=\"studio-poema-exported-css\">\n" + css + "\n</style>\n<script>\n" + helperCode + "\n<\/script>";
  }

  function getActiveHelpers() {
    var helpers = {};
    Object.keys(state.features).forEach(function (id) {
      var item = state.features[id];
      var feature = features[id];
      if (!item || !item.enabled || !feature || !feature.helpers) return;
      feature.helpers.forEach(function (helper) { helpers[helper] = true; });
    });
    return Object.keys(helpers);
  }

  function getRuntimeHelpers(helperIds) {
    return "(function(){\n" +
      "var helpers=" + JSON.stringify(helperIds) + ";\n" +
      runtimeHelpersSource() +
      "\nrunStudioPoemaHelpers(helpers);\n" +
      "})();";
  }

  function runtimeHelpersSource() {
    return String(function runStudioPoemaHelpers(helpers) {
      var has = function (name) { return helpers.indexOf(name) > -1; };
      if (has("observe") && "IntersectionObserver" in window) {
        document.querySelectorAll(".sp-observe").forEach(function (scope) {
          var targets = scope.querySelectorAll("section,.page-section,.sqs-block,.sp-card,img,picture,.image-block,.sqs-image-shape-container");
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("sp-in-view");
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
          targets.forEach(function (target) { observer.observe(target); });
        });
      }
      if (has("progress")) {
        var bar = document.querySelector(".sp-progress") || document.createElement("div");
        bar.className = "sp-progress";
        document.body.appendChild(bar);
        var updateProgress = function () {
          var max = document.documentElement.scrollHeight - innerHeight;
          var pct = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
          document.documentElement.style.setProperty("--sp-progress", pct + "%");
        };
        addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
      }
      if (has("top")) {
        var topButton = document.querySelector(".sp-top-button") || document.createElement("button");
        topButton.className = "sp-top-button";
        topButton.type = "button";
        topButton.setAttribute("aria-label", "Back to top");
        topButton.textContent = "↑";
        document.body.appendChild(topButton);
        topButton.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });
        var updateTop = function () { topButton.classList.toggle("is-visible", scrollY > innerHeight * 0.7); };
        addEventListener("scroll", updateTop, { passive: true });
        updateTop();
      }
      if (has("cursor") && matchMedia("(pointer:fine)").matches) {
        document.body.classList.add("sp-cursor-on");
        var cursor = document.querySelector(".sp-cursor") || document.createElement("div");
        cursor.className = "sp-cursor";
        cursor.style.cssText = "position:fixed;left:0;top:0;border:1px solid rgba(18,91,73,.45);border-radius:999px;pointer-events:none;z-index:2147482999;transform:translate(-50%,-50%);transition:width .2s ease,height .2s ease,opacity .2s ease;opacity:.75";
        document.body.appendChild(cursor);
        addEventListener("mousemove", function (event) {
          cursor.style.left = event.clientX + "px";
          cursor.style.top = event.clientY + "px";
        }, { passive: true });
      }
    });
  }

  function applyEffects() {
    document.querySelectorAll("." + ACTIVE_CLASS).forEach(function (node) {
      node.classList.remove(ACTIVE_CLASS, "sp-observe");
    });
    selectedElement = state.selectedScope ? document.querySelector("[" + SCOPE_ATTR + "='" + state.selectedScope + "']") : null;
    var target = state.scope === "page" ? document.body : selectedElement;
    if (target) {
      target.classList.add(ACTIVE_CLASS);
      if (getActiveHelpers().indexOf("observe") > -1) target.classList.add("sp-observe");
    }

    var style = document.getElementById(STYLE_ID) || el("style", { id: STYLE_ID }, []);
    style.textContent = getCss();
    document.head.appendChild(style);

    cleanupHelpers();
    installHelpers();
  }

  function installHelpers() {
    var helpers = getActiveHelpers();
    var source = getRuntimeHelpers(helpers);
    try {
      new Function(source)();
    } catch (error) {
      console.warn("Studio Poema helper error", error);
    }
  }

  function cleanupHelpers() {
    observers.forEach(function (observer) { observer.disconnect(); });
    observers = [];
    document.querySelectorAll(".sp-progress,.sp-top-button,.sp-cursor").forEach(function (node) { node.remove(); });
    document.body.classList.remove("sp-cursor-on");
  }

  function toggleSelectionMode() {
    selectionMode ? stopSelectionMode() : startSelectionMode();
    render();
  }

  function startSelectionMode() {
    selectionMode = true;
    document.addEventListener("mousemove", onSelectionMove, true);
    document.addEventListener("click", onSelectionClick, true);
    document.addEventListener("keydown", onSelectionKey, true);
    document.body.classList.add("sp-picking");
  }

  function stopSelectionMode() {
    selectionMode = false;
    if (hoverTarget) hoverTarget.classList.remove("sp-hover-target");
    hoverTarget = null;
    document.removeEventListener("mousemove", onSelectionMove, true);
    document.removeEventListener("click", onSelectionClick, true);
    document.removeEventListener("keydown", onSelectionKey, true);
    document.body.classList.remove("sp-picking");
  }

  function onSelectionMove(event) {
    var target = findSelectable(event.target);
    if (target === hoverTarget) return;
    if (hoverTarget) hoverTarget.classList.remove("sp-hover-target");
    hoverTarget = target;
    if (hoverTarget) hoverTarget.classList.add("sp-hover-target");
  }

  function onSelectionClick(event) {
    var target = findSelectable(event.target);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    selectElement(target);
    stopSelectionMode();
    saveState();
    render();
    applyEffects();
  }

  function onSelectionKey(event) {
    if (event.key === "Escape") {
      stopSelectionMode();
      render();
    }
  }

  function findSelectable(node) {
    if (!node || node.nodeType !== 1) return null;
    if (root && root.contains(node)) return null;
    var selector = "section,[data-section-id],.page-section,.sqs-section,.sqs-block,[id^='block-'],main > div,header,footer";
    var match = node.closest(selector);
    if (!match || match === document.documentElement || match === document.body) return null;
    return match;
  }

  function selectElement(node) {
    var id = node.getAttribute(SCOPE_ATTR);
    if (!id) {
      id = "sp-" + Math.random().toString(36).slice(2, 9);
      node.setAttribute(SCOPE_ATTR, id);
    }
    state.selectedScope = id;
    state.selectedLabel = labelFor(node);
    state.scope = "selection";
  }

  function labelFor(node) {
    var id = node.id ? "#" + node.id : "";
    var data = node.getAttribute("data-section-id") || node.getAttribute("data-block-id") || "";
    var cls = (node.className && typeof node.className === "string") ? "." + node.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return (node.tagName.toLowerCase() + (id || (data ? " · " + data : cls))).slice(0, 72);
  }

  function clearSelection() {
    state.selectedScope = "";
    state.selectedLabel = "Nothing selected";
    saveState();
    render();
    applyEffects();
  }

  function resetSettings() {
    state = merge(defaults, {});
    saveState();
    render();
    applyEffects();
  }

  function copyText(text, label) {
    navigator.clipboard.writeText(text).then(function () {
      toast(label);
    }).catch(function () {
      var area = el("textarea", { value: text }, []);
      area.style.position = "fixed";
      area.style.left = "-999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      toast(label);
    });
  }

  function toast(text) {
    var node = el("div", { class: "sp-toast", text: text }, []);
    root.appendChild(node);
    setTimeout(function () { node.classList.add("is-visible"); }, 20);
    setTimeout(function () { node.remove(); }, 1800);
  }

  function injectUiStyles() {
    if (document.getElementById(UI_STYLE_ID)) return;
    var css = [
      "#" + APP_ID + "{all:initial;position:fixed;right:24px;top:24px;z-index:2147483647;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:" + palette.midnight + ";}",
      "#" + APP_ID + " *{box-sizing:border-box;font-family:inherit;letter-spacing:0;}",
      "#" + APP_ID + " .sp-panel{width:min(860px,calc(100vw - 40px));height:min(760px,calc(100vh - 48px));display:grid;grid-template-rows:auto minmax(0,1fr) auto;background:rgba(252,246,235,.96);border:1px solid rgba(18,91,73,.18);border-radius:28px;box-shadow:0 30px 90px rgba(5,25,20,.22);overflow:hidden;backdrop-filter:blur(18px);}",
      "#" + APP_ID + ".compact .sp-panel{width:430px;height:620px;}",
      "#" + APP_ID + " .sp-head{display:grid;grid-template-columns:78px 1fr 56px 56px;align-items:center;gap:14px;padding:26px 28px;border-bottom:1px solid rgba(18,91,73,.14);}",
      "#" + APP_ID + " .sp-logo{width:64px;height:64px;border-radius:22px;display:grid;place-items:center;background:" + palette.cream + ";border:1px solid rgba(18,91,73,.18);font-weight:900;color:" + palette.evergreen + ";}",
      "#" + APP_ID + " h2,#" + APP_ID + " h3,#" + APP_ID + " p{margin:0;}",
      "#" + APP_ID + " .sp-brand h2{font-size:30px;line-height:1.02;font-weight:900;color:" + palette.midnight + ";}",
      "#" + APP_ID + " .sp-brand p{margin-top:6px;font-size:18px;font-weight:650;color:rgba(5,25,20,.62);}",
      "#" + APP_ID + " button{font:inherit;}",
      "#" + APP_ID + " .sp-icon{width:50px;height:50px;border-radius:18px;border:1px solid rgba(18,91,73,.2);background:rgba(255,255,255,.42);color:" + palette.midnight + ";font-size:24px;font-weight:900;cursor:pointer;}",
      "#" + APP_ID + " .sp-body{min-height:0;display:grid;grid-template-columns:230px minmax(0,1fr);}",
      "#" + APP_ID + ".compact .sp-body{grid-template-columns:1fr;}#" + APP_ID + ".compact .sp-tabs{display:flex;align-items:center;overflow:auto;border-right:0;border-bottom:1px solid rgba(18,91,73,.14);padding:12px;}#" + APP_ID + ".compact .sp-tab{width:auto;flex:0 0 auto;white-space:nowrap;}",
      "#" + APP_ID + " .sp-tabs{display:block;min-width:0;padding:28px 22px;border-right:1px solid rgba(18,91,73,.14);background:rgba(236,234,190,.22);overflow:auto;}",
      "#" + APP_ID + " .sp-tab{display:block;width:100%;border:0;background:transparent;text-align:left;padding:15px 18px;border-radius:18px;color:rgba(5,25,20,.76);font-size:20px;font-weight:850;cursor:pointer;}",
      "#" + APP_ID + " .sp-tab.is-active{background:" + palette.evergreen + ";color:" + palette.cream + ";}",
      "#" + APP_ID + " .sp-main{min-width:0;display:grid;grid-template-rows:auto minmax(0,1fr);}",
      "#" + APP_ID + " .sp-scope{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:12px;align-items:center;padding:24px 24px 18px;border-bottom:1px solid rgba(18,91,73,.12);}",
      "#" + APP_ID + ".compact .sp-scope{grid-template-columns:1fr;}",
      "#" + APP_ID + " .sp-selected{min-width:0;background:rgba(255,255,255,.56);border:1px solid rgba(18,91,73,.14);border-radius:18px;padding:14px 16px;}",
      "#" + APP_ID + " .sp-selected strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:18px;line-height:1.2;color:" + palette.midnight + ";}",
      "#" + APP_ID + " .sp-kicker{display:block;margin-bottom:4px;font-size:12px;font-weight:900;color:rgba(5,25,20,.58);}",
      "#" + APP_ID + " .sp-segment{display:flex;gap:6px;padding:5px;background:rgba(255,255,255,.48);border:1px solid rgba(18,91,73,.14);border-radius:18px;}",
      "#" + APP_ID + " .sp-segment button{border:0;border-radius:13px;background:transparent;padding:12px 16px;color:" + palette.midnight + ";font-weight:850;cursor:pointer;white-space:nowrap;}",
      "#" + APP_ID + " .sp-segment button.is-active{background:" + palette.asparagus + ";box-shadow:inset 0 0 0 1px rgba(18,91,73,.18);}",
      "#" + APP_ID + " .sp-actions{display:flex;gap:8px;}",
      "#" + APP_ID + " .sp-ghost{height:50px;border-radius:16px;border:1px solid rgba(18,91,73,.2);background:transparent;padding:0 15px;font-weight:850;color:" + palette.midnight + ";cursor:pointer;white-space:nowrap;}",
      "#" + APP_ID + " .sp-card-list{min-height:0;overflow:auto;overflow-x:hidden;padding:20px 24px 28px;display:grid;gap:18px;scrollbar-color:rgba(18,91,73,.45) rgba(252,246,235,.4);}",
      "#" + APP_ID + " .sp-feature{min-width:0;display:grid;grid-template-columns:150px minmax(0,1fr);gap:20px;align-items:center;padding:18px 20px;border:1px solid rgba(18,91,73,.14);border-radius:22px;background:rgba(255,255,255,.55);box-shadow:0 12px 32px rgba(5,25,20,.05);}",
      "#" + APP_ID + ".compact .sp-feature{grid-template-columns:90px 1fr;padding:14px;gap:14px;}",
      "#" + APP_ID + " .sp-feature.is-on{border-color:rgba(18,91,73,.36);background:rgba(236,234,190,.38);}",
      "#" + APP_ID + " .sp-preview{height:100px;border-radius:18px;background:" + palette.cream + ";border:1px solid rgba(18,91,73,.16);display:grid;place-items:center;overflow:hidden;}",
      "#" + APP_ID + ".compact .sp-preview{height:76px;}",
      "#" + APP_ID + " .sp-preview span{width:66%;height:14px;background:" + palette.evergreen + ";display:block;border-radius:8px;box-shadow:0 20px 0 rgba(18,91,73,.5),0 -20px 0 " + palette.lettuce + ";}",
      "#" + APP_ID + " .sp-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;}",
      "#" + APP_ID + " .sp-feature h3{font-size:22px;line-height:1.08;font-weight:900;color:" + palette.midnight + ";overflow-wrap:anywhere;}",
      "#" + APP_ID + " .sp-feature p{margin-top:5px;font-size:16px;line-height:1.32;font-weight:600;color:rgba(5,25,20,.62);}",
      "#" + APP_ID + " .sp-switch{position:relative;width:70px;height:40px;display:block;}",
      "#" + APP_ID + " .sp-switch input{position:absolute;opacity:0;}",
      "#" + APP_ID + " .sp-switch span{position:absolute;inset:0;border-radius:999px;background:rgba(5,25,20,.16);cursor:pointer;transition:background .2s ease;}",
      "#" + APP_ID + " .sp-switch span::after{content:'';position:absolute;width:32px;height:32px;left:4px;top:4px;border-radius:999px;background:white;box-shadow:0 3px 10px rgba(5,25,20,.2);transition:transform .2s ease;}",
      "#" + APP_ID + " .sp-switch input:checked + span{background:" + palette.evergreen + ";}",
      "#" + APP_ID + " .sp-switch input:checked + span::after{transform:translateX(30px);}",
      "#" + APP_ID + " .sp-slider-row{display:grid;grid-template-columns:minmax(0,1fr) 108px;gap:14px;align-items:center;margin-top:16px;}",
      "#" + APP_ID + " input[type='range']{width:100%;accent-color:" + palette.evergreen + ";}",
      "#" + APP_ID + " .sp-slider-row strong{font-size:14px;color:rgba(5,25,20,.64);white-space:nowrap;text-align:right;}",
      "#" + APP_ID + " .sp-foot{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:18px 24px 24px;border-top:1px solid rgba(18,91,73,.14);background:rgba(252,246,235,.95);}",
      "#" + APP_ID + " .sp-primary,#" + APP_ID + " .sp-secondary{height:58px;border-radius:18px;font-size:18px;font-weight:900;cursor:pointer;}",
      "#" + APP_ID + " .sp-primary{border:0;background:" + palette.evergreen + ";color:" + palette.cream + ";}",
      "#" + APP_ID + " .sp-secondary{border:1px solid rgba(18,91,73,.18);background:rgba(255,255,255,.5);color:" + palette.midnight + ";}",
      "#" + APP_ID + " .sp-toast{position:absolute;left:50%;bottom:92px;transform:translateX(-50%) translateY(8px);opacity:0;padding:12px 16px;border-radius:999px;background:" + palette.midnight + ";color:" + palette.cream + ";font-weight:850;transition:opacity .2s ease,transform .2s ease;box-shadow:0 12px 30px rgba(5,25,20,.22);}",
      "#" + APP_ID + " .sp-toast.is-visible{opacity:1;transform:translateX(-50%) translateY(0);}",
      ".sp-hover-target{outline:3px dashed #ff65f0!important;outline-offset:5px!important;}",
      "body.sp-picking{cursor:copy!important;}",
      "@media (max-width:760px){#" + APP_ID + "{left:12px;right:12px;top:12px;}#" + APP_ID + " .sp-panel{width:calc(100vw - 24px);height:calc(100vh - 24px);border-radius:24px;}#" + APP_ID + " .sp-head{grid-template-columns:58px 1fr 48px 48px;padding:18px;}#" + APP_ID + " .sp-logo{width:52px;height:52px;border-radius:18px;}#" + APP_ID + " .sp-brand h2{font-size:24px;}#" + APP_ID + " .sp-brand p{font-size:14px;}#" + APP_ID + " .sp-body{grid-template-columns:1fr;}#" + APP_ID + " .sp-tabs{display:flex;align-items:center;overflow:auto;border-right:0;border-bottom:1px solid rgba(18,91,73,.14);padding:12px;}#" + APP_ID + " .sp-tab{width:auto;flex:0 0 auto;white-space:nowrap;font-size:16px;padding:12px 14px;}#" + APP_ID + " .sp-scope{grid-template-columns:1fr;padding:16px;}#" + APP_ID + " .sp-feature{grid-template-columns:84px 1fr;padding:14px;gap:12px;}#" + APP_ID + " .sp-preview{height:72px;}#" + APP_ID + " .sp-feature h3{font-size:18px;}#" + APP_ID + " .sp-feature p{font-size:14px;}#" + APP_ID + " .sp-foot{grid-template-columns:1fr;padding:14px;}}"
    ].join("\n");
    document.head.appendChild(el("style", { id: UI_STYLE_ID, text: css }, []));
  }

  window.__studioPoemaClean = {
    destroy: function () {
      stopSelectionMode();
      cleanupHelpers();
      [APP_ID, STYLE_ID, UI_STYLE_ID].forEach(function (id) {
        var node = document.getElementById(id);
        if (node) node.remove();
      });
      delete window.__studioPoemaClean;
    },
    state: state,
    css: getCss,
    finalCode: getFinalCode
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
