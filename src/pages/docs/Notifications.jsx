import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const Notifications = () => {
    const notificationCode = `public class OrderPlaced : INotification
{
    public string OrderId { get; set; }
    public decimal Amount { get; set; }
}`;

    const handlersCode = `public class SendEmailHandler : INotificationHandler<OrderPlaced>
{
    public Task Handle(OrderPlaced notification, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Sending confirmation for order {notification.OrderId}");
        return Task.CompletedTask;
    }
}

public class UpdateInventoryHandler : INotificationHandler<OrderPlaced>
{
    public Task Handle(OrderPlaced notification, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Updating stock for order {notification.OrderId}");
        return Task.CompletedTask;
    }
}`;

    const registrationCode = `// Register handlers with a retry policy
var retryPolicy = new NotificationRetryPolicy
{
    MaxRetryAttempts = 3,
    DelayBetweenRetries = TimeSpan.FromSeconds(1)
};

services.AddNotificationHandler<OrderPlaced, SendEmailHandler>(retryPolicy);
services.AddNotificationHandler<OrderPlaced, UpdateInventoryHandler>(retryPolicy);

// Omit the policy (or pass null) when a handler has no opinion:
// OrderPlaced still uses the policy registered above.
services.AddNotificationHandler<OrderPlaced, LogOrderHandler>();`;

    const publishCode = `var mediator = provider.GetRequiredService<IMediator>();

// Publish the notification - all handlers will be called
await mediator.Publish(new OrderPlaced
{
    OrderId = "ORD-12345",
    Amount = 99.99m
});`;

    const retryPolicyCode = `var retryPolicy = new NotificationRetryPolicy
{
    MaxRetryAttempts = 3,                          // up to 3 retries after the first attempt
    DelayBetweenRetries = TimeSpan.FromSeconds(1)
};

services.AddNotificationHandler<OrderPlaced, SendEmailHandler>(retryPolicy);
services.AddNotificationHandler<OrderPlaced, UpdateInventoryHandler>(retryPolicy);

// SendEmailHandler fails twice, then succeeds: it runs 3 times.
// UpdateInventoryHandler is not affected: it runs once.
// A handler that fails 4 times is dead-lettered with AttemptCount = 4.`;

    return (
        <div>
            <h1>Notifications</h1>
            <p className="doc-lead">
                Notifications publish an event to every handler registered for it. Unlike requests they return
                no value, can have zero or more handlers, and run on a background worker after{' '}
                <code>Publish</code> has returned.
            </p>

            <H2>Defining a Notification</H2>
            <p>
                Create a class that implements <code>INotification</code>:
            </p>
            <CodeBlock code={notificationCode} />

            <H2>Creating Handlers</H2>
            <p>
                You can create multiple handlers for the same notification. Each handler will be executed
                when the notification is published:
            </p>
            <CodeBlock code={handlersCode} />

            <H2>Registering Handlers</H2>
            <p>
                Register your notification handlers with the DI container. You can optionally provide a retry
                policy. Notification handlers are not covered by{' '}
                <Link to="/docs/auto-registration">auto-registration</Link>, because the registration also
                carries the policy:
            </p>
            <CodeBlock code={registrationCode} />

            <H2>Publishing Notifications</H2>
            <p>
                Use the <code>Publish</code> method to send notifications to all registered handlers:
            </p>
            <CodeBlock code={publishCode} />

            <H2>Asynchronous Processing</H2>
            <p>
                Notifications are processed asynchronously through a background worker. This means:
            </p>
            <ul>
                <li>
                    <code>Publish</code> runs the <Link to="/docs/notification-behaviors">notification behaviors</Link>,
                    queues the notification and returns; it does not wait for the handlers
                </li>
                <li>
                    Handlers are executed by a hosted worker service, which must be running. ASP.NET Core and
                    the generic host start it for you; with a plain <code>ServiceCollection</code> you start it
                    yourself (see <Link to="/docs/installation">Installation</Link>)
                </li>
                <li>
                    Handlers run concurrently, at most <code>MaxConcurrentMessageConsumer</code> at a time across
                    all notifications
                </li>
                <li>
                    Each notification gets its own DI scope, shared by its handlers and kept alive until the
                    last of them has finished
                </li>
                <li>
                    When the queue (<code>NotificationChannelSize</code>) is full and every handler slot is busy,{' '}
                    <code>Publish</code> waits for room; pass a <code>CancellationToken</code> to bound the wait
                </li>
                <li>
                    A notification with no registered handlers is not queued at all
                </li>
                <li>
                    Publishing a notification that has handlers after the host has stopped throws{' '}
                    <code>InvalidOperationException</code>
                </li>
            </ul>

            <H2>Retry Policies</H2>
            <p>
                A retry policy applies to every handler of its notification type, and each handler is retried
                on its own:
            </p>
            <ul>
                <li>
                    A failing handler runs again after <code>DelayBetweenRetries</code>, up
                    to <code>MaxRetryAttempts</code> more times; its concurrency slot is free during the delay
                </li>
                <li>Other handlers of the same notification are not re-run: a handler that succeeded runs once</li>
                <li>
                    An exception thrown by an <code>INotificationHandlerBehavior</code> counts as a failure of
                    that handler and is retried the same way
                </li>
                <li>A retry reuses the same handler instance and DI scope</li>
                <li>
                    After the last attempt the notification goes to the dead-letter queue with the last exception
                    and the total number of attempts
                </li>
                <li>When no handler of the notification type registers a policy, a failing handler is dead-lettered after its first attempt</li>
                <li>
                    A negative <code>MaxRetryAttempts</code> or <code>DelayBetweenRetries</code> throws{' '}
                    <code>ArgumentOutOfRangeException</code> when the handler is registered
                </li>
            </ul>
            <CodeBlock code={retryPolicyCode} />

            <Callout variant="warning" title="One policy per notification type">
                <p>
                    All handlers for the same notification share a single retry policy. Registering two
                    different policies for one notification type throws{' '}
                    <code>InvalidOperationException</code> when the worker starts. Registering the same (or an
                    equivalent) policy more than once is fine, and handlers registered without a policy never
                    conflict.
                </p>
            </Callout>

            <H2>Shutdown</H2>
            <p>Stopping the host stops the worker in one of two ways:</p>
            <ul>
                <li>
                    <strong>Graceful</strong>: the worker stops accepting notifications, then waits for queued
                    notifications and running handlers, including pending retries, to finish
                </li>
                <li>
                    <strong>Forced</strong>: if the host's shutdown timeout expires first, the worker cancels the
                    token passed to handlers and stops waiting. Handlers that observe the token, notifications
                    still waiting for a slot and notifications still queued are dead-lettered with an{' '}
                    <code>OperationCanceledException</code>, so nothing is lost silently
                </li>
            </ul>

            <Callout variant="tip" title="Use cases">
                <p>Notifications are a good fit for:</p>
                <ul>
                    <li>Event-driven architectures</li>
                    <li>Sending emails or push notifications</li>
                    <li>Updating multiple systems after an action</li>
                    <li>Logging and auditing</li>
                    <li>Cache invalidation</li>
                </ul>
            </Callout>
        </div>
    );
};

export default Notifications;
