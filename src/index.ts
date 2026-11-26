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
