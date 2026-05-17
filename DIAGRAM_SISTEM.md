# Diagram Sistem E-Commerce

Berdasarkan standar notasi sistem yang diberikan, berikut adalah 3 jenis diagram (Use Case, Activity, dan Flowchart) untuk menggambarkan rancangan sistem E-Commerce ini.

## 1. Use Case Diagram
Diagram ini memetakan Aktor dan fungsionalitas sistem. Relasi antar Use Case telah disesuaikan agar memuat ke-6 notasi standar secara lengkap: **Aktor**, **Use Case**, **Asosiasi**, **Generalisasi**, **Extend**, dan **Include**.

```mermaid
flowchart LR
    %% 1. Aktor
    Pengunjung(["🧑‍💻 Pengunjung"])
    Pelanggan(["👤 Pelanggan"])
    Admin(["👑 Admin"])

    %% 4. Generalisasi (Panah Solid: Pelanggan mewarisi fungsionalitas Pengunjung)
    Pelanggan --> Pengunjung

    %% Sistem Boundary
    subgraph Sistem ["Sistem E-Commerce"]
        direction TB
        %% 2. Use Case (Bentuk Oval / Pill)
        U1(["Melihat Produk & Katalog"])
        U2(["Melakukan Checkout"])
        U3(["Login / Autentikasi"])
        U4(["Menambah Wishlist"])
        U5(["Mengelola Data Produk"])
        U6(["Mengatur Tampilan Website"])
        U7(["Menerapkan Kode Promo"])
    end

    %% 3. Asosiasi (Lintasan Lurus biasa tanpa panah)
    Pengunjung --- U1
    Pelanggan --- U2
    Admin --- U5
    Admin --- U6

    %% 5 & 6. Extend dan Include (Garis Putus-putus berpanah)
    
    %% EXTEND: Menambah fungsi pada kondisi tertentu
    %% (Wishlist adalah ekstensi dari Melihat Produk)
    U4 -.->|"<<extend>>"| U1
    %% (Promo adalah ekstensi khusus dari proses Checkout)
    U7 -.->|"<<extend>>"| U2

    %% INCLUDE: Selalu melibatkan / wajib memanggil use case lain
    %% (Checkout wajib melakukan Login/Autentikasi)
    U2 -.->|"<<include>>"| U3
    %% (Mengelola sistem wajib Login sebagai Admin)
    U5 -.->|"<<include>>"| U3
    U6 -.->|"<<include>>"| U3
```

---

## 2. Activity Diagram
Activity Diagram menggambarkan urutan aktivitas di dalam sistem dari Titik Awal hingga Titik Akhir, lengkap dengan Opsi mengambil keputusan.

### a. Aktivitas Pengguna (Pemesanan & Wishlist)
```mermaid
stateDiagram-v2
    %% Titik Awal
    [*] --> BukaWebsite
    
    %% Activity
    BukaWebsite --> LihatDaftarProduk
    LihatDaftarProduk --> PilihSatuProduk
    PilihSatuProduk --> TentukanAksi
    
    %% Opsi / Decision
    state TentukanAksi <<choice>>
    TentukanAksi --> ProsesCheckout : Pilih Beli
    TentukanAksi --> CekLogin : Pilih Wishlist
    
    %% Opsi / Decision
    state CekLogin <<choice>>
    CekLogin --> HalamanLogin : Belum Login
    HalamanLogin --> ValidasiLogin
    ValidasiLogin --> SimpanWishlist
    
    CekLogin --> SimpanWishlist : Sudah Login
    
    %% Titik Akhir
    ProsesCheckout --> [*]
    SimpanWishlist --> [*]
```

### b. Aktivitas Admin (Kelola Sistem)
```mermaid
stateDiagram-v2
    %% Titik Awal
    [*] --> AksesDashboardAdmin
    
    %% Activity
    AksesDashboardAdmin --> IsiFormLogin
    
    %% Opsi / Decision
    state CekKredensial <<choice>>
    IsiFormLogin --> CekKredensial
    CekKredensial --> IsiFormLogin : Data Salah
    CekKredensial --> MasukTampilanKelola : Data Benar
    
    MasukTampilanKelola --> UbahDataSistem
    UbahDataSistem --> SimpanSistemTerkini
    
    %% Titik Akhir
    SimpanSistemTerkini --> [*]
```

