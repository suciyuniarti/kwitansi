// Konfigurasi Kwitansi Digital
// Nominal berdasarkan jurusan
const PRICE_CONFIG = {
    IPS: 340000,
    IPA: 405000
};

// Terbilang untuk "Uang Sebesar"
const TERBILANG_CONFIG = {
    IPS: "Tiga Ratus Empat Puluh Ribu Rupiah",
    IPA: "Empat Ratus Lima Ribu Rupiah"
};

// Nomor Kwitansi - Tetap sesuai template
const RECEIPT_NUMBER = "INV-HH-2406-050";

// Keterangan Pembayaran - Teks persis sesuai permintaan
const KETERANGAN_CONFIG = {
    IPS: "Untuk Pembayaran: Biaya Program \u201cGoes to Campus SMA Telkom Bandung\u201d ke PKN STAN & UI Tanggal 26 November 2026. Kelas IPS.",
    IPA: "Untuk Pembayaran: Biaya Program \u201cGoes to Campus SMA Telkom Bandung\u201d ke PKN STAN & UI Tanggal 26 November 2026. Penambahan Rp 65.000,- ke iMuseum Kedokteran UI. IPA."
};

// Format Rupiah
function formatRupiah(angka) {
    return "Rp" + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",-";
}

// Format Rupiah nominal untuk pita biru
function formatRupiahNominal(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
