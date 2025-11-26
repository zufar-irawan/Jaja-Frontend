'use client';

import React from 'react';

const PrivacyHeader: React.FC = () => {
  const styles = {
    privacyHeader: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      padding: '15px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
    privacyHeaderContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
    },
    privacyLogo: {
      height: '40px',
      width: 'auto',
      objectFit: 'contain' as const,
    },
    privacyNav: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
    },
    navLink: {
      color: '#333',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: 500,
      transition: 'color 0.3s ease',
    },
  };

  return (
    <header style={styles.privacyHeader}>
      <div style={styles.privacyHeaderContent}>
        <div style={styles.logoSection}>
          <img 
            src="/images/logo.webp" 
            alt="Jaja.id Logo" 
            style={styles.privacyLogo}
          />
        </div>
        <nav style={styles.privacyNav}>
          <a 
            href="/" 
            style={styles.navLink}
            onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#333'}
          >
            Beranda
          </a>
          <a 
            href="/tentang" 
            style={styles.navLink}
            onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#333'}
          >
            Tentang
          </a>
          <a 
            href="/kontak" 
            style={styles.navLink}
            onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
            onMouseOut={(e) => e.currentTarget.style.color = '#333'}
          >
            Kontak
          </a>
        </nav>
      </div>
    </header>
  );
};

export default PrivacyHeader;