import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const WhatsNew21 = () => {
    const updateCode = `dotnet add package MediatRR --version 2.1.0`;

    const deadLetterCode = `public class OrderPlacedDeadLetterHandler : IDeadLetterHandler<OrderPlaced>
{
    public Task Handle(DeadLetter<OrderPlaced> deadLetter, CancellationToken cancellationToken)
    {
        Console.WriteLine($"{deadLetter.Notification.OrderId} failed in {deadLetter.HandlerType?.Name} " +
                          $"after {deadLetter.AttemptCount} attempts: {deadLetter.Exception.Message}");
        return Task.CompletedTask;
    }
}

services.AddDeadLetterHandler<OrderPlaced, OrderPlacedDeadLetterHandler>();
// or: services.AutoRegisterDeadLetterHandlers();`;

    const retryCode = `var policy = new NotificationRetryPolicy
{
    MaxRetryAttempts = 5,
    DelayBetweenRetries = TimeSpan.FromSeconds(1),
    BackoffMultiplier = 2,                              // 1s, 2s, 4s, ...
    MaxDelayBetweenRetries = TimeSpan.FromSeconds(10),
    ShouldRetry = ex => ex is TimeoutException          // anything else is dead-lettered at once
};`;

    const metricsCode = `builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics.AddMeter(MediatRRInstrumentation.MeterName));`;

    const orderedCode = `public class BalanceChanged : IOrderedNotification
{
    public string AccountId { get; set; }
    public string OrderingKey => AccountId;   // same key => handled in publish order
}`;

    return (
        <div>
            <h1>What's New in 2.1</h1>
            <p className="doc-lead">
                MediatRR 2.1 is an additive release for the notification pipeline: a typed hook for failed
                notifications, smarter retries, metrics and per-key ordering. There are no breaking changes,
                so updating is the only step.
            </p>
            <CodeBlock code={updateCode} language="bash" />

            <Callout variant="info" title="Nothing to migrate">
                <p>
                    Every existing registration, the dead-letter queue passed to <code>AddMediatRR</code>,
                    the <code>DeadLettersInfo</code> constructor and <code>NotificationRetryPolicy</code> keep
                    working unchanged. Projects still on 1.x should follow{' '}
                    <Link to="/docs/migrating-to-2">Migrating to 2.0</Link> first.
                </p>
            </Callout>

            <H2>Dead Letter Handlers</H2>
            <p>
                Implement <code>IDeadLetterHandler&lt;TNotification&gt;</code> to be called with the typed
                notification, the exception, the attempt count and the handler that failed. It runs in the
                failed handler's DI scope, once per failed handler, and is never retried. The queue still
                records every entry.
            </p>
            <CodeBlock code={deadLetterCode} />
            <p>
                <code>DeadLettersInfo</code> gains a <code>HandlerType</code> property, and the source generator
                gains <code>AutoRegisterDeadLetterHandlers()</code>.
                Details: <Link to="/docs/dead-letter-handlers">Dead Letter Handlers</Link>.
            </p>

            <H2>Retry Backoff and Exception Filtering</H2>
            <p>
                <code>NotificationRetryPolicy</code> has three new options. <code>BackoffMultiplier</code> and{' '}
                <code>MaxDelayBetweenRetries</code> shape the delay between attempts; <code>ShouldRetry</code>{' '}
                decides per exception whether a retry is worth it. <code>GetRetryDelay(failedAttempt)</code>{' '}
                returns the computed delay.
            </p>
            <CodeBlock code={retryCode} />
            <p>
                All three take part in the one-policy-per-notification-type check.
                Details: <Link to="/docs/notifications#backoff-and-exception-filtering">Notifications</Link>.
            </p>

            <H2>Metrics</H2>
            <p>
                A <code>System.Diagnostics.Metrics</code> meter named <code>MediatRR</code> reports published and
                queued notifications, in-flight handlers, per-attempt durations with their outcome, retries and
                dead letters. It is created through <code>IMeterFactory</code> when one is registered.
            </p>
            <CodeBlock code={metricsCode} />
            <p>Details: <Link to="/docs/metrics">Metrics</Link>.</p>

            <H2>Ordered Notifications</H2>
            <p>
                <code>IOrderedNotification</code> adds an <code>OrderingKey</code>. Notifications sharing a key are
                handled strictly in publish order, retries included; different keys and plain notifications stay
                concurrent. The in-memory backlog of ordered notifications is capped at{' '}
                <code>NotificationChannelSize</code>, so backpressure still applies.
            </p>
            <CodeBlock code={orderedCode} />
            <p>Details: <Link to="/docs/ordered-notifications">Ordered Notifications</Link>.</p>

            <H2>Dependencies</H2>
            <p>
                <code>MediatRR</code> now references <code>Microsoft.Extensions.Diagnostics.Abstractions</code> and{' '}
                <code>System.Diagnostics.DiagnosticSource</code> 8.0.1 explicitly. Both were already pulled in
                transitively by the hosting abstractions, so the dependency closure of your application does
                not change.
            </p>
        </div>
    );
};

export default WhatsNew21;
