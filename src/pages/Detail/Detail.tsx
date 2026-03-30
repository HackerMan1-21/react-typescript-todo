import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Item } from '../../types/item';
import { uploadImage } from '../../utils/api';
import './Detail.scss';

type Props = {
	items: Item[];
	onSave: (item: Item) => void | Promise<void>;
};

export const Detail = ({ items, onSave }: Props) => {
	const { id } = useParams();
	const item = useMemo(() => items.find((it) => it.id === id), [items, id]);

	const [newUrl, setNewUrl] = useState('');
	const [newComment, setNewComment] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);

	// 野良レア登録用のドラフト
	const [rareNote, setRareNote] = useState('');
	const [rareLocation, setRareLocation] = useState('');
	const [rareDate, setRareDate] = useState('');
	const [rareImagesDraft, setRareImagesDraft] = useState<Array<{ url: string; comment?: string }>>([]);
	const [rareNewUrl, setRareNewUrl] = useState('');
	const [rareNewComment, setRareNewComment] = useState('');
	const [rareSelectedFile, setRareSelectedFile] = useState<File | null>(null);
	const [rareUploading, setRareUploading] = useState(false);

	useEffect(() => {
		if (!item) return;
		document.title = `${item.name} | 攻略図鑑`;
		setMetaDescription(`${item.nameJP}（${item.name}）の詳細ページ。カテゴリーや説明、画像を確認できます。`);
	}, [item]);

	if (!item) return <Navigate to="/" replace />;

	const gallery = item.images && item.images.length ? item.images : [{ url: item.image, comment: '' }];

	const handleAddImage = async () => {
		if (!newUrl.trim()) return;
		const next: Item = {
			...item,
			image: item.image || newUrl.trim(),
			images: [...gallery, { url: newUrl.trim(), comment: newComment.trim() }],
		};
		await onSave(next);
		setNewUrl('');
		setNewComment('');
	};

	const handleAddRareImage = async () => {
		let url = rareNewUrl.trim();
		if (!url && !rareSelectedFile) return;
		if (rareSelectedFile) {
			setRareUploading(true);
			try {
				const res = await uploadImage(rareSelectedFile);
				url = res.url;
			} catch (err) {
				alert('アップロードに失敗しました');
				return;
			} finally {
				setRareUploading(false);
			}
		}
		setRareImagesDraft((s) => [...s, { url, comment: rareNewComment.trim() }]);
		setRareNewUrl('');
		setRareNewComment('');
		setRareSelectedFile(null);
	};

	const handleSaveRare = async () => {
		if (!rareNote.trim() && !rareLocation.trim() && !rareImagesDraft.length) return;
		const newRare = {
			id: `rare-${Date.now()}`,
			note: rareNote.trim(),
			location: rareLocation.trim(),
			date: rareDate.trim(),
			images: rareImagesDraft,
		};
		const next: Item = {
			...item,
			wildRares: [...(item.wildRares || []), newRare],
		};
		await onSave(next);
		// clear draft
		setRareNote('');
		setRareLocation('');
		setRareDate('');
		setRareImagesDraft([]);
	};

	const handleRemoveRare = async (rareId: string) => {
		// confirm の直接使用は ESLint で制限されているため明示的に window を使い、ルールを抑止
		// eslint-disable-next-line no-restricted-globals
		if (!window.confirm('このレア登録を削除しますか？')) return;
		const next: Item = {
			...item,
			wildRares: (item.wildRares || []).filter((r) => r.id !== rareId),
		};
		await onSave(next);
	};

	return (
		<article className="detail">
			<section className="detail__media">
				<img className="detail__main-image" src={item.image} alt={item.nameJP || item.name} />

				<ul className="detail__gallery" aria-label="追加画像">
					{gallery.map((img, index) => (
						<li key={`${img.url}-${index}`} className="detail__gallery-item">
							<img src={img.url} alt={img.comment || `${item.name} 画像 ${index + 1}`} />
							{img.comment && <p>{img.comment}</p>}
						</li>
					))}
				</ul>

				<section className="detail__add-image">
					<h3>画像管理（図鑑項目とは別）</h3>
					<div className="form-row">
						<input className="form-input" placeholder="画像URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
						<div className="or">または</div>
						<input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
						<button className="btn" type="button" disabled={!selectedFile || uploading} onClick={async () => {
							if (!selectedFile) return;
							setUploading(true);
							try {
								const res = await uploadImage(selectedFile);
								setNewUrl(res.url);
							} catch (err) {
								alert('アップロードに失敗しました');
							} finally {
								setUploading(false);
							}
						}}>{uploading ? 'アップロード中...' : 'アップロード'}</button>
					</div>

					<input className="form-input" placeholder="コメント" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
					<button className="btn btn--primary" type="button" onClick={handleAddImage}>追加して保存</button>
				</section>

				{/* 野良レア登録セクション */}
				<section className="detail__add-rare">
					<h3>野良レア車両を登録する</h3>
					<p className="hint">図鑑とは別に見つけたレア車両を登録できます。画像は複数登録可能です。</p>
					<input className="form-input" placeholder="備考 (例：発見状況や特徴)" value={rareNote} onChange={(e) => setRareNote(e.target.value)} />
					<div className="form-row">
						<input className="form-input" placeholder="出現場所" value={rareLocation} onChange={(e) => setRareLocation(e.target.value)} />
						<input className="form-input" placeholder="発見日 (任意)" value={rareDate} onChange={(e) => setRareDate(e.target.value)} />
					</div>

					<div className="form-row">
						<input className="form-input" placeholder="画像URL" value={rareNewUrl} onChange={(e) => setRareNewUrl(e.target.value)} />
						<div className="or">または</div>
						<input type="file" accept="image/*" onChange={(e) => setRareSelectedFile(e.target.files?.[0] ?? null)} />
						<button className="btn" type="button" disabled={!rareSelectedFile && !rareNewUrl} onClick={handleAddRareImage}>{rareUploading ? 'アップロード中...' : '画像を追加'}</button>
					</div>

					<input className="form-input" placeholder="画像のコメント" value={rareNewComment} onChange={(e) => setRareNewComment(e.target.value)} />
					{rareImagesDraft.length > 0 && (
						<ul className="detail__draft-images">
							{rareImagesDraft.map((img, idx) => (
								<li key={`${img.url}-${idx}`}>
									<p className="img-comment">{img.comment}</p>
									<img src={img.url} alt={img.comment || `ドラフト画像 ${idx + 1}`} />
								</li>
							))}
						</ul>
					)}

					<button className="btn btn--primary" type="button" onClick={handleSaveRare}>レアを登録して保存</button>
				</section>
			</section>

			<section className="detail__content">
				<h1>{item.name}</h1>
				<p className="detail__jp">{item.nameJP}</p>
				{item.category && <p><strong>カテゴリー:</strong> {item.category}</p>}
				{item.description && <p>{item.description}</p>}

				{(item.vehicleData?.internalModelName || item.vehicleData?.internalId || item.vehicleData?.dlc || item.vehicleData?.saleStatus || item.vehicleData?.spawnType || item.vehicleData?.customDiff || item.vehicleData?.specialVersion || item.vehicleData?.colorInfo) && (
					<section>
						<h2>車両データ</h2>
						{item.vehicleData?.internalModelName && <p><strong>内部モデル名:</strong> {item.vehicleData.internalModelName}</p>}
						{item.vehicleData?.internalId && <p><strong>内部ID:</strong> {item.vehicleData.internalId}</p>}
						{item.vehicleData?.dlc && <p><strong>追加DLC:</strong> {item.vehicleData.dlc}</p>}
						{item.vehicleData?.saleStatus && <p><strong>購入可否:</strong> {item.vehicleData.saleStatus}</p>}
						{item.vehicleData?.spawnType && <p><strong>スポーンタイプ:</strong> {item.vehicleData.spawnType}</p>}
						{item.vehicleData?.customDiff && <p><strong>カスタム差分:</strong> {item.vehicleData.customDiff}</p>}
						{item.vehicleData?.specialVersion && <p><strong>特殊バージョン:</strong> {item.vehicleData.specialVersion}</p>}
						{item.vehicleData?.colorInfo && <p><strong>カラー情報:</strong> {item.vehicleData.colorInfo}</p>}
					</section>
				)}

				{(item.acquisition?.method || item.acquisition?.storable || item.acquisition?.stealMethod || item.acquisition?.spawnLocation || item.acquisition?.spawnTime) && (
					<section>
						<h2>入手</h2>
						{item.acquisition?.method && <p><strong>入手方法:</strong> {item.acquisition.method}</p>}
						{item.acquisition?.storable && <p><strong>保存可否:</strong> {item.acquisition.storable}</p>}
						{item.acquisition?.stealMethod && <p><strong>奪取方法:</strong> {item.acquisition.stealMethod}</p>}
						{item.acquisition?.spawnLocation && <p><strong>出現場所:</strong> {item.acquisition.spawnLocation}</p>}
						{item.acquisition?.spawnTime && <p><strong>出現時間:</strong> {item.acquisition.spawnTime}</p>}
					</section>
				)}

				{(item.rare?.rareColor || item.rare?.wornColor || item.rare?.npcOnlyColor || item.rare?.specialPearl || item.rare?.wheelColor) && (
					<section>
						<h2>レア要素</h2>
						{item.rare?.rareColor && <p><strong>レアカラー:</strong> {item.rare.rareColor}</p>}
						{item.rare?.wornColor && <p><strong>Wornカラー:</strong> {item.rare.wornColor}</p>}
						{item.rare?.npcOnlyColor && <p><strong>NPC限定カラー:</strong> {item.rare.npcOnlyColor}</p>}
						{item.rare?.specialPearl && <p><strong>特殊パール:</strong> {item.rare.specialPearl}</p>}
						{item.rare?.wheelColor && <p><strong>ホイールカラー:</strong> {item.rare.wheelColor}</p>}
					</section>
				)}

				{(item.spawnConditions?.region || item.spawnConditions?.time || item.spawnConditions?.weather || item.spawnConditions?.trafficDensity || item.spawnConditions?.seedVehicle) && (
					<section>
						<h2>スポーン条件</h2>
						{item.spawnConditions?.region && <p><strong>地域:</strong> {item.spawnConditions.region}</p>}
						{item.spawnConditions?.time && <p><strong>時間:</strong> {item.spawnConditions.time}</p>}
						{item.spawnConditions?.weather && <p><strong>天候:</strong> {item.spawnConditions.weather}</p>}
						{item.spawnConditions?.trafficDensity && <p><strong>交通密度:</strong> {item.spawnConditions.trafficDensity}</p>}
						{item.spawnConditions?.seedVehicle && <p><strong>シード車両:</strong> {item.spawnConditions.seedVehicle}</p>}
					</section>
				)}

				{/* 野良レア表示 */}
				{item.wildRares && item.wildRares.length > 0 && (
					<section>
						<h2>野良レア車両</h2>
						<p className="hint">ユーザーが登録した図鑑とは別の野良レア情報です。</p>
						<ul className="wild-rare-list">
							{item.wildRares.map((r) => (
								<li key={r.id} className="wild-rare-item">
									<div className="wild-rare-meta">
										{r.location && <span className="muted">出現場所: {r.location}</span>}
										{r.date && <span className="muted"> 発見日: {r.date}</span>}
										{r.note && <p>{r.note}</p>}
									</div>
									{r.images && r.images.length > 0 && (
										<ul className="wild-rare-images">
											{r.images.map((img, i) => (
												<li key={`${r.id}-${i}`} className="wild-rare-image-item">
													{img.comment && <p className="img-comment">{img.comment}</p>}
													<img src={img.url} alt={img.comment || `${item.name} レア画像 ${i + 1}`} />
												</li>
											))}
										</ul>
									)}
									<button className="btn btn--tertiary" type="button" onClick={() => handleRemoveRare(r.id)}>削除</button>
								</li>
							))}
						</ul>
					</section>
				)}

				<nav className="detail__actions" aria-label="詳細アクション">
					<Link className="btn btn--primary" to={`/edit/${item.id}`}>編集</Link>
					<Link className="btn btn--secondary" to="/">一覧へ戻る</Link>
				</nav>
			</section>
		</article>
	);
};

export default Detail;

function setMetaDescription(content: string) {
	let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
	if (!meta) {
		meta = document.createElement('meta');
		meta.name = 'description';
		document.head.appendChild(meta);
	}
	meta.content = content;
}
