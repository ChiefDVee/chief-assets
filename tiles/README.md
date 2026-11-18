# ChiefTiles

Self-rendered letter tiles as SVG strings. One classic script (`chief-tiles.js`, no ES modules, works via `file://`),
colours only from the Chief brand tokens (`var(--chief-*)`), zero external requests, no fonts: letters and digits are
monoline SVG paths, so a tile looks the same on every device. MIT, see `LICENSE` (this folder only).

**Status: v0.3.1 = design proof of concept.** Letter design settled (monoline glyphs), letter sets `nl`/`en` (100 tiles) and `nl_small`/`en_small` (60 tiles),
two empty boards (`large` 15×15, `small` 11×11) via `renderBoard`; tile shape and dice are still open.

## Open the preview

Open `preview.html` directly in a browser (double-click or `open preview.html`), no server needed.
It loads `../brand/chief-tokens.css` and `chief-tiles.js` with relative paths. Sliders for size and stroke, a field for the back label, a section with both boards.

## API (`window.ChiefTiles`, `module.exports` under node)

| | |
|---|---|
| `VERSION` | `"0.3.1"` |
| `render(tile, opts)` | → SVG string. `tile = {id?, letter, value, blank?, meta?}` |
| `mount(el, svg)` | puts the SVG into `el` without `innerHTML` and without style attributes (CSP-safe), returns the `<svg>` element |
| `splitStyles(svg)` | pure step of `mount`: `{markup, styles}` (every `style="…"` → `data-ct-s="<i>"`) |
| `validateSet(json)` | full validation, throws `ChiefTiles set "<id>": <path> …` |
| `validateGlyphs(json)` | full validation of a glyph font, throws `ChiefTiles glyphs "<id>": <path> …` |
| `validateBoard(json)` | full validation of a board, throws `ChiefTiles board "<id>": <path> …` |
| `renderBoard(board \| id, opts)` | → SVG string of an **empty** board; `opts.size` (px, whole board, default 480), `opts.faceStyle` (`minimal` default, `classic`) |
| `loadSet(json \| id)` | → flat list of tiles `{id, letter, value}` + blanks `{id, letter: "", value: 0, blank: true}` |
| `BUILTIN_SETS` / `BUILTIN_GLYPHS` / `BUILTIN_BOARDS` | all `sets/*.json` / `glyphs/*.json` / `boards/*.json`, generated into the script (never edit by hand) |

`render` options: `size` (px, default 64), `radius` (px, default 8), `faceStyle` (`minimal` default = flat dark, `classic` = cream, for print),
`stroke` (letter line width in viewBox units of 100, default 7, range 1-20), `faceDown` (back: no letter, no value, no `data-tile-id`),
`backLabel` (game name on the back, 1-12 letters A-Z, case-insensitive; `ChiefWords` → two lines CHIEF / WORDS), and colour overrides
`faceToken`, `edgeToken`, `letterToken`, `valueToken`. Every token (in opts or `tile.meta`) must start with `--chief-`, anything else throws.

- A set tile is exactly one letter A-Z. `render()` also takes 1-3 characters with a glyph (A-Z, 0-9), side by side and scaled down
  to fit, for a later die face like `QU`. A character without a glyph throws.
- Value: integer 0-99, monoline digits bottom right.
- Blank tile: `blank: true`, no letter or a chosen letter in the blank colour with a dashed inner border, no value.
- Back (`faceDown`): diagonal lattice + double frame, scale-aware: the lattice step is at least 6 px on screen (never finer than at 75 px and up),
  at least 3 lines per direction, lattice and frame lines at least 1 px wide, so a back stays visible on a 44 px rack.
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
`sets/nl.json` (Nederlands) and `sets/en.json` (English): 100 tiles each (98 letters, every letter A-Z at least once, + 2 blanks), for the large board.
`sets/nl_small.json` and `sets/en_small.json`: 60 tiles each (58 letters + 2 blanks), same derivation, same values per letter, for the small board.
Our own distribution, derived from the letter frequency of our own word lists (`../words/<lang>/letterfreq.json`) and tuned by hand;
the JSON files are the source. `sets/demo.json` is a **demo** with placeholder values, not a real distribution.

## Board schema (`boards/<id>.json`)

```json
{"id": "small", "name": "Small board", "size": 11, "start": [5, 5],
 "premiums": {"2L": [[0, 3]], "3L": [[3, 3]], "2W": [[1, 5]], "3W": [[1, 1]]}, "sets": {"nl": "nl_small", "en": "en_small"}}
```

`id` = file name, `size` odd 7-21, `start` = the centre, coordinates are 0-based `[row, col]` (row 0 at the top).
Every square has at most one premium, the start square has none. `sets` maps a language to an existing set of that language.
Unknown keys are an error. `boards/large.json` (15×15, sets `nl`/`en`) and `boards/small.json` (11×11, sets `nl_small`/`en_small`).

`renderBoard` draws every square as `<g data-cell="r,c" role="img" aria-label="Double letter | Triple letter | Double word | Triple word | Start | Empty">`;
the SVG has `aria-label="Board 15 by 15"`. Premium squares carry their label (`2L`, `3L`, `2W`, `3W`) in monoline glyphs, so colour is never
the only difference. The start square shows the scale-aware tile back without a label, in its own colours so it stands out:
lattice in full `--chief-accent` on `--chief-surface-2` (`minimal`) or `--chief-bg` (`classic`), plus an accent border twice as thick as the 2W border.
Colours only from the brand tokens: 3W `--chief-accent`, 2W accent border on `--chief-accent-dim`, 3L `--chief-chart-2`,
2L chart-2 border on `--chief-chart-2-dim`. `mount` and `splitStyles` work the same as for tiles.

Letter dice: planned, see `dice/README.md`.
