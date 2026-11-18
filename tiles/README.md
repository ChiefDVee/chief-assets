# ChiefTiles

Self-rendered letter tiles as SVG strings. One classic script (`chief-tiles.js`, no ES modules, works via `file://`),
colours only from the Chief brand tokens (`var(--chief-*)`), zero external requests, no fonts: letters and digits are
monoline SVG paths, so a tile looks the same on every device. MIT, see `LICENSE` (this folder only).

**Status: v0.2.0 = design proof of concept.** Letter design settled (monoline glyphs); tile shape, distributions and dice are still open.

## Open the preview

Open `preview.html` directly in a browser (double-click or `open preview.html`), no server needed.
It loads `../brand/chief-tokens.css` and `chief-tiles.js` with relative paths. Sliders for size and stroke, a field for the back label.

## API (`window.ChiefTiles`, `module.exports` under node)

| | |
|---|---|
| `VERSION` | `"0.2.0"` |
| `render(tile, opts)` | → SVG string. `tile = {id?, letter, value, blank?, meta?}` |
| `mount(el, svg)` | puts the SVG into `el` without `innerHTML` and without style attributes (CSP-safe), returns the `<svg>` element |
| `splitStyles(svg)` | pure step of `mount`: `{markup, styles}` (every `style="…"` → `data-ct-s="<i>"`) |
| `validateSet(json)` | full validation, throws `ChiefTiles set "<id>": <path> …` |
| `validateGlyphs(json)` | full validation of a glyph font, throws `ChiefTiles glyphs "<id>": <path> …` |
| `loadSet(json \| id)` | → flat list of tiles `{id, letter, value}` + blanks `{id, letter: "", value: 0, blank: true}` |
| `BUILTIN_SETS` / `BUILTIN_GLYPHS` | all `sets/*.json` / `glyphs/*.json`, generated into the script (never edit by hand) |

`render` options: `size` (px, default 64), `radius` (px, default 8), `faceStyle` (`minimal` default = flat dark, `classic` = cream, for print),
`stroke` (letter line width in viewBox units of 100, default 7, range 1-20), `faceDown` (back: no letter, no value, no `data-tile-id`),
`backLabel` (game name on the back, 1-12 letters A-Z, case-insensitive; `ChiefWords` → two lines CHIEF / WORDS), and colour overrides
`faceToken`, `edgeToken`, `letterToken`, `valueToken`. Every token (in opts or `tile.meta`) must start with `--chief-`, anything else throws.

- A set tile is exactly one letter A-Z. `render()` also takes 1-3 characters with a glyph (A-Z, 0-9), side by side and scaled down
  to fit, for a later die face like `QU`. A character without a glyph throws.
- Value: integer 0-99, monoline digits bottom right.
- Blank tile: `blank: true`, no letter or a chosen letter in the blank colour with a dashed inner border, no value.
- Tile id is raw data; `render()` escapes it exactly once. Outside `render()` show text with `textContent`, never `innerHTML`.

## Glyph schema (`glyphs/<id>.json`)

```json
{"id": "monoline", "capHeight": 14, "glyphs": {"A": {"w": 11, "d": "M0 14 L5.5 0 L11 14 M2 9 H9"}}}
```

`w` = ink width in glyph units, `d` = path data with only absolute `M L H V Q A Z`, coordinates inside x -1..w+1, y -1..capHeight+1.
Exactly A-Z and 0-9. Drawn as strokes (`fill: none`, round caps and joins).

## Set schema (`sets/<id>.json`)

```json
{"id": "demo", "name": "…", "lang": "nl", "tiles": [{"letter": "A", "value": 1, "count": 2}], "blanks": 2}
```

`id` = file name, `lang` = 2-3 lower-case letters, `tiles` non-empty with unique letters, each exactly one letter A-Z
(no lower case, no accents, no digraph tiles: IJ is played as I + J), `value` 0-99, `count` 1-100, `blanks` 0-20.
`sets/demo.json` is a **demo** with placeholder values, not a real distribution.

Letter dice: planned, see `dice/README.md`.
