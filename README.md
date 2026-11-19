# 📱 Concertix — Mobile Sistem Pemesanan Tiket Konser

Aplikasi mobile pemesanan tiket konser berbasis **React Native** dan **Expo SDK 58** dengan arsitektur file-based routing menggunakan **Expo Router**. Aplikasi ini merupakan bagian frontend mobile dari proyek UKK (*Uji Kompetensi Keahlian*) Sistem Pemesanan Tiket Konser.

---

## 🌟 Fitur Utama yang Telah Diimplementasikan

1. **🎨 Immersive Animated SplashScreen**
   - Latar belakang visual konser panggung imersif dengan tata cahaya laser dan panggung *"LIVE THE MOMENT"*.
   - Tipografi utama: **CONCERTIX** dan tagline *"Discover. Book. Enjoy"*.
   - Animasi smooth fade-in dan gentle scale.
   - Pengecekan sesi autentikasi otomatis di latar belakang (redirect ke `/home` jika token ditemukan, atau `/login` jika belum masuk).
   - Fitur *tap-to-skip* untuk langsung masuk ke halaman utama tanpa menunggu timer.

2. **🔐 Tampilan Login Modern & Presisi**
   - Desain clean minimalis putih dengan input bergaris tepi (*rounded outline*).
   - Validasi format email dan kata sandi secara real-time.
   - Fitur **Remember Me** (checkbox interaktif).
   - Tautan **Forgot password?**.
   - Tombol utama **Login** berwarna ungu elektrik (*full-width button*).
   - Tombol login sosial media: **Google** (logo multi-warna) dan **Apple** (logo resmi).
   - Toggle sembunyikan/tampilkan kata sandi (*eye/eye-off toggle*).

3. **📝 Pendaftaran Akun (Create Account / Register)**
   - Form pendaftaran akun baru: *Full Name*, *Email*, *Password*, dan *Confirm password*.
   - Validasi kata sandi ganda (mencocokkan konfirmasi password secara presisi).
   - Checkbox persetujuan **Terms of service**.
   - Ikon lonceng outline pada header.
   - Penanganan pesan error server yang informatif (*inline field error* & *general alert box*).

4. **🏠 Home Dashboard Screen**
   - Menampilkan data profil pengguna terautentikasi (*username* dan *email*).
   - Penyimpanan sesi token yang aman menggunakan `@react-native-async-storage/async-storage`.
   - Tombol **Keluar (Logout)** yang membersihkan token dan mengembalikan pengguna ke halaman Login.

5. **🌐 Integrasi REST API Backend Handal**
   - Terhubung langsung dengan REST API backend Node.js / Express.
   - Konfigurasi URL dinamis melalui environment variable `EXPO_PUBLIC_API_URL`.
   - Penanganan error jaringan cerdas: menampilkan pesan ramah jika backend offline atau terjadi masalah koneksi internet.

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
Sesuaikan `EXPO_PUBLIC_API_URL` dengan target backend kamu:
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **HP Fisik via Expo Go (Satu Jaringan Wi-Fi)**: `http://<IP_LAN_KOMPUTER>:5000/api` (contoh: `http://192.168.1.15:5000/api`)
- **Web / iOS Simulator**: `http://localhost:5000/api`

### 4. Menjalankan Aplikasi
```bash
npx expo start
```
Pilihan kontrol di terminal:
- Tekan `a` untuk membuka di **Android Emulator**.
- Tekan `w` untuk membuka di **Web Browser**.
- Pindai (*scan*) QR Code di terminal menggunakan kamera ponsel / aplikasi **Expo Go** untuk menjalankannya di perangkat fisik.

---

## 📁 Struktur Direktori Proyek

```text
mobile-tiket-konser-2/
├── assets/                  # Asset gambar, icon, logo sosial, dan splash
│   └── images/
│       ├── google-logo.png
│       ├── splash-background.png
│       └── icon.png
├── src/
│   ├── api/                 # Layanan komunikasi HTTP REST API
│   │   └── authApi.ts
│   ├── app/                 # Routing file-based (Expo Router)
│   │   ├── _layout.tsx      # Root layout & animated splash provider
│   │   ├── index.tsx        # Halaman SplashScreen utama & auth redirect
│   │   ├── login.tsx        # Halaman Login
│   │   ├── register.tsx     # Halaman Register (Create Account)
│   │   └── home.tsx         # Halaman Dashboard setelah login
│   ├── components/          # Komponen UI modular & animated icon
│   ├── constants/           # Konstanta tema, warna, dan dimensi
│   ├── controllers/         # Logika bisnis & custom hooks (useLogin, useRegister)
│   └── styles/              # Pemisahan StyleSheet halaman (loginStyles, registerStyles)
├── .env.example             # Contoh template environment variables
├── app.json                 # Konfigurasi aplikasi Expo & splash native
├── package.json             # Dependensi proyek
├── tsconfig.json            # Konfigurasi TypeScript & path aliases (@/*)
└── README.md                # Dokumentasi proyek
```

---

## 🧪 Validasi & Kualitas Kode

Proyek ini telah melalui validasi ketat:
```bash
# Pengecekan tipe data TypeScript
node ./node_modules/typescript/bin/tsc --noEmit
# Output: 0 errors
```

---

## 👨‍💻 Kontributor
- **Hisyam** — Fullstack Mobile & Backend Developer (UKK Project Tiket Konser)
