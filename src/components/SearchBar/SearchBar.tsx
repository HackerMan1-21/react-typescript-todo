import './SearchBar.scss';

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: Props) => {
	return (
		<div className="search-bar" role="search">
			<input
				className="search-bar__input form-input"
				type="search"
				placeholder="名前（英語名 / 日本語名）で検索"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-label="図鑑検索"
			/>
		</div>
	);
};
