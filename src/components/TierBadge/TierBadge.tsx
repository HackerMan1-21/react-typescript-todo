import './TierBadge.scss';

type Props = {
  tier: number;
  maxTier?: number;
  color?: string;
};

const TIER_LABELS: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

export const TierBadge = ({ tier, maxTier = 4, color = '#f59e0b' }: Props) => (
  <span
    className={`tier-badge tier-badge--t${tier}`}
    style={{ '--tier-color': color } as React.CSSProperties}
    title={`ティア ${tier} / ${maxTier}`}
  >
    {TIER_LABELS[tier] ?? tier}
  </span>
);
