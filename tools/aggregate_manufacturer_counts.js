const fs = require('fs');
const vm = fs.readFileSync('data/vehicles_mapped.csv', 'utf8').split(/\r?\n/).filter(Boolean);
const mm = fs.readFileSync('data/manufacturers.csv', 'utf8').split(/\r?\n/).filter(Boolean);
vm.shift(); // header
function parseLineCSV(line) {
  const res = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === ',' && !inQ) {
      res.push(cur);
      cur = '';
    } else { cur += ch; }
  }
  res.push(cur);
  return res;
}
const counts = {};
vm.forEach(line => {
  const cols = parseLineCSV(line);
  const mid = cols[5] || '';
  counts[mid] = (counts[mid] || 0) + 1;
});
const manMap = {};
mm.shift();
mm.forEach(line => {
  if (!line.trim()) return;
  const cols = parseLineCSV(line);
  const id = cols[0] || '';
  const name = (cols[1] || '').replace(/""/g, '"');
  manMap[id] = name || id;
});
const rows = Object.keys(counts).map(id => ({ id, name: manMap[id] || '(unknown)', count: counts[id] }));
rows.sort((a, b) => b.count - a.count || (a.name || '').localeCompare(b.name));
let total = 0; rows.forEach(r => total += r.count);
console.log('メーカー別 車両数集計');
console.log('合計車両数:', total, '（vehicles_mapped.csv の非ヘッダ行数）');
console.log('メーカー数:', rows.length);
console.log('---');
console.log('count,id,name');
rows.forEach(r => console.log(`${r.count},${r.id},${r.name}`));
