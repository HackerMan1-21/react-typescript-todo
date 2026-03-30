const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const CSV = path.join(__dirname, '..', 'data', 'manufacturer_candidates.csv');
const DB_FILE = path.join(__dirname, 'data', 'items.db');

if (!fs.existsSync(CSV)) {
	console.error('CSV not found:', CSV);
	process.exit(1);
}

const raw = fs.readFileSync(CSV, 'utf8');
const lines = raw.split(/\r?\n/).filter(Boolean);
if (lines.length <= 1) {
	console.error('CSV appears empty');
	process.exit(1);
}

const db = new Database(DB_FILE);

const insert = db.prepare('INSERT OR IGNORE INTO items (id, data) VALUES (?, ?)');
let count = 0;

for (let i = 1; i < lines.length; i++) {
	const line = lines[i];
	// naive CSV split: candidate_name,count,examples (examples may contain commas but our file uses none)
	const parts = line.split(',');
	const candidate = parts[0] ? parts[0].trim() : '';
	const cnt = parts[1] ? parts[1].trim() : '';
	const examples = parts.slice(2).join(',').trim();

	if (!candidate) continue;

	const idSafe = `csv-${i}-${candidate.replace(/[^a-z0-9_-]/gi, '_')}`;

	const item = {
		id: idSafe,
		name: candidate,
		nameJP: '',
		category: '車両',
		image: '',
		description: `count: ${cnt}; examples: ${examples}`,
		images: [],
	};

	try {
		insert.run(item.id, JSON.stringify(item));
		count++;
	} catch (e) {
		console.error('failed insert', e.message);
	}
}

console.log('imported', count, 'items');
