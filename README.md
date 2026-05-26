# Squarespace Template Studio

`extension.js` yra pirmas SquareKicker tipo MVP: į Squarespace Footer Code Injection įdedamas scriptas, kuris parodo dizaino panelę ir leidžia taikyti efektus sekcijoms arba blokams.

## Kaip testuoti lokaliai

Atidaryk `demo.html` naršyklėje. Panelė atsiras dešinėje viršuje.

1. Spausk `Pick`.
2. Pasirink sekciją arba bloką.
3. Įjunk efektus pagal kategorijas: Layout, Typography, Buttons, Images, Motion, Navigation, Utility.
4. Spausk `Copy install code`, kai nori gauti kodą Squarespace Footer Injection laukui.

## Kaip diegti į Squarespace

Kai `extension.js` bus patalpintas viešame URL, į Squarespace įklijuok:

```html
<script src="https://tavo-domainas.com/extension.js" defer></script>
```

Kad panelė tikrai atsirastų redagavimo metu, galima atidaryti puslapį su `?ssx_editor=1`. Vėliau panelę galima kviesti klavišais `Alt + S` arba `Cmd + S`.

## Svarbus MVP apribojimas

Šis pirmas variantas neturi backend’o ir automatiškai neįrašo kodo į Squarespace paskyrą. Jis:

- pritaiko efektus gyvai naršyklėje;
- saugo nustatymus naršyklės `localStorage`;
- sugeneruoja install/config kodą, kurį galima įklijuoti į Squarespace;
- gali būti išplėstas į SaaS su vartotojais, licencijomis, backup’ais ir automatiniu sinchronizavimu.

## Funkcijų grupės

- Layout: full bleed, framed sections, mobile spacing, split grid.
- Typography: editorial text, highlights, gradient headings, balanced headings.
- Buttons: hover lift, magnetic glow, sharp corners, pill buttons.
- Images: shadows, rounded media, zoom hover, duotone tint.
- Motion: scroll reveal, parallax, float, stagger.
- Navigation: glass header, animated links, compact header.
- Utility: hide mobile, hide desktop, sticky target, pointer polish.
