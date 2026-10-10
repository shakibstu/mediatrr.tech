import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { slugify } from '../utils/slugify';

const textOf = (children) =>
    React.Children.toArray(children)
        .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
        .join('');

const H2 = ({ id, children }) => {
    const text = textOf(children);
    const headingId = id ?? slugify(text);

    return (
        <h2 id={headingId} className="doc-heading">
            {children}
            <a className="heading-anchor" href={`#${headingId}`} aria-label={`Link to ${text}`}>
                <LinkIcon size={15} />
            </a>
        </h2>
    );
};

export default H2;
