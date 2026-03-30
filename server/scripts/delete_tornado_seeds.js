const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, '..', 'data', 'items.db');
if (!fs.existsSync(DB_FILE)) {
	console.error('DB not found at', DB_FILE);
	process.exit(1);
}
const db = new Database(DB_FILE);
const ids = ['tornado', 'tornado2', 'tornado3', 'tornado4', 'tornado5', 'tornado6'];
const del = db.prepare('DELETE FROM items WHERE id = ?');
let removed = 0;
db.transaction(() => {
	for (const id of ids) {
		const info = del.run(id);
		if (info.changes) { console.log('deleted', id); removed += info.changes; }
	}
})();
console.log('removed count', removed);
