import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card/Card';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { Item } from '../../types/item';
import './Home.scss';
import { CATEGORY_GROUPS, CATEGORY_ORDER, slug } from '../../utils/categories';

type Props = {
	items: Item[];
	onSave?: (item: Item) => void | Promise<void>;
};


export const Home = ({ items, onSave }: Props) => {
	const [query, setQuery] = useState('');
	const [pageSize, setPageSize] = useState<'all' | 100 | 50 | 25>('all');

	useEffect(() => {
		document.title = '図鑑一覧 | 攻略図鑑';
		setMetaDescription('攻略図鑑の一覧ページ。カテゴリ別にカード表示し、英語名・日本語名でリアルタイム検索できます。');
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter((item) => item.name.toLowerCase().includes(q) || item.nameJP.toLowerCase().includes(q));
	}, [items, query]);

	const limited = useMemo(() => {
		if (pageSize === 'all') return filtered;
		return filtered.slice(0, Number(pageSize));
	}, [filtered, pageSize]);

	const grouped = useMemo(() => {
		return limited.reduce<Record<string, Item[]>>((acc, item) => {
			const cat = item.category || '未分類';
			if (!acc[cat]) acc[cat] = [];
			acc[cat].push(item);
			return acc;
		}, {});
	}, [limited]);

	const categories = useMemo(() => {
		const ordered: string[] = [];
		for (const g of CATEGORY_GROUPS) {
			for (const sub of g.subs) {
				if (grouped[sub]) ordered.push(sub);
			}
		}
		for (const k of Object.keys(grouped)) {
			if (!CATEGORY_ORDER.includes(k)) ordered.push(k);
		}
		return ordered;
	}, [grouped]);

	return (
		<section className="home">
			<header className="home__header">
				<h1>図鑑一覧</h1>
				<div className="home__controls">
					<span className="home__count">表示: {limited.length} / 検索結果: {filtered.length}</span>
					<label>
						件数:
						<select value={String(pageSize)} onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : (Number(e.target.value) as 100 | 50 | 25))}>
							<option value="all">全件</option>
							<option value="100">100</option>
							<option value="50">50</option>
							<option value="25">25</option>
						</select>
					</label>
				</div>
			</header>

			<SearchBar value={query} onChange={setQuery} />

			{/* top-level category nav */}
			<nav className="home__category-nav">
				{CATEGORY_GROUPS.map((g) => (
					<a key={g.title} className="home__nav-link" href={`#group-${slug(g.title)}`}>{g.title}</a>
				))}
			</nav>

			{categories.length === 0 && <p className="home__empty">該当データがありません。</p>}

			{/* render groups in defined order */}
			{CATEGORY_GROUPS.map((group) => (
				<section className="home__group" id={`group-${slug(group.title)}`} key={group.title}>
					<h2 className="home__group-title">{group.title}</h2>
					{group.subs.map((sub) => (
						<div key={sub} className="home__category-section" id={slug(sub)}>
							<h3 className="home__category-title">{sub}</h3>
							<div className="home__grid">
								{(grouped[sub] || []).map((item) => (
									<Card key={item.id} item={item} onSave={onSave} />
								))}
							</div>
						</div>
					))}
				</section>
			))}

			{/* render remaining categories not in CATEGORY_ORDER */}
			{Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)).map((c) => (
				<section className="home__category" key={c} id={slug(c)}>
					<h2 className="home__category-title">{c}</h2>
					<div className="home__grid">
						{(grouped[c] || []).map((item) => (
							<Card key={item.id} item={item} onSave={onSave} />
						))}
					</div>
				</section>
			))}
		</section>
	);
};

function setMetaDescription(content: string) {
	let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
	if (!meta) {
		meta = document.createElement('meta');
		meta.name = 'description';
		document.head.appendChild(meta);
	}
	meta.content = content;
}

export default Home;
