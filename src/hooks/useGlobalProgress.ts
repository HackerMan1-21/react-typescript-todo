import { useCallback, useMemo } from 'react';
import { GlobalProgressState, ItemProgress } from '../types/progress';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'gta-global-progress';

const DEFAULT_STATE: GlobalProgressState = {
  awards: {},
  cars: {},
  career: {},
};

const DEFAULT_PROGRESS: ItemProgress = {
  checked: false,
  progress: 0,
  currentTier: 1,
  updatedAt: '',
};

export function useGlobalProgress() {
  const [state, setState] = useLocalStorage<GlobalProgressState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  // ── Awards ──
  const toggleAward = useCallback(
    (awardId: string) => {
      setState((prev) => {
        const current = prev.awards[awardId] ?? { ...DEFAULT_PROGRESS };
        return {
          ...prev,
          awards: {
            ...prev.awards,
            [awardId]: {
              ...current,
              checked: !current.checked,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [setState]
  );

  const updateAwardProgress = useCallback(
    (awardId: string, progress: number, currentTier: number) => {
      setState((prev) => {
        const current = prev.awards[awardId] ?? { ...DEFAULT_PROGRESS };
        return {
          ...prev,
          awards: {
            ...prev.awards,
            [awardId]: {
              ...current,
              progress,
              currentTier,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [setState]
  );

  const isAwardChecked = useCallback(
    (awardId: string) => state.awards[awardId]?.checked ?? false,
    [state.awards]
  );

  const getAwardProgress = useCallback(
    (awardId: string): ItemProgress =>
      state.awards[awardId] ?? { ...DEFAULT_PROGRESS },
    [state.awards]
  );

  // ── Cars ──
  const toggleCar = useCallback(
    (carId: string) => {
      setState((prev) => ({
        ...prev,
        cars: {
          ...prev.cars,
          [carId]: { owned: !(prev.cars[carId]?.owned ?? false) },
        },
      }));
    },
    [setState]
  );

  const isCarOwned = useCallback(
    (carId: string) => state.cars[carId]?.owned ?? false,
    [state.cars]
  );

  // ── Career ──
  const toggleCareer = useCallback(
    (taskId: string) => {
      setState((prev) => ({
        ...prev,
        career: {
          ...prev.career,
          [taskId]: { checked: !(prev.career[taskId]?.checked ?? false) },
        },
      }));
    },
    [setState]
  );

  const isCareerChecked = useCallback(
    (taskId: string) => state.career[taskId]?.checked ?? false,
    [state.career]
  );

  // ── Stats ──
  const awardStats = useMemo(() => {
    const entries = Object.values(state.awards);
    const total = entries.length;
    const checked = entries.filter((e) => e.checked).length;
    return { total, checked, percent: total > 0 ? Math.round((checked / total) * 100) : 0 };
  }, [state.awards]);

  const carStats = useMemo(() => {
    const entries = Object.values(state.cars);
    const total = entries.length;
    const owned = entries.filter((e) => e.owned).length;
    return { total, owned, percent: total > 0 ? Math.round((owned / total) * 100) : 0 };
  }, [state.cars]);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, [setState]);

  return {
    state,
    toggleAward,
    updateAwardProgress,
    isAwardChecked,
    getAwardProgress,
    toggleCar,
    isCarOwned,
    toggleCareer,
    isCareerChecked,
    awardStats,
    carStats,
    resetAll,
  };
}
