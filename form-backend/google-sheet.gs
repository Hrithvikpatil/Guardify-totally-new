/**
 * Guardify — form backend (Google Sheets)
 * ---------------------------------------
 * Receives enquiries from the salon / creator / brand forms on the website
 * and appends one row per enquiry to this spreadsheet.
 *
 * SETUP — see form-backend/README.md
 *
 * Nothing here is secret except the deployment URL. This script can only
 * ADD rows; it never returns sheet contents.
 */

// Optional: set a shared secret, and put the same value in site.json as
// "formToken". Leave empty to accept any submission (fine for a contact form).
var TOKEN = '';

// Get an email the moment an enquiry arrives. Leave empty for sheet-only.
// Use the address you actually read — it does not have to be the account that
// owns this sheet.
var NOTIFY_EMAIL = '';

// One tab per audience, so salon leads never mix with creator applications.
var TABS = {
  'New salon enquiry':      'Salons',
  'New creator application': 'Creators',
  'New brand enquiry':       'Brands'
};

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (TOKEN && body.token !== TOKEN) {
      return json({ ok: false, error: 'bad token' });
    }

    // Stop two submissions landing on the same row if they arrive together.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);

    var tabName = TABS[body.type] || 'Other';
    var sheet = getOrCreateTab(tabName, body);

    // Column order is taken from the header row, so re-ordering or adding a
    // column in the sheet keeps working without touching this script.
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function (h) {
      if (h === 'Received') return new Date();
      if (h === 'Status')   return 'New';
      return body[toKey(h)] || '';
    });

    sheet.appendRow(row);
    lock.releaseLock();

    notify(body);
    return json({ ok: true });

  } catch (err) {
    // Log the raw payload so nothing is ever silently lost.
    getOrCreateTab('Errors', {}).appendRow([new Date(), String(err),
      e && e.postData ? e.postData.contents : '']);
    return json({ ok: false, error: String(err) });
  }
}

/** Emails you the enquiry, if NOTIFY_EMAIL is set. Never blocks the response. */
function notify(body) {
  if (!NOTIFY_EMAIL) return;
  try {
    var lines = [];
    for (var k in body) {
      if (k === 'type' || k === 'token') continue;
      lines.push(toHeader(k) + ': ' + (body[k] || '-'));
    }
    var who = body.salon || body.name || body.brand || 'Website enquiry';
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: (body.type || 'Website enquiry') + ' — ' + who,
      body: lines.join('\n') + '\n\n---\nSee all enquiries: ' +
            SpreadsheetApp.getActiveSpreadsheet().getUrl()
    });
  } catch (e) {
    // An email failure must never lose the row that is already saved.
  }
}


/** Creates the tab with the right headers the first time an enquiry arrives. */
function getOrCreateTab(name, body) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;

  sheet = ss.insertSheet(name);
  var headers;
  if (name === 'Errors') {
    headers = ['When', 'Error', 'Payload'];
  } else {
    // "Received" + every field the form sent + your own tracking columns.
    headers = ['Received'].concat(
      Object.keys(body).filter(function (k) { return k !== 'type' && k !== 'token'; })
            .map(toHeader)
    ).concat(['Status', 'Notes', 'First purchase', 'Our 10%']);
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
       .setFontWeight('bold').setBackground('#f2edff');
  sheet.setFrozenRows(1);
  return sheet;
}

function toHeader(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); });
}
function toKey(header) {
  var s = header.replace(/\s+(.)/g, function (_, c) { return c.toUpperCase(); });
  return s.charAt(0).toLowerCase() + s.slice(1);
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
