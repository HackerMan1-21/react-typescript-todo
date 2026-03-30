const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'data', 'vehicles.csv');
const OUTPUT = path.join(__dirname, '..', 'data', 'manufacturer_candidates.csv');

if (!fs.existsSync(INPUT)) { console.error('input missing', INPUT); process.exit(1); }
const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const header = lines[0].split(',').map(s => s.trim());
const idxEng = header.indexOf('english_name');
const idxId = header.indexOf('id');
if (idxEng < 0) { console.error('english_name column not found'); process.exit(1); }

const counts = new Map();
const examples = new Map();

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  const id = parts[idxId] || '';
  const eng = (parts[idxEng] || '').replace(/^"|"$/g, '').trim();
  if (!eng) continue;
  // heuristic: manufacturer candidate is first token before space, or uppercase prefix before digit
  let candidate = eng.split(/[\s\-\/]/)[0];
  // if candidate contains digits (e.g., T20), treat as model -> try first token with letters
  if (/^\d/.test(candidate) && eng.includes(' ')) candidate = eng.split(' ')[0];
  candidate = candidate.replace(/[^A-Za-z0-9\u0080-\uFFFF]/g, '');
  if (!candidate) candidate = 'UNKNOWN';

  counts.set(candidate, (counts.get(candidate) || 0) + 1);
  if (!examples.has(candidate)) examples.set(candidate, []);
  if (examples.get(candidate).length < 3) examples.get(candidate).push(id + ':' + eng);
}

const rows = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([cand, cnt]) => {
  return { candidate: cand, count: cnt, examples: (examples.get(cand) || []).join('|') };
});

const outHeader = 'candidate_name,count,examples\n';
const out = outHeader + rows.map(r => `${escape(r.candidate)},${r.count},${escape(r.examples)}`).join('\n') + '\n';
fs.writeFileSync(OUTPUT, out, 'utf8');
console.log('written', OUTPUT, 'rows:', rows.length);

function escape(s) { if (s == null) return ''; if (String(s).includes(',') || String(s).includes('"')) return '"' + String(s).replace(/"/g, '""') + '"'; return String(s); }
