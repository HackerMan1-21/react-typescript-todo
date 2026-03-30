const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const INPUT = path.join(__dirname, '..', 'data', 'manufacturer_candidates.csv');
const OUT_MAN = path.join(__dirname, '..', 'data', 'manufacturers.csv');
const OUT_MAP = path.join(__dirname, '..', 'data', 'manufacturer_map.csv');

if (!fs.existsSync(INPUT)) { console.error('manufacturer_candidates.csv not found'); process.exit(1); }
const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  const cand = (parts[0] || '').replace(/^"|"$/g, '').trim();
  if (!cand) continue;
  rows.push(cand);
}

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9\-\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); }

const now = new Date().toISOString();
const manufacturers = rows.map(cand => ({ id: crypto.randomUUID(), name: cand, slug: slugify(cand), notes: '', created_at: now }));

const manHeader = 'id,name,slug,notes,created_at\n';
const manCsv = manHeader + manufacturers.map(m => `${m.id},"${m.name.replace(/"/g, '""')}",${m.slug},"${m.notes}",${m.created_at}`).join('\n') + '\n';
fs.writeFileSync(OUT_MAN, manCsv, 'utf8');

// generate map linking candidate -> id
const mapHeader = 'candidate_name,manufacturer_id,notes\n';
const mapCsv = mapHeader + manufacturers.map(m => `"${m.name.replace(/"/g, '""')}",${m.id},`).join('\n') + '\n';
fs.writeFileSync(OUT_MAP, mapCsv, 'utf8');

console.log('written', OUT_MAN, 'rows:', manufacturers.length);
console.log('written', OUT_MAP, 'rows:', manufacturers.length);
