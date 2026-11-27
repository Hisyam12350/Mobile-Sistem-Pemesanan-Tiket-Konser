# 📱 Concertix — Mobile Sistem Pemesanan Tiket Konser

Aplikasi mobile pemesanan tiket konser berbasis **React Native** dan **Expo SDK 58** dengan arsitektur file-based routing menggunakan **Expo Router** dan pola **Clean Architecture (Separation of Concerns)**. Aplikasi ini merupakan bagian frontend mobile dari proyek UKK (*Uji Kompetensi Keahlian*) Sistem Pemesanan Tiket Konser.

---

## 🌟 Fitur Utama yang Telah Diimplementasikan

### 1. 🎨 Immersive Animated SplashScreen
- Latar belakang visual konser panggung imersif dengan tata cahaya laser dan panggung *"LIVE THE MOMENT"*.
- Tipografi utama: **CONCERTIX** dan tagline *"Discover. Book. Enjoy"*.
- Animasi smooth fade-in dan gentle scale dengan fitur *tap-to-skip*.
- Pengecekan sesi token autentikasi otomatis di latar belakang (redirect ke `/home` jika token ditemukan, atau `/login` jika belum masuk).

### 2. 🔐 Autentikasi Pengguna (Login & Register)
- **Login (`/login`):** Desain clean minimalis putih dengan validasi email dan kata sandi real-time, toggle sembunyikan/tampilkan password, Remember Me, serta tombol OAuth Google & Apple.
- **Register (`/register`):** Pendaftaran akun baru (*Full Name, Email, Password, Confirm password*) dengan validasi kecocokan password, checkbox Terms of Service, dan penanganan error responsif.
- Terhubung langsung ke REST API backend dengan timeout aman 10 detik via `AbortController`.

### 3. 🏠 Home Screen Interaktif & Dinamis
- **Header:** Menyapa nama pengguna terautentikasi (*"Hello, {username} 👋"*) dan tombol notifikasi.
- **Search Bar & Featured Banner:** Akses cepat pencarian konser serta banner konser unggulan menuju detail acara.
- **Kategori Musik:** Filter horizontal (*All, Music, Festival, K-Pop, Pop*) dengan ikon interaktif.
- **Rekomendasi Konser Real-time:** Daftar konser dinamis dari API backend dengan poster beresolusi tinggi, tanggal terformat (ID), harga terendah (`From Rp.X.XXX.XXX`), serta fitur **Pull-to-Refresh**.

### 4. 🔎 Search Screen Cepat & Akurat
- Input pencarian real-time dengan tombol hapus `(X)` dan **Cancel**.
- **Filter Tabs:** *All*, *Concert*, dan *Venue* (JIS, GBK, ICE BSD, dll.) dengan kartu hasil pencarian yang terhubung langsung ke detail konser.

### 5. 🎫 Detail Concert & Pilih Tiket
- **Detail Concert (`/detail-concert`):** Hero poster artistik, bottom sheet *"About Concert"* dengan *"Read More / Show Less"*, daftar harga kategori tiket beserta warna badge tier, dan tombol **Pilih Tiket**.
- **Pilih Tiket (`/pilih-tiket`):** Pemilihan kuantitas tiket per kategori (maksimal 6 tiket per transaksi) dengan kalkulasi total harga otomatis dan popup benefit kategori.

### 6. 💺 Seat Map Interaktif & Seat Locking Real-Time (`/seat-map`)
- **Peta Kursi 6 Blok Interaktif:** Menampilkan seluruh kursi asli dari database yang dipetakan per blok kategori di sekitar oval **STAGE**.
- **4 Status Kursi & Legenda Jelas:**
  - **Available** (putih border abu-abu) — kursi tersedia dan dapat dipilih.
  - **Selected** (ungu `#6F00FF`) — kursi yang sedang dipilih pengguna.
  - **Locked** (kuning/amber `#F59E0B`) — kursi sedang dikunci sementara oleh pembeli lain (tidak dapat dipilih).
  - **Sold** (merah `#EF4444`) — kursi sudah terjual/terbeli permanen.
