# Code Citations

## License: 不明
https://github.com/miracle-klaytn-hackathon/author-marketplace/blob/e5f1cef384112211ba9f0b304e372af62b117dca/src/hooks/useLocalStorage.ts

```
十分なコンテキストが得られました。以下に、要件に基づいた完全な設計と実装計画をまとめます。

---

# 🔥 完全攻略サイト化 — 実装設計書

## 1. ディレクトリ構造（追加分）

```
src/
  types/
    award.ts          ← NEW: アワード型定義
    progress.ts       ← NEW: 統合チェック状態の型
  data/
    awards/
      heists.json     ← NEW: 強盗アワード
      combat.json     ← NEW: 戦闘アワード
      vehicles.json   ← NEW: 車両アワード
      business.json   ← NEW: ビジネスアワード
      freemode.json   ← NEW: フリーモードアワード
      jobs.json       ← NEW: ミッションアワード
      racing.json     ← NEW: レースアワード
  hooks/
    useLocalStorage.ts       ← NEW: 汎用localStorage
    useGlobalProgress.ts     ← NEW: 全ページ統合チェック
  components/
    TierBadge/
      TierBadge.tsx/.scss    ← NEW
    CheckToggle/
      CheckToggle.tsx/.scss  ← NEW
    AwardCard/
      AwardCard.tsx/.scss    ← NEW
    VideoEmbed/
      VideoEmbed.tsx/.scss   ← NEW
    RewardCard/
      RewardCard.tsx/.scss   ← NEW
    ImageBlock/
      ImageBlock.tsx/.scss   ← NEW
  pages/
    Awards/
      AwardsIndex.tsx/.scss  ← NEW: /awards/
      AwardCategory.tsx/.scss← NEW: /awards/:category
      AwardDetail.tsx/.scss  ← NEW: /awards/:category/:id
