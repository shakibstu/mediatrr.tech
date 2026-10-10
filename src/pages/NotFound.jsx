import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFound = () => {
    usePageMeta({ title: 'Page not found', description: 'The page you were looking for does not exist.' });

    return (
        <section className="hero">
            <div className="container">
                <h1>404</h1>
                <p className="hero-lead">
                    That page doesn't exist. It may have been renamed or moved.
                </p>
                <div className="hero-actions">
                    <Link to="/" className="btn btn-primary">Back to Home</Link>
                    <Link to="/docs" className="btn btn-secondary">Browse the Docs</Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
