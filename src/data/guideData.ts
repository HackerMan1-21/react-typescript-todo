import { GuideMeta } from '../types/guide';

export const GUIDE_LIST: GuideMeta[] = [
  {
    slug: 'beginner',
    title: '初心者完全ガイド',
    description: 'GTA Onlineをこれから始める初心者向けの基礎知識を解説。キャラ作成からフリーモードの歩き方まで。',
    category: '基礎',
    updatedAt: '2026-03-30',
    relatedSlugs: ['money', 'rank'],
    sections: [
      {
        id: 'start',
        heading: 'GTAオンラインを始めよう',
        content: 'まずはキャラクターを作成し、プロローグを終える必要があります。',
      },
      {
        id: 'freemode',
        heading: 'フリーモードでやること',
        content: 'フリーモードはオープンワールドで他プレイヤーと共存する空間です。',
        note: { type: 'tip', text: '最初は人が少ないプライベートセッションで練習するのがおすすめです。' },
      },
    ],
  },
  {
    slug: 'money',
    title: 'お金稼ぎ完全ガイド',
    description: 'GTA Onlineで効率よくお金を稼ぐ方法を初心者〜上級者向けに解説。カヨ・ペリコ強盗からビジネスまで。',
    category: 'お金稼ぎ',
    updatedAt: '2026-03-30',
    relatedSlugs: ['heists', 'business'],
    sections: [
      {
        id: 'beginner-money',
        heading: '初心者向け金策',
        content: 'まずはコンタクトミッション（Simeonなど）をこなしながら資金を貯めましょう。',
        note: { type: 'tip', text: 'デイリーチャレンジは毎日$30,000以上もらえるので必ず消化しましょう。' },
      },
      {
        id: 'mid-money',
        heading: '中級者向け金策',
        content: 'CEOビジネス（車両輸出）やバイカービジネスが効率的です。',
        table: {
          headers: ['方法', '時給（目安）', '必要資金', '難易度'],
          rows: [
            ['車両輸出（CEO）', '$300,000〜', '$1,000,000', '★★☆'],
            ['バイカービジネス', '$200,000〜', '$500,000', '★★☆'],
            ['ナイトクラブ', '$50,000〜', '$1,700,000', '★☆☆'],
          ],
        },
      },
      {
        id: 'advanced-money',
        heading: '上級者向け金策',
        content: 'カヨ・ペリコ強盗が現在最高効率。単独で1時間に$1,000,000超を稼げます。',
        note: { type: 'warning', text: 'ハイストはウォームアップミッションと準備ミッションの時間も考慮に入れてください。' },
      },
    ],
  },
  {
    slug: 'heists',
    title: '強盗（ハイスト）攻略',
    description: 'GTA Onlineのハイスト全種の攻略法・報酬・エリートチャレンジ条件を解説。',
    category: '強盗',
    updatedAt: '2026-03-30',
    relatedSlugs: ['money', 'rank'],
    sections: [
      {
        id: 'heist-list',
        heading: 'ハイスト一覧',
        content: '実装済みのハイストと基本報酬の一覧です。',
        table: {
          headers: ['ハイスト名', '最大報酬', '人数', 'エリート条件'],
          rows: [
            ['カヨ・ペリコ強盗', '$1,100,000+', '1〜4人', '15分以内'],
            ['ダイヤモンドカジノ強盗', '$2,115,000', '2〜4人', '～15分以内'],
            ['エージェント強盗', '$1,200,000', '2〜4人', '～30分以内'],
            ['ダリルウェイブス強盗', '$1,900,000', '1〜4人', '～20分以内'],
          ],
        },
      },
      {
        id: 'cayo-perico',
        heading: 'カヨ・ペリコ強盗（最高効率）',
        content: '現在最もコスパの良い強盗。単独プレイ可能で繰り返し周回できます。',
        note: { type: 'info', text: 'ツールクライム（バッグ）+ 武器はアレンビー武器箱で揃えると効率UP。' },
      },
    ],
  },
  {
    slug: 'rank',
    title: 'ランク上げガイド',
    description: 'GTA OnlineでRP（評判値）を効率的に稼いでランクを上げる方法を解説。',
    category: 'ランク',
    updatedAt: '2026-03-30',
    relatedSlugs: ['money', 'beginner'],
    sections: [
      {
        id: 'rp-method',
        heading: 'RP効率の高い方法',
        content: 'RPが稼げる主な活動の一覧です。',
        table: {
          headers: ['活動', 'RP（目安）', '時間', 'メモ'],
          rows: [
            ['デスマッチ（勝利）', '4,000〜', '10〜15分', 'チーム戦が安定'],
            ['レース（1位）', '6,000〜', '5〜10分', '人数が多いほど増加'],
            ['フリーモードイベント', '3,000〜', '〜5分', '毎時発生'],
            ['ハイスト完了', '50,000+', '30〜60分', 'エリートボーナスで倍増'],
          ],
        },
        note: { type: 'tip', text: 'RPボーナスウィーク中は特定のアクティビティでRPが2〜3倍になります。' },
      },
    ],
  },
  {
    slug: 'business',
    title: 'ビジネス攻略ガイド',
    description: 'GTA OnlineのCEOビジネス・バイカービジネス・ナイトクラブ等の効率的な運営方法を解説。',
    category: 'ビジネス',
    updatedAt: '2026-03-30',
    relatedSlugs: ['money', 'heists'],
    sections: [
      {
        id: 'ceo',
        heading: 'CEOビジネス（車両輸出）',
        content: 'Maze Bank Forecourtのオフィスを購入後、車両倉庫からハイエンド車を輸出するのが主な稼ぎ方です。',
        note: { type: 'tip', text: 'ハイエンド（最高品質）の車だけを輸出するのが最効率。' },
      },
      {
        id: 'nightclub',
        heading: 'ナイトクラブ（パッシブ収益）',
        content: 'ナイトクラブを購入し、テクニシャンを各ビジネスに配置することでログアウト中も収益が発生します。',
        note: { type: 'info', text: '最大蓄積額は$2,100,000（満タンになったら売却しましょう）。' },
      },
    ],
  },
  {
    slug: 'pvp',
    title: 'PvP・対戦ガイド',
    description: 'GTA Onlineのデスマッチ・レース・コンテンドなど対戦モードの攻略と基本的な立ち回りを解説。',
    category: 'PvP',
    updatedAt: '2026-03-30',
    relatedSlugs: ['rank'],
    sections: [
      {
        id: 'pvp-basics',
        heading: 'フリーモードでの護身術',
        content: '攻撃的なプレイヤーからの身の守り方を解説します。',
        note: { type: 'warning', text: '挑発されてもリポーン地点に近づかず、建物や地形を活用しましょう。' },
      },
    ],
  },
  {
    slug: 'missions',
    title: 'ミッション攻略',
    description: 'GTA Onlineのコンタクトミッション・フリーモードミッションをカテゴリ別・効率別に解説。',
    category: 'ミッション',
    updatedAt: '2026-03-30',
    relatedSlugs: ['money', 'rank'],
    sections: [
      {
        id: 'contact-missions',
        heading: 'コンタクトミッション一覧',
        content: '各コンタクトから依頼できるミッションの報酬と難易度です。',
        note: { type: 'tip', text: 'Simeon・Lesterのミッションは報酬とRPのバランスが優秀です。' },
      },
    ],
  },
];
