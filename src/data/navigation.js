// Single source of truth for the docs navigation.
// Drives the sidebar, the route table, prev/next pagination, search, the generated static pages and the sitemap.

export const DOCS_SECTIONS = [
    {
        title: 'Getting Started',
        items: [
            {
                slug: 'introduction',
                label: 'Introduction',
                file: 'Introduction.jsx',
                description: 'What MediatRR is, how the mediator pattern works, the two packages and when to use it.',
            },
            {
                slug: 'installation',
                label: 'Installation',
                file: 'Installation.jsx',
                description: 'Install the MediatRR NuGet packages, register the mediator and configure the notification worker and dead-letter queue.',
            },
            {
                slug: 'basic-usage',
                label: 'Basic Usage',
                file: 'BasicUsage.jsx',
                description: 'Create your first request and handler, register it and send it through IMediator.',
            },
        ],
    },
    {
        title: 'Core Concepts',
        items: [
            {
                slug: 'requests',
                label: 'Requests & Handlers',
                file: 'Requests.jsx',
                description: 'Queries, commands and requests without a response with IRequest, IRequestHandler and Send.',
            },
            {
                slug: 'streams',
                label: 'Streams & Handlers',
                file: 'Streams.jsx',
                description: 'Stream results with IStreamRequest, IStreamRequestHandler, IAsyncEnumerable and CreateStream.',
            },
            {
                slug: 'notifications',
                label: 'Notifications',
                file: 'Notifications.jsx',
                description: 'Publish events to several handlers with retry policies, backpressure, graceful shutdown and a dead-letter queue.',
            },
            {
                slug: 'behaviors',
                label: 'Pipeline Behaviors',
                file: 'Behaviors.jsx',
                description: 'Add logging, validation and other cross-cutting concerns around request handlers with IPipelineBehavior.',
            },
            {
                slug: 'notification-behaviors',
                label: 'Notification Behaviors',
                file: 'NotificationBehaviors.jsx',
                description: 'Wrap publishing and individual handler executions with INotificationBehavior and INotificationHandlerBehavior.',
            },
            {
                slug: 'stream-behaviors',
                label: 'Stream Behaviors',
                file: 'StreamBehaviors.jsx',
                description: 'Wrap stream handlers with IStreamBehavior to log, filter or transform the items they yield.',
            },
        ],
    },
    {
        title: 'Advanced',
        items: [
            {
                slug: 'auto-registration',
                label: 'Auto-Registration',
                file: 'AutoRegistration.jsx',
                description: 'Let the MediatRR source generator register request and stream handlers at compile time, without assembly scanning.',
            },
        ],
    },
    {
        title: 'Upgrade Guides',
        items: [
            {
                slug: 'migrating-to-2',
                label: 'Migrating to 2.0',
                file: 'MigratingTo2.jsx',
                description: 'Breaking changes, upgrade steps and the defects fixed in MediatRR 2.0.',
            },
        ],
    },
];

// Flat ordered list — used for prev/next and search.
export const DOCS_FLAT = DOCS_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title }))
);

export function findDocIndex(slug) {
    return DOCS_FLAT.findIndex((d) => d.slug === slug);
}
