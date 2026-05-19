import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <section className="hero">
        <div className="container">
            <h1>404</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                That page doesn't exist. It may have been renamed or moved.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
                <Link to="/docs" className="btn btn-secondary">Browse the Docs</Link>
            </div>
        </div>
    </section>
);

export default NotFound;
