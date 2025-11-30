import React from 'react';

const Introduction = () => {
    return (
        <div>
            <h1>Introduction to MediatRR</h1>
            <p>
                MediatRR is a powerful mediator pattern implementation for .NET applications.
                It helps you decouple your application logic by providing a simple, elegant way
                to send requests and publish notifications.
            </p>

            <h2>What is the Mediator Pattern?</h2>
            <p>
                The Mediator pattern defines an object that encapsulates how a set of objects interact.
                This pattern promotes loose coupling by keeping objects from referring to each other explicitly,
                and it lets you vary their interaction independently.
            </p>

            <h2>Key Features</h2>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><strong>Request/Response Pattern</strong>: Send requests and get typed responses</li>
                <li><strong>Notifications</strong>: Publish events to multiple handlers</li>
                <li><strong>Pipeline Behaviors</strong>: Add cross-cutting concerns like logging, validation, and caching</li>
                <li><strong>Background Workers</strong>: Process notifications asynchronously</li>
                <li><strong>Resilience</strong>: Built-in retry policies and dead-letter queues</li>
                <li><strong>Dependency Injection</strong>: First-class support for Microsoft.Extensions.DependencyInjection</li>
            </ul>

            <h2>When to Use MediatRR</h2>
            <p>MediatRR is ideal for:</p>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li>CQRS (Command Query Responsibility Segregation) architectures</li>
                <li>Clean Architecture / Onion Architecture implementations</li>
                <li>Applications requiring clear separation of concerns</li>
                <li>Event-driven systems within a single application</li>
                <li>Decoupling business logic from infrastructure</li>
            </ul>
        </div>
    );
};

export default Introduction;
