# Panduan Penggunaan Kwitansi

## 1. Persiapan Template

**Hanya butuh 1 file:**

Letakkan file `kwitansi.jpg` ke:
```
app/src/main/assets/template/kwitansi.jpg
```

File ini harus merupakan **template kwitansi lengkap** yang sudah berisi:
- Logo Hastaka
- Logo Pesona Indonesia
- Tanda tangan
- Bingkai, garis
- Nomor kwitansi yang tercetak
- Semua elemen statis lainnya

**Tidak perlu** file terpisah untuk logo atau tanda tangan.

## 2. Konfigurasi Nominal

Buka `app/src/main/assets/web/js/config.js`:

```javascript
const PRICE_CONFIG = {
    IPA: 1150000, // Ubah sesuai nominal IPA yang ditentukan
    IPS: 1085000  // Ubah sesuai nominal IPS yang ditentukan
};
```

**Catatan:** Nilai saat ini perlu dikonfirmasi sesuai harga final yang telah ditentukan.

## 3. Konfigurasi Keterangan Pembayaran

Keterangan sudah diatur persis sesuai permintaan di `app/src/main/assets/web/js/config.js`:

- **IPS:** `Untuk Pembayaran: Biaya Program “Goes to Campus SMA Telkom Bandung” ke PKN STAN & UI Tanggal 26 November 2026. Kelas IPS.`
- **IPA:** `Untuk Pembayaran: Biaya Program “Goes to Campus SMA Telkom Bandung” ke PKN STAN & UI Tanggal 26 November 2026. Penambahan Rp 65.000,- ke iMuseum Kedokteran UI. IPA.`

Keterangan otomatis berubah saat jurusan dipilih.

## 4. Menyesuaikan Posisi Teks

Jika teks belum pas dengan posisi di template setelah dicoba, sesuaikan koordinat di `app/src/main/assets/web/js/app.js`:

```javascript
const TEXT_CONFIG = {
    namaSiswa: { x: 500, y: 320, font: 'bold 32px Arial' },      // Posisi nama siswa
    nominal: { x: 450, y: 450, font: 'bold 22px Arial' },         // Posisi nominal
    keterangan: { x: 150, y: 520, maxWidth: 500, lineHeight: 18, font: '14px Arial' } // Posisi keterangan
};
```

**Tips Kalibrasi:**
- Ubah nilai `x` (horizontal) dan `y` (vertikal)
- Sesuaikan `font`, `maxWidth`, `lineHeight` untuk keterangan
- Test dengan berbagai nama dan kedua jurusan

## 5. Menjalankan Aplikasi di VS Code

1. Buka folder proyek di VS Code
2. Pastikan `kwitansi.jpg` sudah ada di `app/src/main/assets/template/`
3. Hubungkan perangkat Android atau emulator
4. Jalankan:
```bash
./gradlew installDebug
```

Atau gunakan Android extension di VS Code.

## 6. Build APK Manual

```bash
# Bersihkan build sebelumnya (opsional)
./gradlew clean

# Build Debug APK
./gradlew assembleDebug

# Build Release APK (unsigned)
./gradlew assembleRelease
```

APK hasil build:
- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release-unsigned.apk`

## 7. Upload ke GitHub

```bash
git init
git add .
git commit -m "Kwitansi"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPOSITORY.git
git push -u origin main
```

## 8. Build APK Otomatis dengan GitHub Actions

Setelah push ke GitHub:
1. Buka repository di GitHub
2. Klik tab **Actions**
3. Tunggu workflow "Build APK" selesai (hijau)
4. Klik workflow run yang berhasil
5. Scroll ke bawah, download artifact:
   - `KwitansiDigital-Debug` - untuk testing
   - `KwitansiDigital-Release` - untuk distribusi

## 9. Membuat GitHub Release

1. Buka **Releases** > **Create a new release**
2. Buat tag, contoh: `v1.0.0`
3. Isi judul dan deskripsi
4. Upload file APK (bisa extract dari artifact atau download langsung)
5. Klik **Publish release**
6. APK bisa diunduh dari halaman release

## 10. Pengujian Fitur

Pastikan semua fitur berfungsi:
- [ ] Form wajib diisi (nama siswa & jurusan)
- [ ] Keterangan berubah otomatis sesuai jurusan
- [ ] Nominal sesuai konfigurasi
- [ ] Pratinjau muncul dengan template lengkap
- [ ] Teks dinamis tidak menimpa logo/tanda tangan
- [ ] Simpan JPG berhasil
- [ ] Bagikan ke WhatsApp/aplikasi lain berhasil
- [ ] Reset form berfungsi
- [ ] Bisa digunakan offline
- [ ] Hanya buat satu per satu (tidak ada fitur massal)

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Template tidak muncul | Pastikan `kwitansi.jpg` ada di `app/src/main/assets/template/` dengan nama persis |
| Posisi teks meleset | Sesuaikan koordinat di `TEXT_CONFIG` di `app.js` |
| Keterangan terpotong/keluar area | Kurangi `font-size` atau naikkan `maxWidth`, sesuaikan `lineHeight` |
| Gagal simpan | Pada Android 10+, file disimpan di app-specific storage. Cek notifikasi |
| Gagal berbagi | Pastikan FileProvider berfungsi, coba aplikasi lain |
| Build gagal | Jalankan `./gradlew clean` dan pastikan JDK 17 terpakai |
| Aset logo/ttd terpisah diperlukan | **TIDAK PERLU** - semua sudah ada di `kwitansi.jpg` |

## Hal yang Perlu Dikonfirmasi

- **Nominal IPA/IPS:** Nilai di `config.js` saat ini perlu dikonfirmasi kebenarannya
- **Posisi teks:** Perlu kalibrasi setelah `kwitansi.jpg` asli tersedia
- **Nomor kwitansi:** Sudah diset `001/GTC/VIII/2026` sesuai kode, pastikan sama dengan yang tercetak di template
