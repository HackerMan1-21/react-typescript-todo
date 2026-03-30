import { useState, useMemo } from 'react';
import { CAREER_CATEGORIES, CAREER_MILESTONES } from '../../data/careerData';
import { CareerCategory } from '../../types/career';
import { useCareerProgress } from '../../hooks/useCareerProgress';
import { CareerCard } from '../../components/CareerCard/CareerCard';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb';
import { SEOHead } from '../../components/SEOHead/SEOHead';
import './Career.scss';

export const Career = () => {
  const [activeCategory, setActiveCategory] = useState<CareerCategory | 'all'>('all');
  const {
    toggleTask,
    isTaskCompleted,
    getMilestoneProgress,
    getCategoryProgress,
    overallProgress,
    resetProgress,
  } = useCareerProgress(CAREER_MILESTONES);

  const filteredMilestones = useMemo(
    () =>
      activeCategory === 'all'
        ? CAREER_MILESTONES
        : CAREER_MILESTONES.filter((m) => m.category === activeCategory),
    [activeCategory]
  );

  const handleReset = () => {
    if (window.confirm('進行状況をリセットしますか？この操作は取り消せません。')) {
      resetProgress();
    }
  };

  return (
    <>
      <SEOHead
        title="キャリア進行"
        description="GTA Onlineのキャリア進行状況を管理。犯罪・ビジネス・レース・強盗など全カテゴリの達成状況をチェックボックスで管理できます。"
      />
      <div className="career">
        <Breadcrumb
          items={[{ label: 'ホーム', to: '/' }, { label: 'キャリア進行' }]}
        />

        {/* ヘッダー */}
        <header className="career__header">
          <h1 className="career__title">キャリア進行</h1>
          <p className="career__subtitle">
            GTAオンラインの進行状況を管理しよう
          </p>
          <div className="career__overall">
            <ProgressBar
              percent={overallProgress.percent}
              label={`全体: ${overallProgress.completed} / ${overallProgress.total} (${overallProgress.percent}%)`}
              size="md"
            />
          </div>
          <button
            className="career__reset"
            onClick={handleReset}
            title="進行状況をリセット"
          >
            リセット
          </button>
        </header>

        {/* カテゴリフィルター */}
        <nav className="career__filters" aria-label="カテゴリフィルター">
          <button
            className={`career__filter${activeCategory === 'all' ? ' career__filter--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span>すべて</span>
            <span className="career__filter-pct">{overallProgress.percent}%</span>
          </button>
          {CAREER_CATEGORIES.map((cat) => {
            const prog = getCategoryProgress(cat.key);
            return (
              <button
                key={cat.key}
                className={`career__filter${activeCategory === cat.key ? ' career__filter--active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                style={{ '--filter-color': cat.color } as React.CSSProperties}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="career__filter-pct">{prog.percent}%</span>
              </button>
            );
          })}
        </nav>

        {/* グリッド */}
        <div className="career__grid">
          {filteredMilestones.map((m) => {
            const cat = CAREER_CATEGORIES.find((c) => c.key === m.category)!;
            return (
              <CareerCard
                key={m.id}
                milestone={m}
                progress={getMilestoneProgress(m)}
                categoryColor={cat.color}
                isTaskCompleted={isTaskCompleted}
                onToggleTask={toggleTask}
              />
            );
          })}
        </div>

        {filteredMilestones.length === 0 && (
          <p className="career__empty">該当するマイルストーンがありません。</p>
        )}
      </div>
    </>
  );
};

export default Career;
