import { useEffect } from 'react';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

// Traps Tab inside `containerRef` while `active`. Escape calls `onEscape`.
export function useFocusTrap(containerRef, active, onEscape) {
    useEffect(() => {
        if (!active || !containerRef.current) return undefined;
        const node = containerRef.current;
        const previouslyFocused = document.activeElement;

        const focusable = () => Array.from(node.querySelectorAll(FOCUSABLE)).filter(
            (el) => !el.hasAttribute('aria-hidden')
        );
        const first = focusable()[0];
        first?.focus();

        const handleKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onEscape?.();
                return;
            }
            if (e.key !== 'Tab') return;
            const elements = focusable();
            if (elements.length === 0) return;
            const firstEl = elements[0];
            const lastEl = elements[elements.length - 1];
            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        };

        node.addEventListener('keydown', handleKey);
        return () => {
            node.removeEventListener('keydown', handleKey);
            if (previouslyFocused && previouslyFocused.focus) {
                previouslyFocused.focus();
            }
        };
    }, [active, containerRef, onEscape]);
}
