import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'mediatrr-theme';
const THEME_COLORS = { dark: '#0f172a', light: '#ffffff' };

const readInitialTheme = () =>
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light'
        ? 'light'
        : 'dark';

const persistTheme = (theme) => {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
        return true;
    } catch {
        return false;
    }
};

export function useTheme() {
    const [theme, setTheme] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        persistTheme(next);
        setTheme(next);
    }, [theme]);

    return { theme, toggleTheme };
}
