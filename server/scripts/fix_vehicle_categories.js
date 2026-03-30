const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, '..', 'data', 'items.db');
if (!fs.existsSync(DB_FILE)) {
	console.error('DB not found at', DB_FILE);
	process.exit(1);
}

const db = new Database(DB_FILE);

const rows = db.prepare("SELECT id, data FROM items WHERE json_extract(data, '$.category') = '車両'").all();
console.log('found', rows.length, "items with category '車両'");

const update = db.prepare('UPDATE items SET data = ? WHERE id = ?');
let changed = 0;
for (const r of rows) {
	const it = JSON.parse(r.data);
	const internal = (it.vehicleData && it.vehicleData.internalModelName) || '';
	const name = (it.name || '').toLowerCase();
	// If tornado series, set to クラシックスポーツカー
	if (internal && internal.toLowerCase().startsWith('tornado') || name.includes('tornado') || name.includes('トルネード')) {
		it.category = 'クラシックスポーツカー';
		update.run(JSON.stringify(it), r.id);
		console.log('updated', r.id, '-> クラシックスポーツカー');
		changed++;
	}
}

console.log('done, changed', changed);
