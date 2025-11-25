// SyaratLayanan.tsx (letakkan di folder yang sama dengan page.tsx)
import React from 'react';

export default function SyaratLayanan() {
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
      <h1 style={styles.title}>Syarat dan Ketentuan Layanan</h1>
      
      <section style={styles.section}>
        <p style={styles.paragraph}>
          Selamat datang di <span style={styles.highlight}>Jaja.id</span>. Syarat dan Ketentuan Layanan ini mengatur penggunaan Anda atas platform marketplace kami. Dengan mengakses atau menggunakan layanan Jaja.id, Anda setuju untuk terikat oleh syarat dan ketentuan berikut.
        </p>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>1. Definisi</h2>
        <p style={styles.paragraph}>
          Dalam Syarat dan Ketentuan ini:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span style={styles.highlight}>"Jaja.id"</span> atau <span style={styles.highlight}>"Kami"</span> merujuk pada platform marketplace khusus hobby yang dioperasikan oleh PT Jaja Indonesia.
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>"Pengguna"</span> atau <span style={styles.highlight}>"Anda"</span> merujuk pada setiap individu atau entitas yang mengakses atau menggunakan layanan Jaja.id.
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>"Layanan"</span> merujuk pada semua fitur, konten, dan aplikasi yang disediakan oleh Jaja.id.
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>"Penjual"</span> merujuk pada Pengguna yang menawarkan produk untuk dijual di platform Jaja.id.
          </li>
          <li style={styles.listItem}>
            <span style={styles.highlight}>"Pembeli"</span> merujuk pada Pengguna yang membeli produk melalui platform Jaja.id.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2. Pendaftaran Akun</h2>
        <p style={styles.paragraph}>
          Untuk menggunakan layanan tertentu di Jaja.id, Anda harus mendaftar dan membuat akun. Ketika mendaftar, Anda setuju untuk:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Memberikan informasi yang akurat, lengkap, dan terkini tentang diri Anda.
          </li>
          <li style={styles.listItem}>
            Menjaga keamanan kata sandi Anda dan bertanggung jawab atas semua aktivitas yang terjadi di akun Anda.
          </li>
          <li style={styles.listItem}>
            Segera memberi tahu kami jika terjadi penggunaan akun Anda yang tidak sah.
          </li>
          <li style={styles.listItem}>
            Tidak menggunakan akun orang lain tanpa izin.
          </li>
          <li style={styles.listItem}>
            Tidak membuat akun palsu atau menyesatkan.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>3. Kewajiban Penjual</h2>
        <p style={styles.paragraph}>
          Jika Anda adalah Penjual di platform Jaja.id, Anda setuju untuk:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Menyediakan deskripsi produk yang akurat, lengkap, dan tidak menyesatkan.
          </li>
          <li style={styles.listItem}>
            Mengunggah foto produk yang jelas dan sesuai dengan kondisi barang yang sebenarnya.
          </li>
          <li style={styles.listItem}>
            Menetapkan harga yang wajar dan sesuai dengan produk yang ditawarkan.
          </li>
          <li style={styles.listItem}>
            Memproses pesanan dengan cepat dan mengirimkan produk sesuai dengan waktu yang dijanjikan.
          </li>
          <li style={styles.listItem}>
            Tidak menjual barang yang melanggar hukum, berbahaya, atau melanggar hak kekayaan intelektual pihak lain.
          </li>
          <li style={styles.listItem}>
            Menanggapi pertanyaan dan keluhan pembeli dengan sopan dan profesional.
          </li>
          <li style={styles.listItem}>
            Mematuhi semua peraturan perpajakan dan hukum yang berlaku.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>4. Kewajiban Pembeli</h2>
        <p style={styles.paragraph}>
          Jika Anda adalah Pembeli di platform Jaja.id, Anda setuju untuk:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Membaca deskripsi produk dengan cermat sebelum melakukan pembelian.
          </li>
          <li style={styles.listItem}>
            Melakukan pembayaran sesuai dengan metode yang telah disepakati.
          </li>
          <li style={styles.listItem}>
            Memberikan informasi pengiriman yang akurat dan lengkap.
          </li>
          <li style={styles.listItem}>
            Mengonfirmasi penerimaan barang setelah produk diterima dalam kondisi baik.
          </li>
          <li style={styles.listItem}>
            Tidak menyalahgunakan sistem ulasan atau memberikan ulasan yang tidak jujur.
          </li>
          <li style={styles.listItem}>
            Menghubungi penjual atau layanan pelanggan jika terdapat masalah dengan pesanan.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>5. Transaksi dan Pembayaran</h2>
        <p style={styles.paragraph}>
          Semua transaksi di Jaja.id tunduk pada ketentuan berikut:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Pembayaran harus dilakukan melalui metode pembayaran yang tersedia di platform.
          </li>
          <li style={styles.listItem}>
            Jaja.id dapat menahan dana pembayaran hingga Pembeli mengonfirmasi penerimaan barang atau hingga periode tertentu berlalu.
          </li>
          <li style={styles.listItem}>
            Biaya layanan, biaya transaksi, atau komisi dapat dikenakan sesuai dengan kebijakan yang berlaku.
          </li>
          <li style={styles.listItem}>
            Pembeli dan Penjual bertanggung jawab untuk menyelesaikan sengketa transaksi secara langsung terlebih dahulu.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>6. Pengiriman dan Pengembalian</h2>
        <p style={styles.paragraph}>
          Kebijakan pengiriman dan pengembalian barang diatur sebagai berikut:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Penjual bertanggung jawab untuk mengemas dan mengirimkan produk dengan aman.
          </li>
          <li style={styles.listItem}>
            Waktu pengiriman tergantung pada lokasi dan metode pengiriman yang dipilih.
          </li>
          <li style={styles.listItem}>
            Pengembalian barang dan pengembalian dana diatur dalam Ketentuan Pengembalian Dana dan Barang yang terpisah.
          </li>
          <li style={styles.listItem}>
            Pembeli harus memeriksa kondisi barang saat diterima dan melaporkan kerusakan atau ketidaksesuaian dalam waktu yang ditentukan.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>7. Larangan Penggunaan</h2>
        <p style={styles.paragraph}>
          Anda dilarang untuk:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Menggunakan layanan Jaja.id untuk tujuan yang melanggar hukum atau tidak sah.
          </li>
          <li style={styles.listItem}>
            Mengunggah konten yang mengandung virus, malware, atau kode berbahaya lainnya.
          </li>
          <li style={styles.listItem}>
            Melakukan tindakan yang dapat merusak, melumpuhkan, atau membebani server atau jaringan Jaja.id.
          </li>
          <li style={styles.listItem}>
            Mengumpulkan informasi pribadi Pengguna lain tanpa izin.
          </li>
          <li style={styles.listItem}>
            Melakukan penipuan, pemalsuan, atau manipulasi dalam transaksi.
          </li>
          <li style={styles.listItem}>
            Menjual produk palsu, ilegal, atau yang melanggar hak kekayaan intelektual.
          </li>
          <li style={styles.listItem}>
            Melakukan spam atau mengirim pesan yang tidak diinginkan kepada Pengguna lain.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>8. Hak Kekayaan Intelektual</h2>
        <p style={styles.paragraph}>
          Semua konten yang terdapat di platform Jaja.id, termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar, klip audio, unduhan digital, dan kompilasi data, adalah milik Jaja.id atau pemberi lisensinya dan dilindungi oleh hukum hak cipta Indonesia dan internasional.
        </p>
        <p style={styles.paragraph}>
          Anda tidak diizinkan untuk mereproduksi, mendistribusikan, memodifikasi, atau menggunakan konten Jaja.id untuk tujuan komersial tanpa izin tertulis dari kami.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>9. Penangguhan dan Penghentian Akun</h2>
        <p style={styles.paragraph}>
          Jaja.id berhak untuk menangguhkan atau menghentikan akun Anda jika:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Anda melanggar Syarat dan Ketentuan ini.
          </li>
          <li style={styles.listItem}>
            Kami menerima laporan atau keluhan yang sah tentang aktivitas Anda.
          </li>
          <li style={styles.listItem}>
            Kami mencurigai adanya aktivitas penipuan atau penyalahgunaan.
          </li>
          <li style={styles.listItem}>
            Anda tidak aktif dalam jangka waktu tertentu.
          </li>
        </ul>
        <p style={styles.paragraph}>
          Anda dapat menghentikan akun Anda kapan saja dengan menghubungi layanan pelanggan kami.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>10. Batasan Tanggung Jawab</h2>
        <p style={styles.paragraph}>
          Jaja.id bertindak sebagai platform perantara antara Pembeli dan Penjual. Kami tidak bertanggung jawab atas:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Kualitas, keamanan, atau legalitas produk yang dijual.
          </li>
          <li style={styles.listItem}>
            Keakuratan deskripsi produk yang diberikan oleh Penjual.
          </li>
          <li style={styles.listItem}>
            Kemampuan Penjual untuk menyelesaikan transaksi.
          </li>
          <li style={styles.listItem}>
            Kemampuan Pembeli untuk membayar produk yang dipesan.
          </li>
          <li style={styles.listItem}>
            Kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan layanan kami.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>11. Ganti Rugi</h2>
        <p style={styles.paragraph}>
          Anda setuju untuk mengganti rugi, membela, dan membebaskan Jaja.id, afiliasinya, direktur, karyawan, dan agen dari dan terhadap setiap klaim, tuntutan, kerugian, kerusakan, biaya, dan pengeluaran (termasuk biaya hukum) yang timbul dari:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Penggunaan Anda atas layanan Jaja.id.
          </li>
          <li style={styles.listItem}>
            Pelanggaran Anda terhadap Syarat dan Ketentuan ini.
          </li>
          <li style={styles.listItem}>
            Pelanggaran Anda terhadap hak pihak ketiga, termasuk hak kekayaan intelektual.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>12. Perubahan Syarat dan Ketentuan</h2>
        <p style={styles.paragraph}>
          Jaja.id berhak untuk mengubah atau memperbarui Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku segera setelah diposting di platform kami. Penggunaan Anda yang berkelanjutan atas layanan Jaja.id setelah perubahan tersebut menunjukkan penerimaan Anda terhadap Syarat dan Ketentuan yang telah diperbarui.
        </p>
        <p style={styles.paragraph}>
          Kami menyarankan Anda untuk meninjau Syarat dan Ketentuan ini secara berkala untuk tetap mendapatkan informasi terbaru.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>13. Hukum yang Berlaku</h2>
        <p style={styles.paragraph}>
          Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul dari atau sehubungan dengan Syarat dan Ketentuan ini akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>14. Ketentuan Umum</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Jika ada ketentuan dalam Syarat dan Ketentuan ini yang dianggap tidak sah atau tidak dapat dilaksanakan, ketentuan tersebut akan dihapus dan tidak akan mempengaruhi keabsahan dan keberlakuan ketentuan lainnya.
          </li>
          <li style={styles.listItem}>
            Kegagalan Jaja.id untuk menegakkan hak atau ketentuan dalam Syarat dan Ketentuan ini tidak akan dianggap sebagai pengesampingan hak atau ketentuan tersebut.
          </li>
          <li style={styles.listItem}>
            Syarat dan Ketentuan ini merupakan keseluruhan perjanjian antara Anda dan Jaja.id mengenai penggunaan layanan kami.
          </li>
        </ul>
      </section>

      <hr style={styles.divider} />

      <div style={styles.contactSection}>
        <h3 style={styles.contactTitle}>Hubungi Kami</h3>
        <p style={styles.contactText}>
          Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan Layanan ini, silakan hubungi kami:
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