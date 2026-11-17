# cards/ — ChiefCards (PoC)

Zelf-gerenderde speelkaarten als SVG-strings. Eén classic script (geen ES-modules, werkt via `file://`),
kleuren/fonts enkel via `var(--chief-*)` uit `../brand/chief-tokens.css`, nul externe requests.
Kleuren ♠♥♦♣ zijn handgetekende SVG-paths: geen tekstglyphs (iOS maakt van ♥♦ emoji).
Decks zijn **config, geen code**: standaardkaarten, custom kaarten en runtime-templates staan in de deck-JSON.

**Status:** in gebruik op chiefshuffle.com en chiefcount.com, telkens via een vendor-kopie (`static/vendor/chief-cards-<versie>.js` + LICENSE).

## Bestanden
| Bestand | Wat |
|---|---|
| `chief-cards.js` | library → `window.ChiefCards` (onder node ook `module.exports`) |
| `chief-cards.css` | flip-widget (`.cc-card`, 3D-flip) |
| `decks/*.json` | **de bron**: `standard` (54), `manillen` (32), `pesten` (54), `jinx-demo` (32, volledig custom), `sats-demo` (56 + template), `rami` (108: `copies: 2` + 4 jokers) |
| `demo/index.html` | testpagina + tweak-paneel |

## Demo openen
Dubbelklik `demo/index.html` (of `open demo/index.html`). Geen server nodig. De pagina laadt
`../../brand/chief-tokens.css`, `../chief-cards.css` en `../chief-cards.js` relatief.
Secties: schudden & delen, volledig deck (dropdown toont elk deck uit `BUILTIN_DECKS`), custom kaarten (één per icoon +
de sats-demo-config live uit `BUILTIN_DECKS` + validatiefouten), templates (`n` invullen → "Create bonus card").
Tweak-paneel: deck, faceStyle, backStyle, grootte, radius, rood (overschrijft `--chief-card-red` enkel op de demo),
faceDown. "Export settings" geeft de huidige keuzes als JSON om als defaults in te bakken.

## API
```js
ChiefCards.render(card, opts)                  // → SVG-string. card = {id, suit, rank, meta}
ChiefCards.mount(el, svg)                      // CSP-veilig: vervangt de inhoud van el door de SVG; geeft het <svg>-element terug (v0.4.0)
ChiefCards.splitStyles(svg)                    // pure stap van mount: → {markup (style="…" → data-cc-s="i"), styles: [css, …]}
ChiefCards.flipHTML(card, opts)                // → <button class="cc-card"> met voor- en achterkant (CSS 3D-flip)
ChiefCards.bindFlip(el)                        // klik-delegatie: toggelt .is-flipped; geeft een unbind-functie terug
ChiefCards.loadDeck(json)                      // object of JSON-string → array kaarten; Error bij foute config
ChiefCards.validateDeck(json)                  // enkel valideren → genormaliseerd deck (zelfde errors)
ChiefCards.fromTemplate(deck, name, vars)      // runtime-kaart uit deck.templates[name]; deck = JSON of BUILTIN_DECKS-naam
ChiefCards.shuffle(arr)                        // Fisher-Yates met crypto.getRandomValues (rejection sampling); NIEUWE array
ChiefCards.ICONS                               // icon-registry (zie hieronder)
ChiefCards.BUILTIN_DECKS                       // de decks inline (file:// kan geen JSON fetchen)
ChiefCards.DEFAULTS / SUITS / RANKS / SUIT_PATHS / FACE_STYLES / BACK_STYLES / VERSION
```
`opts`: `size` (breedte in px, hoogte = ×1.4, default 120), `radius` (px op die grootte, default 8 = `--chief-radius-sm`),
`faceStyle` (`minimal` | `monogram`), `backStyle` (`lattice` | `dots`), `faceDown` (bool), `backWordmark` (default `Cards` → "ChiefCards").

De SVG gebruikt `style="fill:var(--chief-…)"`: ze moet **inline** in een document staan dat `chief-tokens.css` laadt
(als `<img>`/data-URI resolven de variabelen niet).

**Strikte CSP** (`style-src` zonder `'unsafe-inline'`): style-attributen in markup worden geblokkeerd, en ook DOMParser
meldt dan een overtreding. Gebruik daarom `ChiefCards.mount(el, ChiefCards.render(card, opts))`, nooit `innerHTML`:
- `splitStyles()` hernoemt elk `style="…"` naar `data-cc-s="<index>"` en zet de declaraties in een lijst. Weer samenvoegen geeft byte voor byte de `render()`-string.
- `mount()` parset die markup via DOMParser (`image/svg+xml`), doet `importNode` in het document van `el` en zet de stijlen via CSSOM (`el.style.setProperty`), wat een CSP niet blokkeert.
- Daarna verdwijnt elk `data-cc-s` en vervangt de SVG alle kinderen van `el`.
- CSSOM-stijlen staan daarna wel als `style` in de geserialiseerde DOM (`outerHTML`). Dat is normaal en geen CSP-overtreding.

**Verborgen kaarten:** render een neutrale dummy zonder `id` (`render({suit: 'spades', rank: '?'}, {faceDown: true})`).
Een kaart met `id` krijgt `data-card-id`, en `flipHTML()` bevat altijd de voorkant.

## Kaart-object en `meta`
- Gewone kaart: `{id, suit: "spades"|"hearts"|"diamonds"|"clubs", rank: "A".."10"|"J"|"Q"|"K", meta: {}}`
- Joker: `{suit: "joker", rank: "JOKER", meta: {variant: "accent"|"ink"}}`
- Custom kaart: `{suit: "custom", rank: "X", meta: {...}}`

