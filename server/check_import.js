const Database = require('better-sqlite3');
const db = new Database('data/items.db');
const total = db.prepare('SELECT COUNT(1) as c FROM items').get().c;
const withVehicleData = db.prepare("SELECT COUNT(1) as c FROM items WHERE data LIKE '%vehicleData%'").get().c;
const sample = db.prepare('SELECT data FROM items LIMIT 1').get();
const it = JSON.parse(sample.data);
console.log('Total items:', total);
console.log('Items with vehicleData:', withVehicleData);
console.log('Sample name:', it.name, '| vehicleData:', it.vehicleData ? JSON.stringify(it.vehicleData).slice(0, 80) : 'NONE');
