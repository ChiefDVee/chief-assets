# ChiefTiles

Self-rendered letter tiles as SVG strings. One classic script (`chief-tiles.js`, no ES modules, works via `file://`),
colours only from the Chief brand tokens (`var(--chief-*)`), zero external requests. MIT, see `LICENSE` (this folder only).

**Status: v0.1.0 = design proof of concept.** The look of the tiles is not final; `preview.html` exists to design it.

## Open the preview

Open `preview.html` directly in a browser (double-click or `open preview.html`), no server needed.
It loads `../brand/chief-tokens.css` and `chief-tiles.js` with relative paths.

## API (`window.ChiefTiles`, `module.exports` under node)

| | |
|---|---|
| `VERSION` | `"0.1.0"` |
| `render(tile, opts)` | → SVG string. `tile = {id?, letter, value, blank?, meta?}` |
| `mount(el, svg)` | puts the SVG into `el` without `innerHTML` and without style attributes (CSP-safe), returns the `<svg>` element |
| `splitStyles(svg)` | pure step of `mount`: `{markup, styles}` (every `style="…"` → `data-ct-s="<i>"`) |
| `validateSet(json)` | full validation, throws `ChiefTiles set "<id>": <path> …` |
| `loadSet(json \| id)` | → flat list of tiles `{id, letter, value}` + blanks `{id, letter: "", value: 0, blank: true}` |
| `BUILTIN_SETS` | all `sets/*.json`, generated into the script (never edit by hand) |

`render` options: `size` (px, default 64), `radius` (px, default 8), `faceStyle` (`minimal` default, `classic`),
`faceDown` (neutral back: no letter, no value, no `data-tile-id`), and colour overrides `faceToken`, `edgeToken`,
`letterToken`, `valueToken`. Every token (in opts or `tile.meta`) must start with `--chief-`, anything else throws.

- A letter may be several characters (`IJ`, `QU`, max 3); it is set smaller automatically so it fits.
- Blank tile: `blank: true`, no letter or a chosen letter in a different style (italic, dashed inner border, no value).
- Tile text is raw data; `render()` escapes it exactly once. Outside `render()` show text with `textContent`, never `innerHTML`.

## Set schema (`sets/<id>.json`)

```json
{"id": "demo", "name": "…", "lang": "nl", "tiles": [{"letter": "A", "value": 1, "count": 2}], "blanks": 2}
```

`id` = file name, `lang` = 2-3 lower-case letters, `tiles` non-empty with unique letters (case-insensitive),
`value` 0-99, `count` 1-100, `blanks` 0-20. `sets/demo.json` is a **demo** with placeholder values, not a real distribution.

Letter dice: planned, see `dice/README.md`.
