import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AwardCategory as AwardCategoryType } from '../../types/award';
import { AwardCard } from '../../components/AwardCard/AwardCard';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { useGlobalProgress } from '../../hooks/useGlobalProgress';
import winsData from '../../data/awards/wins.json';
import generalData from '../../data/awards/general.json';
import crimeData from '../../data/awards/crime.json';
import vehiclesData from '../../data/awards/vehicles.json';
import combatData from '../../data/awards/combat.json';
import weaponsData from '../../data/awards/weapons.json';
import heistsData from '../../data/awards/heists.json';
import doomsdayData from '../../data/awards/doomsday.json';
import nightclubData from '../../data/awards/nightclub.json';
import arenaWarsData from '../../data/awards/arena-wars.json';
import casinoData from '../../data/awards/casino.json';
import casinoHeistData from '../../data/awards/casino-heist.json';
import summerSpecialData from '../../data/awards/summer-special.json';
import cayoPericoData from '../../data/awards/cayo-perico.json';
import lsTunersData from '../../data/awards/ls-tuners.json';
import theContractData from '../../data/awards/the-contract.json';
import drugWarsData from '../../data/awards/drug-wars.json';
import chopShopData from '../../data/awards/chop-shop.json';
import bottomDollarData from '../../data/awards/bottom-dollar.json';
import agentsOfSabotageData from '../../data/awards/agents-of-sabotage.json';
import moneyFrontsData from '../../data/awards/money-fronts.json';
import knowayData from '../../data/awards/knoway.json';
import rewardsData from '../../data/awards/rewards.json';
import './AwardCategory.scss';

const CATEGORY_MAP: Record<string, AwardCategoryType> = {
  wins: winsData as AwardCategoryType,
  general: generalData as AwardCategoryType,
  crime: crimeData as AwardCategoryType,
  vehicles: vehiclesData as AwardCategoryType,
  combat: combatData as AwardCategoryType,
  weapons: weaponsData as AwardCategoryType,
  heists: heistsData as AwardCategoryType,
  doomsday: doomsdayData as AwardCategoryType,
  nightclub: nightclubData as AwardCategoryType,
  'arena-wars': arenaWarsData as AwardCategoryType,
  casino: casinoData as AwardCategoryType,
  'casino-heist': casinoHeistData as AwardCategoryType,
  'summer-special': summerSpecialData as AwardCategoryType,
  'cayo-perico': cayoPericoData as AwardCategoryType,
  'ls-tuners': lsTunersData as AwardCategoryType,
  'the-contract': theContractData as AwardCategoryType,
  'drug-wars': drugWarsData as AwardCategoryType,
  'chop-shop': chopShopData as AwardCategoryType,
  'bottom-dollar': bottomDollarData as AwardCategoryType,
  'agents-of-sabotage': agentsOfSabotageData as AwardCategoryType,
  'money-fronts': moneyFrontsData as AwardCategoryType,
  knoway: knowayData as AwardCategoryType,
  rewards: rewardsData as AwardCategoryType,
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
