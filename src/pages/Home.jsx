import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    Boxes,
    ChevronRight,
    Cpu,
    Database,
    Github,
    Inbox,
    Layers,
    Radio,
    RefreshCw,
    Scale,
    Send,
    Shield,
    Waves,
    Zap,
} from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import { usePageMeta } from '../hooks/usePageMeta';
import { MEDIATRR_VERSION } from '../data/version';
import { REPO_URL } from '../data/site';

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

const sendSnippet = `public record GetUser(string Id) : IRequest<User>;

var user = await mediator.Send(new GetUser("42"));`;

const streamSnippet = `public record TailLog(string File) : IStreamRequest<string>;

await foreach (var line in mediator.CreateStream(new TailLog("app.log")))
    Console.WriteLine(line);`;

const publishSnippet = `public record OrderPlaced(string OrderId) : INotification;

await mediator.Publish(new OrderPlaced("ORD-1"));
// handlers run on the background worker`;

const MESSAGE_KINDS = [
    {
        icon: Send,
        color: 'violet',
        title: 'Request / response',
        method: 'mediator.Send',
        text: 'Exactly one handler returns a typed response. Pipeline behaviors wrap the call, and each Send runs in its own DI scope.',
        code: sendSnippet,
        to: '/docs/requests',
    },
    {
        icon: Waves,
        color: 'blue',
        title: 'Streams',
        method: 'mediator.CreateStream',
        text: 'Handlers return IAsyncEnumerable<T>. Items reach the caller as they are produced, and the scope lives until enumeration ends.',
        code: streamSnippet,
        to: '/docs/streams',
    },
    {
        icon: Radio,
        color: 'green',
        title: 'Notifications',
        method: 'mediator.Publish',
        text: 'Zero or more handlers run on a background worker with per-handler retries, backpressure and a dead-letter queue.',
        code: publishSnippet,
        to: '/docs/notifications',
    },
];

const PIPELINE = [
    {
        icon: Send,
        title: 'Publish',
        code: 'mediator.Publish(evt)',
        text: 'Returns as soon as the notification is queued. Callers never wait for handlers.',
    },
    {
        icon: Layers,
        title: 'Notification behaviors',
        code: 'INotificationBehavior<T>',
        text: 'Run once per publish. Enrich, validate or drop the message before it is queued.',
    },
    {
        icon: Inbox,
        title: 'Bounded channel',
        code: 'NotificationChannelSize',
        text: 'When the queue is full and every slot is busy, Publish waits instead of growing memory.',
    },
    {
        icon: Cpu,
        title: 'Background worker',
        code: 'MaxConcurrentMessageConsumer',
        text: 'Runs handlers concurrently, each message in its own DI scope kept alive until the last handler finishes.',
    },
    {
        icon: RefreshCw,
        title: 'Per-handler retries',
        code: 'NotificationRetryPolicy',
        text: 'A failing handler is retried in place. Handlers that already succeeded run once.',
    },
    {
        icon: Database,
        title: 'Dead-letter queue',
        code: 'DeadLettersInfo',
        text: 'Whatever still fails is recorded with its exception, handler and attempt count, and a typed dead letter handler can react. Nothing disappears silently.',
    },
];

const FEATURES = [
    {
        icon: Zap,
        color: 'violet',
        title: 'Fast by default',
        text: 'Each message type gets a strongly typed dispatcher that is built once and cached, so every call reaches your handler through its interface with no reflection-based invocation.',
    },
    {
        icon: Shield,
        color: 'blue',
        title: 'Type safe',
        text: 'C# generics keep requests, responses and handlers checked at compile time. No string registries, no runtime surprises.',
    },
    {
        icon: Activity,
        color: 'green',
        title: 'Resilient notifications',
        text: 'A background worker with per-handler retries and backoff, backpressure, graceful shutdown, a dead-letter queue, typed dead letter handlers and metrics, so failures never disappear silently.',
    },
    {
        icon: Layers,
        color: 'violet',
        title: 'Scoped the way you expect',
        text: 'Send and CreateStream open one DI scope per call, shared by behaviors and the handler. Notification handlers get a per-message scope that lives until the last of them finishes.',
    },
    {
        icon: Boxes,
        color: 'blue',
        title: 'Registration without reflection',
        text: 'A source generator discovers request, stream and dead letter handlers at compile time, so start-up does no assembly scanning and the generated code compiles as C# 7.3.',
    },
    {
        icon: Scale,
        color: 'green',
        title: 'Free, forever',
        text: 'MIT-licensed with no commercial tier, license keys or usage limits. Two small packages that depend only on the Microsoft.Extensions abstractions.',
    },
];

