import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

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

    const programCode = `using MediatRR;
using MediatRR.Contract.Messaging;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;

var services = new ServiceCollection();
services.AddMediatRR(cfg => { }, new ConcurrentQueue<DeadLettersInfo>());
services.AddRequestHandler<Ping, string, PingHandler>();

var provider = services.BuildServiceProvider();
var mediator = provider.GetRequiredService<IMediator>();

Console.WriteLine(await mediator.Send(new Ping { Message = "Hello" })); // Hello Pong

public class Ping : IRequest<string>
{
    public string Message { get; set; } = "Ping";
}

public class PingHandler : IRequestHandler<Ping, string>
{
    public Task<string> Handle(Ping request, CancellationToken cancellationToken)
        => Task.FromResult($"{request.Message} Pong");
}`;

    return (
        <div>
            <h1>Basic Usage</h1>
            <p className="doc-lead">
                This guide walks you through creating your first request and handler using MediatRR.
            </p>

            <H2>Step 1: Define a Request</H2>
            <p>
                Create a class that implements <code>IRequest&lt;TResponse&gt;</code> where <code>TResponse</code>
                is the type of the response you expect. Records work just as well as classes.
            </p>
            <CodeBlock code={requestCode} />

            <H2>Step 2: Create a Handler</H2>
            <p>
                Implement <code>IRequestHandler&lt;TRequest, TResponse&gt;</code> to handle your request.
                Handlers are ordinary classes, so they can take any registered service through their constructor.
            </p>
            <CodeBlock code={handlerCode} />

            <H2>Step 3: Register the Handler</H2>
            <p>
                Register your handler with the dependency injection container, or
                let <Link to="/docs/auto-registration">auto-registration</Link> do it for you.
            </p>
            <CodeBlock code={registrationCode} />

            <H2>Step 4: Send the Request</H2>
            <p>
                Use the <code>IMediator</code> interface to send your request. <code>Send</code> resolves the
                handler in a fresh DI scope, runs any <Link to="/docs/behaviors">pipeline behaviors</Link> and
                returns the handler's response.
            </p>
            <CodeBlock code={usageCode} />

            <H2>Putting It Together</H2>
            <p>The whole thing fits in one console program:</p>
            <CodeBlock code={programCode} title="Program.cs" />

            <Callout variant="tip" title="That's it!">
                <p>
                    You've just created your first MediatRR request/response flow. Continue
                    with <Link to="/docs/requests">Requests &amp; Handlers</Link> for queries, commands and
                    requests without a response, or jump to <Link to="/docs/notifications">Notifications</Link>{' '}
                    to fan an event out to several handlers.
                </p>
            </Callout>
        </div>
    );
};

export default BasicUsage;
