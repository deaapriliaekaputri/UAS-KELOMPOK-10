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

// Fungsi untuk menghitung seluruh biaya pesanan.
function hitungRincian(adalahMember: boolean): Rincian {
    const subtotal: number = hitungSubtotal();
    const jumlahPorsi: number = hitungJumlahPorsi();
    let diskonPersen: number = 0;

    // Menentukan diskon berdasarkan status member, subtotal, dan jumlah porsi.
    if (adalahMember) {
        diskonPersen = jumlahPorsi >= 5 ? 15 : 10;
    } else if (subtotal >= 100000) {
        diskonPersen = 5;
    } else {
        diskonPersen = 0;
    }

    const nilaiDiskon: number = Math.round(subtotal * diskonPersen / 100);
    const setelahDiskon: number = subtotal - nilaiDiskon;
    const pajak: number = Math.round(setelahDiskon * TARIF_PAJAK / 100);
    const biayaLayanan: number = setelahDiskon > 0 ? BIAYA_LAYANAN : 0;
    const total: number = setelahDiskon + pajak + biayaLayanan;

    return {
        subtotal,
        diskonPersen,
        nilaiDiskon,
        setelahDiskon,
        pajak,
        biayaLayanan,
        total
    };
}

// Fungsi untuk menampilkan ringkasan biaya.
function tampilkanRincian(rincian: Rincian): void {
    console.log("\n" + garis("-"));
    console.log(`Subtotal        : ${formatRupiah(rincian.subtotal)}`);
    console.log(`Diskon (${rincian.diskonPersen}%).padEnd(16) + : -${formatRupiah(rincian.nilaiDiskon)}`);
    console.log(`Pajak (${TARIF_PAJAK}%).padEnd(16) + : ${formatRupiah(rincian.pajak)}`);
    console.log(`Biaya layanan   : ${formatRupiah(rincian.biayaLayanan)}`);
    console.log(garis("-"));
    console.log(`TOTAL BAYAR     : ${formatRupiah(rincian.total)}`);
    console.log(garis("-"));
}

// PROGRAM UTAMA
// ======================================================

async function main(): Promise<void> {
    let berjalan: boolean = true;

    console.log("\n" + garis("="));
    console.log("  PROGRAM PEMESANAN DAN PEMBAYARAN MAKANAN BIOSKOP");
    console.log(garis("="));

    // Perulangan menu utama sampai pengguna memilih keluar.
    while (berjalan) {
        console.log("\n=========== MENU UTAMA ===========");
        console.log("1. Lihat daftar menu");
        console.log("2. Tambah pesanan");
        console.log("3. Lihat keranjang");
        console.log("4. Ubah jumlah pesanan");
        console.log("5. Hapus pesanan");
        console.log("6. Checkout dan bayar");
        console.log("7. Lihat detail menu (berdasarkan kode)");
        console.log("8. Cari menu (kata kunci dan filter)");
        console.log("0. Keluar");

        const pilihan: string = await tanya("Pilih menu (0-8): ");

        switch (pilihan) {
            case "1":
                // Fitur belum tersedia, akan dibuat pada Progress 4.
                console.log("Fitur ini belum tersedia (Progress 4).");
                break;

            case "2":
                // Fitur belum tersedia, akan dibuat pada Progress 3.
                console.log("Fitur ini belum tersedia (Progress 3).");
                break;

            case "3":
                // Fitur belum tersedia, akan dibuat pada Progress 4.
                console.log("Fitur ini belum tersedia (Progress 4).");
                break;

            case "4":
                // Fitur belum tersedia, akan dibuat pada Progress 5.
                console.log("Fitur ini belum tersedia (Progress 5).");
                break;

            case "5":
                // Fitur belum tersedia, akan dibuat pada Progress 5.
                console.log("Fitur ini belum tersedia (Progress 5).");
                break;

            case "6":
                // Fitur belum tersedia, akan dibuat pada Progress 6.
                console.log("Fitur ini belum tersedia (Progress 6).");
                break;

            case "7":
                // Fitur belum tersedia, akan dibuat pada Progress 4.
                console.log("Fitur ini belum tersedia (Progress 4).");
                break;

            case "8":
                // Fitur belum tersedia, akan dibuat pada Progress 6.
                console.log("Fitur ini belum tersedia (Progress 6).");
                break;

            case "0":
                if (keranjang.length > 0) {
                    const yakin: string = (
                        await tanya("Keranjang belum dibayar. Yakin keluar? (ya/tidak): ")
                    ).toLowerCase();

                    if (yakin !== "ya") {
                        break;
                    }
                }
                berjalan = false;
                break;

            default:
                console.log("Pilihan menu tidak valid.");
                break;
        }
    }

    console.log("\nTerima kasih telah menggunakan program ini.");
    terminal.close();
}

// Menjalankan fungsi utama dan menangani kesalahan.
main().catch((error: unknown) => {
    console.error("Terjadi kesalahan:", error);
    terminal.close();
});

interface HasilValidasi {
    valid: boolean;
    pesan: string;
}

// Fungsi untuk memeriksa bahwa teks yang diinput tidak kosong.
// Parameter : teks (isi input), namaField (nama kolom untuk pesan error).
// Return    : HasilValidasi.
function validasiTeksTidakKosong(teks: string, namaField: string): HasilValidasi {
    // trim() membuang spasi di awal/akhir, sehingga "   " juga dianggap kosong.
    if (teks.trim() === "") {
        return { valid: false, pesan: `${namaField} tidak boleh kosong.` };
    }

    return { valid: true, pesan: "" };
}

