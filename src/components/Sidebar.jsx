import React from 'react';
import { NavLink } from 'react-router-dom';


const Sidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-close-btn" onClick={onClose}>&times;</button>
            <div style={{ marginBottom: '2rem' }}>
                <h4>Getting Started</h4>
                <NavLink to="/docs/introduction" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Introduction</NavLink>
                <NavLink to="/docs/installation" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Installation</NavLink>
                <NavLink to="/docs/basic-usage" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Basic Usage</NavLink>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h4>Core Concepts</h4>
                <NavLink to="/docs/requests" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Requests & Handlers</NavLink>
                <NavLink to="/docs/streams" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Streams & Handlers</NavLink>
                <NavLink to="/docs/notifications" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Notifications</NavLink>
                <NavLink to="/docs/behaviors" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Pipeline Behaviors</NavLink>
                <NavLink to="/docs/notification-behaviors" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Notification Behaviors</NavLink>
                <NavLink to="/docs/stream-behaviors" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Stream Behaviors</NavLink>
            </div>

            <div>
                <h4>Advanced</h4>
                <NavLink to="/docs/auto-registration" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>Auto-Registration</NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
