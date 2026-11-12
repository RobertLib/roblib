# roblib.dev

Personal site of Robert Libsansky — portfolio plus the privacy policies of his
App Store apps. Plain HTML and CSS with a little vanilla JavaScript: no build
step, no dependencies.

Hosted on GitHub Pages from `main`; the custom domain is set in `CNAME`.

## Files

| Path                           | What it is                                                      |
| ------------------------------ | --------------------------------------------------------------- |
| `index.html`                   | The portfolio page                                              |
| `styles.css`                   | Styles for every page                                           |
| `privacy-policy-<app>.html`    | Privacy policy of an app, English                               |
| `privacy-policy-<app>-cs.html` | The same policy in Czech                                        |
| `404.html`                     | Served by GitHub Pages for any missing URL (uses absolute paths) |
| `fonts/`                       | Self-hosted Inter and JetBrains Mono (SIL OFL, licences inside)  |
| `og-image.png`                 | 1200×630 preview used when the site is shared                   |
| `google9c6c3f1645c36096.html`  | Google Search Console verification — keep it                    |
| `_config.yml`                  | Keeps this README off the published site (GitHub Pages / Jekyll) |

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
   links in both.
2. Name the app as its App Store listing does in that language — the part
   before the colon, or the full name (`Chess Offline` / `Šachy offline`,
   `Mini Golf 3D: 108 Holes` / `Minigolf 3D: 108 jamek`).
3. Add both URLs to `sitemap.xml`.
4. Bump "Last updated" in both languages whenever the policy text changes.
5. Once the app is live, add it to `index.html` and update the counts (meta
   description, Open Graph, hero stats, About, services).

## Local preview

```sh
python3 -m http.server 8000
```

then open <http://localhost:8000>.
