import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchDocs } from '../data/searchIndex';
import { useFocusTrap } from '../utils/useFocusTrap';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useFocusTrap(containerRef, isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setHighlighted(0);
            // focus input after the trap moves focus to the first focusable element
            queueMicrotask(() => inputRef.current?.focus());
        }
    }, [isOpen]);

    const results = searchDocs(query);

    const go = (slug) => {
        navigate(`/docs/${slug}`);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlighted((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[highlighted]) {
            e.preventDefault();
            go(results[highlighted].slug);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div
                ref={containerRef}
                className="search-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Search documentation"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="search-input-wrapper">
                    <Search size={16} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search the docs…"
                        aria-label="Search query"
                    />
                    <button className="search-close" onClick={onClose} aria-label="Close search">Esc</button>
                </div>
                <ul className="search-results">
                    {query && results.length === 0 && (
                        <li className="search-empty">No matches for “{query}”.</li>
                    )}
                    {results.map((r, idx) => (
                        <li key={r.slug}>
                            <button
                                type="button"
                                className={idx === highlighted ? 'highlighted' : ''}
                                onMouseEnter={() => setHighlighted(idx)}
                                onClick={() => go(r.slug)}
                            >
                                <strong>{r.title}</strong>
                                <small>/docs/{r.slug}</small>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="search-footer">
                    <kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>Esc</kbd> close
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
