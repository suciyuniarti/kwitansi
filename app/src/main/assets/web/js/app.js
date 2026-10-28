let templateImage = null;
let currentCanvasData = null;

// Konfigurasi posisi teks - sesuaikan setelah template diedit
// Area yang dikosongkan: Telah Diterima Dari, Uang Sebesar (terbilang), Untuk Pembayaran, Nominal pita biru
const TEXT_CONFIG = {
    diterimaDari: { x: 370, y: 295, font: '24px Calibri', maxWidth: 450 },
    uangSebesar: { x: 370, y: 325, font: '24px Calibri', maxWidth: 450 },
    nominalPita: { x: 230, y: 470, font: 'bold 24px Calibri', color: '#FFFFFF' },
    keterangan: { x: 370, y: 355, maxWidth: 650, lineHeight: 22, font: '22px Calibri' }
};

// Load template image
function loadTemplate() {
    templateImage = new Image();
    templateImage.crossOrigin = "anonymous";

    // Try multiple paths for different environments
    const paths = [
        "../template/kwitansi.jpg",           // For Live Server from web/ folder
        "../../template/kwitansi.jpg",        // Alternative
        "/app/src/main/assets/template/kwitansi.jpg", // Absolute from project root
        "file:///android_asset/template/kwitansi.jpg"  // Android WebView
    ];

    let pathIndex = 0;

    function tryLoadPath() {
        if (pathIndex >= paths.length) {
            document.getElementById('status').textContent = "Template gagal dimuat. Periksa lokasi file kwitansi.jpg";
            alert("Template kwitansi.jpg gagal dimuat!\n\nPastikan file ada di:\napp/src/main/assets/template/kwitansi.jpg\n\nUntuk Live Server, buka index.html melalui Live Server atau pastikan path benar.");
            console.error("Semua path gagal dimuat");
            return;
        }

        templateImage.src = paths[pathIndex];
        console.log("Mencoba memuat template dari:", paths[pathIndex]);
        pathIndex++;
    }

    templateImage.onload = function () {
        document.getElementById('status').textContent = "Template siap";
        // Initialize canvas with template
        const canvas = document.getElementById('kwitansiCanvas');
        canvas.width = templateImage.width;
        canvas.height = templateImage.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(templateImage, 0, 0);
        console.log("Template berhasil dimuat:", templateImage.src);
    };

    templateImage.onerror = function () {
        console.log("Gagal memuat dari:", templateImage.src);
        tryLoadPath();
    };

    tryLoadPath();
}

// Format Rupiah
function formatRupiah(angka) {
    return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",-";
}

