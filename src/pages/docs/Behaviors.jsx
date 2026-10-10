import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

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

    const targetedCode = `// Applies to every request
services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

// Applies to one request type only
services.AddTransient<IPipelineBehavior<CreateOrderCommand, string>, CreateOrderAuditBehavior>();`;

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
        var validationResult = await _validator.ValidateAsync(request, cancellationToken);

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
            <p className="doc-lead">
                Pipeline behaviors add cross-cutting concerns to the request/response pipeline. They wrap
                the execution of handlers, similar to ASP.NET Core middleware.
            </p>

            <H2>Creating a Behavior</H2>
            <p>
                Implement <code>IPipelineBehavior&lt;TRequest, TResponse&gt;</code> to create a behavior.
                Here's a simple logging behavior:
            </p>
            <CodeBlock code={behaviorCode} />

            <H2>Registering Behaviors</H2>
            <p>
                Register behaviors as open generics in your DI container. They will be applied to all requests:
            </p>
            <CodeBlock code={registrationCode} />
            <p>
                A behavior registered for a closed request type runs only for that request. Both kinds can be
                mixed, and they run in registration order:
            </p>
            <CodeBlock code={targetedCode} />

            <H2>Execution Order</H2>
            <p>
                Behaviors are executed in the order they are registered. The first registered behavior
                is the outermost wrapper, and the last is closest to the handler.
            </p>
            <div className="flow-inline">
                Behavior A (before) → Behavior B (before) → Handler → Behavior B (after) → Behavior A (after)
            </div>

            <Callout variant="info" title="Behaviors share the handler's scope">
                <p>
                    Each <code>Send</code> opens one DI scope and resolves the behaviors and the handler from it,
                    so a scoped service such as a unit of work is the same instance in a behavior and in the
                    handler it wraps. A behavior that does not call <code>next()</code> short-circuits the
                    pipeline, and an exception it throws reaches the caller unchanged.
                </p>
            </Callout>

            <H2>Common Use Cases</H2>
            <ul>
                <li><strong>Logging</strong>: log request/response details</li>
                <li><strong>Validation</strong>: validate requests before handling</li>
                <li><strong>Caching</strong>: cache responses for repeated requests</li>
                <li><strong>Performance monitoring</strong>: measure execution time</li>
                <li><strong>Transaction management</strong>: wrap handlers in database transactions</li>
                <li><strong>Authorization</strong>: check user permissions</li>
            </ul>

            <H2>Example: Validation Behavior</H2>
            <p>
                A behavior that resolves a validator for the request type and stops the pipeline when
                validation fails:
            </p>
            <CodeBlock code={validationCode} />
            <p>
                Notifications and streams have their own behavior interfaces:
                see <Link to="/docs/notification-behaviors">Notification Behaviors</Link> and{' '}
                <Link to="/docs/stream-behaviors">Stream Behaviors</Link>.
            </p>
        </div>
    );
};

export default Behaviors;
