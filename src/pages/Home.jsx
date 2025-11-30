import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Activity } from 'lucide-react';

const Home = () => {
    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>
                        The Ultimate Mediator Pattern <br />
                        <span className="text-gradient">Library for .NET</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Decouple your application with a robust, high-performance mediator implementation.
                        Built for modern .NET applications.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <Link to="/docs" className="btn btn-primary">
                            Get Started <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                        </Link>
                        <a href="https://github.com" className="btn btn-secondary">View on GitHub</a>
                    </div>
                </div>
            </section>

            <section className="container" style={{ padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <FeatureCard
                        icon={<Zap size={32} color="var(--accent-primary)" />}
                        title="High Performance"
                        description="Optimized for speed with minimal allocation overhead. Handles thousands of requests per second."
                    />
                    <FeatureCard
                        icon={<Shield size={32} color="var(--accent-secondary)" />}
                        title="Type Safe"
                        description="Leverage the full power of C# generics and compile-time checking for your requests and handlers."
                    />
                    <FeatureCard
                        icon={<Activity size={32} color="#10b981" />}
                        title="Resilient"
                        description="Built-in support for retry policies, circuit breakers, and dead-letter queues."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="card">
        <div style={{ marginBottom: '1rem' }}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

export default Home;
