import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';

const Installation = () => {
    const installCode = `dotnet add package MediatRR`;

    const setupCode = `using MediatRR.Contract.Messaging;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;

var services = new ServiceCollection();
var deadLetters = new ConcurrentQueue<DeadLettersInfo>();

// Register MediatRR
services.AddMediatRR(cfg => 
{
    cfg.NotificationChannelSize = 100;
    cfg.MaxConcurrentMessageConsumer = 5;
}, deadLetters);

var provider = services.BuildServiceProvider();
var mediator = provider.GetRequiredService<IMediator>();`;

    const workerCode = `var worker = provider.GetRequiredService<IHostedService>();
await worker.StartAsync(CancellationToken.None);

// ... publish notifications ...

await worker.StopAsync(CancellationToken.None); // drains the queue before returning`;

    const deadLetterCode = `while (deadLetters.TryDequeue(out var deadLetter))
{
    logger.LogError(deadLetter.Exception,
        "{Notification} failed after {Attempts} attempt(s) at {At}",
        deadLetter.Message.GetType().Name,
        deadLetter.AttemptCount,
        deadLetter.LastAttemptedAt);
}`;

    return (
        <div>
            <h1>Installation</h1>

            <h2>Package Installation</h2>
            <p>Install MediatRR via NuGet Package Manager or the .NET CLI:</p>
            <CodeBlock code={installCode} language="bash" />
            <p>
                MediatRR targets <code>netstandard2.0</code> and depends only on the Microsoft.Extensions
                abstraction packages (version 8.0 or later) and <code>System.Threading.Channels</code>, so it
                does not pull a hosting stack into your application. The source generator used
                for <Link to="/docs/auto-registration">auto-registration</Link> ships in the same package.
            </p>

            <h2>Basic Setup</h2>
            <p>
                Register MediatRR in your dependency injection container. The library requires
                a configuration action and a non-null dead-letter queue for handling failed notifications.
            </p>
            <CodeBlock code={setupCode} />

            <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(234, 179, 8, 0.08)', borderColor: 'rgba(234, 179, 8, 0.4)' }}>
                <h3>⚠️ Notifications need a running host</h3>
                <p>
                    Notification handlers are executed by a hosted background service. In ASP.NET Core or
                    the generic host it starts and stops with the application. If you build a
                    plain <code>ServiceCollection</code> as above, nothing starts it: <code>Publish</code> queues
                    the notification and no handler runs. Start the worker yourself:
                </p>
                <CodeBlock code={workerCode} />
            </div>

            <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(59, 130, 246, 0.08)', borderColor: 'var(--accent-secondary)' }}>
                <h3>🔍 Lifetime &amp; scoping</h3>
                <p style={{ marginBottom: 0 }}>
                    <code>IMediator</code> is registered as transient. <code>Send</code> and{' '}
                    <code>CreateStream</code> each open their own DI scope, shared between the pipeline
                    behaviors and the handler, so scoped dependencies such as a <code>DbContext</code> resolve
                    once per call. For <code>CreateStream</code> that scope lives until the
                    returned <code>IAsyncEnumerable</code> is fully enumerated or its enumerator is disposed.
                    Handlers never share the scope of the code that calls the mediator: a scoped service your
                    controller holds is a different instance from the one the handler
                    receives. <code>Publish</code> opens a scope for its notification behaviors and then queues
                    the notification; each handler runs later in the background worker, in a per-message scope
                    that stays alive until every handler of that message has finished.
                </p>
            </div>

            <h2>Configuration Options</h2>
            <p>The <code>AddMediatRR</code> method accepts a configuration action with the following options:</p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><code>NotificationChannelSize</code>: The size of the notification channel buffer (default: 10,000)</li>
                <li><code>MaxConcurrentMessageConsumer</code>: Maximum number of notification handler executions that run at once (default: 5)</li>
            </ul>
            <p>
                Both values must be at least 1; <code>AddMediatRR</code> throws{' '}
                <code>ArgumentOutOfRangeException</code> otherwise. When every handler slot is busy and the
                channel is full, <code>Publish</code> waits for room instead of growing memory. Calling{' '}
                <code>AddMediatRR</code> more than once is safe: only the first call registers the worker.
            </p>

            <h2>Dead Letter Queue</h2>
            <p>
                The <code>deadLetters</code> parameter is a <code>ConcurrentQueue&lt;DeadLettersInfo&gt;</code> that collects
                notifications that failed to process after all retry attempts. This allows you to:
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li>Monitor and log failed notifications</li>
                <li>Implement custom retry logic or manual intervention</li>
                <li>Analyze patterns in notification failures</li>
                <li>Ensure no notifications are silently lost</li>
            </ul>
            <p>Each <code>DeadLettersInfo</code> entry contains:</p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><code>Message</code>: the notification that failed (never <code>null</code>)</li>
                <li><code>Exception</code>: the exception that caused the failure; the last one when the handler was retried</li>
                <li>
                    <code>AttemptCount</code>: the total number of times the handler ran, including retries;{' '}
                    <code>0</code> when no handler ran, for example because a handler could not be created
                </li>
                <li><code>LastAttemptedAt</code>: the UTC time of the last attempt</li>
            </ul>
            <p>
                Notifications abandoned during a forced shutdown are added too, with an{' '}
                <code>OperationCanceledException</code>, so you can investigate and reprocess them.
            </p>
            <CodeBlock code={deadLetterCode} />

            <h2>ASP.NET Core Integration</h2>
            <p>
                In an ASP.NET Core application, register MediatRR in your <code>Program.cs</code> or{' '}
                <code>Startup.cs</code>. The notification worker starts and stops with the application:
            </p>
            <CodeBlock code={`var builder = WebApplication.CreateBuilder(args);

var deadLetters = new ConcurrentQueue<DeadLettersInfo>();
builder.Services.AddMediatRR(cfg => { }, deadLetters);

// Register your handlers
builder.Services.AddRequestHandler<MyRequest, MyResponse, MyRequestHandler>();

var app = builder.Build();`} />
        </div>
    );
};

export default Installation;
