const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'data', 'manufacturers.csv');
const OUTPUT = path.join(__dirname, '..', 'data', 'manufacturer_merge_suggestions.csv');

if (!fs.existsSync(INPUT)) { console.error('manufacturers.csv missing'); process.exit(1); }
const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const header = lines[0].split(',');
const rows = lines.slice(1).map(l => {
  // simple CSV parse
  const parts = l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(p => p.replace(/^"|"$/g, ''));
  return { id: parts[0], name: parts[1], slug: parts[2] };
});

function normalize(s) {
  if (!s) return '';
  return s.toLowerCase()
    .replace(/[^a-z0-9\u0080-\uFFFF]/g, '')
    .replace(/(inc|ltd|llc|corp|co|company|the)$/g, '')
    .replace(/(\d+)/g, '')
    .replace(/(^\s+|\s+$)/g, '');
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

// build normalized map
const norm = rows.map(r => ({ ...r, norm: normalize(r.name) }));

// pairwise compare and group
const pairs = [];
for (let i = 0; i < norm.length; i++) {
  for (let j = i + 1; j < norm.length; j++) {
    const a = norm[i].norm; const b = norm[j].norm;
    if (!a || !b) continue;
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    const ratio = maxLen === 0 ? 0 : dist / maxLen;
    if (ratio <= 0.25 || a.startsWith(b) || b.startsWith(a) || a.includes(b) || b.includes(a)) {
      pairs.push({ aId: norm[i].id, aName: norm[i].name, bId: norm[j].id, bName: norm[j].name, dist, ratio });
    }
  }
}

// cluster pairs into groups (union-find)
const parent = {};
function find(x) { if (parent[x] === undefined) parent[x] = x; return parent[x] === x ? x : parent[x] = find(parent[x]); }
function union(x, y) { const rx = find(x), ry = find(y); if (rx !== ry) parent[ry] = rx; }
for (const p of pairs) { union(p.aId, p.bId); }

const groups = {};
for (const r of rows) { const rep = find(r.id); if (!groups[rep]) groups[rep] = []; groups[rep].push(r); }

const out = [];
for (const rep in groups) {
  const members = groups[rep];
  if (members.length <= 1) continue;
  // choose canonical: longest name or most common slug heuristic
  members.sort((x, y) => y.name.length - x.name.length);
  const canonical = members[0].name;
  out.push({ group_id: rep, canonical, members: members.map(m => `${m.id}|${m.name}`).join(';') });
}

const csvHeader = 'group_id,canonical,members\n';
const csv = csvHeader + out.map(o => `"${o.group_id}","${o.canonical.replace(/"/g, '""')}","${o.members.replace(/"/g, '""')}"`).join('\n') + '\n';
fs.writeFileSync(OUTPUT, csv, 'utf8');
console.log('written', OUTPUT, 'groups:', out.length);
