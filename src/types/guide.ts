export type GuideSection = {
  id: string;
  heading: string;
  content: string;
  image?: string;
  note?: {
    type: 'tip' | 'warning' | 'info';
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  sections: GuideSection[];
  relatedSlugs?: string[];
};
