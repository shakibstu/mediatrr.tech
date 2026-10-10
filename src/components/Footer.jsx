import React from 'react';
import { Link } from 'react-router-dom';
import { Bug, Github, Mail, Package } from 'lucide-react';
import { DOCS_SECTIONS } from '../data/navigation';
import { MEDIATRR_VERSION } from '../data/version';
import { CONTACT_EMAIL, ISSUES_URL, NUGET_CONTRACT_URL, NUGET_URL, REPO_URL } from '../data/site';

const external = { target: '_blank', rel: 'noopener noreferrer' };

const Footer = () => {
    const [gettingStarted, coreConcepts] = DOCS_SECTIONS;

    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section footer-brand">
                    <p className="footer-logo">
                        MediatRR
                        <span className="nav-version">v{MEDIATRR_VERSION}</span>
                    </p>
                    <p>
                        A mediator for .NET with request/response, streams and resilient asynchronous
                        notifications. MIT-licensed and free to use, forever.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>{gettingStarted.title}</h4>
                    {gettingStarted.items.map((item) => (
                        <Link key={item.slug} to={`/docs/${item.slug}`} className="footer-link">{item.label}</Link>
                    ))}
                    <Link to="/docs/migrating-to-2" className="footer-link">Migrating to 2.0</Link>
                </div>

                <div className="footer-section">
                    <h4>{coreConcepts.title}</h4>
                    {coreConcepts.items.map((item) => (
                        <Link key={item.slug} to={`/docs/${item.slug}`} className="footer-link">{item.label}</Link>
                    ))}
                    <Link to="/docs/auto-registration" className="footer-link">Auto-Registration</Link>
                </div>

                <div className="footer-section">
                    <h4>Resources</h4>
                    <a href={REPO_URL} {...external} className="footer-link"><Github size={16} /> GitHub</a>
                    <a href={NUGET_URL} {...external} className="footer-link"><Package size={16} /> MediatRR on NuGet</a>
                    <a href={NUGET_CONTRACT_URL} {...external} className="footer-link"><Package size={16} /> MediatRR.Contract on NuGet</a>
                    <a href={ISSUES_URL} {...external} className="footer-link"><Bug size={16} /> Report an issue</a>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link"><Mail size={16} /> {CONTACT_EMAIL}</a>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>&copy; {new Date().getFullYear()} Shakib Loveimi.</p>
                    <p>MediatRR is released under the MIT License.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
