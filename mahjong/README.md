# ChiefMahjong

Self-rendered tiles for a tile-matching solitaire game, as SVG strings. One classic script (`chief-mahjong.js`, no ES
modules, works via `file://`), colours only from the Chief brand tokens (`var(--chief-*)`), zero external requests.
Every picture is a filled SVG path (no text, emoji or Unicode glyphs); only the small corner index 1-9 is text in the
system font. MIT, see `LICENSE` (this folder only).

**Status: v0.1.0.** 42 kinds, two themes (`animals` = default, `geometric`).

## Open the preview

Open `preview.html` directly in a browser, no server needed. It loads `../brand/chief-tokens.css`, `chief-mahjong.js`
and `preview.js` with relative paths: every kind in both themes at size 60 and 40, the tile states, and a 3-layer board.

## Kinds (`kinds.json`, the canonical list for renderer and server)

| Category | Ids | Copies | Matches |
|---|---|---|---|
| suit1, suit2, suit3 (rank 1-9) | `s1-1` … `s3-9` | 4 each | same id |
| wind | `w-n` `w-e` `w-s` `w-w` | 4 each | same id |
| dragon | `d-1` `d-2` `d-3` | 4 each | same id |
| flower | `f-1` … `f-4` | 1 each | any flower (`group: "flower"`) |
| season | `x-1` … `x-4` | 1 each | any season (`group: "season"`) |

Each kind: `{id, group, copies, category, rank?}`. Two tiles match when their `group` is equal. Total 144.

## Themes (`themes/<id>.json`)

`{id, name: {en, nl}, description, tiles: {<kind-id>: {icon, colorToken, rotate?, index?}}}`. A theme covers exactly all
42 kinds; `icon` is a name from `ChiefMahjong.ICONS`, `colorToken` a `--chief-*` token, `rotate` 0/90/180/270,
`index` (corner index 1-9) defaults to true for suit tiles. No two kinds of one theme share (icon, rotate, colour, rank).

## API (`window.ChiefMahjong`, `module.exports` under node)

| | |
|---|---|
| `VERSION` | `"0.1.0"` |
| `render(tile, opts)` | → SVG string. `tile = {kind, id?}`; `data-tile-id` only when `id` is set |
| `geometry(opts)` | → `{faceWidth, faceHeight, edge, width, height}` in px (the game UI only positions) |
| `mount(el, svg)` | puts the SVG into `el` without `innerHTML` and without style attributes (CSP-safe), returns the `<svg>` |
| `splitStyles(svg)` | pure step of `mount`: `{markup, styles}` (every `style="…"` → `data-cm-s="<i>"`) |
| `validateTheme(theme \| id)` | full validation, throws `ChiefMahjong theme "<id>": …`; returns the theme |
| `kind(id)` / `matches(a, b)` | kind lookup / same group |
| `KINDS`, `BUILTIN_THEMES`, `ICONS`, `PIP_LAYOUTS` | data (KINDS + BUILTIN_THEMES generated from the JSON, never edit by hand) |

`render` options: `theme` (id or object, default `animals`), `size` (face width in px, default 60; face height 1.3 ×),
`radius` (px, default 8), `selected` (thicker accent outline), `blocked` (dimmed via tokens: dark face), `hint`
(ok-coloured outline), `edge` (default true: depth side bottom-right, part of the SVG).

## Strict CSP

`render()` colours via `style="fill:var(--chief-…)"`. Under `style-src 'self'` use `mount()`; it applies the styles via
CSSOM. Same approach as ChiefCards (a stand-alone copy, so neither library depends on the other).
