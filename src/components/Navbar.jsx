import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Github, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { MEDIATRR_VERSION } from '../data/version';
import { NUGET_URL, REPO_URL } from '../data/site';

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
        <header className="navbar">
            <Link to="/" className="nav-brand">
                <span className="nav-brand-text">MediatRR</span>
                <span className="nav-version" aria-label={`Library version ${MEDIATRR_VERSION}`}>v{MEDIATRR_VERSION}</span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
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
                <NavLink to="/docs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-link-long">Documentation</span>
                    <span className="nav-link-short">Docs</span>
                </NavLink>
                <a
                    href={NUGET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link nav-link-wide"
                >
                    NuGet
                </a>
                <ThemeToggle />
                <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label="GitHub repository"
                >
                    <Github size={18} />
                </a>
            </nav>
        </header>
    );
};

export default Navbar;
