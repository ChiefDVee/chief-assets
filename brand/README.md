# brand/ — Chief huisstijl

**Bron van waarheid** voor de huisstijl van alle Chief-sites (chiefke.com, chiefcount.com, chiefmix.com, …).
Sites krijgen **kopieën** van deze bestanden via `chief_brand_sync_engine.py` (privé tooling). Een site laadt nooit
rechtstreeks uit deze repo (geen jsDelivr, geen raw.githubusercontent): elke site serveert alles van de eigen origin.

**De kopieën in de sites nooit met de hand bewerken.** Wijzig hier, en synchroniseer daarna. Elke gegenereerde CSS
begint met een `GENERATED`-kopregel met de sha256 van de bron; een handbewerking wordt bij de controle als drift gemeld.

## Inhoud
| Bestand | Wat |
|---|---|
| `chief-tokens.css` | `:root`-set `--chief-*`: kleuren, radius, fonts, spacing. Eén donker thema, geen light-variant. Plus grafiekreeks `--chief-chart-2(-dim)` en het printpalet `--chief-print-*` (wit papier, enkel voor PDF/print-export, geen schermthema) |
| `fonts/fonts.css` | catalogus met alle `@font-face`-blokken (relatieve `url("…woff2")`). Per site wordt een fonts.css gegenereerd met enkel de gekozen families |
| `fonts/*.woff2` | Latin-subsets, worden byte-identiek gekopieerd |
| `fonts/OFL-*.txt` | SIL Open Font License 1.1 per font, worden byte-identiek meegekopieerd |
| `footer/chief-footer.html` | sjabloon van de gedeelde Chief-footer (placeholders `@@LINE@@ @@LINKS@@ @@NAME@@ @@YEAR@@ @@CONTACT@@`). De per-site inhoud (naam, site-regel, links, contact) staat in de privé sync-config, niet hier |
| `footer/chief-footer.css` | footer-stijl, enkel `var(--chief-*)`; verborgen in full screen en print |

## Beslissingen (2026-11-11)
- Accent `--chief-accent: #f7931a` (8.62 : 1 op `#0a0a0a`).
- Alle sites donker (ook ChiefMix, later).
- Body-font = systeemstack (`--chief-font-body`), geen webfont.
- Knoppen = pill (`--chief-radius-pill`).

## Fonts
| Familie | Bestand(en) | Licentie |
|---|---|---|
| Archivo Black | `archivo-black-latin-400.woff2` | `OFL-archivoblack.txt` |
| Bowlby One | `bowlby-one-latin-400.woff2` | `OFL-bowlbyone.txt` (Reserved Font Name: enkel ongewijzigd herverdelen) |
| Figtree | `figtree-latin-var.woff2` (variabel 400–800) | `OFL-figtree.txt` |
| JetBrains Mono | `jetbrains-mono-latin-500.woff2` | `OFL-jetbrainsmono.txt` |
| QOTD Bodoni (Bodoni Moda) | `bodoni-moda-latin-{400,700}-normal.woff2` | `OFL-bodonimoda.txt` |

Naamconventie (de sync-engine controleert ze): `<naam>-latin-….woff2` hoort bij `OFL-<naam zonder streepjes>.txt`.
Een font zonder OFL, of een OFL zonder font, geldt als een ongeldige bron.

Een font toevoegen: woff2 + OFL in `fonts/`, een `@font-face`-blok in `fonts/fonts.css`, daarna synchroniseren.

`../fonts/bodoni-moda/` blijft voorlopig staan voor oude jsDelivr-links; dezelfde bestanden staan hier.

## Footer (2026-11-12)
Alle sites delen één footer: optionele site-regel, linkrij (site-links + "More tools → chiefke.com"), en
"© 2026 <naam> · <contact> · Made in Belgium · 𝕏 @ChiefXBelgium". Geen donatie- of tipknop.
Sites krijgen een gegenereerde kopie (statisch tussen `<!-- CHIEF-FOOTER:START/END -->`, Flask als `_chief_footer.html`)
met een `GENERATED`-kop (sha256 van het sjabloon + hash van de site-config); nooit met de hand bewerken.
