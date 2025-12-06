import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const StreamBehaviors = () => {
    const behaviorCode = `public class StreamLoggingBehavior<TRequest, TResponse> : IStreamBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async IAsyncEnumerable<TResponse> Handle(
        TRequest request, 
        Func<IAsyncEnumerable<TResponse>> next, 
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        Console.WriteLine($"[Stream Log] Starting stream for {typeof(TRequest).Name}");
        
        var stream = next();
        
        await foreach (var item in stream.WithCancellation(cancellationToken))
        {
            Console.WriteLine($"[Stream Log] Received item: {item}");
            yield return item;
        }
        
        Console.WriteLine($"[Stream Log] Completed stream for {typeof(TRequest).Name}");
    }
}`;

    const registrationCode = `// Register the behavior
services.AddTransient(typeof(IStreamBehavior<,>), typeof(StreamLoggingBehavior<,>));`;

    return (
        <div>
            <h1>Stream Behaviors</h1>
            <p>
                Stream behaviors allow you to wrap stream request handlers. This enables you to intercept the stream
                creation, modify the request, or iterate over the resulting stream to log, modify, or filter items.
            </p>

            <h2>Creating a Behavior</h2>
            <p>
                Implement <code>IStreamBehavior&lt;TRequest, TResponse&gt;</code> to create a behavior.
                Here's a simple logging behavior that logs each item yielded by the stream:
            </p>
            <CodeBlock code={behaviorCode} />

            <h2>Registering Behaviors</h2>
            <p>
                Register behaviors as open generics in your DI container. They will be applied to all stream requests:
            </p>
            <CodeBlock code={registrationCode} />

            <div className="card" style={{ marginTop: '2rem', background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' }}>
                <h3>ℹ️ Order of Execution</h3>
                <p style={{ marginBottom: 0 }}>
                    Stream behaviors wrap the execution similar to pipeline behaviors. When you iterate the stream in your behavior,
                    you are effectively consuming the stream from the next behavior or handler in the pipeline.
                </p>
            </div>
        </div>
    );
};

export default StreamBehaviors;
