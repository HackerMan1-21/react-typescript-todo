export type ItemProgress = {
  checked: boolean;
  progress: number;
  currentTier: number;
  updatedAt: string;
};

export type GlobalProgressState = {
  awards: Record<string, ItemProgress>;
  cars: Record<string, { owned: boolean }>;
  career: Record<string, { checked: boolean }>;
};
