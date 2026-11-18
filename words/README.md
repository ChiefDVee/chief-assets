# Chief word lists

Filtered word lists per language, built with the Chief toolbox from the listed sources. They are meant **only for word
validation on the server** of the Chief letter games: a client never receives a word list.

This folder is **not** covered by `tiles/LICENSE` (MIT). Each language folder carries the licence of its own source.

| Folder | Source | Licence |
|---|---|---|
| `nl/` | OpenTaal Dutch word list (`wordlist.txt`, opentaal-wordlist) | Revised BSD and/or CC BY 3.0, at your choice: `nl/LICENSE-SOURCE.txt` (verbatim `LICENSE.txt`) + `nl/README-SOURCE.txt` (verbatim `README.md`), which OpenTaal asks to keep with every copy |
| `en/` | ENABLE (Enhanced North American Benchmark LExicon), `enable1.txt` | public domain, notice + source sha256 in `en/LICENSE-SOURCE.txt` |

## Files per language

- `words.txt`: the filtered list, one word per line, A-Z upper case, sorted, unique, LF, final newline.
- `LICENSE-SOURCE.txt` (and for `nl/` also `README-SOURCE.txt`): the licence of the source.
- `manifest.json`: source name, version and sha256 per source file, build date, the normalisation rules as text,
  counts (source, dropped per reason with 5 examples each, final), words per length, sha256 of every output.
  `"levels": null` for now (bot vocabulary levels come later).
- `letterfreq.json`: per letter A-Z `count` (occurrences over all words), `words_with` (words containing the letter at
  least once), `share` (% of all letters, 3 decimals) and `share_len2_8` (the same over words of 2-8 letters, the words
  you actually play from a rack). Basis for our own tile distribution and point values.
- `bot_blocklist.txt`: words a bot never plays (validation still accepts them). Maintained by hand; seeded once.

## Normalisation (identical for every language)

1. A word that starts with a capital letter in the source is a proper noun: dropped. A word in all capitals is an
   acronym: dropped. A capital letter further in the word (pH, kWh) is mixed case: dropped.
2. Dropped: anything with a digit, space, hyphen, apostrophe, period or other punctuation or symbol.
3. The ij digraph character (U+0133/U+0132) becomes IJ. Then Unicode NFKD, combining marks removed, then upper case
   (an accented e becomes E).
4. Anything other than A-Z after step 3 is dropped.
5. Length 2-15 letters.
6. Deduplicated after normalisation, sorted.

## Rebuilding

The lists are built with the Chief toolbox from the listed sources (downloaded by hand, the builder never downloads).
A rebuild from the same sources is byte for byte identical apart from the build date in `manifest.json`;
the sha256 values in the manifest let you verify every output.
