// CaraKomplain.tsx (letakkan di folder yang sama dengan page.tsx)
import React from 'react';

export default function CaraKomplain() {
  const styles = {
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
      marginBottom: '40px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '20px',
    },
    subsectionTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '15px',
      marginTop: '25px',
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#4a5568',
      marginBottom: '15px',
    },
    highlight: {
      fontWeight: 600,
      color: '#1a1a2e',
    },
    list: {
      paddingLeft: '20px',
      marginTop: '15px',
      marginBottom: '15px',
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
    warningBox: {
      padding: '20px',
      backgroundColor: '#fff3cd',
      borderLeft: '4px solid #ffc107',
      borderRadius: '4px',
      marginBottom: '20px',
    },
    warningText: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#856404',
      margin: '5px 0',
    },
    infoBox: {
      padding: '20px',
      backgroundColor: '#e7f3ff',
      borderLeft: '4px solid #4a90e2',
      borderRadius: '4px',
      marginBottom: '20px',
    },
    infoText: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#004085',
      margin: '5px 0',
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
  };

  return (
    <div style={styles.contentArea}>
      <h1 style={styles.title}>Cara Menangapi Komplain Retur dari Pembeli</h1>
      
      <section style={styles.section}>
        <p style={styles.paragraph}>
          Sebagai penjual di Jaja.id, penting bagi Anda untuk menanggapi komplain dari pembeli dengan cepat dan profesional. Panduan ini akan membantu Anda memahami proses penanganan komplain dan retur barang.
        </p>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Cara Masuk ke Area Diskusi dari Transaksi yang Sedang Dikomplain</h2>
        <p style={styles.paragraph}>
          Ada dua cara untuk mengakses area diskusi komplain:
        </p>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Melalui Email:</span> Klik tombol <span style={styles.highlight}>"Balas Diskusi Komplain Barang"</span> dari email pemberitahuan retur yang Anda terima dari Jaja.id
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Melalui Dashboard:</span>
            <ul style={styles.list}>
              <li style={styles.listItem}>Masuk ke menu <span style={styles.highlight}>Transaksi</span></li>
              <li style={styles.listItem}>Klik <span style={styles.highlight}>Lihat Semua Transaksi</span></li>
              <li style={styles.listItem}>Pilih tab <span style={styles.highlight}>Komplain/Retur</span></li>
              <li style={styles.listItem}>Cari nomor transaksi terkait</li>
              <li style={styles.listItem}>Masuk ke halaman detail transaksi</li>
              <li style={styles.listItem}>Pilih tab <span style={styles.highlight}>Diskusi Komplain</span></li>
            </ul>
          </li>
        </ol>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Ketentuan dan Cara Penyelesaian Diskusi Retur Secara Umum</h2>
        
        <h3 style={styles.subsectionTitle}>Langkah-langkah Menanggapi Komplain:</h3>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            Pastikan Anda sudah memilih tab <span style={styles.highlight}>Diskusi Komplain</span> pada halaman detail transaksi yang ingin Anda balas/tanggapi
          </li>
          <li style={styles.listItem}>
            Cari bagian <span style={styles.highlight}>Diskusi Komplain Barang</span>. Pada bagian tersebut, Anda bisa menyimak alasan mengapa pembeli mengajukan permintaan retur beserta foto barang yang ia terima
          </li>
          <li style={styles.listItem}>
            Balas diskusi yang diajukan oleh pembeli dan buatlah kesepakatan diskusi di kolom tersebut
          </li>
        </ol>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            <span style={styles.highlight}>⚠️ PENTING:</span> Diskusi Komplain retur dianggap valid oleh Admin Jaja.id untuk menengahi diskusi, selama diskusi tersebut berlangsung di fitur Kirim Pesan dan/atau halaman Diskusi Komplain.
          </p>
        </div>

        <h3 style={styles.subsectionTitle}>Ketentuan Diskusi Komplain untuk Penjual:</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Jadilah penjual yang aktif berdiskusi</span> agar permasalahan cepat selesai
          </li>
          <li style={styles.listItem}>
            Jika Anda <span style={styles.highlight}>tidak memberikan balasan dalam 3x24 jam</span> sejak komplain diajukan pembeli, uang pembayaran akan dikembalikan kepada pembeli
          </li>
          <li style={styles.listItem}>
            Jika Anda harus mengirimkan barang pengganti/tambahan ke alamat pembeli kemudian tidak memenuhinya sesuai tenggat waktu yang diberikan, uang pembayaran akan diteruskan ke pembeli
          </li>
          <li style={styles.listItem}>
            Jika retur tidak disetujui Admin karena barang yang dibeli sudah sesuai deskripsi atau kerusakan disebabkan kesalahan pembeli, maka uang pembayaran akan langsung diteruskan ke BukaDompet milik Anda
          </li>
          <li style={styles.listItem}>
            Anda bisa menekan tombol <span style={styles.highlight}>"Panggil Admin"</span> jika diskusi dengan pembeli menemui jalan buntu (tidak bisa menemukan kesepakatan)
          </li>
          <li style={styles.listItem}>
            Setelah Anda dan pembeli mencapai kesepakatan, atau setelah solusi diskusi disetujui Admin, Anda bisa melanjutkan penyelesaian komplain sesuai tipe retur yang disetujui Admin
          </li>
        </ul>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tipe-Tipe Penyelesaian Komplain</h2>

        <h3 style={styles.subsectionTitle}>1. Penyelesaian Komplain dengan Tipe Solusi Pengembalian Uang</h3>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <span style={styles.highlight}>📧 Notifikasi:</span> Anda akan mendapatkan email "Permintaan Pengembalian Uang Disetujui" dari Jaja.id
          </p>
        </div>

        <p style={styles.paragraph}>
          <span style={styles.highlight}>Langkah-langkah:</span>
        </p>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            Pastikan alamat Anda untuk pengembalian barang yang tertera di tab Diskusi Komplain sudah benar. Klik <span style={styles.highlight}>Ubah Alamat</span> pada tab Diskusi Komplain transaksi terkait jika alamat Anda masih belum sesuai
          </li>
          <li style={styles.listItem}>
            Anda akan mendapatkan notifikasi berupa email <span style={styles.highlight}>"Barang Telah Dikirim"</span> dari Jaja.id, begitu pembeli telah mengirimkan barang ke alamat Anda
          </li>
          <li style={styles.listItem}>
            Jangan lupa untuk klik <span style={styles.highlight}>Konfirmasi Terima Barang</span> begitu Anda menerima barang
          </li>
          <li style={styles.listItem}>
            Uang pembayaran akan diteruskan oleh Admin ke BukaDompet sesuai kesepakatan diskusi
          </li>
        </ol>

        <h3 style={styles.subsectionTitle}>2. Penyelesaian Komplain dengan Tipe Solusi Penggantian Barang</h3>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <span style={styles.highlight}>📧 Notifikasi:</span> Anda akan mendapatkan email "Permintaan Penggantian Barang Disetujui" dari Jaja.id
          </p>
        </div>

        <p style={styles.paragraph}>
          <span style={styles.highlight}>Langkah-langkah:</span>
        </p>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            Pastikan alamat Anda untuk pengembalian barang yang tertera di tab Diskusi Komplain sudah benar. Klik <span style={styles.highlight}>Ubah Alamat</span> pada tab Diskusi Komplain transaksi terkait jika alamat Anda masih belum sesuai
          </li>
          <li style={styles.listItem}>
            Anda akan mendapatkan notifikasi berupa email <span style={styles.highlight}>"Barang Telah Dikirim"</span> dari Jaja.id, begitu pembeli telah mengirimkan barang ke alamat Anda
          </li>
          <li style={styles.listItem}>
            Jangan lupa untuk klik <span style={styles.highlight}>Konfirmasi Terima Barang</span> begitu Anda menerima barang
          </li>
          <li style={styles.listItem}>
            Setelah itu, <span style={styles.highlight}>segera kirim barang pengganti</span> ke alamat pembeli yang diberikan pada halaman diskusi
          </li>
          <li style={styles.listItem}>
            Klik <span style={styles.highlight}>Konfirmasi Kirim Barang</span>, masukkan nomor resi pengiriman barang pengganti, lalu klik <span style={styles.highlight}>Kirim Nomor Resi</span>
          </li>
          <li style={styles.listItem}>
            Setelah pembeli melakukan konfirmasi bahwa ia telah menerima barang pengganti yang Anda kirim, uang pembayaran akan diteruskan oleh Admin ke BukaDompet sesuai kesepakatan diskusi
          </li>
        </ol>

        <h3 style={styles.subsectionTitle}>3. Penyelesaian Komplain dengan Tipe Solusi Penambahan Barang</h3>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <span style={styles.highlight}>📧 Notifikasi:</span> Anda akan mendapatkan email "Permintaan Penambahan Barang Disetujui" dari Jaja.id
          </p>
        </div>

        <p style={styles.paragraph}>
          <span style={styles.highlight}>Langkah-langkah:</span>
        </p>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Segera kirim barang tambahan</span> ke alamat pembeli yang diberikan pada halaman diskusi
          </li>
          <li style={styles.listItem}>
            Klik <span style={styles.highlight}>Konfirmasi Kirim Barang</span>, masukkan nomor resi pengiriman barang tambahan, lalu klik <span style={styles.highlight}>Kirim Nomor Resi</span>
          </li>
          <li style={styles.listItem}>
            Setelah pembeli melakukan konfirmasi bahwa ia telah menerima barang tambahan yang Anda kirim, uang pembayaran akan diteruskan oleh Admin ke BukaDompet sesuai kesepakatan diskusi
          </li>
        </ol>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tips Menangani Komplain dengan Baik</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Tanggap dan Cepat:</span> Balas komplain dalam waktu maksimal 3x24 jam untuk menghindari pengembalian dana otomatis
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Komunikasi yang Baik:</span> Berkomunikasilah dengan sopan dan profesional kepada pembeli
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Pahami Masalah:</span> Baca dengan cermat alasan komplain dan lihat foto-foto yang dilampirkan pembeli
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Tawarkan Solusi:</span> Berikan solusi yang adil untuk kedua belah pihak
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Dokumentasi:</span> Simpan bukti pengiriman dan komunikasi dengan pembeli
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Libatkan Admin:</span> Jika menemui jalan buntu, jangan ragu untuk memanggil Admin Jaja.id
          </li>
        </ul>
      </section>

      <div style={styles.warningBox}>
        <p style={styles.warningText}>
          <span style={styles.highlight}>⏰ INGAT:</span> Waktu respon Anda sangat penting! Pastikan untuk selalu memantau transaksi Anda dan merespons komplain dalam waktu 3x24 jam untuk menghindari penalti otomatis.
        </p>
      </div>

      <hr style={styles.divider} />

      <div style={styles.contactSection}>
        <h3 style={styles.contactTitle}>Butuh Bantuan?</h3>
        <p style={styles.contactText}>
          Jika Anda memiliki pertanyaan lebih lanjut tentang cara menangani komplain atau mengalami kesulitan dalam prosesnya, silakan hubungi tim dukungan kami:
        </p>
        <p style={styles.contactText}>
          <span style={styles.highlight}>Email:</span> jajabussdev@gmail.com
        </p>
        <p style={styles.contactText}>
          <span style={styles.highlight}>Alamat:</span> Jl.H. Baping Raya No. 100, Gedung S, Ciracas, Jakarta Timur, 13740
        </p>
      </div>
    </div>
  );
}