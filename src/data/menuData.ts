export type MenuItem = {
  label: string;
  to?: string;
  children?: MenuItem[];
  icon?: string;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'ホーム',
    to: '/',
    icon: '🏠',
  },
  {
    label: '車両図鑑',
    icon: '🚗',
    children: [
      { label: 'スーパーカー', to: '/cars/supercar' },
      { label: 'スポーツカー', to: '/cars/sports' },
      { label: 'マッスルカー', to: '/cars/muscle' },
      { label: 'SUV', to: '/cars/suv' },
      { label: 'バイク', to: '/cars/motorcycle' },
      { label: '航空機', to: '/cars/aircraft' },
      { label: '船舶', to: '/cars/boat' },
      { label: '全車両一覧', to: '/' },
    ],
  },
  {
    label: '攻略ガイド',
    icon: '📖',
    children: [
      { label: 'お金稼ぎ', to: '/guide/money' },
      { label: 'ミッション攻略', to: '/guide/missions' },
      { label: 'ランク上げ', to: '/guide/rank' },
      { label: '強盗（ハイスト）', to: '/guide/heists' },
      { label: 'ビジネス', to: '/guide/business' },
      { label: 'PvP/対戦', to: '/guide/pvp' },
      { label: '初心者ガイド', to: '/guide/beginner' },
      { label: '攻略一覧', to: '/guide' },
    ],
  },
  {
    label: 'キャリア進行',
    to: '/career',
    icon: '🏆',
  },
];
