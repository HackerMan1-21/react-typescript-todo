const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const CSV = path.join(__dirname, '..', 'data', 'vehicles_mapped.csv');
const DB_FILE = path.join(__dirname, 'data', 'items.db');

if (!fs.existsSync(CSV)) {
  console.error('CSV not found:', CSV);
  process.exit(1);
}

const raw = fs.readFileSync(CSV, 'utf8');
const lines = raw.split(/\r?\n/).filter(Boolean);
if (lines.length <= 1) {
  console.error('CSV appears empty');
  process.exit(1);
}

function parseCsvLine(line) {
  const res = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      res.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  res.push(cur);
  return res;
}

const db = new Database(DB_FILE);

// remove previous naive csv-imported items (ids starting with csv-)
const delStmt = db.prepare("DELETE FROM items WHERE id LIKE 'csv-%'");
const delInfo = delStmt.run();
console.log('removed', delInfo.changes, 'old csv-* items');

const header = parseCsvLine(lines[0]);
const insert = db.prepare('INSERT OR REPLACE INTO items (id, data) VALUES (?, ?)');
let count = 0;

for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  if (cols.length === 0) continue;
  const row = {};
  for (let j = 0; j < header.length; j++) {
    row[header[j]] = cols[j] !== undefined ? cols[j] : '';
  }

  const id = row.id || `vehicles-${i}`;
  const name = (row.english_name && row.english_name.trim()) || row.slug || '';
  const nameJP = (row.japanese_name && row.japanese_name.trim()) || '';
  const category = (row.vehicle_class_key && row.vehicle_class_key.trim()) || (row.vehicle_type_key && row.vehicle_type_key.trim()) || '車両';

  const descriptionParts = [];
  if (row.slug) descriptionParts.push(`slug: ${row.slug}`);
  if (row.internal_name) descriptionParts.push(`internal: ${row.internal_name}`);
  if (row.manufacturer_id) descriptionParts.push(`manufacturer_id: ${row.manufacturer_id}`);
  if (row.vehicle_subclass) descriptionParts.push(`subclass: ${row.vehicle_subclass}`);
  if (row.seat_capacity) descriptionParts.push(`seats: ${row.seat_capacity}`);
  if (row.drivetrain) descriptionParts.push(`drivetrain: ${row.drivetrain}`);
  if (row.is_electric) descriptionParts.push(`electric: ${row.is_electric}`);
  if (row.purchase_price) descriptionParts.push(`price: ${row.purchase_price}`);
  if (row.release_dlc) descriptionParts.push(`dlc: ${row.release_dlc}`);
  if (row.release_date) descriptionParts.push(`release_date: ${row.release_date}`);
  if (row.notes) descriptionParts.push(`notes: ${row.notes}`);

  const price = row.purchase_price ? row.purchase_price.trim() : '';
  const tradePr = row.trade_price ? row.trade_price.trim() : '';
  const saleStatusParts = [];
  if (price) saleStatusParts.push(`定価: $${price}`);
  if (tradePr) saleStatusParts.push(`トレード: $${tradePr}`);
  if (row.is_removed_from_store === 'true') saleStatusParts.push('販売停止');

  const customDiffParts = [];
  if (row.is_weaponized === 'true') customDiffParts.push('武装');
  if (row.is_armored === 'true') customDiffParts.push('装甲');
  if (row.is_electric === 'true') customDiffParts.push('EV');
  if (row.is_hsw === 'true') customDiffParts.push('HSW');
  if (row.is_bennys === 'true') customDiffParts.push("Benny's");
  if (row.is_convertible === 'true') customDiffParts.push('コンバーチブル');

  const item = {
    id,
    name,
    nameJP,
    category,
    image: '',
    description: descriptionParts.join(' | '),
    images: [],
    vehicleData: {
      internalModelName: row.internal_name ? row.internal_name.trim() : '',
      internalId: row.game_model_hash ? row.game_model_hash.trim() : '',
      vehicleType: row.vehicle_type_key ? row.vehicle_type_key.trim() : '',
      dlc: row.release_dlc ? row.release_dlc.trim() : '',
      saleStatus: saleStatusParts.join(' / ') || '',
      spawnType: row.vehicle_subclass ? row.vehicle_subclass.trim() : '',
      customDiff: customDiffParts.join(', ') || '',
      specialVersion: (row.is_limited_stock === 'true' ? '限定在庫' : '') + (row.game_build_added ? ` (Build ${row.game_build_added.trim()})` : ''),
      colorInfo: row.default_color_set_id ? row.default_color_set_id.trim() : '',
    },
    acquisition: {
      method: row.purchase_site ? row.purchase_site.trim() : '',
      storable: row.storage_location ? row.storage_location.trim() : '',
      spawnLocation: '',
      spawnTime: '',
    },
  };

  try {
    insert.run(item.id, JSON.stringify(item));
    count++;
  } catch (e) {
    console.error('insert failed for', id, e.message);
  }
}

console.log('imported', count, 'vehicles from', CSV);
