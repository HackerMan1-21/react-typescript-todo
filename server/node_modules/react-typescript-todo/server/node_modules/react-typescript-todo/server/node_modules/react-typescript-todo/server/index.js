const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, 'data', 'items.db');
const INIT_JSON = path.join(__dirname, 'data', 'initialItems.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));

const db = new Database(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );

`);

// seed if empty
const count = db.prepare('SELECT COUNT(1) as c FROM items').get().c;
if (count === 0) {
	const raw = fs.readFileSync(INIT_JSON, 'utf8');
	const items = JSON.parse(raw);
	const insert = db.prepare('INSERT INTO items (id, data) VALUES (?, ?)');
	const insertMany = db.transaction((arr) => {
		for (const it of arr) insert.run(it.id, JSON.stringify(it));
	});
	insertMany(items);
	console.log('seeded', items.length, 'items');
}

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// uploads directory (for user-uploaded images)
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// serve uploaded files statically at /uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// configure multer to store uploads in uploads/ with unique filenames
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, UPLOADS_DIR),
	filename: (req, file, cb) => {
		const safe = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
		cb(null, safe);
	},
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.get('/api/items', (req, res) => {
	const rows = db.prepare('SELECT data FROM items ORDER BY rowid DESC').all();
	const items = rows.map((r) => {
		try { return JSON.parse(r.data); } catch (e) { return null; }
	}).filter(Boolean);

	// If caller requests dedupe, return a deduped list; otherwise return all items.
	if (req.query && (req.query.dedupe === '1' || req.query.dedupe === 'true')) {
		const map = new Map();
		for (const it of items) {
			const key = (
				(it.vehicleData && it.vehicleData.internalModelName) ||
				it.nameEn ||
				it.name ||
				it.english_name ||
				it.englishName ||
				it.slug || ''
			).toString().toLowerCase().trim();
			if (!key) {
				// keep items with no key by using a unique placeholder
				map.set(it.id || JSON.stringify(it), it);
				continue;
			}
			if (!map.has(key)) { map.set(key, it); continue; }
			const existing = map.get(key);
			const existingIsShort = existing.id && existing.id.length < 10;
			const currentIsUuidLike = it.id && it.id.length >= 10;
			if (existingIsShort && currentIsUuidLike) map.set(key, it);
		}
		return res.json(Array.from(map.values()));
	}

	res.json(items);
});

app.get('/api/items/:id', (req, res) => {
	const row = db.prepare('SELECT data FROM items WHERE id = ?').get(req.params.id);
	if (!row) return res.status(404).send('not found');
	res.json(JSON.parse(row.data));
});

app.post('/api/items', (req, res) => {
	const item = req.body;
	if (!item || !item.id) return res.status(400).send('invalid');
	const stmt = db.prepare('INSERT INTO items (id, data) VALUES (?, ?)');
	try {
		stmt.run(item.id, JSON.stringify(item));
		res.status(201).json(item);
	} catch (e) {
		res.status(400).send(String(e));
	}
});

app.put('/api/items/:id', (req, res) => {
	const id = req.params.id;
	const item = req.body;
	if (!item) return res.status(400).send('invalid');
	const stmt = db.prepare('UPDATE items SET data = ? WHERE id = ?');
	const info = stmt.run(JSON.stringify(item), id);
	if (info.changes === 0) return res.status(404).send('not found');
	res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
	const id = req.params.id;
	// fetch existing item so we can remove any uploaded files it references
	const row = db.prepare('SELECT data FROM items WHERE id = ?').get(id);
	if (!row) return res.status(404).send('not found');
	let item;
	try { item = JSON.parse(row.data); } catch (e) { item = null; }

	const unlinkIfUpload = (url) => {
		if (!url || typeof url !== 'string') return;
		const idx = url.indexOf('/uploads/');
		if (idx === -1) return;
		const rel = url.substring(idx + 1); // uploads/...
		const full = path.join(__dirname, rel);
		try {
			const resolved = path.resolve(full);
			const uploadsResolved = path.resolve(UPLOADS_DIR);
			if (!resolved.startsWith(uploadsResolved)) return;
			if (fs.existsSync(resolved)) {
				fs.unlinkSync(resolved);
				console.log('deleted upload file', resolved);
			}
		} catch (err) {
			console.error('failed to unlink upload', full, err);
		}
	};

	// collect candidate URLs
	const candidates = [];
	if (item) {
		if (item.image) candidates.push(item.image);
		if (Array.isArray(item.images)) {
			for (const im of item.images) {
				if (!im) continue;
				if (typeof im === 'string') candidates.push(im);
				else if (im.url) candidates.push(im.url);
			}
		}
	}

	for (const u of candidates) unlinkIfUpload(u);

	const stmt = db.prepare('DELETE FROM items WHERE id = ?');
	const info = stmt.run(id);
	if (info.changes === 0) return res.status(404).send('not found');
	res.status(204).end();
});

// Upload endpoint: accepts multipart/form-data file under 'file' field
app.post('/api/upload', upload.single('file'), (req, res) => {
	if (!req.file) return res.status(400).send('no file');
	const url = `/uploads/${req.file.filename}`;
	res.json({ url });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('server listening on', port));
