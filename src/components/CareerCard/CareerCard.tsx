import { CareerMilestone } from '../../types/career';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './CareerCard.scss';

type MilestoneProgress = {
  completed: number;
  total: number;
  percent: number;
};

type Props = {
  milestone: CareerMilestone;
  progress: MilestoneProgress;
  categoryColor: string;
  isTaskCompleted: (taskId: string) => boolean;
  onToggleTask: (taskId: string) => void;
};

export const CareerCard = ({
  milestone,
  progress,
  categoryColor,
  isTaskCompleted,
  onToggleTask,
}: Props) => {
  const isComplete = progress.percent === 100;
  const locked = milestone.isLocked;

  return (
    <article
      className={[
        'career-card',
        isComplete ? 'career-card--complete' : '',
        locked ? 'career-card--locked' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--accent': categoryColor } as React.CSSProperties}
    >
      {/* サムネイル */}
      <div className="career-card__thumb">
        {milestone.imageUrl ? (
          <img
            src={milestone.imageUrl}
            alt={milestone.title}
            loading="lazy"
            className="career-card__img"
          />
        ) : (
          <div className="career-card__img-placeholder" aria-hidden="true" />
        )}
        {isComplete && (
          <span className="career-card__badge">✓ 完了</span>
        )}
        {locked && (
          <div className="career-card__lock-overlay">
            <span className="career-card__lock-icon" aria-label="ロック中">🔒</span>
          </div>
        )}
      </div>

      {/* ボディ */}
      <div className="career-card__body">
        <h3 className="career-card__title">{milestone.title}</h3>
        <p className="career-card__desc">{milestone.description}</p>

        {milestone.unlockCondition && (
          <span className="career-card__condition">
            🔓 {milestone.unlockCondition}
          </span>
        )}

        {/* プログレスバー */}
        <ProgressBar
          percent={progress.percent}
          label={`${progress.completed} / ${progress.total}`}
          color={categoryColor}
          size="sm"
        />

        {/* タスクリスト */}
        {!locked && (
          <ul className="career-card__tasks">
            {milestone.tasks.map((task) => {
              const done = isTaskCompleted(task.id);
              return (
                <li key={task.id} className="career-card__task">
                  <label
                    className={`career-card__check${done ? ' career-card__check--done' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggleTask(task.id)}
                    />
                    <span>{task.title}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {/* 報酬 */}
        {milestone.reward && (
          <div className="career-card__reward">
            🎁 報酬: {milestone.reward}
          </div>
        )}
      </div>
    </article>
  );
};
