const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'data', 'manufacturer_candidates.csv');
const OUT = path.join(__dirname, '..', 'data', 'manufacturer_map_template.csv');

if (!fs.existsSync(INPUT)) { console.error('manufacturer_candidates.csv not found, run extract_manufacturer_candidates.js'); process.exit(1); }
const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const header = lines[0];
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  const cand = parts[0];
  const count = parts[1] || '';
  const examples = parts.slice(2).join(',') || '';
  rows.push({ candidate: cand, count: count, examples: examples });
}

// write template: candidate_name,manufacturer_id (to be filled),notes
const outHeader = 'candidate_name,manufacturer_id,notes\n';
const out = outHeader + rows.map(r => {
  const cand = r.candidate.replace(/^"|"$/g, '');
  const examples = (r.examples || '').replace(/\n/g, ' ').replace(/"/g, '""');
  return `"${cand}",,"examples:${examples}"`;
}).join('\n') + '\n';

fs.writeFileSync(OUT, out, 'utf8');
console.log('written', OUT, 'rows:', rows.length);
