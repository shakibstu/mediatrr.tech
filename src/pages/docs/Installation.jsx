import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const Installation = () => {
    const installCode = `dotnet add package MediatRR`;

    const contractInstallCode = `dotnet add package MediatRR.Contract`;

    const setupCode = `using MediatRR;
using MediatRR.Contract.Messaging;
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
        "{Notification} failed in {Handler} after {Attempts} attempt(s) at {At}",
        deadLetter.Message.GetType().Name,
        deadLetter.HandlerType?.Name ?? "(no handler ran)",
        deadLetter.AttemptCount,
        deadLetter.LastAttemptedAt);
}`;

    const aspNetCode = `var builder = WebApplication.CreateBuilder(args);

var deadLetters = new ConcurrentQueue<DeadLettersInfo>();
builder.Services.AddMediatRR(cfg => { }, deadLetters);

// Register your handlers
builder.Services.AddRequestHandler<MyRequest, MyResponse, MyRequestHandler>();

var app = builder.Build();`;

    return (
        <div>
            <h1>Installation</h1>
            <p className="doc-lead">
                Add the package to the project that builds your service provider, register MediatRR, and
                you are ready to send requests. Notifications additionally need the hosted worker to run.
            </p>

            <H2>Package Installation</H2>
            <p>Install MediatRR via the NuGet Package Manager or the .NET CLI:</p>
            <CodeBlock code={installCode} language="bash" />
            <p>
                MediatRR targets <code>netstandard2.0</code> and depends only on the Microsoft.Extensions
                abstraction packages (version 8.0 or later), <code>System.Threading.Channels</code> and{' '}
                <code>System.Diagnostics.DiagnosticSource</code>, so it does not pull a hosting stack into
                your application. The source generator used
                for <Link to="/docs/auto-registration">auto-registration</Link> ships in the same package.
            </p>
            <p>
                Projects that only define requests, notifications and handlers, such as an application or
                domain layer, can reference the interfaces alone:
            </p>
            <CodeBlock code={contractInstallCode} language="bash" />
            <p>
                <code>MediatRR</code> depends on <code>MediatRR.Contract</code>, so the host project gets both.
                See <Link to="/docs/introduction#packages">Packages</Link> for what each one contains.
            </p>

            <H2>Basic Setup</H2>
            <p>
                Register MediatRR in your dependency injection container. The library requires
                a configuration action and a non-null dead-letter queue for handling failed notifications.
            </p>
            <CodeBlock code={setupCode} />

            <Callout variant="warning" title="Notifications need a running host">
                <p>
                    Notification handlers are executed by a hosted background service. In ASP.NET Core or
                    the generic host it starts and stops with the application. If you build a
                    plain <code>ServiceCollection</code> as above, nothing starts it: <code>Publish</code> queues
                    the notification and no handler runs. Start the worker yourself:
                </p>
                <CodeBlock code={workerCode} />
            </Callout>

            <Callout variant="info" title="Lifetime and scoping">
                <p>
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
            </Callout>

            <H2>Configuration Options</H2>
            <p>The <code>AddMediatRR</code> method accepts a configuration action with the following options:</p>
            <div className="table-wrap">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Default</th>
                            <th>Meaning</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>NotificationChannelSize</code></td>
                            <td>10,000</td>
                            <td>How many published notifications can wait in the queue before <code>Publish</code> blocks</td>
                        </tr>
                        <tr>
                            <td><code>MaxConcurrentMessageConsumer</code></td>
                            <td>5</td>
                            <td>How many notification handler executions run at the same time, across all notifications</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                Both values must be at least 1; <code>AddMediatRR</code> throws{' '}
                <code>ArgumentOutOfRangeException</code> otherwise. When every handler slot is busy and the
                channel is full, <code>Publish</code> waits for room instead of growing memory. Calling{' '}
                <code>AddMediatRR</code> more than once is safe: only the first call registers the worker.
            </p>

            <H2>Dead Letter Queue</H2>
            <p>
                The <code>deadLetters</code> parameter is a <code>ConcurrentQueue&lt;DeadLettersInfo&gt;</code> that collects
                notifications that failed to process after all retry attempts. This allows you to:
            </p>
            <ul>
                <li>Monitor and log failed notifications</li>
                <li>Implement custom retry logic or manual intervention</li>
                <li>Analyze patterns in notification failures</li>
                <li>Ensure no notifications are silently lost</li>
            </ul>
            <p>Each <code>DeadLettersInfo</code> entry contains:</p>
            <ul>
                <li><code>Message</code>: the notification that failed (never <code>null</code>)</li>
                <li><code>Exception</code>: the exception that caused the failure; the last one when the handler was retried</li>
                <li>
                    <code>AttemptCount</code>: the total number of times the handler ran, including retries;{' '}
                    <code>0</code> when no handler ran, for example because a handler could not be created
                </li>
                <li>
                    <code>HandlerType</code> (2.1): the handler that failed; <code>null</code> when no handler
                    ran. For a failing dead letter handler it is that handler's type
                </li>
                <li><code>LastAttemptedAt</code>: the UTC time of the last attempt</li>
            </ul>
            <p>
                Notifications abandoned during a forced shutdown are added too, with an{' '}
                <code>OperationCanceledException</code>, so you can investigate and reprocess them.
            </p>
            <CodeBlock code={deadLetterCode} />
            <p>
                Polling is optional. Since 2.1 you can also register
                an <Link to="/docs/dead-letter-handlers"><code>IDeadLetterHandler&lt;TNotification&gt;</code></Link>{' '}
                that is called with the typed notification as soon as it is dead-lettered. The queue still
                records every entry either way.
            </p>

            <H2>ASP.NET Core Integration</H2>
            <p>
                In an ASP.NET Core application, register MediatRR in your <code>Program.cs</code> or{' '}
                <code>Startup.cs</code>. The notification worker starts and stops with the application:
            </p>
            <CodeBlock code={aspNetCode} />

            <Callout variant="tip" title="Skip the manual registrations">
                <p>
                    With <Link to="/docs/auto-registration">auto-registration</Link> the source generator
                    discovers every request, stream and dead letter handler in the project at compile time,
                    so the only handlers you register by hand are notification handlers and their retry
                    policies.
                </p>
            </Callout>
        </div>
    );
};

export default Installation;
