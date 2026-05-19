// Hand-curated search index. Each entry covers one doc page and lists the keywords/snippets
// a visitor is most likely to search for. Keep this in sync with the page content.
export const SEARCH_INDEX = [
    {
        slug: 'introduction',
        title: 'Introduction',
        keywords: 'mediator pattern overview features CQRS clean architecture event-driven',
    },
    {
        slug: 'installation',
        title: 'Installation',
        keywords: 'install setup nuget dotnet add package addmediatrr dead letter queue concurrentqueue configuration channel size max concurrent consumer aspnet core scope singleton lifetime',
    },
    {
        slug: 'basic-usage',
        title: 'Basic Usage',
        keywords: 'getting started ping pong send request example AddRequestHandler hello world',
    },
    {
        slug: 'requests',
        title: 'Requests & Handlers',
        keywords: 'IRequest IRequestHandler Send response query command result void',
    },
    {
        slug: 'streams',
        title: 'Streams & Handlers',
        keywords: 'IStreamRequest IStreamRequestHandler IAsyncEnumerable yield stream CreateStream',
    },
    {
        slug: 'notifications',
        title: 'Notifications',
        keywords: 'INotification INotificationHandler Publish events dead letter retry policy MaxRetryAttempts DelayBetweenRetries one policy per notification type background worker channel async',
    },
    {
        slug: 'behaviors',
        title: 'Pipeline Behaviors',
        keywords: 'IPipelineBehavior cross-cutting logging validation caching middleware pipeline order',
    },
    {
        slug: 'notification-behaviors',
        title: 'Notification Behaviors',
        keywords: 'INotificationBehavior INotificationHandlerBehavior wrap publish handler order',
    },
    {
        slug: 'stream-behaviors',
        title: 'Stream Behaviors',
        keywords: 'IStreamBehavior wrap stream IAsyncEnumerable enumerator cancellation',
    },
    {
        slug: 'auto-registration',
        title: 'Auto-Registration',
        keywords: 'source generator AutoRegisterRequestHandlers AutoRegisterStreamHandlers automatically register handlers',
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