- **Anti Double-Booking & Refresh Otomatis:** Status kursi disinkronkan setiap kali layar difokuskan (`useFocusEffect` + `no-cache`), menekan **Lanjutkan** memanggil `POST /api/seats/lock` secara atomik (menolak otomatis jika `409 Conflict` & menyegarkan peta), dan tombol **Back** dari Checkout melepaskan lock sementara (`POST /api/seats/unlock`).

### 7. 🛒 Checkout & Pembayaran Midtrans QRIS (`/checkout`, `/payment-method`, `/payment-success`)
- **Checkout (`/checkout`):** Ringkasan detail konser, kategori, daftar nomor kursi, kode promo voucher (`CONCERTIX50`, `KONSER100K`), biaya layanan, dan dialog konfirmasi pesanan.
- **Metode Pembayaran (`/payment-method`):** Mendukung metode pembayaran **QRIS (Midtrans Sandbox Snap API)** via `createPayment` & `chargeSnapQris` lengkap dengan countdown batas bayar 15 menit, auto-polling status pembayaran tiap 3 detik (`GET /api/payments/:orderId`), penolakan eksplisit bila lock/order gagal, serta persistensi status `Pending` lokal agar QRIS tetap bisa dibuka kembali dari Riwayat Tiket.
- **Pembayaran Berhasil (`/payment-success`):** Ringkasan `Order ID` & total pembayaran, proteksi tombol Back Android ke `/home`, serta tombol langsung **Lihat E-Ticket**.

### 8. 🎟️ Riwayat Tiket & Detail E-Ticket QR (`/riwayat-tiket`, `/e-ticket`)
- **Riwayat Tiket (`/riwayat-tiket`):** Tab **Upcoming**, **Completed**, dan **Canceled**; menggabungkan data resmi dari `GET /api/tickets` dengan transaksi lokal `AsyncStorage` secara terdeduplikasi. Ketuk transaksi `Pending` untuk melanjutkan bayar QRIS, atau ketuk tiket lunas untuk membuka E-Ticket tanpa perlu membeli ulang.
- **Detail E-Ticket (`/e-ticket`):**
  - Kartu tiket sesuai desain (poster artis, `ORDER ID`, `Date / Time / Venue`, `TICKET INFO` kategori/kursi/jumlah, serta gambar QR Code).
  - **QR Code Unik Per Kursi:** Jika pesanan berisi > 1 tiket, tersedia pemilih kursi (*seat pills*) yang masing-masing menampilkan QR Code unik (`kode_unik`) dalam format PNG Data URI tajam bebas celah subpixel.
  - **Simpan ke Galeri:** Mengunduh QR Code `.png` langsung di Web, atau menyimpannya ke galeri perangkat via `expo-media-library` & `expo-file-system` (mendukung Android 11+ langsung lewat MediaStore pada Expo Go maupun fallback Storage Access Framework untuk Android lama).

