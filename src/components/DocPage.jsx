import React, { useRef } from 'react';
import { Pencil } from 'lucide-react';
import DocTOC from './DocTOC';
import DocPagination from './DocPagination';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE_REPO_URL } from '../data/site';

// Wraps a doc page: renders the article, the right-rail TOC,
// and the previous/next pagination.
const DocPage = ({ doc, children }) => {
    const articleRef = useRef(null);
    usePageMeta({ title: doc.label, description: doc.description });

    return (
        <div className="doc-page">
            <article ref={articleRef} className="doc-article">
                <p className="doc-eyebrow">{doc.section}</p>
                {children}
                <div className="doc-footer-links">
                    <a
                        className="doc-edit-link"
                        href={`${SITE_REPO_URL}/edit/main/src/pages/docs/${doc.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Pencil size={14} /> Edit this page on GitHub
                    </a>
                </div>
                <DocPagination slug={doc.slug} />
            </article>
            <DocTOC containerRef={articleRef} slug={doc.slug} />
        </div>
    );
};

export default DocPage;