// Fungsi untuk memvalidasi jumlah pesanan terhadap stok yang tersedia.
// Pemeriksaan dilakukan berurutan dan berhenti di kesalahan pertama:
// kosong -> bukan angka -> negatif -> bukan bilangan bulat/nol -> melebihi stok.
// Parameter : teks (input jumlah), stokTersedia (batas maksimal jumlah).
// Return    : HasilValidasi.
function validasiJumlah(teks: string, stokTersedia: number): HasilValidasi {
    // 1. Tolak input kosong.
    if (teks.trim() === "") {
        return { valid: false, pesan: "Jumlah tidak boleh kosong." };
    }

    // Ubah teks menjadi angka; hasilnya NaN jika teks bukan angka (misal "abc").
    const angka: number = inputAngka(teks);

    // 2. Tolak input yang bukan angka.
    if (isNaN(angka)) {
        return { valid: false, pesan: "Jumlah harus berupa angka." };
    }

    // 3. Tolak nilai negatif.
    if (angka < 0) {
        return { valid: false, pesan: "Jumlah tidak boleh negatif." };
    }

    // 4. Tolak desimal (misal 1.5) atau nol; jumlah harus bilangan bulat minimal 1.
    //    Memakai dua kondisi digabung dengan operator logika ATAU (||) dan NOT (!).
    if (!Number.isInteger(angka) || angka === 0) {
        return { valid: false, pesan: "Jumlah harus bilangan bulat minimal 1." };
    }

    // 5. Tolak jumlah yang melebihi stok menu.
    if (angka > stokTersedia) {
        return { valid: false, pesan: `Jumlah melebihi stok (tersedia: ${stokTersedia}).` };
    }

    // Lolos semua pemeriksaan.
    return { valid: true, pesan: "" };
}

// Fungsi untuk bertanya ya/tidak dan mengulang sampai jawaban valid.
// Parameter : pertanyaan (teks yang ditampilkan ke pengguna).
// Return    : true jika menjawab y/ya, false jika menjawab n/tidak.
async function tanyaYaTidak(pertanyaan: string): Promise<boolean> {
    let jawabanValid: boolean = false;
    let hasil: boolean = false;

    // Ulangi pertanyaan sampai pengguna menjawab y atau n.
    while (!jawabanValid) {
        const jawaban: string = (await tanya(pertanyaan)).toLowerCase();

        if (jawaban === "y" || jawaban === "ya") {
            hasil = true;
            jawabanValid = true;
        } else if (jawaban === "n" || jawaban === "tidak") {
            hasil = false;
            jawabanValid = true;
        } else {
            // Jawaban lain ditolak, pertanyaan diulang pada putaran berikutnya.
            console.log("Jawaban tidak valid. Ketik y atau n.");
        }
    }

    return hasil;
}

// Fungsi untuk mencari menu berdasarkan kode (tidak peka huruf besar/kecil).
// Parameter : kode (misal "m01" atau "M01").
// Return    : objek MenuItem jika ditemukan, undefined jika tidak ada.
function cariMenuByKode(kode: string): MenuItem | undefined {
    // toUpperCase() membuat "m01" tetap cocok dengan kode "M01" di daftarMenu.
    return daftarMenu.find((menu) => menu.kode === kode.toUpperCase());
}

// Fungsi untuk memeriksa duplikasi ID (kode menu) di keranjang.
// Parameter : kode (kode menu yang akan ditambahkan).
// Return    : true jika kode sudah ada di keranjang, false jika belum.
function apakahKodeSudahAdaDiKeranjang(kode: string): boolean {
    // findIndex mengembalikan -1 jika tidak ada item yang cocok.
    return keranjang.findIndex((item) => item.kode === kode) !== -1;
}

// Fungsi untuk menambahkan item baru ke keranjang (operasi Create).
// Parameter : menu (menu yang dipilih), jumlah (jumlah porsi yang sudah tervalidasi).
// Return    : item yang baru disimpan, agar bisa ditampilkan sebagai konfirmasi.
function tambahKeKeranjang(menu: MenuItem, jumlah: number): ItemKeranjang {
    // Menyalin data yang dibutuhkan dari menu ke bentuk item keranjang.
    const itemBaru: ItemKeranjang = {
        kode: menu.kode,
        nama: menu.nama,
        harga: menu.harga,
        jumlah: jumlah
    };

    // push() menambahkan item baru ke akhir array keranjang.
    keranjang.push(itemBaru);
    return itemBaru;
}

// Fungsi untuk menghitung subtotal satu item (harga x jumlah).
function hitungSubtotalItem(item: ItemKeranjang): number {
    return item.harga * item.jumlah;
}

// Fungsi untuk menampilkan daftar kode menu ringkas sebagai panduan input.
// (Tampilan daftar menu lengkap dibuat pada Progress 4.)
function tampilkanPilihanKode(): void {
    console.log("\nKode menu yang tersedia:");

    // Perulangan for...of untuk menampilkan setiap menu satu per satu.
    for (const menu of daftarMenu) {
        // padEnd() merapikan kolom agar sejajar.
        console.log(
            `  ${menu.kode.padEnd(4)} ${menu.nama.padEnd(24)} ${formatRupiah(menu.harga).padEnd(10)} (stok: ${menu.stok})`
        );
    }
}

// Fungsi untuk menampilkan pesan konfirmasi setelah item berhasil ditambahkan.
function tampilkanItemDitambahkan(item: ItemKeranjang): void {
    console.log(`Berhasil menambahkan ${item.jumlah} x ${item.nama} (${formatRupiah(hitungSubtotalItem(item))}).`);
}

// Fungsi untuk menampilkan ringkasan singkat isi keranjang.
// (Tampilan keranjang lengkap dibuat pada Progress 4.)
function tampilkanRingkasanKeranjang(): void {
    console.log(`\nIsi keranjang: ${keranjang.length} jenis item | Subtotal: ${formatRupiah(hitungSubtotal())}`);
}
