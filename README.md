# Kwitansi

Aplikasi Android native untuk menghasilkan kwitansi digital berdasarkan template kwitansi. Dibangun dengan Android Java + WebView (HTML/CSS/JS).

## Fitur
- Formulir untuk mengisi Nama Siswa dan memilih Jurusan (IPA/IPS)
- Nominal pembayaran dan keterangan pembayaran otomatis berdasarkan jurusan
- Nomor Kwitansi tetap mengikuti yang tercetak pada template
- Pratinjau kwitansi real-time
- Simpan kwitansi sebagai gambar JPG
- Bagikan kwitansi melalui Android Share Sheet (WhatsApp, dll)
- Reset formulir
- Dapat digunakan offline
- Pembuatan satu per satu secara manual

## Teknologi
- **Android Native Java** - Aplikasi utama
- **HTML, CSS, JavaScript** - Formulir dan pratinjau di WebView
- **Gradle** - Build APK
- **GitHub Actions** - Build APK otomatis

## Struktur Proyek
```
kwitansi/
├── app/
│   ├── build.gradle
│   ├── proguard-rules.pro
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/gtc/kwitansi/
│           │   └── MainActivity.java
│           ├── assets/
│           │   ├── web/
│           │   │   ├── index.html
│           │   │   ├── css/style.css
│           │   │   ├── js/app.js
│           │   │   └── js/config.js
│           │   └── template/
│           │       └── kwitansi.jpg (TEMPLATE LENGKAP - WAJIB)
│           └── res/
│               ├── layout/activity_main.xml
│               ├── xml/file_paths.xml
│               └── values/
├── build.gradle
├── gradle.properties
├── settings.gradle
├── gradlew / gradlew.bat
└── .github/workflows/build-apk.yml
```

## Persiapan Aset Template

**WAJIB:** Letakkan **satu file** `kwitansi.jpg` ke folder `app/src/main/assets/template/`

File template ini harus sudah lengkap mencakup:
- Logo Hastaka
- Logo Pesona Indonesia  
- Tanda tangan
- Bingkai, garis, dan elemen statis lainnya
- Nomor kwitansi yang tercetak

Semua logo dan tanda tangan **sudah ada di dalam gambar template**, tidak perlu file terpisah.

## Konfigurasi

### Mengubah Nominal IPA dan IPS
Edit `app/src/main/assets/web/js/config.js`:
```javascript
const PRICE_CONFIG = {
    IPA: 1150000, // Ganti sesuai nominal yang ditentukan
    IPS: 1085000  // Ganti sesuai nominal yang ditentukan
};
```

### Mengubah Keterangan Pembayaran
Keterangan sudah sesuai persis dengan permintaan. Jika perlu diubah, edit di `app/src/main/assets/web/js/config.js`:
```javascript
const KETERANGAN_CONFIG = {
    IPS: "Untuk Pembayaran: ... Kelas IPS.",
    IPA: "Untuk Pembayaran: ... Penambahan Rp 65.000,- ke iMuseum Kedokteran UI. IPA."
};
```

### Menyesuaikan Posisi Teks
Jika posisi teks belum pas dengan template, sesuaikan di `app/src/main/assets/web/js/app.js` pada `TEXT_CONFIG`:
```javascript
const TEXT_CONFIG = {
    namaSiswa: { x: 250, y: 320, font: 'bold 24px Arial' },
    nominal: { x: 450, y: 450, font: 'bold 22px Arial' },
    keterangan: { x: 150, y: 520, maxWidth: 500, lineHeight: 18, font: '14px Arial' }
};
```

## Cara Menjalankan di VS Code

1. Buka folder `kwitansi` di VS Code
2. Pastikan file `kwitansi.jpg` sudah ada di `app/src/main/assets/template/`
3. Hubungkan Android device atau emulator
4. Jalankan: `./gradlew installDebug`

## Build APK

### Debug APK
```bash
./gradlew assembleDebug
```
Hasil: `app/build/outputs/apk/debug/app-debug.apk`

### Release APK
```bash
./gradlew assembleRelease
```
Hasil: `app/build/outputs/apk/release/app-release-unsigned.apk`

## Upload ke GitHub & Build Otomatis

1. Buat repository baru di GitHub
2. Push kode:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
3. GitHub Actions akan otomatis build APK
4. Download APK dari **Actions > [workflow run] > Artifacts** (KwitansiDigital-Debug atau KwitansiDigital-Release)

## Cara Menggunakan Aplikasi
1. Buka aplikasi Kwitansi
2. Isi **Nama Siswa** (wajib)
3. Pilih **Jurusan** IPA atau IPS (wajib)
4. Tekan **Buat Kwitansi** untuk melihat pratinjau
5. Tekan **Simpan JPG** untuk menyimpan kwitansi
6. Tekan **Bagikan Kwitansi** untuk berbagi via WhatsApp/aplikasi lain
7. Tekan **Reset Form** untuk membuat kwitansi baru

## Catatan Penting
- Aplikasi berjalan **offline** setelah terpasang
- Hanya menghasilkan format **JPG/JPEG**
- Hanya pembuatan **satu per satu** (tidak ada fitur massal/import)
- Nomor kwitansi tetap sesuai yang tercetak di template
- Semua elemen statis (logo, tanda tangan) diambil dari template
- Menggunakan FileProvider untuk berbagi file dengan aman
- Keterangan IPA dan IPS berbeda dan sesuai teks yang ditentukan
