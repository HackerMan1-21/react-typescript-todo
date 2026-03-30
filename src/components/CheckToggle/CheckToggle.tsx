import './CheckToggle.scss';

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: 'sm' | 'md';
};

export const CheckToggle = ({ checked, onChange, label, size = 'md' }: Props) => (
  <label className={`check-toggle check-toggle--${size}${checked ? ' check-toggle--checked' : ''}`}>
    <input
      type="checkbox"
      className="check-toggle__input"
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
    <span className="check-toggle__box" aria-hidden="true">
      {checked && '✓'}
    </span>
    {label && <span className="check-toggle__label">{label}</span>}
  </label>
);