---

## 3. Flowchart
Flowchart menggambarkan alur berjalannya suatu program secara detail, menggunakan notasi *Terminator*, *Input/Output*, *Process*, dan *Decision*.

### Alur Utama Pengunjung Website
```mermaid
flowchart TD
    %% Terminator (Titik Mulai)
    Start([Mulai])
    
    %% Input/Output & Process
    InputBukaWeb[/Pengunjung Membuka Web/]
    ProsesTampilBeranda[Sistem Menampilkan Halaman Utama]
    InputPilihProduk[/Pengunjung Memilih Produk/]
    
    %% Decision
    Keputusan{Pilih Aksi?}
    
    InputBukaWeb2[/Pengunjung Menekan Tombol Beli/]
    ProsesTampilCheckout[Sistem Menampilkan Form Pembayaran]
    
    InputBukaWeb3[/Pengunjung Menekan Tombol Wishlist/]
    CekAuth{Apakah Sudah Login?}
    
    ProsesSimpan[Sistem Menyimpan Data Pesanan / Wishlist]
    OutputSukses[/Tampilkan Notifikasi Berhasil/]
    
    %% Terminator (Titik Selesai)
    Akhir([Selesai])

    %% Flow Line (Garis Penunjuk Kegiatan)
    Start --> InputBukaWeb
    InputBukaWeb --> ProsesTampilBeranda
    ProsesTampilBeranda --> InputPilihProduk
    InputPilihProduk --> Keputusan
    
    Keputusan -->|Beli| InputBukaWeb2
    InputBukaWeb2 --> ProsesTampilCheckout
    ProsesTampilCheckout --> ProsesSimpan
    
    Keputusan -->|Wishlist| InputBukaWeb3
    InputBukaWeb3 --> CekAuth
    CekAuth -->|Sudah| ProsesSimpan
    CekAuth -->|Belum| ProsesTampilBeranda
    
    ProsesSimpan --> OutputSukses
    OutputSukses --> Akhir
```

### Alur Admin Mengelola Sistem
```mermaid
flowchart TD
    %% Terminator (Titik Mulai)
    StartAdmin([Mulai])
    
    %% Input/Output & Process
    InputBukaAdmin[/Admin Membuka Halaman Login/]
    ProsesTampilLogin[Sistem Menampilkan Form Login]
    InputKredensial[/Admin Memasukkan Email & Password/]
    
    %% Decision
    ValidasiKredensial{Kredensial Valid?}
    
    %% Input/Output & Process Lanjutan
    ProsesTampilAdmin[Sistem Menampilkan Dashboard Admin]
    InputPilihMenu[/Admin Memilih Menu Kelola Data/]
    InputUbahData[/Admin Menginput Perubahan Data/]
    ProsesSimpanDB[Sistem Menyimpan Data ke Database]
    OutputNotifAdmin[/Tampilkan Notifikasi Perubahan Berhasil/]
    
    %% Terminator (Titik Selesai)
    AkhirAdmin([Selesai])

    %% Flow Line (Garis Penunjuk Kegiatan)
    StartAdmin --> InputBukaAdmin
    InputBukaAdmin --> ProsesTampilLogin
    ProsesTampilLogin --> InputKredensial
    InputKredensial --> ValidasiKredensial
    
    ValidasiKredensial -->|Tidak| ProsesTampilLogin
    ValidasiKredensial -->|Ya| ProsesTampilAdmin
    
    ProsesTampilAdmin --> InputPilihMenu
    InputPilihMenu --> InputUbahData
    InputUbahData --> ProsesSimpanDB
    ProsesSimpanDB --> OutputNotifAdmin
    OutputNotifAdmin --> AkhirAdmin
```
