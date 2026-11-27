declare const require: (moduleName: string) => any;
declare const process: any;

const readline = require("readline");

const terminal: any = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ======================================================
// DEFINISI TIPE DATA
// ======================================================

// Struktur data untuk satu item menu makanan/minuman.
interface MenuItem {
    kode: string;
    nama: string;
    kategori: string;
    harga: number;
    stok: number;
}

// Struktur data untuk satu item di keranjang pesanan.
interface ItemKeranjang {
    kode: string;
    nama: string;
    harga: number;
    jumlah: number;
}

// Struktur data untuk hasil perhitungan biaya.
interface Rincian {
    subtotal: number;
    diskonPersen: number;
    nilaiDiskon: number;
    setelahDiskon: number;
    pajak: number;
    biayaLayanan: number;
    total: number;
}

// Struktur data untuk hasil pembayaran.
interface HasilPembayaran {
    berhasil: boolean;
    metode: string;
    uangDiterima: number;
    kembalian: number;
}
// ======================================================
// DATA PROGRAM
// ======================================================

const daftarFilm: string[] = [
    "Petualangan Nusantara",
    "Galaxy Mission",
    "Mystery Night"
];

const daftarMenu: MenuItem[] = [
    { kode: "M01", nama: "Popcorn Asin", kategori: "Makanan", harga: 20000, stok: 20 },
    { kode: "M02", nama: "Popcorn Caramel", kategori: "Makanan", harga: 23000, stok: 20 },
    { kode: "M03", nama: "Nachos Keju", kategori: "Makanan", harga: 25000, stok: 15 },
    { kode: "M04", nama: "Hot Dog", kategori: "Makanan", harga: 22000, stok: 15 },
    { kode: "M05", nama: "Kentang Goreng", kategori: "Makanan", harga: 18000, stok: 15 },
    { kode: "D01", nama: "Air Mineral", kategori: "Minuman", harga: 8000, stok: 30 },
    { kode: "D02", nama: "Cola", kategori: "Minuman", harga: 12000, stok: 25 },
    { kode: "D03", nama: "Es Teh", kategori: "Minuman", harga: 10000, stok: 25 },
    { kode: "D04", nama: "Kopi Susu", kategori: "Minuman", harga: 15000, stok: 20 },
    { kode: "P01", nama: "Paket Popcorn + Cola", kategori: "Paket", harga: 30000, stok: 15 },
    { kode: "P02", nama: "Paket Hot Dog + Es Teh", kategori: "Paket", harga: 29000, stok: 15 }
];

// Keranjang pesanan yang akan terus berubah selama program berjalan.
const keranjang: ItemKeranjang[] = [];

// Konstanta tarif.
const TARIF_PAJAK: number = 10;
const BIAYA_LAYANAN: number = 3000;

// ======================================================
// FUNGSI INPUT
// ======================================================

// Fungsi untuk menerima input dari pengguna.
function tanya(pertanyaan: string): Promise<string> {
    return new Promise((resolve) => {
        terminal.question(pertanyaan, (jawaban: string) => {
            resolve(jawaban.trim());
        });
    });
}

// Fungsi untuk mengubah input menjadi angka.
function inputAngka(teks: string): number {
    return Number(teks);
}

// FUNGSI FORMAT

// Fungsi untuk memformat angka menjadi Rupiah.
function formatRupiah(angka: number): string {
    return "Rp" + angka.toLocaleString("id-ID");
}

// Fungsi untuk membuat garis pemisah.
function garis(karakter: string = "-", panjang: number = 50): string {
    return karakter.repeat(panjang);
}

// Fungsi untuk membuat nomor pesanan acak.
function buatNomorPesanan(): string {
    const angka: number = Math.floor(100000 + Math.random() * 900000);
    return "FNB-" + angka;
}

// FUNGSI PERHITUNGAN

// Fungsi untuk menghitung subtotal seluruh item di keranjang.
function hitungSubtotal(): number {
    let subtotal: number = 0;

    for (const item of keranjang) {
        subtotal += item.harga * item.jumlah;
    }

    return subtotal;
}

// Fungsi untuk menghitung jumlah seluruh porsi di keranjang.
function hitungJumlahPorsi(): number {
    let jumlah: number = 0;

    for (const item of keranjang) {
        jumlah += item.jumlah;
    }

    return jumlah;
}

