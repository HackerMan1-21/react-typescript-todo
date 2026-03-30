const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'ap.txt');
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT = path.join(OUTPUT_DIR, 'vehicles_full.csv');

if (!fs.existsSync(INPUT)) {
	console.error('input file not found:', INPUT);
	process.exit(1);
}

const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

let currentCategory = '';
let currentSub = '';
const rows = [];

for (let i = 0; i < lines.length; i++) {
	const line = lines[i];

	// category marker, e.g. '☆自動車' or lines that start with '☆'
	const catMatch = line.match(/^☆\s*(.+)/);
	if (catMatch) {
		currentCategory = catMatch[1].trim();
		currentSub = '';
		continue;
	}
	// subcategory marker, e.g. '△スーパーカー'
	const subMatch = line.match(/^△\s*(.+)/);
	if (subMatch) {
		currentSub = subMatch[1].trim();
		continue;
	}

	// ignore metadata lines
	if (/^(category=|sub_category|english_name|①|②|③|🔧|🔩|🔗|🚘|🏁|💰|🏆)/.test(line)) continue;
	if (line.length > 120) continue;
	if (line === '-' || line === '—') continue;

	// inline parenthesis: English (Japanese) or English（Japanese）
	const inline = line.match(/^(.*?)\s*[（\(](.+)[）\)]$/);
	if (inline) {
		const eng = inline[1].trim();
		const jpn = inline[2].trim();
		if (eng.length > 0 && jpn.length > 0) {
			rows.push([currentCategory, currentSub, eng, jpn]);
			continue;
		}
	}

	// next-line japanese parentheses
	if (i + 1 < lines.length) {
		const next = lines[i + 1];
		const nextMatch = next.match(/^（(.+)）$/);
		if (nextMatch) {
			const eng = line;
			const jpn = nextMatch[1].trim();
			// heuristics: skip headings
			if (eng.length > 1 && !eng.match(/^(例：|category=|category|sub_category)/)) {
				rows.push([currentCategory, currentSub, eng, jpn]);
			}
			i++; // skip next line
			continue;
		}
	}

	// some lines already are Japanese-only in parentheses without leading English - skip
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const header = 'category,sub_category,english_name,japanese_name\n';
const csv = header + rows.map(r => `${escapeCsv(r[0])},${escapeCsv(r[1])},${escapeCsv(r[2])},${escapeCsv(r[3])}`).join('\n') + '\n';
fs.writeFileSync(OUTPUT, csv, 'utf8');
console.log('written', OUTPUT, 'rows:', rows.length);

function escapeCsv(s) {
	if (!s) return '';
	const v = String(s);
	if (v.includes(',') || v.includes('"') || v.includes('\n')) {
		return '"' + v.replace(/"/g, '""') + '"';
	}
	return v;
}
