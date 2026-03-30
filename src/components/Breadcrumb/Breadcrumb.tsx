import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items }: Props) => (
  <nav className="breadcrumb" aria-label="パンくずリスト">
    <ol className="breadcrumb__list">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="breadcrumb__item">
            {!isLast && item.to ? (
              <Link to={item.to} className="breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="breadcrumb__sep" aria-hidden="true">›</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);
