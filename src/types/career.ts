export type CareerTask = {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
};

export type CareerCategory =
  | 'crime'
  | 'business'
  | 'racing'
  | 'heist'
  | 'freemode'
  | 'social'
  | 'collection';

export type CareerMilestone = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: CareerCategory;
  tasks: CareerTask[];
  reward?: string;
  unlockCondition?: string;
  isLocked: boolean;
  requiredMilestoneIds?: string[];
};

export type CareerCategoryMeta = {
  key: CareerCategory;
  label: string;
  icon: string;
  color: string;
};

export type CareerProgressState = {
  completedTaskIds: string[];
  lastUpdated: string;
};
