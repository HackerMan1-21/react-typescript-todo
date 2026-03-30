import { Link } from 'react-router-dom';
import './NotFound.scss';

export const NotFound = () => (
  <div className="not-found">
    <h1 className="not-found__title">404</h1>
    <p className="not-found__msg">ページが見つかりません</p>
    <Link to="/" className="not-found__link">トップへ戻る</Link>
  </div>
);

export default NotFound;
