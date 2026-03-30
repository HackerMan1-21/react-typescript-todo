import { Link } from 'react-router-dom';
import { HamburgerMenu } from '../components/HamburgerMenu/HamburgerMenu';
import './MainLayout.scss';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => (
  <div className="main-layout">
    <header className="main-layout__header" role="banner">
      <div className="main-layout__header-inner">
        {/* ハンバーガーメニュー（左） */}
        <HamburgerMenu />

        {/* ブランド（中央） */}
        <Link to="/" className="main-layout__brand">
          GTA Online 攻略
        </Link>

        {/* PC ナビ（右） */}
        <nav className="main-layout__nav" aria-label="メインナビゲーション">
          <Link to="/" className="main-layout__nav-link">車両図鑑</Link>
          <Link to="/guide" className="main-layout__nav-link">攻略ガイド</Link>
          <Link to="/awards" className="main-layout__nav-link">🏅 アワード</Link>
          <Link to="/career" className="main-layout__nav-link main-layout__nav-link--accent">
            🏆 キャリア進行
          </Link>
        </nav>
      </div>
    </header>

    <main className="main-layout__main" role="main">
      {children}
    </main>

    <footer className="main-layout__footer" role="contentinfo">
      <div className="main-layout__footer-inner">
        <p className="main-layout__footer-copy">
          © 2026 GTA Online 攻略図鑑 — 非公式ファンサイト
        </p>
        <nav className="main-layout__footer-nav" aria-label="フッターナビゲーション">
          <Link to="/">車両図鑑</Link>
          <Link to="/guide">攻略ガイド</Link>
          <Link to="/awards">アワード</Link>
          <Link to="/career">キャリア進行</Link>
        </nav>
      </div>
    </footer>
  </div>
);
