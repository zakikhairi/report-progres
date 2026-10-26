# 🤝 Web Form Update Progres Sponsorship (Realtime Google Sheets)

Aplikasi Web Form & Dashboard Tracker modern untuk mencatat dan mengupdate **Progres Pengajuan Sponsor** secara real-time langsung ke **Google Sheets**. Gratis 100% tanpa sewa hosting menggunakan Google Apps Script.

---

## 🌟 Fitur Utama

1. **Kolom Data Lengkap Sesuai Kebutuhan**:
   - 👤 **Nama PJ** (Penanggung jawab dengan saran nama otomatis)
   - 🏢 **Nama Perusahaan** (Nama brand / target sponsor)
   - 📞 **Narahubung** (Nama CP, jabatan, no. WhatsApp / email)
   - 💬 **Via Apa Menghubunginya** (Pilihan cepat: WhatsApp, Email, Telepon, Ketemu Langsung, Instagram, Lainnya)
   - 📅 **Tanggal Pengajuan** (Auto default hari ini)
   - 🎁 **Benefit** (Dilengkapi tombol instan: Platinum, Gold, Silver, Booth, Medpart, dll)
   - ⚡ **Status & Keterangan Progress** (Menunggu Respon, Follow Up, Negosiasi, Deal/Disetujui, Ditolak + Catatan rinci)
2. **Dashboard Metrik Otomatis**:
   - Total Sponsor Diajukan
   - Deal / Diterima ✅
   - Sedang Proses / Negosiasi 💬
   - Ditolak ❌
3. **Tab Daftar & Update Cepat**:
   - Bisa cari nama perusahaan / PJ secara instan (Search Bar).
   - Filter berdasarkan status (Deal, Proses, Menunggu, Ditolak).
   - Tombol **"⚡ Update Progres"** untuk mengganti status atau menambah catatan follow-up tanpa harus membuka spreadsheet manual.
4. **Mobile & Desktop Friendly**:
   - Desain responsif, tampilan elegan seperti aplikasi native di smartphone.
   - Bisa disimpan ke layar utama HP (*Add to Home Screen*).

---

## 📁 Struktur File

- [`Code.gs`](./Code.gs) : Script backend Google Apps Script untuk menghubungkan form ke Google Sheets.
- [`index.html`](./index.html) : Halaman antarmuka pengguna (UI) modern berbasis Tailwind CSS & Plus Jakarta Sans.
- [`README.md`](./README.md) : Panduan pemasangan dan deployment.

---

## 🚀 Panduan Pemasangan (Hanya 3 Menit)

### Langkah 1: Buat Google Sheet Baru
1. Buka browser dan kunjungi [sheets.new](https://sheets.new).
2. Beri nama spreadsheet Anda, misalnya: `Tracker Sponsorship Acara 2026`.

### Langkah 2: Buka Apps Script
1. Di menu bagian atas Google Sheets, klik **Extensions (Ekstensi)** > **Apps Script**.
2. Tab editor Google Apps Script akan terbuka.

### Langkah 3: Masukkan Kode
1. **File `Code.gs`**:
   - Hapus semua baris teks bawaan di file `Code.gs`.
   - Buka file [`Code.gs`](./Code.gs) di folder ini, salin seluruh kodenya, dan paste ke editor Apps Script.
2. **File `index.html`**:
   - Di panel kiri editor Apps Script (bagian *Files*), klik tombol **`+`** lalu pilih **HTML**.
   - Beri nama: `index` (cukup ketik `index` tanpa .html).
   - Hapus teks bawaan di `index.html`.
   - Buka file [`index.html`](./index.html) di folder ini, salin seluruh kodenya, dan paste ke editor.
3. Klik tombol **Save (Ikon Disket / Ctrl + S)**.

---

### Langkah 4: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** > **New deployment**.
2. Klik ikon gerigi (⚙️) di samping *Select type*, pilih **Web app**.
3. Atur pengaturannya sebagai berikut:
   - **Description**: `Web Form Sponsor v1`
   - **Execute as**: `Me (email-anda@gmail.com)`
   - **Who has access**: `Anyone` *(Penting: pilih Anyone agar semua panitia/PJ bisa mengisi dari HP tanpa harus login ulang)*
4. Klik tombol **Deploy**.
5. Jika muncul jendela otorisasi (*Authorization required*):
   - Klik **Authorize access**.
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) di bagian kiri bawah > klik **Go to Update Progres Sponsor (unsafe)**.
   - Klik **Allow**.
6. Salin link **Web App URL** yang didapatkan (formatnya: `https://script.google.com/macros/s/.../exec`).

> 🎉 **Selesai!** Link tersebut sekarang bisa dibagikan ke seluruh tim/panitia untuk input dan update progres sponsor.

---

## 📱 Tips Pasang di Layar Utama HP (Add to Home Screen)
1. Buka link Web App di browser Chrome (Android) atau Safari (iPhone).
2. Tekan menu titik tiga (Chrome) atau tombol Share (Safari).
3. Pilih **"Add to Home screen"** (Tambahkan ke Layar Utama).
4. Web form sekarang akan berbentuk seperti aplikasi terpasang di HP Anda!

---

## 🖥️ Uji Coba Langsung di Laptop / Komputer
Anda juga bisa langsung membuka file [`index.html`](./index.html) dengan double click di file explorer laptop Anda. File ini dilengkapi mode demo offline sehingga Anda bisa mencoba alur input, tab filter, dan update status secara langsung sebelum di-deploy ke Google Apps Script!
