import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const Requests = () => {
    const requestCode = `// Request with response
public class GetUserQuery : IRequest<User>
{
    public string UserId { get; set; }
}

// Handler
public class GetUserQueryHandler : IRequestHandler<GetUserQuery, User>
{
    private readonly IUserRepository _repository;

    public GetUserQueryHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<User> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetByIdAsync(request.UserId, cancellationToken);
    }
}`;

    const commandCode = `// Command pattern (request that modifies state)
public class CreateOrderCommand : IRequest<string>
{
    public string CustomerId { get; set; }
    public List<OrderItem> Items { get; set; }
}

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, string>
{
    private readonly IOrderRepository _repository;

    public CreateOrderCommandHandler(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order
        {
            CustomerId = request.CustomerId,
            Items = request.Items,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(order, cancellationToken);
        return order.Id;
    }
}`;

    const voidCode = `using Void = MediatRR.Contract.Messaging.Void; // avoids a clash with System.Void

public class DeleteUserCommand : IRequest<Void>
{
    public string UserId { get; set; }
}

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Void>
{
    private readonly IUserRepository _repository;

    public DeleteUserCommandHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<Void> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeleteAsync(request.UserId, cancellationToken);
        return Void.Value;
    }
}

// The two-type-parameter overload is for IRequest<Void> handlers
services.AddRequestHandler<DeleteUserCommand, DeleteUserCommandHandler>();

await mediator.Send(new DeleteUserCommand { UserId = "123" });`;

    const registrationCode = `// Register handlers
services.AddRequestHandler<GetUserQuery, User, GetUserQueryHandler>();
services.AddRequestHandler<CreateOrderCommand, string, CreateOrderCommandHandler>();`;

    const usageCode = `// Query example
var user = await mediator.Send(new GetUserQuery { UserId = "123" });

// Command example
var orderId = await mediator.Send(new CreateOrderCommand
{
    CustomerId = "456",
    Items = orderItems
});`;

    return (
        <div>
            <h1>Requests &amp; Handlers</h1>
            <p className="doc-lead">
                Requests are the core of MediatRR's request/response pattern. Each request
                implements <code>IRequest&lt;TResponse&gt;</code> and has exactly one handler that processes it.
            </p>

            <H2>Query Pattern</H2>
            <p>
                Queries are requests that retrieve data without modifying state. They follow the
                Query side of CQRS (Command Query Responsibility Segregation).
            </p>
            <CodeBlock code={requestCode} />

            <H2>Command Pattern</H2>
            <p>
                Commands are requests that modify state. They represent actions or operations
                that change the system's data.
            </p>
            <CodeBlock code={commandCode} />

            <H2>Requests Without a Response</H2>
            <p>
                C# does not allow <code>void</code> as a type argument, so MediatRR provides
                the <code>Void</code> struct in <code>MediatRR.Contract.Messaging</code>. Implement{' '}
                <code>IRequest&lt;Void&gt;</code>, return <code>Void.Value</code> from the handler
                (or <code>Void.Task</code> when nothing is awaited) and register the handler with the
                shorter <code>AddRequestHandler</code> overload:
            </p>
            <CodeBlock code={voidCode} />

            <Callout variant="info" title="Alias the type">
                <p>
                    With implicit usings enabled, <code>System</code> is imported everywhere and a
                    bare <code>Void</code> would be ambiguous with <code>System.Void</code>. The{' '}
                    <code>using Void = MediatRR.Contract.Messaging.Void;</code> alias at the top of the file
                    resolves it. Put it in a <code>global using</code> to apply it project-wide.
                </p>
            </Callout>

            <H2>Registration</H2>
            <p>
                Register your request handlers with the DI container using <code>AddRequestHandler</code>, or
                let the <Link to="/docs/auto-registration">source generator</Link> register every handler in
                the project:
            </p>
            <CodeBlock code={registrationCode} />

            <H2>Sending Requests</H2>
            <p>
                Use the <code>Send</code> method on <code>IMediator</code> to dispatch requests:
            </p>
            <CodeBlock code={usageCode} />

            <H2>Key Characteristics</H2>
            <ul>
                <li><strong>One handler per request</strong>: each request type has exactly one handler; <code>Send</code> throws <code>InvalidOperationException</code> when none is registered</li>
                <li><strong>Type safe</strong>: request and response types are enforced at compile time</li>
                <li><strong>Awaited inline</strong>: <code>Send</code> runs the behaviors and the handler immediately and returns the handler's result; nothing is queued</li>
                <li><strong>Scoped</strong>: every <code>Send</code> opens its own DI scope, shared by the behaviors and the handler (see <Link to="/docs/installation">Installation</Link>)</li>
                <li><strong>Pipeline support</strong>: requests flow through <Link to="/docs/behaviors">pipeline behaviors</Link> before reaching the handler</li>
                <li><strong>Flexible handler classes</strong>: a handler can implement the interface explicitly, and one class can handle several request types</li>
                <li><strong>Unwrapped exceptions</strong>: an exception thrown by a handler or behavior reaches the <code>Send</code> caller with its original type</li>
            </ul>

            <Callout variant="tip" title="CQRS pattern">
                <p>
                    MediatRR naturally supports CQRS by separating queries (read operations) from commands
                    (write operations). This separation improves code organization, testability, and allows
                    for different optimization strategies for reads vs. writes.
                </p>
            </Callout>
        </div>
    );
};

export default Requests;
