import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AwardCategory } from '../../types/award';
import { CheckToggle } from '../../components/CheckToggle/CheckToggle';
import { TierBadge } from '../../components/TierBadge/TierBadge';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { useGlobalProgress } from '../../hooks/useGlobalProgress';
import heistsData from '../../data/awards/heists.json';
import combatData from '../../data/awards/combat.json';
import vehiclesData from '../../data/awards/vehicles.json';
import businessData from '../../data/awards/business.json';
import freemodeData from '../../data/awards/freemode.json';
import jobsData from '../../data/awards/jobs.json';
import racingData from '../../data/awards/racing.json';
import './AwardDetail.scss';

const CATEGORY_MAP: Record<string, AwardCategory> = {
  heists: heistsData as AwardCategory,
  combat: combatData as AwardCategory,
  vehicles: vehiclesData as AwardCategory,
  business: businessData as AwardCategory,
  freemode: freemodeData as AwardCategory,
  jobs: jobsData as AwardCategory,
  racing: racingData as AwardCategory,
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

const AwardDetail = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const catData = category ? CATEGORY_MAP[category] : undefined;
  const award = catData && id ? catData.awards.find((a) => a.id === id) : undefined;
  const { isAwardChecked, toggleAward, getAwardProgress } = useGlobalProgress();

  useEffect(() => {
    if (!award) return;
    document.title = `${award.name} | GTA Online 攻略図鑑`;
    if (award.seo?.description) {
      setMetaDescription(award.seo.description);
    }
  }, [award]);

  if (!catData || !award) return <Navigate to="/awards" replace />;

  const checked = isAwardChecked(award.id);
  const progress = getAwardProgress(award.id);
  const currentProgress = progress?.progress ?? 0;
  const percent = award.progressMax > 0
    ? Math.min(100, Math.round((currentProgress / award.progressMax) * 100))
    : checked ? 100 : 0;

  const currentTierIndex = award.tiers.findIndex((t) => currentProgress < t.target);
  const currentTier =
    currentTierIndex === -1
      ? award.tiers.length
      : currentTierIndex;

  return (
    <div
      className="award-detail"
      style={{ '--award-color': catData.color } as React.CSSProperties}
    >
      {/* Breadcrumb */}
      <nav className="award-detail__breadcrumb">
        <Link to="/awards">アワード</Link>
        <span> › </span>
        <Link to={`/awards/${catData.category}`}>{catData.label}</Link>
        <span> › </span>
        <span>{award.name}</span>
      </nav>

      {/* Header */}
      <header className="award-detail__header">
        <div className="award-detail__title-row">
          <h1 className="award-detail__title">{award.name}</h1>
          <TierBadge tier={currentTier} maxTier={award.tiers.length} color={catData.color} />
        </div>
        <p className="award-detail__description">{award.description}</p>
        <div className="award-detail__check-row">
          <CheckToggle
            checked={checked}
            onChange={() => toggleAward(award.id)}
            label={checked ? '達成済み' : '未達成'}
            size="md"
          />
          <div className="award-detail__progress-bar-wrap">
            <ProgressBar percent={percent} color={catData.color} size="sm" label={`${percent}%`} />
          </div>
        </div>
      </header>

      {/* Tier table */}
      {award.tiers.length > 0 && (
        <section className="award-detail__section">
          <h2 className="award-detail__section-title">ティア達成条件</h2>
          <div className="award-detail__tier-table-wrap">
            <table className="award-detail__tier-table">
              <thead>
                <tr>
                  <th>ティア</th>
                  <th>目標</th>
                  {award.tiers.some((t) => t.rp) && <th>RP</th>}
                  {award.tiers.some((t) => t.cash) && <th>現金</th>}
                </tr>
              </thead>
              <tbody>
                {award.tiers.map((tier) => (
                  <tr
                    key={tier.tier}
                    className={currentTier >= tier.tier ? 'award-detail__tier-row--done' : ''}
                  >
                    <td>
                      <TierBadge tier={tier.tier} maxTier={award.tiers.length} color={catData.color} />
                    </td>
                    <td>{tier.target.toLocaleString()}</td>
                    {award.tiers.some((t) => t.rp) && (
                      <td>{tier.rp ? tier.rp.toLocaleString() : '—'}</td>
                    )}
                    {award.tiers.some((t) => t.cash) && (
                      <td>{tier.cash ? `$${tier.cash.toLocaleString()}` : '—'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Reward */}
      {(award.reward.rp > 0 || award.reward.cash > 0 || award.reward.item) && (
        <section className="award-detail__section">
          <h2 className="award-detail__section-title">最終報酬</h2>
          <ul className="award-detail__reward-list">
            {award.reward.rp > 0 && (
              <li><span className="award-detail__reward-label">RP:</span> {award.reward.rp.toLocaleString()}</li>
            )}
            {award.reward.cash > 0 && (
              <li><span className="award-detail__reward-label">現金:</span> ${award.reward.cash.toLocaleString()}</li>
            )}
            {award.reward.item && (
              <li><span className="award-detail__reward-label">アイテム:</span> {award.reward.item}</li>
            )}
          </ul>
        </section>
      )}

      {/* Guide */}
      {award.guide.summary && (
        <section className="award-detail__section">
          <h2 className="award-detail__section-title">攻略ガイド</h2>
          <p className="award-detail__guide-summary">{award.guide.summary}</p>
          {award.guide.steps.length > 0 && (
            <>
              <h3 className="award-detail__guide-subtitle">手順</h3>
              <ol className="award-detail__guide-steps">
                {award.guide.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </>
          )}
          {award.guide.tips.length > 0 && (
            <>
              <h3 className="award-detail__guide-subtitle">ヒント</h3>
              <ul className="award-detail__guide-tips">
                {award.guide.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default AwardDetail;
