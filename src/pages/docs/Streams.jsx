import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

const Streams = () => {
    const requestCode = `public class StreamData : IStreamRequest<int>
{
    public int Count { get; set; }
}`;

    const handlerCode = `public class StreamDataHandler : IStreamRequestHandler<StreamData, int>
{
    public async IAsyncEnumerable<int> Handle(StreamData request, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        for (int i = 0; i < request.Count; i++)
        {
            await Task.Delay(100, cancellationToken);
            yield return i;
        }
    }
}`;

    const registrationCode = `// Register handler manually
services.AddStreamRequestHandler<StreamData, int, StreamDataHandler>();`;

    const usageCode = `var request = new StreamData { Count = 5 };

await foreach (var item in mediator.CreateStream(request))
{
    Console.WriteLine($"Received: {item}");
}`;

    const cancellationCode = `using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));

await foreach (var item in mediator.CreateStream(request, cts.Token))
{
    Console.WriteLine(item);
}
// The handler observes cts.Token through [EnumeratorCancellation]
// and the DI scope is disposed when the loop ends or breaks.`;

    return (
        <div>
            <h1>Streams &amp; Handlers</h1>
            <p className="doc-lead">
                Streams let a handler return an <code>IAsyncEnumerable&lt;T&gt;</code>, so results reach the
                caller as they are produced. They suit large result sets, long-running exports and live feeds.
            </p>

            <H2>Defining a Stream Request</H2>
            <p>
                Create a class that implements <code>IStreamRequest&lt;TResponse&gt;</code>:
            </p>
            <CodeBlock code={requestCode} />

            <H2>Creating a Handler</H2>
            <p>
                Implement <code>IStreamRequestHandler&lt;TRequest, TResponse&gt;</code> to handle your request.
                The handler must return an <code>IAsyncEnumerable&lt;TResponse&gt;</code>; an async iterator
                with <code>yield return</code> is the usual way to write it.
            </p>
            <CodeBlock code={handlerCode} />

            <H2>Registration</H2>
            <p>
                Register your stream handlers with the DI container using <code>AddStreamRequestHandler</code>, or
                let the <Link to="/docs/auto-registration">source generator</Link> do it:
            </p>
            <CodeBlock code={registrationCode} />

            <H2>Consuming the Stream</H2>
            <p>
                Use the <code>CreateStream</code> method on <code>IMediator</code> to start the stream:
            </p>
            <CodeBlock code={usageCode} />

            <H2>Cancellation and Scope</H2>
            <p>
                <code>CreateStream</code> is lazy: nothing runs until you start enumerating. At that point it
                opens a DI scope, resolves the <Link to="/docs/stream-behaviors">stream behaviors</Link> and the
                handler, and forwards the cancellation token you pass:
            </p>
            <CodeBlock code={cancellationCode} />

            <Callout variant="info" title="The scope lives as long as the enumeration">
                <p>
                    Scoped services the handler uses are disposed when the stream completes, when you break out
                    of the loop, or when the enumerator is disposed. Keep that in mind when a handler returns a
                    scoped object itself, such as an entity attached to a <code>DbContext</code>.
                </p>
            </Callout>

            <H2>Key Characteristics</H2>
            <ul>
                <li><strong>One handler per request</strong>: each stream request type has exactly one handler; enumerating a stream with no registered handler throws <code>InvalidOperationException</code></li>
                <li><strong>Async enumerable</strong>: handlers return <code>IAsyncEnumerable</code></li>
                <li><strong>Streaming</strong>: data is yielded as it becomes available, with no buffering in between</li>
                <li><strong>Cancellation</strong>: the token passed to <code>CreateStream</code> reaches the handler and every behavior</li>
                <li><strong>Flexible handler classes</strong>: a handler can implement the interface explicitly, and one class can handle several stream request types</li>
            </ul>
        </div>
    );
};

export default Streams;
