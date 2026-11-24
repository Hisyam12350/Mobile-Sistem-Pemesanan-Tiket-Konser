# 📱 Concertix — Mobile Sistem Pemesanan Tiket Konser

Aplikasi mobile pemesanan tiket konser berbasis **React Native** dan **Expo SDK 58** dengan arsitektur file-based routing menggunakan **Expo Router** dan pola **Clean Architecture (Separation of Concerns)**. Aplikasi ini merupakan bagian frontend mobile dari proyek UKK (*Uji Kompetensi Keahlian*) Sistem Pemesanan Tiket Konser.

---

## 🌟 Fitur Utama yang Telah Diimplementasikan

### 1. 🎨 Immersive Animated SplashScreen
- Latar belakang visual konser panggung imersif dengan tata cahaya laser dan panggung *"LIVE THE MOMENT"*.
- Tipografi utama: **CONCERTIX** dan tagline *"Discover. Book. Enjoy"*.
- Animasi smooth fade-in dan gentle scale.
- Pengecekan sesi token autentikasi otomatis di latar belakang (redirect ke `/home` jika token ditemukan, atau `/login` jika belum masuk).
- Fitur *tap-to-skip* untuk langsung masuk ke halaman utama tanpa menunggu timer.

### 2. 🔐 Autentikasi Pengguna (Login & Register)
- **Login:** Desain clean minimalis putih dengan validasi email dan kata sandi real-time, toggle sembunyikan/tampilkan password, Remember Me, serta tombol OAuth Google & Apple.
- **Register:** Pendaftaran akun baru (*Full Name, Email, Password, Confirm password*) dengan validasi kecocokan password, checkbox Terms of Service, dan penanganan error responsif.
- Terhubung langsung ke REST API backend dengan timeout aman 10 detik via `AbortController`.

### 3. 🏠 Home Screen Interaktif & Dinamis
- **Header:** Menyapa nama pengguna terautentikasi (*"Hello, {username} 👋"*) dan tombol notifikasi.
- **Search Bar:** Akses cepat untuk pencarian konser, artis, atau venue.
- **Featured Banner:** Banner konser unggulan (Coldplay World Tour) dengan navigasi langsung ke detail acara.
- **Kategori Musik:** Filter horizontal (*All, Music, Festival, K-Pop, Pop*) dengan ikon interaktif.
- **Rekomendasi Konser Real-time:** Daftar konser dinamis dari API backend menampilkan poster beresolusi tinggi, judul, venue, tanggal terformat (ID), dan harga tiket terendah (`From Rp.X.XXX.XXX`).
- **Pull-to-Refresh:** Tarik layar ke bawah untuk memperbarui daftar konser dari database.
- Tampilan kartu bersih (*clean presentation*) tanpa elemen overflow dan tanpa logo love yang mengganggu.

### 4. 🔎 Search Screen Cepat & Akurat
- Input pencarian real-time dengan tombol hapus instan `(X)` dan tombol **Cancel**.
- **Filter Tabs:** Tab filter kategori pencarian:
  - **All:** Mencari di semua bidang (judul, deskripsi, lokasi, venue).
  - **Concert:** Khusus memfilter judul konser dan nama tour/musisi.
  - **Venue:** Khusus menyaring berdasarkan nama stadion/lokasi konser (contoh: JIS, GBK, ICE BSD).
- Format kartu konser modern berbingkai halus dengan sudut membulat (`borderRadius: 18`) yang selaras dengan tema aplikasi.
- Menampilkan seluruh daftar konser dari API secara default dan menghubungkan setiap kartu langsung ke halaman detail konser.

### 5. 🎫 Detail Concert Screen
- Hero poster artistik dengan overlay judul konser, nama tour, ikon venue stadion, dan tanggal konser.
- Bottom sheet putih elegan dengan informasi *"About Concert"* dan tombol toggle *"Read More / Show Less"*.
- Daftar harga kategori tiket (*Ticket Price*) dengan indikator warna badge tier (VIP, Festival, CAT 1, CAT 2).
- Tombol aksi utama **Pilih Tiket** (*full-width purple button*).
- Tombol navigasi kembali yang aman (*defensive fallback navigation*).

### 6. 🎟️ Pilih Tiket & Riwayat Pemesanan (Tickets)
- **Pilih Tiket (`/pilih-tiket`):** Antarmuka pemilihan kategori tiket, perhitungan kuantitas dinamis, dan kalkulasi total harga tiket secara otomatis.
- **Riwayat Tiket (`/riwayat-tiket`):** Daftar tiket yang sudah dibeli dengan tab status (Upcoming, Past, Cancelled), kode booking, barcode scanner view, dan detail transaksi.

### 7. 👤 Profile Pengguna & Manajemen Sesi
- **Hero Cosmic Header:** Tampilan tema luar angkasa gelap elegan (`#090014`) dengan avatar pengguna berbingkai putih dan judul halaman *"Profile"*.
- **Kotak Ringkasan Statistik:** Tiga kolom statistik interaktif (**Orders (12)**, **Orders (24)**, dan **Favorites (8)**) dengan pembatas vertikal proporsional berlatar abu-abu netral.
- **Menu Pengaturan Akun:** Daftar opsi lengkap mencakup *Personal Information*, *Payment Methods*, *My Vouchers*, *Notification*, *Help Center*, dan *About Concertix*.
- **Aksi Logout Aman:** Tombol Logout berwarna merah dengan dialog konfirmasi Alert dan pembersihan sesi lokal (`@auth_token`, `@auth_user`).
- **Resilient Offline Cache & 401 Handling:** Profil memuat data pengguna secara instan dari cache lokal `AsyncStorage`. Sesi yang kadaluwarsa (HTTP 401) ditangani secara senyap tanpa memicu popup banner error.

