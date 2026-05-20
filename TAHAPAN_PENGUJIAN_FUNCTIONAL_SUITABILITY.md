# Tahapan Pengujian Instrumen Functional Suitability (ISO 25010)

Berikut adalah tahapan sistematis untuk melakukan pengujian tingkat fungsionalitas (*Functional Suitability*) pada aplikasi E-Commerce berdasarkan standar mutu perangkat lunak ISO/IEC 25010.

### 1. Perencanaan dan Identifikasi Fitur (Persiapan Skenario)
Mengidentifikasi seluruh fungsi dan fitur yang telah dikembangkan di dalam aplikasi baik di sisi pengguna (Pelanggan) maupun sisi pengelola (Admin). 
* **Tujuan:** Menentukan apa saja yang akan diukur (Functional Completeness).
* **Output:** Penyusunan instrumen `LEMBAR_VALIDASI.md` yang memuat seluruh *Use Case* (Contoh: Fitur Checkout, Keranjang, Wishlist, Kelola Produk).

### 2. Penentuan Responden / Validator Ahli
Pengujian fungsional umumnya melibatkan ahli (*expert judgment*) di bidang sistem informasi/teknologi informasi (misal: Dosen IT, QA Engineer) yang memahami standar perangkat lunak, serta bisa juga menyertakan sampel pengguna langsung.

### 3. Pelaksanaan Pengujian (Test Execution)
Para validator akan diberikan akses (Link URL aplikasi) beserta Lembar Validasi. Pada tahap ini, pengujian fokus pada tiga aspek dari *Functional Suitability*:
* **Functional Completeness (Kelengkapan):** Apakah semua fitur yang dijanjikan dalam spesifikasi sistem sudah lengkap dan tersedia? (Misal: Apakah tombol Xendit dan KiriminAja tersedia?).
* **Functional Correctness (Ketepatan):** Apakah fitur berjalan dengan benar dan memberikan hasil yang sesuai tanpa *error/bug*? (Misal: Saat melakukan *Checkout* sebagai *Guest*, apakah pesanan sukses masuk tanpa perlu login?).
* **Functional Appropriateness (Kesesuaian):** Apakah fungsi yang disediakan membantu pengguna mencapai tujuannya dengan mudah? (Misal: Fitur Wishlist dan Keranjang).
* **Proses:** Validator menguji skenario fitur satu per satu sesuai di Lembar Validasi dan memberikan skor centang (Ya = 1 / Berfungsi, Tidak = 0 / Tidak Berfungsi).

### 4. Pengumpulan dan Perekapan Data
Setelah pengujian selesai dilakukan oleh seluruh validator, instrumen penilaian (Lembar Validasi) dikumpulkan. Setiap data observasi dicatat untuk direkapitulasi:
* Berapa banyak fitur yang berstatus **"Ya"** (Berhasil/Lulus).
* Berapa banyak fitur yang berstatus **"Tidak"** (Gagal).

### 5. Analisis Hasil Pengujian (Perhitungan Kelayakan)
Menghitung persentase keberhasilan perangkat lunak. Biasanya pada penelitian skripsi akademik, pengujian aspek fungsionalitas menggunakan Skala Guttman. 
**Rumus Persentase Kelayakan (%):**
`(Total Skor Keseluruhan "Ya" / Skor Maksimal Ideal) x 100%`

Berdasarkan hasil ini, akan didapatkan kategori tingkat kelayakan (*Very Good*, *Good*, *Fair*, atau *Poor*). Umumnya, standar kelayakan dari aspek functionality dapat dianggap valid apabila mencapai persentase keberhasilan mendekati atau sama dengan 100%.

---

### Contoh Format Kisi-kisi Instrumen (Berdasarkan Fitur E-Commerce)

**Tabel 3.3 Kisi-Kisi Instrumen Aspek Functional Suitability**

| No | Indikator | No. Butir |
| :---: | :--- | :---: |
| 1 | *Functional Correctness* (Ketepatan Fungsi) | 1-13 |
| 2 | *Functional Appropriateness* (Kesesuaian Fungsi) | 14-15 |

<br>

**Tabel 3.4 Kisi-kisi Instrumen Aspek Functional Suitability (Detail)**

| No | Fungsi | Pertanyaan |
| :---: | :--- | :--- |
| 1 | Registrasi Pelanggan | Fungsi untuk melakukan registrasi akun pelanggan baru dapat berjalan dengan baik. |
| 2 | Login Pelanggan | Fungsi login ke akun pelanggan menggunakan email dan password berjalan dengan baik. |
| 3 | Katalog Produk | Fungsi menampilkan daftar produk dan kategori pada halaman utama berjalan dengan baik. |
| 4 | Pencarian (Search) | Fungsi untuk mencari produk berdasarkan kata kunci berjalan dengan baik. |
| 5 | Detail Produk | Fungsi menampilkan detail informasi produk (deskripsi, spesifikasi, harga) berjalan dengan baik. |
| 6 | Keranjang Belanja | Fungsi untuk menambah, memperbarui kuantitas, dan menghapus produk di keranjang berjalan dengan baik. |
| 7 | Wishlist | Fungsi untuk menyimpan dan menghapus produk favorit ke dalam daftar wishlist berjalan dengan baik. |
| 8 | Checkout Pesanan | Fungsi pengisian formulir checkout untuk pelanggan terdaftar maupun *guest* (tanpa akun) berjalan dengan baik. |
| 9 | Pembayaran & Pengiriman | Fungsi pemilihan metode pembayaran dan penampilan kurir pengiriman berjalan dengan baik. |
| 10 | Login Admin | Fungsi login kredensial khusus ke halaman dasbor admin dapat berjalan dengan baik. |
| 11 | Dashboard Admin | Fungsi menampilkan rangkuman data penjualan dan produk pada dasbor berjalan dengan baik. |
| 12 | Kelola Produk & Data | Fungsi admin untuk menambah, mengubah, dan menghapus data produk atau banner berjalan dengan baik. |
| 13 | Pesan Validasi Sistem | Fungsi menampilkan alert pesan sukses/gagal pada setiap input atau aksi berjalan dengan baik. |
| 14 | Kemudahan Navigasi | Fungsi menu navigasi dan tata letaknya memudahkan pengguna menemukan halaman/fitur berjalan dengan baik. |
| 15 | Kesesuaian Alur Belanja | Alur dari memilih produk hingga checkout sesuai dan mudah dipahami oleh pengguna berjalan dengan baik. |

---

### 6. Evaluasi dan Perbaikan (Bug Fixing / Refactoring)
* Jika ada skenario pengujian dengan nilai **"Tidak"** (Gagal), pengembang harus memeriksa catatan pada kolom komentar/saran dari validator.
* Memperbaiki dan merevisi kode program sesuai dengan temuan error.
* Melakukan **Uji Ulang (Re-test)** pada bagian yang sebelumnya gagal hingga hasilnya menjadi "Ya" (Lulus).

### 7. Penarikan Kesimpulan Akhir
Menyimpulkan bahwa Sistem Informasi E-Commerce ini telah diuji, direvisi, dan dinyatakan **Valid** serta **Layak** untuk diimplementasikan ke studi kasus lapangan karena seluruh fiturnya berfungsi secara normal dan tepat (*Functional Suitability* terpenuhi).