| `meta`-veld | Effect |
|---|---|
| `label` | hoekindex (`""` = enkel icoon), max 12 tekens |
| `title` | onderschrift, max 24 tekens |
| `colorToken` / `iconColorToken` / `faceToken` | tekst / icoon / kaartvlak, bv. `"--chief-card-red"`. In deck-JSON verplicht `--chief-*` |
| `icon` | naam uit `ChiefCards.ICONS`, of `{paths: [{d, stroke?, fillRule?, colorToken?}], rotate?}` |
| `iconPath` (+ `iconFillRule`, `iconRotate`) | eenmalig eigen path (100×100-vak); niet samen met `icon` |
| `variant` | joker: `accent` \| `ink` |

Op gewone kaarten vervangen `icon`/`iconPath` de suit-pip. Paths worden gevalideerd (enkel path-commando's en getallen),
tekst wordt in `render()` ge-escaped (kaartdata = ruwe tekst).

## Icon-registry `ChiefCards.ICONS`
`plus2`, `plus4`, `bitcoin`, `skip`, `reverse`, `wild` (4 segmenten: `--chief-card-red`, `--chief-accent`,
`--chief-chart-2`, `--chief-ok`), `star`, `crown`. Iconen leven in een 100×100-vak; een path zonder `colorToken` krijgt de
icoonkleur van de kaart, `colorToken: "@face"` = de kleur van het kaartvlak (bv. het plusteken op een kaartje).

## Deck-JSON-schema
```json
{
  "name": "sats-demo",                  // [a-z0-9_-], 1-40, = bestandsnaam
  "description": "optioneel",
  "suits": ["spades", "hearts", "diamonds", "clubs"],   // mag [] (samen met ranks): volledig custom deck
  "ranks": ["A", "2", "…", "K"],
  "copies": 1,                          // 1-8, enkel voor suits × ranks
  "extra_cards": [{"rank": "JOKER", "meta": {"variant": "accent"}}],
  "custom_cards": [
    {"id_prefix": "hodl", "rank": "HODL", "count": 4,
     "meta": {"title": "HODL", "icon": "bitcoin", "faceToken": "--chief-bg", "colorToken": "--chief-text", "iconColorToken": "--chief-accent"}}
  ],
  "templates": {
    "bonus": {"rank": "BONUS", "meta": {"label": "{n}", "title": "{n} SATS", "icon": "bitcoin", "faceToken": "--chief-bg"}}
  }
}
```
- `custom_cards[]`: `id_prefix` (uniek in het deck), `rank` (1-6 tekens) en `count` (1-200) verplicht, `meta` optioneel.
  Geeft `count` kaarten met id `<id_prefix>-1 … -<count>`, `suit: "custom"`.
- `extra_cards[]`: `{rank: "JOKER"}` (geen suit), `{rank: "<A..K>", suit: "<suit>"}` of `{rank: "<1-6 tekens>", suit: "custom", meta}`.
- `templates`: `{naam: {rank, meta}}`; `{var}`-placeholders in `rank`, `label`, `title`.
- Een deck heeft minstens 1 kaart. Onbekende sleutels, ontbrekende velden, `count` < 1, dubbele `id_prefix`/suits/ranks/id's,
  tokens zonder `--chief-`, onbekende iconen → `Error('ChiefCards deck "<naam>": <pad> …')`, bv.
  `custom_cards[0].meta.icon = "rocket" is not a known icon (known: …)`.
- Kaart-id's: `<deck>-<suit>-<rank>` (`-c<n>` bij `copies` > 1), extra's `<deck>-<suit>-<rank>-x<n>`, custom `<id_prefix>-<n>`.

## Templates (kaarten die het spel aanmaakt)
```js
var card = ChiefCards.fromTemplate('sats-demo', 'bonus', { n: 500 });
// → {id: "sats-demo-bonus-1-…", suit: "custom", rank: "BONUS", meta: {label: "500", title: "500 SATS", …, template: "bonus"}}
```
- Ingevulde waarden blijven **ruwe tekst** in `rank`/`meta.label`/`meta.title` (`<script>` blijft `<script>`); enkel `render()`
  escapet, exact één keer. Toon meta-tekst buiten `render()` altijd via `textContent`, nooit via `innerHTML`. (v0.3.0; tot v0.2.0
  gaf `fromTemplate` HTML-ge-escapete tekst terug.)
- Ontbrekende variabele (of `null`) → `Error('… missing variable "n" …')`; enkel strings en eindige getallen; te lang na invullen → Error.
- Id = `<deck>-<template>-<volgnummer>-<random>` (uniek per sessie, botst niet met deck-id's).

## Decks inline houden
`decks/*.json` is de bron. Het blok tussen `BUILTIN_DECKS:START` en `BUILTIN_DECKS:END` in `chief-cards.js` wordt
gegenereerd door `chief_cards_inline_engine.py` (privé tooling, `--check` meldt drift). Nooit met de hand bewerken:
JSON aanpassen → engine draaien. Een nieuw `decks/<naam>.json` verschijnt daarna vanzelf in de demo-dropdown.

## Tokens
`--chief-card-face` (crème kaartvlak) en `--chief-card-red` (♥♦) staan in `../brand/chief-tokens.css`.
Zwarte kleuren ♠♣ = `--chief-bg`; kaders/joker/backs = `--chief-accent`; achterkant = `--chief-bg` + wordmark
"Chief" in `--chief-text` + rest in `--chief-accent`.
