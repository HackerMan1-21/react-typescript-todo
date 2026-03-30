const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'data');
const VEH = path.join(DATA, 'vehicles_mapped.csv');
const MANU = path.join(DATA, 'manufacturers.csv');
const BACKUP = path.join(DATA, 'manufacturers.orig.csv');
const OUT = path.join(DATA, 'manufacturers.csv');

function csvParse(line) {
  return line.split(/,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/).map(s => s.replace(/^"|"$/g, ''));
}

if (!fs.existsSync(VEH)) { console.error('vehicles_mapped.csv missing'); process.exit(1); }
if (!fs.existsSync(MANU)) { console.error('manufacturers.csv missing'); process.exit(1); }

const vehLines = fs.readFileSync(VEH, 'utf8').split(/\r?\n/).filter(l => l.length > 0);
const vehHeader = csvParse(vehLines[0]);
const manIdx = vehHeader.indexOf('manufacturer_id');
if (manIdx < 0) { console.error('manufacturer_id column not found in vehicles_mapped.csv'); process.exit(2); }

const used = new Set();
for (const l of vehLines.slice(1)) {
  const cols = csvParse(l);
  const id = (cols[manIdx] || '').trim();
  if (id) used.add(id);
}

const manuLines = fs.readFileSync(MANU, 'utf8').split(/\r?\n/).filter(l => l.length > 0);
const header = manuLines.shift();
const kept = [];
for (const l of manuLines) {
  const cols = csvParse(l);
  const id = cols[0];
  if (used.has(id)) kept.push(l);
}

// backup
fs.copyFileSync(MANU, BACKUP);

const out = [header].concat(kept).join('\n') + '\n';
fs.writeFileSync(OUT, out, 'utf8');

console.log('manufacturers deduped: kept', kept.length, 'rows. backup at', BACKUP);
