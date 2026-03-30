import './ProgressBar.scss';

type Props = {
  percent: number;
  label?: string;
  color?: string;
  size?: 'sm' | 'md';
};

export const ProgressBar = ({
  percent,
  label,
  color = '#3f78ff',
  size = 'md',
}: Props) => {
  const clamped = Math.min(Math.max(percent, 0), 100);

  return (
    <div className={`pbar pbar--${size}`}>
      <div className="pbar__track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="pbar__fill"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      <span className="pbar__label">{label ?? `${clamped}%`}</span>
    </div>
  );
};
