import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import DocPage from '../components/DocPage';
import NotFound from './NotFound';
import { DOCS_FLAT } from '../data/navigation';

import Introduction from './docs/Introduction';
import Installation from './docs/Installation';
import BasicUsage from './docs/BasicUsage';
import Behaviors from './docs/Behaviors';
import Notifications from './docs/Notifications';
import NotificationBehaviors from './docs/NotificationBehaviors';
import AutoRegistration from './docs/AutoRegistration';
import Requests from './docs/Requests';
import Streams from './docs/Streams';
import StreamBehaviors from './docs/StreamBehaviors';
import MigratingTo2 from './docs/MigratingTo2';
import DeadLetterHandlers from './docs/DeadLetterHandlers';
import OrderedNotifications from './docs/OrderedNotifications';
import Metrics from './docs/Metrics';
import WhatsNew21 from './docs/WhatsNew21';

// Pair the data-driven nav with the actual React components.
const PAGES = {
    'introduction': Introduction,
    'installation': Installation,
    'basic-usage': BasicUsage,
    'requests': Requests,
    'streams': Streams,
    'notifications': Notifications,
    'dead-letter-handlers': DeadLetterHandlers,
    'ordered-notifications': OrderedNotifications,
    'behaviors': Behaviors,
    'notification-behaviors': NotificationBehaviors,
    'stream-behaviors': StreamBehaviors,
    'auto-registration': AutoRegistration,
    'metrics': Metrics,
    'whats-new-2-1': WhatsNew21,
    'migrating-to-2': MigratingTo2,
};

const Docs = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();
    const currentSlug = pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
    const current = DOCS_FLAT.find((doc) => doc.slug === currentSlug);

    return (
        <div className="docs-layout">
            <div className="docs-toolbar">
                <button
                    type="button"
                    className="docs-menu-btn"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open documentation menu"
                >
                    <Menu size={18} />
                    <span>Menu</span>
                </button>
                {current && (
                    <span className="docs-crumb">
                        <span>{current.section}</span>
                        <span aria-hidden="true">/</span>
                        <strong>{current.label}</strong>
                    </span>
                )}
            </div>
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Navigate to="/docs/introduction" replace />} />
                    {DOCS_FLAT.map((doc) => {
                        const Page = PAGES[doc.slug];
                        return (
                            <Route
                                key={doc.slug}
                                path={`/${doc.slug}`}
                                element={<DocPage doc={doc}><Page /></DocPage>}
                            />
                        );
                    })}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
};

export default Docs;
