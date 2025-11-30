import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const BasicUsage = () => {
    const requestCode = `public class Ping : IRequest<string>
{
    public string Message { get; set; } = "Ping";
}`;

    const handlerCode = `public class PingHandler : IRequestHandler<Ping, string>
{
    public Task<string> Handle(Ping request, CancellationToken cancellationToken)
    {
        return Task.FromResult($"{request.Message} Pong");
    }
}`;

    const registrationCode = `services.AddRequestHandler<Ping, string, PingHandler>();`;

    const usageCode = `var mediator = provider.GetRequiredService<IMediator>();
var response = await mediator.Send(new Ping { Message = "Hello" });
// response = "Hello Pong"`;

    return (
        <div>
            <h1>Basic Usage</h1>
            <p>
                This guide will walk you through creating your first request and handler using MediatRR.
            </p>

            <h2>Step 1: Define a Request</h2>
            <p>
                Create a class that implements <code>IRequest&lt;TResponse&gt;</code> where <code>TResponse</code>
                is the type of the response you expect.
            </p>
            <CodeBlock code={requestCode} />

            <h2>Step 2: Create a Handler</h2>
            <p>
                Implement <code>IRequestHandler&lt;TRequest, TResponse&gt;</code> to handle your request.
            </p>
            <CodeBlock code={handlerCode} />

            <h2>Step 3: Register the Handler</h2>
            <p>
                Register your handler with the dependency injection container.
            </p>
            <CodeBlock code={registrationCode} />

            <h2>Step 4: Send the Request</h2>
            <p>
                Use the <code>IMediator</code> interface to send your request.
            </p>
            <CodeBlock code={usageCode} />

            <div className="card" style={{ marginTop: '2rem', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'var(--accent-primary)' }}>
                <h3>✨ That's it!</h3>
                <p style={{ marginBottom: 0 }}>
                    You've just created your first MediatRR request/response flow. The mediator pattern
                    helps keep your code clean and decoupled.
                </p>
            </div>
        </div>
    );
};

export default BasicUsage;
