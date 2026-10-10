import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const OrderedNotifications = () => {
    const notificationCode = `using MediatRR.Contract.Messaging;

public class BalanceChanged : IOrderedNotification
{
    public string AccountId { get; set; }
    public decimal NewBalance { get; set; }

    // Everything with the same key is handled in publish order
    public string OrderingKey => AccountId;
}`;

    const publishCode = `await mediator.Publish(new BalanceChanged { AccountId = "A", NewBalance = 100 }); // 1
await mediator.Publish(new BalanceChanged { AccountId = "B", NewBalance = 40 });  // 2
await mediator.Publish(new BalanceChanged { AccountId = "A", NewBalance = 80 });  // 3

// Handlers for 1 finish before handlers for 3 start.
// 2 runs concurrently with either of them.`;

    const handlerCode = `public class ProjectBalanceHandler : INotificationHandler<BalanceChanged>
{
    private readonly BalanceProjection _projection;

    public ProjectBalanceHandler(BalanceProjection projection) => _projection = projection;

    public Task Handle(BalanceChanged notification, CancellationToken cancellationToken)
        => _projection.ApplyAsync(notification.AccountId, notification.NewBalance, cancellationToken);
}

services.AddNotificationHandler<BalanceChanged, ProjectBalanceHandler>(new NotificationRetryPolicy
{
    MaxRetryAttempts = 3,
    DelayBetweenRetries = TimeSpan.FromMilliseconds(200),
    ShouldRetry = ex => ex is not ArgumentException
});`;

    return (
        <div>
            <h1>Ordered Notifications</h1>
            <p className="doc-lead">
                By default the worker starts a notification as soon as a concurrency slot is free, so two
                notifications published back to back may be handled in either order. When order matters within
                a group, give the group a key: notifications with the same key are handled one after another,
                everything else stays concurrent.
            </p>

            <Callout variant="new" title="New in 2.1">
                <p>
                    <code>IOrderedNotification</code> lives in <code>MediatRR.Contract</code> and extends{' '}
                    <code>INotification</code>, so existing handlers, behaviors and retry policies apply to it
                    unchanged.
                </p>
            </Callout>

            <H2>Defining an Ordered Notification</H2>
            <p>
                Implement <code>IOrderedNotification</code> instead of <code>INotification</code> and return the
                key from <code>OrderingKey</code>. Typical keys are an aggregate id, an account, a user or a
                tenant:
            </p>
            <CodeBlock code={notificationCode} />
            <p>Handlers are ordinary notification handlers:</p>
            <CodeBlock code={handlerCode} />

            <H2>Semantics</H2>
            <CodeBlock code={publishCode} />
            <ul>
                <li>
                    <strong>Strict order per key.</strong> The next notification with a key starts only after every
                    handler of the previous one with that key has finished, retries included
                </li>
                <li>
                    <strong>Keys do not wait for each other.</strong> Different keys are handled concurrently, up
                    to <code>MaxConcurrentMessageConsumer</code> handler executions in total
                </li>
                <li>
                    <strong>Plain notifications are unaffected.</strong> <code>INotification</code> types keep the
                    default concurrent behaviour, even when published between ordered ones
                </li>
                <li>
                    <strong>A <code>null</code> key opts out.</strong> That notification is handled like a plain one
                </li>
                <li>
                    <strong>Order is publish order.</strong> Two calls to <code>Publish</code> for the same key from
                    different threads are ordered by whichever is queued first, so publish sequentially when the
                    sequence matters
                </li>
            </ul>

            <H2>Backpressure</H2>
            <p>
                Ordered notifications are taken off the channel ahead of time so that a busy key does not block
                the others. At most <code>NotificationChannelSize</code> of them wait for their key in memory;
                beyond that the worker stops reading, the channel fills, and <code>Publish</code> waits, the same
                way it does when the channel is full (see{' '}
                <Link to="/docs/notifications#asynchronous-processing">Asynchronous Processing</Link>).
            </p>

            <Callout variant="warning" title="A failing handler holds its key">
                <p>
                    Retries are part of handling, so a handler that keeps failing holds up every later
                    notification with the same key until its retry budget is exhausted, and a slow retry
                    schedule makes that wait longer. Keep <code>MaxRetryAttempts</code> and the delays modest for
                    ordered types, and use <code>ShouldRetry</code> to dead-letter permanent failures at once,
                    as in the example above. Other keys are not affected.
                </p>
            </Callout>

            <Callout variant="tip" title="Use cases">
                <ul>
                    <li>Domain events of one aggregate that must be projected in sequence</li>
                    <li>State transitions of a user, order or device where the last write must win</li>
                    <li>Per-tenant work that must not interleave, while tenants run in parallel</li>
                </ul>
            </Callout>
        </div>
    );
};

export default OrderedNotifications;
