import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const AutoRegistration = () => {
    const basicUsageCode = `using MediatRR.ServiceGenerator;

var builder = WebApplication.CreateBuilder(args);

// Auto-register all request handlers in the assembly
builder.Services.AutoRegisterRequestHandlers();

var app = builder.Build();`;

    const handlerCode = `// Just implement IRequestHandler - no manual registration needed!
public class GetUserQuery : IRequest<User>
{
    public string UserId { get; set; }
}

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, User>
{
    public Task<User> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        // Handler implementation
        return Task.FromResult(new User { Id = request.UserId });
    }
}`;

    const generatedCode = `// This code is generated automatically by the source generator
namespace MediatRR.ServiceGenerator
{
    internal static partial class SourceGeneratorInjectDependencies
    {
        internal static IServiceCollection AutoRegisterRequestHandlers(
            this IServiceCollection services)
        {
            services.AddTransient<IRequestHandler<GetUserQuery, User>, 
                GetUserQueryHandler>();
            services.AddTransient<IRequestHandler<CreateOrderCommand, string>, 
                CreateOrderCommandHandler>();
            // ... all other handlers
            
            return services;
        }
    }
}`;

    return (
        <div>
            <h1>Auto-Registration</h1>
            <p>
                MediatRR includes a source generator that automatically discovers and registers all
                request handlers in your assembly. This eliminates the need for manual registration
                and reduces boilerplate code.
            </p>

            <h2>How It Works</h2>
            <p>
                The source generator scans your code at compile time, finds all classes that implement
                <code>IRequestHandler&lt;TRequest, TResponse&gt;</code>, and generates registration code automatically.
            </p>

            <h2>Usage</h2>
            <p>
                Simply call <code>AutoRegisterRequestHandlers()</code> on your service collection:
            </p>
            <CodeBlock code={basicUsageCode} />

            <h2>Creating Handlers</h2>
            <p>
                Just implement <code>IRequestHandler</code> - no attributes or manual registration required:
            </p>
            <CodeBlock code={handlerCode} />

            <h2>Generated Code</h2>
            <p>
                Behind the scenes, the source generator creates an extension method that registers all handlers:
            </p>
            <CodeBlock code={generatedCode} />

            <h2>Benefits</h2>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><strong>Zero Boilerplate</strong>: No need to manually register each handler</li>
                <li><strong>Compile-Time Safety</strong>: Registration happens at compile time, not runtime</li>
                <li><strong>No Reflection</strong>: No assembly scanning at startup - faster application startup</li>
                <li><strong>Automatic Discovery</strong>: New handlers are automatically registered when you add them</li>
                <li><strong>Type Safe</strong>: All registrations are strongly typed</li>
            </ul>

            <h2>Namespace</h2>
            <p>
                The auto-registration feature is available in the <code>MediatRR.ServiceGenerator</code> namespace:
            </p>
            <CodeBlock code="using MediatRR.ServiceGenerator;" language="csharp" />

            <div className="card" style={{ marginTop: '2rem', background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                <h3>⚡ Performance Tip</h3>
                <p style={{ marginBottom: 0 }}>
                    Source generators run at compile time, so there's zero runtime overhead. This makes
                    auto-registration faster than traditional assembly scanning approaches used by other
                    mediator libraries.
                </p>
            </div>

            <h2>Combining with Manual Registration</h2>
            <p>
                You can still manually register handlers if needed. Manual registrations will override
                auto-registered handlers:
            </p>
            <CodeBlock code={`builder.Services.AutoRegisterRequestHandlers();

// Override a specific handler with a custom implementation
builder.Services.AddRequestHandler<GetUserQuery, User, CachedGetUserQueryHandler>();`} />
        </div>
    );
};

export default AutoRegistration;
