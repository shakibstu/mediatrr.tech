import React from 'react';
import CodeBlock from '../../components/CodeBlock';

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

    const registrationCode = `// Register handler manualy
services.AddStreamRequestHandler<StreamData, int, StreamDataHandler>();`;

    const usageCode = `var request = new StreamData { Count = 5 };

await foreach (var item in mediator.CreateStream(request))
{
    Console.WriteLine($"Received: {item}");
}`;

    return (
        <div>
            <h1>Streams & Handlers</h1>
            <p>
                Streams allow you to modify the return type of a handler to be an <code>IAsyncEnumerable&lt;T&gt;</code>.
                This is useful for streaming data to the client, or for processing large datasets.
            </p>

            <h2>Defining a Stream Request</h2>
            <p>
                Create a class that implements <code>IStreamRequest&lt;TResponse&gt;</code>:
            </p>
            <CodeBlock code={requestCode} />

            <h2>Creating a Handler</h2>
            <p>
                Implement <code>IStreamRequestHandler&lt;TRequest, TResponse&gt;</code> to handle your request.
                The handler must return an <code>IAsyncEnumerable&lt;TResponse&gt;</code>.
            </p>
            <CodeBlock code={handlerCode} />

            <h2>Registration</h2>
            <p>
                Register your stream handlers with the DI container using <code>AddStreamRequestHandler</code>:
            </p>
            <CodeBlock code={registrationCode} />

            <h2>Consuming the Stream</h2>
            <p>
                Use the <code>CreateStream</code> method on <code>IMediator</code> to start the stream:
            </p>
            <CodeBlock code={usageCode} />

            <h2>Key Characteristics</h2>
            <ul style={{ color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                <li><strong>One Handler Per Request</strong>: Each stream request type has exactly one handler</li>
                <li><strong>Async Enumerable</strong>: Handlers return <code>IAsyncEnumerable</code></li>
                <li><strong>Streaming</strong>: Data is yielded as it becomes available</li>
                <li><strong>Cancellation</strong>: Supports <code>CancellationToken</code> for cancelling the stream</li>
            </ul>
        </div>
    );
};

export default Streams;
