import { Award } from '../../types/award';
import { ItemProgress } from '../../types/progress';
import { CheckToggle } from '../CheckToggle/CheckToggle';
import { TierBadge } from '../TierBadge/TierBadge';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Link } from 'react-router-dom';
import './AwardCard.scss';

type Props = {
  award: Award;
  categorySlug: string;
  categoryColor: string;
  progress: ItemProgress;
  onToggle: () => void;
};

export const AwardCard = ({
  award,
  categorySlug,
  categoryColor,
  progress,
  onToggle,
}: Props) => {
  const currentTier = progress.currentTier || 1;
  const activeTier = award.tiers.find((t) => t.tier === currentTier);
  const tierPercent = activeTier && activeTier.target > 0
    ? Math.min(Math.round((progress.progress / activeTier.target) * 100), 100)
    : 0;

  return (
    <article
      className={`award-card${progress.checked ? ' award-card--done' : ''}`}
      style={{ '--award-color': categoryColor } as React.CSSProperties}
    >
      <header className="award-card__header">
        <div className="award-card__title-row">
          <CheckToggle checked={progress.checked} onChange={onToggle} size="sm" />
          <h3 className="award-card__title">{award.name}</h3>
          {award.tiers.length > 1 && (
            <TierBadge
              tier={progress.checked ? award.tiers.length : currentTier}
              maxTier={award.tiers.length}
              color={categoryColor}
            />
          )}
        </div>
        <p className="award-card__desc">{award.description}</p>
      </header>

      {award.tiers.length > 1 && !progress.checked && (
        <div className="award-card__progress">
          <ProgressBar
            percent={tierPercent}
            color={categoryColor}
            size="sm"
            label={`${progress.progress} / ${activeTier?.target ?? '?'}`}
          />
        </div>
      )}

      <footer className="award-card__footer">
        {award.reward.rp > 0 && (
          <span className="award-card__rp">RP +{award.reward.rp.toLocaleString()}</span>
        )}
        {award.reward.cash > 0 && (
          <span className="award-card__cash">${award.reward.cash.toLocaleString()}</span>
        )}
        <Link
          to={`/awards/${categorySlug}/${award.id}`}
          className="award-card__detail-link"
        >
          攻略 →
        </Link>
      </footer>
    </article>
  );
};