const IconBadge = ({ icon, color }) => {
    const Icon = icon;
    return (
        <span className={`feature-icon ${color}`}>
            <Icon size={20} />
        </span>
    );
};

const KindCard = ({ icon, color, title, method, text, code, to }) => (
    <article className="card kind-card">
        <header className="kind-card-header">
            <IconBadge icon={icon} color={color} />
            <div>
                <h3>{title}</h3>
                <span className="kind-method">{method}</span>
            </div>
        </header>
        <p>{text}</p>
        <CodeBlock code={code} />
        <Link to={to} className="card-link">
            Read the guide <ChevronRight size={16} />
        </Link>
    </article>
);

const PipelineStep = ({ icon, title, code, text }) => {
    const Icon = icon;
    return (
        <li className="pipeline-step">
            <Icon className="pipeline-icon" size={20} aria-hidden="true" />
            <h3>{title}</h3>
            <code>{code}</code>
            <p>{text}</p>
            <ChevronRight className="pipeline-arrow" size={18} aria-hidden="true" />
        </li>
    );
};

const FeatureCard = ({ icon, color, title, text }) => (
    <article className="card feature-card">
        <IconBadge icon={icon} color={color} />
        <h3>{title}</h3>
        <p>{text}</p>
    </article>
);

const Home = () => {
    usePageMeta();

    return (
        <div className="home">
            <section className="hero">
                <div className="container">
                    <p className="hero-eyebrow">
                        <span className="hero-dot" aria-hidden="true" />
                        <span>MediatRR {MEDIATRR_VERSION} is out.</span>
                        <Link to="/docs/migrating-to-2">See what changed</Link>
                    </p>
                    <h1>
                        A mediator for .NET <br />
                        <span className="text-gradient">that doesn't get in your way</span>
                    </h1>
                    <p className="hero-lead">
                        Request/response, streams and asynchronous notifications with retry policies,
                        backpressure and a dead-letter queue. MIT-licensed, free forever, and a drop-in
                        for Microsoft.<wbr />Extensions.<wbr />DependencyInjection.
                    </p>
                    <div className="hero-actions">
                        <Link to="/docs" className="btn btn-primary">
                            Get started <ArrowRight size={18} />
                        </Link>
                        <a href={REPO_URL} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                            <Github size={18} /> View on GitHub
                        </a>
                    </div>
                    <div className="hero-install">
                        <CodeBlock code="dotnet add package MediatRR" language="bash" />
                    </div>
                    <ul className="hero-facts" aria-label="Package facts">
                        <li>.NET Standard 2.0</li>
                        <li>MIT license</li>
                        <li>Typed dispatch, cached per message</li>
                        <li>Source-generated registration</li>
                    </ul>
                </div>
            </section>

            <section className="container section-code">
                <CodeBlock code={heroSnippet} title="Program.cs" />
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title">Three ways to send a message</h2>
                    <p className="section-lead">
                        One <code>IMediator</code>, three verbs. Pick the shape that matches the work.
                    </p>
                    <div className="grid-3">
                        {MESSAGE_KINDS.map((kind) => (
                            <KindCard key={kind.title} {...kind} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-pipeline">
                <div className="container">
                    <h2 className="section-title">Notifications that survive failure</h2>
                    <p className="section-lead">
                        Publishing is cheap and never blocks on your handlers. Everything after the queue
                        is built so that a failure is retried, bounded and recorded, never swallowed.
                    </p>
                    <ol className="pipeline">
                        {PIPELINE.map((step) => (
                            <PipelineStep key={step.title} {...step} />
                        ))}
                    </ol>
                    <p className="section-cta">
                        <Link to="/docs/notifications" className="btn btn-secondary">
                            How notifications work <ArrowRight size={16} />
                        </Link>
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title">Why MediatRR</h2>
                    <div className="grid-3">
                        {FEATURES.map((feature) => (
                            <FeatureCard key={feature.title} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="cta-band">
                    <h2>Ready in a minute</h2>
                    <p>
                        Install the package, register a handler and send your first request. Already on
                        2.0? See what 2.1 adds without changing a line.
                    </p>
                    <div className="hero-actions">
                        <Link to="/docs/basic-usage" className="btn btn-primary">
                            Basic usage <ArrowRight size={18} />
                        </Link>
                        <Link to="/docs/whats-new-2-1" className="btn btn-secondary">
                            What's new in 2.1
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
