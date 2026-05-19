import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Activity } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

const heroSnippet = `// Define a request
public record Ping(string Message) : IRequest<string>;

// And a handler
public class PingHandler : IRequestHandler<Ping, string>
{
    public Task<string> Handle(Ping req, CancellationToken ct)
        => Task.FromResult($"{req.Message} Pong");
}

// Wire it up
services.AddMediatRR(_ => { }, new ConcurrentQueue<DeadLettersInfo>());
services.AddRequestHandler<Ping, string, PingHandler>();

// Use it
var response = await mediator.Send(new Ping("Hello"));
// "Hello Pong"`;

const Home = () => {
    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>
                        A mediator for .NET <br />
                        <span className="text-gradient">that doesn't get in your way</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto 2rem' }}>
                        Request/response, streams, and asynchronous notifications with
                        built-in retry policies and a dead-letter queue. MIT-licensed,
                        zero magic, drop-in for Microsoft.Extensions.DependencyInjection.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/docs" className="btn btn-primary">
                            Get Started <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                        </Link>
                        <a
                            href="https://github.com/shakibstu/MediatRR"
                            className="btn btn-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
            </section>

            <section className="container" style={{ padding: '0 2rem 2rem', maxWidth: '780px' }}>
                <CodeBlock code={heroSnippet} />
            </section>

            <section className="container" style={{ padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <FeatureCard
                        icon={<Zap size={32} color="var(--accent-primary)" />}
                        title="Fast by default"
                        description="Reflection results are cached per request type; per-call cost is two dictionary lookups, not a full type construction."
                    />
                    <FeatureCard
                        icon={<Shield size={32} color="var(--accent-secondary)" />}
                        title="Type safe"
                        description="C# generics keep requests, responses, and handlers checked at compile time — no string registries, no runtime surprises."
                    />
                    <FeatureCard
                        icon={<Activity size={32} color="#10b981" />}
                        title="Resilient notifications"
                        description="Async background worker with per-notification retry policies and a dead-letter queue so failures never disappear silently."
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
