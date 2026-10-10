import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../../components/CodeBlock';
import H2 from '../../components/DocHeading';
import Callout from '../../components/Callout';

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

    const filterCode = `public class SkipNullsBehavior<TRequest, TResponse> : IStreamBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async IAsyncEnumerable<TResponse> Handle(
        TRequest request,
        Func<IAsyncEnumerable<TResponse>> next,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        await foreach (var item in next().WithCancellation(cancellationToken))
        {
            if (item is not null)
            {
                yield return item;
            }
        }
    }
}`;

    return (
        <div>
            <h1>Stream Behaviors</h1>
            <p className="doc-lead">
                Stream behaviors wrap stream request handlers. They can intercept the stream creation, modify
                the request, or iterate over the resulting stream to log, transform or filter items.
            </p>

            <H2>Creating a Behavior</H2>
            <p>
                Implement <code>IStreamBehavior&lt;TRequest, TResponse&gt;</code> to create a behavior.
                Here's a simple logging behavior that logs each item yielded by the stream:
            </p>
            <CodeBlock code={behaviorCode} />

            <H2>Registering Behaviors</H2>
            <p>
                Register behaviors as open generics in your DI container. They will be applied to all stream requests:
            </p>
            <CodeBlock code={registrationCode} />

            <H2>Filtering and Transforming</H2>
            <p>
                Because a behavior owns the enumeration of the inner stream, it decides what reaches the
                caller. Skip items, map them to another value of the same type, or stop early:
            </p>
            <CodeBlock code={filterCode} />

            <H2>Order of Execution</H2>
            <p>
                Stream behaviors wrap the handler like <Link to="/docs/behaviors">pipeline behaviors</Link> do:
                the first registered behavior is the outermost. When you iterate the stream returned
                by <code>next()</code>, you are consuming the stream from the next behavior or the handler.
                Nothing runs until the caller starts enumerating.
            </p>

            <Callout variant="info" title="Cancellation flows through">
                <p>
                    The token passed to <code>CreateStream</code> is handed to every behavior and to the
                    handler. Forward it with <code>WithCancellation</code> when you iterate the inner stream, and
                    mark your own token parameter with <code>[EnumeratorCancellation]</code> so a consumer's
                    token reaches you as well.
                </p>
            </Callout>
        </div>
    );
};

export default StreamBehaviors;
