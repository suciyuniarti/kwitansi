# Kwitansi Digital GTC - Web Version

Versi web aplikasi Kwitansi Digital GTC dapat diakses melalui GitHub Pages.

## File yang Dipersiapkan untuk Web
Workflow akan menyalin file berikut ke direktori `dist/`:
- `index.html` (halaman utama)
- `css/style.css`
- `js/config.js`
- `js/app.js`
- `template/kwitansi.jpg` (template kwitansi)

## Cara Mengaktifkan GitHub Pages
1. Buka repository di GitHub
2. Pergi ke **Settings > Pages**
3. Pada **Source**, pilih **GitHub Actions**
4. Simpan pengaturan

## Cara Menerbitkan
1. Push perubahan ke branch `main` atau `master`
2. GitHub Actions akan otomatis menjalankan workflow `deploy-web.yml`
3. Setelah selesai, URL akan tersedia di **Settings > Pages** atau di tab **Actions**

## URL Publikasi
Setelah deployment berhasil, aplikasi akan dapat diakses di:
`https://[username].github.io/[nama-repo]/`

## Pengujian Lokal
Untuk menguji versi web secara lokal:
```bash
# Buka folder dist atau jalankan live server dari app/src/main/assets/web
# Pastikan template berada di lokasi yang benar
```

## Catatan
- Versi Android tetap utuh dan tidak diubah
- Path aset disesuaikan untuk kompatibilitas GitHub Pages
- Semua fungsi tetap sama (IPA/IPS, nominal, terbilang, keterangan, preview, simpan JPG, berbagi)
- Nominal pita biru menggunakan warna putih
