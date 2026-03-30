import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GUIDE_LIST } from '../../data/guideData';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { SEOHead } from '../../components/SEOHead/SEOHead';
import './GuideIndex.scss';

const CATEGORY_ORDER = ['基礎', 'お金稼ぎ', '強盗', 'ランク', 'ビジネス', 'ミッション', 'PvP'];

export const GuideIndex = () => {
  const grouped = useMemo(() => {
    return GUIDE_LIST.reduce<Record<string, typeof GUIDE_LIST>>((acc, guide) => {
      const cat = guide.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(guide);
      return acc;
    }, {});
  }, []);

  const orderedCategories = useMemo(() => {
    const ordered: string[] = [];
    for (const cat of CATEGORY_ORDER) {
      if (grouped[cat]) ordered.push(cat);
    }
    for (const cat of Object.keys(grouped)) {
      if (!ordered.includes(cat)) ordered.push(cat);
    }
    return ordered;
  }, [grouped]);

  return (
    <>
      <SEOHead
        title="攻略ガイド一覧"
        description="GTA Onlineの攻略ガイド一覧。お金稼ぎ・ランク上げ・強盗・ビジネス・初心者ガイドなど全カテゴリの攻略記事を掲載。"
      />
      <div className="guide-index">
        <Breadcrumb items={[{ label: 'ホーム', to: '/' }, { label: '攻略ガイド' }]} />

        <header className="guide-index__header">
          <h1 className="guide-index__title">攻略ガイド</h1>
          <p className="guide-index__subtitle">
            GTA Onlineを攻略するための完全ガイド集
          </p>
        </header>

        {orderedCategories.map((cat) => (
          <section key={cat} className="guide-index__section">
            <h2 className="guide-index__cat-heading">{cat}</h2>
            <div className="guide-index__cards">
              {grouped[cat].map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/guide/${guide.slug}`}
                  className="guide-card"
                >
                  <div className="guide-card__body">
                    <h3 className="guide-card__title">{guide.title}</h3>
                    <p className="guide-card__desc">{guide.description}</p>
                  </div>
                  <div className="guide-card__footer">
                    <span className="guide-card__cat">{guide.category}</span>
                    <time className="guide-card__date" dateTime={guide.updatedAt}>
                      更新: {guide.updatedAt}
                    </time>
                    <span className="guide-card__arrow" aria-hidden="true">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default GuideIndex;
