import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const DeadLetterHandlers = () => {
    const handlerCode = `using MediatRR.Contract.Messaging;

public class OrderPlacedDeadLetterHandler : IDeadLetterHandler<OrderPlaced>
{
    private readonly ILogger<OrderPlacedDeadLetterHandler> _logger;
    private readonly IOutbox _outbox;

    public OrderPlacedDeadLetterHandler(ILogger<OrderPlacedDeadLetterHandler> logger, IOutbox outbox)
    {
        _logger = logger;
        _outbox = outbox;
    }

    public async Task Handle(DeadLetter<OrderPlaced> deadLetter, CancellationToken cancellationToken)
    {
        _logger.LogError(deadLetter.Exception,
            "Order {OrderId} failed in {Handler} after {Attempts} attempt(s)",
            deadLetter.Notification.OrderId,
            deadLetter.HandlerType?.Name,
            deadLetter.AttemptCount);

        await _outbox.ScheduleReplayAsync(deadLetter.Notification, cancellationToken);
    }
}`;

    const registrationCode = `// By hand
services.AddDeadLetterHandler<OrderPlaced, OrderPlacedDeadLetterHandler>();

// Or let the source generator find every IDeadLetterHandler<T> in the project
services.AutoRegisterDeadLetterHandlers();`;

    const propertiesCode = `public sealed class DeadLetter<TNotification> where TNotification : INotification
{
    public TNotification Notification { get; }  // the typed notification that failed
    public Exception Exception { get; }         // the exception of the last attempt
    public int AttemptCount { get; }            // attempts made, including retries; 0 if no handler ran
    public Type HandlerType { get; }            // the handler that failed; null if no handler ran
    public DateTime LastAttemptedAt { get; }    // UTC
}`;

    return (
        <div>
            <h1>Dead Letter Handlers</h1>
            <p className="doc-lead">
                A dead letter handler is called when a notification of its type has failed for good: after the
                last retry, or because no handler could run at all. It is the push-based, typed counterpart of
                the <Link to="/docs/installation#dead-letter-queue">dead-letter queue</Link>, and the two work
                together.
            </p>

            <Callout variant="new" title="New in 2.1">
                <p>
                    Before 2.1 the only outlet for failed notifications was the{' '}
                    <code>ConcurrentQueue&lt;DeadLettersInfo&gt;</code> passed to <code>AddMediatRR</code>, which you
                    had to poll and whose <code>Message</code> is an <code>object</code>. Dead letter handlers add a
                    typed hook; the queue keeps working exactly as before.
                </p>
            </Callout>

            <H2>Defining a Handler</H2>
            <p>
                Implement <code>IDeadLetterHandler&lt;TNotification&gt;</code> from <code>MediatRR.Contract</code>.
                It receives a <code>DeadLetter&lt;TNotification&gt;</code> with the typed notification and the failure
                details, and can take any dependency from DI:
            </p>
            <CodeBlock code={handlerCode} />

            <H2>Registering</H2>
            <p>
                Register it like any other handler, or rely on{' '}
                <Link to="/docs/auto-registration">auto-registration</Link>. Dead letter handlers carry no
                retry policy, so the generator can register them:
            </p>
            <CodeBlock code={registrationCode} />

            <H2>What the Handler Receives</H2>
            <CodeBlock code={propertiesCode} />
            <p>
                <code>HandlerType</code> tells you which <code>INotificationHandler</code> failed when a
                notification has several. It is <code>null</code> when the failure happened before any handler
                ran, for example because one of them could not be created by the container; in that
                case <code>AttemptCount</code> is <code>0</code> too.
            </p>

            <H2>Rules</H2>
            <ul>
                <li>
                    <strong>The queue still records every entry.</strong> Registering a dead letter handler does not
                    remove anything from the dead-letter queue, so monitoring built on the queue keeps working
                </li>
                <li>
                    <strong>Same scope as the failed handler.</strong> The dead letter handler is resolved from the
                    per-message DI scope, so a scoped <code>DbContext</code> or unit of work is the same instance the
                    failing handler used
                </li>
                <li>
                    <strong>Once per failed handler.</strong> If two handlers of one notification both exhaust their
                    retries, the dead letter handler runs twice, each time with the right <code>HandlerType</code>
                </li>
                <li>
                    <strong>All of them run.</strong> Several dead letter handlers for the same notification type are
                    called one after the other
                </li>
                <li>
                    <strong>Never retried.</strong> If a dead letter handler throws, a second entry is written to the
                    queue with the dead letter handler's type as <code>HandlerType</code> and its exception. The
                    original entry is already there, so nothing is lost
                </li>
                <li>
                    <strong>Not during shutdown.</strong> Notifications cancelled in flight or never read from the
                    channel while the host stops go to the queue only; no user code runs at that point
                </li>
            </ul>

            <Callout variant="tip" title="Good uses">
                <ul>
                    <li>Alerting with the full typed payload instead of a cast from <code>object</code></li>
                    <li>Writing the notification to an outbox table for replay, inside the same scope and transaction as the handler</li>
                    <li>Compensating actions, such as releasing a reservation the failed handler was meant to confirm</li>
                    <li>Deciding per exception what to do, now that <code>Exception</code> and <code>HandlerType</code> are both available</li>
                </ul>
            </Callout>

            <Callout variant="info" title="Keep it cheap">
                <p>
                    A dead letter handler runs inside the worker, holding the concurrency slot of the handler
                    that failed. Do the minimum there (log, enqueue, flag) and leave slow work such as
                    reprocessing to something outside the worker.
                </p>
            </Callout>
        </div>
    );
};

export default DeadLetterHandlers;
