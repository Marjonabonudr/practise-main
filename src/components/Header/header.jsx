import React from 'react';
import './Header.css';

const Header = () => {
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload(); // Sahifani yangilab Login holatiga qaytaradi
    };

    return (
        <header className="main-header">
            <div className="header-logo">Algoritm Amaliyot Monitoringi</div>
            <button className="logout-btn" onClick={handleLogout}>Chiqish</button>
        </header>
    );
};

export default Header;