// Format Rupiah nominal
function formatRupiahNominal(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Update form based on jurusan
function updateForm() {
    const jurusan = document.getElementById('jurusan').value;
    const nominalInput = document.getElementById('nominal');
    const keteranganInput = document.getElementById('keterangan');

    if (jurusan === 'IPA') {
        nominalInput.value = formatRupiah(PRICE_CONFIG.IPA);
        keteranganInput.value = KETERANGAN_CONFIG.IPA;
    } else if (jurusan === 'IPS') {
        nominalInput.value = formatRupiah(PRICE_CONFIG.IPS);
        keteranganInput.value = KETERANGAN_CONFIG.IPS;
    } else {
        nominalInput.value = '';
        keteranganInput.value = '';
    }
}

// Generate receipt preview
function buatKwitansi() {
    const namaSiswa = document.getElementById('namaSiswa').value.trim();
    const jurusan = document.getElementById('jurusan').value;

    if (namaSiswa === '') {
        alert('Nama Siswa wajib diisi!');
        document.getElementById('namaSiswa').focus();
        return;
    }

    if (jurusan === '') {
        alert('Pilih Jurusan terlebih dahulu!');
        document.getElementById('jurusan').focus();
        return;
    }

    if (!templateImage || !templateImage.complete) {
        alert('Template kwitansi belum tersedia.\n\nPastikan file kwitansi.jpg ada di:\napp/src/main/assets/template/kwitansi.jpg');
        return;
    }

    const canvas = document.getElementById('kwitansiCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match template (preserve original ratio)
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;

    // Draw template as background
    ctx.drawImage(templateImage, 0, 0);

    // Set text style
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';

    const harga = jurusan === 'IPA' ? PRICE_CONFIG.IPA : PRICE_CONFIG.IPS;
    const terbilang = jurusan === 'IPA' ? TERBILANG_CONFIG.IPA : TERBILANG_CONFIG.IPS;
    const keterangan = jurusan === 'IPA' ? KETERANGAN_CONFIG.IPA : KETERANGAN_CONFIG.IPS;

    // Telah Diterima Dari
    ctx.font = TEXT_CONFIG.diterimaDari.font;
    ctx.fillText(namaSiswa, TEXT_CONFIG.diterimaDari.x, TEXT_CONFIG.diterimaDari.y);

    // Uang Sebesar (terbilang)
    ctx.font = TEXT_CONFIG.uangSebesar.font;
    ctx.fillText(terbilang, TEXT_CONFIG.uangSebesar.x, TEXT_CONFIG.uangSebesar.y);

    // Nominal pada pita biru
    ctx.fillStyle = '#FFFFFF'; // Warna putih
    ctx.font = TEXT_CONFIG.nominalPita.font;
    ctx.fillText(
        formatRupiahNominal(harga),
        TEXT_CONFIG.nominalPita.x,
        TEXT_CONFIG.nominalPita.y
    );

    // Kembalikan warna default untuk teks berikutnya
    ctx.fillStyle = '#000000';
    // Untuk Pembayaran
    ctx.font = TEXT_CONFIG.keterangan.font;
    wrapText(ctx, keterangan, TEXT_CONFIG.keterangan.x, TEXT_CONFIG.keterangan.y,
        TEXT_CONFIG.keterangan.maxWidth, TEXT_CONFIG.keterangan.lineHeight);

    // Save canvas data as JPG
    currentCanvasData = canvas.toDataURL('image/jpeg', 0.95);

    // Enable buttons
    document.getElementById('btnSimpan').disabled = false;
    document.getElementById('btnBagikan').disabled = false;

    document.getElementById('status').textContent = "Kwitansi siap disimpan/dibagikan";

    if (window.AndroidInterface) {
        window.AndroidInterface.showToast("Kwitansi berhasil dibuat");
    }
}

// Wrap text function for long descriptions
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

// Save as JPG
function simpanJPG() {
    if (!currentCanvasData) {
        alert('Buat kwitansi terlebih dahulu!');
        return;
    }

    const namaSiswa = document.getElementById('namaSiswa').value.trim();
    // Clean filename - remove invalid characters
    const cleanName = namaSiswa.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    const fileName = 'Kwitansi_' + cleanName;

    if (window.AndroidInterface) {
        window.AndroidInterface.saveImage(currentCanvasData, fileName);
    } else {
        // For testing in browser
        const link = document.createElement('a');
        link.download = fileName + '.jpg';
        link.href = currentCanvasData;
        link.click();
        alert('Kwitansi berhasil diunduh');
    }
}

// Share image
function bagikanKwitansi() {
    if (!currentCanvasData) {
        alert('Buat kwitansi terlebih dahulu!');
        return;
    }

    const namaSiswa = document.getElementById('namaSiswa').value.trim();
    const cleanName = namaSiswa.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    const fileName = 'Kwitansi_' + cleanName;

    if (window.AndroidInterface) {
        window.AndroidInterface.shareImage(currentCanvasData, fileName);
    } else {
        alert('Fitur berbagi hanya tersedia di aplikasi Android');
    }
}

// Reset form
function resetForm() {
    document.getElementById('namaSiswa').value = '';
    document.getElementById('jurusan').value = '';
    document.getElementById('nominal').value = '';
    document.getElementById('keterangan').value = '';

    const canvas = document.getElementById('kwitansiCanvas');
    const ctx = canvas.getContext('2d');
    if (templateImage && templateImage.complete) {
        canvas.width = templateImage.width;
        canvas.height = templateImage.height;
        ctx.drawImage(templateImage, 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    currentCanvasData = null;
    document.getElementById('btnSimpan').disabled = true;
    document.getElementById('btnBagikan').disabled = true;
    document.getElementById('status').textContent = "Form telah direset";

    if (window.AndroidInterface) {
        window.AndroidInterface.showToast("Form berhasil direset");
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadTemplate();

    document.getElementById('jurusan').addEventListener('change', updateForm);
    document.getElementById('btnBuat').addEventListener('click', buatKwitansi);
    document.getElementById('btnSimpan').addEventListener('click', simpanJPG);
    document.getElementById('btnBagikan').addEventListener('click', bagikanKwitansi);
    document.getElementById('btnReset').addEventListener('click', resetForm);
});
