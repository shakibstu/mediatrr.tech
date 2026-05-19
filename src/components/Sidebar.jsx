import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { DOCS_SECTIONS } from '../data/navigation';
import { useFocusTrap } from '../utils/useFocusTrap';

const Sidebar = ({ isOpen, onClose }) => {
    const ref = useRef(null);
    useFocusTrap(ref, isOpen, onClose);

    return (
        <aside
            ref={ref}
            className={`sidebar ${isOpen ? 'open' : ''}`}
            aria-label="Documentation navigation"
            aria-hidden={!isOpen && typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches}
        >
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">&times;</button>
            {DOCS_SECTIONS.map((section) => (
                <div key={section.title} className="sidebar-section">
                    <h4>{section.title}</h4>
                    {section.items.map((item) => (
                        <NavLink
                            key={item.slug}
                            to={`/docs/${item.slug}`}
                            onClick={onClose}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;
