# ChiefTiles — letter dice (planned)

Nothing here yet: no data and no `renderDie()`. This folder reserves the place and the schema for a later round.

Planned schema, one JSON file per set (`dice/<id>.json`):

```json
{
  "id": "nl-demo",
  "lang": "nl",
  "dice": [
    ["A", "E", "I", "O", "U", "QU"],
    ["…six letters per die…"]
  ]
}
```

- `id` = file name without `.json` (1-40 chars `[a-z0-9_-]`), `lang` = language code (`nl`, `en`, …).
- `dice` = list of dice, each exactly 6 faces; a face is 1-3 characters with a glyph (A-Z, e.g. `QU`).
  Unlike a set tile (always one letter), a die face may have several characters; they are drawn through the multi-character
  path of `render()`: glyphs side by side, scaled down uniformly to fit.
- The letters per die are our own, derived from letter frequencies in our own word list. Never copied from an existing commercial game.
- Will be inlined into `chief-tiles.js` by the same inline engine as `sets/` once it exists.
