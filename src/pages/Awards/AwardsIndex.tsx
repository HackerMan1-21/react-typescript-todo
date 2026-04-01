import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AwardCategory } from '../../types/award';
import { useGlobalProgress } from '../../hooks/useGlobalProgress';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
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
import './AwardsIndex.scss';

const ALL_CATEGORIES: AwardCategory[] = [
  winsData as AwardCategory,
  generalData as AwardCategory,
  crimeData as AwardCategory,
  vehiclesData as AwardCategory,
  combatData as AwardCategory,
  weaponsData as AwardCategory,
  heistsData as AwardCategory,
  doomsdayData as AwardCategory,
  nightclubData as AwardCategory,
  arenaWarsData as AwardCategory,
  casinoData as AwardCategory,
  casinoHeistData as AwardCategory,
  summerSpecialData as AwardCategory,
  cayoPericoData as AwardCategory,
  lsTunersData as AwardCategory,
  theContractData as AwardCategory,
  drugWarsData as AwardCategory,
  chopShopData as AwardCategory,
  bottomDollarData as AwardCategory,
  agentsOfSabotageData as AwardCategory,
  moneyFrontsData as AwardCategory,
  knowayData as AwardCategory,
  rewardsData as AwardCategory,
];

function setMetaDescription(content: string) {
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = content;
}

const AwardsIndex = () => {
  const { getAwardProgress, isAwardChecked } = useGlobalProgress();

  useEffect(() => {
    document.title = 'アワード一覧 | GTA Online 攻略図鑑';
    setMetaDescription(
      'GTA Online の全アワードカテゴリ一覧。強盗・戦闘・車両・ビジネス・フリーモード・ミッション・レースの攻略チェックリストを管理できます。'
    );
  }, []);

  const categoryStats = useMemo(
    () =>
      ALL_CATEGORIES.map((cat) => {
        const total = cat.awards.length;
        const done = cat.awards.filter((a) => isAwardChecked(a.id)).length;
        return { ...cat, total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAwardProgress, isAwardChecked]
  );

  const totalAll = categoryStats.reduce((s, c) => s + c.total, 0);
  const doneAll = categoryStats.reduce((s, c) => s + c.done, 0);
  const percentAll = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  return (
    <div className="awards-index">
      <header className="awards-index__header">
        <h1 className="awards-index__title">アワード</h1>
        <p className="awards-index__subtitle">
          全カテゴリのアワードを攻略して実績を解除しよう。
        </p>
        <div className="awards-index__total-bar">
          <span className="awards-index__total-label">
            総合達成率 {doneAll} / {totalAll}
          </span>
          <ProgressBar percent={percentAll} color="#ff9500" size="md" label={`${percentAll}%`} />
        </div>
      </header>

      <ul className="awards-index__grid">
        {categoryStats.map((cat) => (
          <li key={cat.category}>
            <Link
              to={`/awards/${cat.category}`}
              className="awards-index__card"
              style={{ '--cat-color': cat.color } as React.CSSProperties}
            >
              <span className="awards-index__icon">{cat.icon}</span>
              <div className="awards-index__card-body">
                <span className="awards-index__label">{cat.label}</span>
                <span className="awards-index__count">
                  {cat.done} / {cat.total}
                </span>
                <div className="awards-index__mini-bar">
                  <div
                    className="awards-index__mini-fill"
                    style={{ width: `${cat.percent}%`, background: cat.color }}
                  />
                </div>
              </div>
              <span className="awards-index__arrow">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AwardsIndex;
