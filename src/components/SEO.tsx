import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export const SEO = ({ 
  title, 
  description, 
  keywords,
  image = 'https://cdn.poehali.dev/projects/86728bc5-4442-476e-8229-9b10df881a0f/files/13afd5fc-b021-4d41-af8c-d013d1dfa433.jpg',
  type = 'website'
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = 'https://timearchive2010.poehali.app';
  const currentUrl = `${baseUrl}${location.pathname}`;

  const defaultTitle = 'Архив времени 2010-2011 | Документы эпохи перемен';
  const defaultDescription = 'Цифровой архив документов 2010-2011 годов. Исследуйте свидетельства эпохи через призму времени.';
  const defaultKeywords = 'архив 2010-2011, исторические документы, цифровой архив, свидетельства эпохи';

  const pageTitle = title ? `${title} | Архив времени` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;

  useEffect(() => {
    document.title = pageTitle;

    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);
    
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:type', type, true);
    
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:url', currentUrl);
    updateMetaTag('twitter:image', image);
  }, [pageTitle, pageDescription, pageKeywords, currentUrl, image, type]);

  return null;
};