```

---

## 2. 型定義

### `src/types/award.ts`

```typescript
export type AwardTier = {
  tier: number;       // 1〜4
  target: number;     // 達成に必要な回数
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
  videos: string[];   // YouTube video ID
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
  | 'heists'
  | 'combat'
  | 'vehicles'
  | 'business'
  | 'freemode'
  | 'jobs'
  | 'racing';
```

### `src/types/progress.ts`

```typescript
export type ItemProgress = {
  checked: boolean;
  progress: number;     // 現在の進行値
  currentTier: number;  // 現在のティア（1〜4）
  updatedAt: string;
};

export type GlobalProgressState = {
  awards: Record<string, ItemProgress>;
  cars: Record<string, { owned: boolean }>;
  career: Record<string, { checked: boolean }>;
};
```

---

## 3. 全アワードJSONデータ（GTA Online 実データ）

### `data/awards/heists.json`

```json
{
  "category": "heists",
  "label": "強盗",
  "icon": "💰",
  "color": "#f59e0b",
  "awards": [
    {
      "id": "heist_001",
      "name": "初めての強盗",
      "description": "強盗ミッションを初めてクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 1000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 1000 },
        { "tier": 2, "target": 5, "rp": 2500 },
        { "tier": 3, "target": 15, "rp": 5000 },
        { "tier": 4, "target": 50, "rp": 10000, "cash": 50000 }
      ],
      "guide": {
        "summary": "フレイヤの強盗がソロ対応で最も効率的。カヨ・ペリコは1周15分で完走可能。",
        "steps": [
          "コスタ・デル・ソル潜水艦を購入（$2,200,000）",
          "ミニマップ「H」アイコンで偵察ミッション開始",
          "排水トンネル侵入→地下金庫→メイン戦利品回収",
          "崖からダイブ→泳いで離脱"
        ],
        "tips": [
          "ハードモードは報酬+10%。偵察直後にファイナルを始めるとハードが選択可能",
          "排水トンネル経由ならステルス失敗しにくい",
          "ピンクダイヤ＋金塊が最高報酬パターン"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 強盗", "カヨペリコ 攻略", "ハイスト 初心者"],
        "description": "GTA Online 初心者向け強盗ミッション攻略。カヨ・ペリコ強盗のソロクリア方法を解説。"
      }
    },
    {
      "id": "heist_002",
      "name": "プロの強盗犯",
      "description": "強盗ミッションで合計$1,000,000を獲得する",
      "requirement": { "type": "cumulative", "target": 1000000 },
      "progressMax": 10000000,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1000000, "rp": 5000 },
        { "tier": 2, "target": 5000000, "rp": 10000 },
        { "tier": 3, "target": 10000000, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "カヨ・ペリコとダイヤモンドカジノ強盗のローテーションが最効率。",
        "steps": [
          "カヨ・ペリコ：ソロで$1.2M〜$1.8M/周",
          "ダイヤモンドカジノ：2人で$1.5M〜$2.5M/周",
          "ドゥースウェイ強盗：3人推奨で$1.8M〜$3M/周",
          "クールダウン中は他の強盗をサブで回す"
        ],
        "tips": [
          "週2ボーナスを常にチェック",
          "エリートチャレンジで追加ボーナス",
          "フレンド2人以上で取り分最大化"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 金稼ぎ", "強盗 効率", "1000万ドル"],
        "description": "GTA Online 強盗で$10,000,000を効率的に稼ぐ方法。カヨ・ペリコとカジノ強盗のローテーション戦略。"
      }
    },
    {
      "id": "heist_003",
      "name": "エリートチャレンジャー",
      "description": "強盗でエリートチャレンジを達成する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 25,
      "reward": { "rp": 3000, "cash": 0, "item": "エリートバッジ" },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 3000 },
        { "tier": 2, "target": 5, "rp": 6000 },
        { "tier": 3, "target": 15, "rp": 12000 },
        { "tier": 4, "target": 25, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "カヨ・ペリコのエリートチャレンジが最も容易。15分以内・ノーダメージ・全戦利品が条件。",
        "steps": [
          "排水トンネル侵入ルートを選択",
          "地下→エレベーター→金庫直行",
          "メイン戦利品+副戦利品を効率回収",
          "正面ゲートではなく崖ダイブで離脱"
        ],
        "tips": [
          "ストーンハチェットだけで地下をクリア可能",
          "マップを暗記すれば12分台で完走可能",
          "副戦利品は金の延べ棒を優先"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["エリートチャレンジ", "カヨペリコ 15分", "ノーダメージ"],
        "description": "GTA Online カヨ・ペリコ強盗エリートチャレンジの達成条件と攻略法。15分以内クリアのルート解説。"
      }
    },
    {
      "id": "heist_004",
      "name": "ダイヤモンドカジノマスター",
      "description": "ダイヤモンドカジノ強盗を全アプローチでクリアする",
      "requirement": { "type": "unique", "target": 3 },
      "progressMax": 3,
      "reward": { "rp": 10000, "cash": 500000, "item": "カジノ装飾品" },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 5000 },
        { "tier": 2, "target": 2, "rp": 7500 },
        { "tier": 3, "target": 3, "rp": 10000, "cash": 500000 }
      ],
      "guide": {
        "summary": "隠密・攻撃的・ペテン師の3アプローチ全てをクリアする。隠密が最も報酬効率が良い。",
        "steps": [
          "隠密アプローチ：Gruppe Sechsルートが最効率",
          "攻撃的アプローチ：下水道侵入で被ダメ軽減",
          "ペテン師アプローチ：Bugstarsの車が最速ルート",
          "各アプローチで準備ミッションを全完了"
        ],
        "tips": [
          "アーケードはラ・メサが最もカジノに近い",
          "運転手はカリム（最安）でOK、出口の車の差は小さい",
          "金庫の中身はダイヤモンドが出る週を狙う"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["カジノ強盗 全アプローチ", "隠密 攻略", "ペテン師"],
        "description": "GTA Online ダイヤモンドカジノ強盗の全3アプローチ完全攻略。隠密・攻撃的・ペテン師それぞれの最適ルートを解説。"
      }
    },
    {
      "id": "heist_005",
      "name": "ドゥームズ・デイ完遂者",
      "description": "ドゥームズ・デイ・ハイストのACT I〜IIIを全てクリアする",
      "requirement": { "type": "unique", "target": 3 },
      "progressMax": 3,
      "reward": { "rp": 15000, "cash": 750000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 5000 },
        { "tier": 2, "target": 2, "rp": 10000 },
        { "tier": 3, "target": 3, "rp": 15000, "cash": 750000 }
      ],
      "guide": {
        "summary": "ACT III（ドゥームズデイ・シナリオ）が最難関。2人プレイ推奨。",
        "steps": [
          "ACT I データ侵害：サーバーファーム潜入→ハッキング",
          "ACT II ボグダン問題：潜水艦→アベンジャー奪取",
          "ACT III ドゥームズデイ：サイロ潜入→ハッキング→脱出",
          "各ACTに準備ミッション（Setup）が3〜4個"
        ],
        "tips": [
          "ACT II繰り返しはパッチ済み。正攻法でクリア推奨",
          "ミニガン＋ヘビーアーマーがACT IIIの定番",
          "通信妨害は必ずハッキングパズルを練習しておく"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ドゥームズデイ 攻略", "ACT3 クリア方法", "2人 強盗"],
        "description": "GTA Online ドゥームズ・デイ強盗 ACT I〜III完全攻略。ACT III最難関のクリア方法を詳細解説。"
      }
    }
  ]
}
```

### `data/awards/combat.json`

```json
{
  "category": "combat",
  "label": "戦闘",
  "icon": "🔫",
  "color": "#ef4444",
  "awards": [
    {
      "id": "combat_001",
      "name": "ファーストブラッド",
      "description": "フリーモードで他プレイヤーを初めて倒す",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 1000,
      "reward": { "rp": 500, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 500 },
        { "tier": 2, "target": 50, "rp": 2000 },
        { "tier": 3, "target": 250, "rp": 5000 },
        { "tier": 4, "target": 1000, "rp": 15000, "cash": 100000 }
      ],
      "guide": {
        "summary": "プレイヤーキルの基本。オートエイム設定とカバーポジションが重要。",
        "steps": [
          "設定でエイムアシストを確認（自由エイム/アシスト）",
          "ヘビーリボルバーかカービンライフルMk2を準備",
          "カバーポジション（R1/RB）を活用",
          "ミニマップで敵の位置を把握"
        ],
        "tips": [
          "BST（ブルシャークテストステロン）で与ダメ倍増",
          "ヘビースナイパーMk2 + 爆発弾が最強構成",
          "パッシブモード解除してから戦うこと"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA PvP", "対人戦 コツ", "エイムアシスト"],
        "description": "GTA Online PvP対人戦の基礎。エイム設定・武器選び・立ち回りの完全ガイド。"
      }
    },
    {
      "id": "combat_002",
      "name": "マスターストライカー",
      "description": "デスマッチで累計100勝",
      "requirement": { "type": "count", "target": 100 },
      "progressMax": 100,
      "reward": { "rp": 10000, "cash": 50000, "item": "ゴールドタトゥー" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 25, "rp": 4000 },
        { "tier": 3, "target": 50, "rp": 7000 },
        { "tier": 4, "target": 100, "rp": 10000, "cash": 50000 }
      ],
      "guide": {
        "summary": "デスマッチは腕前RPで報酬が決まるため、少人数部屋で安定して勝つのが効率的。",
        "steps": [
          "クイックジョブ→デスマッチを選択",
          "マップにより最適武器が変わる。狭いマップならショットガン",
          "広いマップではヘビースナイパーが有利",
          "リスポーン位置を覚えて先読みする"
        ],
        "tips": [
          "チームデスマッチはキル数より勝利回数重視",
          "2〜4人部屋で回すのが最速",
          "週2ボーナスがデスマッチ化週を狙う"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["デスマッチ 勝つ方法", "GTA デスマッチ 攻略"],
        "description": "GTA Online デスマッチで100勝達成する攻略法。マップ別最適武器と立ち回りを解説。"
      }
    },
    {
      "id": "combat_003",
      "name": "ヘッドショットキング",
      "description": "ヘッドショットで敵を倒す",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 500,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 50, "rp": 2000 },
        { "tier": 2, "target": 150, "rp": 5000 },
        { "tier": 3, "target": 300, "rp": 10000 },
        { "tier": 4, "target": 500, "rp": 20000, "cash": 75000 }
      ],
      "guide": {
        "summary": "NPC相手でもカウントされるため、ミッション中に狙うのが効率的。",
        "steps": [
          "カービンライフルMk2にスコープを装着",
          "ミッションや強盗準備中にヘッドショットを意識",
          "「ウォーストック」関連ミッションで大量のNPCが出現",
          "ファーストパーソンモードの方がエイムしやすい場合も"
        ],
        "tips": [
          "自由エイム設定ならヘッドショット補正が入る",
          "NPCは動きが定型的なのでパターン化可能",
          "スナイパーライフルでの長距離HSもカウント対象"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ヘッドショット コツ", "GTA エイム練習"],
        "description": "GTA Online ヘッドショット500回達成のコツ。効率の良いミッションと武器設定を解説。"
      }
    },
    {
      "id": "combat_004",
      "name": "サバイバルマスター",
      "description": "サバイバルで全ウェーブをクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 5000, "cash": 30000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 3000 },
        { "tier": 2, "target": 10, "rp": 6000 },
        { "tier": 3, "target": 25, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ウェーブ10まで生存すれば$30,000。定位置で戦うのが基本。",
        "steps": [
          "クイックジョブ→サバイバルを選択（4人推奨）",
          "マップごとの防衛ポイントを確認",
          "ヘリが出る後半ウェーブはホーミングランチャー必須",
          "回復アイテム（スナック）を事前に満タンにする"
        ],
        "tips": [
          "Stab City サバイバルが最も簡単（狭い地形で囲まれにくい）",
          "フリーエイムなら報酬1.5倍",
          "弾薬は自動補充。残弾を気にせず撃つ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["サバイバル 攻略", "ウェーブ10 クリア"],
        "description": "GTA Online サバイバル全ウェーブクリア攻略。おすすめマップと防衛ポジションを解説。"
      }
    },
    {
      "id": "combat_005",
      "name": "空のエース",
      "description": "航空機でプレイヤーを撃墜する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 3000, "cash": 0, "item": "エースパイロットスーツ" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 3000 },
        { "tier": 2, "target": 50, "rp": 7000 },
        { "tier": 3, "target": 100, "rp": 15000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "レーザー戦闘機またはB-11ストライクフォースが航空戦最強。",
        "steps": [
          "レーザー：フォート・ザンクードから盗む（無料）",
          "ハイドラ：ペガサスで呼び出し→VTOLモードで垂直離着陸",
          "B-11：バラージアーマーが硬くて初心者向き",
          "チャフ対策：ミサイル頼みではなく機関砲で狙う"
        ],
        "tips": [
          "ドッグファイト時は旋回戦を意識（速度を落としてハンドリング重視）",
          "チャフ→ミサイル→チャフのサイクルが基本",
          "地上のオプレッサーMk2にはエクスプロスナイパーが有効"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 航空戦", "ドッグファイト 攻略", "レーザー 入手"],
        "description": "GTA Online 航空戦（ドッグファイト）攻略。最強戦闘機ランキングとテクニック解説。"
      }
    }
  ]
}
```

### `data/awards/vehicles.json`

```json
{
  "category": "vehicles",
  "label": "車両",
  "icon": "🏎️",
  "color": "#3b82f6",
  "awards": [
    {
      "id": "vehicle_001",
      "name": "コレクター",
      "description": "車両を所有する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 1000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 1000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 10000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "ガレージを拡張しながらコスパの良い車を集める。LS Car Meetの無料車両も忘れずに。",
        "steps": [
          "初期は無料車両（Elegy RH8等）をストックして台数を稼ぐ",
          "エグゼクティブガレージ（60台）＋オフィスガレージ（60台）で大量保管",
          "ナイトクラブガレージ（40台）も活用",
          "カジノラッキーホイールの車は毎週チェック"
        ],
        "tips": [
          "Elegy RH8はレジェンダリー・モータースポーツで無料",
          "盗んだ車もLSカスタムでトラッカーをつければ所有扱い",
          "カーミートの試乗車両はそのまま仲間と走れる"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 車 集め方", "ガレージ 拡張", "無料車両"],
        "description": "GTA Online 車200台所有の効率的な集め方。無料車両リストとガレージ拡張ガイド。"
      }
    },
    {
      "id": "vehicle_002",
      "name": "スピードデーモン",
      "description": "最高速度を記録する",
      "requirement": { "type": "cumulative", "target": 200 },
      "progressMax": 200,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 120, "rp": 1000 },
        { "tier": 2, "target": 150, "rp": 2000 },
        { "tier": 3, "target": 180, "rp": 4000 },
        { "tier": 4, "target": 200, "rp": 8000, "cash": 50000 }
      ],
      "guide": {
        "summary": "LS空港の滑走路またはハイウェイ直線区間で最高速アタック。",
        "steps": [
          "Ocelot Pariah（スポーツクラス最速136mph）をフルカスタム",
          "高速道路直線でフル加速→ニトロボタン",
          "HSW対応車なら150mph超も可能",
          "Pfister 811がスーパークラス最高速"
        ],
        "tips": [
          "HSW（ハオズスペシャルワークス）改造で最高速が大幅UP",
          "風を考慮すると北→南方向が若干有利",
          "アップヒルでは速度が落ちるので平地を選ぶ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 最高速", "最速の車", "HSW"],
        "description": "GTA Online 最高速チャレンジ攻略。最速車両ランキングとスピード記録方法。"
      }
    },
    {
      "id": "vehicle_003",
      "name": "カスタムキング",
      "description": "車両をカスタムする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": "限定カラー" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 1000 },
        { "tier": 2, "target": 25, "rp": 2500 },
        { "tier": 3, "target": 50, "rp": 5000 },
        { "tier": 4, "target": 100, "rp": 10000, "cash": 100000 }
      ],
      "guide": {
        "summary": "LS Customs・LS Car Meet・ベニーズで順次改造回数を稼ぐ。",
        "steps": [
          "LS Customsで安いパーツ変更（ホイール等）もカウント対象",
          "LS Car Meetのテストトラック使用後にカスタムショップへ",
          "ベニーズ対応車両はローライダー・スポコン系",
          "HSWカスタムはLS Car Meet Level 20以上で解放"
        ],
        "tips": [
          "リスプレーだけでもカスタム1回としてカウント",
          "カスタム回数は車じゃなくて部位変更回数",
          "クルーカラーで独自色もカウント対象"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA カスタム", "LS Customs", "ベニーズ"],
        "description": "GTA Online 車両カスタム100回達成の効率的な方法。お金をかけずにカウントを稼ぐテクニック。"
      }
    },
    {
      "id": "vehicle_004",
      "name": "バイクライフ",
      "description": "バイクで走行距離を稼ぐ",
      "requirement": { "type": "cumulative", "target": 500 },
      "progressMax": 500,
      "reward": { "rp": 3000, "cash": 0, "item": "バイカージャケット" },
      "tiers": [
        { "tier": 1, "target": 50, "rp": 1000 },
        { "tier": 2, "target": 150, "rp": 3000 },
        { "tier": 3, "target": 300, "rp": 6000 },
        { "tier": 4, "target": 500, "rp": 12000, "cash": 75000 }
      ],
      "guide": {
        "summary": "バイクビジネスの売却ミッション中に自然と距離が貯まる。",
        "steps": [
          "Bati 801RR（最速バイク）で高速道路を走る",
          "MCバイカービジネスの売却ミッションを積極的にやる",
          "フリーモードでの移動をバイクに統一",
          "バイクレースに参加して距離を稼ぐ"
        ],
        "tips": [
          "ウィリーを維持すると加速が上がる（バティ系）",
          "Shotaro/Deathbikeのトロンバイクも対象",
          "MC会長の近くにはバイクをリクエスト呼び出し可能"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA バイク 走行距離", "Bati801 最速"],
        "description": "GTA Online バイク走行距離500マイル達成法。おすすめバイクとルート。"
      }
    }
  ]
}
```

### `data/awards/business.json`

```json
{
  "category": "business",
  "label": "ビジネス",
  "icon": "💼",
  "color": "#22c55e",
  "awards": [
    {
      "id": "biz_001",
      "name": "CEO",
      "description": "CEOとしてVIPワークを完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 20, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 150000 }
      ],
      "guide": {
        "summary": "「ヘッドハンター」と「サイトシアー」の交互が最効率。1サイクル5分で$40,000。",
        "steps": [
          "SecuroServからCEOを登録",
          "VIPワーク→ヘッドハンター開始（4人のターゲット排除）",
          "完了後→サイトシアー開始（荷物3個回収）",
          "クールダウンなしで交互に回す"
        ],
        "tips": [
          "アーマードクルマ(Armored Kuruma)で敵の攻撃を無効化",
          "オプレッサーMk2なら移動が爆速",
          "ロスサントスのセッションが少人数だと敵が弱い"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["CEO VIPワーク", "ヘッドハンター 攻略", "金稼ぎ"],
        "description": "GTA Online CEOビジネス VIPワーク最効率攻略。ヘッドハンター＆サイトシアーのローテーション。"
      }
    },
    {
      "id": "biz_002",
      "name": "ナイトクラブオーナー",
      "description": "ナイトクラブで収益を得る",
      "requirement": { "type": "cumulative", "target": 1000000 },
      "progressMax": 10000000,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 100000, "rp": 2000 },
        { "tier": 2, "target": 1000000, "rp": 5000 },
        { "tier": 3, "target": 5000000, "rp": 12000 },
        { "tier": 4, "target": 10000000, "rp": 25000, "cash": 500000 }
      ],
      "guide": {
        "summary": "ナイトクラブはAFK放置で稼げる最強のパッシブビジネス。全ビジネスを紐づけて放置。",
        "steps": [
          "ナイトクラブを購入（$1,080,000〜）",
          "倉庫を最大5階まで拡張",
          "テクニシャン5人を雇用",
          "バイカー・CEO貨物・武器密造をナイトクラブに紐付け",
          "放置→満タンで売却（$1,690,000）"
        ],
        "tips": [
          "スペシャルオーダーは貨物＞薬物＞火器＞偽札＞大麻の優先度",
          "トニーの取り分は$100,000で固定上限",
          "売却はソロ1台なのでソロでOK"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ナイトクラブ 放置", "AFK稼ぎ", "パッシブ収入"],
        "description": "GTA Online ナイトクラブ完全攻略。AFK放置で最大$1,690,000を稼ぐ設定方法。"
      }
    },
    {
      "id": "biz_003",
      "name": "密造工場マスター",
      "description": "武器密造の売却を完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 0, "item": "武器MK2改造アクセス" },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 3000 },
        { "tier": 2, "target": 15, "rp": 7000 },
        { "tier": 3, "target": 30, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "バンカーはチュマシュがベスト。研究をファストトラックで全解放→売却に集中。",
        "steps": [
          "バンカーをチュマシュに購入（$1,650,000）",
          "スタッフ管理→「製造のみ」に設定",
          "補給品$75,000→満製造で売却$210,000（ロスサントス）",
          "ソロなら1/4で売却（車両1台確定）"
        ],
        "tips": [
          "チュマシュ→ロスサントスの売却が最も効率的なルート",
          "研究はMk2武器のアンロックに必要（全45件）",
          "ファストトラック研究は$225,000/件"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["バンカー 攻略", "武器密造 売却", "チュマシュ"],
        "description": "GTA Online 武器密造（バンカー）売却50回達成ガイド。チュマシュバンカーの最適運用法。"
      }
    },
    {
      "id": "biz_004",
      "name": "車両貨物ディーラー",
      "description": "車両貨物（I/E）で車両を売却する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 3000 },
        { "tier": 2, "target": 25, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "ハイエンド車のみを売却するのが最効率。32台メソッドで安定化。",
        "steps": [
          "CEO車両倉庫を購入（$1,500,000〜）",
          "スタンダード/ミッドレンジを32台溜める",
          "33台目以降は必ずハイエンドが出る",
          "ハイエンドを$100,000利益で売却"
        ],
        "tips": [
          "盗む時にダメージを受けると修理費が発生。丁寧に運転!",
          "売却時のNPCウェーブは4回。車から降りて迎撃",
          "フレンド同セッションだとNPCが湧かない"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["車両貨物 32台", "I/E 攻略", "ハイエンド"],
        "description": "GTA Online 車両貨物（I/E）100回売却攻略。32台メソッドでハイエンド確定にする方法。"
      }
    }
  ]
}
```

### `data/awards/freemode.json`

```json
{
  "category": "freemode",
  "label": "フリーモード",
  "icon": "🌍",
  "color": "#8b5cf6",
  "awards": [
    {
      "id": "free_001",
      "name": "フリーモードイベントマスター",
      "description": "フリーモードイベントで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 15, "rp": 5000 },
        { "tier": 3, "target": 30, "rp": 10000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "チェックポイント集め・キングオブザヒルが初心者でも勝ちやすい。",
        "steps": [
          "イベントは15分間隔でランダム発生",
          "チェックポイント集め：マップ上の光点にいち早く到着",
          "キングオブザヒル：拠点を維持し続ける",
          "ハンティングパック：チームプレイ重視"
        ],
        "tips": [
          "オプレッサーMk2で移動すればチェックポイント系は独壇場",
          "少人数セッションでは勝率が格段に上がる",
          "スクランブルは航空機が有利"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["フリーモード イベント 勝つ", "チェックポイント 攻略"],
        "description": "GTA Online フリーモードイベント50回優勝攻略。初心者でも勝てるイベントの選び方。"
      }
    },
    {
      "id": "free_002",
      "name": "チャレンジャー",
      "description": "フリーモードチャレンジを完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 25000, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 30, "rp": 5000 },
        { "tier": 3, "target": 60, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ドライブチャレンジ系が移動中に自然と達成できる。",
        "steps": [
          "最長ドライブ：高速道路を一方方向にひたすら走る",
          "最高速度チャレンジ：Pariah/811でハイウェイ直線",
          "最長ウィリー：Bati801でウィリー維持",
          "ニアミスチャレンジ：対向車線で逆走"
        ],
        "tips": [
          "チャレンジは参加者が少ないほど上位になりやすい",
          "一部チャレンジは特定施設が必要",
          "招待限定セッションでもチャレンジ発生する"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["フリーモードチャレンジ 一覧", "ウィリー コツ"],
        "description": "GTA Online フリーモードチャレンジ100回達成ガイド。ドライブ系チャレンジで効率的に稼ぐ方法。"
      }
    },
    {
      "id": "free_003",
      "name": "トレジャーハンター",
      "description": "隠されたアイテムを収集する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 5000, "cash": 50000, "item": "トレジャーハンターTシャツ" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 10000 },
        { "tier": 4, "target": 200, "rp": 20000, "cash": 250000 }
      ],
      "guide": {
        "summary": "アクション・フィギュア、信号ジャマー、プレイングカード等を順番に集める。",
        "steps": [
          "アクション・フィギュア100個→$150,000＋インポシブルトリニティ衣装",
          "信号ジャマー50個→$150,000＋アビ掛け電話解除",
          "プレイングカード54枚→チップ＋衣装",
          "映画小道具10個→$150,000"
        ],
        "tips": [
          "GTAWebの攻略マップを見ながら順番に回ると効率的",
          "Mk2かスパローヘリで空中移動すると最速",
          "一部はインテリア内にあるので注意"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 収集品 場所", "アクションフィギュア 全100", "信号ジャマー"],
        "description": "GTA Online 全収集品コンプリートガイド。アクション・フィギュア、信号ジャマー、カード全場所一覧。"
      }
    }
  ]
}
```

### `data/awards/jobs.json`

```json
{
  "category": "jobs",
  "label": "ミッション",
  "icon": "📋",
  "color": "#06b6d4",
  "awards": [
    {
      "id": "job_001",
      "name": "ミッションランナー",
      "description": "コンタクトミッションをクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 12000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "「ブロウアップ」「ルーフトップランブル」が4分で完了し最効率。",
        "steps": [
          "ジョブ→ロックスター作成→コンタクトミッションから選択",
          "マーティンの「ルーフトップランブル」：直行して全員排除（3〜4分）",
          "シモンの「ブロウアップ」：ディーラーの車を爆破（2〜3分）",
          "難易度ハードで報酬1.5倍"
        ],
        "tips": [
          "4分以上かけると報酬が増える仕様（時間報酬制）",
          "最適は4分ちょうどで完了→次のミッション開始",
          "招待限定セッションからでも開始可能"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["コンタクトミッション 効率", "ルーフトップランブル", "金稼ぎ ソロ"],
        "description": "GTA Online コンタクトミッション200回攻略。最速効率のミッションランキングと稼ぎ方。"
      }
    },
    {
      "id": "job_002",
      "name": "ラストチームスタンディング",
      "description": "LTSで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 30000, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 15, "rp": 5000 },
        { "tier": 3, "target": 30, "rp": 10000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "2〜4人で回すのが最効率。マップ構造を覚えればキルレートが上がる。",
        "steps": [
          "クイックジョブ→LTSを選択",
          "なるべく少人数のLTSを選ぶ",
          "マップ上の回復アイテム位置を把握",
          "高台やカバーポジションを先に確保"
        ],
        "tips": [
          "週2ボーナスがLTS週なら報酬3倍",
          "チーム戦はフレンドと組むと勝率UP",
          "ロケットランチャーがあるマップは取り合いが鍵"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["LTS 攻略", "ラストチームスタンディング コツ"],
        "description": "GTA Online ラストチームスタンディング（LTS）50勝達成攻略。少人数で効率的に勝つ方法。"
      }
    },
    {
      "id": "job_003",
      "name": "ペイン・キラー",
      "description": "契約ミッション（フランクリン）をクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 5000, "cash": 100000, "item": "フランクリンの服" },
      "tiers": [
        { "tier": 1, "target": 3, "rp": 3000 },
        { "tier": 2, "target": 10, "rp": 7000 },
        { "tier": 3, "target": 25, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "フランクリンのエージェンシーミッション。ペイフォン暗殺が最高効率（$85,000/5分）。",
        "steps": [
          "エージェンシーを購入（$2,010,000〜）",
          "ペイフォン暗殺はボーナス条件達成で$85,000",
          "セキュリティ契約は$30,000〜$70,000/件",
          "VIP契約はストーリーミッション（初回$1,000,000）"
        ],
        "tips": [
          "ペイフォン暗殺はクールダウンが20分。合間にセキュリティ契約を挟む",
          "「CEO」のペイフォン暗殺が最も簡単",
          "VIP契約「ドレ」は初回クリアで$1,000,000ボーナス"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["エージェンシー 攻略", "ペイフォン暗殺 一覧", "フランクリン"],
        "description": "GTA Online エージェンシー（フランクリン）完全攻略。ペイフォン暗殺$85,000の稼ぎ方。"
      }
    }
  ]
}
```

### `data/awards/racing.json`

```json
{
  "category": "racing",
  "label": "レース",
  "icon": "🏁",
  "color": "#ec4899",
  "awards": [
    {
      "id": "race_001",
      "name": "ストリートレーサー",
      "description": "ストリートレースで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 20, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "LS Car Meet→ストリートレースから参加。Calico GTFが最強候補。",
        "steps": [
          "LS Car Meetに入場→テストトラック横のPCからストリートレース開始",
          "車両クラスの確認：スポーツ/チューナーが多い",
          "Calico GTFをフルカスタムして参戦",
          "スリップストリーム活用で追い越し"
        ],
        "tips": [
          "Calico GTF/Jester RR/Vectre がチューナー三強",
          "キャッチアップOFFの部屋を選ぶと実力差が出やすい",
          "序盤のクラッシュを避けてクリーンに走る"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ストリートレース 攻略", "チューナー 最速", "Calico GTF"],
        "description": "GTA Online ストリートレース100勝攻略。チューナークラス最強車両と走行テクニック。"
      }
    },
    {
      "id": "race_002",
      "name": "サーキットチャンピオン",
      "description": "通常レースで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 3000, "cash": 50000, "item": "チャンピオンスーツ" },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 25, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "スーパーカークラスでKrieger/Emerusが安定。カスタムカーOFFの部屋で練習。",
        "steps": [
          "クイックジョブ→レース→スーパーカーを選択",
          "Krieger（AWD安定性）またはEmerus（最高速）を選択",
          "コーナリングはブレーキング→アウト・イン・アウト",
          "スリップストリームは直線で使い、カーブ前に離れる"
        ],
        "tips": [
          "カスタムカーONなら車両性能差が大きい→フルカスタム必須",
          "GTA特有の「カーブ前カットブレーキ」テクを習得",
          "2〜4人レースだと上位に入りやすい（勝利カウント稼ぎ）"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA レース 勝つ方法", "スーパーカー 最速", "Krieger"],
        "description": "GTA Online レース100勝攻略。スーパーカークラス最強車両とコーナリングテクニック。"
      }
    },
    {
      "id": "race_003",
      "name": "ドリフトキング",
      "description": "ドリフトレースでスコアを獲得する",
      "requirement": { "type": "cumulative", "target": 100000 },
      "progressMax": 1000000,
      "reward": { "rp": 3000, "cash": 0, "item": "ドリフト・タイヤスモーク" },
      "tiers": [
        { "tier": 1, "target": 10000, "rp": 2000 },
        { "tier": 2, "target": 50000, "rp": 5000 },
        { "tier": 3, "target": 250000, "rp": 12000 },
        { "tier": 4, "target": 1000000, "rp": 25000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ドリフトヨセミテがドリフト特化車両で最高スコアを出しやすい。",
        "steps": [
          "LS Car Meet→テストトラックでドリフト練習",
          "ドリフトレジャブ→ドリフトレースを選択",
          "ハンドブレーキ→アクセルオンでドリフト角度を維持",
          "連続ドリフトでマルチプライヤーを溜める"
        ],
        "tips": [
          "ドリフトヨセミテのサスペンスはフルカスタムで下げる",
          "タイヤは低グリップ（オフロード系）を選ぶと滑りやすい",
          "コーナー手前でハンドブレーキ→角度調整→加速維持がコツ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA ドリフト 方法", "ドリフトヨセミテ", "ドリフトレース"],
        "description": "GTA Online ドリフトレース攻略。ドリフトスコア100万達成のテクニックとおすすめ車両。"
      }
    }
  ]
}
```

---

## 4. カスタムフック

### `src/hooks/useLocalStorage.ts`

```typescript
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // quota exceeded — silently fail
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
```

### `src/hooks/useGlobalProgress.ts`

```typescript
import { useCallback, useMemo } from 'react';
import { GlobalProgressState, ItemProgress } from '../types/progress';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'gta-global-progress';

const DEFAULT_STATE: GlobalProgressState = {
  awards: {},
  cars: {},
  career: {},
};

export function useGlobalProgress() {
  const [state, setState] = useLocalStorage<GlobalProgressState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  // --- Awards ---
  const toggleAward = useCallback(
    (awardId: string) => {
      setState((prev) => {
        const current = prev.awards[awardId];
        const next: ItemProgress = current
          ? { ...current, checked: !current.checked, updatedAt: new Date().toISOString() }
          : { checked: true, progress: 0, currentTier: 1, updatedAt: new Date().toISOString() };
        return { ...prev, awards: { ...prev.awards, [awardId]: next } };
      });
    },
    [setState]
  );

  const updateAwardProgress = useCallback(
    (awardId: string, progress: number, currentTier: number) => {
      setState((prev) => {
        const current = prev.awards[awardId] || {
          checked: false,
          progress: 0,
          currentTier: 1,
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          awards: {
            ...prev.awards,
            [awardId]: { ...current, progress, currentTier, updatedAt: new Date().toISOString() },
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
      state.awards[awardId] ?? {
        checked: false,
        progress: 0,
        currentTier: 1,
        updatedAt: '',
      },
    [state.awards]
  );

  // --- Cars ---
  const toggleCar = useCallback(
    (carId: string) => {
      setState((prev) => {
        const owned = prev.cars[carId]?.owned ?? false;
        return { ...prev, cars: { ...prev.cars, [carId]: { owned: !owned } } };
      });
    },
    [setState]
  );

  const isCarOwned = useCallback(
    (carId: string) => state.cars[carId]?.owned ?? false,
    [state.cars]
  );

  // --- Career ---
  const toggleCareer = useCallback(
    (taskId: string) => {
      setState((prev) => {
        const checked = prev.career[taskId]?.checked ?? false;
        return { ...prev, career: { ...prev.career, [taskId]: { checked: !checked } } };
      });
    },
    [setState]
  );

  const isCareerChecked = useCallback(
    (taskId: string) => state.career[taskId]?.checked ?? false,
    [state.career]
  );

  // --- Stats ---
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

  // --- Reset ---
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
```

---

## 5. コンポーネント

### `src/components/TierBadge/TierBadge.tsx`

```tsx
import './TierBadge.scss';

type Props = {
  tier: number;
  maxTier: number;
  color?: string;
};

const TIER_LABELS = ['', 'I', 'II', 'III', 'IV'];

export const TierBadge = ({ tier, maxTier, color = '#f59e0b' }: Props) => (
  <span
    className={`tier-badge tier-badge--t${tier}`}
    style={{ '--tier-color': color } as React.CSSProperties}
    title={`ティア ${tier} / ${maxTier}`}
  >
    {TIER_LABELS[tier] || tier}
  </span>
);
```

### `src/components/TierBadge/TierBadge.scss`

```scss
@use '../../styles/variables' as *;

.tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: $radius-full;
  font-size: 12px;
  font-weight: 700;
  color: $color-bg;
  background: var(--tier-color, $color-warning);

  &--t1 { opacity: 0.5; }
  &--t2 { opacity: 0.7; }
  &--t3 { opacity: 0.85; }
  &--t4 { opacity: 1; box-shadow: 0 0 8px var(--tier-color); }
}
```

### `src/components/CheckToggle/CheckToggle.tsx`

```tsx
import './CheckToggle.scss';

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: 'sm' | 'md';
};

export const CheckToggle = ({ checked, onChange, label, size = 'md' }: Props) => (
  <label className={`check-toggle check-toggle--${size}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="check-toggle__input"
    />
    <span className={`check-toggle__box${checked ? ' check-toggle__box--on' : ''}`}>
      {checked && '✓'}
    </span>
    {label && <span className="check-toggle__label">{label}</span>}
  </label>
);
```

### `src/components/CheckToggle/CheckToggle.scss`

```scss
@use '../../styles/variables' as *;

.check-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 2px solid $color-border;
    border-radius: $radius-sm;
    background: $color-surface;
    color: $color-success;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.2s;

    &--on {
      border-color: $color-success;
      background: rgba($color-success, 0.15);
    }
  }

  &--sm &__box {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  &__label {
    font-size: 14px;
    color: $color-text;
  }
}
```

### `src/components/AwardCard/AwardCard.tsx`

```tsx
import { Award } from '../../types/award';
import { ItemProgress } from '../../types/progress';
import { CheckToggle } from '../CheckToggle/CheckToggle';
import { TierBadge } from '../TierBadge/TierBadge';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Link } from 'react-router-dom';
import './AwardCard.scss';

type Props = {
  award: Award;
  categorySlug: string;
  categoryColor: string;
  progress: ItemProgress;
  onToggle: () => void;
};

export const AwardCard = ({
  award,
  categorySlug,
  categoryColor,
  progress,
  onToggle,
}: Props) => {
  const currentTier = progress.currentTier || 1;
  const activeTier = award.tiers.find((t) => t.tier === currentTier);
  const tierPercent = activeTier
    ? Math.min(Math.round((progress.progress / activeTier.target) * 100), 100)
    : 0;

  return (
    <article
      className={`award-card${progress.checked ? ' award-card--done' : ''}`}
      style={{ '--accent': categoryColor } as React.CSSProperties}
    >
      <div className="award-card__header">
        <CheckToggle checked={progress.checked} onChange={onToggle} />
        <div className="award-card__tiers">
          {award.tiers.map((t) => (
            <TierBadge
              key={t.tier}
              tier={t.tier}
              maxTier={award.tiers.length}
              color={t.tier <= currentTier ? categoryColor : '#444'}
            />
          ))}
        </div>
      </div>

      <h3 className="award-card__name">
        <Link to={`/awards/${categorySlug}/${award.id}`}>
          {award.name}
        </Link>
      </h3>
      <p className="award-card__desc">{award.description}</p>

      <ProgressBar
        percent={tierPercent}
        label={`Tier ${currentTier}: ${progress.progress} / ${activeTier?.target ?? '—'}`}
        color={categoryColor}
        size="sm"
      />

      <div className="award-card__reward">
        {award.reward.rp > 0 && <span className="award-card__rp">+{award.reward.rp.toLocaleString()} RP</span>}
        {award.reward.cash > 0 && <span className="award-card__cash">${award.reward.cash.toLocaleString()}</span>}
        {award.reward.item && <span className="award-card__item">🎁 {award.reward.item}</span>}
      </div>

      <p className="award-card__guide-
```


## License: 不明
https://github.com/miracle-klaytn-hackathon/author-marketplace/blob/e5f1cef384112211ba9f0b304e372af62b117dca/src/hooks/useLocalStorage.ts

```
十分なコンテキストが得られました。以下に、要件に基づいた完全な設計と実装計画をまとめます。

---

# 🔥 完全攻略サイト化 — 実装設計書

## 1. ディレクトリ構造（追加分）

```
src/
  types/
    award.ts          ← NEW: アワード型定義
    progress.ts       ← NEW: 統合チェック状態の型
  data/
    awards/
      heists.json     ← NEW: 強盗アワード
      combat.json     ← NEW: 戦闘アワード
      vehicles.json   ← NEW: 車両アワード
      business.json   ← NEW: ビジネスアワード
      freemode.json   ← NEW: フリーモードアワード
      jobs.json       ← NEW: ミッションアワード
      racing.json     ← NEW: レースアワード
  hooks/
    useLocalStorage.ts       ← NEW: 汎用localStorage
    useGlobalProgress.ts     ← NEW: 全ページ統合チェック
  components/
    TierBadge/
      TierBadge.tsx/.scss    ← NEW
    CheckToggle/
      CheckToggle.tsx/.scss  ← NEW
    AwardCard/
      AwardCard.tsx/.scss    ← NEW
    VideoEmbed/
      VideoEmbed.tsx/.scss   ← NEW
    RewardCard/
      RewardCard.tsx/.scss   ← NEW
    ImageBlock/
      ImageBlock.tsx/.scss   ← NEW
  pages/
    Awards/
      AwardsIndex.tsx/.scss  ← NEW: /awards/
      AwardCategory.tsx/.scss← NEW: /awards/:category
      AwardDetail.tsx/.scss  ← NEW: /awards/:category/:id
```

---

## 2. 型定義

### `src/types/award.ts`

```typescript
export type AwardTier = {
  tier: number;       // 1〜4
  target: number;     // 達成に必要な回数
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
  videos: string[];   // YouTube video ID
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
  | 'heists'
  | 'combat'
  | 'vehicles'
  | 'business'
  | 'freemode'
  | 'jobs'
  | 'racing';
```

### `src/types/progress.ts`

```typescript
export type ItemProgress = {
  checked: boolean;
  progress: number;     // 現在の進行値
  currentTier: number;  // 現在のティア（1〜4）
  updatedAt: string;
};

export type GlobalProgressState = {
  awards: Record<string, ItemProgress>;
  cars: Record<string, { owned: boolean }>;
  career: Record<string, { checked: boolean }>;
};
```

---

## 3. 全アワードJSONデータ（GTA Online 実データ）

### `data/awards/heists.json`

```json
{
  "category": "heists",
  "label": "強盗",
  "icon": "💰",
  "color": "#f59e0b",
  "awards": [
    {
      "id": "heist_001",
      "name": "初めての強盗",
      "description": "強盗ミッションを初めてクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 1000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 1000 },
        { "tier": 2, "target": 5, "rp": 2500 },
        { "tier": 3, "target": 15, "rp": 5000 },
        { "tier": 4, "target": 50, "rp": 10000, "cash": 50000 }
      ],
      "guide": {
        "summary": "フレイヤの強盗がソロ対応で最も効率的。カヨ・ペリコは1周15分で完走可能。",
        "steps": [
          "コスタ・デル・ソル潜水艦を購入（$2,200,000）",
          "ミニマップ「H」アイコンで偵察ミッション開始",
          "排水トンネル侵入→地下金庫→メイン戦利品回収",
          "崖からダイブ→泳いで離脱"
        ],
        "tips": [
          "ハードモードは報酬+10%。偵察直後にファイナルを始めるとハードが選択可能",
          "排水トンネル経由ならステルス失敗しにくい",
          "ピンクダイヤ＋金塊が最高報酬パターン"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 強盗", "カヨペリコ 攻略", "ハイスト 初心者"],
        "description": "GTA Online 初心者向け強盗ミッション攻略。カヨ・ペリコ強盗のソロクリア方法を解説。"
      }
    },
    {
      "id": "heist_002",
      "name": "プロの強盗犯",
      "description": "強盗ミッションで合計$1,000,000を獲得する",
      "requirement": { "type": "cumulative", "target": 1000000 },
      "progressMax": 10000000,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1000000, "rp": 5000 },
        { "tier": 2, "target": 5000000, "rp": 10000 },
        { "tier": 3, "target": 10000000, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "カヨ・ペリコとダイヤモンドカジノ強盗のローテーションが最効率。",
        "steps": [
          "カヨ・ペリコ：ソロで$1.2M〜$1.8M/周",
          "ダイヤモンドカジノ：2人で$1.5M〜$2.5M/周",
          "ドゥースウェイ強盗：3人推奨で$1.8M〜$3M/周",
          "クールダウン中は他の強盗をサブで回す"
        ],
        "tips": [
          "週2ボーナスを常にチェック",
          "エリートチャレンジで追加ボーナス",
          "フレンド2人以上で取り分最大化"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 金稼ぎ", "強盗 効率", "1000万ドル"],
        "description": "GTA Online 強盗で$10,000,000を効率的に稼ぐ方法。カヨ・ペリコとカジノ強盗のローテーション戦略。"
      }
    },
    {
      "id": "heist_003",
      "name": "エリートチャレンジャー",
      "description": "強盗でエリートチャレンジを達成する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 25,
      "reward": { "rp": 3000, "cash": 0, "item": "エリートバッジ" },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 3000 },
        { "tier": 2, "target": 5, "rp": 6000 },
        { "tier": 3, "target": 15, "rp": 12000 },
        { "tier": 4, "target": 25, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "カヨ・ペリコのエリートチャレンジが最も容易。15分以内・ノーダメージ・全戦利品が条件。",
        "steps": [
          "排水トンネル侵入ルートを選択",
          "地下→エレベーター→金庫直行",
          "メイン戦利品+副戦利品を効率回収",
          "正面ゲートではなく崖ダイブで離脱"
        ],
        "tips": [
          "ストーンハチェットだけで地下をクリア可能",
          "マップを暗記すれば12分台で完走可能",
          "副戦利品は金の延べ棒を優先"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["エリートチャレンジ", "カヨペリコ 15分", "ノーダメージ"],
        "description": "GTA Online カヨ・ペリコ強盗エリートチャレンジの達成条件と攻略法。15分以内クリアのルート解説。"
      }
    },
    {
      "id": "heist_004",
      "name": "ダイヤモンドカジノマスター",
      "description": "ダイヤモンドカジノ強盗を全アプローチでクリアする",
      "requirement": { "type": "unique", "target": 3 },
      "progressMax": 3,
      "reward": { "rp": 10000, "cash": 500000, "item": "カジノ装飾品" },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 5000 },
        { "tier": 2, "target": 2, "rp": 7500 },
        { "tier": 3, "target": 3, "rp": 10000, "cash": 500000 }
      ],
      "guide": {
        "summary": "隠密・攻撃的・ペテン師の3アプローチ全てをクリアする。隠密が最も報酬効率が良い。",
        "steps": [
          "隠密アプローチ：Gruppe Sechsルートが最効率",
          "攻撃的アプローチ：下水道侵入で被ダメ軽減",
          "ペテン師アプローチ：Bugstarsの車が最速ルート",
          "各アプローチで準備ミッションを全完了"
        ],
        "tips": [
          "アーケードはラ・メサが最もカジノに近い",
          "運転手はカリム（最安）でOK、出口の車の差は小さい",
          "金庫の中身はダイヤモンドが出る週を狙う"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["カジノ強盗 全アプローチ", "隠密 攻略", "ペテン師"],
        "description": "GTA Online ダイヤモンドカジノ強盗の全3アプローチ完全攻略。隠密・攻撃的・ペテン師それぞれの最適ルートを解説。"
      }
    },
    {
      "id": "heist_005",
      "name": "ドゥームズ・デイ完遂者",
      "description": "ドゥームズ・デイ・ハイストのACT I〜IIIを全てクリアする",
      "requirement": { "type": "unique", "target": 3 },
      "progressMax": 3,
      "reward": { "rp": 15000, "cash": 750000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 5000 },
        { "tier": 2, "target": 2, "rp": 10000 },
        { "tier": 3, "target": 3, "rp": 15000, "cash": 750000 }
      ],
      "guide": {
        "summary": "ACT III（ドゥームズデイ・シナリオ）が最難関。2人プレイ推奨。",
        "steps": [
          "ACT I データ侵害：サーバーファーム潜入→ハッキング",
          "ACT II ボグダン問題：潜水艦→アベンジャー奪取",
          "ACT III ドゥームズデイ：サイロ潜入→ハッキング→脱出",
          "各ACTに準備ミッション（Setup）が3〜4個"
        ],
        "tips": [
          "ACT II繰り返しはパッチ済み。正攻法でクリア推奨",
          "ミニガン＋ヘビーアーマーがACT IIIの定番",
          "通信妨害は必ずハッキングパズルを練習しておく"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ドゥームズデイ 攻略", "ACT3 クリア方法", "2人 強盗"],
        "description": "GTA Online ドゥームズ・デイ強盗 ACT I〜III完全攻略。ACT III最難関のクリア方法を詳細解説。"
      }
    }
  ]
}
```

### `data/awards/combat.json`

```json
{
  "category": "combat",
  "label": "戦闘",
  "icon": "🔫",
  "color": "#ef4444",
  "awards": [
    {
      "id": "combat_001",
      "name": "ファーストブラッド",
      "description": "フリーモードで他プレイヤーを初めて倒す",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 1000,
      "reward": { "rp": 500, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 500 },
        { "tier": 2, "target": 50, "rp": 2000 },
        { "tier": 3, "target": 250, "rp": 5000 },
        { "tier": 4, "target": 1000, "rp": 15000, "cash": 100000 }
      ],
      "guide": {
        "summary": "プレイヤーキルの基本。オートエイム設定とカバーポジションが重要。",
        "steps": [
          "設定でエイムアシストを確認（自由エイム/アシスト）",
          "ヘビーリボルバーかカービンライフルMk2を準備",
          "カバーポジション（R1/RB）を活用",
          "ミニマップで敵の位置を把握"
        ],
        "tips": [
          "BST（ブルシャークテストステロン）で与ダメ倍増",
          "ヘビースナイパーMk2 + 爆発弾が最強構成",
          "パッシブモード解除してから戦うこと"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA PvP", "対人戦 コツ", "エイムアシスト"],
        "description": "GTA Online PvP対人戦の基礎。エイム設定・武器選び・立ち回りの完全ガイド。"
      }
    },
    {
      "id": "combat_002",
      "name": "マスターストライカー",
      "description": "デスマッチで累計100勝",
      "requirement": { "type": "count", "target": 100 },
      "progressMax": 100,
      "reward": { "rp": 10000, "cash": 50000, "item": "ゴールドタトゥー" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 25, "rp": 4000 },
        { "tier": 3, "target": 50, "rp": 7000 },
        { "tier": 4, "target": 100, "rp": 10000, "cash": 50000 }
      ],
      "guide": {
        "summary": "デスマッチは腕前RPで報酬が決まるため、少人数部屋で安定して勝つのが効率的。",
        "steps": [
          "クイックジョブ→デスマッチを選択",
          "マップにより最適武器が変わる。狭いマップならショットガン",
          "広いマップではヘビースナイパーが有利",
          "リスポーン位置を覚えて先読みする"
        ],
        "tips": [
          "チームデスマッチはキル数より勝利回数重視",
          "2〜4人部屋で回すのが最速",
          "週2ボーナスがデスマッチ化週を狙う"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["デスマッチ 勝つ方法", "GTA デスマッチ 攻略"],
        "description": "GTA Online デスマッチで100勝達成する攻略法。マップ別最適武器と立ち回りを解説。"
      }
    },
    {
      "id": "combat_003",
      "name": "ヘッドショットキング",
      "description": "ヘッドショットで敵を倒す",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 500,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 50, "rp": 2000 },
        { "tier": 2, "target": 150, "rp": 5000 },
        { "tier": 3, "target": 300, "rp": 10000 },
        { "tier": 4, "target": 500, "rp": 20000, "cash": 75000 }
      ],
      "guide": {
        "summary": "NPC相手でもカウントされるため、ミッション中に狙うのが効率的。",
        "steps": [
          "カービンライフルMk2にスコープを装着",
          "ミッションや強盗準備中にヘッドショットを意識",
          "「ウォーストック」関連ミッションで大量のNPCが出現",
          "ファーストパーソンモードの方がエイムしやすい場合も"
        ],
        "tips": [
          "自由エイム設定ならヘッドショット補正が入る",
          "NPCは動きが定型的なのでパターン化可能",
          "スナイパーライフルでの長距離HSもカウント対象"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ヘッドショット コツ", "GTA エイム練習"],
        "description": "GTA Online ヘッドショット500回達成のコツ。効率の良いミッションと武器設定を解説。"
      }
    },
    {
      "id": "combat_004",
      "name": "サバイバルマスター",
      "description": "サバイバルで全ウェーブをクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 5000, "cash": 30000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 3000 },
        { "tier": 2, "target": 10, "rp": 6000 },
        { "tier": 3, "target": 25, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ウェーブ10まで生存すれば$30,000。定位置で戦うのが基本。",
        "steps": [
          "クイックジョブ→サバイバルを選択（4人推奨）",
          "マップごとの防衛ポイントを確認",
          "ヘリが出る後半ウェーブはホーミングランチャー必須",
          "回復アイテム（スナック）を事前に満タンにする"
        ],
        "tips": [
          "Stab City サバイバルが最も簡単（狭い地形で囲まれにくい）",
          "フリーエイムなら報酬1.5倍",
          "弾薬は自動補充。残弾を気にせず撃つ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["サバイバル 攻略", "ウェーブ10 クリア"],
        "description": "GTA Online サバイバル全ウェーブクリア攻略。おすすめマップと防衛ポジションを解説。"
      }
    },
    {
      "id": "combat_005",
      "name": "空のエース",
      "description": "航空機でプレイヤーを撃墜する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 3000, "cash": 0, "item": "エースパイロットスーツ" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 3000 },
        { "tier": 2, "target": 50, "rp": 7000 },
        { "tier": 3, "target": 100, "rp": 15000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "レーザー戦闘機またはB-11ストライクフォースが航空戦最強。",
        "steps": [
          "レーザー：フォート・ザンクードから盗む（無料）",
          "ハイドラ：ペガサスで呼び出し→VTOLモードで垂直離着陸",
          "B-11：バラージアーマーが硬くて初心者向き",
          "チャフ対策：ミサイル頼みではなく機関砲で狙う"
        ],
        "tips": [
          "ドッグファイト時は旋回戦を意識（速度を落としてハンドリング重視）",
          "チャフ→ミサイル→チャフのサイクルが基本",
          "地上のオプレッサーMk2にはエクスプロスナイパーが有効"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 航空戦", "ドッグファイト 攻略", "レーザー 入手"],
        "description": "GTA Online 航空戦（ドッグファイト）攻略。最強戦闘機ランキングとテクニック解説。"
      }
    }
  ]
}
```

### `data/awards/vehicles.json`

```json
{
  "category": "vehicles",
  "label": "車両",
  "icon": "🏎️",
  "color": "#3b82f6",
  "awards": [
    {
      "id": "vehicle_001",
      "name": "コレクター",
      "description": "車両を所有する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 1000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 1000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 10000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "ガレージを拡張しながらコスパの良い車を集める。LS Car Meetの無料車両も忘れずに。",
        "steps": [
          "初期は無料車両（Elegy RH8等）をストックして台数を稼ぐ",
          "エグゼクティブガレージ（60台）＋オフィスガレージ（60台）で大量保管",
          "ナイトクラブガレージ（40台）も活用",
          "カジノラッキーホイールの車は毎週チェック"
        ],
        "tips": [
          "Elegy RH8はレジェンダリー・モータースポーツで無料",
          "盗んだ車もLSカスタムでトラッカーをつければ所有扱い",
          "カーミートの試乗車両はそのまま仲間と走れる"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 車 集め方", "ガレージ 拡張", "無料車両"],
        "description": "GTA Online 車200台所有の効率的な集め方。無料車両リストとガレージ拡張ガイド。"
      }
    },
    {
      "id": "vehicle_002",
      "name": "スピードデーモン",
      "description": "最高速度を記録する",
      "requirement": { "type": "cumulative", "target": 200 },
      "progressMax": 200,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 120, "rp": 1000 },
        { "tier": 2, "target": 150, "rp": 2000 },
        { "tier": 3, "target": 180, "rp": 4000 },
        { "tier": 4, "target": 200, "rp": 8000, "cash": 50000 }
      ],
      "guide": {
        "summary": "LS空港の滑走路またはハイウェイ直線区間で最高速アタック。",
        "steps": [
          "Ocelot Pariah（スポーツクラス最速136mph）をフルカスタム",
          "高速道路直線でフル加速→ニトロボタン",
          "HSW対応車なら150mph超も可能",
          "Pfister 811がスーパークラス最高速"
        ],
        "tips": [
          "HSW（ハオズスペシャルワークス）改造で最高速が大幅UP",
          "風を考慮すると北→南方向が若干有利",
          "アップヒルでは速度が落ちるので平地を選ぶ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 最高速", "最速の車", "HSW"],
        "description": "GTA Online 最高速チャレンジ攻略。最速車両ランキングとスピード記録方法。"
      }
    },
    {
      "id": "vehicle_003",
      "name": "カスタムキング",
      "description": "車両をカスタムする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": "限定カラー" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 1000 },
        { "tier": 2, "target": 25, "rp": 2500 },
        { "tier": 3, "target": 50, "rp": 5000 },
        { "tier": 4, "target": 100, "rp": 10000, "cash": 100000 }
      ],
      "guide": {
        "summary": "LS Customs・LS Car Meet・ベニーズで順次改造回数を稼ぐ。",
        "steps": [
          "LS Customsで安いパーツ変更（ホイール等）もカウント対象",
          "LS Car Meetのテストトラック使用後にカスタムショップへ",
          "ベニーズ対応車両はローライダー・スポコン系",
          "HSWカスタムはLS Car Meet Level 20以上で解放"
        ],
        "tips": [
          "リスプレーだけでもカスタム1回としてカウント",
          "カスタム回数は車じゃなくて部位変更回数",
          "クルーカラーで独自色もカウント対象"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA カスタム", "LS Customs", "ベニーズ"],
        "description": "GTA Online 車両カスタム100回達成の効率的な方法。お金をかけずにカウントを稼ぐテクニック。"
      }
    },
    {
      "id": "vehicle_004",
      "name": "バイクライフ",
      "description": "バイクで走行距離を稼ぐ",
      "requirement": { "type": "cumulative", "target": 500 },
      "progressMax": 500,
      "reward": { "rp": 3000, "cash": 0, "item": "バイカージャケット" },
      "tiers": [
        { "tier": 1, "target": 50, "rp": 1000 },
        { "tier": 2, "target": 150, "rp": 3000 },
        { "tier": 3, "target": 300, "rp": 6000 },
        { "tier": 4, "target": 500, "rp": 12000, "cash": 75000 }
      ],
      "guide": {
        "summary": "バイクビジネスの売却ミッション中に自然と距離が貯まる。",
        "steps": [
          "Bati 801RR（最速バイク）で高速道路を走る",
          "MCバイカービジネスの売却ミッションを積極的にやる",
          "フリーモードでの移動をバイクに統一",
          "バイクレースに参加して距離を稼ぐ"
        ],
        "tips": [
          "ウィリーを維持すると加速が上がる（バティ系）",
          "Shotaro/Deathbikeのトロンバイクも対象",
          "MC会長の近くにはバイクをリクエスト呼び出し可能"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA バイク 走行距離", "Bati801 最速"],
        "description": "GTA Online バイク走行距離500マイル達成法。おすすめバイクとルート。"
      }
    }
  ]
}
```

### `data/awards/business.json`

```json
{
  "category": "business",
  "label": "ビジネス",
  "icon": "💼",
  "color": "#22c55e",
  "awards": [
    {
      "id": "biz_001",
      "name": "CEO",
      "description": "CEOとしてVIPワークを完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 20, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 150000 }
      ],
      "guide": {
        "summary": "「ヘッドハンター」と「サイトシアー」の交互が最効率。1サイクル5分で$40,000。",
        "steps": [
          "SecuroServからCEOを登録",
          "VIPワーク→ヘッドハンター開始（4人のターゲット排除）",
          "完了後→サイトシアー開始（荷物3個回収）",
          "クールダウンなしで交互に回す"
        ],
        "tips": [
          "アーマードクルマ(Armored Kuruma)で敵の攻撃を無効化",
          "オプレッサーMk2なら移動が爆速",
          "ロスサントスのセッションが少人数だと敵が弱い"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["CEO VIPワーク", "ヘッドハンター 攻略", "金稼ぎ"],
        "description": "GTA Online CEOビジネス VIPワーク最効率攻略。ヘッドハンター＆サイトシアーのローテーション。"
      }
    },
    {
      "id": "biz_002",
      "name": "ナイトクラブオーナー",
      "description": "ナイトクラブで収益を得る",
      "requirement": { "type": "cumulative", "target": 1000000 },
      "progressMax": 10000000,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 100000, "rp": 2000 },
        { "tier": 2, "target": 1000000, "rp": 5000 },
        { "tier": 3, "target": 5000000, "rp": 12000 },
        { "tier": 4, "target": 10000000, "rp": 25000, "cash": 500000 }
      ],
      "guide": {
        "summary": "ナイトクラブはAFK放置で稼げる最強のパッシブビジネス。全ビジネスを紐づけて放置。",
        "steps": [
          "ナイトクラブを購入（$1,080,000〜）",
          "倉庫を最大5階まで拡張",
          "テクニシャン5人を雇用",
          "バイカー・CEO貨物・武器密造をナイトクラブに紐付け",
          "放置→満タンで売却（$1,690,000）"
        ],
        "tips": [
          "スペシャルオーダーは貨物＞薬物＞火器＞偽札＞大麻の優先度",
          "トニーの取り分は$100,000で固定上限",
          "売却はソロ1台なのでソロでOK"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ナイトクラブ 放置", "AFK稼ぎ", "パッシブ収入"],
        "description": "GTA Online ナイトクラブ完全攻略。AFK放置で最大$1,690,000を稼ぐ設定方法。"
      }
    },
    {
      "id": "biz_003",
      "name": "密造工場マスター",
      "description": "武器密造の売却を完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 0, "item": "武器MK2改造アクセス" },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 3000 },
        { "tier": 2, "target": 15, "rp": 7000 },
        { "tier": 3, "target": 30, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "バンカーはチュマシュがベスト。研究をファストトラックで全解放→売却に集中。",
        "steps": [
          "バンカーをチュマシュに購入（$1,650,000）",
          "スタッフ管理→「製造のみ」に設定",
          "補給品$75,000→満製造で売却$210,000（ロスサントス）",
          "ソロなら1/4で売却（車両1台確定）"
        ],
        "tips": [
          "チュマシュ→ロスサントスの売却が最も効率的なルート",
          "研究はMk2武器のアンロックに必要（全45件）",
          "ファストトラック研究は$225,000/件"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["バンカー 攻略", "武器密造 売却", "チュマシュ"],
        "description": "GTA Online 武器密造（バンカー）売却50回達成ガイド。チュマシュバンカーの最適運用法。"
      }
    },
    {
      "id": "biz_004",
      "name": "車両貨物ディーラー",
      "description": "車両貨物（I/E）で車両を売却する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 3000 },
        { "tier": 2, "target": 25, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "ハイエンド車のみを売却するのが最効率。32台メソッドで安定化。",
        "steps": [
          "CEO車両倉庫を購入（$1,500,000〜）",
          "スタンダード/ミッドレンジを32台溜める",
          "33台目以降は必ずハイエンドが出る",
          "ハイエンドを$100,000利益で売却"
        ],
        "tips": [
          "盗む時にダメージを受けると修理費が発生。丁寧に運転!",
          "売却時のNPCウェーブは4回。車から降りて迎撃",
          "フレンド同セッションだとNPCが湧かない"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["車両貨物 32台", "I/E 攻略", "ハイエンド"],
        "description": "GTA Online 車両貨物（I/E）100回売却攻略。32台メソッドでハイエンド確定にする方法。"
      }
    }
  ]
}
```

### `data/awards/freemode.json`

```json
{
  "category": "freemode",
  "label": "フリーモード",
  "icon": "🌍",
  "color": "#8b5cf6",
  "awards": [
    {
      "id": "free_001",
      "name": "フリーモードイベントマスター",
      "description": "フリーモードイベントで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 15, "rp": 5000 },
        { "tier": 3, "target": 30, "rp": 10000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "チェックポイント集め・キングオブザヒルが初心者でも勝ちやすい。",
        "steps": [
          "イベントは15分間隔でランダム発生",
          "チェックポイント集め：マップ上の光点にいち早く到着",
          "キングオブザヒル：拠点を維持し続ける",
          "ハンティングパック：チームプレイ重視"
        ],
        "tips": [
          "オプレッサーMk2で移動すればチェックポイント系は独壇場",
          "少人数セッションでは勝率が格段に上がる",
          "スクランブルは航空機が有利"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["フリーモード イベント 勝つ", "チェックポイント 攻略"],
        "description": "GTA Online フリーモードイベント50回優勝攻略。初心者でも勝てるイベントの選び方。"
      }
    },
    {
      "id": "free_002",
      "name": "チャレンジャー",
      "description": "フリーモードチャレンジを完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 25000, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 30, "rp": 5000 },
        { "tier": 3, "target": 60, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ドライブチャレンジ系が移動中に自然と達成できる。",
        "steps": [
          "最長ドライブ：高速道路を一方方向にひたすら走る",
          "最高速度チャレンジ：Pariah/811でハイウェイ直線",
          "最長ウィリー：Bati801でウィリー維持",
          "ニアミスチャレンジ：対向車線で逆走"
        ],
        "tips": [
          "チャレンジは参加者が少ないほど上位になりやすい",
          "一部チャレンジは特定施設が必要",
          "招待限定セッションでもチャレンジ発生する"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["フリーモードチャレンジ 一覧", "ウィリー コツ"],
        "description": "GTA Online フリーモードチャレンジ100回達成ガイド。ドライブ系チャレンジで効率的に稼ぐ方法。"
      }
    },
    {
      "id": "free_003",
      "name": "トレジャーハンター",
      "description": "隠されたアイテムを収集する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 5000, "cash": 50000, "item": "トレジャーハンターTシャツ" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 10000 },
        { "tier": 4, "target": 200, "rp": 20000, "cash": 250000 }
      ],
      "guide": {
        "summary": "アクション・フィギュア、信号ジャマー、プレイングカード等を順番に集める。",
        "steps": [
          "アクション・フィギュア100個→$150,000＋インポシブルトリニティ衣装",
          "信号ジャマー50個→$150,000＋アビ掛け電話解除",
          "プレイングカード54枚→チップ＋衣装",
          "映画小道具10個→$150,000"
        ],
        "tips": [
          "GTAWebの攻略マップを見ながら順番に回ると効率的",
          "Mk2かスパローヘリで空中移動すると最速",
          "一部はインテリア内にあるので注意"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 収集品 場所", "アクションフィギュア 全100", "信号ジャマー"],
        "description": "GTA Online 全収集品コンプリートガイド。アクション・フィギュア、信号ジャマー、カード全場所一覧。"
      }
    }
  ]
}
```

### `data/awards/jobs.json`

```json
{
  "category": "jobs",
  "label": "ミッション",
  "icon": "📋",
  "color": "#06b6d4",
  "awards": [
    {
      "id": "job_001",
      "name": "ミッションランナー",
      "description": "コンタクトミッションをクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 12000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "「ブロウアップ」「ルーフトップランブル」が4分で完了し最効率。",
        "steps": [
          "ジョブ→ロックスター作成→コンタクトミッションから選択",
          "マーティンの「ルーフトップランブル」：直行して全員排除（3〜4分）",
          "シモンの「ブロウアップ」：ディーラーの車を爆破（2〜3分）",
          "難易度ハードで報酬1.5倍"
        ],
        "tips": [
          "4分以上かけると報酬が増える仕様（時間報酬制）",
          "最適は4分ちょうどで完了→次のミッション開始",
          "招待限定セッションからでも開始可能"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["コンタクトミッション 効率", "ルーフトップランブル", "金稼ぎ ソロ"],
        "description": "GTA Online コンタクトミッション200回攻略。最速効率のミッションランキングと稼ぎ方。"
      }
    },
    {
      "id": "job_002",
      "name": "ラストチームスタンディング",
      "description": "LTSで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 30000, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 15, "rp": 5000 },
        { "tier": 3, "target": 30, "rp": 10000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "2〜4人で回すのが最効率。マップ構造を覚えればキルレートが上がる。",
        "steps": [
          "クイックジョブ→LTSを選択",
          "なるべく少人数のLTSを選ぶ",
          "マップ上の回復アイテム位置を把握",
          "高台やカバーポジションを先に確保"
        ],
        "tips": [
          "週2ボーナスがLTS週なら報酬3倍",
          "チーム戦はフレンドと組むと勝率UP",
          "ロケットランチャーがあるマップは取り合いが鍵"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["LTS 攻略", "ラストチームスタンディング コツ"],
        "description": "GTA Online ラストチームスタンディング（LTS）50勝達成攻略。少人数で効率的に勝つ方法。"
      }
    },
    {
      "id": "job_003",
      "name": "ペイン・キラー",
      "description": "契約ミッション（フランクリン）をクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 5000, "cash": 100000, "item": "フランクリンの服" },
      "tiers": [
        { "tier": 1, "target": 3, "rp": 3000 },
        { "tier": 2, "target": 10, "rp": 7000 },
        { "tier": 3, "target": 25, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "フランクリンのエージェンシーミッション。ペイフォン暗殺が最高効率（$85,000/5分）。",
        "steps": [
          "エージェンシーを購入（$2,010,000〜）",
          "ペイフォン暗殺はボーナス条件達成で$85,000",
          "セキュリティ契約は$30,000〜$70,000/件",
          "VIP契約はストーリーミッション（初回$1,000,000）"
        ],
        "tips": [
          "ペイフォン暗殺はクールダウンが20分。合間にセキュリティ契約を挟む",
          "「CEO」のペイフォン暗殺が最も簡単",
          "VIP契約「ドレ」は初回クリアで$1,000,000ボーナス"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["エージェンシー 攻略", "ペイフォン暗殺 一覧", "フランクリン"],
        "description": "GTA Online エージェンシー（フランクリン）完全攻略。ペイフォン暗殺$85,000の稼ぎ方。"
      }
    }
  ]
}
```

### `data/awards/racing.json`

```json
{
  "category": "racing",
  "label": "レース",
  "icon": "🏁",
  "color": "#ec4899",
  "awards": [
    {
      "id": "race_001",
      "name": "ストリートレーサー",
      "description": "ストリートレースで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 20, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "LS Car Meet→ストリートレースから参加。Calico GTFが最強候補。",
        "steps": [
          "LS Car Meetに入場→テストトラック横のPCからストリートレース開始",
          "車両クラスの確認：スポーツ/チューナーが多い",
          "Calico GTFをフルカスタムして参戦",
          "スリップストリーム活用で追い越し"
        ],
        "tips": [
          "Calico GTF/Jester RR/Vectre がチューナー三強",
          "キャッチアップOFFの部屋を選ぶと実力差が出やすい",
          "序盤のクラッシュを避けてクリーンに走る"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ストリートレース 攻略", "チューナー 最速", "Calico GTF"],
        "description": "GTA Online ストリートレース100勝攻略。チューナークラス最強車両と走行テクニック。"
      }
    },
    {
      "id": "race_002",
      "name": "サーキットチャンピオン",
      "description": "通常レースで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 3000, "cash": 50000, "item": "チャンピオンスーツ" },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 25, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "スーパーカークラスでKrieger/Emerusが安定。カスタムカーOFFの部屋で練習。",
        "steps": [
          "クイックジョブ→レース→スーパーカーを選択",
          "Krieger（AWD安定性）またはEmerus（最高速）を選択",
          "コーナリングはブレーキング→アウト・イン・アウト",
          "スリップストリームは直線で使い、カーブ前に離れる"
        ],
        "tips": [
          "カスタムカーONなら車両性能差が大きい→フルカスタム必須",
          "GTA特有の「カーブ前カットブレーキ」テクを習得",
          "2〜4人レースだと上位に入りやすい（勝利カウント稼ぎ）"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA レース 勝つ方法", "スーパーカー 最速", "Krieger"],
        "description": "GTA Online レース100勝攻略。スーパーカークラス最強車両とコーナリングテクニック。"
      }
    },
    {
      "id": "race_003",
      "name": "ドリフトキング",
      "description": "ドリフトレースでスコアを獲得する",
      "requirement": { "type": "cumulative", "target": 100000 },
      "progressMax": 1000000,
      "reward": { "rp": 3000, "cash": 0, "item": "ドリフト・タイヤスモーク" },
      "tiers": [
        { "tier": 1, "target": 10000, "rp": 2000 },
        { "tier": 2, "target": 50000, "rp": 5000 },
        { "tier": 3, "target": 250000, "rp": 12000 },
        { "tier": 4, "target": 1000000, "rp": 25000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ドリフトヨセミテがドリフト特化車両で最高スコアを出しやすい。",
        "steps": [
          "LS Car Meet→テストトラックでドリフト練習",
          "ドリフトレジャブ→ドリフトレースを選択",
          "ハンドブレーキ→アクセルオンでドリフト角度を維持",
          "連続ドリフトでマルチプライヤーを溜める"
        ],
        "tips": [
          "ドリフトヨセミテのサスペンスはフルカスタムで下げる",
          "タイヤは低グリップ（オフロード系）を選ぶと滑りやすい",
          "コーナー手前でハンドブレーキ→角度調整→加速維持がコツ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA ドリフト 方法", "ドリフトヨセミテ", "ドリフトレース"],
        "description": "GTA Online ドリフトレース攻略。ドリフトスコア100万達成のテクニックとおすすめ車両。"
      }
    }
  ]
}
```

---

## 4. カスタムフック

### `src/hooks/useLocalStorage.ts`

```typescript
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // quota exceeded — silently fail
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
```

### `src/hooks/useGlobalProgress.ts`

```typescript
import { useCallback, useMemo } from 'react';
import { GlobalProgressState, ItemProgress } from '../types/progress';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'gta-global-progress';

const DEFAULT_STATE: GlobalProgressState = {
  awards: {},
  cars: {},
  career: {},
};

export function useGlobalProgress() {
  const [state, setState] = useLocalStorage<GlobalProgressState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  // --- Awards ---
  const toggleAward = useCallback(
    (awardId: string) => {
      setState((prev) => {
        const current = prev.awards[awardId];
        const next: ItemProgress = current
          ? { ...current, checked: !current.checked, updatedAt: new Date().toISOString() }
          : { checked: true, progress: 0, currentTier: 1, updatedAt: new Date().toISOString() };
        return { ...prev, awards: { ...prev.awards, [awardId]: next } };
      });
    },
    [setState]
  );

  const updateAwardProgress = useCallback(
    (awardId: string, progress: number, currentTier: number) => {
      setState((prev) => {
        const current = prev.awards[awardId] || {
          checked: false,
          progress: 0,
          currentTier: 1,
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          awards: {
            ...prev.awards,
            [awardId]: { ...current, progress, currentTier, updatedAt: new Date().toISOString() },
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
      state.awards[awardId] ?? {
        checked: false,
        progress: 0,
        currentTier: 1,
        updatedAt: '',
      },
    [state.awards]
  );

  // --- Cars ---
  const toggleCar = useCallback(
    (carId: string) => {
      setState((prev) => {
        const owned = prev.cars[carId]?.owned ?? false;
        return { ...prev, cars: { ...prev.cars, [carId]: { owned: !owned } } };
      });
    },
    [setState]
  );

  const isCarOwned = useCallback(
    (carId: string) => state.cars[carId]?.owned ?? false,
    [state.cars]
  );

  // --- Career ---
  const toggleCareer = useCallback(
    (taskId: string) => {
      setState((prev) => {
        const checked = prev.career[taskId]?.checked ?? false;
        return { ...prev, career: { ...prev.career, [taskId]: { checked: !checked } } };
      });
    },
    [setState]
  );

  const isCareerChecked = useCallback(
    (taskId: string) => state.career[taskId]?.checked ?? false,
    [state.career]
  );

  // --- Stats ---
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

  // --- Reset ---
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
```

---

## 5. コンポーネント

### `src/components/TierBadge/TierBadge.tsx`

```tsx
import './TierBadge.scss';

type Props = {
  tier: number;
  maxTier: number;
  color?: string;
};

const TIER_LABELS = ['', 'I', 'II', 'III', 'IV'];

export const TierBadge = ({ tier, maxTier, color = '#f59e0b' }: Props) => (
  <span
    className={`tier-badge tier-badge--t${tier}`}
    style={{ '--tier-color': color } as React.CSSProperties}
    title={`ティア ${tier} / ${maxTier}`}
  >
    {TIER_LABELS[tier] || tier}
  </span>
);
```

### `src/components/TierBadge/TierBadge.scss`

```scss
@use '../../styles/variables' as *;

.tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: $radius-full;
  font-size: 12px;
  font-weight: 700;
  color: $color-bg;
  background: var(--tier-color, $color-warning);

  &--t1 { opacity: 0.5; }
  &--t2 { opacity: 0.7; }
  &--t3 { opacity: 0.85; }
  &--t4 { opacity: 1; box-shadow: 0 0 8px var(--tier-color); }
}
```

### `src/components/CheckToggle/CheckToggle.tsx`

```tsx
import './CheckToggle.scss';

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: 'sm' | 'md';
};

export const CheckToggle = ({ checked, onChange, label, size = 'md' }: Props) => (
  <label className={`check-toggle check-toggle--${size}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="check-toggle__input"
    />
    <span className={`check-toggle__box${checked ? ' check-toggle__box--on' : ''}`}>
      {checked && '✓'}
    </span>
    {label && <span className="check-toggle__label">{label}</span>}
  </label>
);
```

### `src/components/CheckToggle/CheckToggle.scss`

```scss
@use '../../styles/variables' as *;

.check-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 2px solid $color-border;
    border-radius: $radius-sm;
    background: $color-surface;
    color: $color-success;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.2s;

    &--on {
      border-color: $color-success;
      background: rgba($color-success, 0.15);
    }
  }

  &--sm &__box {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  &__label {
    font-size: 14px;
    color: $color-text;
  }
}
```

### `src/components/AwardCard/AwardCard.tsx`

```tsx
import { Award } from '../../types/award';
import { ItemProgress } from '../../types/progress';
import { CheckToggle } from '../CheckToggle/CheckToggle';
import { TierBadge } from '../TierBadge/TierBadge';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Link } from 'react-router-dom';
import './AwardCard.scss';

type Props = {
  award: Award;
  categorySlug: string;
  categoryColor: string;
  progress: ItemProgress;
  onToggle: () => void;
};

export const AwardCard = ({
  award,
  categorySlug,
  categoryColor,
  progress,
  onToggle,
}: Props) => {
  const currentTier = progress.currentTier || 1;
  const activeTier = award.tiers.find((t) => t.tier === currentTier);
  const tierPercent = activeTier
    ? Math.min(Math.round((progress.progress / activeTier.target) * 100), 100)
    : 0;

  return (
    <article
      className={`award-card${progress.checked ? ' award-card--done' : ''}`}
      style={{ '--accent': categoryColor } as React.CSSProperties}
    >
      <div className="award-card__header">
        <CheckToggle checked={progress.checked} onChange={onToggle} />
        <div className="award-card__tiers">
          {award.tiers.map((t) => (
            <TierBadge
              key={t.tier}
              tier={t.tier}
              maxTier={award.tiers.length}
              color={t.tier <= currentTier ? categoryColor : '#444'}
            />
          ))}
        </div>
      </div>

      <h3 className="award-card__name">
        <Link to={`/awards/${categorySlug}/${award.id}`}>
          {award.name}
        </Link>
      </h3>
      <p className="award-card__desc">{award.description}</p>

      <ProgressBar
        percent={tierPercent}
        label={`Tier ${currentTier}: ${progress.progress} / ${activeTier?.target ?? '—'}`}
        color={categoryColor}
        size="sm"
      />

      <div className="award-card__reward">
        {award.reward.rp > 0 && <span className="award-card__rp">+{award.reward.rp.toLocaleString()} RP</span>}
        {award.reward.cash > 0 && <span className="award-card__cash">${award.reward.cash.toLocaleString()}</span>}
        {award.reward.item && <span className="award-card__item">🎁 {award.reward.item}</span>}
      </div>

      <p className="award-card__guide-
```


## License: 不明
https://github.com/miracle-klaytn-hackathon/author-marketplace/blob/e5f1cef384112211ba9f0b304e372af62b117dca/src/hooks/useLocalStorage.ts

```
十分なコンテキストが得られました。以下に、要件に基づいた完全な設計と実装計画をまとめます。

---

# 🔥 完全攻略サイト化 — 実装設計書

## 1. ディレクトリ構造（追加分）

```
src/
  types/
    award.ts          ← NEW: アワード型定義
    progress.ts       ← NEW: 統合チェック状態の型
  data/
    awards/
      heists.json     ← NEW: 強盗アワード
      combat.json     ← NEW: 戦闘アワード
      vehicles.json   ← NEW: 車両アワード
      business.json   ← NEW: ビジネスアワード
      freemode.json   ← NEW: フリーモードアワード
      jobs.json       ← NEW: ミッションアワード
      racing.json     ← NEW: レースアワード
  hooks/
    useLocalStorage.ts       ← NEW: 汎用localStorage
    useGlobalProgress.ts     ← NEW: 全ページ統合チェック
  components/
    TierBadge/
      TierBadge.tsx/.scss    ← NEW
    CheckToggle/
      CheckToggle.tsx/.scss  ← NEW
    AwardCard/
      AwardCard.tsx/.scss    ← NEW
    VideoEmbed/
      VideoEmbed.tsx/.scss   ← NEW
    RewardCard/
      RewardCard.tsx/.scss   ← NEW
    ImageBlock/
      ImageBlock.tsx/.scss   ← NEW
  pages/
    Awards/
      AwardsIndex.tsx/.scss  ← NEW: /awards/
      AwardCategory.tsx/.scss← NEW: /awards/:category
      AwardDetail.tsx/.scss  ← NEW: /awards/:category/:id
```

---

## 2. 型定義

### `src/types/award.ts`

```typescript
export type AwardTier = {
  tier: number;       // 1〜4
  target: number;     // 達成に必要な回数
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
  videos: string[];   // YouTube video ID
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
  | 'heists'
  | 'combat'
  | 'vehicles'
  | 'business'
  | 'freemode'
  | 'jobs'
  | 'racing';
```

### `src/types/progress.ts`

```typescript
export type ItemProgress = {
  checked: boolean;
  progress: number;     // 現在の進行値
  currentTier: number;  // 現在のティア（1〜4）
  updatedAt: string;
};

export type GlobalProgressState = {
  awards: Record<string, ItemProgress>;
  cars: Record<string, { owned: boolean }>;
  career: Record<string, { checked: boolean }>;
};
```

---

## 3. 全アワードJSONデータ（GTA Online 実データ）

### `data/awards/heists.json`

```json
{
  "category": "heists",
  "label": "強盗",
  "icon": "💰",
  "color": "#f59e0b",
  "awards": [
    {
      "id": "heist_001",
      "name": "初めての強盗",
      "description": "強盗ミッションを初めてクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 1000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 1000 },
        { "tier": 2, "target": 5, "rp": 2500 },
        { "tier": 3, "target": 15, "rp": 5000 },
        { "tier": 4, "target": 50, "rp": 10000, "cash": 50000 }
      ],
      "guide": {
        "summary": "フレイヤの強盗がソロ対応で最も効率的。カヨ・ペリコは1周15分で完走可能。",
        "steps": [
          "コスタ・デル・ソル潜水艦を購入（$2,200,000）",
          "ミニマップ「H」アイコンで偵察ミッション開始",
          "排水トンネル侵入→地下金庫→メイン戦利品回収",
          "崖からダイブ→泳いで離脱"
        ],
        "tips": [
          "ハードモードは報酬+10%。偵察直後にファイナルを始めるとハードが選択可能",
          "排水トンネル経由ならステルス失敗しにくい",
          "ピンクダイヤ＋金塊が最高報酬パターン"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 強盗", "カヨペリコ 攻略", "ハイスト 初心者"],
        "description": "GTA Online 初心者向け強盗ミッション攻略。カヨ・ペリコ強盗のソロクリア方法を解説。"
      }
    },
    {
      "id": "heist_002",
      "name": "プロの強盗犯",
      "description": "強盗ミッションで合計$1,000,000を獲得する",
      "requirement": { "type": "cumulative", "target": 1000000 },
      "progressMax": 10000000,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1000000, "rp": 5000 },
        { "tier": 2, "target": 5000000, "rp": 10000 },
        { "tier": 3, "target": 10000000, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "カヨ・ペリコとダイヤモンドカジノ強盗のローテーションが最効率。",
        "steps": [
          "カヨ・ペリコ：ソロで$1.2M〜$1.8M/周",
          "ダイヤモンドカジノ：2人で$1.5M〜$2.5M/周",
          "ドゥースウェイ強盗：3人推奨で$1.8M〜$3M/周",
          "クールダウン中は他の強盗をサブで回す"
        ],
        "tips": [
          "週2ボーナスを常にチェック",
          "エリートチャレンジで追加ボーナス",
          "フレンド2人以上で取り分最大化"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 金稼ぎ", "強盗 効率", "1000万ドル"],
        "description": "GTA Online 強盗で$10,000,000を効率的に稼ぐ方法。カヨ・ペリコとカジノ強盗のローテーション戦略。"
      }
    },
    {
      "id": "heist_003",
      "name": "エリートチャレンジャー",
      "description": "強盗でエリートチャレンジを達成する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 25,
      "reward": { "rp": 3000, "cash": 0, "item": "エリートバッジ" },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 3000 },
        { "tier": 2, "target": 5, "rp": 6000 },
        { "tier": 3, "target": 15, "rp": 12000 },
        { "tier": 4, "target": 25, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "カヨ・ペリコのエリートチャレンジが最も容易。15分以内・ノーダメージ・全戦利品が条件。",
        "steps": [
          "排水トンネル侵入ルートを選択",
          "地下→エレベーター→金庫直行",
          "メイン戦利品+副戦利品を効率回収",
          "正面ゲートではなく崖ダイブで離脱"
        ],
        "tips": [
          "ストーンハチェットだけで地下をクリア可能",
          "マップを暗記すれば12分台で完走可能",
          "副戦利品は金の延べ棒を優先"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["エリートチャレンジ", "カヨペリコ 15分", "ノーダメージ"],
        "description": "GTA Online カヨ・ペリコ強盗エリートチャレンジの達成条件と攻略法。15分以内クリアのルート解説。"
      }
    },
    {
      "id": "heist_004",
      "name": "ダイヤモンドカジノマスター",
      "description": "ダイヤモンドカジノ強盗を全アプローチでクリアする",
      "requirement": { "type": "unique", "target": 3 },
      "progressMax": 3,
      "reward": { "rp": 10000, "cash": 500000, "item": "カジノ装飾品" },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 5000 },
        { "tier": 2, "target": 2, "rp": 7500 },
        { "tier": 3, "target": 3, "rp": 10000, "cash": 500000 }
      ],
      "guide": {
        "summary": "隠密・攻撃的・ペテン師の3アプローチ全てをクリアする。隠密が最も報酬効率が良い。",
        "steps": [
          "隠密アプローチ：Gruppe Sechsルートが最効率",
          "攻撃的アプローチ：下水道侵入で被ダメ軽減",
          "ペテン師アプローチ：Bugstarsの車が最速ルート",
          "各アプローチで準備ミッションを全完了"
        ],
        "tips": [
          "アーケードはラ・メサが最もカジノに近い",
          "運転手はカリム（最安）でOK、出口の車の差は小さい",
          "金庫の中身はダイヤモンドが出る週を狙う"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["カジノ強盗 全アプローチ", "隠密 攻略", "ペテン師"],
        "description": "GTA Online ダイヤモンドカジノ強盗の全3アプローチ完全攻略。隠密・攻撃的・ペテン師それぞれの最適ルートを解説。"
      }
    },
    {
      "id": "heist_005",
      "name": "ドゥームズ・デイ完遂者",
      "description": "ドゥームズ・デイ・ハイストのACT I〜IIIを全てクリアする",
      "requirement": { "type": "unique", "target": 3 },
      "progressMax": 3,
      "reward": { "rp": 15000, "cash": 750000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 5000 },
        { "tier": 2, "target": 2, "rp": 10000 },
        { "tier": 3, "target": 3, "rp": 15000, "cash": 750000 }
      ],
      "guide": {
        "summary": "ACT III（ドゥームズデイ・シナリオ）が最難関。2人プレイ推奨。",
        "steps": [
          "ACT I データ侵害：サーバーファーム潜入→ハッキング",
          "ACT II ボグダン問題：潜水艦→アベンジャー奪取",
          "ACT III ドゥームズデイ：サイロ潜入→ハッキング→脱出",
          "各ACTに準備ミッション（Setup）が3〜4個"
        ],
        "tips": [
          "ACT II繰り返しはパッチ済み。正攻法でクリア推奨",
          "ミニガン＋ヘビーアーマーがACT IIIの定番",
          "通信妨害は必ずハッキングパズルを練習しておく"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ドゥームズデイ 攻略", "ACT3 クリア方法", "2人 強盗"],
        "description": "GTA Online ドゥームズ・デイ強盗 ACT I〜III完全攻略。ACT III最難関のクリア方法を詳細解説。"
      }
    }
  ]
}
```

### `data/awards/combat.json`

```json
{
  "category": "combat",
  "label": "戦闘",
  "icon": "🔫",
  "color": "#ef4444",
  "awards": [
    {
      "id": "combat_001",
      "name": "ファーストブラッド",
      "description": "フリーモードで他プレイヤーを初めて倒す",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 1000,
      "reward": { "rp": 500, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 500 },
        { "tier": 2, "target": 50, "rp": 2000 },
        { "tier": 3, "target": 250, "rp": 5000 },
        { "tier": 4, "target": 1000, "rp": 15000, "cash": 100000 }
      ],
      "guide": {
        "summary": "プレイヤーキルの基本。オートエイム設定とカバーポジションが重要。",
        "steps": [
          "設定でエイムアシストを確認（自由エイム/アシスト）",
          "ヘビーリボルバーかカービンライフルMk2を準備",
          "カバーポジション（R1/RB）を活用",
          "ミニマップで敵の位置を把握"
        ],
        "tips": [
          "BST（ブルシャークテストステロン）で与ダメ倍増",
          "ヘビースナイパーMk2 + 爆発弾が最強構成",
          "パッシブモード解除してから戦うこと"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA PvP", "対人戦 コツ", "エイムアシスト"],
        "description": "GTA Online PvP対人戦の基礎。エイム設定・武器選び・立ち回りの完全ガイド。"
      }
    },
    {
      "id": "combat_002",
      "name": "マスターストライカー",
      "description": "デスマッチで累計100勝",
      "requirement": { "type": "count", "target": 100 },
      "progressMax": 100,
      "reward": { "rp": 10000, "cash": 50000, "item": "ゴールドタトゥー" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 25, "rp": 4000 },
        { "tier": 3, "target": 50, "rp": 7000 },
        { "tier": 4, "target": 100, "rp": 10000, "cash": 50000 }
      ],
      "guide": {
        "summary": "デスマッチは腕前RPで報酬が決まるため、少人数部屋で安定して勝つのが効率的。",
        "steps": [
          "クイックジョブ→デスマッチを選択",
          "マップにより最適武器が変わる。狭いマップならショットガン",
          "広いマップではヘビースナイパーが有利",
          "リスポーン位置を覚えて先読みする"
        ],
        "tips": [
          "チームデスマッチはキル数より勝利回数重視",
          "2〜4人部屋で回すのが最速",
          "週2ボーナスがデスマッチ化週を狙う"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["デスマッチ 勝つ方法", "GTA デスマッチ 攻略"],
        "description": "GTA Online デスマッチで100勝達成する攻略法。マップ別最適武器と立ち回りを解説。"
      }
    },
    {
      "id": "combat_003",
      "name": "ヘッドショットキング",
      "description": "ヘッドショットで敵を倒す",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 500,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 50, "rp": 2000 },
        { "tier": 2, "target": 150, "rp": 5000 },
        { "tier": 3, "target": 300, "rp": 10000 },
        { "tier": 4, "target": 500, "rp": 20000, "cash": 75000 }
      ],
      "guide": {
        "summary": "NPC相手でもカウントされるため、ミッション中に狙うのが効率的。",
        "steps": [
          "カービンライフルMk2にスコープを装着",
          "ミッションや強盗準備中にヘッドショットを意識",
          "「ウォーストック」関連ミッションで大量のNPCが出現",
          "ファーストパーソンモードの方がエイムしやすい場合も"
        ],
        "tips": [
          "自由エイム設定ならヘッドショット補正が入る",
          "NPCは動きが定型的なのでパターン化可能",
          "スナイパーライフルでの長距離HSもカウント対象"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ヘッドショット コツ", "GTA エイム練習"],
        "description": "GTA Online ヘッドショット500回達成のコツ。効率の良いミッションと武器設定を解説。"
      }
    },
    {
      "id": "combat_004",
      "name": "サバイバルマスター",
      "description": "サバイバルで全ウェーブをクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 5000, "cash": 30000, "item": null },
      "tiers": [
        { "tier": 1, "target": 1, "rp": 3000 },
        { "tier": 2, "target": 10, "rp": 6000 },
        { "tier": 3, "target": 25, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ウェーブ10まで生存すれば$30,000。定位置で戦うのが基本。",
        "steps": [
          "クイックジョブ→サバイバルを選択（4人推奨）",
          "マップごとの防衛ポイントを確認",
          "ヘリが出る後半ウェーブはホーミングランチャー必須",
          "回復アイテム（スナック）を事前に満タンにする"
        ],
        "tips": [
          "Stab City サバイバルが最も簡単（狭い地形で囲まれにくい）",
          "フリーエイムなら報酬1.5倍",
          "弾薬は自動補充。残弾を気にせず撃つ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["サバイバル 攻略", "ウェーブ10 クリア"],
        "description": "GTA Online サバイバル全ウェーブクリア攻略。おすすめマップと防衛ポジションを解説。"
      }
    },
    {
      "id": "combat_005",
      "name": "空のエース",
      "description": "航空機でプレイヤーを撃墜する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 3000, "cash": 0, "item": "エースパイロットスーツ" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 3000 },
        { "tier": 2, "target": 50, "rp": 7000 },
        { "tier": 3, "target": 100, "rp": 15000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "レーザー戦闘機またはB-11ストライクフォースが航空戦最強。",
        "steps": [
          "レーザー：フォート・ザンクードから盗む（無料）",
          "ハイドラ：ペガサスで呼び出し→VTOLモードで垂直離着陸",
          "B-11：バラージアーマーが硬くて初心者向き",
          "チャフ対策：ミサイル頼みではなく機関砲で狙う"
        ],
        "tips": [
          "ドッグファイト時は旋回戦を意識（速度を落としてハンドリング重視）",
          "チャフ→ミサイル→チャフのサイクルが基本",
          "地上のオプレッサーMk2にはエクスプロスナイパーが有効"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 航空戦", "ドッグファイト 攻略", "レーザー 入手"],
        "description": "GTA Online 航空戦（ドッグファイト）攻略。最強戦闘機ランキングとテクニック解説。"
      }
    }
  ]
}
```

### `data/awards/vehicles.json`

```json
{
  "category": "vehicles",
  "label": "車両",
  "icon": "🏎️",
  "color": "#3b82f6",
  "awards": [
    {
      "id": "vehicle_001",
      "name": "コレクター",
      "description": "車両を所有する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 1000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 1000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 10000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "ガレージを拡張しながらコスパの良い車を集める。LS Car Meetの無料車両も忘れずに。",
        "steps": [
          "初期は無料車両（Elegy RH8等）をストックして台数を稼ぐ",
          "エグゼクティブガレージ（60台）＋オフィスガレージ（60台）で大量保管",
          "ナイトクラブガレージ（40台）も活用",
          "カジノラッキーホイールの車は毎週チェック"
        ],
        "tips": [
          "Elegy RH8はレジェンダリー・モータースポーツで無料",
          "盗んだ車もLSカスタムでトラッカーをつければ所有扱い",
          "カーミートの試乗車両はそのまま仲間と走れる"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 車 集め方", "ガレージ 拡張", "無料車両"],
        "description": "GTA Online 車200台所有の効率的な集め方。無料車両リストとガレージ拡張ガイド。"
      }
    },
    {
      "id": "vehicle_002",
      "name": "スピードデーモン",
      "description": "最高速度を記録する",
      "requirement": { "type": "cumulative", "target": 200 },
      "progressMax": 200,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 120, "rp": 1000 },
        { "tier": 2, "target": 150, "rp": 2000 },
        { "tier": 3, "target": 180, "rp": 4000 },
        { "tier": 4, "target": 200, "rp": 8000, "cash": 50000 }
      ],
      "guide": {
        "summary": "LS空港の滑走路またはハイウェイ直線区間で最高速アタック。",
        "steps": [
          "Ocelot Pariah（スポーツクラス最速136mph）をフルカスタム",
          "高速道路直線でフル加速→ニトロボタン",
          "HSW対応車なら150mph超も可能",
          "Pfister 811がスーパークラス最高速"
        ],
        "tips": [
          "HSW（ハオズスペシャルワークス）改造で最高速が大幅UP",
          "風を考慮すると北→南方向が若干有利",
          "アップヒルでは速度が落ちるので平地を選ぶ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 最高速", "最速の車", "HSW"],
        "description": "GTA Online 最高速チャレンジ攻略。最速車両ランキングとスピード記録方法。"
      }
    },
    {
      "id": "vehicle_003",
      "name": "カスタムキング",
      "description": "車両をカスタムする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": "限定カラー" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 1000 },
        { "tier": 2, "target": 25, "rp": 2500 },
        { "tier": 3, "target": 50, "rp": 5000 },
        { "tier": 4, "target": 100, "rp": 10000, "cash": 100000 }
      ],
      "guide": {
        "summary": "LS Customs・LS Car Meet・ベニーズで順次改造回数を稼ぐ。",
        "steps": [
          "LS Customsで安いパーツ変更（ホイール等）もカウント対象",
          "LS Car Meetのテストトラック使用後にカスタムショップへ",
          "ベニーズ対応車両はローライダー・スポコン系",
          "HSWカスタムはLS Car Meet Level 20以上で解放"
        ],
        "tips": [
          "リスプレーだけでもカスタム1回としてカウント",
          "カスタム回数は車じゃなくて部位変更回数",
          "クルーカラーで独自色もカウント対象"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA カスタム", "LS Customs", "ベニーズ"],
        "description": "GTA Online 車両カスタム100回達成の効率的な方法。お金をかけずにカウントを稼ぐテクニック。"
      }
    },
    {
      "id": "vehicle_004",
      "name": "バイクライフ",
      "description": "バイクで走行距離を稼ぐ",
      "requirement": { "type": "cumulative", "target": 500 },
      "progressMax": 500,
      "reward": { "rp": 3000, "cash": 0, "item": "バイカージャケット" },
      "tiers": [
        { "tier": 1, "target": 50, "rp": 1000 },
        { "tier": 2, "target": 150, "rp": 3000 },
        { "tier": 3, "target": 300, "rp": 6000 },
        { "tier": 4, "target": 500, "rp": 12000, "cash": 75000 }
      ],
      "guide": {
        "summary": "バイクビジネスの売却ミッション中に自然と距離が貯まる。",
        "steps": [
          "Bati 801RR（最速バイク）で高速道路を走る",
          "MCバイカービジネスの売却ミッションを積極的にやる",
          "フリーモードでの移動をバイクに統一",
          "バイクレースに参加して距離を稼ぐ"
        ],
        "tips": [
          "ウィリーを維持すると加速が上がる（バティ系）",
          "Shotaro/Deathbikeのトロンバイクも対象",
          "MC会長の近くにはバイクをリクエスト呼び出し可能"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA バイク 走行距離", "Bati801 最速"],
        "description": "GTA Online バイク走行距離500マイル達成法。おすすめバイクとルート。"
      }
    }
  ]
}
```

### `data/awards/business.json`

```json
{
  "category": "business",
  "label": "ビジネス",
  "icon": "💼",
  "color": "#22c55e",
  "awards": [
    {
      "id": "biz_001",
      "name": "CEO",
      "description": "CEOとしてVIPワークを完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 20, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 150000 }
      ],
      "guide": {
        "summary": "「ヘッドハンター」と「サイトシアー」の交互が最効率。1サイクル5分で$40,000。",
        "steps": [
          "SecuroServからCEOを登録",
          "VIPワーク→ヘッドハンター開始（4人のターゲット排除）",
          "完了後→サイトシアー開始（荷物3個回収）",
          "クールダウンなしで交互に回す"
        ],
        "tips": [
          "アーマードクルマ(Armored Kuruma)で敵の攻撃を無効化",
          "オプレッサーMk2なら移動が爆速",
          "ロスサントスのセッションが少人数だと敵が弱い"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["CEO VIPワーク", "ヘッドハンター 攻略", "金稼ぎ"],
        "description": "GTA Online CEOビジネス VIPワーク最効率攻略。ヘッドハンター＆サイトシアーのローテーション。"
      }
    },
    {
      "id": "biz_002",
      "name": "ナイトクラブオーナー",
      "description": "ナイトクラブで収益を得る",
      "requirement": { "type": "cumulative", "target": 1000000 },
      "progressMax": 10000000,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 100000, "rp": 2000 },
        { "tier": 2, "target": 1000000, "rp": 5000 },
        { "tier": 3, "target": 5000000, "rp": 12000 },
        { "tier": 4, "target": 10000000, "rp": 25000, "cash": 500000 }
      ],
      "guide": {
        "summary": "ナイトクラブはAFK放置で稼げる最強のパッシブビジネス。全ビジネスを紐づけて放置。",
        "steps": [
          "ナイトクラブを購入（$1,080,000〜）",
          "倉庫を最大5階まで拡張",
          "テクニシャン5人を雇用",
          "バイカー・CEO貨物・武器密造をナイトクラブに紐付け",
          "放置→満タンで売却（$1,690,000）"
        ],
        "tips": [
          "スペシャルオーダーは貨物＞薬物＞火器＞偽札＞大麻の優先度",
          "トニーの取り分は$100,000で固定上限",
          "売却はソロ1台なのでソロでOK"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ナイトクラブ 放置", "AFK稼ぎ", "パッシブ収入"],
        "description": "GTA Online ナイトクラブ完全攻略。AFK放置で最大$1,690,000を稼ぐ設定方法。"
      }
    },
    {
      "id": "biz_003",
      "name": "密造工場マスター",
      "description": "武器密造の売却を完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 0, "item": "武器MK2改造アクセス" },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 3000 },
        { "tier": 2, "target": 15, "rp": 7000 },
        { "tier": 3, "target": 30, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "バンカーはチュマシュがベスト。研究をファストトラックで全解放→売却に集中。",
        "steps": [
          "バンカーをチュマシュに購入（$1,650,000）",
          "スタッフ管理→「製造のみ」に設定",
          "補給品$75,000→満製造で売却$210,000（ロスサントス）",
          "ソロなら1/4で売却（車両1台確定）"
        ],
        "tips": [
          "チュマシュ→ロスサントスの売却が最も効率的なルート",
          "研究はMk2武器のアンロックに必要（全45件）",
          "ファストトラック研究は$225,000/件"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["バンカー 攻略", "武器密造 売却", "チュマシュ"],
        "description": "GTA Online 武器密造（バンカー）売却50回達成ガイド。チュマシュバンカーの最適運用法。"
      }
    },
    {
      "id": "biz_004",
      "name": "車両貨物ディーラー",
      "description": "車両貨物（I/E）で車両を売却する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 5000, "cash": 100000, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 3000 },
        { "tier": 2, "target": 25, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "ハイエンド車のみを売却するのが最効率。32台メソッドで安定化。",
        "steps": [
          "CEO車両倉庫を購入（$1,500,000〜）",
          "スタンダード/ミッドレンジを32台溜める",
          "33台目以降は必ずハイエンドが出る",
          "ハイエンドを$100,000利益で売却"
        ],
        "tips": [
          "盗む時にダメージを受けると修理費が発生。丁寧に運転!",
          "売却時のNPCウェーブは4回。車から降りて迎撃",
          "フレンド同セッションだとNPCが湧かない"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["車両貨物 32台", "I/E 攻略", "ハイエンド"],
        "description": "GTA Online 車両貨物（I/E）100回売却攻略。32台メソッドでハイエンド確定にする方法。"
      }
    }
  ]
}
```

### `data/awards/freemode.json`

```json
{
  "category": "freemode",
  "label": "フリーモード",
  "icon": "🌍",
  "color": "#8b5cf6",
  "awards": [
    {
      "id": "free_001",
      "name": "フリーモードイベントマスター",
      "description": "フリーモードイベントで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 15, "rp": 5000 },
        { "tier": 3, "target": 30, "rp": 10000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "チェックポイント集め・キングオブザヒルが初心者でも勝ちやすい。",
        "steps": [
          "イベントは15分間隔でランダム発生",
          "チェックポイント集め：マップ上の光点にいち早く到着",
          "キングオブザヒル：拠点を維持し続ける",
          "ハンティングパック：チームプレイ重視"
        ],
        "tips": [
          "オプレッサーMk2で移動すればチェックポイント系は独壇場",
          "少人数セッションでは勝率が格段に上がる",
          "スクランブルは航空機が有利"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["フリーモード イベント 勝つ", "チェックポイント 攻略"],
        "description": "GTA Online フリーモードイベント50回優勝攻略。初心者でも勝てるイベントの選び方。"
      }
    },
    {
      "id": "free_002",
      "name": "チャレンジャー",
      "description": "フリーモードチャレンジを完了する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 25000, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 30, "rp": 5000 },
        { "tier": 3, "target": 60, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ドライブチャレンジ系が移動中に自然と達成できる。",
        "steps": [
          "最長ドライブ：高速道路を一方方向にひたすら走る",
          "最高速度チャレンジ：Pariah/811でハイウェイ直線",
          "最長ウィリー：Bati801でウィリー維持",
          "ニアミスチャレンジ：対向車線で逆走"
        ],
        "tips": [
          "チャレンジは参加者が少ないほど上位になりやすい",
          "一部チャレンジは特定施設が必要",
          "招待限定セッションでもチャレンジ発生する"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["フリーモードチャレンジ 一覧", "ウィリー コツ"],
        "description": "GTA Online フリーモードチャレンジ100回達成ガイド。ドライブ系チャレンジで効率的に稼ぐ方法。"
      }
    },
    {
      "id": "free_003",
      "name": "トレジャーハンター",
      "description": "隠されたアイテムを収集する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 5000, "cash": 50000, "item": "トレジャーハンターTシャツ" },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 10000 },
        { "tier": 4, "target": 200, "rp": 20000, "cash": 250000 }
      ],
      "guide": {
        "summary": "アクション・フィギュア、信号ジャマー、プレイングカード等を順番に集める。",
        "steps": [
          "アクション・フィギュア100個→$150,000＋インポシブルトリニティ衣装",
          "信号ジャマー50個→$150,000＋アビ掛け電話解除",
          "プレイングカード54枚→チップ＋衣装",
          "映画小道具10個→$150,000"
        ],
        "tips": [
          "GTAWebの攻略マップを見ながら順番に回ると効率的",
          "Mk2かスパローヘリで空中移動すると最速",
          "一部はインテリア内にあるので注意"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA 収集品 場所", "アクションフィギュア 全100", "信号ジャマー"],
        "description": "GTA Online 全収集品コンプリートガイド。アクション・フィギュア、信号ジャマー、カード全場所一覧。"
      }
    }
  ]
}
```

### `data/awards/jobs.json`

```json
{
  "category": "jobs",
  "label": "ミッション",
  "icon": "📋",
  "color": "#06b6d4",
  "awards": [
    {
      "id": "job_001",
      "name": "ミッションランナー",
      "description": "コンタクトミッションをクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 200,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 10, "rp": 2000 },
        { "tier": 2, "target": 50, "rp": 5000 },
        { "tier": 3, "target": 100, "rp": 12000 },
        { "tier": 4, "target": 200, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "「ブロウアップ」「ルーフトップランブル」が4分で完了し最効率。",
        "steps": [
          "ジョブ→ロックスター作成→コンタクトミッションから選択",
          "マーティンの「ルーフトップランブル」：直行して全員排除（3〜4分）",
          "シモンの「ブロウアップ」：ディーラーの車を爆破（2〜3分）",
          "難易度ハードで報酬1.5倍"
        ],
        "tips": [
          "4分以上かけると報酬が増える仕様（時間報酬制）",
          "最適は4分ちょうどで完了→次のミッション開始",
          "招待限定セッションからでも開始可能"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["コンタクトミッション 効率", "ルーフトップランブル", "金稼ぎ ソロ"],
        "description": "GTA Online コンタクトミッション200回攻略。最速効率のミッションランキングと稼ぎ方。"
      }
    },
    {
      "id": "job_002",
      "name": "ラストチームスタンディング",
      "description": "LTSで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 3000, "cash": 30000, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 15, "rp": 5000 },
        { "tier": 3, "target": 30, "rp": 10000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 100000 }
      ],
      "guide": {
        "summary": "2〜4人で回すのが最効率。マップ構造を覚えればキルレートが上がる。",
        "steps": [
          "クイックジョブ→LTSを選択",
          "なるべく少人数のLTSを選ぶ",
          "マップ上の回復アイテム位置を把握",
          "高台やカバーポジションを先に確保"
        ],
        "tips": [
          "週2ボーナスがLTS週なら報酬3倍",
          "チーム戦はフレンドと組むと勝率UP",
          "ロケットランチャーがあるマップは取り合いが鍵"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["LTS 攻略", "ラストチームスタンディング コツ"],
        "description": "GTA Online ラストチームスタンディング（LTS）50勝達成攻略。少人数で効率的に勝つ方法。"
      }
    },
    {
      "id": "job_003",
      "name": "ペイン・キラー",
      "description": "契約ミッション（フランクリン）をクリアする",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 50,
      "reward": { "rp": 5000, "cash": 100000, "item": "フランクリンの服" },
      "tiers": [
        { "tier": 1, "target": 3, "rp": 3000 },
        { "tier": 2, "target": 10, "rp": 7000 },
        { "tier": 3, "target": 25, "rp": 12000 },
        { "tier": 4, "target": 50, "rp": 20000, "cash": 200000 }
      ],
      "guide": {
        "summary": "フランクリンのエージェンシーミッション。ペイフォン暗殺が最高効率（$85,000/5分）。",
        "steps": [
          "エージェンシーを購入（$2,010,000〜）",
          "ペイフォン暗殺はボーナス条件達成で$85,000",
          "セキュリティ契約は$30,000〜$70,000/件",
          "VIP契約はストーリーミッション（初回$1,000,000）"
        ],
        "tips": [
          "ペイフォン暗殺はクールダウンが20分。合間にセキュリティ契約を挟む",
          "「CEO」のペイフォン暗殺が最も簡単",
          "VIP契約「ドレ」は初回クリアで$1,000,000ボーナス"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["エージェンシー 攻略", "ペイフォン暗殺 一覧", "フランクリン"],
        "description": "GTA Online エージェンシー（フランクリン）完全攻略。ペイフォン暗殺$85,000の稼ぎ方。"
      }
    }
  ]
}
```

### `data/awards/racing.json`

```json
{
  "category": "racing",
  "label": "レース",
  "icon": "🏁",
  "color": "#ec4899",
  "awards": [
    {
      "id": "race_001",
      "name": "ストリートレーサー",
      "description": "ストリートレースで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 2000, "cash": 0, "item": null },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 20, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 25000, "cash": 150000 }
      ],
      "guide": {
        "summary": "LS Car Meet→ストリートレースから参加。Calico GTFが最強候補。",
        "steps": [
          "LS Car Meetに入場→テストトラック横のPCからストリートレース開始",
          "車両クラスの確認：スポーツ/チューナーが多い",
          "Calico GTFをフルカスタムして参戦",
          "スリップストリーム活用で追い越し"
        ],
        "tips": [
          "Calico GTF/Jester RR/Vectre がチューナー三強",
          "キャッチアップOFFの部屋を選ぶと実力差が出やすい",
          "序盤のクラッシュを避けてクリーンに走る"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["ストリートレース 攻略", "チューナー 最速", "Calico GTF"],
        "description": "GTA Online ストリートレース100勝攻略。チューナークラス最強車両と走行テクニック。"
      }
    },
    {
      "id": "race_002",
      "name": "サーキットチャンピオン",
      "description": "通常レースで優勝する",
      "requirement": { "type": "count", "target": 1 },
      "progressMax": 100,
      "reward": { "rp": 3000, "cash": 50000, "item": "チャンピオンスーツ" },
      "tiers": [
        { "tier": 1, "target": 5, "rp": 2000 },
        { "tier": 2, "target": 25, "rp": 5000 },
        { "tier": 3, "target": 50, "rp": 10000 },
        { "tier": 4, "target": 100, "rp": 25000, "cash": 200000 }
      ],
      "guide": {
        "summary": "スーパーカークラスでKrieger/Emerusが安定。カスタムカーOFFの部屋で練習。",
        "steps": [
          "クイックジョブ→レース→スーパーカーを選択",
          "Krieger（AWD安定性）またはEmerus（最高速）を選択",
          "コーナリングはブレーキング→アウト・イン・アウト",
          "スリップストリームは直線で使い、カーブ前に離れる"
        ],
        "tips": [
          "カスタムカーONなら車両性能差が大きい→フルカスタム必須",
          "GTA特有の「カーブ前カットブレーキ」テクを習得",
          "2〜4人レースだと上位に入りやすい（勝利カウント稼ぎ）"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA レース 勝つ方法", "スーパーカー 最速", "Krieger"],
        "description": "GTA Online レース100勝攻略。スーパーカークラス最強車両とコーナリングテクニック。"
      }
    },
    {
      "id": "race_003",
      "name": "ドリフトキング",
      "description": "ドリフトレースでスコアを獲得する",
      "requirement": { "type": "cumulative", "target": 100000 },
      "progressMax": 1000000,
      "reward": { "rp": 3000, "cash": 0, "item": "ドリフト・タイヤスモーク" },
      "tiers": [
        { "tier": 1, "target": 10000, "rp": 2000 },
        { "tier": 2, "target": 50000, "rp": 5000 },
        { "tier": 3, "target": 250000, "rp": 12000 },
        { "tier": 4, "target": 1000000, "rp": 25000, "cash": 100000 }
      ],
      "guide": {
        "summary": "ドリフトヨセミテがドリフト特化車両で最高スコアを出しやすい。",
        "steps": [
          "LS Car Meet→テストトラックでドリフト練習",
          "ドリフトレジャブ→ドリフトレースを選択",
          "ハンドブレーキ→アクセルオンでドリフト角度を維持",
          "連続ドリフトでマルチプライヤーを溜める"
        ],
        "tips": [
          "ドリフトヨセミテのサスペンスはフルカスタムで下げる",
          "タイヤは低グリップ（オフロード系）を選ぶと滑りやすい",
          "コーナー手前でハンドブレーキ→角度調整→加速維持がコツ"
        ]
      },
      "media": { "images": [], "videos": [] },
      "seo": {
        "keywords": ["GTA ドリフト 方法", "ドリフトヨセミテ", "ドリフトレース"],
        "description": "GTA Online ドリフトレース攻略。ドリフトスコア100万達成のテクニックとおすすめ車両。"
      }
    }
  ]
}
```

---

## 4. カスタムフック

### `src/hooks/useLocalStorage.ts`

```typescript
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // quota exceeded — silently fail
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
```

### `src/hooks/useGlobalProgress.ts`

```typescript
import { useCallback, useMemo } from 'react';
import { GlobalProgressState, ItemProgress } from '../types/progress';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'gta-global-progress';

const DEFAULT_STATE: GlobalProgressState = {
  awards: {},
  cars: {},
  career: {},
};

export function useGlobalProgress() {
  const [state, setState] = useLocalStorage<GlobalProgressState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  // --- Awards ---
  const toggleAward = useCallback(
    (awardId: string) => {
      setState((prev) => {
        const current = prev.awards[awardId];
        const next: ItemProgress = current
          ? { ...current, checked: !current.checked, updatedAt: new Date().toISOString() }
          : { checked: true, progress: 0, currentTier: 1, updatedAt: new Date().toISOString() };
        return { ...prev, awards: { ...prev.awards, [awardId]: next } };
      });
    },
    [setState]
  );

  const updateAwardProgress = useCallback(
    (awardId: string, progress: number, currentTier: number) => {
      setState((prev) => {
        const current = prev.awards[awardId] || {
          checked: false,
          progress: 0,
          currentTier: 1,
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          awards: {
            ...prev.awards,
            [awardId]: { ...current, progress, currentTier, updatedAt: new Date().toISOString() },
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
      state.awards[awardId] ?? {
        checked: false,
        progress: 0,
        currentTier: 1,
        updatedAt: '',
      },
    [state.awards]
  );

  // --- Cars ---
  const toggleCar = useCallback(
    (carId: string) => {
      setState((prev) => {
        const owned = prev.cars[carId]?.owned ?? false;
        return { ...prev, cars: { ...prev.cars, [carId]: { owned: !owned } } };
      });
    },
    [setState]
  );

  const isCarOwned = useCallback(
    (carId: string) => state.cars[carId]?.owned ?? false,
    [state.cars]
  );

  // --- Career ---
  const toggleCareer = useCallback(
    (taskId: string) => {
      setState((prev) => {
        const checked = prev.career[taskId]?.checked ?? false;
        return { ...prev, career: { ...prev.career, [taskId]: { checked: !checked } } };
      });
    },
    [setState]
  );

  const isCareerChecked = useCallback(
    (taskId: string) => state.career[taskId]?.checked ?? false,
    [state.career]
  );

  // --- Stats ---
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

  // --- Reset ---
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
```

---

## 5. コンポーネント

### `src/components/TierBadge/TierBadge.tsx`

```tsx
import './TierBadge.scss';

type Props = {
  tier: number;
  maxTier: number;
  color?: string;
};

const TIER_LABELS = ['', 'I', 'II', 'III', 'IV'];

export const TierBadge = ({ tier, maxTier, color = '#f59e0b' }: Props) => (
  <span
    className={`tier-badge tier-badge--t${tier}`}
    style={{ '--tier-color': color } as React.CSSProperties}
    title={`ティア ${tier} / ${maxTier}`}
  >
    {TIER_LABELS[tier] || tier}
  </span>
);
```

### `src/components/TierBadge/TierBadge.scss`

```scss
@use '../../styles/variables' as *;

.tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: $radius-full;
  font-size: 12px;
  font-weight: 700;
  color: $color-bg;
  background: var(--tier-color, $color-warning);

  &--t1 { opacity: 0.5; }
  &--t2 { opacity: 0.7; }
  &--t3 { opacity: 0.85; }
  &--t4 { opacity: 1; box-shadow: 0 0 8px var(--tier-color); }
}
```

### `src/components/CheckToggle/CheckToggle.tsx`

```tsx
import './CheckToggle.scss';

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: 'sm' | 'md';
};

export const CheckToggle = ({ checked, onChange, label, size = 'md' }: Props) => (
  <label className={`check-toggle check-toggle--${size}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="check-toggle__input"
    />
    <span className={`check-toggle__box${checked ? ' check-toggle__box--on' : ''}`}>
      {checked && '✓'}
    </span>
    {label && <span className="check-toggle__label">{label}</span>}
  </label>
);
```

### `src/components/CheckToggle/CheckToggle.scss`

```scss
@use '../../styles/variables' as *;

.check-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 2px solid $color-border;
    border-radius: $radius-sm;
    background: $color-surface;
    color: $color-success;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.2s;

    &--on {
      border-color: $color-success;
      background: rgba($color-success, 0.15);
    }
  }

  &--sm &__box {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  &__label {
    font-size: 14px;
    color: $color-text;
  }
}
```

### `src/components/AwardCard/AwardCard.tsx`

```tsx
import { Award } from '../../types/award';
import { ItemProgress } from '../../types/progress';
import { CheckToggle } from '../CheckToggle/CheckToggle';
import { TierBadge } from '../TierBadge/TierBadge';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Link } from 'react-router-dom';
import './AwardCard.scss';

type Props = {
  award: Award;
  categorySlug: string;
  categoryColor: string;
  progress: ItemProgress;
  onToggle: () => void;
};

export const AwardCard = ({
  award,
  categorySlug,
  categoryColor,
  progress,
  onToggle,
}: Props) => {
  const currentTier = progress.currentTier || 1;
  const activeTier = award.tiers.find((t) => t.tier === currentTier);
  const tierPercent = activeTier
    ? Math.min(Math.round((progress.progress / activeTier.target) * 100), 100)
    : 0;

  return (
    <article
      className={`award-card${progress.checked ? ' award-card--done' : ''}`}
      style={{ '--accent': categoryColor } as React.CSSProperties}
    >
      <div className="award-card__header">
        <CheckToggle checked={progress.checked} onChange={onToggle} />
        <div className="award-card__tiers">
          {award.tiers.map((t) => (
            <TierBadge
              key={t.tier}
              tier={t.tier}
              maxTier={award.tiers.length}
              color={t.tier <= currentTier ? categoryColor : '#444'}
            />
          ))}
        </div>
      </div>

      <h3 className="award-card__name">
        <Link to={`/awards/${categorySlug}/${award.id}`}>
          {award.name}
        </Link>
      </h3>
      <p className="award-card__desc">{award.description}</p>

      <ProgressBar
        percent={tierPercent}
        label={`Tier ${currentTier}: ${progress.progress} / ${activeTier?.target ?? '—'}`}
        color={categoryColor}
        size="sm"
      />

      <div className="award-card__reward">
        {award.reward.rp > 0 && <span className="award-card__rp">+{award.reward.rp.toLocaleString()} RP</span>}
        {award.reward.cash > 0 && <span className="award-card__cash">${award.reward.cash.toLocaleString()}</span>}
        {award.reward.item && <span className="award-card__item">🎁 {award.reward.item}</span>}
      </div>

      <p className="award-card__guide-
```
