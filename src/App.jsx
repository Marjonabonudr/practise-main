import React, { useState, useEffect } from 'react';
import Login from './pages/Login/login'; // Kichik harfli fayl nomiga moslandi
import Dashboard from './pages/Dashboard/dashboard'; // Kichik harfli fayl nomiga moslandi

function App() {
  // Tizimga kirganlik holati
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Xotirada avvaldan kirilgan token borligini tekshirish
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Muvaffaqiyatli login bo'lganda Dashboard sahifasiga havola (link) o'tishi
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Tizimdan chiqish havolasi
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="app-main-root">
      {isLoggedIn ? (
        // Kirilgan bo'lsa boshqaruv panelini ochish
        <Dashboard onLogout={handleLogout} />
      ) : (
        // Kirilmagan bo'lsa login oynasini ochish
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
