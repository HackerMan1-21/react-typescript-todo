const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const INPUT = path.join(__dirname, '..', 'data', 'vehicles_full.csv');
const OUTPUT = path.join(__dirname, '..', 'data', 'vehicles.csv');

if (!fs.existsSync(INPUT)) {
  console.error('input not found:', INPUT);
  process.exit(1);
}

const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);

function parseCsvLine(line) {
  const res = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes; continue;
    }
    if (ch === ',' && !inQuotes) { res.push(cur); cur = ''; continue; }
    cur += ch;
  }
  res.push(cur);
  return res.map(s => s === '' ? '' : s);
}

const header = parseCsvLine(lines[0]).map(h => h.trim());
const idx = {
  category: header.indexOf('category'),
  sub_category: header.indexOf('sub_category'),
  english_name: header.indexOf('english_name'),
  japanese_name: header.indexOf('japanese_name')
};

const outHeader = [
  'id', 'slug', 'english_name', 'japanese_name', 'internal_name', 'manufacturer_id', 'vehicle_type_key', 'vehicle_class_key', 'vehicle_subclass', 'seat_capacity', 'drivetrain', 'engine_position', 'is_hsw', 'is_bennys', 'is_weaponized', 'is_armored', 'is_electric', 'is_convertible', 'purchase_price', 'trade_price', 'currency', 'purchase_site', 'storage_location', 'is_limited_stock', 'is_removed_from_store', 'game_model_hash', 'handling_profile_id', 'release_dlc', 'release_date', 'game_build_added', 'notes', 'default_color_set_id', 'created_at', 'updated_at'
];

const rows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  const eng = cols[idx.english_name] || '';
  if (!eng || eng.startsWith('🔥') || eng.length < 2) continue;
  // skip lines that are metadata or long
  if (eng.length > 120) continue;

  const jpn = cols[idx.japanese_name] || '';
  const category = cols[idx.category] || '';
  const sub = cols[idx.sub_category] || '';

  const id = crypto.randomUUID();
  const slug = eng.toLowerCase().replace(/[^a-z0-9\-\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const now = new Date().toISOString();

  const out = {
    id, slug, english_name: eng, japanese_name: jpn, internal_name: eng, manufacturer_id: '', vehicle_type_key: category, vehicle_class_key: sub, vehicle_subclass: '', seat_capacity: '', drivetrain: '', engine_position: '', is_hsw: 'false', is_bennys: 'false', is_weaponized: 'false', is_armored: 'false', is_electric: 'false', is_convertible: 'false', purchase_price: '', trade_price: '', currency: 'USD', purchase_site: '', storage_location: '', is_limited_stock: 'false', is_removed_from_store: 'false', game_model_hash: '', handling_profile_id: '', release_dlc: '', release_date: '', game_build_added: '', notes: '', default_color_set_id: '', created_at: now, updated_at: now
  };
  rows.push(out);
}

function escapeCsv(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const csv = outHeader.join(',') + '\n' + rows.map(r => outHeader.map(h => escapeCsv(r[h])).join(',')).join('\n') + '\n';
fs.writeFileSync(OUTPUT, csv, 'utf8');
console.log('written', OUTPUT, 'rows:', rows.length);
