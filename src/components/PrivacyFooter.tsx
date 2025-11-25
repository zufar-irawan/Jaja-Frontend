'use client';

import React from 'react';

const PrivacyFooter: React.FC = () => {
  const styles = {
    privacyFooter: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e0e0e0',
      padding: '20px 0',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '20px',
    },
    copyright: {
      color: '#666',
      fontSize: '14px',
      margin: 0,
    },
    logo: {
      height: '40px',
      width: 'auto',
    },
    links: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    link: {
      color: '#4a90e2',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'color 0.3s ease',
    },
  };

  return (
    <footer style={styles.privacyFooter}>
      <div style={styles.footerContent}>
        <p style={styles.copyright}>
          © 2025 PT Jaja Usaha Laku
        </p>
        
        <div>
          <img 
            src="/images/logo.webp" 
            alt="Jaja.id Logo" 
            style={styles.logo}
          />
        </div>

        <div style={styles.links}>
          <a 
            href="https://jaja.id" 
            style={styles.link}
            onMouseOver={(e) => e.currentTarget.style.color = '#357abd'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4a90e2'}
          >
            Website
          </a>
          <a 
            href="https://play.google.com/store/apps/jaja" 
            style={styles.link}
            onMouseOver={(e) => e.currentTarget.style.color = '#357abd'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4a90e2'}
          >
            Android
          </a>
          <a 
            href="https://apps.apple.com/app/jaja" 
            style={styles.link}
            onMouseOver={(e) => e.currentTarget.style.color = '#357abd'}
            onMouseOut={(e) => e.currentTarget.style.color = '#4a90e2'}
          >
            iOS
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PrivacyFooter;