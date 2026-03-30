import { useEffect } from 'react';

type Props = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown>;
};

const SITE_NAME = 'GTA Online 攻略図鑑';

export const SEOHead = ({
  title,
  description,
  url,
  image,
  type = 'website',
  structuredData,
}: Props) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (nameOrProp: string, content: string) => {
      const isOgOrTwitter =
        nameOrProp.startsWith('og:') || nameOrProp.startsWith('twitter:');
      const attr = isOgOrTwitter ? 'property' : 'name';
      let el = document.querySelector(
        `meta[${attr}="${nameOrProp}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, nameOrProp);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle);
    setMeta('og:description', description);
    setMeta('og:type', type);
    setMeta('og:site_name', SITE_NAME);
    if (url) setMeta('og:url', url);
    if (image) setMeta('og:image', image);
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    const ldId = 'structured-data-jsonld';
    let ldScript = document.getElementById(ldId) as HTMLScriptElement | null;
    if (structuredData) {
      if (!ldScript) {
        ldScript = document.createElement('script');
        ldScript.id = ldId;
        ldScript.type = 'application/ld+json';
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(structuredData);
    } else {
      ldScript?.remove();
    }

    return () => {
      document.getElementById(ldId)?.remove();
    };
  }, [title, description, url, image, type, structuredData]);

  return null;
};
