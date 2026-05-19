import React, { useEffect, useState } from 'react';

const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

// Reads H2 headings out of the rendered article and renders a sticky right-rail TOC.
// `containerRef` is the article element; we re-scan when `slug` changes.
const DocTOC = ({ containerRef, slug }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return undefined;

        const h2s = Array.from(node.querySelectorAll('h2'));
        const items = h2s.map((h) => {
            if (!h.id) h.id = slugify(h.textContent || '');
            return { id: h.id, text: h.textContent || '' };
        });
        setHeadings(items);

        if (items.length === 0) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
        );

        h2s.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, [containerRef, slug]);

    if (headings.length < 2) return null;

    return (
        <aside className="doc-toc" aria-label="On this page">
            <h5>On this page</h5>
            <ul>
                {headings.map((h) => (
                    <li key={h.id}>
                        <a
                            href={`#${h.id}`}
                            className={activeId === h.id ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                history.replaceState(null, '', `#${h.id}`);
                            }}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default DocTOC;
