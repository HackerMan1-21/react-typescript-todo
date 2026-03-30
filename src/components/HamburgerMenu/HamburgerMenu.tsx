import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS, MenuItem } from '../../data/menuData';
import './HamburgerMenu.scss';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // ページ遷移時に閉じる
  useEffect(() => {
    setIsOpen(false);
    setExpandedIndex(null);
  }, [location.pathname]);

  // Escapeキーで閉じる
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // 外側クリックで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // bodyスクロールロック
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpand = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const renderItem = (item: MenuItem, index: number) => {
    if (item.children) {
      const isExpanded = expandedIndex === index;
      return (
        <li key={item.label} className="hmenu__item hmenu__item--parent">
          <button
            className="hmenu__btn"
            onClick={() => toggleExpand(index)}
            aria-expanded={isExpanded}
          >
            {item.icon && (
              <span className="hmenu__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="hmenu__label">{item.label}</span>
            <span
              className={`hmenu__arrow${isExpanded ? ' hmenu__arrow--open' : ''}`}
              aria-hidden="true"
            >
              ▸
            </span>
          </button>
          <ul className={`hmenu__sub${isExpanded ? ' hmenu__sub--open' : ''}`}>
            {item.children.map((child) => (
              <li key={child.label} className="hmenu__sub-item">
                <Link to={child.to!} className="hmenu__link hmenu__link--sub">
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.label} className="hmenu__item">
        <Link to={item.to!} className="hmenu__link">
          {item.icon && (
            <span className="hmenu__icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="hmenu__label">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="hmenu" ref={menuRef}>
      {/* ハンバーガーボタン */}
      <button
        className={`hmenu__trigger${isOpen ? ' hmenu__trigger--active' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
        aria-controls="hmenu-drawer"
      >
        <span className="hmenu__bar" />
        <span className="hmenu__bar" />
        <span className="hmenu__bar" />
      </button>

      {/* オーバーレイ */}
      <div
        className={`hmenu__overlay${isOpen ? ' hmenu__overlay--visible' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* ドロワー本体 */}
      <nav
        id="hmenu-drawer"
        className={`hmenu__drawer${isOpen ? ' hmenu__drawer--open' : ''}`}
        aria-label="グローバルナビゲーション"
        aria-hidden={!isOpen}
      >
        <div className="hmenu__header">
          <Link to="/" className="hmenu__brand">
            GTA Online 攻略
          </Link>
          <button
            className="hmenu__close"
            onClick={() => setIsOpen(false)}
            aria-label="メニューを閉じる"
          >
            ✕
          </button>
        </div>
        <ul className="hmenu__list">
          {MENU_ITEMS.map((item, i) => renderItem(item, i))}
        </ul>
      </nav>
    </div>
  );
};
