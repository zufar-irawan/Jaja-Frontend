// Retur.tsx (letakkan di folder yang sama dengan page.tsx)
import React from 'react';

export default function Retur() {
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
    successBox: {
      padding: '20px',
      backgroundColor: '#d4edda',
      borderLeft: '4px solid #28a745',
      borderRadius: '4px',
      marginBottom: '20px',
    },
    successText: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#155724',
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
    definitionBox: {
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.contentArea}>
      <h1 style={styles.title}>Ketentuan Pengembalian Dana dan Barang</h1>
      
      <section style={styles.section}>
        <p style={styles.paragraph}>
          Jaja.id terus meningkatkan layanan dan fasilitas untuk menjamin kepuasan Anda sebagai pelanggan. Kami memahami bahwa dalam transaksi online, terkadang terjadi situasi yang memerlukan pengembalian dana atau barang. Oleh karena itu, Jaja.id terus mengembangkan fasilitas dan metode pengaduan sehingga setiap masalah akan teratasi dengan cepat dan akurat.
        </p>
      </section>

      <div style={styles.definitionBox}>
        <h3 style={styles.subsectionTitle}>Definisi Istilah</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Refund (Pengembalian Dana):</span> Transaksi yang dibatalkan di mana barang yang sudah dibeli dikembalikan ke penjual dan uang dikembalikan kepada pembeli. Refund biasanya terjadi karena barang kurang sesuai dengan keinginan pembeli atau rusak.
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Return (Penukaran):</span> Penukaran barang yang sebelumnya sudah dibeli dengan barang lainnya karena alasan tertentu.
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Reject (Penolakan):</span> Penolakan barang yang diterima dalam kondisi tidak baik atau ditemukan adanya cacat.
          </li>
        </ul>
      </div>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>1. Kondisi Pengembalian Dana (Refund)</h2>
        <p style={styles.paragraph}>
          Jaja.id akan melakukan pengembalian dana atau refund dalam situasi berikut:
        </p>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            Penjual <span style={styles.highlight}>tidak melakukan konfirmasi pengiriman barang</span> dalam waktu:
            <ul style={styles.list}>
              <li style={styles.listItem}>3x24 jam di hari kerja (pengiriman reguler), atau</li>
              <li style={styles.listItem}>2x24 jam (pengiriman kilat)</li>
            </ul>
            setelah status transaksi berubah menjadi dibayar.
          </li>
          <li style={styles.listItem}>
            Penjual <span style={styles.highlight}>menolak pesanan dengan sengaja</span>.
          </li>
          <li style={styles.listItem}>
            Akun penjual <span style={styles.highlight}>dinonaktifkan</span> karena melanggar ketentuan Aturan Pengguna Jaja.id.
          </li>
          <li style={styles.listItem}>
            Transaksi <span style={styles.highlight}>dibatalkan atas kesepakatan</span> penjual dan pembeli.
          </li>
          <li style={styles.listItem}>
            Pembeli melakukan pembayaran dengan metode bank transfer, namun <span style={styles.highlight}>status transaksi sudah kedaluwarsa</span> (sudah lewat dari waktu yang sudah ditentukan).
          </li>
          <li style={styles.listItem}>
            Pembeli <span style={styles.highlight}>mengajukan retur barang</span> yang disetujui.
          </li>
        </ol>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2. Ketentuan Pengembalian Dana (Refund)</h2>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <span style={styles.highlight}>💰 Proses Pengembalian Dana:</span>
          </p>
          <ul style={styles.list}>
            <li style={styles.infoText}>
              Dana refund akan dikembalikan ke Dana pembeli (sesuai metode pembayaran yang digunakan)
            </li>
            <li style={styles.infoText}>
              Untuk pembayaran menggunakan kartu kredit, dana refund akan dikembalikan ke kartu kredit pembeli dengan maksimal <span style={styles.highlight}>14 hari kerja</span> terhitung sejak transaksi dibatalkan
            </li>
          </ul>
        </div>

        <p style={styles.paragraph}>
          Waktu pengembalian dana dapat bervariasi tergantung pada metode pembayaran dan kebijakan bank atau penyedia layanan pembayaran yang digunakan.
        </p>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>3. Permohonan Pengembalian Barang</h2>
        <p style={styles.paragraph}>
          Pembeli hanya boleh mengajukan permohonan pengembalian barang dan/atau pengembalian dana dalam situasi berikut:
        </p>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Barang belum diterima</span> oleh Pembeli
          </li>
          <li style={styles.listItem}>
            Barang tersebut <span style={styles.highlight}>cacat dan/atau rusak</span> saat diterima
          </li>
          <li style={styles.listItem}>
            Barang <span style={styles.highlight}>tidak original</span>
          </li>
          <li style={styles.listItem}>
            Barang yang diterima <span style={styles.highlight}>tidak lengkap</span>
          </li>
          <li style={styles.listItem}>
            Penjual telah mengirimkan barang yang <span style={styles.highlight}>tidak sesuai dengan pesanan spesifikasi</span> yang disepakati (misalnya salah ukuran, warna, dsb.)
          </li>
          <li style={styles.listItem}>
            Barang yang dikirimkan secara material <span style={styles.highlight}>berbeda dari deskripsi</span> yang diberikan oleh penjual dalam daftar barang
          </li>
          <li style={styles.listItem}>
            Melalui <span style={styles.highlight}>kesepakatan pribadi</span> dengan penjual dan penjual harus mengirimkan konfirmasi kepada Jaja.id mengenai kesepakatan tersebut
          </li>
        </ol>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            <span style={styles.highlight}>⚠️ PENTING:</span> Permohonan pembeli harus dikirimkan melalui Situs Jaja.id. Jaja.id akan meninjau setiap permohonan pembeli kasus per kasus dan, atas kebijakannya sendiri, menentukan apakah permohonan pembeli berhasil atau tidak.
          </p>
        </div>

        <p style={styles.paragraph}>
          Jika Pembeli telah memulai tindakan hukum terhadap Penjual, Pembeli dapat memberikan pemberitahuan formal dari pihak yang berwenang kepada Jaja.id untuk meminta Jaja.id terus menahan uang pembelian sampai penetapan resmi tersedia. Atas kebijakannya sendiri yang mutlak, Jaja.id akan menetapkan apakah perlu untuk terus menahan uang pembelian tersebut.
        </p>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>4. SOP Pengembalian Barang</h2>
        <p style={styles.paragraph}>
          Setiap pengembalian barang memiliki prosedur yang sudah ditetapkan oleh Jaja.id sebagai berikut:
        </p>

        <div style={styles.successBox}>
          <p style={styles.successText}>
            <span style={styles.highlight}>📦 Prosedur Wajib untuk Pengembalian Barang:</span>
          </p>
        </div>

        <ol style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Pengembalian ke Gudang:</span> Semua produk retur wajib kembali ke gudang Jaja.id (diluar konsep fulfillment) untuk dilakukan Quality Control (QC) tersendiri
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Dokumentasi Foto:</span> Pembeli wajib memfoto produk yang ingin diretur dengan jelas menunjukkan kondisi barang
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Video Unboxing (Khusus Barang Branded):</span> Pembeli wajib sertakan video unboxing dengan ketentuan:
            <ul style={styles.list}>
              <li style={styles.listItem}>Video harus direkam saat pertama kali membuka paket</li>
              <li style={styles.listItem}>Maksimal 1x24 jam setelah barang diterima</li>
              <li style={styles.listItem}>Video harus menunjukkan kondisi packaging dan isi paket secara jelas</li>
            </ul>
          </li>
        </ol>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            <span style={styles.highlight}>⚠️ PERHATIAN:</span> Untuk barang branded, video unboxing adalah syarat wajib untuk mengajukan retur. Tanpa video unboxing yang valid, permohonan retur dapat ditolak.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Langkah-langkah Mengajukan Retur</h2>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            Masuk ke halaman <span style={styles.highlight}>Detail Transaksi</span> pada akun Anda
          </li>
          <li style={styles.listItem}>
            Klik tombol <span style={styles.highlight}>"Ajukan Retur"</span> atau <span style={styles.highlight}>"Komplain"</span>
          </li>
          <li style={styles.listItem}>
            Pilih <span style={styles.highlight}>alasan retur</span> yang sesuai
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Upload foto</span> produk yang menunjukkan masalah
          </li>
          <li style={styles.listItem}>
            Untuk barang branded, <span style={styles.highlight}>upload video unboxing</span>
          </li>
          <li style={styles.listItem}>
            Isi <span style={styles.highlight}>deskripsi masalah</span> dengan detail
          </li>
          <li style={styles.listItem}>
            Klik <span style={styles.highlight}>"Kirim Permohonan"</span>
          </li>
          <li style={styles.listItem}>
            Tunggu konfirmasi dari penjual dan Admin Jaja.id
          </li>
        </ol>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tips Agar Permohonan Retur Diterima</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Ajukan Segera:</span> Ajukan retur maksimal 1x24 jam setelah barang diterima untuk barang branded
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Dokumentasi Lengkap:</span> Sediakan foto dan video yang jelas dan detail
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Deskripsi Akurat:</span> Jelaskan masalah dengan detail dan objektif
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Jaga Kondisi Barang:</span> Pastikan barang tetap dalam kondisi yang dapat diretur (tidak rusak lebih lanjut)
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Komunikasi Baik:</span> Berkomunikasi dengan sopan kepada penjual
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>Simpan Packaging:</span> Jangan buang kemasan original karena mungkin diperlukan untuk retur
          </li>
        </ul>
      </section>

      <hr style={styles.divider} />

      <div style={styles.contactSection}>
        <h3 style={styles.contactTitle}>Butuh Bantuan dengan Retur?</h3>
        <p style={styles.contactText}>
          Jika Anda memiliki pertanyaan atau mengalami kesulitan dalam proses pengembalian dana atau barang, tim dukungan pelanggan kami siap membantu:
        </p>
        <p style={styles.contactText}>
          <span style={styles.highlight}>Email:</span> jajabussdev@gmail.com
        </p>
        <p style={styles.contactText}>
          <span style={styles.highlight}>Alamat:</span> Jl.H. Baping Raya No. 100, Gedung S, Ciracas, Jakarta Timur, 13740
        </p>
        <p style={{...styles.contactText, marginTop: '15px', fontStyle: 'italic'}}>
          Kami berkomitmen untuk memberikan solusi terbaik bagi setiap masalah yang Anda hadapi dalam berbelanja di Jaja.id.
        </p>
      </div>
    </div>
  );
}