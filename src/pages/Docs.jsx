import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
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

const Docs = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="docs-layout">
            <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open Menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="content">
                <Routes>
                    <Route path="/" element={<Navigate to="/docs/introduction" replace />} />
                    <Route path="/introduction" element={<Introduction />} />
                    <Route path="/installation" element={<Installation />} />
                    <Route path="/basic-usage" element={<BasicUsage />} />
                    <Route path="/behaviors" element={<Behaviors />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/notification-behaviors" element={<NotificationBehaviors />} />
                    <Route path="/auto-registration" element={<AutoRegistration />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/streams" element={<Streams />} />
                    <Route path="/stream-behaviors" element={<StreamBehaviors />} />
                </Routes>
            </main>
        </div>
    );
};

export default Docs;
