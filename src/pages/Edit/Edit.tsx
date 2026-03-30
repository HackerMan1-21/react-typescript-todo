import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Item } from '../../types/item';
import './Edit.scss';
import { uploadImage, deleteItem } from '../../utils/api';
import { CATEGORY_GROUPS } from '../../utils/categories';

type Props = {
	mode: 'create' | 'edit';
	item?: Item;
	items?: Item[];
	onSave: (item: Item) => void | Promise<void>;
	onDelete?: (id: string) => void | Promise<void>;
};

export const Edit = (props: Props) => {
	const navigate = useNavigate();
	const { id } = useParams();

	const source = useMemo(() => {
		if (props.mode === 'create') return props.item ?? null;
		const list = props.items || [];
		return list.find((it) => it.id === id) || null;
	}, [props.mode, props.item, props.items, id]);

	const [form, setForm] = useState<Item | null>(source || null);

	// hooks must be called unconditionally at top-level of component
	const [deleting, setDeleting] = useState(false);
	const [uploading, setUploading] = useState(false);

	const categoryGroups = useMemo(() => {
		// convert CATEGORY_GROUPS (array) to record for backward compatibility
		const rec: Record<string, string[]> = {};
		for (const g of CATEGORY_GROUPS) rec[g.title] = g.subs;
		return rec;
	}, [props]);

	useEffect(() => setForm(source || null), [source]);

	useEffect(() => {
		document.title = props.mode === 'create' ? '新規登録 | 攻略図鑑' : '編集 | 攻略図鑑';
		setMetaDescription('図鑑データの編集・新規登録ページ。画像、名前、日本語名、カテゴリー、説明を更新できます。');
	}, [props.mode]);

	if (!form) {
		if (props.mode === 'create') return null;
		return <Navigate to="/" replace />;
	}

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		await props.onSave(form);
		navigate(`/detail/${form.id}`);
	};


	const handleDelete = async () => {
		if (!form || !form.id) return;
		if (!window.confirm('この項目を削除してもよろしいですか？この操作は取り消せません。')) return;
		setDeleting(true);
		try {
			await deleteItem(form.id);
			// update parent state so the deleted item disappears from the list immediately
			if (props.onDelete) {
				try { props.onDelete(form.id); } catch (_) { }
			}
			navigate('/');
		} catch (err: any) {
			console.error('delete failed', err);
			alert('削除に失敗しました: ' + (err?.message || err));
		} finally {
			setDeleting(false);
		}
	};


	const handleFiles = async (files: FileList | null) => {
		if (!files || files.length === 0) return;
		setUploading(true);
		try {
			const nextImages = Array.isArray(form.images) ? [...form.images] : [];
			for (let i = 0; i < files.length; i++) {
				const f = files[i];
				if (!f.type.startsWith('image/')) continue;
				try {
					const res = await uploadImage(f);
					nextImages.push({ url: res.url, comment: '' });
					if (!form.image) setForm({ ...form, image: res.url, images: nextImages });
					else setForm({ ...form, images: nextImages });
				} catch (err) {
					console.error('upload failed', err);
					alert('アップロードに失敗しました: ' + (f.name || f.type));
				}
			}
		} finally {
			setUploading(false);
		}
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const dt = e.dataTransfer;
		handleFiles(dt.files);
	};

	const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const removeImageAt = (index: number) => {
		const imgs = Array.isArray(form.images) ? [...form.images] : [];
		imgs.splice(index, 1);
		setForm({ ...form, images: imgs });
	};

	return (
		<section className="edit">
			<h1>{props.mode === 'create' ? '新規登録' : '編集'}</h1>

			<form className="edit__form" onSubmit={submit}>
				<p className="edit__note">ドラッグ＆ドロップ、またはファイル選択で複数画像を追加できます。</p>

				<label className="edit__field">
					画像（メインURL）
					<div className="edit__image-row">
						<input className="form-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="メイン画像URL" />
						<input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} />
					</div>
				</label>

				<div className="edit__field">
					<div className="edit__dropzone" onDrop={onDrop} onDragOver={onDragOver}>
						ドラッグ＆ドロップで画像を追加（複数可）
						{uploading && <div className="edit__uploading">アップロード中...</div>}
					</div>
				</div>

				{form.images && form.images.length > 0 && (
					<div className="edit__field">
						<label>追加画像プレビュー</label>
						<ul className="edit__images-list">
							{form.images.map((img, idx) => (
								<li key={`${img.url}-${idx}`} className="edit__images-item">
									<img src={img.url} alt={img.comment || `${form.name} ${idx + 1}`} />
									<div className="edit__images-controls">
										<input className="form-input" placeholder="コメント" value={img.comment || ''} onChange={(e) => {
											const imgs = Array.isArray(form.images) ? [...form.images] : [];
											imgs[idx] = { ...imgs[idx], comment: e.target.value };
											setForm({ ...form, images: imgs });
										}} />
										<button type="button" className="btn" onClick={() => removeImageAt(idx)}>削除</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}

				<label className="edit__field">
					名前（英語名）
					<input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
				</label>

				<label className="edit__field">
					日本語名
					<input className="form-input" value={form.nameJP} onChange={(e) => setForm({ ...form, nameJP: e.target.value })} required />
				</label>

				<label className="edit__field">
					カテゴリー
					<select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
						{Object.entries(categoryGroups).map(([group, opts]) => (
							<optgroup key={group} label={group}>
								{opts.map((c) => (
									<option key={c} value={c}>{c}</option>
								))}
							</optgroup>
						))}
						{form.category && !Object.values(categoryGroups).flat().includes(form.category) && (
							<option value={form.category}>{form.category}</option>
						)}
					</select>
				</label>

				<label className="edit__field">
					説明
					<textarea className="form-textarea" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
				</label>

				<h2>車両データ</h2>
				<label className="edit__field">
					内部モデル名（spawn名）
					<input className="form-input" value={form.vehicleData?.internalModelName ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, internalModelName: e.target.value } })} />
				</label>
				<label className="edit__field">
					内部ID
					<input className="form-input" value={form.vehicleData?.internalId ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, internalId: e.target.value } })} />
				</label>
				<label className="edit__field">
					追加DLC
					<input className="form-input" value={form.vehicleData?.dlc ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, dlc: e.target.value } })} />
				</label>
				<label className="edit__field">
					購入可否（購入可/削除車両/非売品）
					<input className="form-input" value={form.vehicleData?.saleStatus ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, saleStatus: e.target.value } })} />
				</label>
				<label className="edit__field">
					スポーンタイプ
					<input className="form-input" value={form.vehicleData?.spawnType ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, spawnType: e.target.value } })} />
				</label>
				<label className="edit__field">
					カスタム差分
					<input className="form-input" value={form.vehicleData?.customDiff ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, customDiff: e.target.value } })} />
				</label>
				<label className="edit__field">
					特殊バージョン
					<input className="form-input" value={form.vehicleData?.specialVersion ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, specialVersion: e.target.value } })} />
				</label>
				<label className="edit__field">
					カラー情報
					<input className="form-input" value={form.vehicleData?.colorInfo ?? ''} onChange={(e) => setForm({ ...form, vehicleData: { ...form.vehicleData, colorInfo: e.target.value } })} />
				</label>

				<h2>入手</h2>
				<label className="edit__field">
					入手方法
					<input className="form-input" value={form.acquisition?.method ?? ''} onChange={(e) => setForm({ ...form, acquisition: { ...form.acquisition, method: e.target.value } })} />
				</label>
				<label className="edit__field">
					保存可否
					<input className="form-input" value={form.acquisition?.storable ?? ''} onChange={(e) => setForm({ ...form, acquisition: { ...form.acquisition, storable: e.target.value } })} />
				</label>
				<label className="edit__field">
					奪取方法
					<input className="form-input" value={form.acquisition?.stealMethod ?? ''} onChange={(e) => setForm({ ...form, acquisition: { ...form.acquisition, stealMethod: e.target.value } })} />
				</label>
				<label className="edit__field">
					出現場所
					<input className="form-input" value={form.acquisition?.spawnLocation ?? ''} onChange={(e) => setForm({ ...form, acquisition: { ...form.acquisition, spawnLocation: e.target.value } })} />
				</label>
				<label className="edit__field">
					出現時間
					<input className="form-input" value={form.acquisition?.spawnTime ?? ''} onChange={(e) => setForm({ ...form, acquisition: { ...form.acquisition, spawnTime: e.target.value } })} />
				</label>

				<h2>レア要素</h2>
				<label className="edit__field">
					レアカラー
					<input className="form-input" value={form.rare?.rareColor ?? ''} onChange={(e) => setForm({ ...form, rare: { ...form.rare, rareColor: e.target.value } })} />
				</label>
				<label className="edit__field">
					Wornカラー
					<input className="form-input" value={form.rare?.wornColor ?? ''} onChange={(e) => setForm({ ...form, rare: { ...form.rare, wornColor: e.target.value } })} />
				</label>
				<label className="edit__field">
					NPC限定カラー
					<input className="form-input" value={form.rare?.npcOnlyColor ?? ''} onChange={(e) => setForm({ ...form, rare: { ...form.rare, npcOnlyColor: e.target.value } })} />
				</label>
				<label className="edit__field">
					特殊パール
					<input className="form-input" value={form.rare?.specialPearl ?? ''} onChange={(e) => setForm({ ...form, rare: { ...form.rare, specialPearl: e.target.value } })} />
				</label>
				<label className="edit__field">
					ホイールカラー
					<input className="form-input" value={form.rare?.wheelColor ?? ''} onChange={(e) => setForm({ ...form, rare: { ...form.rare, wheelColor: e.target.value } })} />
				</label>

				<h2>スポーン条件</h2>
				<label className="edit__field">
					地域
					<input className="form-input" value={form.spawnConditions?.region ?? ''} onChange={(e) => setForm({ ...form, spawnConditions: { ...form.spawnConditions, region: e.target.value } })} />
				</label>
				<label className="edit__field">
					時間
					<input className="form-input" value={form.spawnConditions?.time ?? ''} onChange={(e) => setForm({ ...form, spawnConditions: { ...form.spawnConditions, time: e.target.value } })} />
				</label>
				<label className="edit__field">
					天候
					<input className="form-input" value={form.spawnConditions?.weather ?? ''} onChange={(e) => setForm({ ...form, spawnConditions: { ...form.spawnConditions, weather: e.target.value } })} />
				</label>
				<label className="edit__field">
					交通密度
					<input className="form-input" value={form.spawnConditions?.trafficDensity ?? ''} onChange={(e) => setForm({ ...form, spawnConditions: { ...form.spawnConditions, trafficDensity: e.target.value } })} />
				</label>
				<label className="edit__field">
					シード車両
					<input className="form-input" value={form.spawnConditions?.seedVehicle ?? ''} onChange={(e) => setForm({ ...form, spawnConditions: { ...form.spawnConditions, seedVehicle: e.target.value } })} />
				</label>

				<div className="edit__actions">
					<button className="btn btn--primary" type="submit">保存</button>
					<Link className="btn btn--secondary" to={props.mode === 'create' ? '/' : `/detail/${form.id}`}>キャンセル</Link>
					{props.mode === 'edit' && (
						<button type="button" className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
							{deleting ? '削除中...' : '削除'}
						</button>
					)}
				</div>
			</form>
		</section>
	);
};

export default Edit;

function setMetaDescription(content: string) {
	let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
	if (!meta) {
		meta = document.createElement('meta');
		meta.name = 'description';
		document.head.appendChild(meta);
	}
	meta.content = content;
}
