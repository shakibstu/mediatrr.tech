// Single source of truth for the docs navigation.
// Drives the sidebar, the route table, prev/next pagination, and search.

export const DOCS_SECTIONS = [
    {
        title: 'Getting Started',
        items: [
            { slug: 'introduction', label: 'Introduction', file: 'Introduction.jsx' },
            { slug: 'installation', label: 'Installation', file: 'Installation.jsx' },
            { slug: 'basic-usage', label: 'Basic Usage', file: 'BasicUsage.jsx' },
        ],
    },
    {
        title: 'Core Concepts',
        items: [
            { slug: 'requests', label: 'Requests & Handlers', file: 'Requests.jsx' },
            { slug: 'streams', label: 'Streams & Handlers', file: 'Streams.jsx' },
            { slug: 'notifications', label: 'Notifications', file: 'Notifications.jsx' },
            { slug: 'behaviors', label: 'Pipeline Behaviors', file: 'Behaviors.jsx' },
            { slug: 'notification-behaviors', label: 'Notification Behaviors', file: 'NotificationBehaviors.jsx' },
            { slug: 'stream-behaviors', label: 'Stream Behaviors', file: 'StreamBehaviors.jsx' },
        ],
    },
    {
        title: 'Advanced',
        items: [
            { slug: 'auto-registration', label: 'Auto-Registration', file: 'AutoRegistration.jsx' },
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
