const fs = require('fs');
const path = require('path');

const files = [
	'data/vehicles.csv',
	'data/vehicles_clean.csv',
	'data/vehicles_full.csv',
	'data/vehicles_mapped.csv'
];

files.forEach((rel) => {
	const p = path.join(__dirname, '..', rel);
	if (!fs.existsSync(p)) {
		console.warn('not found:', p);
		return;
	}
	const raw = fs.readFileSync(p, 'utf8');
	const lines = raw.split(/\r?\n/);
	if (lines.length === 0) return;
	const header = lines[0];
	const seen = new Set();
	const out = [header];
	let removed = 0;
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (!line || !line.trim()) continue;
		// CSV first column is id (may be quoted) - extract up to first comma
		const firstComma = line.indexOf(',');
		const id = firstComma === -1 ? line : line.slice(0, firstComma);
		if (seen.has(id)) {
			removed++;
			continue;
		}
		seen.add(id);
		out.push(line);
	}
	fs.writeFileSync(p, out.join('\n'));
	console.log(`Processed ${rel}: kept=${out.length - 1} removed=${removed}`);
});
