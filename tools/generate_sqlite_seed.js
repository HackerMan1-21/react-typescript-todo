const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');
const OUT_DIR = path.join(__dirname, '..', 'db', 'sqlite');
const MANU_CSV = path.join(DATA, 'manufacturers.csv');
const VEH_CSV = path.join(DATA, 'vehicles_mapped.csv');
const OUT_SQL = path.join(OUT_DIR, 'seed.sql');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(MANU_CSV)) { console.error('manufacturers.csv missing'); process.exit(1); }
if (!fs.existsSync(VEH_CSV)) { console.error('vehicles_mapped.csv missing'); process.exit(1); }

function csvParse(line) {
  return line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.replace(/^"|"$/g, ''));
}

function esc(s) {
  if (s === null || s === undefined) return '';
  return s.replace(/'/g, "''");
}

const manuLines = fs.readFileSync(MANU_CSV, 'utf8').split(/\r?\n/).filter(l => l.length > 0);
manuLines.shift();
const manufRows = manuLines.map(l => csvParse(l));

const vehLines = fs.readFileSync(VEH_CSV, 'utf8').split(/\r?\n/).filter(l => l.length > 0);
const vehHeader = csvParse(vehLines[0]);
const vehRows = vehLines.slice(1).map(l => csvParse(l));

let sql = '';
sql += "PRAGMA foreign_keys = ON;\n";
sql += "BEGIN TRANSACTION;\n\n";

sql += `CREATE TABLE IF NOT EXISTS manufacturers (id TEXT PRIMARY KEY, name TEXT, slug TEXT, notes TEXT, created_at TEXT);\n\n`;

// create vehicles table with columns from CSV header, types as TEXT except booleans
sql += `CREATE TABLE IF NOT EXISTS vehicles ("${vehHeader.join('" TEXT, "')}" TEXT);\n\n`;

// manufacturers inserts
for (const r of manufRows) {
  const id = esc(r[0] || '');
  const name = esc(r[1] || '');
  const slug = esc(r[2] || '');
  const notes = esc(r[3] || '');
  const created_at = esc(r[4] || '');
  sql += `INSERT OR REPLACE INTO manufacturers(id,name,slug,notes,created_at) VALUES('${id}','${name}','${slug}','${notes}','${created_at}');\n`;
}

sql += '\n';

// vehicles inserts
for (const r of vehRows) {
  const vals = r.map(c => `'${esc(c || '')}'`).join(',');
  sql += `INSERT OR REPLACE INTO vehicles VALUES(${vals});\n`;
}

sql += '\nCOMMIT;\n';

fs.writeFileSync(OUT_SQL, sql, 'utf8');
console.log('written', OUT_SQL);
