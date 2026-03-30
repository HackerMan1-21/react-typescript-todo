const fs = require('fs');
const path = require('path');

function walk(dir) {
	let files = [];
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name);
		const stat = fs.statSync(p);
		if (stat.isDirectory()) files = files.concat(walk(p));
		else if (p.endsWith('.json')) files.push(p);
	}
	return files;
}

const root = path.resolve(__dirname, '..');
const files = walk(root);
let ok = true;
for (const f of files) {
	try {
		const raw = fs.readFileSync(f, 'utf8');
		JSON.parse(raw);
	} catch (e) {
		console.error('FAILED parse:', f);
		console.error(e && e.message);
		ok = false;
	}
}
if (ok) console.log('all json parsed OK');
