const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'ap.txt');
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT = path.join(OUTPUT_DIR, 'vehicles_names.csv');

if (!fs.existsSync(INPUT)) {
	console.error('input file not found:', INPUT);
	process.exit(1);
}

const raw = fs.readFileSync(INPUT, 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const rows = [];
for (let i = 0; i < lines.length; i++) {
	const line = lines[i];
	// inline parentheses with Japanese (fullwidth or ascii)
	const inlineMatch = line.match(/^(.*?)\s*[（\(](.+?)[）\)]$/);
	if (inlineMatch) {
		const eng = inlineMatch[1].trim();
		const jpn = inlineMatch[2].trim();
		// skip header-like lines
		if (eng && jpn) rows.push([eng, jpn]);
		continue;
	}
	// next-line japanese in fullwidth parentheses
	if (i + 1 < lines.length) {
		const next = lines[i + 1];
		const nextMatch = next.match(/^（(.+)）$/);
		if (nextMatch) {
			const eng = line;
			const jpn = nextMatch[1].trim();
			// avoid capturing category headings or descriptions (heuristic: skip short words like '☆自動車')
			if (!eng.match(/^[☆△▽◆]/) && eng.length > 1) {
				rows.push([eng, jpn]);
			}
			i++; // skip next
			continue;
		}
	}
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const header = 'english_name,japanese_name\n';
const csv = header + rows.map(r => `${escapeCsv(r[0])},${escapeCsv(r[1])}`).join('\n') + '\n';
fs.writeFileSync(OUTPUT, csv, 'utf8');
console.log('written', OUTPUT, 'rows:', rows.length);

function escapeCsv(s) {
	if (s == null) return '';
	if (s.includes(',') || s.includes('\"') || s.includes('\n') || s.includes('"')) {
		return '"' + s.replace(/"/g, '""') + '"';
	}
	return s;
}
