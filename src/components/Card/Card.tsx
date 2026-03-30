import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Item } from '../../types/item';
import './Card.scss';

type Props = {
	item: Item;
	onSave?: (item: Item) => void | Promise<void>;
};

export const Card = ({ item, onSave }: Props) => {
	const gallery = item.images && item.images.length ? item.images : (item.image ? [{ url: item.image, comment: '' }] : []);

	return (
		<article className="card">
			<Link className="card__image-link" to={`/detail/${item.id}`} aria-label={`${item.name} の詳細へ`}>
				<img className="card__image" src={item.image} alt={item.nameJP || item.name} loading="lazy" />
				<div className="card__title-wrap">
					<span className="card__title-en">{item.name}</span>
					<span className="card__title-jp">{item.nameJP}</span>
				</div>
			</Link>

			<div className="card__actions">
				<Link to={`/detail/${item.id}`}>詳細</Link>
				<Link to={`/edit/${item.id}`} className="btn btn--primary">編集</Link>
			</div>
		</article>
	);
};

export default Card;
