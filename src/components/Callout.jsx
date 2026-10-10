import React from 'react';
import { AlertTriangle, Info, Lightbulb, Sparkles } from 'lucide-react';

const ICONS = {
    info: Info,
    tip: Lightbulb,
    warning: AlertTriangle,
    new: Sparkles,
};

const Callout = ({ variant = 'info', title, children }) => {
    const Icon = ICONS[variant] ?? Info;

    return (
        <aside className={`callout callout-${variant}`}>
            <div className="callout-icon" aria-hidden="true">
                <Icon size={18} />
            </div>
            <div className="callout-body">
                {title && <p className="callout-title">{title}</p>}
                {children}
            </div>
        </aside>
    );
};

export default Callout;
