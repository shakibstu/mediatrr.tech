import React from 'react';
import CodeBlock from '../../components/CodeBlock';

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

    const registrationCode = `// Register handlers with retry policies
var retryPolicy = new NotificationRetryPolicy
{
    MaxRetryAttempts = 3,
    RetryDelayMilliseconds = 1000
};

services.AddNotificationHandler<OrderPlaced, SendEmailHandler>(retryPolicy);
services.AddNotificationHandler<OrderPlaced, UpdateInventoryHandler>(retryPolicy);
services.AddNotificationHandler<OrderPlaced, LogOrderHandler>(null); // No retry for logging`;

    const publishCode = `var mediator = provider.GetRequiredService<IMediator>();

// Publish the notification - all handlers will be called
await mediator.Publish(new OrderPlaced 
{ 
    OrderId = "ORD-12345", 
    Amount = 99.99m 
});`;

    const retryPolicyCode = `var retryPolicy = new NotificationRetryPolicy
{
    MaxRetryAttempts = 3,
    RetryDelayMilliseconds = 1000
};

services.AddNotificationHandler<OrderPlaced, SendEmailHandler>(retryPolicy);`;

    return (
        <div>
            <h1>Notifications</h1>
            <p>
                Notifications in MediatRR allow you to publish events to multiple handlers.
                Unlike requests, notifications don't return a value and can have zero or more handlers.
            </p>

            <h2>Defining a Notification</h2>
            <p>
                Create a class that implements <code>INotification</code>:
            </p>
            <CodeBlock code={notificationCode} />

            <h2>Creating Handlers</h2>
            <p>
                You can create multiple handlers for the same notification. Each handler will be executed
                when the notification is published:
            </p>
            <CodeBlock code={handlersCode} />

            <h2>Registering Handlers</h2>
            <p>
                Register your notification handlers with the DI container. You can optionally provide a retry policy:
            </p>
            <CodeBlock code={registrationCode} />

            <h2>Publishing Notifications</h2>
            <p>
                Use the <code>Publish</code> method to send notifications to all registered handlers:
            </p>
            <CodeBlock code={publishCode} />

            <h2>Asynchronous Processing</h2>
            <p>
                Notifications are processed asynchronously through a background worker. This means:
            </p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li>The <code>Publish</code> method returns immediately after queuing the notification</li>
                <li>Handlers are executed in the background by a worker service</li>
                <li>You can configure the channel size and max concurrent consumers</li>
            </ul>

            <h2>Retry Policies</h2>
            <p>
                You can configure retry behavior for individual notification handlers:
            </p>
            <CodeBlock code={retryPolicyCode} />

            <div className="card" style={{ marginTop: '2rem', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--accent-secondary)' }}>
                <h3>💡 Use Cases</h3>
                <p style={{ marginBottom: '0.5rem' }}>Notifications are perfect for:</p>
                <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem', marginBottom: 0 }}>
                    <li>Event-driven architectures</li>
                    <li>Sending emails or push notifications</li>
                    <li>Updating multiple systems after an action</li>
                    <li>Logging and auditing</li>
                    <li>Cache invalidation</li>
                </ul>
            </div>
        </div>
    );
};

export default Notifications;
