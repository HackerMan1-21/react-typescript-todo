const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, '..', 'data', 'items.db');
if (!fs.existsSync(DB_FILE)) {
	console.error('DB not found at', DB_FILE);
	process.exit(1);
}

const db = new Database(DB_FILE);

const items = [
	{
		id: 'tornado',
		name: 'Tornado',
		nameJP: 'トルネード',
		category: '車両',
		image: '',
		description: '2ドア ハードトップ（標準仕様）。初期リリースで追加されたクラシックな車両。',
		vehicleData: { internalModelName: 'tornado' },
	},
	{
		id: 'tornado2',
		name: 'Tornado2',
		nameJP: 'トルネード2',
		category: '車両',
		image: '',
		description: '2ドア コンバーチブル（ソフトトップ）。初期リリースのコンバーチブル仕様。',
		vehicleData: { internalModelName: 'tornado2' },
	},
	{
		id: 'tornado3',
		name: 'Tornado3',
		nameJP: 'トルネード（錆びた仕様）',
		category: '車両',
		image: '',
		description: '錆びた仕様（ビーター / ラステッド）。初期リリース。',
		vehicleData: { internalModelName: 'tornado3' },
	},
	{
		id: 'tornado4',
		name: 'Tornado4',
		nameJP: 'トルネード（マリアッチ）',
		category: '車両',
		image: '',
		description: 'マリアッチ仕様。外観は錆びた仕様に似るが内部的には独立したモデルIDとして扱われる特殊仕様。',
		vehicleData: { internalModelName: 'tornado4', vehicleType: 'オフロード' },
	},
	{
		id: 'tornado5',
		name: 'Tornado Custom',
		nameJP: 'トルネード・カスタム',
		category: '車両',
		image: '',
		description: 'ローライダー仕様。ベニーズ改造対応。ハイドロリクス実装を前提とした特殊なサスペンション挙動を持つ。',
		vehicleData: { internalModelName: 'tornado5' },
	},
	{
		id: 'tornado6',
		name: 'Tornado Rat Rod',
		nameJP: 'トルネード・ラットロッド',
		category: '車両',
		image: '',
		description: 'エンジンが露出したラットロッド仕様。バイカー系のMODやイベントで登場することがある。',
		vehicleData: { internalModelName: 'tornado6' },
	}
];

const insert = db.prepare('INSERT OR REPLACE INTO items (id, data) VALUES (?, ?)');
const tx = db.transaction((arr) => {
	for (const it of arr) {
		insert.run(it.id, JSON.stringify(it));
		console.log('upserted', it.id);
	}
});

tx(items);
console.log('done');
