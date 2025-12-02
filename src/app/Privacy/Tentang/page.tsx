// app/Privacy/Tentang/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PrivacyHeader from '@/components/PrivacyHeader';
import PrivacyFooter from '@/components/PrivacyFooter';
import SyaratLayanan from './SyaratLayanan';
import KebijakanPrivasi from './KebijakanPrivasi';
import CaraKomplain from './CaraKomplain';
import Retur from './Retur';

export default function TentangJajaID() {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section');
  const [activeSection, setActiveSection] = useState(sectionFromUrl || 'tentang');
  
  useEffect(() => {
    if (sectionFromUrl) {
      setActiveSection(sectionFromUrl);
    }
  }, [sectionFromUrl]);
  
  const styles = {
    pageContainer: {
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px',
      display: 'flex',
      gap: '60px',
    },
    sidebar: {
      width: '250px',
      flexShrink: 0,
    },
    contentArea: {
      flex: 1,
      maxWidth: '800px',
    },
    title: {
      fontSize: '36px',
      fontWeight: 700,
      color: '#1a1a2e',
      marginBottom: '40px',
      textAlign: 'center' as const,
    },
    section: {
      marginBottom: '50px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '20px',
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#4a5568',
      marginBottom: '15px',
    },
    highlight: {
      fontWeight: 600,
      fontStyle: 'italic',
      color: '#1a1a2e',
    },
    list: {
      paddingLeft: '20px',
      marginTop: '15px',
    },
    listItem: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#4a5568',
      marginBottom: '12px',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #e2e8f0',
      margin: '40px 0',
    },
    contactSection: {
      marginTop: '50px',
      padding: '30px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
    },
    contactTitle: {
      fontSize: '20px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '15px',
    },
    contactText: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#4a5568',
      margin: '5px 0',
    },
    linksSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
    },
    link: {
      color: '#4a5568',
      textDecoration: 'none',
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      display: 'block',
      padding: '8px 0',
    },
    linkActive: {
      color: '#1a1a2e',
      fontWeight: 600,
    },
  };

  const renderContent = () => {
    // Syarat Layanan
    if (activeSection === 'syarat-layanan') {
      return <SyaratLayanan />;
    }

    // Kebijakan Privasi
    if (activeSection === 'kebijakan-privasi') {
      return <KebijakanPrivasi />;
    }

    // Cara Menangapi Komplain
    if (activeSection === 'cara-komplain') {
      return <CaraKomplain />;
    }

    // Ketentuan Pengembalian Dana dan Barang
    if (activeSection === 'ketentuan-pengembalian') {
      return <Retur />;
    }

    // Default content - Tentang Jaja ID
    return (
      <div style={styles.contentArea}>
        <h1 style={styles.title}>Tentang Jaja ID 2020</h1>
        
        <section style={styles.section}>
          <p style={styles.paragraph}>
            Jaja.id merupakan salah satu <span style={styles.highlight}>Marketplace pertama Khusus Hobby di Indonesia</span> yang 
            menyediakan fasilitas jual-beli dari konsumen ke konsumen. Semua orang dapat membuka toko online 
            di Jaja.id dan melayani pembeli dari seluruh Indonesia untuk membantu memenuhi kebutuhan hobby 
            masyarakat Indonesia.
          </p>
          
          <p style={styles.paragraph}>
            Jaja memiliki slogan <span style={styles.highlight}>1st Marketplace For your Hobbies</span> karena 
            Jaja.id merupakan marketplace pertama khusus hobby di Indonesia.
          </p>
        </section>

        <hr style={styles.divider} />

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Visi Jaja.id</h2>
          <p style={styles.paragraph}>
            Menjadi Marketplace Khusus Hobby Terbesar di Indonesia
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Misi Jaja.id</h2>
          <p style={styles.paragraph}>
            Sebagai upaya untuk mewujudkan visi diatas, maka misi Jaja.id adalah:
          </p>
          <ol style={styles.list}>
            <li style={styles.listItem}>
              Merangkul komunitas-komunitas tiap hobby yang ada di Indonesia
            </li>
            <li style={styles.listItem}>
              Memenuhi semua kebutuhan hobby untuk semua kalangan
            </li>
          </ol>
        </section>

        <hr style={styles.divider} />

        <div style={styles.contactSection}>
          <h3 style={styles.contactTitle}>PT Jaja Indonesia</h3>
          <p style={styles.contactText}>Jl.H. Baping Raya No. 100</p>
          <p style={styles.contactText}>Gedung S, Ciracas</p>
          <p style={styles.contactText}>Jakarta Timur, 13740</p>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.pageContainer}>
      <PrivacyHeader />
      
      <main style={styles.mainContent}>
        {/* Sidebar Links */}
        <aside style={styles.sidebar}>
          <nav style={styles.linksSection}>
            <a 
              onClick={() => setActiveSection('tentang')}
              style={{
                ...styles.link, 
                ...(activeSection === 'tentang' ? styles.linkActive : {})
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
              onMouseOut={(e) => e.currentTarget.style.color = activeSection === 'tentang' ? '#1a1a2e' : '#4a5568'}
            >
              Tentang Jaja ID
            </a>
            <a 
              onClick={() => setActiveSection('syarat-layanan')}
              style={{
                ...styles.link, 
                ...(activeSection === 'syarat-layanan' ? styles.linkActive : {})
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
              onMouseOut={(e) => e.currentTarget.style.color = activeSection === 'syarat-layanan' ? '#1a1a2e' : '#4a5568'}
            >
              Syarat Layanan
            </a>
            <a 
              onClick={() => setActiveSection('kebijakan-privasi')}
              style={{
                ...styles.link, 
                ...(activeSection === 'kebijakan-privasi' ? styles.linkActive : {})
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
              onMouseOut={(e) => e.currentTarget.style.color = activeSection === 'kebijakan-privasi' ? '#1a1a2e' : '#4a5568'}
            >
              Kebijakan Privasi
            </a>
            <a 
              onClick={() => setActiveSection('cara-komplain')}
              style={{
                ...styles.link, 
                ...(activeSection === 'cara-komplain' ? styles.linkActive : {})
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
              onMouseOut={(e) => e.currentTarget.style.color = activeSection === 'cara-komplain' ? '#1a1a2e' : '#4a5568'}
            >
              Cara Menangapi Komplain
            </a>
            <a 
              onClick={() => setActiveSection('ketentuan-pengembalian')}
              style={{
                ...styles.link, 
                ...(activeSection === 'ketentuan-pengembalian' ? styles.linkActive : {})
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4a90e2'}
              onMouseOut={(e) => e.currentTarget.style.color = activeSection === 'ketentuan-pengembalian' ? '#1a1a2e' : '#4a5568'}
            >
              Ketentuan Pengembalian Dana dan Barang
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        {renderContent()}
      </main>

      <PrivacyFooter />
    </div>
  );
}
