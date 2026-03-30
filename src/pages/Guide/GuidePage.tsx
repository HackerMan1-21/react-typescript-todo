import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { GUIDE_LIST } from '../../data/guideData';
import { GuideSection } from '../../components/GuideSection/GuideSection';
import { NoteBox } from '../../components/NoteBox/NoteBox';
import { ComparisonTable } from '../../components/ComparisonTable/ComparisonTable';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { SEOHead } from '../../components/SEOHead/SEOHead';
import { createArticleLD } from '../../utils/seo';
import { Link } from 'react-router-dom';
import './GuidePage.scss';

export const GuidePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const guide = useMemo(
    () => GUIDE_LIST.find((g) => g.slug === slug),
    [slug]
  );

  const relatedGuides = useMemo(
    () => (guide ? GUIDE_LIST.filter((g) => guide.relatedSlugs?.includes(g.slug)) : []),
    [guide]
  );

  if (!guide) return <Navigate to="/guide" replace />;

  return (
    <>
      <SEOHead
        title={guide.title}
        description={guide.description}
        type="article"
        structuredData={createArticleLD({
          title: guide.title,
          description: guide.description,
          url: `https://example.com/guide/${guide.slug}`,
          dateModified: guide.updatedAt,
        })}
      />
      <div className="guide-page">
        <Breadcrumb
          items={[
            { label: 'ホーム', to: '/' },
            { label: '攻略ガイド', to: '/guide' },
            { label: guide.title },
          ]}
        />

        {/* ヘッダー */}
        <header className="guide-page__header">
          <span className="guide-page__cat">{guide.category}</span>
          <h1 className="guide-page__title">{guide.title}</h1>
          <p className="guide-page__desc">{guide.description}</p>
          <time className="guide-page__date" dateTime={guide.updatedAt}>
            最終更新: {guide.updatedAt}
          </time>
        </header>

        {/* 目次 */}
        {guide.sections.length > 1 && (
          <nav className="guide-page__toc" aria-label="目次">
            <h2 className="guide-page__toc-heading">目次</h2>
            <ol className="guide-page__toc-list">
              {guide.sections.map((sec, i) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="guide-page__toc-link">
                    {i + 1}. {sec.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* 本文 */}
        <div className="guide-page__body">
          {guide.sections.map((sec) => (
            <GuideSection key={sec.id} id={sec.id} heading={sec.heading}>
              {sec.content && <p>{sec.content}</p>}
              {sec.note && (
                <NoteBox type={sec.note.type}>{sec.note.text}</NoteBox>
              )}
              {sec.table && (
                <ComparisonTable
                  headers={sec.table.headers}
                  rows={sec.table.rows}
                />
              )}
            </GuideSection>
          ))}
        </div>

        {/* 関連記事 */}
        {relatedGuides.length > 0 && (
          <aside className="guide-page__related">
            <h2 className="guide-page__related-heading">関連記事</h2>
            <div className="guide-page__related-links">
              {relatedGuides.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guide/${g.slug}`}
                  className="guide-page__related-link"
                >
                  <span className="guide-page__related-cat">{g.category}</span>
                  <span>{g.title}</span>
                  <span aria-hidden="true">›</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default GuidePage;
