import React, { useEffect, useState } from 'react';
import './Header.css';
import Button from '../ui/Button';
import Drawer from '../Sidebar/Drawer';

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Theme toggle – reads/writes from localStorage
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  // Initialise theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Sahifani yangilab Login holatiga qaytaradi
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="main-header">
      <button className="hamburger" onClick={openDrawer}>☰</button>
      <div className="header-logo">Algoritm Amaliyot Monitoringi</div>
      <Button variant="primary" onClick={handleLogout}>Chiqish</Button>
      {/* Theme toggle */}
      <Button variant="primary" onClick={toggleTheme}>Mavzu</Button>
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </header>
  );
};

export default Header;
