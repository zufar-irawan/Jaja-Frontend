'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const PrivacyHeader: React.FC = () => {
  const styles = {
    privacyHeader: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      padding: '30px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
    privacyHeaderContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    privacyLogo: {
      height: '70px',
      width: 'auto',
      objectFit: 'contain' as const,
    },
  };
  const router = useRouter();

  return (
    <header style={styles.privacyHeader}>
      <div style={styles.privacyHeaderContent}>
        <div style={styles.logoSection}>
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => router.push("/")}
          >
          <img 
            src="/images/logo.webp" 
            alt="Jaja.id Logo" 
            style={styles.privacyLogo}
          />
          </div>
        </div>
      </div>
    </header>
  );
};

export default PrivacyHeader;