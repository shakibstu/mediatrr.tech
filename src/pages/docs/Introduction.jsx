import React from 'react';
import { Link } from 'react-router-dom';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const Introduction = () => {
    return (
        <div>
            <h1>Introduction to MediatRR</h1>
            <p className="doc-lead">
                MediatRR is a mediator for .NET. It separates the code that asks for something from the
                code that does it: you send a request, stream a result or publish a notification, and
                MediatRR routes it to the handler through dependency injection.
            </p>

            <Callout variant="new" title="MediatRR 2.0">
                <p>
                    Version 2.0 makes notification processing safer: handlers are retried individually, keep
                    their DI scope until they finish, and the queue now pushes back when it is full. It
                    contains breaking changes; see <Link to="/docs/migrating-to-2">Migrating to 2.0</Link>.
                </p>
            </Callout>

            <H2>What is the Mediator Pattern?</H2>
            <p>
                The Mediator pattern defines an object that encapsulates how a set of objects interact.
                This pattern promotes loose coupling by keeping objects from referring to each other explicitly,
                and it lets you vary their interaction independently.
            </p>
            <p>
                In practice your controllers, endpoints and background jobs depend on a
                single <code>IMediator</code> instead of on every service they call. Each piece of work becomes a
                small message with one handler, which keeps classes focused and easy to test.
            </p>

            <H2>Key Features</H2>
            <ul>
                <li><strong>Request/response</strong>: send a request and get a typed response from exactly one handler</li>
                <li><strong>Streams</strong>: return <code>IAsyncEnumerable&lt;T&gt;</code> from a handler and consume items as they are produced</li>
                <li><strong>Notifications</strong>: publish an event to zero or more handlers on a background worker</li>
                <li><strong>Behaviors</strong>: wrap requests, streams, publishing and individual notification handlers with cross-cutting concerns</li>
                <li><strong>Resilience</strong>: per-handler retry policies, backpressure, graceful shutdown and a dead-letter queue</li>
                <li><strong>Compile-time registration</strong>: a source generator registers request and stream handlers without assembly scanning</li>
                <li><strong>Dependency injection</strong>: built on Microsoft.Extensions.DependencyInjection with predictable scoping</li>
            </ul>

            <H2>Packages</H2>
            <p>MediatRR ships as two NuGet packages, both targeting <code>netstandard2.0</code>:</p>
            <div className="table-wrap">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Package</th>
                            <th>Contains</th>
                            <th>Reference it from</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>MediatRR</code></td>
                            <td>
                                <code>IMediator</code>, <code>AddMediatRR</code> and the registration methods, the
                                notification worker, retry policies, the dead-letter queue and the source generator.
                                Depends on <code>MediatRR.Contract</code>.
                            </td>
                            <td>The composition root: your web app, worker service or host project</td>
                        </tr>
                        <tr>
                            <td><code>MediatRR.Contract</code></td>
                            <td>
                                Only the interfaces: <code>IRequest</code>, <code>IRequestHandler</code>,{' '}
                                <code>IStreamRequest</code>, <code>IStreamRequestHandler</code>,{' '}
                                <code>INotification</code>, <code>INotificationHandler</code>, the behavior
                                interfaces and the <code>Void</code> type
                            </td>
                            <td>Projects that define messages and handlers, such as a domain or application layer, so they never depend on the runtime</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <H2>When to Use MediatRR</H2>
            <p>MediatRR is a good fit for:</p>
            <ul>
                <li>CQRS (Command Query Responsibility Segregation) architectures</li>
                <li>Clean Architecture / Onion Architecture implementations</li>
                <li>Applications requiring clear separation of concerns</li>
                <li>Event-driven systems within a single application</li>
                <li>Decoupling business logic from infrastructure</li>
            </ul>
            <p>
                It is an in-process library. Notifications are queued in memory and processed by the same
                application; if you need durable delivery across processes, publish to a message broker from a
                notification handler.
            </p>

            <H2>Next Steps</H2>
            <ul>
                <li><Link to="/docs/installation">Installation</Link>: add the package and register the mediator</li>
                <li><Link to="/docs/basic-usage">Basic Usage</Link>: your first request and handler in a few lines</li>
                <li><Link to="/docs/notifications">Notifications</Link>: how the background worker, retries and the dead-letter queue work</li>
            </ul>
        </div>
    );
};

export default Introduction;
