import './GuideSection.scss';

type Props = {
  id: string;
  heading: string;
  children: React.ReactNode;
};

export const GuideSection = ({ id, heading, children }: Props) => (
  <section className="guide-section" id={id}>
    <h2 className="guide-section__heading">{heading}</h2>
    <div className="guide-section__body">{children}</div>
  </section>
);
