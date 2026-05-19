import React, { useRef } from 'react';
import DocTOC from './DocTOC';
import DocPagination from './DocPagination';

// Wraps a doc page: renders the article, the right-rail TOC,
// and the previous/next pagination.
const DocPage = ({ slug, children }) => {
    const articleRef = useRef(null);

    return (
        <div className="doc-page">
            <article ref={articleRef} className="doc-article">
                {children}
                <DocPagination slug={slug} />
            </article>
            <DocTOC containerRef={articleRef} slug={slug} />
        </div>
    );
};

export default DocPage;