### 9. 👤 Profile Pengguna & Manajemen Sesi
- Header tema cosmic (`#090014`), ringkasan statistik, daftar menu pengaturan akun, logout aman dengan konfirmasi Alert, serta offline cache user & silent `401` handling.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [React Native](https://reactnative.dev/) `0.88.1` & [React](https://react.dev/) `19.3.0`
- **Platform**: [Expo SDK](https://expo.dev/) `~58.0.25`
- **Routing & Navigasi**: [Expo Router](https://docs.expo.dev/router/introduction/) `~58.0.31`
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) `~6.0.3` (Strict mode, **0 compilation errors**)
- **QR & Media**: `qrcode` `^1.5.4`, `expo-media-library` `~58.0.14`, `expo-file-system`
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
Salin file `.env.example` menjadi `.env` (jika tersedia) atau buat `.env`:
```bash
cp .env.example .env
```
Sesuaikan `EXPO_PUBLIC_API_URL` dengan target backend:
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **HP Fisik via Expo Go (Satu Jaringan Wi-Fi)**: `http://<IP_LAN_KOMPUTER>:5000/api` (contoh: `http://192.168.18.7:5000/api`)
- **Public Tunnel (Ngrok)**: `https://<domain-ngrok>/api`
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
├── assets/
│   └── images/
│       ├── bruno-mars-detail.png
│       ├── bruno-mars-eticket.png
│       ├── bruno-mars-poster.png
│       ├── bruno-mars-sketch.png
│       ├── coldplay-banner.png
│       ├── payment-success.png
│       ├── splash-background.png
│       └── user-avatar.png
├── src/
│   ├── api/                 # Layanan HTTP REST API client
│   │   ├── authApi.ts       # Endpoint autentikasi login & register
│   │   ├── config.ts        # Resolusi API_BASE_URL otomatis (env / LAN / emulator)
│   │   ├── eventApi.ts      # Endpoint event konser & kategori tiket
│   │   ├── paymentApi.ts    # Endpoint create/status pembayaran & Snap QRIS
│   │   ├── seatApi.ts       # Endpoint daftar kursi, lock, unlock & create order
│   │   ├── ticketApi.ts     # Endpoint tiket user, detail & download QR PNG
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
│   │   ├── seat-map.tsx     # Layar Peta kursi & seat locking interaktif
│   │   ├── checkout.tsx     # Layar Ringkasan checkout & voucher
│   │   ├── payment-method.tsx # Layar Pembayaran QRIS Midtrans & countdown
│   │   ├── payment-success.tsx # Layar Konfirmasi pembayaran berhasil
│   │   ├── e-ticket.tsx     # Layar Detail E-Ticket & simpan QR ke galeri
│   │   ├── riwayat-tiket.tsx # Layar Riwayat pemesanan tiket
│   │   └── profile.tsx      # Layar Profil akun pengguna
│   ├── components/          # Reusable UI components
│   │   └── bottom-nav.tsx   # Universal Bottom Navigation (Purple & White themes)
│   ├── controllers/         # Controller Hooks (Logika Bisnis & State)
│   │   ├── checkout/useCheckoutController.ts
│   │   ├── detailConcert/useDetailConcertController.ts
│   │   ├── eTicket/useETicketController.ts
│   │   ├── home/useHomeController.ts
│   │   ├── login/useLogin.ts
│   │   ├── paymentMethod/usePaymentMethodController.ts
│   │   ├── paymentSuccess/usePaymentSuccessController.ts
│   │   ├── pilihTiket/usePilihTiketController.ts
│   │   ├── profile/useProfileController.ts
│   │   ├── register/useRegister.ts
│   │   ├── riwayatTiket/useRiwayatTiketController.ts
│   │   ├── search/useSearchController.ts
│   │   ├── seatMap/useSeatMapController.ts
│   │   └── splash/useSplashController.ts
│   ├── styles/              # Modular StyleSheet terpisah per halaman
│   │   ├── checkout/
│   │   ├── detailConcert/
│   │   ├── eTicket/
│   │   ├── home/
│   │   ├── login/
│   │   ├── paymentMethod/
│   │   ├── paymentSuccess/
│   │   ├── pilihTiket/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── riwayatTiket/
│   │   ├── search/
│   │   ├── seatMap/
│   │   └── shared/
│   ├── utils/
│   │   └── qrHelper.ts      # Generator matriks QR & encoder PNG grayscale murni TS
│   └── constants/           # Konstanta tema, warna, dan dimensi
├── app.json                 # Konfigurasi aplikasi Expo, plugin MediaLibrary & splash
├── package.json             # Dependensi proyek
├── tsconfig.json            # Konfigurasi TypeScript & path aliases (@/*)
└── README.md                # Dokumentasi proyek
```

---

## 🧪 Validasi & Kualitas Kode

```bash
# Pengecekan tipe data TypeScript
node ./node_modules/typescript/bin/tsc --project tsconfig.json --noEmit

# Pengecekan linting ESLint & React Compiler rules
npx eslint src/ --ext .ts,.tsx
```

---

## 👨‍💻 Kontributor
- **Hisyam** — Fullstack Mobile & Backend Developer (UKK Project Tiket Konser)
