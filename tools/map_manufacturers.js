const fs = require('fs');
const path = require('path');

const VEH_IN = path.join(__dirname, '..', 'data', 'vehicles.csv');
const MAP = path.join(__dirname, '..', 'data', 'manufacturer_map.csv');
const OUT = path.join(__dirname, '..', 'data', 'vehicles_mapped.csv');

if (!fs.existsSync(VEH_IN)) { console.error('vehicles.csv missing'); process.exit(1); }
if (!fs.existsSync(MAP)) { console.error('manufacturer_map.csv missing - copy manufacturer_map_template.csv and fill manufacturer_id column'); process.exit(1); }

function csvParse(line) {
  const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.replace(/^"|"$/g, ''));
  return parts;
}

const vehRaw = fs.readFileSync(VEH_IN, 'utf8').split(/\r?\n/).filter(l => l.length > 0);
const vehHeader = csvParse(vehRaw[0]);
const vehRows = vehRaw.slice(1).map(l => csvParse(l));
const idxEng = vehHeader.indexOf('english_name');
const idxMan = vehHeader.indexOf('manufacturer_id');

const mapRaw = fs.readFileSync(MAP, 'utf8').split(/\r?\n/).filter(l => l.length > 0);
const mapHeader = csvParse(mapRaw[0]);
const mapRows = mapRaw.slice(1).map(l => csvParse(l));
const mapIdxCand = mapHeader.indexOf('candidate_name');
const mapIdxId = mapHeader.indexOf('manufacturer_id');

const mapByCand = new Map();
for (const r of mapRows) {
  const cand = r[mapIdxCand] || '';
  const id = r[mapIdxId] || '';
  if (cand) mapByCand.set(cand, id);
}

const outLines = [];
outLines.push(vehHeader.join(','));

let filled = 0;
for (const r of vehRows) {
  const eng = (r[idxEng] || '').trim();
  let candidate = eng.split(/[\s\-\/]/)[0] || '';
  candidate = candidate.replace(/[^A-Za-z0-9\u0080-\uFFFF]/g, '');
  const mappedId = mapByCand.get(candidate) || '';
  if (mappedId) { r[idxMan] = mappedId; filled++; }
  outLines.push(r.map(c => { if (c == null) return ''; if (c.includes(',') || c.includes('"')) return '"' + c.replace(/"/g, '""') + '"'; return c; }).join(','));
}

fs.writeFileSync(OUT, outLines.join('\n') + '\n', 'utf8');
console.log('written', OUT, 'rows:', outLines.length - 1, 'filled:', filled);
