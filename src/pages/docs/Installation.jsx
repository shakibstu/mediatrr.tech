import React from 'react';
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

    return (
        <div>
            <h1>Installation</h1>

            <h2>Package Installation</h2>
            <p>Install MediatRR via NuGet Package Manager or the .NET CLI:</p>
            <CodeBlock code={installCode} language="bash" />

            <h2>Basic Setup</h2>
            <p>
                Register MediatRR in your dependency injection container. The library requires
                a configuration action and a dead-letter queue for handling failed notifications.
            </p>
            <CodeBlock code={setupCode} />

            <h2>Configuration Options</h2>
            <p>The <code>AddMediatRR</code> method accepts a configuration action with the following options:</p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><code>NotificationChannelSize</code>: The size of the notification channel buffer (default: 100)</li>
                <li><code>MaxConcurrentMessageConsumer</code>: Maximum concurrent notification handlers (default: 5)</li>
            </ul>

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
            <p>
                Each <code>DeadLettersInfo</code> entry contains the failed notification and error details,
                allowing you to investigate and potentially reprocess failed messages.
            </p>

            <h2>ASP.NET Core Integration</h2>
            <p>In an ASP.NET Core application, register MediatRR in your <code>Program.cs</code> or <code>Startup.cs</code>:</p>
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
