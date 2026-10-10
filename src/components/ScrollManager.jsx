import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollManager = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (target) {
                target.scrollIntoView({ block: 'start', behavior: 'instant' });
                return;
            }
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, hash]);

    return null;
};

export default ScrollManager;
