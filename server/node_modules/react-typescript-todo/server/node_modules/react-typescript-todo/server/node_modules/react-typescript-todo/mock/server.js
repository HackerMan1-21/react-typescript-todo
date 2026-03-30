const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const VEHICLES_DIR = path.join(__dirname, 'vehicles');

function loadAllVehicleFiles() {
	if (!fs.existsSync(VEHICLES_DIR)) return [];
	const files = fs.readdirSync(VEHICLES_DIR).filter(f => f.endsWith('.json'));
	return files.map(f => {
		try {
			const raw = fs.readFileSync(path.join(VEHICLES_DIR, f), 'utf8');
			return JSON.parse(raw);
		} catch (e) {
			return null;
		}
	}).filter(Boolean);
}

app.get('/api/vehicles', (req, res) => {
	const all = loadAllVehicleFiles();
	const items = all.map(v => ({
		id: v.id,
		slug: v.slug,
		name: v.name,
		main_image: v.main_image,
		is_rare: v.is_rare || false,
		template_id: v.template && v.template.id
	}));
	res.json({ total: items.length, items });
});

app.get('/api/vehicles/slug/:slug', (req, res) => {
	const slug = req.params.slug;
	const file = path.join(VEHICLES_DIR, `${slug}.json`);
	if (!fs.existsSync(file)) {
		return res.status(404).json({ code: 404, message: 'Not found' });
	}
	try {
		const raw = fs.readFileSync(file, 'utf8');
		const obj = JSON.parse(raw);
		return res.json(obj);
	} catch (e) {
		return res.status(500).json({ code: 500, message: 'Server error' });
	}
});

app.get('/api/vehicles/:id', (req, res) => {
	const id = req.params.id;
	const all = loadAllVehicleFiles();
	const found = all.find(v => v.id === id);
	if (!found) return res.status(404).json({ code: 404, message: 'Not found' });
	res.json(found);
});

app.get('/api/templates', (req, res) => {
	const all = loadAllVehicleFiles();
	const templates = {};
	all.forEach(v => {
		if (v.template && v.template.id) templates[v.template.id] = v.template;
	});
	res.json(Object.values(templates));
});

app.listen(port, () => {
	console.log(`Mock server listening at http://localhost:${port}`);
});
