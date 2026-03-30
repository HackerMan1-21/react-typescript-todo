import { useState, useCallback, useMemo } from 'react';
import { CareerMilestone, CareerProgressState } from '../types/career';

const STORAGE_KEY = 'gta-career-progress';

function loadProgress(): CareerProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CareerProgressState;
  } catch {
    // ignore
  }
  return { completedTaskIds: [], lastUpdated: new Date().toISOString() };
}

function saveProgress(state: CareerProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useCareerProgress(milestones: CareerMilestone[]) {
  const [progress, setProgress] = useState<CareerProgressState>(loadProgress);

  const toggleTask = useCallback((taskId: string) => {
    setProgress((prev) => {
      const ids = prev.completedTaskIds.includes(taskId)
        ? prev.completedTaskIds.filter((id) => id !== taskId)
        : [...prev.completedTaskIds, taskId];
      const next: CareerProgressState = {
        completedTaskIds: ids,
        lastUpdated: new Date().toISOString(),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const isTaskCompleted = useCallback(
    (taskId: string) => progress.completedTaskIds.includes(taskId),
    [progress.completedTaskIds]
  );

  const getMilestoneProgress = useCallback(
    (milestone: CareerMilestone) => {
      const completed = milestone.tasks.filter((t) =>
        progress.completedTaskIds.includes(t.id)
      ).length;
      const total = milestone.tasks.length;
      return {
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [progress.completedTaskIds]
  );

  const getCategoryProgress = useCallback(
    (category: string) => {
      const catMilestones = milestones.filter((m) => m.category === category);
      const allTasks = catMilestones.flatMap((m) => m.tasks);
      const completed = allTasks.filter((t) =>
        progress.completedTaskIds.includes(t.id)
      ).length;
      const total = allTasks.length;
      return {
        completed,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [milestones, progress.completedTaskIds]
  );

  const overallProgress = useMemo(() => {
    const allTasks = milestones.flatMap((m) => m.tasks);
    const completed = allTasks.filter((t) =>
      progress.completedTaskIds.includes(t.id)
    ).length;
    const total = allTasks.length;
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [milestones, progress.completedTaskIds]);

  const resetProgress = useCallback(() => {
    const empty: CareerProgressState = {
      completedTaskIds: [],
      lastUpdated: new Date().toISOString(),
    };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return {
    progress,
    toggleTask,
    isTaskCompleted,
    getMilestoneProgress,
    getCategoryProgress,
    overallProgress,
    resetProgress,
  };
}
