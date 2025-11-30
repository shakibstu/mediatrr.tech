import React from 'react';
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

const Docs = () => {
    return (
        <div className="docs-layout">
            <Sidebar />
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
                </Routes>
            </main>
        </div>
    );
};

export default Docs;
