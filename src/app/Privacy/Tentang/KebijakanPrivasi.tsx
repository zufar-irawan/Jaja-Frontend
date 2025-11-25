// KebijakanPrivasi.tsx (letakkan di folder yang sama dengan page.tsx)
import React from 'react';

export default function KebijakanPrivasi() {
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
    warningText: {
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#4a5568',
      marginBottom: '15px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
    },
  };

  return (
    <div style={styles.contentArea}>
      <h1 style={styles.title}>Kebijakan Privasi</h1>
      
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>PENDAHULUAN</h2>
        <p style={styles.paragraph}>
          <span style={styles.highlight}>1.1</span> Selamat datang di platform Jaja.id. Kebijakan Privasi ini dirancang untuk membantu Anda memahami bagaimana kami mengumpulkan, menggunakan, mengungkapkan dan/atau mengolah data pribadi yang telah Anda percayakan kepada kami dan/atau kami miliki tentang Anda, baik di masa sekarang maupun di masa mendatang, serta untuk membantu Anda membuat keputusan yang tepat sebelum memberikan data pribadi Anda kepada kami.
        </p>
        <p style={styles.paragraph}>
          <span style={styles.highlight}>1.2</span> "Data Pribadi" atau "data pribadi" berarti data, baik benar maupun tidak, tentang individu yang dapat diidentifikasi dari data tersebut, atau dari data dan informasi lainnya yang dapat atau kemungkinan dapat diakses oleh suatu organisasi. Contoh umum data pribadi dapat mencakup nama, nomor identifikasi dan informasi kontak.
        </p>
        <p style={styles.paragraph}>
          <span style={styles.highlight}>1.3</span> Dengan menggunakan Layanan, mendaftarkan akun pada kami, mengunjungi situs web kami, atau mengakses Layanan, Anda mengakui dan setuju bahwa Anda menerima praktik, persyaratan, dan/atau kebijakan yang diuraikan dalam Kebijakan Privasi ini.
        </p>
        <p style={styles.warningText}>
          Apabila Anda tidak mengizinkan pengolahan data pribadi Anda seperti yang dijelaskan dalam kebijakan privasi ini, mohon jangan menggunakan layanan kami atau mengakses situs web kami.
        </p>
      </section>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2. Kapan Jaja.id Mengumpulkan Data Pribadi?</h2>
        <p style={styles.paragraph}>
          Kami akan/mungkin mengumpulkan data pribadi Anda:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Saat Anda mendaftar dan/atau menggunakan Layanan atau Situs kami, atau membuka sebuah akun dengan kami
          </li>
          <li style={styles.listItem}>
            Saat Anda membuat perjanjian atau memberikan dokumen atau informasi lainnya sehubungan dengan interaksi Anda dengan kami
          </li>
          <li style={styles.listItem}>
            Saat Anda mengirimkan formulir apapun, termasuk formulir permohonan atau formulir lainnya yang berkaitan dengan produk dan layanan kami
          </li>
          <li style={styles.listItem}>
            Saat Anda menggunakan layanan elektronik kami, atau berinteraksi dengan kami melalui aplikasi kami atau menggunakan layanan di situs web kami
          </li>
          <li style={styles.listItem}>
            Saat Anda berinteraksi dengan kami, seperti melalui sambungan telepon, surat, faks, pertemuan tatap muka, platform media sosial dan email
          </li>
          <li style={styles.listItem}>
            Saat Anda melakukan transaksi melalui Layanan kami
          </li>
          <li style={styles.listItem}>
            Saat Anda menyampaikan kritik dan saran atau keluhan kepada kami
          </li>
          <li style={styles.listItem}>
            Saat Anda mendaftar untuk suatu kontes
          </li>
        </ul>
        <p style={styles.paragraph}>
          Daftar di atas tidak dimaksudkan sebagai suatu daftar yang lengkap dan hanya menetapkan beberapa contoh umum tentang kapan data pribadi Anda mungkin diambil.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>3. Data Pribadi Apa yang Akan Dikumpulkan oleh Jaja.id?</h2>
        <p style={styles.paragraph}>
          Data pribadi yang mungkin dikumpulkan Jaja.id termasuk tetapi tidak terbatas pada:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>Nama</li>
          <li style={styles.listItem}>Alamat email</li>
          <li style={styles.listItem}>Nomor telepon</li>
          <li style={styles.listItem}>Tanggal lahir</li>
          <li style={styles.listItem}>Jenis kelamin</li>
          <li style={styles.listItem}>Alamat tagihan</li>
          <li style={styles.listItem}>Rekening bank dan informasi pembayaran</li>
          <li style={styles.listItem}>
            Informasi lain apapun tentang Pengguna saat Pengguna mendaftarkan diri untuk menggunakan Layanan atau situs web kami
          </li>
          <li style={styles.listItem}>
            Seluruh data tentang konten yang digunakan Pengguna
          </li>
        </ul>
        <p style={styles.paragraph}>
          Apabila Anda tidak ingin kami mengumpulkan informasi/data pribadi yang disebutkan di atas, Anda dapat memilih keluar setiap saat dengan memberitahu Petugas Perlindungan Data kami secara tertulis. Akan tetapi harap diperhatikan bahwa memilih keluar dapat memengaruhi penggunaan Layanan oleh Anda.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>4. Membuat Akun</h2>
        <p style={styles.paragraph}>
          Untuk menggunakan fungsi tertentu dari Layanan, Anda harus membuat akun pengguna yang mengharuskan Anda untuk menyerahkan data pribadi tertentu. Saat Anda mendaftar dan membuat akun, kami mewajibkan Anda untuk memberikan nama dan alamat email Anda serta nama pengguna yang Anda pilih kepada kami.
        </p>
        <p style={styles.paragraph}>
          Kami juga menanyakan informasi tertentu tentang diri Anda seperti nomor telepon, alamat email, alamat pengiriman, identifikasi foto, rincian rekening bank, umur, tanggal lahir, jenis kelamin dan minat Anda. Nama pengguna dan kata sandi Anda akan digunakan agar Anda dapat mengakses dan mengelola akun Anda dengan aman.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>5. Cookies</h2>
        <p style={styles.paragraph}>
          Dari waktu ke waktu kami mungkin mengimplementasikan "cookies" atau fitur lainnya guna memungkinkan kami atau pihak ketiga untuk mengumpulkan atau berbagi informasi yang akan membantu kami meningkatkan Situs kami dan Layanan yang kami tawarkan.
        </p>
        <p style={styles.paragraph}>
          "Cookies" adalah pengidentifikasi yang kami transfer ke komputer atau perangkat Anda yang memungkinkan kami mengenali komputer atau perangkat Anda dan memberi tahu kami bagaimana dan kapan Layanan atau situs web digunakan atau dikunjungi. Cookies juga tertaut pada informasi tentang barang yang telah Anda pilih untuk dibeli dan halaman yang telah Anda lihat.
        </p>
        <p style={styles.paragraph}>
          Anda dapat menolak penggunaan cookies dengan memilih pengaturan yang sesuai pada peramban Anda. Akan tetapi, harap diperhatikan bahwa apabila Anda melakukan hal ini, Anda mungkin tidak dapat menggunakan fungsi penuh Situs atau Layanan kami.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>6. Bagaimana Kami Menggunakan Informasi yang Anda Berikan kepada Kami?</h2>
        <p style={styles.paragraph}>
          Kami dapat mengumpulkan, menggunakan, mengungkapkan dan/atau mengolah data pribadi Anda untuk tujuan-tujuan berikut:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Mempertimbangkan dan/atau mengolah aplikasi/transaksi Anda dengan kami
          </li>
          <li style={styles.listItem}>
            Mengelola, mengoperasikan, menyediakan dan/atau mengurus penggunaan dan/atau akses Anda ke Layanan kami
          </li>
          <li style={styles.listItem}>
            Menyesuaikan pengalaman Anda melalui Layanan dengan menampilkan konten sesuai dengan minat dan preferensi Anda
          </li>
          <li style={styles.listItem}>
            Menanggapi, mengolah, berurusan dengan atau menyelesaikan transaksi dan/atau memenuhi permintaan Anda
          </li>
          <li style={styles.listItem}>
            Melindungi keselamatan pribadi dan hak, milik atau keselamatan pihak lainnya
          </li>
          <li style={styles.listItem}>
            Untuk identifikasi dan/atau verifikasi
          </li>
          <li style={styles.listItem}>
            Mempertahankan dan memberikan setiap pembaruan perangkat lunak dan/atau pembaruan lainnya
          </li>
          <li style={styles.listItem}>
            Berurusan dengan atau memfasilitasi layanan pelanggan
          </li>
          <li style={styles.listItem}>
            Menghubungi Anda atau berkomunikasi dengan Anda melalui berbagai saluran komunikasi
          </li>
          <li style={styles.listItem}>
            Mengadakan kegiatan penelitian, analisis dan pengembangan
          </li>
          <li style={styles.listItem}>
            Mencegah atau menyelidiki setiap penipuan, kegiatan yang melanggar hukum, pembiaran atau kesalahan
          </li>
          <li style={styles.listItem}>
            Menyimpan, menyelenggarakan, membuat cadangan data pribadi Anda
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>7. Berbagi Informasi dari Layanan</h2>
        <p style={styles.paragraph}>
          Layanan kami memungkinkan Pengguna untuk berbagi informasi pribadi mereka kepada satu sama lain, dalam hampir semua kesempatan tanpa keterlibatan Jaja.id, untuk menyelesaikan transaksi. Dalam transaksi biasa, Pengguna dapat memiliki akses ke nama, ID pengguna, alamat email serta informasi kontak dan pos lainnya dari pengguna lainnya.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>8. Bagaimana Jaja.id Melindungi Informasi Pelanggan?</h2>
        <p style={styles.paragraph}>
          Kami menerapkan berbagai langkah pengamanan untuk memastikan keamanan data pribadi Anda di sistem kami. Data pribadi pengguna berada di belakang jaringan yang aman dan hanya dapat diakses oleh sejumlah kecil karyawan yang memiliki hak akses khusus ke sistem tersebut.
        </p>
        <p style={styles.paragraph}>
          Apabila Anda berhenti menggunakan Situs, atau izin Anda untuk menggunakan Situs dan/atau Layanan diakhiri, kami dapat terus menyimpan, menggunakan dan/atau mengungkapkan data pribadi Anda sesuai dengan Kebijakan Privasi ini.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>9. Pengungkapan Informasi kepada Pihak Ketiga</h2>
        <p style={styles.paragraph}>
          Dalam menjalankan bisnis kami, kami akan/mungkin perlu mengungkapkan data pribadi Anda kepada penyedia layanan pihak ketiga, agen dan/atau afiliasi atau perusahaan terkait kami. Pihak ketiga tersebut termasuk:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Anak perusahaan, afiliasi dan perusahaan terkait kami
          </li>
          <li style={styles.listItem}>
            Kontraktor, agen, penyedia layanan yang mendukung bisnis kami seperti jasa pos, perusahaan telekomunikasi, perusahaan teknologi informasi dan pusat data
          </li>
          <li style={styles.listItem}>
            Pembeli atau penerus lainnya dalam hal terjadi penggabungan, divestasi, restrukturisasi, atau reorganisasi
          </li>
        </ul>
        <p style={styles.paragraph}>
          Kami tidak akan mengungkapkan informasi yang dapat digunakan untuk mengidentifikasi Anda secara khusus kepada pemasok iklan dan pemrograman.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>10. Informasi yang Dikumpulkan oleh Pihak Ketiga</h2>
        <p style={styles.paragraph}>
          Situs kami menggunakan Google Analytics, sebuah layanan analisis web yang disediakan oleh Google, Inc. Google Analytics menggunakan cookies untuk membantu situs web menganalisis bagaimana Pengguna menggunakan Situs. Informasi yang dihasilkan oleh cookie akan dikirimkan ke dan disimpan oleh Google di server di Amerika Serikat.
        </p>
        <p style={styles.paragraph}>
          Google akan menggunakan informasi ini untuk tujuan mengevaluasi penggunaan situs web oleh Anda, menyusun laporan tentang kegiatan situs web, serta menyediakan layanan lainnya yang berkaitan dengan kegiatan situs web dan penggunaan Internet.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>11. Penafian tentang Keamanan dan Situs Pihak Ketiga</h2>
        <p style={styles.warningText}>
          Kami tidak menjamin keamanan data pribadi dan/atau informasi lain yang Anda berikan di situs pihak ketiga.
        </p>
        <p style={styles.paragraph}>
          Kami menerapkan berbagai langkah pengamanan untuk menjaga keamanan data pribadi Anda yang kami miliki atau berada di bawah kendali kami. Saat Anda melakukan pesanan atau mengakses data pribadi Anda, kami menawarkan penggunaan server yang aman.
        </p>
        <p style={styles.paragraph}>
          Dalam upaya untuk memberikan nilai yang lebih baik kepada Anda, kami mungkin memilih berbagai situs web pihak ketiga untuk ditautkan dalam Situs. Situs tautan ini memiliki kebijakan privasi serta pengaturan keamanan yang terpisah dan berdiri sendiri. Kami tidak bertanggung jawab atas konten dan kegiatan situs tertaut ini.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>12. Hak Anda atas Data Pribadi</h2>
        
        <h3 style={styles.subsectionTitle}>Memilih Keluar dan Mencabut Persetujuan</h3>
        <p style={styles.paragraph}>
          Untuk mengubah langganan email Anda atau mencabut persetujuan Anda untuk pengumpulan, penggunaan dan/atau pengungkapan data pribadi Anda, silakan beri tahu kami dengan mengirimkan email ke jajabussdev@gmail.com
        </p>
        <p style={styles.paragraph}>
          Setelah kami menerima instruksi pencabutan yang jelas dari Anda dan memverifikasi identitas Anda, kami akan memproses permintaan Anda. Akan tetapi, pencabutan persetujuan dapat menyebabkan kami tidak dapat terus menyediakan Layanan kepada Anda.
        </p>

        <h3 style={styles.subsectionTitle}>Meminta Akses dan/atau Pembetulan Data Pribadi</h3>
        <p style={styles.paragraph}>
          Apabila Anda memiliki akun dengan kami, Anda dapat mengakses dan/atau membetulkan sendiri data pribadi Anda melalui halaman Pengaturan Akun di Situs. Apabila Anda tidak memiliki akun, Anda dapat mengirimkan permintaan tertulis kepada kami di jajabussdev@gmail.com
        </p>
        <p style={styles.paragraph}>
          Untuk permintaan mengakses data pribadi, kami akan berusaha untuk memberikan data pribadi yang bersangkutan kepada Anda dalam 30 hari. Untuk permintaan membetulkan data pribadi, kami akan membetulkan data pribadi Anda dalam waktu 30 hari.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>13. Perubahan Kebijakan Privasi</h2>
        <p style={styles.paragraph}>
          Kami berhak untuk mengubah Kebijakan Privasi ini setiap saat. Apabila kami mengubah Kebijakan Privasi kami, kami akan memposting perubahan tersebut atau Kebijakan Privasi yang telah diubah pada situs web kami. Perubahan akan berlaku segera setelah diposting.
        </p>
        <p style={styles.paragraph}>
          Kami menyarankan Anda untuk meninjau Kebijakan Privasi ini secara berkala untuk tetap mendapatkan informasi terbaru.
        </p>
      </section>

      <hr style={styles.divider} />

      <div style={styles.contactSection}>
        <h3 style={styles.contactTitle}>Hubungi Kami</h3>
        <p style={styles.contactText}>
          Apabila Anda memiliki pertanyaan atau masalah tentang praktik privasi kami atau hubungan Anda dengan Layanan, silakan jangan ragu untuk menghubungi:
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