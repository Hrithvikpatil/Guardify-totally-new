# Guardify — Brand Basics

> Brand name chosen by the owner. Visual identity and copy here are changeable —
> see "How to rename the brand" at the bottom.

---

## 1. The name

**Guardify**

- **Guard** — we protect the salon owner from the thing they've been burned by:
  paying a monthly agency retainer and getting likes instead of customers.
- **-ify** — we make it so. Active, product-like, easy to say.

The name is a promise about *risk*, and the whole business model is the proof:
no monthly fee, no advance fee, no recurring commission. You are guarded from
paying for anything except a real customer who really walked in.

It carries to the second business line too — creators are guarded from unpaid
"exposure" collabs, because we're paid by the brand and briefs carry agreed
deliverables and payment terms up front.

**Written:** Guardify — one word, capital G only. Never "GuardiFy",
"Guard-ify" or lowercase "guardify" mid-sentence.

**The mark:** a gradient shield with a white check. The shield is the *guard*;
the check is the guarantee. Used alone as the favicon and app icon, and beside
the wordmark in the header.

---

## 2. Positioning

**Category:** Performance marketing for salons — plus creator/brand collaborations.

**One-line positioning**
> Guardify brings salons new customers through Google and Meta ads, and charges
> 10% of that customer's first purchase — once.

**Tagline (primary)**
> You get the customer. We get 10%. Once.

**Tagline (footer / formal)**
> Performance Marketing for Salons

**Elevator pitch (30 seconds)**
> Most salons pay an agency ₹20,000 a month and get a report full of likes.
> We flipped it. We run your Google, Instagram and Facebook ads at our own risk.
> When a customer we generated walks in and pays you, we take 10% of that first
> bill. If they come back a hundred more times, we take nothing. No retainer,
> no advance, no recurring commission.

**What makes us different (in order of importance)**
1. No monthly retainer — the risk sits with us, not the salon.
2. One-time fee, never recurring — the customer belongs to the salon.
3. Measured on purchases, not impressions.

---

## 3. Audience

| | Primary | Secondary | Third |
|---|---|---|---|
| **Who** | Salon owner / manager | Brands wanting creator campaigns | Beauty & lifestyle creators |
| **Size** | 1–5 chairs to multi-branch | SMB / D2C | Nano to mid-tier |
| **Pain** | Paid an agency, got no footfall | Can't find the right creators | Chasing brands for unpaid work |
| **Wants to hear** | "You pay only when they pay you" | "Matched, briefed, delivered" | "Real briefs, real payment" |

---

## 4. Voice & tone

**We sound like:** a straight-talking operator, not an agency deck.

| Do | Don't |
|---|---|
| Short sentences. Plain words. | "Synergy", "ROI-driven", "holistic" |
| Rupee amounts, real numbers | Vague claims like "10x your growth" |
| "You pay us only after…" | "Prices starting from…" |
| Say what we *don't* do | Overpromise guaranteed customers |
| Indian English, ₹ currency | US spellings ("optimize" → **optimise**) |

**Never promise a guaranteed number of customers.** It's in the FAQ for a
reason — results depend on location, competition, pricing and budget.

**Words we own:** first purchase · one-time · no recurring commission ·
campaign-generated customer · customer acquisition.

---

## 5. Logo

`assets/img/logo.svg` — a gradient shield with a white check, paired with the
wordmark in Sora ExtraBold. `assets/img/favicon.svg` is the same shield drawn
edge-to-edge so it survives at 16px in a browser tab.

- **Clear space:** at least the height of the "G" on all sides.
- **Minimum size:** 24px mark / 96px lockup.
- **On dark:** mark stays gradient, wordmark turns white.
- **Don't:** stretch it, re-colour it flat, add a drop shadow, or put the mark
  on a busy photo without a solid chip behind it.
- `assets/img/favicon.svg` is the mark reversed out of a gradient rounded square.

---

## 6. Colour

| Token | Hex | Use |
|---|---|---|
| `--brand-1` Hot Pink | `#FF2D75` | Primary accent, gradient start, CTA |
| `--brand-2` Violet | `#7B2FF7` | Gradient end, links, icons |
| `--brand-3` Gold | `#FFB020` | Reserved highlight (badges, offers) |
| `--ink` | `#0A0812` | Dark sections, hero, footer |
| `--ink-2` | `#140F22` | Cards on dark, footer |
| `--paper` | `#FFFFFF` | Light sections |
| `--paper-2` | `#F7F4FD` | Alternate light band |
| `--tx` | `#15101F` | Body text on light |
| `--tx-mute` | `#5C5470` | Secondary text |
| WhatsApp green | `#25D366` | WhatsApp buttons **only** |

