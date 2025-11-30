import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const NotificationBehaviors = () => {
    const notificationBehaviorCode = `// Wraps the entire notification publishing process
public class NotificationLoggingBehavior<TNotification> : INotificationBehavior<TNotification>
    where TNotification : INotification
{
    public async Task Handle(
        TNotification notification, 
        Func<Task> next, 
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine($"Before publishing {typeof(TNotification).Name}");
        await next();
        Console.WriteLine($"After publishing {typeof(TNotification).Name}");
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

    const executionOrderCode = `// Execution flow:
// 1. NotificationBehavior (before)
// 2. NotificationHandlerBehavior (before) → Handler 1
// 3. NotificationHandlerBehavior (after)
// 4. NotificationHandlerBehavior (before) → Handler 2
// 5. NotificationHandlerBehavior (after)
// 6. NotificationBehavior (after)`;

    return (
        <div>
            <h1>Notification Behaviors</h1>
            <p>
                MediatRR provides two types of behaviors for notifications, allowing you to add
                cross-cutting concerns at different levels of the notification pipeline.
            </p>

            <h2>INotificationBehavior</h2>
            <p>
                <code>INotificationBehavior&lt;TNotification&gt;</code> wraps the entire notification
                publishing process. It executes once per <code>Publish</code> call, before and after
                all handlers are invoked.
            </p>
            <CodeBlock code={notificationBehaviorCode} />

            <div className="card" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <h4>Use Cases:</h4>
                <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem', marginBottom: 0 }}>
                    <li>Logging the notification event</li>
                    <li>Performance monitoring for the entire publish operation</li>
                    <li>Transaction management</li>
                    <li>Global error handling</li>
                </ul>
            </div>

            <h2>INotificationHandlerBehavior</h2>
            <p>
                <code>INotificationHandlerBehavior&lt;TNotification&gt;</code> wraps each individual
                handler execution. It runs once for each handler that processes the notification.
            </p>
            <CodeBlock code={handlerBehaviorCode} />

            <div className="card" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <h4>Use Cases:</h4>
                <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem', marginBottom: 0 }}>
                    <li>Per-handler error handling</li>
                    <li>Retry logic for individual handlers</li>
                    <li>Handler-specific logging</li>
                    <li>Performance tracking per handler</li>
                </ul>
            </div>

            <h2>Registration</h2>
            <p>
                Register both types of behaviors as open generics:
            </p>
            <CodeBlock code={registrationCode} />

            <h2>Execution Order</h2>
            <p>
                Understanding the execution flow is important when using both behavior types:
            </p>
            <CodeBlock code={executionOrderCode} language="javascript" />

            <div className="card" style={{ marginTop: '2rem', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'var(--accent-primary)' }}>
                <h3>🔑 Key Differences</h3>
                <table style={{ width: '100%', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Aspect</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>INotificationBehavior</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>INotificationHandlerBehavior</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '0.5rem' }}>Execution</td>
                            <td style={{ padding: '0.5rem' }}>Once per Publish</td>
                            <td style={{ padding: '0.5rem' }}>Once per Handler</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem' }}>Scope</td>
                            <td style={{ padding: '0.5rem' }}>Entire publish operation</td>
                            <td style={{ padding: '0.5rem' }}>Individual handler</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem' }}>Best For</td>
                            <td style={{ padding: '0.5rem' }}>Global concerns</td>
                            <td style={{ padding: '0.5rem' }}>Handler-specific concerns</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NotificationBehaviors;
