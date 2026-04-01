export type AwardTier = {
  tier: number;
  target: number;
  rp?: number;
  cash?: number;
};

export type AwardGuide = {
  summary: string;
  steps: string[];
  tips: string[];
};

export type AwardMedia = {
  images: string[];
  videos: string[];
};

export type AwardSEO = {
  keywords: string[];
  description: string;
};

export type Award = {
  id: string;
  name: string;
  description: string;
  requirement: {
    type: 'count' | 'unique' | 'cumulative' | 'single';
    target: number;
  };
  progressMax: number;
  reward: {
    rp: number;
    cash: number;
    item: string | null;
  };
  tiers: AwardTier[];
  guide: AwardGuide;
  media: AwardMedia;
  seo: AwardSEO;
};

export type AwardCategory = {
  category: string;
  label: string;
  icon: string;
  color: string;
  awards: Award[];
};

export type AwardCategoryKey =
  | 'wins'
  | 'general'
  | 'crime'
  | 'vehicles'
  | 'combat'
  | 'weapons'
  | 'heists'
  | 'doomsday'
  | 'nightclub'
  | 'arena-wars'
  | 'casino'
  | 'casino-heist'
  | 'summer-special'
  | 'cayo-perico'
  | 'ls-tuners'
  | 'the-contract'
  | 'drug-wars'
  | 'chop-shop'
  | 'bottom-dollar'
  | 'agents-of-sabotage'
  | 'money-fronts'
  | 'knoway'
  | 'rewards';
