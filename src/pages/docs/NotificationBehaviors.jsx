import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const NotificationBehaviors = () => {
    const notificationBehaviorCode = `// Wraps the Publish call, around queuing the notification
public class NotificationLoggingBehavior<TNotification> : INotificationBehavior<TNotification>
    where TNotification : INotification
{
    public async Task Handle(
        TNotification notification,
        Func<Task> next,
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine($"Publishing {typeof(TNotification).Name}");
        await next();
        Console.WriteLine($"Queued {typeof(TNotification).Name}");
    }
}`;

    const handlerBehaviorCode = `// Wraps each individual handler execution
public class NotificationHandlerLoggingBehavior<TNotification>
    : INotificationHandlerBehavior<TNotification>
    where TNotification : INotification
{
    public async Task Handle(
        TNotification notification,
        Func<Task> next,
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine("Before handler execution");
        await next();
        Console.WriteLine("After handler execution");
    }
}`;

    const registrationCode = `// Register notification behaviors
services.AddTransient(typeof(INotificationBehavior<>),
    typeof(NotificationLoggingBehavior<>));

// Register notification handler behaviors
services.AddTransient(typeof(INotificationHandlerBehavior<>),
    typeof(NotificationHandlerLoggingBehavior<>));`;

    const executionOrderCode = `// Inside mediator.Publish(notification):
// 1. NotificationBehavior (before)
// 2. The notification is queued for the background worker
// 3. NotificationBehavior (after)
//    Publish returns here, without waiting for the handlers.
//
// Later, in the background worker, for each handler
// (handlers run concurrently, up to MaxConcurrentMessageConsumer):
// 4. NotificationHandlerBehavior (before)
// 5. Handler
// 6. NotificationHandlerBehavior (after)
//    Steps 4 to 6 repeat on every retry attempt of that handler.`;

    return (
        <div>
            <h1>Notification Behaviors</h1>
            <p className="doc-lead">
                MediatRR provides two types of behaviors for notifications, allowing you to add
                cross-cutting concerns at different levels of the notification pipeline.
            </p>

            <H2>INotificationBehavior</H2>
            <p>
                <code>INotificationBehavior&lt;TNotification&gt;</code> wraps the publishing step. It runs once
                per <code>Publish</code> call, inside <code>Publish</code>, around queuing the notification.
                Handlers run later in the background worker, so this behavior finishes before they start and
                never sees their outcome. If a behavior does not call <code>next()</code>, the notification is
                not queued and no handler runs. Exceptions it throws reach the <code>Publish</code> caller.
            </p>
            <CodeBlock code={notificationBehaviorCode} />

            <Callout variant="tip" title="Use cases">
                <ul>
                    <li>Logging or auditing that a notification was published</li>
                    <li>Validating or enriching a notification before it is queued</li>
                    <li>Filtering: dropping notifications that should not be processed</li>
                    <li>Metrics on how often notifications are published</li>
                </ul>
            </Callout>

            <H2>INotificationHandlerBehavior</H2>
            <p>
                <code>INotificationHandlerBehavior&lt;TNotification&gt;</code> wraps each individual
                handler execution. It runs in the background worker, inside the notification's DI scope, once
                for every attempt of every handler, including retries. An exception it throws counts as a
                failure of that handler: it is retried under the
                notification's <Link to="/docs/notifications">retry policy</Link> and then dead-lettered.
            </p>
            <CodeBlock code={handlerBehaviorCode} />

            <Callout variant="tip" title="Use cases">
                <ul>
                    <li>Per-handler logging and tracing</li>
                    <li>Performance tracking per handler</li>
                    <li>Per-handler error handling or enrichment</li>
                    <li>Setting up per-handler context, such as a correlation ID</li>
                </ul>
            </Callout>

            <H2>Registration</H2>
            <p>
                Register both types of behaviors as open generics:
            </p>
            <CodeBlock code={registrationCode} />

            <H2>Execution Order</H2>
            <p>
                The two behavior types run at different times. Behaviors of the same type run in the order they
                are registered, the first one outermost:
            </p>
            <CodeBlock code={executionOrderCode} language="javascript" />

            <H2>Key Differences</H2>
            <div className="table-wrap">
                <table className="doc-table">
                    <thead>
                        <tr>
                            <th>Aspect</th>
                            <th>INotificationBehavior</th>
                            <th>INotificationHandlerBehavior</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Execution</td>
                            <td>Once per Publish</td>
                            <td>Once per handler attempt</td>
                        </tr>
                        <tr>
                            <td>Runs in</td>
                            <td>The Publish call, before the notification is queued</td>
                            <td>The background worker, around each handler</td>
                        </tr>
                        <tr>
                            <td>Exceptions</td>
                            <td>Propagate to the Publish caller</td>
                            <td>Retried with the handler, then dead-lettered</td>
                        </tr>
                        <tr>
                            <td>Best for</td>
                            <td>Concerns about publishing itself</td>
                            <td>Handler-specific concerns</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NotificationBehaviors;
