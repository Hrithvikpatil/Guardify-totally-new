# Guardify — website

Marketing site for a performance-based salon customer-acquisition agency
(10% of the customer's first purchase, one time) with a second line of business
connecting brands to social-media creators.

**Stack: none.** Plain HTML, one CSS file, one JS file. No npm, no framework,
no database, no build server. The only tool is a ~60-line Python script that
pastes the shared header/footer into each page so you don't edit it ten times.

---

## Run it

```bash
# just open it
xdg-open index.html

# or serve it (needed if you want clean URLs locally)
python3 -m http.server 8000    # → http://localhost:8000
```

## Edit it

| I want to change… | Edit this | Then |
|---|---|---|
| Phone, WhatsApp, email, brand name, domain | `site.json` | `python3 build.py` |
| Words on a page | `pages/<page>.html` | `python3 build.py` |
| Header, footer, `<head>`, nav links | `templates/shell.html` | `python3 build.py` |
| Colours, fonts, spacing | `assets/css/styles.css` | nothing — it's live |
| Behaviour (slider, form, menu) | `assets/js/main.js` | nothing — it's live |
| Page titles / SEO descriptions | the `PAGES` dict in `build.py` | `python3 build.py` |
| The stat numbers (100+, 1000+, 20+) | `site.json` → `stats` | `python3 build.py` |
| Which logos scroll in the marquee | add/remove files in `assets/img/brands/` | `python3 build.py` |

> ⚠️ **Never edit the `.html` files in the project root** — they're generated and
> get overwritten. Edit `pages/*.html` instead.

```bash
python3 build.py
# Built 10 pages: index.html, how-it-works.html, ...
```

---

## Structure

```
site.json              ← brand + contact details (single source of truth)
build.py               ← assembles pages (python3 build.py)
templates/shell.html   ← <head>, header, nav, footer, WhatsApp button
pages/*.html           ← the content of each page  ← EDIT THESE
assets/css/styles.css  ← design tokens + all styling
assets/js/main.js      ← nav, scroll reveal, fee calculator, contact form
assets/img/            ← logo.svg, favicon.svg
assets/img/brands/     ← 20 client logos (.webp) — plus _unused/ (ignored by the build) — the marquee builds itself from this folder
*.html                 ← GENERATED output — deploy these
robots.txt sitemap.xml netlify.toml
```

### Pages

| File | Purpose |
|---|---|
| `index.html` | Home — problem, model, how it works, services, fee calculator, why us |
| `how-it-works.html` | The 8-step process end to end |
| `services.html` | Google Ads, Meta Ads, WhatsApp leads, landing pages, creative, tracking |
| `for-salons.html` | Who we work with, what we need, what to expect |
| `creators.html` | The influencer side — brands we place creators with, logo marquee, how it works |
| `performance-model.html` | Pricing — 10%, one time, with the calculator |
| `about.html` | Mission and approach |
| `faq.html` | 14 questions, native `<details>` accordion |
| `contact.html` | Three tabbed forms (salon / creator / brand) + WhatsApp, call, email tiles |
| `404.html` | Not found |

---

## The brand marquee & stat band

The scrolling "brands we've worked with" strip appears on **Home**, **Creators**
and **For Salons**; the stat band also appears on **About**.

**Neither is hand-written markup.** `build.py` scans `assets/img/brands/`, splits
the logos into two rows scrolling in opposite directions, duplicates each row so
the CSS animation loops seamlessly, and substitutes it wherever a page contains
`{{BRAND_MARQUEE}}`. `{{STATS_BAND}}` is built the same way from `site.json`.

### Adding or removing a logo

1. Drop a `.webp` into `assets/img/brands/` (or move one out).
2. `python3 build.py`.

`assets/img/brands/_unused/` holds 19 logos pulled from the wall because they
were template duplicates of a logo already shown — same ornament, same frame,
same font, only the name changed. The build globs `*.webp` non-recursively, so
anything in `_unused/` is ignored. Move a file back up one level and rebuild to
restore it.

**Keep the wall visually varied.** Before adding a logo, check it isn't the same
template as one already there — a row of near-identical marks reads as filler
and undermines the proof it's meant to provide.

The filename becomes the `alt` text: `glow-and-grace.webp` → "Glow & Grace".
Irregular names live in `NAME_FIXES` at the top of `build.py`.

**Logo image spec** — 400×200, white background, logo centred with margin. To
re-import a folder of raw logos at that spec, the normalising script (composite
onto white, unify off-white card backgrounds, trim, fit, pad, encode WebP) is
the one used originally; the key rules are: never upscale past 1.6×, always
preserve aspect ratio, and output every file at identical dimensions so the
chips look consistent.

> ⚠️ The marquee images deliberately do **not** use `loading="lazy"`. They start
> off-screen to the right, so lazy loading leaves blank chips as they scroll in.
> All 20 are WebP and total ~105 KB.

### The numbers

`site.json` → `stats`. **These are placeholders — set them to your real
figures before launch:**

| Shown | Where it came from |
|---|---|
| `100+` salons we've worked with | your figure |
| `1000+` influencers we've worked with | your figure |
| `20+` brands in our partner network | the number of logo files displayed |
| `10%` one-time fee | your model |

Also confirm you have permission to display each client's logo, and that the
supplied logo set represents real clients before publishing "brands we've
worked with".

---

## Before you go live — checklist

1. **`site.json`** — phone, WhatsApp, email, domain and Instagram are all set to
   the real details. If any change, edit here only; the number must stay in
   international format without `+` or spaces (e.g. `919103615033`) for the
   WhatsApp links to work.
2. **Domain + mailbox** — register `guardify.co.in`, point it at the host, and
   create the `Contact@guardify.co.in` mailbox. (`sitemap.xml` and `robots.txt`
   are generated from `site.json` → `domain`, so there is nothing to hand-edit.)
3. **Contact form** — no enquiry is stored until you set `formEndpoint`. See
   [`form-backend/README.md`](form-backend/README.md).
4. **Social share image** — add `assets/img/og.jpg` (1200×630) and add
   `<meta property="og:image" content="https://yourdomain/assets/img/og.jpg">`
   to `templates/shell.html`.
5. **Analytics** — paste your GA4 / Meta Pixel snippet just before `</body>` in
   `templates/shell.html`, then rebuild. (You'll want the Pixel anyway for the ads.)
6. Run `python3 build.py` one final time and deploy.

### Contact forms

There are **three separate forms** on `contact.html`, switched by tabs, because
the three audiences need completely different questions:

| Tab | Deep link | Asks for |
|---|---|---|
| I run a salon | `contact.html#salon` | Salon name, owner, location, branches, services to promote |
| I'm a creator | `contact.html#creator` | Name, Instagram handle, other platforms, followers, city, niche, rates |
| I'm a brand | `contact.html#brand` | Brand name, contact, website, product category, campaign budget |

The Creators page CTAs deep-link straight to the right tab, so a creator never
lands on a form asking for their salon's branch count.

**Where enquiries go is set by `formEndpoint` in `site.json`.** While it is
empty (the default) nothing is stored anywhere — see
[`form-backend/README.md`](form-backend/README.md) for the 10-minute Google
Sheet setup, which is what you want before running any ads.

Out of the box the forms have **no backend** — on submit each opens WhatsApp
with its own details pre-filled and its own heading ("New salon enquiry" /
"New creator application" / "New brand enquiry") so you can tell them apart at
a glance. Nothing is ever lost. That is a perfectly good v1.

Adding a fourth form is just: copy a `.tabs__panel` block, give the form
`class="js-lead"` and a `data-title` — the JS picks up any `.js-lead` form,
validates its `required` fields, and builds the message from the `<label>` text
automatically.

To also capture submissions in your inbox/sheet:

1. Create a free form endpoint (Formspree, Web3Forms, Getform, or a Google Apps
   Script webhook).
2. Put the URL in `site.json` → `"formEndpoint"`.
3. `python3 build.py`.

All three forms will POST JSON there (each tagged with its `type`), and **fall
back to WhatsApp automatically** if the request fails.

---

## Deploy

Any static host. Nothing to configure.

- **Netlify** — drag the folder onto [netlify.com/drop](https://app.netlify.com/drop),
  or connect the repo (`netlify.toml` is already set up).
- **Vercel** — `vercel --prod` in this folder.
- **Cloudflare Pages** — build command `python3 build.py`, output directory `.`.
- **GitHub Pages** — push and enable Pages on the branch root.
- **Any cPanel/shared host** — upload the files over FTP. It's just HTML.

### Connecting guardify.co.in

Whichever host, the domain is pointed the same two ways:

| Method | What to set at your registrar | When to use |
|---|---|---|
| **Nameservers** (easiest) | Replace both nameservers with the host's | You don't use the domain for anything else |
| **DNS records** | `A` on `@` → the host's IP, `CNAME` on `www` → your host subdomain | You already have email/other records there |

The host shows you the exact values — use those, not values copied from a
guide, since they change. HTTPS is issued automatically and free on Netlify,
Cloudflare Pages and Vercel; allow up to an hour after DNS propagates.

> ⚠️ **Only upload what's meant to be public.** If your host has no support for
> `netlify.toml`, delete `pages/`, `templates/`, `form-backend/`, `build.py`
> and `site.json` from the *uploaded copy* — not from your local folder. On
> Netlify these are already blocked by force-redirects.

### Re-deploying after a change

Edit → `python3 build.py` → upload again (or `git push` if the repo is
connected). There is no cache to clear.

---

## Notes

- Fully responsive; mobile nav, stacked grids, and the calculator all work down
  to 320px.
- Respects `prefers-reduced-motion` — animations switch off.
- Content is visible without JavaScript (reveal animations are opt-in via a
  `js` class on `<html>`), so search engines and no-JS users see everything.
- Accessibility: semantic headings, labelled form fields, `aria-live` form
  status, keyboard-navigable FAQ via native `<details>`.
- Brand rules, palette, tone of voice and the asset to-do list are in
  [`BRAND.md`](BRAND.md).
