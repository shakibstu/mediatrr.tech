import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const MigratingTo2 = () => {
    const updateCode = `dotnet add package MediatRR --version 2.0.0`;

    const registrationCode = `// 1.x
services.AddMediatRR(new MediatRRConfiguration { MaxConcurrentMessageConsumer = 8 });

// 2.0
var deadLetters = new ConcurrentQueue<DeadLettersInfo>();
services.AddMediatRR(cfg => cfg.MaxConcurrentMessageConsumer = 8, deadLetters);`;

    const attemptCountCode = `// MaxRetryAttempts = 2 and a handler that always fails:
// 1.x: AttemptCount == 2 (retries made)
// 2.0: AttemptCount == 3 (the first attempt plus 2 retries)

if (deadLetter.AttemptCount == 0)
{
    // 2.0 only: no handler ran, for example because it could not be created
    // or the notification was abandoned at shutdown before it started
}`;

    const publishCode = `try
{
    await mediator.Publish(notification);
}
catch (InvalidOperationException) // ChannelClosedException in 1.x
{
    // The host has stopped; the notification was not queued
}`;

    return (
        <div>
            <h1>Migrating to 2.0</h1>
            <p className="doc-lead">
                MediatRR 2.0 reworks how notifications are processed and fixes how handlers are dispatched and
                registered. The handler and behavior interfaces in <code>MediatRR.Contract</code> are unchanged,
                so requests, streams and behaviors keep compiling as they are. Most applications only need the
                steps below.
            </p>

            <H2>Breaking Changes</H2>
            <div className="table-wrap">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Area</th>
                            <th>1.x</th>
                            <th>2.0</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>AddMediatRR</code> taking a <code>MediatRRConfiguration</code></td>
                            <td>Public, but a host using it could not start</td>
                            <td>Removed; pass a configuration action and a dead-letter queue</td>
                        </tr>
                        <tr>
                            <td>Retry</td>
                            <td>Re-ran every handler of the notification</td>
                            <td>Re-runs only the failing handler, in place</td>
                        </tr>
                        <tr>
                            <td><code>DeadLettersInfo.AttemptCount</code></td>
                            <td>Number of retries</td>
                            <td>Total number of attempts; <code>0</code> when no handler ran</td>
                        </tr>
                        <tr>
                            <td>Handler behavior failure</td>
                            <td>Dead-lettered with a <code>null</code> message, never retried</td>
                            <td>Retried under the policy, dead-lettered with the message</td>
                        </tr>
                        <tr>
                            <td>Backpressure</td>
                            <td>None; a notification waiting 60 s for a slot was dead-lettered</td>
                            <td><code>Publish</code> waits when the queue and all handler slots are full</td>
                        </tr>
                        <tr>
                            <td><code>Publish</code> after shutdown</td>
                            <td><code>ChannelClosedException</code></td>
                            <td><code>InvalidOperationException</code></td>
                        </tr>
                        <tr>
                            <td>Omitted retry policy</td>
                            <td>Counted as the default policy and conflicted with an explicit one</td>
                            <td>No opinion; the notification type uses its other handlers' policy</td>
                        </tr>
                        <tr>
                            <td>Invalid configuration</td>
                            <td>Accepted, or failed later</td>
                            <td><code>ArgumentOutOfRangeException</code> from <code>AddMediatRR</code></td>
                        </tr>
                        <tr>
                            <td>Generated registration code</td>
                            <td>Required C# 10</td>
                            <td>Compiles as C# 7.3</td>
                        </tr>
                        <tr>
                            <td>Package dependencies</td>
                            <td><code>Microsoft.Extensions.Hosting</code> 10.0.9</td>
                            <td>Microsoft.Extensions abstraction packages 8.0 or later</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <H2>Upgrade Steps</H2>
            <ol>
                <li>
                    <p>Update the package, and <code>MediatRR.Contract</code> too if you reference it directly:</p>
                    <CodeBlock code={updateCode} language="bash" />
                </li>
                <li>
                    <p>
                        If you called the overload that takes a <code>MediatRRConfiguration</code>, switch to the
                        configuration action and pass a dead-letter queue:
                    </p>
                    <CodeBlock code={registrationCode} />
                </li>
                <li>
                    <p>
                        Revisit code that reads <code>DeadLettersInfo.AttemptCount</code>. It now counts every
                        attempt, and <code>Message</code> is never <code>null</code>:
                    </p>
                    <CodeBlock code={attemptCountCode} />
                </li>
                <li>
                    <p>
                        If you publish while the application shuts down, catch{' '}
                        <code>InvalidOperationException</code> instead of <code>ChannelClosedException</code>:
                    </p>
                    <CodeBlock code={publishCode} />
                </li>
                <li>
                    <p>
                        Check your configuration: <code>NotificationChannelSize</code>,{' '}
                        <code>MaxConcurrentMessageConsumer</code> and retry policies with negative values now
                        throw <code>ArgumentOutOfRangeException</code> at registration.
                    </p>
                </li>
                <li>
                    <p>
                        Review retry expectations. Healthy handlers no longer run again when a sibling fails, and
                        exceptions from an <code>INotificationHandlerBehavior</code> are now retried. See{' '}
                        <Link to="/docs/notifications">Notifications</Link> for the full model.
                    </p>
                </li>
            </ol>

            <Callout variant="info" title="Multi-project solutions">
                <p>
                    The generated registration methods are internal to each project. If handlers live in a
                    class library, give that project its own <code>MediatRR</code> package reference and call its
                    generated methods from inside it, as shown
                    in <Link to="/docs/auto-registration#handlers-in-other-projects">Auto-Registration</Link>.
                </p>
            </Callout>

            <H2>Fixed in 2.0</H2>
            <ul>
                <li>Notification handlers keep their scoped dependencies until they finish; 1.x disposed the scope while handlers were still running</li>
                <li>A handler that cannot be created, or a behavior that throws, no longer stops notification processing for the whole application</li>
                <li>Shutdown honours the host's shutdown timeout, and abandoned notifications are dead-lettered instead of disappearing</li>
                <li>Explicit interface implementations and classes that handle several message types are dispatched correctly, and exceptions keep their original type</li>
                <li>Scoped services that implement only <code>IAsyncDisposable</code> no longer make <code>Send</code> fail</li>
                <li>Calling <code>AddMediatRR</code> twice no longer starts two workers</li>
                <li><code>Publish</code> no longer creates handler instances just to check whether any are registered</li>
                <li>
                    The source generator registers records and every handler interface of a class, skips types it
                    cannot register, and loads on the .NET SDK 6.0.400 or later
                    (see <Link to="/docs/auto-registration">Auto-Registration</Link>)
                </li>
                <li><code>MediatRR.dll</code> no longer references Roslyn, so reflection-based assembly scanning over it works</li>
            </ul>
        </div>
    );
};

export default MigratingTo2;
