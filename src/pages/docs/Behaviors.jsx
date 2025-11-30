import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const Behaviors = () => {
    const behaviorCode = `public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request, 
        Func<Task<TResponse>> next, 
        CancellationToken cancellationToken)
    {
        Console.WriteLine($"[Log] Handling {typeof(TRequest).Name}");
        
        var response = await next();
        
        Console.WriteLine($"[Log] Handled {typeof(TRequest).Name}");
        
        return response;
    }
}`;

    const registrationCode = `// Register the behavior
services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

// Register your handler
services.AddRequestHandler<Ping, string, PingHandler>();`;

    const validationCode = `public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IValidator<TRequest> _validator;

    public ValidationBehavior(IValidator<TRequest> validator)
    {
        _validator = validator;
    }

    public async Task<TResponse> Handle(
        TRequest request, 
        Func<Task<TResponse>> next, 
        CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(request);
        
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }
        
        return await next();
    }
}`;

    return (
        <div>
            <h1>Pipeline Behaviors</h1>
            <p>
                Pipeline behaviors allow you to add cross-cutting concerns to your request/response pipeline.
                They wrap around the execution of handlers, similar to ASP.NET Core middleware.
            </p>

            <h2>Creating a Behavior</h2>
            <p>
                Implement <code>IPipelineBehavior&lt;TRequest, TResponse&gt;</code> to create a behavior.
                Here's a simple logging behavior:
            </p>
            <CodeBlock code={behaviorCode} />

            <h2>Registering Behaviors</h2>
            <p>
                Register behaviors as open generics in your DI container. They will be applied to all requests:
            </p>
            <CodeBlock code={registrationCode} />

            <h2>Execution Order</h2>
            <p>
                Behaviors are executed in the order they are registered. The first registered behavior
                is the outermost wrapper, and the last is closest to the handler.
            </p>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                <code style={{ color: 'var(--text-secondary)' }}>
                    Behavior A (before) → Behavior B (before) → Handler → Behavior B (after) → Behavior A (after)
                </code>
            </div>

            <h2>Common Use Cases</h2>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><strong>Logging</strong>: Log request/response details</li>
                <li><strong>Validation</strong>: Validate requests before handling</li>
                <li><strong>Caching</strong>: Cache responses for repeated requests</li>
                <li><strong>Performance Monitoring</strong>: Measure execution time</li>
                <li><strong>Transaction Management</strong>: Wrap handlers in database transactions</li>
                <li><strong>Authorization</strong>: Check user permissions</li>
            </ul>

            <h2>Example: Validation Behavior</h2>
            <CodeBlock code={validationCode} />
        </div>
    );
};

export default Behaviors;
