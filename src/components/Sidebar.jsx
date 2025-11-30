import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '2rem' }}>
                <h4>Getting Started</h4>
                <NavLink to="/docs/introduction" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Introduction</NavLink>
                <NavLink to="/docs/installation" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Installation</NavLink>
                <NavLink to="/docs/basic-usage" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Basic Usage</NavLink>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h4>Core Concepts</h4>
                <NavLink to="/docs/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Requests & Handlers</NavLink>
                <NavLink to="/docs/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Notifications</NavLink>
                <NavLink to="/docs/behaviors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Pipeline Behaviors</NavLink>
                <NavLink to="/docs/notification-behaviors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Notification Behaviors</NavLink>
            </div>

            <div>
                <h4>Advanced</h4>
                <NavLink to="/docs/auto-registration" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Auto-Registration</NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
