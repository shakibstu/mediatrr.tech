import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import Docs from './pages/Docs';
import NotFound from './pages/NotFound';

function App() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <Router>
      <ScrollManager />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app-layout">
        <Navbar onSearchOpen={openSearch} />
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/*" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      </div>
    </Router>
  );
}

export default App;
