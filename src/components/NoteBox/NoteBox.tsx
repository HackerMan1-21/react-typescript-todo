import './NoteBox.scss';

type NoteType = 'tip' | 'warning' | 'info';

type Props = {
  type: NoteType;
  children: React.ReactNode;
};

const ICONS: Record<NoteType, string> = {
  tip: '💡',
  warning: '⚠️',
  info: 'ℹ️',
};

const LABELS: Record<NoteType, string> = {
  tip: 'ヒント',
  warning: '注意',
  info: '情報',
};

export const NoteBox = ({ type, children }: Props) => (
  <aside className={`note-box note-box--${type}`} role="note">
    <span className="note-box__icon" aria-hidden="true">{ICONS[type]}</span>
    <div>
      <strong className="note-box__label">{LABELS[type]}</strong>
      <div className="note-box__text">{children}</div>
    </div>
  </aside>
);
