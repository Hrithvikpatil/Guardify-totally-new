# Form backend — Google Sheet

Where website enquiries land. Ten minutes to set up, free at any volume, and
you own the data.

## What you need

**One Google account** that will own the spreadsheet. Use a business account
you'll keep — whoever owns it owns your lead log. Nothing from this account
(no ID, password or API key) ever goes into the website files.

## Steps

1. Go to **sheets.new** — a blank spreadsheet. Name it `Guardify Enquiries`.
2. **Extensions → Apps Script**. Delete the sample `function myFunction() {}`.
3. Paste the entire contents of **`google-sheet.gs`**. Save (💾).

   *Want an email each time an enquiry arrives?* Set line 20 before saving:

   ```js
   var NOTIFY_EMAIL = 'you@gmail.com';
   ```
4. **Deploy → New deployment**. Click the ⚙ next to "Select type" → **Web app**.
   - *Description:* `Guardify forms`
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**  ← must be "Anyone", not "Anyone with Google account"
5. **Deploy**. Google asks you to authorise — approve it. (You'll see a
   "Google hasn't verified this app" warning: **Advanced → Go to … (unsafe)**.
   That warning is about *your own* script; it's expected.)
6. Copy the **Web app URL**. It ends in `/exec`.
7. Paste it into `site.json`:

   ```json
   "formEndpoint": "https://script.google.com/macros/s/AKfy……/exec",
   ```

8. `python3 build.py` and redeploy the site.

## What you get

Three tabs, created automatically on the first enquiry of each kind:

| Tab | From |
|---|---|
| **Salons** | the "I run a salon" form |
| **Creators** | the "I'm a creator" form |
| **Brands** | the "I'm a brand" form |

Each row is timestamped and carries every field the visitor filled in, plus
four columns for you to work in: **Status**, **Notes**, **First purchase** and
**Our 10%** — so the sheet doubles as your attribution and billing record.

An `Errors` tab captures anything that fails to parse, so an enquiry is never
silently lost.

## Notes

- **Changing the script later?** You must **Deploy → Manage deployments → ✏️ →
  New version**. Just saving the script does *not* update the live URL.
- **Email alerts** come from `NOTIFY_EMAIL` in the script. Google's free quota
  is 100 emails/day, far above any realistic enquiry volume. If sending ever
  fails, the row is still saved — the email is best-effort by design.
- **The `/exec` URL is write-only** — it appends rows and returns `{ok:true}`.
  It cannot read the sheet or reach anything else in your Google account. If
  you'd still rather not have it open, set `TOKEN` in the script and add a
  matching `"formToken"` to `site.json`.
- WhatsApp stays as the fallback: if the sheet is ever unreachable, the form
  offers the visitor a WhatsApp link instead, so nothing is lost.
