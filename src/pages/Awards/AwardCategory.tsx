import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AwardCategory as AwardCategoryType } from '../../types/award';
import { AwardCard } from '../../components/AwardCard/AwardCard';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { useGlobalProgress } from '../../hooks/useGlobalProgress';
import heistsData from '../../data/awards/heists.json';
import combatData from '../../data/awards/combat.json';
import vehiclesData from '../../data/awards/vehicles.json';
import businessData from '../../data/awards/business.json';
import freemodeData from '../../data/awards/freemode.json';
import jobsData from '../../data/awards/jobs.json';
import racingData from '../../data/awards/racing.json';
import './AwardCategory.scss';

const CATEGORY_MAP: Record<string, AwardCategoryType> = {
  heists: heistsData as AwardCategoryType,
  combat: combatData as AwardCategoryType,
  vehicles: vehiclesData as AwardCategoryType,
  business: businessData as AwardCategoryType,
  freemode: freemodeData as AwardCategoryType,
  jobs: jobsData as AwardCategoryType,
  racing: racingData as AwardCategoryType,
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

const AwardCategory = () => {
  const { category } = useParams<{ category: string }>();
  const catData = category ? CATEGORY_MAP[category] : undefined;
  const { getAwardProgress, isAwardChecked, toggleAward } = useGlobalProgress();

  useEffect(() => {
    if (!catData) return;
    document.title = `${catData.label}アワード | GTA Online 攻略図鑑`;
    setMetaDescription(`GTA Online ${catData.label}カテゴリのアワード一覧。攻略チェックリストで達成状況を管理しよう。`);
  }, [catData]);

  const stats = useMemo(() => {
    if (!catData) return { done: 0, total: 0, percent: 0 };
    const total = catData.awards.length;
    const done = catData.awards.filter((a) => isAwardChecked(a.id)).length;
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catData, getAwardProgress, isAwardChecked]);

  if (!catData) return <Navigate to="/awards" replace />;

  return (
    <div className="award-category">
      <header
        className="award-category__header"
        style={{ '--cat-color': catData.color } as React.CSSProperties}
      >
        <nav className="award-category__breadcrumb">
          <Link to="/awards">アワード</Link>
          <span> › </span>
          <span>{catData.label}</span>
        </nav>
        <div className="award-category__title-row">
          <span className="award-category__icon">{catData.icon}</span>
          <h1 className="award-category__title">{catData.label}</h1>
        </div>
        <div className="award-category__progress-wrap">
          <span className="award-category__count">
            達成済み {stats.done} / {stats.total}
          </span>
          <ProgressBar
            percent={stats.percent}
            color={catData.color}
            size="sm"
            label={`${stats.percent}%`}
          />
        </div>
      </header>

      <ul className="award-category__list">
        {catData.awards.map((award) => (
          <li key={award.id}>
            <AwardCard
              award={award}
              categorySlug={catData.category}
              categoryColor={catData.color}
              progress={getAwardProgress(award.id)}
              onToggle={() => toggleAward(award.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AwardCategory;
