import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">MediatRR</Link>
      <div className="nav-links">
        <Link to="/docs" className="nav-link">Documentation</Link>
        <a href="https://github.com/shakibstu/MediatRR" target="_blank" rel="noopener noreferrer" className="nav-link">
          <Github size={20} />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
