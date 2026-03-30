const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'data', 'vehicles.csv');
const OUTPUT = path.join(__dirname, '..', 'data', 'vehicles_clean.csv');

if (!fs.existsSync(INPUT)) { console.error('input missing', INPUT); process.exit(1); }
const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const header = lines[0];
const cols = header.split(',').map(s => s.trim());
const rows = lines.slice(1).map(l => {
  // simple CSV parse for our generated file (no quotes expected in problematic rows)
  const parts = l.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
  const obj = {};
  cols.forEach((c, i) => { obj[c] = parts[i] ? parts[i].replace(/^"|"$/g, '') : ''; });
  return obj;
});

const filtered = rows.filter(r => {
  const eng = (r['english_name'] || '').trim();
  if (!eng) return false;
  if (eng.includes('→')) return false;
  if (eng.includes('🔥')) return false;
  if (eng.length < 2) return false;
  // skip header-like lines
  if (/^(slug|drivetrain|engine_position|価格改定対策用|オリジナル名前)/i.test(eng)) return false;
  return true;
});

const out = header + '\n' + filtered.map(r => cols.map(c => {
  const v = r[c] || '';
  if (v.includes(',') || v.includes('"')) return '"' + v.replace(/"/g, '""') + '"';
  return v;
}).join(',')).join('\n') + '\n';

fs.writeFileSync(OUTPUT, out, 'utf8');
console.log('written', OUTPUT, 'rows:', filtered.length);
