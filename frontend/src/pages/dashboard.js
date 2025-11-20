import React, { useState } from 'react';
import '../assets/Dashboard.css';
import '../assets/Patients.css';
import Pasien from './pasien';
import Askep from './askep';

const Dashboard = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    },
    { 
      id: 'pasien', 
      label: 'Pasien', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
        </svg>
      )
    },
    { 
      id: 'askep', 
      label: 'Asuhan Keperawatan', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="page-header">
              <div className="header-content">
                <h1>Dashboard Overview</h1>
                <p className="header-subtitle">Monitor dan kelola aktivitas sistem asuhan keperawatan</p>
              </div>
              
            </div>
            
            <div className="welcome-card">
              <div className="welcome-content">
                <div className="welcome-text">
                  <h2>Selamat datang kembali, {user.username}!</h2>
                  <p>Anda login sebagai <span className="role-badge">{user.role}</span></p>
                  <p className="welcome-desc">Kelola asuhan keperawatan dengan mudah dan efisien.</p>
                </div>
                <div className="welcome-illustration">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#00B4D8" strokeWidth="2" fill="none"/>
                    <path d="M12 8V16M8 12H16" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" fill="#00B4D8" opacity="0.2"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="stats-section">
              <h3 className="section-title">Ringkasan Aktivitas</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon patients">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="stat-trend positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                      </svg>
                      +12%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>Total Pasien</h3>
                    <p className="stat-number">246</p>
                    <p className="stat-description">Pasien terdaftar bulan ini</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon askep">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="stat-trend positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                      </svg>
                      +8%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>Askep Aktif</h3>
                    <p className="stat-number">89</p>
                    <p className="stat-description">Rencana yang sedang berjalan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-section">
              <div className="section-header">
                <h3 className="section-title">Aktivitas Terbaru</h3>
                <button className="btn-secondary">Lihat Semua</button>
              </div>
              <div className="activity-grid">
                <div className="activity-card">
                  <div className="activity-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <h4>Pasien Baru Ditambahkan</h4>
                    <p>Ahmad Wijaya telah didaftarkan ke sistem</p>
                    <span className="activity-time">2 menit yang lalu</span>
                  </div>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <h4>Asuahan Keperawatan Dibuat</h4>
                    <p>Rencana asuhan untuk Siti Aminah selesai</p>
                    <span className="activity-time">15 menit yang lalu</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        );
      case 'pasien':
        return <Pasien />;
      case 'askep':
        return <Askep/>;
      case 'evaluasi':
        return (
          <div className="dashboard-content">
            <h1>Evaluasi</h1>
            <p>Evaluasi hasil asuhan keperawatan...</p>
          </div>
        );
      case 'laporan':
        return (
          <div className="dashboard-content">
            <h1>Laporan</h1>
            <p>Lihat dan cetak laporan asuhan keperawatan...</p>
          </div>
        );
      default:
        return (
          <div className="dashboard-content">
            <h1>Dashboard</h1>
            <p>Pilih menu di sidebar untuk mulai bekerja.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div className="brand-text">
            <h3>Sistem Askep</h3>
            <p>Healthcare Platform</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activeMenu === item.id && <div className="active-indicator"></div>}
            </button>
          ))}
          
          <div className="nav-divider"></div>
          
          <button className="nav-item logout-btn" onClick={onLogout}>
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
                <path d="M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{user.username}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
