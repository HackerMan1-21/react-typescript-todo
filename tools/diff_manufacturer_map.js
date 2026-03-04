const fs = require('fs');
const parse = (s) => s.split(/\r?\n/).filter(Boolean).map(l=>{
  const parts = [];
  let cur=''; let inQ=false;
  for (let i=0;i<l.length;i++){
    const ch=l[i];
    if (ch==='"'){
      if (inQ && l[i+1]==='"'){ cur+='"'; i++; }
      else inQ=!inQ;
    } else if (ch===',' && !inQ){ parts.push(cur); cur=''; }
    else cur+=ch;
  }
  parts.push(cur);
  return parts;
});
const tplRaw = fs.readFileSync('data/manufacturer_map_template.csv','utf8');
const curRaw = fs.readFileSync('data/manufacturer_map.csv','utf8');
const tpl = parse(tplRaw); const cur = parse(curRaw);
const tplMap = {}; for (let i=1;i<tpl.length;i++){ tplMap[tpl[i][0]] = tpl[i][1] || ''; }
const curMap = {}; for (let i=1;i<cur.length;i++){ curMap[cur[i][0]] = cur[i][1] || ''; }
const allKeys = Array.from(new Set([...Object.keys(tplMap), ...Object.keys(curMap)])).sort((a,b)=>a.localeCompare(b));
const diffs = [];
allKeys.forEach(k=>{
  const before = tplMap[k]===undefined?'<missing>':tplMap[k];
  const after = curMap[k]===undefined?'<missing>':curMap[k];
  if (before !== after) diffs.push({candidate:k,before,after});
});
console.log('manufacturer_map pre/post diff');
console.log('total candidates:', allKeys.length);
console.log('changed entries:', diffs.length);
console.log('---');
console.log('candidate, before_id, after_id');
const wantCsv = process.argv.includes('--csv') || process.argv.includes('--full');
if (wantCsv) {
  const outPath = 'data/manufacturer_map_diff.csv';
  const lines = ['candidate,before_id,after_id', ...diffs.map(d=>`${d.candidate},${d.before},${d.after}`)];
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log('wrote full CSV to', outPath);
} else {
  const sample = diffs.slice(0,50);
  sample.forEach(d=>console.log(`${d.candidate},${d.before},${d.after}`));
  if (diffs.length>50) console.log('\n... (showing 50 of '+diffs.length+')');
}
const stats = {added:0,removed:0,changed:0};
for (const d of diffs){
  if (d.before==='') stats.added++;
  else if (d.after==='') stats.removed++;
  else stats.changed++;
}
console.log('\nstats: added(assignments)=' + stats.added + ', removed=' + stats.removed + ', changed=' + stats.changed);
