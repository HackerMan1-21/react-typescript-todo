export type CategoryGroup = {
	title: string;
	subs: string[];
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
	{
		title: '自動車',
		subs: [
			'スーパーカー',
			'スポーツカー',
			'クラシックスポーツカー',
			'マッスルカー',
			'SUV',
			'セダン',
			'オフロード',
			'クーペ',
			'コンパクトカー',
			'バン',
			'商業',
			'工業',
			'作業用',
			'サービス',
			'緊急車両',
			'軍事',
			'ノース・ヤンクトン限定車両',
			'特殊車両',
			'アリーナウォーズ競技車両',
			'オープンホイール',
			'ドリフト改造車',
		],
	},
	{
		title: '二輪車',
		subs: ['バイク', '自転車', '牽引車'],
	},
	{
		title: '航空機',
		subs: ['飛行機', 'ヘリコプター', '飛行船'],
	},
	{
		title: '船舶',
		subs: ['ボート', '潜水艇'],
	},
];

export const CATEGORY_ORDER: string[] = CATEGORY_GROUPS.flatMap((g) => g.subs);

export function slug(s: string) {
	return s
		.replace(/\s+/g, '-')
		.replace(/[^\w\-一-龠ぁ-んァ-ヶー]/g, '')
		.toLowerCase();
}

export default CATEGORY_GROUPS;
