# roblib.dev

Personal site of Robert Libsansky — portfolio plus the privacy policies of his
App Store apps. Plain HTML and CSS with a little vanilla JavaScript: no build
step, no dependencies.

Hosted on GitHub Pages from `main`; the custom domain is set in `CNAME`.

## Files

| Path                           | What it is                                                      |
| ------------------------------ | --------------------------------------------------------------- |
| `index.html`                   | The portfolio page                                              |
| `cs/index.html`                | The same page in Czech, at `/cs/` (uses absolute paths)         |
| `styles.css`                   | Styles for every page                                           |
| `privacy-policy-<app>.html`    | Privacy policy of an app, English                               |
| `privacy-policy-<app>-cs.html` | The same policy in Czech                                        |
| `404.html`                     | Served by GitHub Pages for any missing URL (uses absolute paths) |
| `fonts/`                       | Self-hosted Inter and JetBrains Mono (SIL OFL, licences inside)  |
| `og-image.png`                 | 1200×630 preview used when the site is shared                   |
| `og-image.html`                | Source of `og-image.png` (not published)                        |
| `og-image-cs.png`, `.html`     | The Czech preview, used by `/cs/`, and its source               |
| `google9c6c3f1645c36096.html`  | Google Search Console verification — keep it                    |
| `_config.yml`                  | Keeps repository-only files off the published site (Jekyll)     |

The fonts are the Google Fonts subsets: `latin` and `latin-ext`, plus an
`arrows` file holding only the "↗" glyph. A character outside those ranges
falls back to a system font.

## Privacy policy URLs are public contracts

Each policy URL is entered in App Store Connect, so **never rename or delete a
published `privacy-policy-*.html`** — the App Store listing would point at a
404. The file names follow the bundle IDs (`cz.rob.crosswords` →
`privacy-policy-crosswords.html`, published as Wordwander).

When adding a policy:

1. Copy an existing pair (EN + CS) and update the canonical and `hreflang`
   links in both. Keep the closing "Contact and your rights" section as it
   is: it holds the GDPR notices (controller, legal basis, retention, rights).
   Czech text takes the en dash with spaces (` – `), English the em dash.
2. Name the app as its App Store listing does in that language — the part
   before the colon, or the full name (`Chess Offline` / `Šachy offline`,
   `Mini Golf 3D: 108 Holes` / `Minigolf 3D: 108 jamek`).
3. Add both URLs to `sitemap.xml`.
4. Bump "Last updated" in both languages whenever the policy text changes,
   and the page's `<lastmod>` in `sitemap.xml` with it.
5. Once the app is live, add it to `index.html` and `cs/index.html` and
   update the counts (meta description, Open Graph, hero stats, About,
   services). They are baked into both preview images too: change them in
   `og-image.html` and `og-image-cs.html` and render both again (below).
   Bump both homepages' `<lastmod>` in `sitemap.xml`.

## Czech homepage

`cs/index.html` is a translation of `index.html`, so every change to the
English page needs its Czech twin. It sits one folder down, so its local
paths are absolute (`/styles.css`, `/profile.jpeg`). Apps go by their Czech
App Store names (`Šachy offline: hra pro dva`, `Solitér: Pasiáns
Solitaire`), and the Czech text keeps one-letter prepositions on the next
word with `&nbsp;` (`v&nbsp;Reactu`). The Czech policies link back to `/cs/`.

## Open Graph image

`og-image.png` is a screenshot of `og-image.html`, which uses the site's own
styles, fonts and photo. With the local preview running (below):

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --hide-scrollbars --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot=og-image.png http://localhost:8000/og-image.html
```

The Czech one the same way, from `og-image-cs.html` to `og-image-cs.png`.

## Local preview

```sh
python3 -m http.server 8000
```

then open <http://localhost:8000>.