### 8. 🏛️ Clean Architecture & Controller Layer
Setiap layar memisahkan tampilan UI (Presentational View) dan logika bisnis (Controller Hook):
- `src/controllers/home/useHomeController.ts`
- `src/controllers/detailConcert/useDetailConcertController.ts`
- `src/controllers/search/useSearchController.ts`
- `src/controllers/profile/useProfileController.ts`
- `src/controllers/pilihTiket/usePilihTiketController.ts`
- `src/controllers/riwayatTiket/useRiwayatTiketController.ts`
- `src/controllers/splash/useSplashController.ts`
- `src/controllers/login/useLogin.ts`
- `src/controllers/register/useRegister.ts`

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [React Native](https://reactnative.dev/) `0.88.1` & [React](https://react.dev/) `19.3.0`
- **Platform**: [Expo SDK](https://expo.dev/) `~58.0.25`
- **Routing & Navigasi**: [Expo Router](https://docs.expo.dev/router/introduction/) `~58.0.31`
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) `~6.0.3` (Strict mode, **0 compilation errors**)
- **Penyimpanan Lokal**: `@react-native-async-storage/async-storage` `2.2.0`
- **Animasi**: `react-native-reanimated` `4.7.1` & `react-native-worklets`
- **Ikon & Gambar**: `@expo/vector-icons` `^15.0.2`, `expo-image` `~58.0.18`
- **Safe Area & UI**: `react-native-safe-area-context`, `react-native-screens`

---

## 🚀 Panduan Memulai

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- Aplikasi **Expo Go** pada ponsel fisik (tersedia di Google Play Store & App Store), atau Android Studio (Android Emulator).

### 2. Kloning & Instalasi Dependensi
```bash
# Masuk ke direktori project
cd mobile-tiket-konser-2

# Install dependencies
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan `EXPO_PUBLIC_API_URL` dengan target backend:
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **HP Fisik via Expo Go (Satu Jaringan Wi-Fi)**: `http://<IP_LAN_KOMPUTER>:5000/api` (contoh: `http://192.168.18.7:5000/api`)
- **Web / iOS Simulator**: `http://localhost:5000/api`

### 4. Menjalankan Aplikasi
```bash
npx expo start
```
Pilihan kontrol di terminal:
- Tekan `a` untuk membuka di **Android Emulator**.
- Tekan `w` untuk membuka di **Web Browser**.
- Pindai (*scan*) QR Code di terminal menggunakan aplikasi **Expo Go** untuk menjalankannya di HP fisik.

---

## 📁 Struktur Direktori Proyek

```text
mobile-tiket-konser-2/
├── assets/                  # Asset gambar poster konser, banner, logo, avatar
│   └── images/
│       ├── bruno-mars-detail.png
│       ├── bruno-mars-poster.png
│       ├── bruno-mars-sketch.png
│       ├── coldplay-banner.png
│       ├── splash-background.png
│       └── user-avatar.png
├── src/
│   ├── api/                 # Layanan HTTP REST API client
│   │   ├── authApi.ts       # Endpoint autentikasi login & register
│   │   ├── eventApi.ts      # Endpoint event konser & kategori tiket
│   │   ├── ticketApi.ts     # Endpoint pemesanan tiket & transaksi
│   │   └── userApi.ts       # Endpoint profil user (/auth/me) & session
│   ├── app/                 # Tampilan UI modular (Expo Router file-based)
│   │   ├── _layout.tsx      # Root stack layout & provider
│   │   ├── index.tsx        # Layar SplashScreen
│   │   ├── login.tsx        # Layar Login
│   │   ├── register.tsx     # Layar Register (Create Account)
│   │   ├── home.tsx         # Layar Beranda utama
│   │   ├── search.tsx       # Layar Pencarian konser
│   │   ├── detail-concert.tsx # Layar Detail konser & kategori tiket
│   │   ├── pilih-tiket.tsx  # Layar Pemilihan jumlah tiket
│   │   ├── riwayat-tiket.tsx # Layar Riwayat pemesanan tiket
│   │   └── profile.tsx      # Layar Profil akun pengguna
│   ├── components/          # Reusable UI components
│   │   └── bottom-nav.tsx   # Universal Bottom Navigation (Purple & White themes)
│   ├── controllers/         # Controller Hooks (Logika Bisnis & State)
│   │   ├── home/useHomeController.ts
│   │   ├── detailConcert/useDetailConcertController.ts
│   │   ├── search/useSearchController.ts
│   │   ├── profile/useProfileController.ts
│   │   ├── pilihTiket/usePilihTiketController.ts
│   │   ├── riwayatTiket/useRiwayatTiketController.ts
│   │   ├── splash/useSplashController.ts
│   │   ├── login/useLogin.ts
│   │   └── register/useRegister.ts
│   ├── styles/              # Modular StyleSheet terpisah per halaman
│   │   ├── detailConcert/
│   │   ├── home/
│   │   ├── login/
│   │   ├── pilihTiket/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── riwayatTiket/
│   │   ├── search/
│   │   └── shared/
│   └── constants/           # Konstanta tema, warna, dan dimensi
├── app.json                 # Konfigurasi aplikasi Expo & splash
├── package.json             # Dependensi proyek
├── tsconfig.json            # Konfigurasi TypeScript & path aliases (@/*)
└── README.md                # Dokumentasi proyek
```

---

## 🧪 Validasi & Kualitas Kode

Proyek ini telah melalui validasi ketat:
```bash
# Pengecekan tipe data TypeScript
node ./node_modules/typescript/bin/tsc --project tsconfig.json --noEmit
# Output: 0 errors
```

---

## 👨‍💻 Kontributor
- **Hisyam** — Fullstack Mobile & Backend Developer (UKK Project Tiket Konser)
