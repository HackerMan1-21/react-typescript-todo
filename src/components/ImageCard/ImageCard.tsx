import './ImageCard.scss';

type Props = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

export const ImageCard = ({ src, alt, title, caption }: Props) => (
  <figure className="image-card">
    <img className="image-card__img" src={src} alt={alt} loading="lazy" />
    {(title || caption) && (
      <figcaption className="image-card__caption">
        {title && <strong className="image-card__title">{title}</strong>}
        {caption && <span className="image-card__sub">{caption}</span>}
      </figcaption>
    )}
  </figure>
);
