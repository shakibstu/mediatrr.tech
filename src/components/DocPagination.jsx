import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DOCS_FLAT, findDocIndex } from '../data/navigation';

const DocPagination = ({ slug }) => {
    const idx = findDocIndex(slug);
    if (idx === -1) return null;

    const prev = idx > 0 ? DOCS_FLAT[idx - 1] : null;
    const next = idx < DOCS_FLAT.length - 1 ? DOCS_FLAT[idx + 1] : null;

    return (
        <nav className="doc-pagination" aria-label="Documentation pagination">
            {prev ? (
                <Link to={`/docs/${prev.slug}`} className="doc-pagination-link prev">
                    <ArrowLeft size={16} />
                    <span>
                        <small>Previous</small>
                        <strong>{prev.label}</strong>
                    </span>
                </Link>
            ) : <span />}
            {next ? (
                <Link to={`/docs/${next.slug}`} className="doc-pagination-link next">
                    <span>
                        <small>Next</small>
                        <strong>{next.label}</strong>
                    </span>
                    <ArrowRight size={16} />
                </Link>
            ) : <span />}
        </nav>
    );
};

export default DocPagination;
