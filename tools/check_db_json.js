const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'server', 'data', 'items.db');
if (!fs.existsSync(DB_PATH)) {
  console.error('DB not found at', DB_PATH);
  process.exit(2);
}

const db = new Database(DB_PATH, { readonly: true });
let rows;
try {
  rows = db.prepare('SELECT id, data FROM items').all();
} catch (err) {
  console.error('Error reading items table:', err.message);
  process.exit(3);
}

let failures = 0;
for (const r of rows) {
  const id = r.id;
  const raw = typeof r.data === 'string' ? r.data : JSON.stringify(r.data);
  try {
    JSON.parse(raw);
  } catch (e) {
    failures++;
    const msg = e && e.message ? e.message : String(e);
    const m = msg.match(/position (\d+)/i);
    let pos = m ? Number(m[1]) : null;
    if (pos === null) {
      // try to find first suspicious backslash-u
      const idx = raw.indexOf('\\u');
      if (idx !== -1) pos = idx;
    }
    console.error('---- JSON PARSE ERROR ----');
    console.error('id:', id);
    console.error('error:', msg);
    if (pos !== null && !Number.isNaN(pos)) {
      const start = Math.max(0, pos - 80);
      const end = Math.min(raw.length, pos + 80);
      const snippet = raw.slice(start, end).replace(/\n/g, '\\n');
      console.error('position approx:', pos);
      console.error('snippet:', snippet);
    } else {
      console.error('snippet (start 0..200):', raw.slice(0, 200).replace(/\n/g, '\\n'));
    }

    // show counts of raw backslash-u occurrences
    const backslashUMatches = raw.match(/\\u[0-9a-fA-F]{0,}/g) || [];
    if (backslashUMatches.length) {
      console.error('raw "\\u" occurrences (first 5):', backslashUMatches.slice(0,5));
    }
  }
}

console.log('checked rows:', rows.length, 'failures:', failures);
process.exit(failures > 0 ? 1 : 0);
