const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dir)) {
	console.error('data dir not found');
	process.exit(1);
}
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
let removed = 0;
for (const f of files) {
	if (f === 'vehicles_mapped.csv') continue;
	const p = path.join(dir, f);
	try {
		fs.unlinkSync(p);
		removed++;
		console.log('deleted', f);
	} catch (e) {
		console.error('failed delete', f, e.message);
	}
}
const remaining = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
console.log('remaining csv:', remaining);
console.log('removed count:', removed);
