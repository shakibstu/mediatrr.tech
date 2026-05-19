import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Docs from './pages/Docs';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import SearchModal from './components/SearchModal';
import './index.css';

function App() {
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <Router>
      <div className="app-layout">
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/*" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
