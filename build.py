#!/usr/bin/env python3
"""
Guardify static site builder.

Combines templates/shell.html (header + footer + <head>) with each fragment in
pages/ and writes plain .html files to the project root.

    python3 build.py

No dependencies. Edit content in pages/*.html and site.json, then re-run.
"""
import datetime
import json
import pathlib
import re
import urllib.parse

ROOT = pathlib.Path(__file__).parent
CFG = json.loads((ROOT / "site.json").read_text(encoding="utf-8"))
SHELL = (ROOT / "templates" / "shell.html").read_text(encoding="utf-8")

# slug -> (output file, <title>, meta description)
PAGES = {
    "index":             ("index.html",             "{b} — Get More Customers For Your Salon | Pay Only 10% Of The First Purchase",
                          "We bring new customers to your salon through Google, Instagram and Facebook ads. No monthly agency fee. You pay 10% of the customer's first purchase — once."),
    "how-it-works":      ("how-it-works.html",      "How It Works — {b} Salon Customer Acquisition",
                          "From advertisement to lead to appointment to first purchase. See exactly how our performance-based salon marketing model works, step by step."),
    "services":          ("services.html",          "Services — Google Ads, Meta Ads & WhatsApp Leads For Salons | {b}",
                          "Google Ads, Instagram & Facebook Ads, WhatsApp lead generation, landing pages, ad creative, campaign optimisation and customer tracking for salons."),
    "for-salons":        ("for-salons.html",        "For Salon Owners — {b}",
                          "Built for salon owners. You focus on service and staff, we focus on advertising and customer acquisition. Your salon, your customers."),
    "creators":          ("creators.html",          "For Creators — Get Paid Brand Deals | {b}",
                          "We connect beauty, grooming, fashion and lifestyle creators with brands that pay. Free to join, no lock-in, you keep the relationship."),
    "performance-model": ("performance-model.html", "Performance Model — Pay Only When You Get A Customer | {b}",
                          "No monthly fee. No advance agency fee. No recurring commission. 10% of the customer's first purchase — one customer, one payment."),
    "about":             ("about.html",             "About Us — {b}",
                          "We build customer acquisition systems for salons. Our performance-based model keeps our focus aligned with the salon's growth."),
    "faq":               ("faq.html",               "FAQ — {b}",
                          "Answers to the most common questions about our 10% one-time performance fee, advertising budgets, tracking and campaign results."),
    "404":               ("404.html",               "Page not found — {b}",
                          "The page you're looking for doesn't exist."),
    "contact":           ("contact.html",           "Contact — Get More Customers For Your Salon | {b}",
                          "Tell us about your salon and we'll show you how our customer-acquisition model can work for you. WhatsApp, call or email us."),
}

NAME_FIXES = {
    "lartista": "L'Artista",
    "enchante": "Enchanté",
    "mon-soin": "Mon Soin",
    "trendz-avenue": "Trendz Avenue",
}


def brand_name(slug):
    """assets/img/brands/glow-and-grace.png -> 'Glow & Grace'"""
    if slug in NAME_FIXES:
        return NAME_FIXES[slug]
    words = slug.replace("-and-", " & ").split("-")
    return " ".join(w if w == "&" else w.capitalize() for w in words)


def brand_marquee():
    """Build the logo marquee from whatever is in assets/img/brands/.

    Drop a new logo in that folder and re-run this script — nothing else to edit.
    Two rows scroll in opposite directions; each row's markup is duplicated so
    the CSS animation loops seamlessly.
    """
    files = sorted(p.name for p in (ROOT / "assets" / "img" / "brands").glob("*.webp"))
    if not files:
        return ""
    half = (len(files) + 1) // 2
    rows = [files[:half], files[half:]]
    out = []
    for i, row in enumerate(rows):
        items = "".join(
            # NOT loading="lazy": logos start off-screen to the right, so lazy
            # loading would leave blank chips as the marquee scrolls them in.
            '<li class="marquee__item"><img src="assets/img/brands/%s" alt="%s" '
            'decoding="async" fetchpriority="low" width="200" height="100"></li>'
            % (f, brand_name(f[:-5]))
            for f in row
        )
        out.append(
            '<div class="marquee__row"><ul class="marquee__track%s" aria-label="Brands we have worked with">%s</ul>'
            '<ul class="marquee__track%s" aria-hidden="true">%s</ul></div>'
            % (" marquee__track--rev" if i else "", items,
               " marquee__track--rev" if i else "", items)
        )
    return "\n".join(out)


