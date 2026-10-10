// Hand-curated search index. Each entry covers one doc page and lists the keywords/snippets
// a visitor is most likely to search for. Keep this in sync with the page content.
export const SEARCH_INDEX = [
    {
        slug: 'introduction',
        title: 'Introduction',
        keywords: 'mediator pattern overview features CQRS clean architecture event-driven packages MediatRR.Contract contract interfaces free MIT license',
    },
    {
        slug: 'installation',
        title: 'Installation',
        keywords: 'install setup nuget dotnet add package addmediatrr dead letter queue concurrentqueue configuration channel size max concurrent consumer aspnet core scope singleton lifetime requirements netstandard2.0 abstractions host hosted service worker StartAsync StopAsync backpressure validation ArgumentOutOfRangeException DeadLettersInfo AttemptCount LastAttemptedAt HandlerType MediatRR.Contract packages using MediatRR DiagnosticSource',
    },
    {
        slug: 'basic-usage',
        title: 'Basic Usage',
        keywords: 'getting started ping pong send request example AddRequestHandler hello world program.cs console complete example',
    },
    {
        slug: 'requests',
        title: 'Requests & Handlers',
        keywords: 'IRequest IRequestHandler Send response query command result void Void.Value Void.Task unit no response fire and forget alias System.Void explicit interface implementation one class several request types exceptions unwrapped InvalidOperationException no handler registered',
    },
    {
        slug: 'streams',
        title: 'Streams & Handlers',
        keywords: 'IStreamRequest IStreamRequestHandler IAsyncEnumerable yield stream CreateStream explicit interface implementation EnumeratorCancellation cancellation scope disposed no handler registered',
    },
    {
        slug: 'notifications',
        title: 'Notifications',
        keywords: 'INotification INotificationHandler Publish events dead letter retry policy MaxRetryAttempts DelayBetweenRetries BackoffMultiplier MaxDelayBetweenRetries ShouldRetry exception filter transient exponential backoff GetRetryDelay one policy per notification type background worker channel async per handler retry in place backpressure host required shutdown graceful forced StopAsync InvalidOperationException OperationCanceledException scope',
    },
    {
        slug: 'dead-letter-handlers',
        title: 'Dead Letter Handlers',
        keywords: 'IDeadLetterHandler DeadLetter AddDeadLetterHandler AutoRegisterDeadLetterHandlers failed notification typed push dead letter queue HandlerType AttemptCount LastAttemptedAt Exception same scope never retried outbox alert compensate 2.1',
    },
    {
        slug: 'ordered-notifications',
        title: 'Ordered Notifications',
        keywords: 'IOrderedNotification OrderingKey ordered sequential per key partition in order publish order concurrency account aggregate FIFO backlog NotificationChannelSize null key 2.1',
    },
    {
        slug: 'behaviors',
        title: 'Pipeline Behaviors',
        keywords: 'IPipelineBehavior cross-cutting logging validation caching middleware pipeline order open generic closed generic single request type scope',
    },
    {
        slug: 'notification-behaviors',
        title: 'Notification Behaviors',
        keywords: 'INotificationBehavior INotificationHandlerBehavior wrap publish handler order execution order queued background worker retry attempt filter',
    },
    {
        slug: 'stream-behaviors',
        title: 'Stream Behaviors',
        keywords: 'IStreamBehavior wrap stream IAsyncEnumerable enumerator cancellation filter transform items',
    },
    {
        slug: 'auto-registration',
        title: 'Auto-Registration',
        keywords: 'source generator AutoRegisterRequestHandlers AutoRegisterStreamHandlers AutoRegisterDeadLetterHandlers automatically register handlers records multiple interfaces nested internal abstract generic C# 7.3 netstandard2.0 sdk requirements generated code class library project reference analyzer per project AddApplication',
    },
    {
        slug: 'metrics',
        title: 'Metrics',
        keywords: 'metrics meter System.Diagnostics.Metrics IMeterFactory OpenTelemetry MeterListener MediatRRInstrumentation MeterName mediatrr.notifications.published mediatrr.notifications.queued mediatrr.handlers.in_flight mediatrr.handlers.duration mediatrr.handlers.retries mediatrr.dead_letters observability monitoring gauge counter histogram queue depth saturation 2.1',
    },
    {
        slug: 'whats-new-2-1',
        title: "What's New in 2.1",
        keywords: 'whats new 2.1 2.1.0 release notes changelog upgrade additive no breaking changes dead letter handlers backoff ShouldRetry metrics ordered notifications generator',
    },
    {
        slug: 'migrating-to-2',
        title: 'Migrating to 2.0',
        keywords: 'migrate migration upgrade upgrading 2.0 2.0.0 breaking changes whats new release AddMediatRR MediatRRConfiguration AttemptCount ChannelClosedException InvalidOperationException per handler retry backpressure',
    },
];

export function searchDocs(query) {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return SEARCH_INDEX
        .map((entry) => {
            const haystack = `${entry.title} ${entry.keywords}`.toLowerCase();
            // Score = sum of term matches; title matches are worth more.
            let score = 0;
            for (const t of terms) {
                if (entry.title.toLowerCase().includes(t)) score += 3;
                else if (haystack.includes(t)) score += 1;
            }
            return { entry, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((r) => r.entry);
}
