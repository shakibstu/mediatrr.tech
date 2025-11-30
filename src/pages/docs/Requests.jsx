import React from 'react';
import CodeBlock from '../../components/CodeBlock';

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
            <h1>Requests & Handlers</h1>
            <p>
                Requests are the core of MediatRR's request/response pattern. Each request implements
                <code>IRequest&lt;TResponse&gt;</code> and has exactly one handler that processes it.
            </p>

            <h2>Query Pattern</h2>
            <p>
                Queries are requests that retrieve data without modifying state. They follow the
                Query side of CQRS (Command Query Responsibility Segregation).
            </p>
            <CodeBlock code={requestCode} />

            <h2>Command Pattern</h2>
            <p>
                Commands are requests that modify state. They represent actions or operations
                that change the system's data.
            </p>
            <CodeBlock code={commandCode} />

            <h2>Registration</h2>
            <p>
                Register your request handlers with the DI container using <code>AddRequestHandler</code>:
            </p>
            <CodeBlock code={registrationCode} />

            <h2>Sending Requests</h2>
            <p>
                Use the <code>Send</code> method on <code>IMediator</code> to dispatch requests:
            </p>
            <CodeBlock code={usageCode} />

            <h2>Key Characteristics</h2>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><strong>One Handler Per Request</strong>: Each request type has exactly one handler</li>
                <li><strong>Type Safe</strong>: Request and response types are enforced at compile time</li>
                <li><strong>Synchronous Execution</strong>: Requests are processed immediately and return a result</li>
                <li><strong>Pipeline Support</strong>: Requests flow through pipeline behaviors before reaching the handler</li>
            </ul>

            <div className="card" style={{ marginTop: '2rem', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'var(--accent-primary)' }}>
                <h3>💡 CQRS Pattern</h3>
                <p style={{ marginBottom: 0 }}>
                    MediatRR naturally supports CQRS by separating queries (read operations) from commands
                    (write operations). This separation improves code organization, testability, and allows
                    for different optimization strategies for reads vs. writes.
                </p>
            </div>
        </div>
    );
};

export default Requests;