def stats_band():
    cells = "".join(
        '<div class="statband__cell"><div class="statband__k">%s</div>'
        '<div class="statband__v">%s</div></div>' % (s["k"], s["v"])
        for s in CFG.get("stats", [])
    )
    return '<div class="statband">%s</div>' % cells


WA_MSG = urllib.parse.quote(CFG["whatsappMessage"])
WA_MSG_CREATOR = urllib.parse.quote(CFG["creatorWhatsappMessage"])


def render(slug, title, desc, body):
    html = SHELL
    html = html.replace("{{CONTENT}}", body)
    html = html.replace("{{TITLE}}", title.format(b=CFG["brand"]))
    html = html.replace("{{DESC}}", desc)
    repl = {
        "{{BRAND}}": CFG["brand"],
        "{{TAGLINE}}": CFG["tagline"],
        "{{PHONE}}": CFG["phone"],
        "{{PHONE_RAW}}": CFG["phoneRaw"],
        "{{EMAIL}}": CFG["email"],
        "{{INSTAGRAM}}": CFG["instagram"],
        "{{INSTAGRAM_HANDLE}}": CFG["instagramHandle"],
        "{{WA}}": CFG["whatsappRaw"],
        "{{WAMSG}}": WA_MSG,
        "{{WAMSG_CREATOR}}": WA_MSG_CREATOR,
        "{{FORM_ENDPOINT}}": CFG["formEndpoint"],
        "{{FORM_TOKEN}}": CFG.get("formToken", ""),
        "{{YEAR}}": CFG["year"],
        "{{BRAND_MARQUEE}}": brand_marquee(),
        "{{STATS_BAND}}": stats_band(),
    }
    for k, v in repl.items():
        html = html.replace(k, v)
    # mark the active nav item
    html = html.replace('data-nav="%s"' % slug, 'data-nav="%s" class="is-active"' % slug)
    return html


def write_sitemap():
    """Generated from site.json so a domain change can never leave these stale."""
    base = "https://%s/" % CFG["domain"].strip("/")
    today = datetime.date.today().isoformat()
    urls = []
    for slug, (out, _t, _d) in PAGES.items():
        if out == "404.html":
            continue
        loc = base if out == "index.html" else base + out
        pri = "1.0" if out == "index.html" else ("0.7" if out in ("about.html", "faq.html") else "0.8")
        urls.append('  <url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>'
                    % (loc, today, pri))
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n</urlset>\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        "User-agent: *\n"
        "Allow: /\n"
        # Source folders are not part of the site; keep them out of the index
        # even on hosts that have no redirect rules.
        "Disallow: /pages/\n"
        "Disallow: /templates/\n"
        "Disallow: /form-backend/\n"
        "Disallow: /build.py\n"
        "Disallow: /site.json\n"
        "\nSitemap: %ssitemap.xml\n" % base, encoding="utf-8")


# Files and folders that make up the actual website. Everything else in the
# project is source and must never be uploaded to a host.
PUBLIC = ["assets", "sitemap.xml", "robots.txt", "netlify.toml"]


def make_deploy():
    """Copy just the public files into deploy/ — the folder you upload.

    Netlify's redirects already hide the source files, but most other hosts
    (cPanel, FTP) have no such protection. Uploading this folder is safe
    everywhere, so there is only one instruction to remember.
    """
    import shutil
    out = ROOT / "deploy"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()

    for slug, (name, _t, _d) in PAGES.items():
        src = ROOT / name
        if src.exists():
            shutil.copy2(src, out / name)

    for item in PUBLIC:
        src = ROOT / item
        if not src.exists():
            continue
        if src.is_dir():
            shutil.copytree(src, out / item,
                            ignore=shutil.ignore_patterns("_unused"))
        else:
            shutil.copy2(src, out / item)

    files = sum(1 for _ in out.rglob("*") if _.is_file())
    size = sum(f.stat().st_size for f in out.rglob("*") if f.is_file())
    print("Ready to upload: deploy/  (%d files, %d KB)" % (files, size // 1024))


def main():
    built = []
    for slug, (out, title, desc) in PAGES.items():
        frag = ROOT / "pages" / (slug + ".html")
        if not frag.exists():
            print("  skip (missing) %s" % frag.name)
            continue
        body = frag.read_text(encoding="utf-8")
        (ROOT / out).write_text(render(slug, title, desc, body), encoding="utf-8")
        built.append(out)
    write_sitemap()
    print("Built %d pages: %s" % (len(built), ", ".join(built)))
    print("Wrote sitemap.xml + robots.txt for %s" % CFG["domain"])
    make_deploy()


if __name__ == "__main__":
    main()
