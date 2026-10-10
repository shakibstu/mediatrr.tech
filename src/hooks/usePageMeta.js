import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from '../data/site';

const setContent = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
};

export function usePageMeta({ title, description } = {}) {
    const { pathname } = useLocation();

    useEffect(() => {
        const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
        const text = description || SITE_DESCRIPTION;
        const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
        const url = `${SITE_URL}${path}`;

        document.title = fullTitle;
        setContent('meta[name="description"]', text);
        setContent('meta[property="og:title"]', fullTitle);
        setContent('meta[property="og:description"]', text);
        setContent('meta[property="og:url"]', url);
        setContent('meta[name="twitter:title"]', fullTitle);
        setContent('meta[name="twitter:description"]', text);
        document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    }, [title, description, pathname]);
}
