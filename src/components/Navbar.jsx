import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Search } from 'lucide-react';
import { MEDIATRR_VERSION } from '../data/version';

const Navbar = ({ onSearchOpen }) => {
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                onSearchOpen?.();
            } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                onSearchOpen?.();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onSearchOpen]);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                MediatRR
                <span className="nav-version" aria-label={`Library version ${MEDIATRR_VERSION}`}>v{MEDIATRR_VERSION}</span>
            </Link>
            <div className="nav-links">
                <button
                    type="button"
                    className="nav-search-btn"
                    onClick={onSearchOpen}
                    aria-label="Search the docs"
                >
                    <Search size={14} />
                    <span>Search</span>
                    <kbd>/</kbd>
                </button>
                <Link to="/docs" className="nav-link">Documentation</Link>
                <a
                    href="https://github.com/shakibstu/MediatRR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                    aria-label="GitHub repository"
                >
                    <Github size={20} />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
