const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SUGGESTIONS = path.join(DATA_DIR, 'manufacturer_merge_suggestions.csv');
const MAP = path.join(DATA_DIR, 'manufacturer_map.csv');
const MANUFACTURERS = path.join(DATA_DIR, 'manufacturers.csv');

function readCSVLines(p) {
  return fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean);
}

function parseSuggestionsLine(line) {
  // group_id,canonical,members
  // members: either "uuid|name;uuid|name;..." or "name|uuid;name|uuid;..." depending on generation
  const cols = line.split(/,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/); // basic CSV split
  if (cols.length < 3) return null;
  const group_id = cols[0].replace(/^"|"$/g, '');
  const canonical = cols[1].replace(/^"|"$/g, '');
  const membersRaw = cols.slice(2).join(',').replace(/^"|"$/g, '');
  const parts = membersRaw.split(/;+/).map(s => s.trim()).filter(Boolean);
  const members = parts.map(p => {
    const bits = p.split('|').map(s => s.trim());
    if (bits.length === 2) {
      // detect which is uuid
      const [a, b] = bits;
      const uuidRegex = /^[0-9a-fA-F-]{36}$/;
      if (uuidRegex.test(a) && !uuidRegex.test(b)) return { uuid: a, name: b };
      if (uuidRegex.test(b) && !uuidRegex.test(a)) return { uuid: b, name: a };
      // fallback: treat second as name
      return { uuid: a, name: b };
    }
    return null;
  }).filter(Boolean);
  return { group_id, canonical, members };
}

function loadMap() {
  const lines = readCSVLines(MAP);
  const header = lines.shift();
  const rows = lines.map(l => {
    const parts = l.split(/,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/);
    const name = parts[0].replace(/^"|"$/g, '');
    const id = (parts[1] || '').replace(/^"|"$/g, '');
    const notes = (parts[2] || '').replace(/^"|"$/g, '');
    return { name, id, notes, raw: l };
  });
  return { header, rows };
}

function saveMap(header, rows) {
  const lines = [header].concat(rows.map(r => `${quoteIfNeeded(r.name)},${r.id ? r.id : ''},${r.notes || ''}`));
  fs.writeFileSync(MAP, lines.join('\n') + '\n', 'utf8');
}

function quoteIfNeeded(s) {
  if (s.includes(',') || s.includes('"')) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function findCanonicalId(canonicalName, mapRows) {
  const found = mapRows.find(r => r.name.toLowerCase() === canonicalName.toLowerCase());
  if (found) return found.id;
  // fallback: try manufacturers list
  const manuLines = readCSVLines(MANUFACTURERS);
  manuLines.shift();
  for (const l of manuLines) {
    const p = l.split(/,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/);
    const id = p[0].replace(/^"|"$/g, '');
    const name = (p[1] || '').replace(/^"|"$/g, '');
    if (name.toLowerCase() === canonicalName.toLowerCase()) return id;
  }
  return null;
}

function applyMerges() {
  if (!fs.existsSync(SUGGESTIONS)) throw new Error('suggestions file missing');
  const suggestionLines = readCSVLines(SUGGESTIONS);
  suggestionLines.shift();
  const suggestions = suggestionLines.map(parseSuggestionsLine).filter(Boolean);
  const map = loadMap();

  for (const s of suggestions) {
    const canonicalId = findCanonicalId(s.canonical, map.rows);
    if (!canonicalId) {
      console.warn('canonical id not found for', s.canonical);
      continue;
    }
    for (const m of s.members) {
      // skip if member is canonical itself
      if (m.uuid === canonicalId || m.name.toLowerCase() === s.canonical.toLowerCase()) continue;
      const target = map.rows.find(r => r.name.toLowerCase() === m.name.toLowerCase());
      if (target) {
        target.id = canonicalId;
      } else {
        // append new mapping
        map.rows.push({ name: m.name, id: canonicalId, notes: '' });
      }
    }
  }

  saveMap(map.header, map.rows);
  return { updated: map.rows.length };
}

try {
  const res = applyMerges();
  console.log('merge applied:', res);
  process.exit(0);
} catch (err) {
  console.error('error applying merges:', err.message);
  process.exit(2);
}