**Signature gradient:** `linear-gradient(100deg, #FF2D75, #7B2FF7)` — used on the
logo, primary buttons, big numbers and the "10%". Use it as a highlight, never
as a full-page background.

All tokens live at the top of `assets/css/styles.css` — change them there and the
entire site re-skins.

---

## 7. Typography

- **Display / headings:** Sora — 700/800, tight tracking (`-0.025em`).
- **Body / UI:** Inter — 400/500/600.
- Both from Google Fonts. Fallback: system sans-serif.
- Headings are sentence case, not ALL CAPS. Only eyebrows and small labels use
  uppercase with wide letter-spacing.

---

## 8. Layout signatures

Things that make a page look like *ours*:

1. **Alternating light/dark bands** — dark hero, light content, dark statement,
   light content, dark CTA.
2. **The eyebrow** — a short gradient dash + uppercase label above every heading.
3. **The giant number** — `10%` rendered enormous in the gradient.
4. **The journey list** — the vertical dotted timeline (ad → lead → … → purchase).
5. **Struck-through vanity metrics** — likes/followers/impressions/reach with a
   pink strike, next to what we *do* report.
6. **Rounded everything** — 16–32px radii, pill buttons.

---

## 9. Contact identity

Set once in `site.json`; the build stamps it everywhere.

| Field | Current value |
|---|---|
| Domain | guardify.co.in |
| Phone / WhatsApp | +91 91036 15033 |
| Email | Contact@guardify.co.in |
| Instagram | instagram.com/guardify_official |

All four are the owner's real details. The only one still to confirm is that
**guardify.co.in is registered and pointed at the host**, and that the mailbox
for `Contact@guardify.co.in` actually exists.

---

## 10. Proof & social proof

Two reusable proof devices, both generated by `build.py` (see README):

- **Logo marquee** — 20 client logos on white chips, two rows scrolling in
  opposite directions, paused on hover. Used on Home, Creators and For Salons.
- **Stat band** — four gradient numbers from `site.json`:
  salons worked with (100+) · influencers worked with (1000+) · brands in the
  partner network · the 10% fee.

Rules: logos always sit on a **white** chip regardless of the section
background, are never recoloured, and are never stretched. **No two logos on the
wall may share a template** — same ornament, frame or wordmark font with only the
name swapped reads as padding, not proof. All output files are
identical dimensions (400×200) so no logo appears visually larger than another.

**Claims discipline:** only list a logo you actually worked with and have
permission to display, and keep the stat numbers honest — the whole brand rests
on "we only get paid when it works", so an inflated client count is the one
thing that undercuts it.

---

## 11. The second business line

Guardify has two audiences and the site must always make both legible:

1. **Salons** — we bring them customers, they pay 10% of a first purchase.
2. **Influencers** — we bring them salon, cosmetics, grooming and beauty
   product brands to work with, free to the creator.

They share one promise: *we're paid on the outcome, by the business, never by
the person we're helping.* Keep that symmetry in any new copy.

There is a third, smaller audience — **brands** commissioning creator campaigns.
The contact page carries a separate form for each of the three; never make one
audience fill in another's questions.

---

## 12. Assets still to create

- [ ] Logo in PNG (512, 1024) for WhatsApp Business / Google Business Profile
- [ ] `assets/img/og.jpg` — 1200×630 social share image (dark bg, logo, "10% of
      the first purchase")
- [ ] Instagram profile picture (mark on gradient square, 320×320)
- [ ] A one-page PDF sales sheet reusing the home page sections
- [ ] Real salon photography or licensed stock — the site currently uses none
- [ ] Case studies / testimonials once the first salons have results

---

## How to rename the brand

1. Edit `"brand"`, `"domain"`, `"email"` in `site.json`.
2. Replace `assets/img/logo.svg` and `assets/img/favicon.svg`.
3. Change `--brand-1` / `--brand-2` in `assets/css/styles.css` if the palette moves.
4. Run `python3 build.py`.

Everything else — header, footer, share tags, WhatsApp links — updates itself.
