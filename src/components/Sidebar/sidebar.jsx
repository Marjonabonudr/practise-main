import React from 'react';
import './sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="main-sidebar">
            <ul className="sidebar-menu">
                <li className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                    <span className="menu-icon">📊</span> 
                    <span className="menu-text">Dashboard</span>
                </li>
                <li className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
                    <span className="menu-icon">👥</span> 
                    <span className="menu-text">O‘quvchilar</span>
                </li>
                <li className={`menu-item ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>
                    <span className="menu-icon">🏢</span> 
                    <span className="menu-text">Kompaniyalar</span>
                </li>
                <li className={`menu-item ${activeTab === 'problems' ? 'active' : ''}`} onClick={() => setActiveTab('problems')}>
                    <span className="menu-icon">🛠️</span> 
                    <span className="menu-text">Muammolar</span>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
